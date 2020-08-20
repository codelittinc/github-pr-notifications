import NewPullRequestFlow from './NewPullRequestFlow';
import ClosePullRequestFlow from './ClosePullRequestFlow';
import SendChangelogFlow from './SendChangelogFlow';
import ReleaseFlow from './ReleaseFlow';
import RepositoryDiffFlow from './RepositoryDiffFlow';

class GithubFlow {
  constructor(data) {
    this.data = data;
  }

  async getFlow() {
    const flows = [
      NewPullRequestFlow,
      ClosePullRequestFlow,
      SendChangelogFlow,
      ReleaseFlow,
      RepositoryDiffFlow,
    ];

    for (const F of flows) {
      if (await F.isFlow(this.data)) {
        return F;
      }
    }
  };
}

export default GithubFlow;