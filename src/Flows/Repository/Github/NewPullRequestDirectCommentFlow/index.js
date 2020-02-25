import { SlackRepository, ChannelMessage } from '@services'
import {  PullRequest } from '@models';
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

    const mention = message.match(/@[a-zA-Z0-9]+/)

    const channelMessage = new ChannelMessage(channel, slackThreadTS);
    if (mention) {
      const slackUsername = SlackRepository.getSlackUser(mention[0].replace('@', ''))
      channelMessage.notifyNewMessage(`@${slackUsername}`);
    }
  };

  static async isFlow(json) {
    return json.action === 'created' && json.comment;
  };
}

export default NewPullRequestDirectComment;