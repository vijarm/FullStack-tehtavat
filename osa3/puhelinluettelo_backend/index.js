const express = require('express')
const morgan = require('morgan')
const app = express()


morgan.token('postData', function getBody (req) {
  if (req.method === "POST") {
    return (JSON.stringify(req.body))
  }
  /*return ("Testi: Ei ole POST tyyppinen")*/
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


let persons = [
  {
    "name": "Arto Hellas",
    "number": "040-123456",
    "id": "1"
  },
  {
    "name": "Ada Lovelace",
    "number": "39-44-5323523",
    "id": "2"
  },
  {
    "name": "Dan Abramov",
    "number": "12-43-234345",
    "id": "3"
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": "4"
  },
  {
    "name": "Harri Poppendieck",
    "number": "39-23-6423122",
    "id": "5"
  }
]

const generateId = () => {
  const randomID = Math.floor(Math.random() * 10000)
  return String(randomID)
}

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = request.params.id
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)
  console.log("Poistettu tiedot id:ltä " + id)
  response.status(204).end()
})

app.get('/info', (request, response) => {
  const requestTime = new Date().toLocaleString()
  response.send(
    `<p>Puhelinluettelossa on ${persons.length} nimeä.</p>
    <p>Pyyntö vastaanotettu ${requestTime}.</p>`
  )
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.body)

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Nimi tai numero puuttuu!' 
    })
  }

  if ((persons.map(person => person.name)).includes(body.name)) {
    return response.status(400).json({
      error: 'Nimi on jo luettelossa!'
    })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(newPerson)

  response.json(newPerson)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})