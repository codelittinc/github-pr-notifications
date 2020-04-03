import SendRandomJiraIssuesFlow from './SendRandomJiraIssuesFlow';

class JiraFlow {
  constructor(data) {
    this.data = data;
  }

  async getFlow() {
    const flows = [
      SendRandomJiraIssuesFlow,
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