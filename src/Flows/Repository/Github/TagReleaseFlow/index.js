import { SlackRepository, Github, GithubCommits } from '@services'

class ReleaseFlow {
  static async start(json) {
    const { channel_name, text } = json;

    const repositoryData = SlackRepository.getRepositoryDataByDeployChannel(channel_name);
    const { deployChannel, owner, repository } = repositoryData;

    const [_, environment] = text.split(' ');

    const releases = await Github.listReleases({
      owner,
      repo: repository
    });

    const latestRelease = releases[0];
    const { tag_name, id } = latestRelease || {
      tag_name: '0.0.0'
    };

    const [latestMajor, latestMinor, latestPatch] = tag_name.match(/\d+\.\d+\.\d+/)[0].split('.')
    const newPatch = Number.parseInt(latestPatch) + 1;
    const newTagVersion = `${latestMajor}.${latestMinor}.${newPatch}`;


    if (environment === 'qa') {
      let slackMessage = 'Available in this release:';
      if (tag_name !== '0.0.0') {
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
      console.log(slackMessage)

      await Github.createRelease({
        owner,
        repo: repository,
        tagName: `v${newTagVersion}`,
        branch: 'develop',
        name: `Version ${newTagVersion}`,
        body: slackMessage,
        prerelease: true
      })
    } else if (environment === 'prod') {
      let latestPrerelease;
      let index = 0;

      while (!latestPrerelease) {
        if (!releases[index + 1].prerelease) {
          latestPrerelease = releases[index]
        } else {
          index++
        }
      }

      const text = await GithubCommits.getCommitMessagesText({
        head: 'develop',
        base: latestPrerelease.tag_name,
        owner,
        repository,
      });

      await Github.updateRelease({
        owner,
        repo: repository,
        id,
        prerelease: false,
        body: `Available in this release \n ${text}`
      })
    }
  };

  static async isFlow(json) {
    const { text } = json;

    if (!text) {
      return;
    }

    const [action] = text.split(' ')

    return false && action === 'update';
  };
}

export default ReleaseFlow;