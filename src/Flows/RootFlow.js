import { FlowNotFoundError } from '@errors';

class RootFlow {
  constructor(data) {
    this.data = data;
  }

  run() {
    this.getFlow().run();
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

    throw new FlowNotFoundError(this.data);
  }
};

export default RootFlow;