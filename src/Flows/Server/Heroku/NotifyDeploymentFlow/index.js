import { SlackRepository, Slack, Repositories } from '@services'

class NotifyDeploymentFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { app, data } = this.data;
    let appName;

    if (app) {
      appName = app;
    } else {
      appName = data.app.name;
    }

    const repositoryData = await Repositories.getRepositoryDataByServer(appName);

    if (repositoryData) {
      const { deployChannel } = repositoryData;
      Slack.getInstance().sendMessage({
        message: this.getMessage(repositoryData, appName),
        channel: deployChannel
      });
    } else {
      Slack.getInstance().sendDirectMessage({
        message: JSON.stringify(this.data),
        username: SlackRepository.getAdminSlackUser()
      });
    }
  };

  getMessage(repository, app) {
    const environment = app.match(/qa|prod|dev/)[0];
    return `Deploy of the project *${repository.name}* to *${environment.toUpperCase()}* was finished with success!`;
  }

  isFlow() {
    return false
  };
}

export default NotifyDeploymentFlow;