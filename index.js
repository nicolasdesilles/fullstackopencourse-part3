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

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person 
    .findByIdAndDelete(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person 
    .findByIdAndUpdate(
      request.params.id, 
      person, 
      {new: true, runValidators: true, context: 'query'}
    )
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
 
  const name = body.name
  const number = body.number

  const newPerson = new Person({
    name: name,
    number: number
  })

  newPerson.save()
  .then(savedPerson => {
    response.json(savedPerson)
  })
  .catch(error => next(error))

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

const errorHandler = (error, request, response, next) => {

  console.error(`ERROR: ${error.message}`)

  if (error.name === 'CastError') {
    response.status(400).send({error: 'Malformatted ID'}).end()
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({error: error.message})
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})