import dotenv from 'dotenv'
import axios from 'axios';
dotenv.config()

import bodyParser from 'body-parser';
import express from 'express';
import {
  HomeController,
  DeployNotificationController,
  PullRequestsController,
  SlackController,
  FlowsController
} from './controllers';

const app = express()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

const PORT = process.env.PORT || 3000

app.get('/', HomeController.index)
app.get(`/open-prs/:devGroup?`, PullRequestsController.index)

app.post('/', FlowsController.create)
app.post('/flows', FlowsController.create)
app.post('/notify-deploy', DeployNotificationController.create);
app.post('/slack', SlackController.create)

app.post('/mentions', async (req, res) => {
  const { event } = req.body;
  if (event) {
    const { channel, text } = event;

    const url = 'https://hooks.zapier.com/hooks/catch/4254966/o547s18';

    await axios.post(url, {
      text,
    });
  }

  res.sendStatus(200)
})

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))
