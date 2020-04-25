import Octokit from '@octokit/rest';

class Github {
  constructor() {
    this.auth_key = process.env.GIT_AUTH;
  }

  async setClient() {
    this.client = await new Octokit.Octokit({
      auth: process.env.GIT_AUTH
    });
  }

  static async getClient() {
    return (await Github.getInstance()).client;
  }

  static async getInstance() {
    if (!Github.instance) {
      Github.instance = new Github();
      await Github.instance.setClient();
    }
    return Github.instance;
  }

  static async getCommits(pullRequestId, owner, repository) {
    const octokit = await Github.getClient();

    const commits = await octokit.pulls.listCommits({
      owner,
      repo: repository,
      pull_number: pullRequestId
    })

    return commits.data;
  }

  static async getPullRequest({ pullRequestId, owner, repository }) {
    const octokit = await Github.getClient();

    const commits = await octokit.pulls.get({
      owner,
      repo: repository,
      pull_number: pullRequestId
    })

    return commits.data;
  }

  static async createPullRequest({ owner, repo, title, head, base }) {
    const octokit = await Github.getClient();

    const pull = await octokit.pulls.create({
      owner,
      repo,
      title,
      head,
      base
    });

    return pull.data;
  }

  static async mergePullRequest({ owner, repo, number }) {
    const octokit = await Github.getClient();

    const pull = await octokit.pulls.merge({
      owner,
      repo,
      pull_number: number,
    });

    return pull.data;
  }

  static async deleteBranch({ owner, repo, ref }) {
    const octokit = await Github.getClient();

    await octokit.git.deleteRef({
      owner,
      repo,
      ref: `heads/${ref}`,
    });
  }

  static async listBranchCommits({ owner, repo, branch }) {
    const octokit = await Github.getClient();

    const response = await octokit.repos.listCommits({
      owner,
      repo,
      sha: branch
    })

    return response.data;
  }

  static async compareBranchesCommits({ owner, repo, base, head }) {
    const octokit = await Github.getClient();

    const response = await octokit.repos.compareCommits({
      owner,
      repo,
      base,
      head
    })

    return response.data;
  }

  static async listReleases({ owner, repo }) {
    const octokit = Github.getClient();

    const response = await octokit.repos.listReleases({
      owner,
      repo,
    })

    return response.data;
  }

  static async createRelease({
    owner,
    repo,
    tagName,
    branch,
    name,
    body,
    prerelease
  }) {
    const octokit = await Github.getClient();

    const response = await octokit.repos.createRelease({
      owner,
      repo,
      tag_name: tagName,
      target_commitish: branch,
      name,
      body,
      prerelease
    })

    return response.data;
  }

  static async updateRelease({ owner, repo, id, prerelease, body }) {
    const octokit = await Github.getClient();

    const response = await octokit.repos.updateRelease({
      owner,
      repo,
      release_id: id,
      prerelease,
      body
    })

    return response.data;
  }
}

export default Github;