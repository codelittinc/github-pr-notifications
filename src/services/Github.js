import Octokit from '@octokit/rest';

class Github {
  static async getCommits(pullRequestId, owner, repository) {
    const octokit = new Octokit({
      auth: process.env.GIT_AUTH
    });
    const commits = await octokit.pulls.listCommits({
      owner,
      repo: repository,
      pull_number: pullRequestId
    })

    return commits.data;
  }

  static async getPullRequest({pullRequestId, owner, repository}) {
    const octokit = new Octokit({
      auth: process.env.GIT_AUTH
    });
    const commits = await octokit.pulls.get({
      owner,
      repo: repository,
      pull_number: pullRequestId
    })

    return commits.data;
  }

  static async createPullRequest({
    owner,
    repo,
    title,
    head,
    base,
  }) {
    const octokit = new Octokit({
      auth: process.env.GIT_AUTH
    });

    const pull = await octokit.pulls.create({
      owner,
      repo,
      title,
      head,
      base
    });

    return pull.data;
  }

  static async mergePullRequest({
    owner,
    repo,
    number
  }) {
    const octokit = new Octokit({
      auth: process.env.GIT_AUTH
    });
    const pull = await octokit.pulls.merge({
      owner,
      repo,
      pull_number: number,
//      merge_method: 'rebase'
    });

    return pull.data;
  }
}

export default Github;