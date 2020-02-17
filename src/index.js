import dotenv from 'dotenv'
dotenv.config()

import bodyParser from 'body-parser';
import express from 'express';
import { PullRequest } from './models';
import DesignFlow from './Flows/Design/DesignFlow';
import GithubFlow from './Flows/Repository/Github/GithubFlow';
import ReleaseFlow from './Flows/Repository/Github/ReleaseFlow';
import ServerFlow from './Flows/Server/ServerFlow';

import addTestEndpoints from './addTestEndpoints';

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

addTestEndpoints(app)

const PORT = process.env.PORT || 3000

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

app.post('/', (req, res) => {
  processFlowRequest(req, res)
})

app.get('/', async (req, res) => {
  res.send({
    status: 200,
    configuration: SlackRepository.data
  })
})

const getPullRequestsJSON = async (prs) => {
  await Promise.all(prs.map(pr => pr.getReviews()));

  await Promise.all(prs.map(pr => pr.getChanges()));

  return prs.map(pr => {
    const approvedReviews = pr.reviews.filter(r => r.state === 'approved')
    const reprovedReviews = pr.reviews.filter(r => r.state === 'changes_requested')


    const sortedChanges = pr.changes.sort((a, b) => (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt));

    const latestChange = sortedChanges.length > 0 ? pr.changes[0] : undefined;

    const reviews = pr.reviews;

    const outdatedReviews = reviews.filter((r) => {
      return (r.updatedAt || r.createdAt) < (latestChange || {}).createdAt
    });

    const outdatedReviewsUsernames = outdatedReviews.map(a => a.username);

    const approvedByList = approvedReviews.map(r => SlackRepository.getSlackUser(r.username));
    const repprovedByList = reprovedReviews.map(r => SlackRepository.getSlackUser(r.username));

    const getListOrFirst = (list) => {
      if (list.length > 1) {
        return list;
      } else if (list.length === 1) {
        return list[0]
      }
    }

    return {
      title: pr.title,
      link: pr.link,
      ci_state: pr.ciState ? pr.ciState : 'unavailable',
      approved_by: getListOrFirst(approvedByList),
      reproved_by: getListOrFirst(repprovedByList),
      new_changes_after_last_review_of: getListOrFirst(outdatedReviewsUsernames)
    }
  })
}
app.get(`/open-prs/:devGroup`, async (req, res) => {
  const devGroup = req.params.devGroup;
  const repositoryNames = Object.keys(SlackRepository.data);

  const filteredRepositories = repositoryNames.filter(k => SlackRepository.data[k].devGroup === `@${devGroup}`)

  const prs = await PullRequest.list({ state: 'open', repositoryName: { $in: filteredRepositories } })

  const data = await getPullRequestsJSON(prs);

  res.send({
    status: 200,
    length: data.length,
    data,
  })
})

app.get('/open-prs', async (req, res) => {
  let prs = await PullRequest.list({ repositoryName: { $ne: 'gh-hooks-repo-test' }, state: 'open' })
  const data = await getPullRequestsJSON(prs);

  res.send({
    status: 200,
    length: data.length,
    data,
  })
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

const processFlow = (req, res, Flow) => {
  const json = req.body;
  const flow = new Flow(json);

  const flowName = flow.constructor.name;
  console.log(`Start: ${flowName}`)
  flow.run()
  console.log(`End: ${flowName}`)
  res.sendStatus(200);
}

app.post('/notify-deploy', (req, res) => {
  processFlow(req, res, ServerFlow)
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
