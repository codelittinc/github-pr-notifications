import { Github } from '../services/index.js'

class GithubCommits {
  static async getCommitMessagesText({ head, base, owner, repository }) {
    const branchesDiff = await Github.compareBranchesCommits({
      head,
      base,
      owner,
      repo: repository
    });

    const { commits } = branchesDiff;
    if (commits.length === 0) {
      return null;
    }

    const validCommits = commits.filter(ghCommit => {
      const { commit } = ghCommit;
      const { message } = commit;
      return !message.startsWith('Merge');
    })

    let text = '';
    validCommits.forEach(ghCommit => {
      const { commit } = ghCommit;
      const { message } = commit;

      text = `${text} - ${message} \n`
    })

    return text;
  }
}

export default GithubCommits;