import { useState, useEffect } from 'react'

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
    kuittaus({ message: `You liked blog ${blog.title} by ${blog.author}`, type: 'confirm' })
  }

  const deleteBlog = async blogToDelete => {
    console.log('Delete pyyntö tuli perille')
    try {
      console.log('deleting blog ', blogToDelete.title)
      await blogService.remove(blogToDelete)
      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
      kuittaus({ message: `Blog deleted successfully: ${blogToDelete.title} by ${blogToDelete.author}`, type: 'confirm' })

    } catch (error) {
      console.log(`Failed to delete blog: ${error.response}`)
    }
  }

  const createBlog = async (event, newBlog) => {
    event.preventDefault()
    console.log('creating new blog: ', newBlog)
    try {
      const postedBlog = await blogService.create(newBlog)
      console.log('added blog:', postedBlog)
      setBlogs(blogs.concat(postedBlog))
      kuittaus({ message: `New blog added successfully: ${postedBlog.title} by ${postedBlog.author}`, type: 'confirm' })
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
    kuittaus({ message: 'logged out succesfully', type: 'confirm' })
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
      kuittaus({ message: `logged in as ${user.name}`, type: 'confirm' })
      return true
    } catch {
      kuittaus({ message: 'wrong username or password', type: 'error' })
      return false
    }
  }

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <div>
          <Link style={padding} to="/">blogs</Link>
          {user && <Link style={padding} to="/newblog">new blog</Link>}
          {user ? <LogoutButton handleLogout={handleLogout} /> : <Link style={padding} to="/login">login</Link> }
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
  )
}

export default App