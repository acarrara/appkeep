import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
  await page.goto('/home');

  // Wait for the form to be in the DOM (confirms auth passed and options/categories loaded).
  // The amount input is CSS-hidden behind a styled overlay, so we check for attached state.
  await page.waitForSelector('[data-testid="amount-input"]', {state: 'attached'});
});

test('adding an appkeep shows it in today\'s list', async ({page}) => {
  // The amount input is visually covered by a styled div overlay; force bypasses visibility check
  await page.locator('[data-testid="amount-input"]').fill('999', {force: true});
  await page.fill('[data-testid="description-input"]', 'E2E Coffee');
  await page.click('[data-testid="add-button"]');

  // The item is added after the POST /api/appkeeps response, so we wait for it
  const newItem = page.locator('[data-testid="appkeep-item"]').filter({hasText: 'E2E Coffee'});
  await expect(newItem).toBeVisible();
  await expect(newItem).toContainText('9.99');
});
