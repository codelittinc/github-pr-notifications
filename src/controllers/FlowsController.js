import RepositoryFlow from '../Flows/Repository/RepositoryFlow';

export default class FlowsController {
  static async create(req, res) {
    const json = req.body;
    const instance = new RepositoryFlow(json);

    const Flow = await instance.getFlow(json)

    if (!Flow) {
      res.sendStatus(200)
      return;
    }

    const flowName = Flow.name;
    console.log(`Start: ${flowName}`)
    await Flow.start(json)
    console.log(`End: ${flowName}`)

    res.sendStatus(200)
  }
}