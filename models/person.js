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
    name: {
      type: String,
      minLength: 3,
      required: [true,'Name is required']
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: value => /\d{2,3}-\d*/.test(value),
        message: props => `${props.value} is not a valid phone number`
      },
      required: [true,'Phone number is required']
    }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)