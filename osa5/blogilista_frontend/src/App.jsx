import { useState, useEffect } from 'react'
import { Container, AppBar, Button, Toolbar, Typography } from '@mui/material'

import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import BlogList from './components/BlogList'
import LoginForm from './components/LoginForm'
import LogoutButton from './components/LogoutButton'

import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState({ message: null })
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort((a,b) => b.likes - a.likes) )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const kuittaus = ({ message, type }) => {
    setNotification({ message: message, type: type })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const addNewLike = async blog => {
    const updatedBlog = ({ ...blog, likes: blog.likes + 1 })
    try {
      const result = await blogService.put(updatedBlog)
      console.log('added like to blog:', result)
    } catch (error) {
      console.log(`Failed to add like: ${error.response}`)
    }
    const newBlogs = blogs.map(blog => blog.id !== updatedBlog.id ? blog : updatedBlog)
    setBlogs( newBlogs.sort((a,b) => b.likes - a.likes) )
    kuittaus({ message: `You liked blog ${blog.title} by ${blog.author}`, type: 'success' })
  }

  const deleteBlog = async blogToDelete => {
    console.log('Delete pyyntö tuli perille')
    try {
      console.log('deleting blog ', blogToDelete.title)
      await blogService.remove(blogToDelete)
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
      kuittaus({ message: `Blog deleted successfully: ${blogToDelete.title} by ${blogToDelete.author}`, type: 'success' })

    } catch (error) {
      console.log(`Failed to delete blog: ${error.response}`)
    }
  }

  const createBlog = async (event, newBlog) => {
    event.preventDefault()
    console.log('creating new blog: ', newBlog)
    try {
      const postedBlog = await blogService.create(newBlog)
      const fullBlog = await blogService.getById(postedBlog.id) //Jotta hakee user-objektin kaikki tiedot
      setBlogs(blogs.concat(fullBlog))
      console.log('added FULL blog with populated user info:', fullBlog)
      kuittaus({ message: `New blog added successfully: ${fullBlog.title} by ${fullBlog.author}`, type: 'success' })
      return true
    } catch (error) {
      console.log('Virhe: ', error)
      kuittaus({ message: `Failed to create new blog: ${error.response.data.error}`, type: 'error' })
      return false
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    kuittaus({ message: 'logged out succesfully', type: 'success' })
  }

  const handleLogin = async (username, password) => {
    console.log('logging in with', username)
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      kuittaus({ message: `logged in as ${user.name}`, type: 'success' })
      return true
    } catch {
      kuittaus({ message: 'wrong username or password', type: 'error' })
      return false
    }
  }

  return (
    <Container>
      <Router>
        <div>
          <div>
            <AppBar position="static">
              <Toolbar>
                <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>Blog app</Typography>
                <Button color='inherit' component={Link} to="/">blogs</Button>
                { user && <Button color='inherit' component={Link} to="/newblog">new blog</Button> }
                { user
                  ? <LogoutButton handleLogout={handleLogout} />
                  : <Button color='inherit' component={Link} to='/login'>login</Button>
                }
              </Toolbar>
            </AppBar>
          </div>
          <div>
            <Notification message={notification.message} type={notification.type} />
          </div>

          <Routes>
            <Route path="/" element={
              <BlogList blogs={blogs} addNewLike={addNewLike} deleteBlog={deleteBlog} user={user} />
            } />
            <Route path="/login" element={
              <LoginForm handleLogin={handleLogin} />
            } />
            <Route path="/newblog" element={
              <CreateBlogForm createBlog={createBlog} user={user} />
            } />
            <Route path="/blogs/:id" element={
              <Blog blogs={blogs} addNewLike={addNewLike} user={user} deleteBlog={deleteBlog} />
            } />
          </Routes>
        </div>
      </Router>
    </Container>
  )
}

export default App