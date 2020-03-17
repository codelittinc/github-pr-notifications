import { SlackRepository} from '../services'

export default class HomeController {
  static async index(req, res) {
    res.send({
      status: 200,
      configuration: SlackRepository.data
    })
  }
}