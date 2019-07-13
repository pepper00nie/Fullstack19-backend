const express = require('express')
const app = express()
const bodyParser = require('body-parser')

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 1
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 2
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 3
  },
  {
    name: "Jorma",
    number: "1234-5678",
    id: 4
  }
]

app.use(bodyParser.json())

app.get('/info', (req, res) => {
  const info = `
    <p>Phonebook has ${persons.length} contacts.</p>
    <p>${new Date()}</p>
  `
  res.send(info)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const note = (persons.find(n => n.id === Number(req.params.id)))
  note ? res.json(note) : res.status(404).end()
})

app.post('/api/persons', (req, res) => {
  const name = req.body.name
  const number = req.body.number

  if (!name || !number) {
    return res.status(400).json({ error: "missing name or number in request" })
  }

  if (persons.some(n => n.name === name)) {
    return res.status(409).json({ error: "name already exists in phonebook" })
  }

  const newId = Math.floor(Math.random() * Math.floor(1000000))
  const newPerson = {
    name: name,
    number: number,
    id: newId
  }
  persons = persons.concat(newPerson)
  
  res.json(newPerson)
})

app.delete('/api/persons/:id', (req, res) => {
  persons = persons.filter(n => n.id !== Number(req.params.id))
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`)
})