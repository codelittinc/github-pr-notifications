import NewPullRequestFlow from './NewPullRequestFlow';
import ClosePullRequestFlow from './ClosePullRequestFlow';
import UpdatePullRequestCodeFlow from './UpdatePullRequestCodeFlow';
import NewReviewSubmissionFlow from './NewReviewSubmissionFlow';
import SendChangelogFlow from './SendChangelogFlow';
import CheckRunFlow from './CheckRunFlow';
import ReleaseFlow from './ReleaseFlow';
import RepositoryDiffFlow from './RepositoryDiffFlow';
import NewPullRequestDirectCommentFlow from './NewPullRequestDirectCommentFlow';

class GithubFlow {
  static async getFlow(json) {
    const flows = [
      NewPullRequestFlow,
      ClosePullRequestFlow,
      NewReviewSubmissionFlow,
      UpdatePullRequestCodeFlow,
      SendChangelogFlow,
      CheckRunFlow,
      ReleaseFlow,
      NewPullRequestDirectCommentFlow,
      RepositoryDiffFlow,
    ];

    for (const F of flows) {
      if (await F.isFlow(json)) {
        return F;
      }
    }
  };
}

export default GithubFlow;