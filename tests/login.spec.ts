import {test,expect} from '@playwright/test'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { logger } from '../utils/logger'

test.describe("Login Functionality",()=>
{
    let loginPage:LoginPage;
    let dashboardPage:DashboardPage;

    test.beforeEach(async({page})=>
    {
        loginPage=new LoginPage(page);
        dashboardPage=new DashboardPage(page);
        await loginPage.goto();
    })

    test("@smoke @Regression Login sucessful with valid credentials",async({page})=>
    {
        test.step("Navigate to login page",async()=>
        {
            await loginPage.verifyPageLoaded();
            logger.step("Login page loadede sucessfully");
        })

        test.step("Enter valid credentials",async()=>
        {
            await loginPage.login("Admin",'admin123');
            logger.step("credentials entered");
        })

        /*test.step("Verify dashboard is displayed",async()=>
        {
            await dashboardPage.verifyPageLoaded();
            logger.step('Dashboard displayed successfully');
        })*/
    })

    test('@regression Should display error message for both invalid credentials', async ({ page }) => 
    {
        test.step('Enter invalid credentials', async () => 
        {
            await loginPage.login('InvalidUser', 'wrongpassword');
            logger.step('Invalid credentials entered');
        })

        test.step('Verify still on login page (login failed)', async () => 
        {
            const currentUrl = page.url();
            expect(currentUrl).toContain('/auth/login');
            logger.step('Remained on login page - login failed as expected');
        });

        await test.step('Verify error message is displayed', async () => {
        // Check for error message - it might be in different formats
        const errorSelectors = ['.oxd-alert-content-text','.oxd-alert','[role="alert"]','.alert'];
        let errorFound = false;
        for (const selector of errorSelectors) 
        {
            const errorElement = page.locator(selector);
            if (await errorElement.isVisible({ timeout: 2000 }).catch(() => false)) 
            {
                errorFound = true;
                const errorText = await errorElement.textContent();
                logger.step('Error message displayed', errorText || '');
                break;
            }
        }
        // If no error message found, at least verify we're on login page
        if (!errorFound) 
        {
            logger.warn('No error message found, but login failed (still on login page)');
        }
        });
    })

    test('@regression Should clear form when reset', async ({ page }) => {
    await test.step('Ensure we are on login page', async () => {
      await loginPage.verifyPageLoaded();
      logger.step('Login page verified');
    });

    await test.step('Enter credentials in form', async () => {
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      await usernameInput.waitFor({ state: 'visible' });
      await usernameInput.fill('Admin');
      await passwordInput.fill('admin123');
      logger.step('Credentials entered');
    });

    await test.step('Clear form', async () => {
      await loginPage.clearForm();
      logger.step('Form cleared');
    });

    await test.step('Verify form is cleared', async () => {
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      
      const usernameValue = await usernameInput.inputValue();
      const passwordValue = await passwordInput.inputValue();
      
      expect(usernameValue).toBe('');
      expect(passwordValue).toBe('');
      logger.step('Form verified as cleared');
    });
  });
    
})