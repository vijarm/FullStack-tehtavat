import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'

const Blog = ({ blogs, addNewLike, deleteBlog, user }) => {

  const id = useParams().id
  const blog = blogs.find(n => n.id === id)

  const navigate = useNavigate()

  //Oliko tää oikeasti helpoin tapa, pitkään tappelin. Mutta nyt remove näkyy niin uusilla kuin vanhoilla blogeilla.
  const blogUserId = blog.user.id
    ? blog.user.id
    : blog.user.toString()

  const handleDeleteClick = event => {
    event.preventDefault()
    if (window.confirm(`Are you sure you want to delete blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
      navigate('/')
    }
  }

  return (
    <div data-testid='blog-item'>
      <div>
        <h2>{blog.author}: {blog.title}</h2>
      </div>
      <div>
        <a href={blog.url} target="_blank">{blog.url}</a> <br />
        likes: {blog.likes} { user && (<button onClick={() => addNewLike(blog)}>like</button>) } <br />
        Added by {blog.user.name} <br />
        { user && (blogUserId === user.id) && (<button onClick={handleDeleteClick}>remove</button>) }
      </div>
    </div>
  )
}

export default Blog