import axios from 'axios';
import uuid from 'uuid';


const getUrl = (path) => {
  const TODOIST_KEY = process.env.TODOIST_KEY;
  return `https://api.todoist.com/sync/v8/sync?token=${TODOIST_KEY}${path}`;
}

const reviewProjectDaily = {
  "Mon": "AY",
  "Tue": "Rolli",
  "Wed": "ACS",
  "Thu": "Internal"
};

const taskTemplates = [
  {
    projectName: "Codelitt Recurring",
    due: 'today at 9am', 
    task: {
      name: "Start day"
    },
    subtasks: [
      {
        name: "Start Toggle",
      },
      {
        name: "Review work mentions",
      },
      {
        name: "Review PRs",
      },
      {
        name: "Clean emails",
      },
    ]
  },
  {
    projectName: "Codelitt Recurring",
    due: 'today at 5pm', 
    task: {
      name: "End day"
    },
    subtasks: [
      {
        name: "Stop Toggle",
      },
      {
        name: "Review PRs",
      },
    ]
  },
  {
    projectName: "Codelitt Recurring",
    due: 'today at 9am', 
    task: {
      name: `Review Project ${reviewProjectDaily[new Date().toLocaleString('en-us', {  weekday: 'short' })]}`
    },
    subtasks: [
      {
        name: "Review from an user perspective",
      },
      {
        name: "Review project designs",
      },
      {
        name: "Review git commit history",
      },
      {
        name: "Review cards to see if the devs have the information they need",
      },
    ]
  },
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

  static async createTask(name, projectId, due, parentId) {
    const url = getUrl(
      `&commands=[{"type": "item_add", "temp_id": "${uuid.v4()}", "uuid": "${uuid.v4()}", "args": {"content": "${name}", "project_id": ${projectId}, "parent_id": "${parentId}", "due": {"string": "${due}"}}}]`
      );
    const response = await axios.get(url);
    return response.data;

  }
  static async run() {
    for (const template of taskTemplates) {

      const { task, subtasks, projectName, due } = template;
      const project = await this.getProjectByName(projectName);

      const todoistTask = await this.createTask(task.name, project.id, due);
      const parentId = Object.keys(todoistTask.temp_id_mapping)[0]

      subtasks.forEach((subtask) => {
        this.createTask(subtask.name, project.id, due, parentId);
      })
    }
  }
}

export default Todoist;