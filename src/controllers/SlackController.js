import RepositoryFlow from '../Flows/Repository/RepositoryFlow'
import TaskManagerFlow from '../Flows/TaskManager/TaskManagerFlow'

export default class SlackController {
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

    let message;
    let stop = false;

    if (!Flow) {
      stop = true;
      message = 'Please enter valid instructions.'
    }

    if (!stop) {
      message = await Flow.getSlackResponse(json);
      stop = !!message;
    }

    if (!stop) {
      const flowName = Flow.name;
      message = 'ok'

      console.log(`Start: ${flowName}`)
      if (typeof Flow.start !== "undefined") {
        Flow.start(json)
      } else {
        const flow = new Flow(json);
        flow.run();
      }
    }

    const blocks = {
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": message,
          }
        }
      ]
    }
    res.send(blocks);
  }
}