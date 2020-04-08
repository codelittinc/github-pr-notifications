import { BaseModel } from './index.js';

class PullRequestReview extends BaseModel {
  static collectionName = 'pullRequestsReviews';

  static async findByPRId(prId) {
    return await PullRequestReview.list({ prId });
  }

  async createOrLoadByUsernameAndPR() {
    const pullRequestReview = await PullRequestReview.findBy({ prId: this.prId, username: this.username });

    if (pullRequestReview) {
      pullRequestReview.state = this.state;
      await pullRequestReview.update();
      return pullRequestReview;
    }

    return await this.create()
  }

  toJson() {
    return {
      createdAt: this.createdAt,
      prId: this.prId,
      state: this.state,
      username: this.username,
      updatedAt: this.updatedAt,
    }
  }
};

export default PullRequestReview;