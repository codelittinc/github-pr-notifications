import { Github, GithubCommits } from '../../../../services/index.js'

export default async (releases, latestRelease, owner, repository) => {
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

  if(!text) {
    return;
  }

  await Github.createRelease({
    owner,
    repo: repository,
    tagName: baseTagVersion,
    branch: latestReleaseLatestCommit.sha,
    name: `Version ${baseTagVersion}`,
    body: `Available in this release \n ${text}`,
    prerelease: false
  });
}