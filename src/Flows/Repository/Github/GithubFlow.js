import NewPullRequestFlow from './NewPullRequestFlow';
import ClosePullRequestFlow from './ClosePullRequestFlow';
import NewReviewSubmissionFlow from './NewReviewSubmissionFlow';
import SendChangelogFlow from './SendChangelogFlow';
import CheckRunFlow from './CheckRunFlow';
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
      NewReviewSubmissionFlow,
      SendChangelogFlow,
      CheckRunFlow,
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