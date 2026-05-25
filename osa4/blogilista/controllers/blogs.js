const { info, error } = require('../utils/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
  const body = request.body
  const blog = new Blog(request.body)

  info('Saving new blog:', blog)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const newLikes = request.body.likes

  const edittingBlog = await Blog.findById(request.params.id)

  if (!edittingBlog) {
    response.status(404).end()
  }

  edittingBlog.likes = newLikes

  const edittedBlog = await edittingBlog.save()
  info(`Editted post ${edittedBlog.id}, new amount of likes: ${edittedBlog.likes}`)
  response.status(200).json(edittedBlog)
})

module.exports = blogsRouter