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
    if (await NewPullRequestFlow.isFlow(json)) {
      return NewPullRequestFlow;
    } else if (await ClosePullRequestFlow.isFlow(json)) {
      return ClosePullRequestFlow;
    } else if (await NewReviewSubmissionFlow.isFlow(json)) {
      return NewReviewSubmissionFlow;
    } else if (await UpdatePullRequestCodeFlow.isFlow(json)) {
      return UpdatePullRequestCodeFlow;
    } else if (await SendChangelogFlow.isFlow(json)) {
      return SendChangelogFlow;
    } else if (await CheckRunFlow.isFlow(json)) {
      return CheckRunFlow;
    } else if (await ReleaseFlow.isFlow(json)) {
      return ReleaseFlow;
    } else if (await NewPullRequestDirectCommentFlow.isFlow(json)) {
      return NewPullRequestDirectCommentFlow;
    } else if (await RepositoryDiffFlow.isFlow(json)) {
      return RepositoryDiffFlow;
    };
  };
}

export default GithubFlow;