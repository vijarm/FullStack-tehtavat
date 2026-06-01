import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Blog from './Blog'

describe('Testing how blog information shows up', () => {

  const blogs = [
    {
      title: 'Can you render this plz',
      author: 'Rendered author',
      url: 'www.showup.com',
      likes: 3,
      user: { username: 'kirjailija', id: 'kirjailijaId' },
      id: 'blog1id'
    },
    {
      title: 'Do not render this plz',
      author: 'DoNotRender',
      url: 'www.donotshow.com',
      likes: 1,
      user: { username: 'haamukirjoittaja', id: 'haamuId' },
      id: 'blog2id'
    }
  ]

  test('when user is not logged, blog information is visible, but buttons to like or remove are not', () => {

    render(
      <MemoryRouter initialEntries={['/blogs/blog1id']}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={blogs}
                user={null}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    const blog1Title = screen.getByText('Can you render this plz', { exact: false })
    const blog2Title = screen.queryByText('Do not render this plz')
    const likes = screen.getByText('Likes: 3', { exact: false })

    expect(blog1Title).toBeDefined()
    expect(blog2Title).toBeNull()
    expect(likes).toBeDefined()
    expect(screen.queryAllByRole('button')).toHaveLength(0)  //kirjautumattomana ei näy yhtään nappia

  })

  test('logged user can see like button, but can not remove blogs posted by other users', () => {

    render(
      <MemoryRouter initialEntries={['/blogs/blog1id']}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={blogs}
                user={ { username: 'anotherUser', id: 'DifferentId' } }
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Can you render this plz', { exact: false })).toBeDefined()

    const likeButton = screen.getByRole('button', { name: 'like' })
    const removeButton = screen.queryByRole('button', { name: 'remove' })

    expect(likeButton).toBeDefined()
    expect(removeButton).toBeNull()

  })

  test('logged user can see remove button on blogs posted by itself', () => {

    render(
      <MemoryRouter initialEntries={['/blogs/blog1id']}>
        <Routes>
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blogs={blogs}
                user={ { username: 'kirjailija', id: 'kirjailijaId' } }
              />
            }
          />
        </Routes>
      </MemoryRouter>
    )

    expect(screen.getByText('Can you render this plz', { exact: false })).toBeDefined()

    const removeButton = screen.queryByRole('button', { name: 'remove' })
    expect(removeButton).toBeDefined()
    expect(screen.queryAllByRole('button')).toHaveLength(2) // Molemmat napit näkyy

  })
})