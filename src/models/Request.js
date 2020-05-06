import { BaseModel } from '@models';

class Request extends BaseModel {
  static collectionName = 'requests';

  toJson() {
    return {
      data: this.data,
      processed: this.processed,
      flow: this.flow,
      error: this.error
    }
  }
}

export default Request;