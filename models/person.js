const mongoose = require('mongoose')

const url = process.env.MONGODB_URI;

mongoose.set('strictQuery',false)

console.log('Connecting to Mongo DB at', url)

mongoose.connect(url)
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String 
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)