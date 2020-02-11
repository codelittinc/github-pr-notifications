import FigmaFlow from './Figma/FigmaFlow';
import { FlowNotFoundError } from '@errors';

class DesignFlow {
  constructor(data) {
    this.data = data;
  }

  run() {
    this.getFlow().run();
  }

  getFlow() {
    const flows = [FigmaFlow];
    const flow = flows.map(F => {
      const instance = new F(this.data);
      return instance.getFlow();
    }).filter(a => a)[0];

    if (flow) {
      return flow;
    }

    throw new FlowNotFoundError(this.data);
  }
};

export default DesignFlow;
