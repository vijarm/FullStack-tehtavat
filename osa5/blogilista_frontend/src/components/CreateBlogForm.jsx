import { useState } from 'react'

const CreateBlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  return(
    <div>
      <h2>Create blog</h2>
      <form onSubmit={(event => createBlog(event, newBlog))}>
        <div>
          <label>
            title:
            <input
              type="text"
              name="title"
              value={newBlog.title}
              onChange={({ target }) => setNewBlog({ ...newBlog, [target.name]: target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            author:
            <input
              type="text"
              name="author"
              value={newBlog.author}
              onChange={({ target }) => setNewBlog({ ...newBlog, [target.name]: target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            url:
            <input
              type="text"
              name="url"
              value={newBlog.url}
              onChange={({ target }) => setNewBlog({ ...newBlog, [target.name]: target.value })}
            />
          </label>
        </div>
        <button type="submit">create blog</button>
      </form>
    </div>
  )
}

export default CreateBlogForm