import axios from 'axios';

const BASE_URL = "https://roadrunner-rails.herokuapp.com/";

export default class Users {
  static async find(term) {
    const url = `${BASE_URL}/user_search?term=${term}`
    const result = await axios.get(url);
    return result.data;
  }
}