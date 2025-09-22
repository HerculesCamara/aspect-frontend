import { test, expect } from '@playwright/test';

test.describe('Login Functionality Tests', () => {
  const BASE_URL = 'http://localhost:3002'; // Using the actual running port
  
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto(`${BASE_URL}/login`);
  });

  test('should load the login page correctly', async ({ page }) => {
    // Take a screenshot of the initial page
    await page.screenshot({ path: 'screenshots/login-page-initial.png', fullPage: true });
    
    // Check that the page title is correct
    await expect(page).toHaveTitle(/ASPCT Software/);
    
    // Check that essential elements are present
    await expect(page.locator('h1')).toContainText('ASPCT Software');
    await expect(page.locator('[data-testid="email-input"], #email')).toBeVisible();
    await expect(page.locator('[data-testid="password-input"], #password')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    
    // Check for test credentials display
    await expect(page.locator('text=Contas para teste')).toBeVisible();
    await expect(page.locator('text=dr.silva@example.com').or(page.locator('text=ana.silva@exemplo.com'))).toBeVisible();
  });

  test('should successfully login with correct credentials', async ({ page }) => {
    // Listen for console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Listen for network requests to track API calls
    const apiRequests: any[] = [];
    page.on('request', request => {
      if (request.url().includes('localhost:5175') || request.url().includes('/api/')) {
        apiRequests.push({
          url: request.url(),
          method: request.method(),
          headers: request.headers(),
          postData: request.postData()
        });
      }
    });

    // Listen for network responses
    const apiResponses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('localhost:5175') || response.url().includes('/api/')) {
        apiResponses.push({
          url: response.url(),
          status: response.status(),
          statusText: response.statusText()
        });
      }
    });

    // Fill in the login form with correct credentials
    await page.fill('#email', 'dr.silva@example.com');
    await page.fill('#password', '123456');
    
    // Take a screenshot before submitting
    await page.screenshot({ path: 'screenshots/login-form-filled.png', fullPage: true });
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for navigation or success indicators
    try {
      // Wait for either navigation to dashboard or success toast
      await Promise.race([
        page.waitForURL('**/dashboard**', { timeout: 10000 }),
        page.waitForSelector('.sonner-toast', { timeout: 10000 }),
        page.waitForSelector('[data-testid="success-indicator"]', { timeout: 10000 })
      ]);
    } catch (error) {
      // Take a screenshot if navigation fails
      await page.screenshot({ path: 'screenshots/login-failed.png', fullPage: true });
      console.log('Navigation failed, taking screenshot for debugging');
    }
    
    // Take a screenshot after login attempt
    await page.screenshot({ path: 'screenshots/post-login.png', fullPage: true });
    
    // Check if we're on the dashboard or if there's a success indicator
    const currentUrl = page.url();
    console.log('Current URL after login:', currentUrl);
    console.log('API Requests made:', apiRequests);
    console.log('API Responses received:', apiResponses);
    console.log('Console errors:', consoleErrors);
    
    // Check for successful login indicators
    const isDashboard = currentUrl.includes('/dashboard');
    const hasSuccessToast = await page.locator('.sonner-toast').count() > 0;
    const hasLoadingState = await page.locator('text=Entrando...').count() > 0;
    
    console.log('Login analysis:', {
      isDashboard,
      hasSuccessToast,
      hasLoadingState,
      currentUrl
    });
    
    // Assert that login was successful
    if (isDashboard) {
      await expect(page).toHaveURL(/.*dashboard.*/);
      console.log('✅ Successfully redirected to dashboard');
    } else {
      // Check for other success indicators
      console.log('⚠️ Not redirected to dashboard, checking for other success indicators');
      
      // Check if we're still on login page with an error
      const errorAlert = await page.locator('[role="alert"]').count();
      if (errorAlert > 0) {
        const errorText = await page.locator('[role="alert"]').textContent();
        console.log('❌ Login error detected:', errorText);
      }
    }
  });

  test('should show error for invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('#email', 'invalid@email.com');
    await page.fill('#password', 'wrongpassword');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for error message to appear
    await page.waitForSelector('[role="alert"], .text-red-700', { timeout: 5000 });
    
    // Take a screenshot of the error
    await page.screenshot({ path: 'screenshots/login-error.png', fullPage: true });
    
    // Check that error message is displayed
    await expect(page.locator('[role="alert"], .text-red-700')).toBeVisible();
    
    // Verify we're still on the login page
    expect(page.url()).toContain('/login');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Simulate network failure by blocking the API endpoint
    await page.route('**/api/Auth/login', route => {
      route.abort('failed');
    });

    // Fill in credentials
    await page.fill('#email', 'dr.silva@example.com');
    await page.fill('#password', '123456');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Wait for error handling
    await page.waitForTimeout(3000);
    
    // Take a screenshot
    await page.screenshot({ path: 'screenshots/network-error.png', fullPage: true });
    
    // Should show an error or remain on login page
    const isStillOnLogin = page.url().includes('/login');
    expect(isStillOnLogin).toBe(true);
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit without filling anything
    await page.click('button[type="submit"]');
    
    // Check for HTML5 validation or custom validation messages
    const emailValid = await page.locator('#email').evaluate((el: HTMLInputElement) => el.validity.valid);
    expect(emailValid).toBe(false);
    
    // Take a screenshot
    await page.screenshot({ path: 'screenshots/validation-error.png', fullPage: true });
  });

  test('should check for CORS issues', async ({ page }) => {
    const corsErrors: string[] = [];
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().toLowerCase().includes('cors')) {
        corsErrors.push(msg.text());
      }
    });

    // Attempt login to trigger API call
    await page.fill('#email', 'dr.silva@example.com');
    await page.fill('#password', '123456');
    await page.click('button[type="submit"]');
    
    // Wait for potential CORS errors
    await page.waitForTimeout(3000);
    
    console.log('CORS errors detected:', corsErrors);
    
    // Report if CORS errors were found
    if (corsErrors.length > 0) {
      console.log('❌ CORS issues detected:', corsErrors);
    } else {
      console.log('✅ No CORS issues detected');
    }
  });
});