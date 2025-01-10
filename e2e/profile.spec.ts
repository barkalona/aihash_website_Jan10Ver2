import { test, expect } from '@playwright/test';

test.describe('User Profile', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth');
    await page.getByPlaceholderText('Email').fill('test@example.com');
    await page.getByPlaceholderText('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Navigate to profile
    await page.getByRole('button', { name: /profile/i }).click();
  });

  test('displays profile sections', async ({ page }) => {
    await expect(page.getByText('Profile Settings')).toBeVisible();
    await expect(page.getByRole('button', { name: /general/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /security/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /wallets/i })).toBeVisible();
  });

  test('updates profile information', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('John Doe');
    await page.getByLabel(/display name/i).fill('johndoe');
    await page.getByRole('button', { name: /save changes/i }).click();
    
    await expect(page.getByText(/profile updated/i)).toBeVisible();
  });

  test('enables two-factor authentication', async ({ page }) => {
    await page.getByRole('button', { name: /security/i }).click();
    await page.getByRole('button', { name: /set up 2fa/i }).click();
    
    await expect(page.getByText(/scan this qr code/i)).toBeVisible();
    
    // Enter verification code
    await page.getByPlaceholderText(/verification code/i).fill('123456');
    await page.getByRole('button', { name: /verify/i }).click();
    
    await expect(page.getByText(/2fa successfully enabled/i)).toBeVisible();
  });

  test('connects wallet', async ({ page }) => {
    await page.getByRole('button', { name: /wallets/i }).click();
    await page.getByRole('button', { name: /add wallet/i }).click();
    
    await page.getByLabel(/blockchain/i).selectOption('sui');
    await page.getByLabel(/wallet address/i).fill('0x123...abc');
    await page.getByRole('button', { name: /add wallet/i }).click();
    
    await expect(page.getByText(/wallet added/i)).toBeVisible();
  });
});