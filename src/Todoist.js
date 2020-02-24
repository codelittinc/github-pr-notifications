import axios from 'axios';
import uuid from 'uuid';


const getUrl = (path) => {
  const TODOIST_KEY = process.env.TODOIST_KEY;
  return `https://api.todoist.com/sync/v8/sync?token=${TODOIST_KEY}${path}`;
}

const taskTemplates = [
  {
    projectName: "Codelitt Recurring",
    task: {
      name: "Review Rolli"
    },
    subtasks: [
      {
        name: "User Check Run"
      }
    ]
  }
];

class Todoist {
  static async projects() {
    const url = getUrl(`&sync_token=*&resource_types=["projects"]`);
    const response = await axios.get(url);
    return response.data.projects;
  }

  static async getProjectByName(name) {
    const projects = await this.projects();
    return projects.filter(p => p.name === name)[0];
  }

  static async createTask(name, projectId, parentId) {
    const url = getUrl(`&commands=[{"type": "item_add", "temp_id": "${uuid.v4()}", "uuid": "${uuid.v4()}", "args": {"content": "${name}", "project_id": ${projectId}, "parent_id": "${parentId}"}}]`);
    const response = await axios.get(url);
    return response.data;

  }
  static async run() {
    for (const template of taskTemplates) {

      const { task, subtasks, projectName } = template;
      const project = await this.getProjectByName(projectName);

      const todoistTask = await this.createTask(task.name, project.id);
      const parentId = Object.keys(todoistTask.temp_id_mapping)[0]

      subtasks.forEach((subtask) => {
        this.createTask(subtask.name, project.id, parentId);
      })
    }
  }
}

export default Todoist;