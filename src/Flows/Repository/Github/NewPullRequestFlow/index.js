import { Repositories, Reactji, Github, ChannelMessage } from '@services'
import { SlackMessage, PullRequest, Commit, CheckRun } from '@models';
import pullRequestParser from '../parsers/pullRequestParser'

class NewPullRequestFlow {
  static async start(json) {
    const data = pullRequestParser.parse(json);
    const pr = new PullRequest(data)

    await pr.create()

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
    });
  };

  static isFlow(json) {
    if (json.action !== 'opened' && json.action !== 'ready_for_review') {
      return false;
    }

    const data = pullRequestParser.parse(json);
    const pr = new PullRequest(data)

    return !pr.draft && !pr.isDeployPR()
  };
}

export default NewPullRequestFlow;