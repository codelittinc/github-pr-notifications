import { SlackRepository, Slack } from '@services';

const APPS = {
  'Property Intelligence': {
    repo: 'ay-property-intelligence'
  },
};

class NotifyBuildResultFlow {
  constructor(data) {
    this.data = data;
  }

  async run() {
    const { app_name, build_status, build_id } = this.data;
    const slackRepository = SlackRepository.getRepositoryData(APPS[app_name].repo);
    const { deployChannel } = slackRepository;

    return await Slack.getInstance().sendMessage({
      message:`The build #${build_id} was finished with status: ${build_status}`,
      channel: deployChannel,
    });
  };

  isFlow() {
    return !!this.data.app_name;
  };
}

export default NotifyBuildResultFlow;
