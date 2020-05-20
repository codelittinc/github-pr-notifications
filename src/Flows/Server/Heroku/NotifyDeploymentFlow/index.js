import { SlackRepository, Slack, Repositories } from '@services'

class NotifyDeploymentFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { app } = this.data;
    const repositoryData = await Repositories.getRepositoryDataByServer(app);

    if (repositoryData) {
      const { deployChannel } = repositoryData;
      Slack.getInstance().sendMessage({
        message: this.getMessage(repositoryData, app),
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
    const environment = app.match(/qa|prod/)[0];
    return `Deploy of the project *${repository.name}* to *${environment.toUpperCase()}* was finished with success!`;
  }

  isFlow() {
    return !!this.data.app;
  };
}

export default NotifyDeploymentFlow;