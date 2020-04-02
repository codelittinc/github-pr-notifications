import axios from 'axios';


export default class Jira {
  static async listProjects() {
    const { JIRA_AUTH_KEY } = process.env;
    const projectsUrl = 'https://codelitt.atlassian.net/rest/api/3/project/search'
    const result = await axios.get(projectsUrl, {
      headers: {
        Authorization: `Basic ${JIRA_AUTH_KEY}`
      }
    });
    return result.data.values;
  }

  static async getProjectIssues(id) {
    const { JIRA_AUTH_KEY } = process.env;
    let projectsUrl = `https://codelitt.atlassian.net/rest/api/3/search?jql=project%20%3D%20${id}%20AND%20status%20%3D%20"In%20Progress"`
    projectsUrl = projectsUrl + '&fields=status'

    const result = await axios.get(projectsUrl, {
      headers: {
        Authorization: `Basic ${JIRA_AUTH_KEY}`
      }
    });
    return result.data.issues;
  }
}