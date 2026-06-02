import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TextField, Button } from '@mui/material'

const CreateBlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const navigate = useNavigate()

  const clickCreateBlog = async event => {
    event.preventDefault()
    const createOk = await createBlog(event, newBlog)
    if (createOk) { navigate('/') }
  }

  return(
    <div>
      <h2>Create blog</h2>
      <form onSubmit={ clickCreateBlog }>
        <div>
          <TextField
            label='title'
            type='text'
            name='title'
            variant='filled'
            size='small'
            margin='dense'
            value={newBlog.title}
            onChange={({ target }) => setNewBlog({ ...newBlog, [target.name]: target.value })}
          />
        </div>
        <div>
          <TextField
            label='author'
            type='text'
            name='author'
            variant='filled'
            size='small'
            margin='dense'
            value={newBlog.author}
            onChange={({ target }) => setNewBlog({ ...newBlog, [target.name]: target.value })}
          />
        </div>
        <div>
          <TextField
            label='url'
            type='text'
            name='url'
            variant='filled'
            size='small'
            margin='dense'
            value={newBlog.url}
            onChange={({ target }) => setNewBlog({ ...newBlog, [target.name]: target.value })}
          />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop: 10 }} >create blog</Button>
      </form>
    </div>
  )
}

export default CreateBlogForm