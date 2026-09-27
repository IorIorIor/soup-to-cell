import { expect, test } from '@playwright/test'

const titles = [
  'The soup', 'Links', 'Folding', 'RNA that works', 'The bubble',
  'The protocell', 'The code', 'DNA: the archive', 'The minimal cell',
]

test('every chapter loads and its objects open learn cards', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))

  await page.goto('/')
  await expect(page.locator('canvas')).toBeVisible()

  for (let i = 0; i < titles.length; i++) {
    await page.goto(`/#/${i}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(titles[i])
    await page.getByRole('button', { name: 'Objects in this scene' }).click()
    const first = page.locator('#objects-list button').first()
    const name = await first.innerText()
    await first.click()
    await expect(page.getByRole('dialog')).toContainText(name)
    await expect(page.locator('.badge')).toBeVisible()
    await page.getByRole('button', { name: 'Close card' }).click()
    await page.getByRole('button', { name: 'Objects in this scene' }).click()
  }
  expect(errors).toEqual([])
})

test('an edit shows a caption and can be undone', async ({ page }) => {
  await page.goto('/#/0')
  await page.getByRole('button', { name: 'Environment' }).click()
  const temp = page.getByRole('slider').first()
  await temp.fill('90')
  await expect(page.locator('.caption')).toBeVisible({ timeout: 2000 })
  await page.getByRole('button', { name: 'Undo last edit' }).click()
  await expect(page.getByText('Undone: change temperature.')).toBeVisible()
  await expect(temp).toHaveValue('40')
})

test('chapter menu jumps between chapters', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open chapter menu' }).click()
  await page.getByRole('button', { name: /The bubble/ }).click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The bubble')
  await expect(page).toHaveURL(/#\/4$/)
})
