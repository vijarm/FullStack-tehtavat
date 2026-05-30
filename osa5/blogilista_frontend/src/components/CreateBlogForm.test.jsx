import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('New blog is being created with correct information from input fields', async () => {

  const createBlog = vi.fn()
  render(<CreateBlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  const titleInput = screen.getByRole('textbox', { name: 'title:' })
  const authorInput = screen.getByRole('textbox', { name: 'author:' })
  const urlInput = screen.getByRole('textbox', { name: 'url:' })

  const sendButton = screen.getByText('create blog')

  await user.type(titleInput, 'School of Wizards')
  await user.type(authorInput, 'Harry Writer')
  await user.type(urlInput, 'www.potter.com')
  await user.click(sendButton)

  /*
  const sentData = createBlog.mock.calls[0][1]
  console.log('Tässä muodossa mockin data:')
  console.log(sentData)
  */

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][1].title).toBe('School of Wizards')
  expect(createBlog.mock.calls[0][1].author).toBe('Harry Writer')
  expect(createBlog.mock.calls[0][1].url).toBe('www.potter.com')

})
