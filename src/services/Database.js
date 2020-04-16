import mongo from 'mongodb';

const DATABASE_NAME = 'keys';

class Database {
  constructor() {
    this.mongoUrl = process.env.MONGO_URL;
  }

  async setClient() {
    this.client = await mongo.connect(this.mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  }

  static async getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
      await Database.instance.setClient();
    }
    return Database.instance;
  }

  static async getCollection(collectionName) {
    const instance = await Database.getInstance();
    const client = await instance.client;
    const database = client.db(DATABASE_NAME);

    return database.collection(collectionName)
  }
}

export default Database;
