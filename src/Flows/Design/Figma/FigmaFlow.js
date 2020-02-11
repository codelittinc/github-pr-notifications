import NotifyFigmaCommentFlow from './NotifyFigmaCommentFlow';

class FigmaFlow {
  constructor(data) {
    this.data = data;
  }

  getFlow() {
    const flows = [NotifyFigmaCommentFlow];
    const Flow = flows.find(F => {
      const instance = new F(this.data);
      return instance.isFlow();
    });

    if (Flow) {
      return new Flow(this.data);
    }
  }
}

export default FigmaFlow;
