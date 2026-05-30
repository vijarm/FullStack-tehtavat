const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    const loginButton = page.getByRole('button', { name: 'login' })
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
      await expect(page.getByRole('button', { name: 'log out' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'julkinen')

      const errorDiv = page.locator('.error')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

    describe('When logged in', () => {
      beforeEach(async ({ page }) => {
        await loginWith(page, 'mluukkai', 'salainen')
      })

      test('a new blog can be created', async ({ page }) => {
        await createBlog(page, 'blogin otsikko', 'kirjoittaja', 'www.bloginosoite.com')

        const notification = page.locator('.confirm')
        await expect(notification).toContainText('New blog added successfully: blogin otsikko by kirjoittaja')
        await expect(page.getByText('blogin otsikko view')).toBeVisible()
      })

      test('posted blog can be liked', async ({ page }) => {
        await createBlog(page, 'blogin otsikko', 'kirjoittaja', 'www.bloginosoite.com')
        await expect(page.getByText('view')).toBeVisible()
        
        await page.getByText('view').click()
        await expect(page.getByText('likes: 0')).toBeVisible()
        
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 1')).toBeVisible()
      })
    })

    describe('When a blog is already in the database', () => {
      beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/users', {
          data: {
          name: 'Tapio Testinen',
          username: 'ttest',
          password: 'oipaT'
          }
        })

        await loginWith(page, 'mluukkai', 'salainen')
        await createBlog(page, 'blogin otsikko', 'kirjoittaja', 'www.bloginosoite.com')

      })

      test('a blog can be deleted by user who posted it', async ({ page }) => {
        
        page.on('dialog', async dialog => {
          expect(dialog.message()).toContain('Are you sure you want to delete blog')
          await dialog.accept()
        })

        await page.getByText('view').click()

        await expect(page.getByText('remove')).toBeVisible()
        await page.getByText('remove').click()
        
        const notification = page.locator('.confirm')
        await expect(notification).toContainText('Blog deleted successfully: blogin otsikko by kirjoittaja')
        await expect(page.getByText('remove')).not.toBeVisible()

      })

      test('only user who has created the blog can see remove button', async ({ page, request }) => {
        await page.getByText('Log out').click()
        await loginWith(page, 'ttest', 'oipaT')
        await page.getByText('view').click()
        await expect(page.getByText('remove')).not.toBeVisible()

      })

      test('blog with most likes is at the top', async ({ page }) => {
        await createBlog(page, 'tykätyin blogi', 'raapustelija', 'www.tykatyinblogi.com')
        await expect(page.getByText('tykätyin blogi view')).toBeVisible()
        
        await page.getByRole('button', { name: 'view' }).first().click()
        await page.getByRole('button', { name: 'view' }).last().click()
        
        await page.getByRole('button', { name: 'like' }).first().click()
        
        await expect(page.getByText('likes: 1')).toBeVisible()
        await expect(page.getByTestId('blog-item').first()).toContainText('blogin otsikko')

        await page.getByRole('button', { name: 'like' }).last().click()
        await expect(page.getByTestId('blog-item').last()).toContainText('likes: 1')
        await page.getByRole('button', { name: 'like' }).last().click()

        await expect(page.getByText('likes: 2')).toBeVisible()
        await expect(page.getByTestId('blog-item').first()).toContainText('tykätyin blogi')
        await expect(page.getByTestId('blog-item').first()).toContainText('likes: 2')
        

      })
    })



      
  })
  
})