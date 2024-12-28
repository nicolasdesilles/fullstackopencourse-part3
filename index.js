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




let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (request, response) => {
  Person
    .find({})
    .then(result => {
      response.json(result)
    })
  
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(item => item.id === id)

  if (person) {
    response.json(person)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()

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

  if (persons.find(person => person.name === name)) {
    return response.status(400).json({
      error: 'Name must be unique (name is already in phonebook)'
    })
  }

  const id = Math.floor(Math.random() * 1000000)

  const newPerson = {
    "id": String(id),
    "name": name,
    "number": number
  }

  persons = persons.concat(newPerson)

  //console.log(newPerson)
  response.json(newPerson)
})

app.get('/', (request, response) => {
  response.send('<h1>Hello from the phonebook backend server!</h1>')
})

app.get('/info', (request, response) => {
  const currentTime = Date()
  const numberOfEntries = persons.length
  response.send(`<p>Phonebook has info for ${numberOfEntries} people</p> <p>Request received at time: ${currentTime}</p>`)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})