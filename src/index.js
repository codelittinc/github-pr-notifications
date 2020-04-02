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

import Jira from './services/Jira';

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


app.get('/jira/:size?', async (req, res) => {
  const listSize = req.params.size || 10

//  const projects = await Jira.listProjects();
//  let ids = projects.map(p => p.key)
 // console.log('ids', ids)
  //ids = [ids[0]];
  const ids = [
    'ARW',
    'AYAPI',
    'AYI',
    'AYPI',
    'HUB'
  ]
  let issues = []
  for (let i = 0; i < ids.length; i++) {
    const key = ids[i];
    const result = await Jira.getProjectIssues(ids[i])
    issues.push(result);
  }

  issues = issues.flat();

  function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

  const data = shuffle(issues).splice(0, listSize).map(issue => {
    const { key, fields } = issue;
    const { status } = fields;

    return {
      link: `https://codelitt.atlassian.net/browse/${key}`,
      status: status.name
    }
  })

  res.send({
    status: 200,
    length: data.length,
    data
  })
})

app.post('/slack-actions', async (req, res) => {
  const json = req.body;
  const Flow = await GithubFlow.getFlow(json)

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
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
