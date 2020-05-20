import axios from 'axios';

const BASE_URL = "https://roadrunner-rails.herokuapp.com/";

export default class Repositories {
  static async getRepositories() {
    const url = `${BASE_URL}/repositories.json`
    console.log(url)
    const result = await axios.get(url);
    return result.data;
  }

  static async getRepositoryDataByServer(server) {
    const repositories = await this.getRepositories();
    return repositories.find(rep => {
      const { servers = [] } = rep;
      return servers.includes(server);
    });
  }
}