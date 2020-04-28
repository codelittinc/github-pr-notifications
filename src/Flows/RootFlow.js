import { FlowNotFoundError } from '@errors';

class RootFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const flow = await this.getFlow();
    flow.run()
  }

  async getFlow() {
    const flows = this.getFlows();
    for (const F of flows) {
      const instance = new F(this.data);
      const flow = await instance.getFlow();
      if (flow) {
        return flow;
      }
    }
  }
};

export default RootFlow;