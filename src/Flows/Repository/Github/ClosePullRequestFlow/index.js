import { Slack, Repositories, Reactji, Github, ChannelMessage, DirectMessage } from '@services'
import { PullRequest, Commit } from '@models';
import pullRequestParser from '../parsers/pullRequestParser'
import sendJiraConfirmation from './sendJiraConfirmation';

class ClosePullRequestFlow {
  static async start(json) {
    const pr = await new PullRequest(pullRequestParser.parse(json)).load();

    const mainSlackMessage = await pr.getMainSlackMessage();
    if (!mainSlackMessage) {
      console.log('Flow aborted!')
      return;
    }

    const repositoryData = await Repositories.getRepositoryData(pr.repositoryName)

    const { devGroup, channel } = repositoryData;

    const { body: prBody } = await Github.getPullRequest({ pullRequestId: pr.ghId, owner: pr.owner, repository: pr.repositoryName })

    await pr.close()

    const ghCommits = await Github.getCommits(pr.ghId, pr.owner, pr.repositoryName);

    ghCommits.forEach(ghCommit => {
      const { sha, commit } = ghCommit;
      const { author, message } = commit;
      const { date, email, name } = author;

      new Commit({
        prId: pr.id,
        sha,
        message,
        createdAt: (new Date(date)).getTime(),
        authorEmail: email,
        authorName: name,
      }).create();
    })

    await (new ChannelMessage(channel, mainSlackMessage.ts)).closePullRequest(devGroup, pr.link)

    await Github.deleteBranch({
      owner: pr.owner,
      repo: pr.repositoryName,
      ref: pr.branchName,
    });

    const reactji = new Reactji(mainSlackMessage.ts, 'closed', channel, 'flow')
    reactji.react();

    const directMessage = new DirectMessage(pr.username)
    directMessage.notifyPRMerge(pr)

    const mentionRegex = new RegExp(/http.*atlassian.*/g);
    let z;
    const jiraLinks = []
    while (null != (z = mentionRegex.exec(prBody))) {
      jiraLinks.push(z[0])
    }

    try {
      jiraLinks.forEach((link) => {
        console.log("Sending jira update message", pr.ghId, link, pr.username)
        sendJiraConfirmation(pr.ghId, link, pr.username)
        console.log("Message sent")
      });
    } catch (e) {
      console.log(e)
    }
  };

  static async isFlow(json) {
    if (!json.action || json.action !== 'closed') {
      return false;
    };

    const pr = await new PullRequest(pullRequestParser.parse(json)).load();
    return pr && !pr.isClosed() && !pr.isDeployPR();
  };
}

export default ClosePullRequestFlow;