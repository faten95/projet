const mongoose = require('mongoose')
const config = require('config')

const connectdb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
    })
    console.log('Mongoose connected')
  } catch (err) {
    console.log('Mongoose not connected')
  }
}
module.exports = connectdb
