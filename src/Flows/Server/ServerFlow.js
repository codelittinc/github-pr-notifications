import AzureAppCenterFlow from './AzureAppCenter/AzureAppCenterFlow';
import RootFlow from '../RootFlow';

class ServerFlow extends RootFlow {
  getFlows() {
    return [
      AzureAppCenterFlow,
    ];
  }
};

export default ServerFlow;