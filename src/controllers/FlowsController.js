import RepositoryFlow from '../Flows/Repository/RepositoryFlow';
import TaskManagerFlow from '../Flows/TaskManager/TaskManagerFlow';
import Request from '../models/Request';

export default class FlowsController {
  static async create(req, res) {
    const json = req.body;
    const baseFlows = [RepositoryFlow, TaskManagerFlow];
    let Flow = null;
    const request = new Request({
      data: json
    });

    for (const F of baseFlows) {
      const instance = new F(json);
      const f = await instance.getFlow(json)

      if (f) {
        Flow = f;
      }
    }

    if (!Flow) {
      await request.create()
      res.sendStatus(200)
      return;
    }

    const flowName = Flow.name;
    request.flow = flowName;

    console.log(`Start: ${flowName}`)
    try {
      if (Flow.start) {
        await Flow.start(json)
      } else {
        const f = new Flow(json)
        await f.run(json)
      }
      request.processed = true;
      request.create()
      console.log(`End: ${flowName}`)
    } catch (e) {
      console.log("THERE IS AN ERROR")
      request.processed = false;
      request.error = e.toString();
      request.create()
      console.log(`End: ${flowName}`)
    }

    res.sendStatus(200)
  }

  static async show(req, res) {
    const requestId = req.params.id;
    const request = await Request.findById(requestId);
    const json = request.data;
    const baseFlows = [RepositoryFlow, TaskManagerFlow];
    let Flow = null;

    for (const F of baseFlows) {
      const instance = new F(json);
      const f = await instance.getFlow(json)

      if (f) {
        Flow = f;
      }
    }

    if (!Flow) {
      await request.create()
      res.sendStatus(200)
      return;
    }

    const flowName = Flow.name;
    request.flow = flowName;

    console.log(`Start: ${flowName}`)
    if (Flow.start) {
      await Flow.start(json)
    } else {
      const f = new Flow(json)
      await f.run(json)
    }
    console.log(`End: ${flowName}`)

    res.sendStatus(200)
  }
}