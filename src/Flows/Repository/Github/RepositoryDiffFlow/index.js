import { Repositories, Github, Slack } from '@services'

const config = {
  update: {
    prod: {
      head: 'qa',
      base: 'master',
    },
    qa: {
      head: 'develop',
      base: 'qa'
    },
  },
  diff: {
    prod: {
      head: 'qa',
      base: 'master',
    },
    qa: {
      head: 'develop',
      base: 'qa'
    },
  }
};

class RepositoryDiffFlow {
  static async start(json) {
    const { channel_name, text, user_name } = json;

    const repositoryData = await Repositories.getRepositoryDataByDeployChannel(channel_name);
    const { owner, repository } = repositoryData;

    const [event, environment] = text.split(' ');

    const { head, base } = config[event][environment];
    const branchesDiff = await Github.compareBranchesCommits({
      head,
      base,
      owner,
      repo: repository
    });

    const { commits } = branchesDiff;

    let slackMessage;

    if (commits.length > 0) {
      slackMessage = `Differences between *${head.toUpperCase()}* and *${base.toUpperCase()}* for the project *${channel_name}*: \n`
    } else {
      slackMessage = `There no differences between *${head.toUpperCase()}* and *${base.toUpperCase()}* for the project *${channel_name}*`
    }

    const validCommits = commits.filter(ghCommit => {
      const { commit } = ghCommit;
      const { message } = commit;
      return !message.startsWith('Merge');
    })


    validCommits.forEach(ghCommit => {
      const { commit } = ghCommit;
      const { message } = commit;

      slackMessage = `${slackMessage} \n - ${message}`
    })

    Slack.getInstance().sendDirectMessage({
      message: slackMessage,
      username: user_name 
    });
  };

  static getSlackResponse() {
    return; 
  }

  static async isFlow(json) {
    const { text } = json;

    if (!text) {
      return;
    }

    const [action] = text.split(' ')

    return action === 'diff';
  };
}

export default RepositoryDiffFlow;