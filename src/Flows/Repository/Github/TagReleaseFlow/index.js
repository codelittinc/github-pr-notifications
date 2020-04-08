import { SlackRepository, Github, GithubCommits } from '../../../../services/index.js'

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
      await this.startReleaseCandidateFlow(latestRelease, owner, repository)
    } else {
      await this.startReleaseFlow(releases, latestRelease, owner, repository)
    }

    if (callback) {
      callback()
    }
  };

  static async startReleaseCandidateFlow(latestRelease = {}, owner, repository) {
    const DEFAULT_TAG_NAME = 'v0.0.0-rc.0';
    const { tag_name = DEFAULT_TAG_NAME } = latestRelease;
    const isBasedOnRelease = !tag_name.match('rc')

    let baseTagVersion = tag_name.match(/\d+\.\d+\.\d+/)[0]
    let newReleaseCandidateVersion = 0;

    if (isBasedOnRelease) {
      let [major, minor, patch] = baseTagVersion.split('.')
      baseTagVersion = [major, minor, Number.parseInt(patch) + 1].join('.')
    } else {
      const currentReleaseCandidateVersion = tag_name.match(/\d+$/)
      newReleaseCandidateVersion = Number.parseInt(currentReleaseCandidateVersion) + 1;
    }

    const newTagVersion = `v${baseTagVersion}-rc${newReleaseCandidateVersion}`;

    let slackMessage = 'Available in this release:';
    if (tag_name !== DEFAULT_TAG_NAME) {
      const text = await GithubCommits.getCommitMessagesText({
        head: 'develop',
        base: tag_name,
        owner,
        repository,
      });

      slackMessage = `${slackMessage} \n${text}`
    } else {
      slackMessage = `${slackMessage} \n - EVERYTHING up to now`
    }

    const data = {
      owner,
      repo: repository,
      tagName: newTagVersion,
      branch: 'develop',
      name: `Version ${newTagVersion}`,
      body: slackMessage,
      prerelease: true
    }

    await Github.createRelease(data)
  }

  static async startReleaseFlow(releases, latestRelease, owner, repository) {
    let oldestPrerelease;
    let index = 0;

    while (!oldestPrerelease) {
      if (!releases[index + 1] || !releases[index + 1].prerelease) {
        oldestPrerelease = releases[index]
      } else {
        index++
      }
    }

    const { tag_name } = latestRelease;
    const oldestPreleaseCommits = (await Github.listBranchCommits({
      owner,
      repo: repository,
      branch: oldestPrerelease.tag_name
    }))

    const text = await GithubCommits.getCommitMessagesText({
      head: latestRelease.tag_name,
      base: oldestPreleaseCommits[1].sha,
      owner,
      repository,
    });

    const latestReleaseLatestCommit = (await Github.listBranchCommits({
      owner,
      repo: repository,
      branch: latestRelease.tag_name
    }))[0]

    const baseTagVersion = tag_name.match(/v\d+\.\d+\.\d+/)[0]

    await Github.createRelease({
      owner,
      repo: repository,
      tagName: baseTagVersion,
      branch: latestReleaseLatestCommit.sha,
      name: `Version ${baseTagVersion}`,
      body: `Available in this release \n ${text}`,
      prerelease: false
    })
  }

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