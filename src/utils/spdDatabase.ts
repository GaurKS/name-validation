import { MongoClient } from 'mongodb'

const mongoURL = process.env.MONGO_URI || ''
// const MongoClient = mongodb.MongoClient;
let mongoConnection = new MongoClient(mongoURL)

if (mongoURL) {
  mongoConnection = new MongoClient(mongoURL)
  mongoConnection
    .connect()
    .then(() => {
      console.log('SP mongoDb Connected')
    })
    .catch(e => {
      console.log(e)
    })
}

const mongoDB = mongoConnection

export default mongoDB
