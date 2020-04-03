import GithubFlow from './Github/GithubFlow';
import { FlowNotFoundError } from '@errors';
import RootFlow from '../RootFlow';

class ServerFlow extends RootFlow {
  getFlows() {
    return [GithubFlow]
  }
};

export default ServerFlow;