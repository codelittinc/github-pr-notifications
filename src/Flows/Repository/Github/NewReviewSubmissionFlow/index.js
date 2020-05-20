import { Repositories, ChannelMessage, Github, DirectMessage } from '@services'
import { PullRequestReview, PullRequest } from '@models';
import pullRequestParser from '../parsers/pullRequestParser'

const getContent = (json) => (
  {
    state: json.review.state,
    message: json.review.body,
    username: json.review.user.login
  }
);

class NewReviewSubmissionFlow {
  static async start(json) {
    const pr = await new PullRequest(pullRequestParser.parse(json)).load();

    const content = getContent(json);
    const { message, state, username } = content;
    const mainSlackMessage = await pr.getMainSlackMessage();

    if (!mainSlackMessage) {
      console.log('Flow aborted!', 'no message found')
      return;
    }

    await new PullRequestReview({
      prId: pr.id,
      username,
      state 
    }).createOrLoadByUsernameAndPR()

    const slackThreadTS = mainSlackMessage.ts;
    const repositoryData = await Repositories.getRepositoryData(pr.repositoryName)
    const { channel } = repositoryData;

    const channelMessage = new ChannelMessage(channel, slackThreadTS);
    if (state === 'changes_requested') {
      channelMessage.notifyChangesRequest();
    } else if (message !== '') {
      channelMessage.notifyNewMessage();
    } else {
      const ghPR = await Github.getPullRequest({
        owner: pr.owner,
        repository: pr.repositoryName,
        pullRequestId: pr.ghId
      })

      if (!ghPR.mergeable && ghPR.mergeable_state === 'dirty') {
        const directMessage = new DirectMessage(pr.username)
        directMessage.notifyPRConflicts(pr)
      }
    }
  };

  static async isFlow(json) {
    return json.action === 'submitted';
  };
}

export default NewReviewSubmissionFlow;