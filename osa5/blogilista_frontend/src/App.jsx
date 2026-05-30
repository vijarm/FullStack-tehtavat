import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
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
    console.log('lisätty like ja järjestetty')
  }

  const deleteBlog = async blogToDelete => {
    console.log('Delete pyyntö tuli perille')
    try {
      console.log('deleting blog ', blogToDelete.title)
      await blogService.remove(blogToDelete)

      setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))

      setNotification({ message: `Blog deleted successfully: ${blogToDelete.title} by ${blogToDelete.author}`, type: 'confirm' })
      setTimeout(() => {
        setNotification({ message: null })
      }, 5000)

    } catch (error) {
      console.log(`Failed to delete blog: ${error.response}`)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        <label>
          username
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </label>
      </div>
      <button type="submit">login</button>
    </form>
  )

  const showBlogs = () => {
    return(
      <div>
        <h2>blogs</h2>
        {blogs.map(blog =>
          <Blog key={blog.id} blog={blog} addNewLike={addNewLike} user={user} deleteBlog={deleteBlog} />
        )}
      </div>
    )
  }

  const loggedMenu = () => {
    return(
      <div>
        <p>{user.name} logged in</p>
        <button type="button" onClick={handleLogout}>Log out</button>
      </div>
    )
  }

  const createBlog = async (event, newBlog) => {
    event.preventDefault()
    console.log('creating new blog: ', newBlog)
    try {
      const postedBlog = await blogService.create(newBlog)
      console.log('added blog:', postedBlog)
      setBlogs(blogs.concat(postedBlog))
      setNotification({ message: `New blog added successfully: ${postedBlog.title} by ${postedBlog.author}`, type: 'confirm' })
      setTimeout(() => {
        setNotification({ message: null })
      }, 5000)
      createBlogFormRef.current.toggleVisibility()
    } catch (error) {
      setNotification({ message: `Failed to create new blog: ${error.response.data.error}`, type: 'error' })
      setTimeout(() => {
        setNotification({ message: null })
      }, 5000)
    }
  }

  const createBlogFormRef = useRef()

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    setUser(null)
    setNotification({ message: 'logged out succesfully', type: 'confirm' })
    setTimeout(() => {
      setNotification({ message: null })
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()
    console.log('logging in with', username)
    try {
      const user = await loginService.login({ username, password })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      setUser(user)
      blogService.setToken(user.token)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({ message: 'wrong username or password', type: 'error' })
      setTimeout(() => {
        setNotification({ message: null })
      }, 5000)
    }
  }

  return (
    <div>
      <Notification message={notification.message} type={notification.type} />
      {!user && loginForm()}
      {user && loggedMenu()}
      {user && (
        <Togglable buttonLabel="create new blog" ref={createBlogFormRef}>
          <CreateBlogForm createBlog={createBlog} user={user} />
        </Togglable>
      )}
      {user && showBlogs()}

    </div>
  )
}

export default App