import { Slack } from '@services'

class NotifyFigmaCommentFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { channel, comment, file } = this.data;

    return await Slack.getInstance().sendMessage({
      message:
        `*Figma*: There is a new comment from ${comment.author} on the file ${file.name}: ${comment.message} \nlink: ${file.url}`,
      channel: channel,
    });
  };

  isFlow() {
    return !!this.data.comment;
  };
}

export default NotifyFigmaCommentFlow;
