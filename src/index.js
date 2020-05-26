import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

import bodyParser from 'body-parser';
import express from 'express';
import {
  DeployNotificationController,
  FlowsController,
  HomeController,
  PullRequestsController,
  SlackController,
} from './controllers';

import withHealthMonitor from '@codelittinc/health-monitor-node';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, _, next) => {
  const isPost = req.method == "POST";
  if (isPost) {
    const { body } = req;
    try {
      axios.post("http://roadrunner-rails.herokuapp.com/flows", body)
    } catch(e) {}
  }
  next()
})

withHealthMonitor(app, 'codelitt-roadrunner-node')

const PORT = process.env.PORT || 3000;

app.get('/', HomeController.index);
app.get(`/open-prs/:devGroup?`, PullRequestsController.index);

app.post('/', FlowsController.create);
app.post('/flows', FlowsController.create);
app.post('/notify-deploy', DeployNotificationController.create);
app.post('/slack', SlackController.create);
app.get('/requests/:id', FlowsController.show)

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
