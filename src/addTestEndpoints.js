import { SlackMessage } from './models';

import checkRunPendingJson from './payload-examples/checkRunPending.json';
import checkRunFailureJson from './payload-examples/checkRunFailure.json';
import closePrJson from './payload-examples/closePR.json';
import newFullPrJson from './payload-examples/newFullPR.json';
import newChangeJson from './payload-examples/newPush.json';
import submitReviewChangesApproved from './payload-examples/submitReviewChangesApproved.json';
import submitReviewChangesRequested from './payload-examples/submitReviewChangesRequested.json';
import newPRComment from './payload-examples/newPRComment.json';

export default (app, resolve) => {
  app.get('/new-pr-comment', async (req, res) => {
    resolve({
      body: newPRComment,
    }, res)
  })
  app.get('/test-new-full-pr', async (req, res) => {
    resolve({
      body: newFullPrJson,
    }, res)
  })

  app.get('/test-close-pr', async (req, res) => {
    resolve({
      body: closePrJson,
    }, res)
  })

  app.get('/test-new-change', async (req, res) => {
    resolve({
      body: newChangeJson,
    }, res)
  })

  app.get('/test-submit-review-changes-requested', async (req, res) => {
    resolve({
      body: submitReviewChangesRequested,
    }, res)
  })

  app.get('/test-submit-review-changes-approved', async (req, res) => {
    resolve({
      body: submitReviewChangesApproved,
    }, res)
  })

  app.get('/test-checkrun-pending', async (req, res) => {
    resolve({
      body: checkRunPendingJson,
    }, res)
  })

  app.get('/test-checkrun-failure', async (req, res) => {
    resolve({
      body: checkRunFailureJson,
    }, res)
  })

  app.post('/slack-callback', (req, res) => {
    const json = req.body;
    const { callbackIdentifier, slackThreadTS } = json;

    const slackMessage = new SlackMessage(callbackIdentifier, slackThreadTS)
    slackMessage.create()

    res.sendStatus(200)
  })
}