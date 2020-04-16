import { Jira, Slack } from '@services'

class SendRandomJiraIssuesFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { size = 5, user_name } = this.data

    //  const projects = await Jira.listProjects();
    //  let ids = projects.map(p => p.key)
    //  console.log('ids', ids)
    //  ids = [ids[0]];

    const ids = [
      'ARW',
      'AYAPI',
      'AYI',
      'AYPI',
      'HUB'
    ];

    let issues = []
    for (let i = 0; i < ids.length; i++) {
      const key = ids[i];
      const result = await Jira.getProjectIssues(key)
      issues.push(result);
    }

    issues = issues.flat();

    function shuffle(a) {
      var j, x, i;
      for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
      }
      return a;
    }

    const data = shuffle(issues).splice(0, size).map(issue => {
      const { key, fields } = issue;
      const { status } = fields;

      return {
        link: `https://codelitt.atlassian.net/browse/${key}`,
        status: status.name
      }
    })

    const message = data.map((i, n) => (
      `${n + 1}. ${i.link}`
    )).join('\n');

    Slack.getInstance().sendDirectMessage({
      message: `Here is your Jira spotcheck! \n ${message}`,
      username: user_name
    });
  };

  isFlow() {
    const { text } = this.data;
    if (!text) {
      return;
    }
    const [action] = text.split(' ');
    return action === 'spotcheck';
  };

  getSlackResponse() {
    return null;
  }

  static getSlackResponse() {
    return null;
  }
}

export default SendRandomJiraIssuesFlow;