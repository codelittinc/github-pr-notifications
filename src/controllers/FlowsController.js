import RepositoryFlow from '../Flows/Repository/RepositoryFlow';
import TaskManagerFlow from '../Flows/TaskManager/TaskManagerFlow';

export default class FlowsController {
  static async create(req, res) {
    const json = req.body;
    const baseFlows = [RepositoryFlow, TaskManagerFlow];
    let Flow = null;

    for (const F of baseFlows) {
      const instance = new F(json);
      const f = await instance.getFlow(json)

      if (f) {
        Flow = f;
      }
    }

    console.log(Flow)
    if (!Flow) {
      res.sendStatus(200)
      return;
    }

    const flowName = Flow.name;
    console.log(`Start: ${flowName}`)
    if (Flow.start) {
      Flow.start(json)
    } else {
      const f = new Flow(json)
      await f.run(json)
    }
    console.log(`End: ${flowName}`)

    res.sendStatus(200)
  }
}