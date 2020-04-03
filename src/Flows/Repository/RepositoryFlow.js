import GithubFlow from './Github/GithubFlow';
import { FlowNotFoundError } from '@errors';

class ServerFlow {
  constructor(data) {
    this.data = data;
  }

  run() {
    this.getFlow().run();
  }

  async getFlow() {
    const flows = [GithubFlow];
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

export default ServerFlow;