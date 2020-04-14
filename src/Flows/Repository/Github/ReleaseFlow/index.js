import { SlackRepository, Github, Slack } from '../../../../services/index.js'

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
  }
};

class ReleaseFlow {
  static async start(json) {
    const { channel_name, text, user_name } = json;

    const repositoryData = SlackRepository.getRepositoryDataByDeployChannel(channel_name);
    const { deployChannel, owner, repository } = repositoryData;

    const [event, environment] = text.split(' ');

    const { head, base } = config[event][environment];

    let pullRequest;
    let pullRequestCreationError;
    Slack.getInstance().sendMessage({
      message: `Deployment process to *${environment.toUpperCase()}* process started by @${user_name}`,
      channel: channel_name 
    });

    try {
      pullRequest = await Github.createPullRequest({
        owner,
        repo: repository,
        title: `Release ${head} to ${base}`,
        head,
        base
      });
    } catch (e) {
      if (e.errors) {
        pullRequestCreationError = e.errors[0].message;
      } else {
        pullRequestCreationError = e.toString();
      }
    };

    if (pullRequestCreationError) {
      if (pullRequestCreationError === 'No commits between qa and develop') {
        Slack.getInstance().sendMessage({
          message: "The server already has the latest updates",
          channel: deployChannel
        });
        return
      } else {
        const message = `${pullRequestCreationError} - ${JSON.stringify(json)}`;
        Slack.getInstance().sendDirectMessage({
          message,
          username: SlackRepository.getAdminSlackUser()
        });

        Slack.getInstance().sendMessage({
          message: `There was an error with the deployment. Hey @kaio can you do something about it? Thank you.`,
          channel: deployChannel
        });
        return
      }
    }

    const { number } = pullRequest;

    let merge;
    let mergeError;
    try {
      await Github.mergePullRequest({
        owner,
        repo: repository,
        number
      });
    } catch (e) {
      if (e.errors) {
        mergeError = e.errors[0].message;
      } else {
        mergeError = e.toString();
      }
      console.log("error while creating the PR", mergeError)
    }

    if (mergeError) {
      Slack.getInstance().sendDirectMessage({
        message: `${mergeError} - ${JSON.stringify(json)}`,
        username: SlackRepository.getAdminSlackUser()
      });

      Slack.getInstance().sendMessage({
        message: `There was an error with the deployment. Hey @kaio can you do something about it? Thank you.`,
        channel: deployChannel
      });
      return;
    }
  };

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

    return !repositoryData.deploy_with_tag;
  };

  static getSlackResponse(json) {
    const { channel_name } = json;
    const repositoryData = SlackRepository.getRepositoryDataByDeployChannel(channel_name);

    if (!repositoryData && (repositoryData && !repositoryData.supports_deploy)) {
      return "This channel doesn't support automatic deploys";
    }
  };

}

export default ReleaseFlow;