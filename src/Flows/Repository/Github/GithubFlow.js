import NewPullRequestFlow from './NewPullRequestFlow';
import ClosePullRequestFlow from './ClosePullRequestFlow';
import UpdatePullRequestCodeFlow from './UpdatePullRequestCodeFlow';
import NewReviewSubmissionFlow from './NewReviewSubmissionFlow';
import SendChangelogFlow from './SendChangelogFlow';
import CheckRunFlow from './CheckRunFlow';
import ReleaseFlow from './ReleaseFlow';
import TagReleaseFlow from './TagReleaseFlow';
import RepositoryDiffFlow from './RepositoryDiffFlow';
import NewPullRequestDirectCommentFlow from './NewPullRequestDirectCommentFlow';

class GithubFlow {
  constructor(data) {
    this.data = data;
  }

  async getFlow() {
    const flows = [
      NewPullRequestFlow,
      ClosePullRequestFlow,
      NewReviewSubmissionFlow,
      UpdatePullRequestCodeFlow,
      SendChangelogFlow,
      CheckRunFlow,
      ReleaseFlow,
      TagReleaseFlow,
      NewPullRequestDirectCommentFlow,
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