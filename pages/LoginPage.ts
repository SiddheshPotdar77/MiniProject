import {test,expect, Locator,Page} from '@playwright/test'
import { BasePage } from "./BasePage";
import { logger } from '../utils/logger';

export class LoginPage extends BasePage
{
    //Locators
    private readonly usernameInput:Locator;
    private readonly passwordInput:Locator;
    private readonly loginButton:Locator;
    private readonly loginForm: Locator;
    private readonly errorMessage: Locator;

    constructor(page:Page)
    {
        super(page)
        this.usernameInput=page.locator("input[name='username']")
        this.passwordInput=page.locator("input[name='password']")
        this.loginButton=page.locator("button[type='submit']")
        this.loginForm=page.locator('.orangehrm-login-form')
        this.errorMessage = page.locator('.oxd-alert-content-text');
    }

    //Navigate to URL
    async goto():Promise<void>
    {
        await this.navigateTo('/web/index.php/auth/login');
        await this.waitForVisible(this.loginForm);
        logger.step('Navigate to login page');
    }

    //Perform login with credentials
    async login(username:string,password:string):Promise<void>
    {
        try
        {
            await this.typeWithValidation(this.usernameInput,username)
            await this.typeWithValidation(this.passwordInput,password)
            await this.clickWithWait(this.loginButton)
            logger.step('Login completed')
        }
        catch (error) 
        {
            logger.error("Login failed", error);
            throw new Error(`Login failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /**Get error message text*/
    async getErrorMessage(): Promise<string> 
    {
        // Wait a bit for error message to appear, then check
        await this.page.waitForTimeout(1000);
        const isVisible = await this.isVisible(this.errorMessage, 5000);
        if (isVisible) 
        {
            return await this.getText(this.errorMessage);
        }
        return '';
    }

    /** * Check if error message is displayed */
    async isErrorMessageVisible(): Promise<boolean> 
    {
        // Wait a bit for error message to appear
        await this.page.waitForTimeout(1000);
        return await this.isVisible(this.errorMessage, 5000);
    }

    /** Verify login page is loaded */
    async verifyPageLoaded(): Promise<void> 
    {
        await this.waitForVisible(this.loginForm);
        logger.step('Login page verified as loaded');
    }

    async clearForm(): Promise<void> 
    {
        await this.usernameInput.clear();
        await this.passwordInput.clear();
        logger.debug('Login form cleared');
    }

    async verifyErrorMessage(): Promise<void>
    {
        await this.page.waitForTimeout(3000); // give time for error to appear
        const errorMessage = await this.page.locator('.oxd-alert-content-text').textContent();
        await expect(errorMessage).toContain('Invalid credentials');
    }

}