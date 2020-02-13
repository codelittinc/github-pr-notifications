import moment from 'moment';

import { BaseModel } from '@models';

class FigmaComment extends BaseModel {
  static collectionName = 'figmaComments';

  static async getLatestCommentByFile(fileKey) {
    return FigmaComment.findBy({ fileKey: fileKey }, { sort: { createdAt : -1 } });
  }

  toJson() {
    return {
      author: this.author,
      fileKey: this.fileKey,
      fileName: this.fileName,
      message: this.message,
      project: this.project,
      figmaCreatedAt: this.figmaCreatedAt,
    };
  }
};

export default FigmaComment;
