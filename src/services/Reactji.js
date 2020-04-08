import Slack from './Slack.js';
import SlackReaction from '../enums/SlackReaction.js';

const STATES = {
  ciSuccess: SlackReaction.white_check_mark.simple(),
  ciFailure: SlackReaction.rotating_light.simple(),
  ciPending: SlackReaction.hourglass.simple(),
  flowClosed: SlackReaction.merge.simple()
}

class Reactji {
  constructor(ts, state, channel, type, stateFallBack) {
    this.ts = ts;
    this.state = state || stateFallBack;
    this.channel = channel;
    this.type = type;
  }

  react() {
    if (!this.state) { return; }

    const reactionKey = `${this.type}${this.state[0].toUpperCase()}${this.state.slice(1)}`
    const reaction = STATES[reactionKey]

    Slack.getInstance().sendReaction({
      channel: this.channel,
      reaction,
      ts: this.ts
    });
  }
}

export default Reactji;