import { MongoClient } from 'mongodb'
const mongoURL = process.env.PLATFORM_MONGO_URL || ''
// const MongoClient = mongodb.MongoClient;

let mongoConnection = new MongoClient(mongoURL)
if (mongoURL) {
  mongoConnection = new MongoClient(mongoURL)
  mongoConnection
    .connect()
    .then(() => {
      console.log('mongoDb Connected')
    })
    .catch(e => {
      console.log(e)
    })
}

const platformDB = mongoConnection
export default platformDB