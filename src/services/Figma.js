import FigmaClient from '@client/figma';
import FigmaRepository from '@services/FigmaRepository';

class Figma {
  getProjects() {
    return FigmaRepository.data;
  }

  async getProjectsFiles() {
    console.log('Listing figma projects\' files');
    const projectsInfo = this.getProjects();
    const figmaClient = new FigmaClient({
      token: process.env.FIGMA_API_KEY,
    });

    const files = Object.keys(projectsInfo).map(async (projectName) => {
      const projectFiles = await figmaClient.listProjectFiles(projectsInfo[projectName].id);
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

  async getFilesComments() {
    const figmaClient = new FigmaClient({
      token: process.env.FIGMA_API_KEY,
    });
    const files = await this.getProjectsFiles();
    console.log('Listing figma files\' comments');
    const comments = files.map(async ({ file, ...projectInfo }) => {
      const fileComments = await figmaClient.listComments(file.key);
      // TODO filter out old comments
      return fileComments.comments.map(comment => ({
        file,
        comment: {
          author: comment.user.handle,
          message: comment.message,
        },
        ...projectInfo,
      }));
      return {};
    }).flat();

    return Promise.all(comments).then(comments => comments.flat());
  }
}

export default Figma;
