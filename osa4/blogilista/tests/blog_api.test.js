const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const listHelper = require('../utils/list_helper')
const { info, error } = require('../utils/logger')

const api = supertest(app)

const initialBlogs = listHelper.testBlogs
const initialUsers = listHelper.testUsers

describe('testing blogs when there are blogs already saved', () => {

    beforeEach(async () => {
        await Blog.deleteMany({})
        await Blog.insertMany(initialBlogs)
    })

    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length)
    })

    test('id field is named \"id\"', async () => {
        const response = await api.get('/api/blogs')
        const idFieldName = Object.keys(response.body[0])[4]
        /*info ('Palautuvan objektin avaimien nimet:', Object.keys(response.body[0]))*/
        assert.strictEqual(idFieldName, 'id')
    })

    test('new blogs with correct information can be added with HTTP POST request', async () => {
        const newBlog = {
        title: 'How to test posting new blogs',  
        author: 'Test author',
        url: 'no url',
        likes: 3
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')
        const titles = response.body.map(r => r.title)

        assert.strictEqual(response.body.length, initialBlogs.length + 1)
        assert(titles.includes('How to test posting new blogs'))
    })

    test('new blog without likes will set likes to 0', async () => {
        const newBlogWithoutLikes = {
            title: 'Does anyone like this?',  
            author: 'Unknown',
            url: 'no url'
        }

        await api
            .post('/api/blogs')
            .send(newBlogWithoutLikes)
            .expect(201)

        const response = await api.get('/api/blogs')

        assert.strictEqual(response.body[(response.body.length - 1)].likes, 0)
    })

    test('new blog without title cannot be added, error code 400', async () => {
        const newBlogWithoutTitle = {
            author: 'Unknown',
            url: 'no url',
            likes: 3
        }

        await api
            .post('/api/blogs')
            .send(newBlogWithoutTitle)
            .expect(400)
    })

    test('new blog without url cannot be added, error code 400', async () => {
        const newBlogWithoutUrl = {
            title: 'This blog has no url',
            author: 'Unknown',
            likes: 3
        }

        await api
            .post('/api/blogs')
            .send(newBlogWithoutUrl)
            .expect(400)
    })

    test('a blog can be deleted', async () => {
        await api
            .delete('/api/blogs/5a422ba71b54a676234d17fb')
            .expect(204)
    
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, initialBlogs.length - 1)
    })

    test('a blog can be updated, new amount of likes is correct', async () => {
        const updatedInfo = {
            likes: 155
        }

        await api
            .put('/api/blogs/5a422ba71b54a676234d17fb')
            .send(updatedInfo)
            .expect(200)
    
        const response = await api.get('/api/blogs/5a422ba71b54a676234d17fb')
        assert.strictEqual(response.body.likes, 155)
    })

    test('updating a blog fails if blog id does not exist', async () => {
        const updatedInfo = {
            likes: 155
        }

        await api
            .put('/api/blogs/6a100ea1d3936a3bbb8b1866')
            .send(updatedInfo)
            .expect(404)
    })
})

describe('testing user database when there are users already saved', () => {
    
    beforeEach(async () => {
        await User.deleteMany({})
        await User.insertMany(initialUsers)
    })

    test('new user with correct information can be added with HTTP POST request', async () => {
        const newUser = {
            "username": "freeUserName",
            "name": "Käyttäjänimi",
            "password": "MyUniquePW"
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await listHelper.usersInDb()
        const usernames = response.map(r => r.username)

        assert.strictEqual(response.length, initialUsers.length + 1)
        assert(usernames.includes('freeUserName'))
    })

    test('creating user with too short password fails, error code 400', async () => {
        const newUser = {
            "username": "freeUserName",
            "name": "Käyttäjänimi",
            "password": "No"
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const response = await listHelper.usersInDb()
        assert.strictEqual(response.length, initialUsers.length)
        assert(result.body.error.includes('Password must be at least 4 characters long'))
    })

    test('creating user with username that is already in use fails, error code 400', async () => {
        const newUser = {
            "username": "HemppaVaan",
            "name": "Käyttäjänimi",
            "password": "MyUniquePW"
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const response = await listHelper.usersInDb()
        assert.strictEqual(response.length, initialUsers.length)
        assert(result.body.error.includes('username must be unique'))
    })

})


after(async () => {
    await mongoose.connection.close()
})