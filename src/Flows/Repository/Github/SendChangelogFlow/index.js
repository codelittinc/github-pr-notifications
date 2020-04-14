import { SlackRepository, Slack, Github } from '@services'
import { PullRequest } from '@models';
import pullRequestParser from '../parsers/pullRequestParser'

class SendChangelogFlow {
  static async start(json) {
    const pr = await new PullRequest(pullRequestParser.parse(json)).load();
    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { deployChannel } = repositoryData;

    if (!deployChannel) {
      console.log('No deploy channel found.')
      console.log('Flow aborted!')
      return;
    }

    const ghCommits = await Github.getCommits(pr.ghId, pr.owner, pr.repositoryName)
    let slackMessage = "*Changelog*:"
    const validCommits = ghCommits.filter(ghCommit => {
      const { commit } = ghCommit;
      const { message } = commit;
      return !message.startsWith('Merge');
    })

    validCommits.forEach(ghCommit => {
      const { commit } = ghCommit;
      const { message } = commit;

      slackMessage = `${slackMessage} \n - ${message}`
    })

    Slack.getInstance().sendMessage({
      message: slackMessage,
      channel: deployChannel,
    });
  };

  static async isFlow(json) {
    if (!json.action || json.action !== 'closed') {
      return false;
    };

    const pr = await new PullRequest(pullRequestParser.parse(json)).load();
    return pr.isDeployPR();
  };
}

export default SendChangelogFlow;