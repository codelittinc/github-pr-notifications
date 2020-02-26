import { BaseModel } from '@models';

class Request extends BaseModel {
  static collectionName = 'requests';

  toJson() {
    return {
      json: this.json,
      processed: this.processed,
    }
  }
}

export default Request;