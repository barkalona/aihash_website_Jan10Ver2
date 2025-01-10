import { test, expect } from '@playwright/test';

test.describe('Marketplace Purchase Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login first
    await page.goto('/auth');
    await page.getByPlaceholderText('Email').fill('test@example.com');
    await page.getByPlaceholderText('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/');
    
    // Navigate to marketplace
    await page.goto('/marketplace');
  });

  test('completes purchase flow successfully', async ({ page }) => {
    // Wait for listings to load
    await expect(page.getByText('Hash Power Marketplace')).toBeVisible();
    
    // Click buy on first listing
    await page.getByRole('button', { name: /buy now/i }).first().click();
    
    // Fill purchase form
    await page.getByLabel(/hash power/i).fill('50');
    await expect(page.getByText(/total price/i)).toBeVisible();
    
    // Complete purchase
    await page.getByRole('button', { name: /purchase hash power/i }).click();
    await expect(page.getByText(/purchase successful/i)).toBeVisible();
    
    // Verify order appears in history
    await page.goto('/orders');
    await expect(page.getByText('50 TH/s')).toBeVisible();
  });

  test('validates purchase constraints', async ({ page }) => {
    await page.getByRole('button', { name: /buy now/i }).first().click();
    
    // Test minimum purchase
    await page.getByLabel(/hash power/i).fill('1');
    await page.getByRole('button', { name: /purchase hash power/i }).click();
    await expect(page.getByText(/minimum purchase/i)).toBeVisible();
    
    // Test maximum purchase
    await page.getByLabel(/hash power/i).fill('99999');
    await page.getByRole('button', { name: /purchase hash power/i }).click();
    await expect(page.getByText(/maximum purchase/i)).toBeVisible();
  });

  test('handles marketplace filters', async ({ page }) => {
    // Test algorithm filter
    await page.getByText('SHA-256').click();
    await expect(page.getByText(/sha-256/i)).toBeVisible();
    
    // Test price range filter
    await page.getByText(/price range/i).click();
    await page.getByText(/\$1 - \$5\/th/i).click();
    
    // Test search
    await page.getByPlaceholderText(/search/i).fill('Test Seller');
    await expect(page.getByText(/test seller/i)).toBeVisible();
  });
});