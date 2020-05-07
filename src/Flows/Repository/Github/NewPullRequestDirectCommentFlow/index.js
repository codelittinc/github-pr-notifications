import { SlackRepository, ChannelMessage, Users } from '@services'
import { PullRequest } from '@models';
import pullRequestParser from '../parsers/pullRequestParser'

const getContent = (json) => (
  {
    message: json.comment.body,
  }
);

class NewPullRequestDirectComment {
  static async start(json) {
    const pr = await new PullRequest(pullRequestParser.parse(json)).load();

    const { message } = getContent(json);
    const mainSlackMessage = await pr.getMainSlackMessage();

    if (!mainSlackMessage) {
      console.log('Flow aborted!', 'no message found')
      return;
    }

    const slackThreadTS = mainSlackMessage.ts;
    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)
    const { channel } = repositoryData;

    const mentions = message.match(/@[a-zA-Z0-9]+/g)

    const channelMessage = new ChannelMessage(channel, slackThreadTS);
    if (mentions) {
      for (let mention of mentions) {
        const githubUsername = mention.replace('@', '');
        const user = await Users.find(githubUsername);
        if (user) {
          channelMessage.notifyNewMessage(`@${user.slack}`);
        }
      }
    }
  };

  static async isFlow(json) {
    return json.action === 'created' && json.comment;
  };
}

export default NewPullRequestDirectComment;