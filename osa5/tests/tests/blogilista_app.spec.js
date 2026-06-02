const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

//Mä nyt päivitän nämä vielä viimeisten tehtävien jälkeen
//kun notificationin muuttaminen alertiksi rikkoi testit

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

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      const notification = page.getByRole('alert')
      await expect(notification).toContainText('logged in as Matti Luukkainen')
      await expect(page.getByRole('button', { name: 'log out' })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'julkinen')

      const errorDiv = page.getByRole('alert')
      await expect(errorDiv).toContainText('wrong username or password')
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'blogin otsikko', 'kirjoittaja', 'www.bloginosoite.com')

      const notification = page.getByRole('alert')
      await expect(notification).toContainText('New blog added successfully: blogin otsikko by kirjoittaja')
      await expect(page.getByRole('link', { name: 'blogin otsikko by kirjoittaja' })).toBeVisible()
    })

    describe ('When there are blogs in database', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'blogin otsikko', 'kirjoittaja', 'www.bloginosoite.com')
      })

      test('posted blog can be liked', async ({ page }) => {
        await page.getByRole('link', { name: 'blogin otsikko by kirjoittaja' }).click()

        await expect(page.getByText('likes: 0')).toBeVisible()
        
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('likes: 1')).toBeVisible()
      })

      test('user can delete blog posted by itself', async ({ page }) => {
        page.on('dialog', async dialog => {
          expect(dialog.message()).toContain('Are you sure you want to delete blog')
         await dialog.accept()
        })

        await page.getByRole('link', { name: 'blogin otsikko by kirjoittaja' }).click()

        await page.getByRole('button', { name: 'remove' }).click()
        
        const notification = page.getByRole('alert')
        await expect(notification).toContainText('Blog deleted successfully: blogin otsikko by kirjoittaja')
        await expect(page.getByRole('link', { name: 'blogin otsikko by kirjoittaja' })).not.toBeVisible()
      })
    })
  })
})