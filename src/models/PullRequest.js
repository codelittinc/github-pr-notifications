import Database from '../services/Database.js';
import { BaseModel, SlackMessage, PullRequestReview, PullRequestChange } from './index.js';

class PullRequest extends BaseModel {
  static collectionName = 'pullRequests';

  isDeployPR() {
    return (this.baseBranchName === 'qa' || this.baseBranchName === 'master') && (this.branchName === 'develop' || this.branchName === 'qa' || this.branchName === 'dev')
  }

  isClosed() {
    return !!this.closedAt;
  }

  async getMainSlackMessage() {
    this.mainSlackMessage = await SlackMessage.findByPRId(this.id)
    return this.mainSlackMessage;
  }

  async getReviews() {
    this.reviews = await PullRequestReview.findByPRId(this.id)
    return this.reviews;
  }

  async getChanges() {
    this.changes = await PullRequestChange.findByPRId(this.id)
    return this.changes;
  }

  async close() {
    this.closedAt = Date.now();
    await this.update();
  }

  async load() {
    const collection = await Database.getCollection(PullRequest.collectionName);
    const pr = await collection.findOne({
      branchName: this.branchName,
      ghId: this.ghId,
      repositoryName: this.repositoryName,
    });

    if (pr) {
      this.id = pr._id.toString()
      this.createdAt = pr.createdAt;
      this.closedAt = pr.closedAt;
    }
    return this;
  }

  async updateCIState(state) {
    this.ciState = state;
    await this.update()
  }

  toJson() {
    return {
      branchName: this.branchName,
      baseBranchName: this.baseBranchName,
      link: this.link,
      ghId: this.ghId,
      repositoryName: this.repositoryName,
      title: this.title,
      draft: this.draft,
      state: this.state,
      owner: this.owner,
      createdAt: this.createdAt,
      closedAt: this.closedAt,
      ciState: this.ciState,
      username: this.username
    }
  }
};

export default PullRequest;