import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Box } from '@mui/material'

const Blog = ({ blogs, addNewLike, deleteBlog, user }) => {

  const id = useParams().id
  const blog = blogs.find(n => n.id === id)

  const navigate = useNavigate()

  const handleDeleteClick = event => {
    event.preventDefault()
    if (window.confirm(`Are you sure you want to delete blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog)
      navigate('/')
    }
  }

  return (
    <div data-testid='blog-item'>
      <Box sx={{ m: 3 }}>
        <Typography variant='h4' sx={{ mb: 2 }} >{blog.title}</Typography>
        <Typography variant='h5' sx={{ mb: 1 }} >by {blog.author}</Typography>
        <Typography sx={{ mb: 1 }} ><a href={blog.url} target="_blank">{blog.url}</a></Typography>
        <Typography sx={{ mb: 1 }}>Added by {blog.user.name}</Typography>
        <Typography sx={{ fontWeight: '600' }} >likes: {blog.likes}  { user && (<Button variant='outlined' sx={{ ml: 1 }} color='success' onClick={() => addNewLike(blog)}>like</Button>) }
          { user && (blog.user.id === user.id) && (<Button variant='outlined' sx={{ ml: 1 }} color='error' onClick={handleDeleteClick}>remove</Button>) }
        </Typography>
      </Box>
    </div>
  )
}

export default Blog