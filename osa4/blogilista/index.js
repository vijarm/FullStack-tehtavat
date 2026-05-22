const config = require('./utils/config')
const express = require('express')
const mongoose = require('mongoose')
const { info, error } = require('./utils/logger')
const blogsRouter = require('./controllers/blogs')
const app = express()

/*
const Blog = mongoose.model('Blog', blogSchema)
*/

mongoose.connect(config.MONGODB_URI, { family: 4 })
  .then(() => {
    info('connected to MongoDB')
  })
  .catch((error) => {
    error('error connection to MongoDB:', error.message)
  })

app.use(express.json())
app.use('/api/blogs', blogsRouter)

app.listen(config.PORT, () => {
  info(`Server running on port ${config.PORT}`)
})