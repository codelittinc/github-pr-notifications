import { Github, GithubCommits, Slack } from '../../../../services/index.js'

export default async (deployChannel, releases, latestRelease, owner, repository) => {
  let oldestPrerelease;
  let index = 0;
  let oldestRelease;

  while (!oldestPrerelease) {
    if (!releases[index + 1] || !releases[index + 1].prerelease) {
      oldestPrerelease = releases[index]

      if (releases[index + 1]) {
        oldestRelease = releases[index + 1];
      }
    } else {
      index++
    }
  }
  const { tag_name } = latestRelease;

  let text;
  const oldestPreleaseCommits = (await Github.listBranchCommits({
    owner,
    repo: repository,
    branch: (oldestRelease || oldestPrerelease).tag_name
  }))

  text = await GithubCommits.getCommitMessagesText({
    head: latestRelease.tag_name,
    base: oldestPreleaseCommits[0].sha,
    owner,
    repository,
  });

  const latestReleaseLatestCommit = (await Github.listBranchCommits({
    owner,
    repo: repository,
    branch: latestRelease.tag_name
  }))[0]

  const baseTagVersion = tag_name.match(/v\d+\.\d+\.\d+/)[0]

  if (text) {
    await Github.createRelease({
      owner,
      repo: repository,
      tagName: baseTagVersion,
      branch: latestReleaseLatestCommit.sha,
      name: `Version ${baseTagVersion}`,
      body: `Available in this release \n ${text}`,
      prerelease: false
    });

    await Slack.getInstance().sendMessage({
      message: `*Available in this release* \n${text}`,
      channel: deployChannel
    });
  } else {

    Slack.getInstance().sendMessage({
      message: "The server already has the latest updates",
      channel: deployChannel
    });
  }
}