import mongodb from 'mongodb';

import Database from '@services/Database';

class BaseModel {
  constructor(data) {
    Object.assign(this, data);
    this.id = data.id || data._id ? data._id.toString() : undefined
    this.collectionName = this.constructor.collectionName;
  }

  // Instance methods
  async create() {
    const json = this.toJson();
    const collection = await Database.getCollection(this.collectionName);

    const pr = await collection.insertOne({
      ...json,
      createdAt: Date.now(),
     });

    this.id = pr.ops[0]._id.toString()
    return this;
  }

  async update() {
    const collection = await Database.getCollection(this.collectionName);
    const json = {
      ...this.toJson(),
      updatedAt: Date.now()
    };

    delete json.id

    const objectID = new mongodb.ObjectID(this.id)

    return await collection.updateOne({ _id: objectID }, { $set: json })
  }

  // Class methods
  static async list(query = {}) {
    const collection = await Database.getCollection(this.collectionName);
    const response = await collection.find(query);

    const array = await response.toArray()

    return array.map(a => new this(a))
  }

  static async findBy(query) {
    const collection = await Database.getCollection(this.collectionName);
    const response = await collection.findOne(query);
    if (!response) {
      return null;
    }

    return new this(response)
  }

  static async findById(id) {
    const objectID = new mongodb.ObjectID(id)
    return await this.findBy({ _id: objectID })
  }
}

export default BaseModel;