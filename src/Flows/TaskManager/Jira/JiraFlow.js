import JiraIssueNotificationFlow from './JiraIssueNotificationFlow';

class JiraFlow {
  constructor(data) {
    this.data = data;
  }

  async getFlow() {
    const flows = [
      JiraIssueNotificationFlow
    ];

    for (const F of flows) {
      const instance = new F(this.data);
      if (await instance.isFlow()) {
        return F;
      }
    }
  };
}

export default JiraFlow;