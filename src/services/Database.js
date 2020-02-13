import mongo from 'mongodb';

const DATABASE_NAME = 'keys';

class Database {
  constructor() {
    this.mongoUrl = process.env.MONGO_URL;
  }

  async setClient() {
    const a = 'mongodb://engineering:AtThisPoint@cluster0-shard-00-00-xwdex.mongodb.net:27017,cluster0-shard-00-01-xwdex.mongodb.net:27017,cluster0-shard-00-02-xwdex.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority'
    this.client = await new mongo.MongoClient(a, {
      useNewUrlParser: true,
    });

    await this.client.connect();
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
