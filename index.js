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

morgan.token('res-body', (req, res) => {
  if (req.method === "POST") {
    return JSON.stringify(req.body)
  }
})

const morganConf = ':method :url :status :res[content-length] - :response-time ms :res-body'
app.use(morgan(morganConf))

app.get('/api/persons', (req, res) => {
  Person
    .find({})
    .then(persons => {
      res.json(persons.map(n => n.toJSON()))
    })
})

app.get('/api/persons/:id', (req, res) => {
  Person
    .findById(req.params.id)
    .then(person => {
      res.json(person.toJSON())
    })
})

app.post('/api/persons', (req, res) => {
  const name = req.body.name
  const number = req.body.number

  if (!name || !number) {
    return res.status(400).json({ error: "missing name or number in request" })
  }

  const newPerson = new Person({ name: name, number: number })

  newPerson
    .save()
    .then(result => {
      res.json(result.toJSON())
  })
})

app.delete('/api/persons/:id', (req, res) => {
  res.status(204).end()
})

app.get('/info', (req, res) => {
  const info = `
    <p>Phonebook</p>
    <p>${new Date()}</p>
  `
  res.send(info)
})

const port = process.env.PORT || 3001
app.listen(port, () => {
  console.log(`Server is running at port ${port}`)
})