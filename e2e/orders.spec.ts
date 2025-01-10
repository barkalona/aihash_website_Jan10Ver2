import { test, expect } from '@playwright/test';

test.describe('Orders', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth');
    await page.getByPlaceholderText('Email').fill('test@example.com');
    await page.getByPlaceholderText('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await page.goto('/orders');
  });

  test('displays orders list', async ({ page }) => {
    await expect(page.getByText('My Orders')).toBeVisible();
    await expect(page.getByPlaceholderText(/search orders/i)).toBeVisible();
  });

  test('filters orders', async ({ page }) => {
    await page.getByRole('combobox', { name: /status/i }).selectOption('active');
    await expect(page.getByText(/active/i)).toBeVisible();
    
    await page.getByRole('combobox', { name: /sort/i }).selectOption('date_desc');
  });

  test('views order details', async ({ page }) => {
    await page.getByText(/view details/i).first().click();
    
    await expect(page.getByText('Order Details')).toBeVisible();
    await expect(page.getByText(/hash power/i)).toBeVisible();
    await expect(page.getByText(/total price/i)).toBeVisible();
  });

  test('displays order timeline', async ({ page }) => {
    await page.getByText(/view details/i).first().click();
    
    await expect(page.getByText('Order Timeline')).toBeVisible();
    await expect(page.getByText(/order created/i)).toBeVisible();
  });
});