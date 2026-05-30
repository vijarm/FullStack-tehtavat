import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Testing how blog information shows up', () => {
  beforeEach(() => {

    const blog = {
      title: 'Can you render this plz',
      author: 'DoNotRender',
      url: 'www.donotshow.com',
      likes: 2,
      user: { username: 'kirjailija' }
    }

    const fakeuser = {
      user: { username: 'satikuti' }
    }

    render(<Blog blog={blog} user={fakeuser} />)
  })

  test('blog renders only title as default', () => {

    const titleElement = screen.getByText('Can you render this plz')
    const urlElement = screen.queryByText('www.donotshow.com')
    const likesElement = screen.queryByText('likes:')

    expect(titleElement).toBeDefined()
    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })


  test('url and likes show up after clickiing view button', async () => {

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const urlElement = screen.getByText('www.donotshow.com', { exact: false })
    const likesElement = screen.getByText('Likes: 2', { exact: false })
    const authorElement = screen.getByText('DoNotRender', { exact: false })

    expect(urlElement).toBeVisible()
    expect(likesElement).toBeVisible()
    expect(authorElement).toBeVisible()
  })
})

test('clicking like button twice calls function addLikeToBlog twice', async () => {

  const blog = {
    title: 'Can you render this plz',
    author: 'DoNotRender',
    url: 'www.donotshow.com',
    likes: 2,
    user: { username: 'kirjailija' }
  }

  const fakeuser = {
    user: { username: 'satikuti' }
  }

  const addLikeToBlog = vi.fn()
  render(<Blog blog={blog} user={fakeuser} addNewLike={addLikeToBlog} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByRole('button', { name: 'like' })
  await user.click(likeButton)
  await user.click(likeButton)

  expect(addLikeToBlog.mock.calls).toHaveLength(2)
})
