import Github from '../../Github.mjs'
import SlackRepository from '../../SlackRepository.mjs'
import PullRequest from '../../models/PullRequest.mjs'
import Commit from '../../models/Commit.mjs'
import pullRequestParser from '../../parsers/pullRequestParser.mjs'
import CheckRun from '../../models/CheckRun.mjs';
import Reactji from '../../services/Reactji.mjs';
import ChannelMessage from '../../services/ChannelMessage.mjs';
import SlackMessage from '../../models/SlackMessage.mjs';

class NewPullRequestFlow {
  static async start(json) {
    const data = pullRequestParser.parse(json);
    const pr = new PullRequest(data)

    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { devGroup, channel } = repositoryData;

    await pr.create()

    const ts = await (new ChannelMessage(channel)).requestReview(devGroup, pr.link)

    const slackMessage = new SlackMessage(pr.id, ts)
    slackMessage.create()

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

    const commitsShas = ghCommits.map(c => c.sha);
    const lastCheckRun = await CheckRun.findLastStateForCommits(commitsShas);
    const lastCheckRunState = lastCheckRun ? lastCheckRun.state : null;


    const reactji = new Reactji(ts, lastCheckRunState, channel, 'ci', 'pending')

    reactji.react()

    if (lastCheckRun) {
      pr.updateCIState(lastCheckRun.state)
    }
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