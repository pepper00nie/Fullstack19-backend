require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('res-body', req => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
})

const morganConf = ':method :url :status :res[content-length] - :response-time ms :res-body'
app.use(morgan(morganConf))

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(n => n.toJSON()))
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Person
    .findById(req.params.id)
    .then(person => {
      person ? res.json(person.toJSON()) : res.status(404).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {
  const name = req.body.name
  const number = req.body.number

  const newPerson = new Person({ name: name, number: number })

  newPerson
    .save()
    .then(result => {
      res.json(result.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const newContact = {
    name: req.body.name,
    number: req.body.number
  }

  Person
    .findByIdAndUpdate(req.params.id, newContact, { new: true })
    .then(result => {
      res.json(result.toJSON())
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Person
    .findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (req, res) => {
  Person
    .countDocuments({}).then(r => {
      res.send(`
        <p>Phonebook has ${r} contacts</p>
        <p>${new Date()}</p>
      `)
    })
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
  console.log(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return res.status(400).send({ error: 'incorrect id format' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})