
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log("Connecting to", url)
mongoose.connect(url, { family: 4 })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String, 
    validate: {
      validator: function(v) {
        return (/^\d{2,3}-[0-9]*$/.test(v) && v.length >= 8)
      }, 
      message: props => `${props.value}. Numeron täytyy alkaa 2-3 numerolla ja väliviivalla ("XX-" tai "XXX-") ja olla vähintään 8 merkkiä pitkä.`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

module.exports = mongoose.model('Person', personSchema)
