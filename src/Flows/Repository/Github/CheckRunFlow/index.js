import { SlackRepository, Reactji, DirectMessage } from '@services'
import { PullRequest, CheckRun } from '@models';

class CheckRunFlow {
  static async start(json) {
    const { sha, state, branches, repository } = json;
    const branchName = branches[0].name;
    const repositoryName = repository.name;

    const currentCheckrun = new CheckRun({ commitSha: sha, state })
    await currentCheckrun.createOrLoadByCommitSha();

    // Add sort by to get the latest
    const pr = await PullRequest.findBy({ branchName, repositoryName, state: 'open' });

    if (!pr) {
      console.log('Flow aborted!')
      return;
    }

    const mainSlackMessage = await pr.getMainSlackMessage();
    if (!mainSlackMessage) {
      console.log('Flow aborted!')
      return;
    }

    const repositoryData = SlackRepository.getRepositoryData(pr.repositoryName)

    const { channel } = repositoryData;

    if (state === 'failure') {
      const directMessage = new DirectMessage(pr.username)
      directMessage.notifyCIFailure(pr)
    }

    pr.updateCIState(state)

    const reactji = new Reactji(mainSlackMessage.ts, state, channel, 'ci')
    reactji.react()
  };

  static async isFlow(json) {
    return json.commit && (json.state === 'success' || json.state === 'failure' || json.state === 'pending');
  };
}

export default CheckRunFlow;