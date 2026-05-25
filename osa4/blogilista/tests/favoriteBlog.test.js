const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('favorite blog', () => {
  
    const emptyList = []

    const listWithOneBlog = [
        {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
        }
    ]

    const manyBlogs = listHelper.testBlogs

    test('with empty list is null', () => {
        const result = listHelper.favoriteBlog(emptyList)
        assert.strictEqual(result, null)
    })

    test('when list has only one blog', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        assert.strictEqual(result, listWithOneBlog[0])
    })

    test('of a bigger list', () => {
        const result = listHelper.favoriteBlog(manyBlogs)
        assert.strictEqual(result, manyBlogs[2])

        console.log(manyBlogs[2])
        console.log[result]
    })

})