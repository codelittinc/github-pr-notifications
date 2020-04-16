import {Slack, SlackRepository} from '@services';

export default class JiraIssueNotificationFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { comment, issue } = this.data;
    const { body } = comment;
    const { key } = issue;

    const jiraMentions = []
    const mentionRegex = new RegExp(/\[~accountid:([a-z0-9]+)\]/g);
    let z;
    while (null != (z = mentionRegex.exec(body))) {
      jiraMentions.push(z[1])
    }

    const slackMentions = jiraMentions.map(jiraMention => SlackRepository.getSlackUserFromJira(jiraMention)).filter(Boolean)
    slackMentions.forEach(mention => {
      const text = `Hey there is a new mention for you on Jira https://codelitt.atlassian.net/browse/${key}`;
      Slack.getInstance().sendDirectMessage({
        message: `Here is your Jira spotcheck! \n ${text}`,
        username: mention
      });
    })
  };

  isFlow() {
    const { webhookEvent } = this.data;
    return webhookEvent === 'comment_created';
  };
}