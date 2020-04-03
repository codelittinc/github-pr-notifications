import JiraFlow from './Jira/JiraFlow';
import RootFlow from '../RootFlow';

class TaskManagerFlow extends RootFlow {
  getFlows() {
    return [
      JiraFlow,
    ];
  }
};

export default TaskManagerFlow;