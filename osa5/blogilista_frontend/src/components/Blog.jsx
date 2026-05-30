import { useState } from 'react'

const Blog = ({ blog, addNewLike, deleteBlog, user }) => {

  const [showInfo, setShowInfo] = useState(false)

  const toggleShowInfo = () => {
    setShowInfo(!showInfo)
  }

  //Oliko tää oikeasti helpoin tapa, pitkään tappelin. Mutta nyt remove näkyy niin uusilla kuin vanhoilla.
  const blogUserId = blog.user.id
    ? blog.user.id
    : blog.user.toString()

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const handleDeleteClick = event => {
    event.preventDefault()
    if (window.confirm(`Are you sure you want to delete blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle} data-testid='blog-item'>
      <div>
        {blog.title} <button onClick={toggleShowInfo}>{showInfo && ('hide')}{!showInfo && ('view')}</button>
      </div>
      {showInfo && (
        <div>
          {blog.url} <br />
          likes: {blog.likes} <button onClick={() => addNewLike(blog)}>like</button><br />
          {blog.author} <br />
          {(blogUserId === user.id) && (
            <button onClick={handleDeleteClick}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog