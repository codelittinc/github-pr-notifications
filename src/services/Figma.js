import moment from 'moment';

import FigmaClient from '@client/figma';
import FigmaRepository from '@services/FigmaRepository';

import { FigmaComment } from '@models';

class Figma {
  constructor() {
    this.figmaClient = new FigmaClient({
      token: process.env.FIGMA_API_KEY,
    });
  }

  getProjects() {
    return FigmaRepository.data;
  }

  async getProjectsFiles() {
    const projectsInfo = this.getProjects();

    const files = Object.keys(projectsInfo).map(async (projectName) => {
      const projectFiles = await this.figmaClient.listProjectFiles(projectsInfo[projectName].id);
      return projectFiles.files.map(file => ({
        file: {
          ...file,
          url: `https://www.figma.com/file/${file.key}`,
        },
        project: projectName,
        ...projectsInfo[projectName],
      }));
    });

    return Promise.all(files).then(files => files.flat());
  }

  async saveComments(comments) {
    const figmaComments = comments.map((comment) => ({
      author: comment.comment.author,
      fileKey: comment.file.key,
      fileName: comment.file.name,
      message: comment.comment.message,
      project: comment.project,
      createdAt: comment.comment.createdAt,
    }));

    return FigmaComment.insertMany(figmaComments);
  }

  async removeOldComments(fileKey, comments) {
    const lastComment = await FigmaComment.getLatestCommentByFile(fileKey);
    let newComments = comments;
    if (lastComment) {
      const lastCommentDate = moment(lastComment.createdAt);
      newComments = newComments.filter(
        (comment) => lastCommentDate.isBefore(moment(comment.created_at)),
      );
    }

    return newComments;
  }

  async getFilesComments() {
    const files = await this.getProjectsFiles();
    const comments = files.map(async ({ file, ...projectInfo }) => {
      const fileComments = await this.figmaClient.listComments(file.key);
      const newComments = await this.removeOldComments(file.key, fileComments.comments);


      return newComments.map(comment => ({
        file,
        comment: {
          author: comment.user.handle,
          message: comment.message,
          createdAt: moment(comment.created_at).toDate().getTime(),
        },
        ...projectInfo,
      }));
    }).flat();

    return Promise.all(comments).then(async (comments) => {
      const flatCommentsList = comments.flat();
      if (flatCommentsList.length > 0) await this.saveComments(flatCommentsList);

      return flatCommentsList;
    });
  }
}

export default Figma;
