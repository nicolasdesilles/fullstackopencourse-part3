require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

const Person = require('./models/person')

morgan.token('contents', (request, response) => {
  const body = request.body

  if (!body) {
    return 'Request had no contents'
  }
  else {
    return JSON.stringify(body)
  }
})

app.use(express.static('dist'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms - :contents'))

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(result => {
      response.json(result)
    })
  
})

app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(person => {
      response.json(person)
    })
})

app.delete('/api/persons/:id', (request, response) => {

  /*
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
  */

})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'Name and Number missing'
    })
  }

  if (!body.name) {
    return response.status(400).json({
      error: 'Name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'Number missing'
    })
  }
 
  const name = body.name
  const number = body.number

  const newPerson = new Person({
    name: name,
    number: number
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })

})

app.get('/', (request, response) => {
  response.send('<h1>Hello from the phonebook backend server!</h1>')
})

app.get('/info', (request, response) => {
  const currentTime = Date()
  Person
    .find({})
    .then(result => {
      const numberOfEntries = result.length
      response.send(`<p>Phonebook has info for ${numberOfEntries} people</p> <p>Request received at time: ${currentTime}</p>`)
    })
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})