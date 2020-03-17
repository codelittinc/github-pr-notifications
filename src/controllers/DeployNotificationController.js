import ServerFlow from '../Flows/Server/ServerFlow';

export default class DeployNotificationController {
  static async create(req, res) {
    const { body } = req;
    const flow = new ServerFlow(body);

    const flowName = flow.constructor.name;

    console.log(`Start: ${flowName}`)
    flow.run()
    console.log(`End: ${flowName}`)

    res.sendStatus(200);
  }
}