import axios from 'axios';
import uuid from 'uuid';


const getUrl = (path) => {
  const TODOIST_KEY = process.env.TODOIST_KEY;
  return `https://api.todoist.com/sync/v8/sync?token=${TODOIST_KEY}${path}`;
}

const getDaily = () => (
  new Date().toLocaleString('en-us', { weekday: 'short' })
)

const reviewProjectDaily = {
  "Mon": "AY",
  "Tue": "Rolli",
  "Wed": "ACS",
};

const taskTemplates = [
  {
    id: 1,
    projectName: "👨‍🚀 Work",
    due: 'today at 5am',
    task: {
      name: "Start day"
    },
    subtasks: [
      {
        name: "Start Toggle",
      },
      {
        name: "Review PRs",
      },
      {
        name: "Review calendar and prepare tasks for any meeting",
      },
      {
        name: "Clean emails",
      },
      {
        name: "Review work mentions",
      },
      {
        name: "Review personal goals",
      },
      {
        name: "Review company goals",
      },
      {
        name: "Prioritize daily tasks",
      },
    ]
  },
  {
    id: 2,
    projectName: "👨‍🚀 Work",
    due: 'today at 5pm',
    task: {
      name: "End day"
    },
    subtasks: [
      {
        name: "Review PRs",
      },
      {
        name: "Stop Toggle",
      }
    ]
  },
  {
    id: 3,
    projectName: "👨‍🚀 Work",
    due: 'today at 9am',
    task: {
      name: `Review Project ${reviewProjectDaily[getDaily()]}`
    },
    subtasks: [
      {
        name: "Review from an user perspective",
      },
      {
        name: "Review project designs",
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
    const dueObject = {
      string: due
    };

    const commands = [
      {
        type: 'item_add',
        temp_id: uuid.v4(),
        uuid: uuid.v4(),
        args: {
          content: name,
          project_id: projectId,
          parent_id: parentId,
          due: (due ? dueObject : {})
        }
      }
    ]
    const stringCommands = JSON.stringify(commands)
    const url = getUrl(
      `&commands=${stringCommands}`
    );

    const response = await axios.get(url);
    return response.data;
  }

  static async run(id) {
    for (const template of taskTemplates) {
      if (id == template.id) {
        if (id == 3 && !reviewProjectDaily[getDaily()]) {
          return;
        }
        const { task, subtasks, projectName, due } = template;
        const project = await this.getProjectByName(projectName);

        const todoistTask = await this.createTask(task.name, project.id, due);
        const parentId = Object.keys(todoistTask.temp_id_mapping)[0]

        for (const subtask of (subtasks || [])) {
          await this.createTask(subtask.name, project.id, undefined, parentId);
        }
      }
    }
  }
}

export default Todoist;