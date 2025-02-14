const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Your password is required as an argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
`mongodb+srv://nicolas:${password}@fullstackopen.bbofk.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FullStackOpen`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  // No further arguments provided, we fetch all entries in the DB
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
}
else if (process.argv.length < 5) {
  console.log('Not enough information provided for new person entry (name or number missing)')
}
else if (process.argv.length === 5) {

  const name = process.argv[3]
  const number = process.argv[4]
  const id = Math.floor(Math.random() * 1000000)

  const person = new Person({
    id: id,
    name: name,
    number: number
  })

  person.save().then(() => {
    console.log(`Added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })

}
