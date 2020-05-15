import dotenv from 'dotenv';
dotenv.config();

import nr from 'newrelic';


import bodyParser from 'body-parser';
import express from 'express';
import {
  DeployNotificationController,
  FlowsController,
  HomeController,
  PullRequestsController,
  SlackController,
} from './controllers';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

app.get('/', HomeController.index);
app.get(`/open-prs/:devGroup?`, PullRequestsController.index);

app.post('/', FlowsController.create);
app.post('/flows', FlowsController.create);
app.post('/notify-deploy', DeployNotificationController.create);
app.post('/slack', SlackController.create);
app.get('/requests/:id', FlowsController.show)

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));
