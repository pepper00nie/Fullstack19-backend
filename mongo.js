const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log("give password")
  process.exit(1)
}

const pwd = process.argv[2]
const url = `mongodb+srv://fullstack19:${pwd}@cluster0-d3ege.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({ name: String, number: String })
const Person = new mongoose.model('Person', personSchema)

if (process.argv.length === 4) {
  const id = process.argv[3]
  Person
    .findById(id)
    .then(person => {
      console.log(person)
      mongoose.connection.close()
    })
} else if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({ name: name, number: number })

  person.save().then(res => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
} else {
  Person
    .find({})
    .then(res => {
      res.forEach(n => console.log(`${n.name} ${n.number} ${n.id}`))
      mongoose.connection.close()
    })
}