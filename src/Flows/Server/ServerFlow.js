import HerokuFlow from './Heroku/HerokuFlow';
import AzureAppCenterFlow from './AzureAppCenter/AzureAppCenterFlow';
import RootFlow from '../RootFlow';

class ServerFlow extends RootFlow {
  getFlows() {
    return [
      HerokuFlow,
      AzureAppCenterFlow,
    ];
  }
};

export default ServerFlow;