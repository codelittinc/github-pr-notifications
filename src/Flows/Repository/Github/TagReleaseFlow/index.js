import { Repositories, Github, Slack } from '../../../../services/index.js'

import startReleaseFlow from './startReleaseFlow.js';
import startReleaseCandidateFlow from './startReleaseCandidateFlow.js';

class TagReleaseFlow {
  static async start(json, callback) {
    const { user_name, channel_name, text } = json;

    const repositoryData = await Repositories.getRepositoryDataByDeployChannel(channel_name);
    const { owner, repository } = repositoryData;

    const [_, environment] = text.split(' ');

    const releases = await Github.listReleases({
      owner,
      repo: repository
    });

    const latestRelease = releases[0];

    Slack.getInstance().sendMessage({
      message: `Deployment process to *${environment.toUpperCase()}* process started by @${user_name}`,
      channel: channel_name 
    });

    if (environment === 'qa') {
      await startReleaseCandidateFlow(channel_name, latestRelease, owner, repository)
    } else {
      await startReleaseFlow(channel_name, releases, latestRelease, owner, repository)
    }

    if (callback) {
      callback()
    }
  };

  static getSlackResponse() {
    return; 
  }

  static async isFlow(json) {
    const { text, channel_name } = json;

    if (!text) {
      return;
    }

    const [action] = text.split(' ')
    if (action !== 'update') {
      return;
    }

    const repositoryData = await Repositories.getRepositoryDataByDeployChannel(channel_name);

    return repositoryData.deployWithTag;
  };
}

export default TagReleaseFlow;