import Blog from './Blog'
import { Link } from 'react-router-dom'
import { Typography, Box } from '@mui/material'



const BlogList = ({ blogs }) => {

  return(
    <Typography component="div" sx={{ padding: 2 }}>
      <h2>blogs</h2>
      <ul>
        {blogs.map(blog => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>{blog.title} by {blog.author}</Link>
          </li>
        ))}
      </ul>
    </Typography>
  )
}

export default BlogList