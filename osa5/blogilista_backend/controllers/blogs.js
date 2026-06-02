const { info, error } = require('../utils/logger')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')


blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body

  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  info('Saving new blog:', blog)
  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const userId = request.user.id
  const toBeDeleted = await Blog.findById(request.params.id)
  if ( toBeDeleted.user.toString() != userId.toString() ) {
    return response.status(401).json({ error: 'User does not have permission to delete this blog'})
  }
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
  const newLikes = request.body.likes

  console.log('request for blog', request.body)
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