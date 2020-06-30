import SlackNotificationsClient from '@codelittinc/slack-notifications-client';

class Slack {
  static getInstance() {
    if (!Slack.client) {
      Slack.client = new SlackNotificationsClient({
        bot: 'roadrunner',
        apiURI: process.env.SLACK_API_URL,
        apiKey: process.env.SLACK_API_KEY,
      });
    }

    return Slack.client;
  }
}

export default Slack;