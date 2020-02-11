import { SlackRepository, Slack } from '@services'

class NotifyFigmaCommentFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { app, figmaComment, author, fileUrl } = this.data;
    const slackRepository = SlackRepository.getRepositoryData(app);
    const { channel } = slackRepository;

    return await Slack.getInstance().sendMessage({
      message:`*Figma*: There is a new comment from ${author} on ${fileUrl}: ${figmaComment}`,
      channel: channel,
    });
  };

  isFlow() {
    return !!this.data.figmaComment;
  };
}

export default NotifyFigmaCommentFlow;
