import { BaseModel } from './index.js';

class CheckRun extends BaseModel {
  static collectionName = 'checkRuns';

  async createOrLoadByCommitSha() {
    const checkRun = await CheckRun.findBy({
      commitSha: this.commitSha,
    });

    if (checkRun) {
      checkRun.state = this.state;
      await checkRun.update();
      return checkRun;
    }

    return await this.create()
  }

  static async findLastStateForCommits(commitsSha) {
    const query = commitsSha.map(s => ({ commitSha: s }))
    let checkRuns = await CheckRun.list({ $or: query })
    if (checkRuns.length === 0) {
      return null;
    }
    checkRuns = checkRuns.sort((a, b) => b.createdAt - a.createdAt)


    return checkRuns[0];
  };

  toJson() {
    return {
      state: this.state,
      createdAt: this.createdAt,
      commitSha: this.commitSha
    };
  }
};

export default CheckRun;