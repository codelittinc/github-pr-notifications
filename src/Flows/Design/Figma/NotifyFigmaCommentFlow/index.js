import { SlackRepository, Slack } from '@services'

class NotifyFigmaCommentFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { app, figmaComment } = this.data;
    const slackRepository = SlackRepository.getRepositoryData(app);
    const { channel } = slackRepository;

    return await Slack.getInstance().sendMessage({
      message:`There is a new comment on figma: ${figmaComment}`,
      channel: channel,
    });
  };

  isFlow() {
    return !!this.data.figmaComment;
  };
}

export default NotifyFigmaCommentFlow;
