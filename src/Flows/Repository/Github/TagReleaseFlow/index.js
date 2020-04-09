import { SlackRepository, Github } from '../../../../services/index.js'

import startReleaseFlow from './startReleaseFlow.js';
import startReleaseCandidateFlow from './startReleaseCandidateFlow.js';

class TagReleaseFlow {
  static async start(json, callback) {
    const { channel_name, text } = json;

    const repositoryData = SlackRepository.getRepositoryDataByDeployChannel(channel_name);
    const { owner, repository } = repositoryData;

    const [_, environment] = text.split(' ');

    const releases = await Github.listReleases({
      owner,
      repo: repository
    });

    const latestRelease = releases[0];

    if (environment === 'qa') {
      await startReleaseCandidateFlow(channel_name, latestRelease, owner, repository)
    } else {
      await startReleaseFlow(channel_name, releases, latestRelease, owner, repository)
    }

    callback()
  };

  static getSlackResponse() {
    return; 
  }

  static isFlow(json) {
    const { text, channel_name } = json;

    if (!text) {
      return;
    }

    const [action] = text.split(' ')
    if (action !== 'update') {
      return;
    }

    const repositoryData = SlackRepository.getRepositoryDataByDeployChannel(channel_name);

    return repositoryData.deploy_with_tag;
  };
}

export default TagReleaseFlow;