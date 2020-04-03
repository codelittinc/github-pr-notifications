import RepositoryFlow from '../Flows/Repository/RepositoryFlow'
import { SlackRepository } from '../services'

export default class SlackController {
  static async create(req, res) {
    const json = req.body;

    const instance = new RepositoryFlow(json);
    const Flow = await instance.getFlow(json)

    const repositoryData = SlackRepository.getRepositoryDataByDeployChannel(json.channel_name);
    let message;

    let stop;

    if (repositoryData && repositoryData.supports_deploy) {
      message = 'ok';
    } else {
      message = "This channel doesn't support automatic deploys";
      stop = true;
    }

    if (!Flow) {
      stop = true;
      message = 'Please enter valid instructions.'
    }


    if (!stop) {
      const flowName = Flow.name;

      console.log(`Start: ${flowName}`)
      Flow.start(json)
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