import ServerFlow from '../Flows/Server/ServerFlow';
import { SlackRepository, Slack } from '@services'

export default class DeployNotificationController {
  static async create(req, res) {
    const { body } = req;
    const flow = new ServerFlow(body);

    const flowName = flow.constructor.name;

    console.log(`Start: ${flowName}`)
    try {
      await flow.run()
    } catch (e) {
      Slack.getInstance().sendDirectMessage({
        message: 'deploy notification ' + JSON.stringify(body),
        username: SlackRepository.getAdminSlackUser()
      });
    }
    console.log(`End: ${flowName}`)

    res.sendStatus(200);
  }
}