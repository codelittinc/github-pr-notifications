import { BaseModel } from './index.js';

class Commit extends BaseModel {
  static collectionName = 'commits';

  toJson() {
    return {
      prId: this.prId,
      sha: this.sha,
      message: this.message,
      createdAt: this.createdAt,
      authorName: this.authorName,
      authorEmail: this.authorEmail
    }
  }
};

export default Commit;