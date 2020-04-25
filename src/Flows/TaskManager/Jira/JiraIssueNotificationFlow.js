import {Slack, SlackRepository, Users} from '@services';

export default class JiraIssueNotificationFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { comment, issue } = this.data;
    const { body } = comment;
    const { key } = issue;

    const mentionRegex = new RegExp(/\[~accountid:([a-z0-9]+)\]/g);
    let z;
    const slackMentions = []
    while (null != (z = mentionRegex.exec(body))) {
      const jiraUsername = z[1];
      const user = await Users.find(jiraUsername)
      if (user) {
        slackMentions.push(user.slack)
      }
    }

    slackMentions.forEach(mention => {
      const text = `Hey there is a new mention for you on Jira https://codelitt.atlassian.net/browse/${key}`;
      Slack.getInstance().sendDirectMessage({
        message: text,
        username: mention
      });
    })
  };

  isFlow() {
    const { webhookEvent } = this.data;
    return webhookEvent === 'comment_created';
  };
}