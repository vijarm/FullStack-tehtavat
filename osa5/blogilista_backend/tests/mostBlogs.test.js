const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

describe('most blogs', () => {
  
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
        const result = listHelper.mostBlogs(emptyList)
        assert.strictEqual(result, null)
    })

    test('when list has only one blog', () => {
        const correctResult = {
            author: "Edsger W. Dijkstra",
            blogs: 1
        }
        const result = listHelper.mostBlogs(listWithOneBlog)
        assert.deepStrictEqual(result, correctResult)
    })

    test('of a bigger list', () => {
        const correctResult = {
            author: "Robert C. Martin",
            blogs: 3
        }
        const result = listHelper.mostBlogs(manyBlogs)
        assert.deepStrictEqual(result, correctResult)

    })

})