import { BaseModel } from '@models';
import axios from 'axios'

class SlackMessage extends BaseModel {
  static collectionName = 'slackMessages';

  static async findByPRId(prId, repository) {
    const result = await axios.get(`http://roadrunner-rails.herokuapp.com/slack_messages/${prId}/${repository}`);
    const { data } = result;
    const d = {
      ...data,
      ghId: data.pull_request_id
    }
    return new SlackMessage(d)
  }

  toJson() {
    return {
      prId: this.prId,
      ts: this.ts,
    };
  }
};

export default SlackMessage;