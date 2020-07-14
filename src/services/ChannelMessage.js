import Slack from './Slack.js';
import SlackReaction from '../enums/SlackReaction.js';

class ChannelMessage {
  constructor(channel, ts) {
    this.channel = channel;
    this.ts = ts;
  }

  async notifyChangesRequest() {
    const message = `${SlackReaction.warning.forMessage()} changes requested!`;
    return await this.send(message)
  }

  async notifyNewMessage(mention) {
    const begin = mention ? `Hey ${mention}` : SlackReaction.speech_balloon.forMessage();
    const end = mention ? ' for you!' : '!'
    const message = `${begin} There is a new message${end}`;
    return await this.send(message)
  }

  async notifyNewChange() {
    const message = `${SlackReaction.pencil.forMessage()} There is a new change!`;
    return await this.send(message)
  }

  async send(message) {
    return await Slack.getInstance().sendMessage({
      message,
      channel: this.channel,
      ts: this.ts
    });
  }

  async update(message) {
    return await Slack.getInstance().updateMessage({
      message,
      channel: this.channel,
      ts: this.ts
    });
  }
}

export default ChannelMessage;