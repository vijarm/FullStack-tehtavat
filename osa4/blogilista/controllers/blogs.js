const { info, error } = require('../utils/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
  Blog.find({}).then((blogs) => {
    response.json(blogs)
  })
})

blogsRouter.post('/', (request, response) => {
    const body = request.body
    info('got this info before saving:', body)
    const blog = new Blog(request.body)

  info('Saving new blog:', blog)
  blog.save().then((result) => {
    response.status(201).json(result)
  })
})



module.exports = blogsRouter