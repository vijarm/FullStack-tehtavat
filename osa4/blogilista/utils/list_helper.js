const dummy = (blogs) => {
    return (
        1
    )
}

const totalLikes = (blogs) => {
    return (
        blogs.reduce(
        (accumulator, blog) => accumulator + blog.likes,
        0)
    )
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return (null)

    return (
        blogs.reduce(
            (mostLikes, blog) => {
                if (mostLikes.likes < blog.likes) 
                    {return blog} 
                else { return mostLikes}
            },
        blogs[0]
        )
    )
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return (null)

    let authors = []
    for (const blog of blogs) {
        if (!authors.some(author => author.author === blog.author)) {
            authors.push({"author": blog.author, "blogs": 1})
        } else {
            const count = authors.find(author => author.author === blog.author)
            count.blogs += 1
        }
    }

    return (
        authors.reduce(
            (mostBlogs, author) => {
                if (mostBlogs.blogs < author.blogs) 
                    {return author} 
                else { return mostBlogs}
            }, authors[0]
        )
    )
}

const mostLikedAuthor = (blogs) => {
    if (blogs.length === 0) return (null)

    let authors = []
    for (const blog of blogs) {
        if (!authors.some(author => author.author === blog.author)) {
            authors.push({"author": blog.author, "likes": blog.likes})
        } else {
            const updatingAuthor = authors.find(author => author.author === blog.author)
            updatingAuthor.likes = updatingAuthor.likes + blog.likes
        }
    }

    return (
        authors.reduce(
            (mostLiked, author) => {
                if (mostLiked.likes < author.likes) 
                    {return author} 
                else { return mostLiked}
            }, authors[0]
        )
    )
}

const testBlogs = [
    {
        _id: "5a422a851b54a676234d17f7",
        title: "React patterns",
        author: "Michael Chan",
        url: "https://reactpatterns.com/",
        likes: 7,
        __v: 0
    },
    {
        _id: "5a422aa71b54a676234d17f8",
        title: "Go To Statement Considered Harmful",
        author: "Edsger W. Dijkstra",
        url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
        likes: 5,
        __v: 0
    },
    {
        _id: "5a422b3a1b54a676234d17f9",
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12,
        __v: 0
    },
    {
        _id: "5a422b891b54a676234d17fa",
        title: "First class tests",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
        likes: 10,
        __v: 0
    },
    {
        _id: "5a422ba71b54a676234d17fb",
        title: "TDD harms architecture",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0,
        __v: 0
    },
    {
        _id: "5a422bc61b54a676234d17fc",
        title: "Type wars",
        author: "Robert C. Martin",
        url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
        likes: 2,
        __v: 0
    }  
]


module.exports = {
  testBlogs, 
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikedAuthor
}