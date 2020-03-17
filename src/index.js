import dotenv from 'dotenv'
dotenv.config()

import bodyParser from 'body-parser';
import express from 'express';
import { PullRequest } from './models';
import GithubFlow from './Flows/Repository/Github/GithubFlow';
import ReleaseFlow from './Flows/Repository/Github/ReleaseFlow';
import { SlackRepository } from './services'
import {
  HomeController,
  DeployNotificationController,
  PullRequestsController
} from './controllers';

import addTestEndpoints from './addTestEndpoints';

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const PORT = process.env.PORT || 3000

app.get('/', HomeController.index)
app.post('/notify-deploy', DeployNotificationController.create);
app.get(`/open-prs/:devGroup?`, PullRequestsController.index)

const processFlowRequest = async (req, res) => {
  const json = req.body;

  const Flow = await GithubFlow.getFlow(json)

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

addTestEndpoints(app, processFlowRequest);

app.post('/', (req, res) => {
  processFlowRequest(req, res)
})

app.post('/deploy', async (req, res) => {
  const json = req.body;
  const Flow = ReleaseFlow;

  const flowName = Flow.name;
  console.log(`Start: ${flowName}`)
  const repositoryData = SlackRepository.getRepositoryDataByDeployChannel(json.channel_name);
  let message;

  let stop;
  if (repositoryData && repositoryData.supports_deploy) {
    message = 'ok';
  } else {
    message = "This channel doesn't support automatic deploys";
    stop = true;
  }

  if (json.text !== 'update qa' && json.text !== 'update prod') {
    stop = true;
    message = 'Please enter valid instructions.'
  }

  if (!stop) {
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
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
