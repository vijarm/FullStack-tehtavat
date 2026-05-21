require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')


morgan.token('postData', function getBody (req) {
  if (req.method === 'POST') {
    return (JSON.stringify(req.body))
  }
  /*return ("Testi: Ei ole POST tyyppinen")*/
})

app.use(express.static('dist'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findById(id).
    then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  console.log('Poistetaan tiedot id:ltä ' + id)
  Person.findByIdAndDelete(id).
    then(result => {
      console.log(`Poistettiin id:ltä ${id} tiedot: `, result)
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.find({}).then(list => {
    const requestTime = new Date().toLocaleString()
    response.send(
      `<p>Puhelinluettelossa on ${list.length} nimeä.</p>
      <p>Pyyntö vastaanotettu ${requestTime}.</p>`
    )
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(request.body)


  /*backend tuplanimen tarkistus, pitää muuttaa Person .... Mutta ei ollut (vielä) tehtävissä
  if ((persons.map(person => person.name)).includes(body.name)) {
    return response.status(400).json({
      error: 'Nimi on jo luettelossa!'
    })
  }
  */

  const newPerson = new Person({
    name: body.name,
    number: body.number,
  })

  newPerson.save().then(addedPerson => {
    response.json(addedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body
  const id = request.params.id
  Person.findById(id).
    then (person => {
      if (!person)  {
        return response.status(404).end()
      }
      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})



const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})