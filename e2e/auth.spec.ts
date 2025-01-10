import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth');
  });

  test('shows sign in form by default', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(page.getByPlaceholderText('Email')).toBeVisible();
    await expect(page.getByPlaceholderText('Password')).toBeVisible();
  });

  test('toggles between sign in and sign up', async ({ page }) => {
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await page.getByText(/don't have an account/i).click();
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible();
  });

  test('validates email format', async ({ page }) => {
    await page.getByPlaceholderText('Email').fill('invalid-email');
    await page.getByPlaceholderText('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText('Invalid email address')).toBeVisible();
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.getByPlaceholderText('Email').fill('test@example.com');
    await page.getByPlaceholderText('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
  });

  test('redirects to dashboard after successful login', async ({ page }) => {
    await page.getByPlaceholderText('Email').fill('test@example.com');
    await page.getByPlaceholderText('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/');
  });
});

test.describe('Protected Routes', () => {
  test('redirects to login when accessing protected route', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page).toHaveURL('/auth');
  });

  test('maintains protected route access after login', async ({ page }) => {
    await page.goto('/marketplace');
    await expect(page).toHaveURL('/auth');
    
    await page.getByPlaceholderText('Email').fill('test@example.com');
    await page.getByPlaceholderText('Password').fill('password123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    await expect(page).toHaveURL('/marketplace');
  });
});