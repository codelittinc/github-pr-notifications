import { Github, GithubCommits, Slack } from '../../../../services/index.js'

export default async (deployChannel, latestRelease = {}, owner, repository) => {
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
  let commitsMessage;
  if (tag_name !== DEFAULT_TAG_NAME) {
    commitsMessage = await GithubCommits.getCommitMessagesText({
      head: 'master',
      base: tag_name,
      owner,
      repository,
    });
  } else {
    commitsMessage = ' - EVERYTHING up to now';
  }

  if (commitsMessage) {
    slackMessage = `${slackMessage} \n${commitsMessage}`
    const data = {
      owner,
      repo: repository,
      tagName: newTagVersion,
      branch: 'master',
      name: `Version ${newTagVersion}`,
      body: slackMessage,
      prerelease: true
    }

    await Github.createRelease(data)

    Slack.getInstance().sendMessage({
      message: slackMessage,
      channel: deployChannel 
    });
  } else {
    Slack.getInstance().sendMessage({
      message: "The server already has the latest updates",
      channel: deployChannel
    });
  }
}