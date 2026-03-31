import {test,expect,Page,Locator} from '@playwright/test'
import { logger } from '../utils/logger';
import { waitForNetworkIdle,waitForVisible } from '../utils/helper';
export class BasePage
{
    protected page:Page;
    constructor(page:Page)
    {
        this.page=page;
    }

    /** Click element with wait and retry logic */

    protected async clickWithWait(locator: Locator | string, options?: { timeout?: number; force?: boolean }): Promise<void> 
    {
        try 
        {
            const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
            await element.waitFor({state: 'visible',timeout: options?.timeout || 30000 });
            await element.click({ force: options?.force || true });
            logger.debug(`Clicked element: ${typeof locator === 'string' ? locator : 'locator'}`);
        } 
        catch (error) 
        {
            logger.error(`Failed to click element: ${typeof locator === 'string' ? locator : 'locator'}`, error);
            throw new Error(`Click failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /* Type text with validation */
    protected async typeWithValidation(locator: Locator | string,text: string,options?: { timeout?: number; clear?: boolean }): Promise<void> 
    {
        try 
        {
            const element = typeof locator === 'string' ? this.page.locator(locator): locator;
            await element.waitFor({state: 'visible', timeout: options?.timeout || 30000 });
            if (options?.clear !== false) 
            {
                await element.clear();
            }
            await element.fill(text);
        // Validate that text was entered correctly
        const actualValue = await element.inputValue();
        if (actualValue !== text) 
        {
            logger.warn(`Text mismatch. Expected: ${text}, Actual: ${actualValue}`);
        }
        logger.debug(`Typed text into element: ${typeof locator === 'string' ? locator : 'locator'}`);
        } 
        catch (error) 
        {
            logger.error(`Failed to type text: ${typeof locator === 'string' ? locator : 'locator'}`, error);
            throw new Error(`Type failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /** Wait for element to be visible*/
    protected async waitForVisible(locator: Locator | string,timeout: number = 10000): Promise<void> 
    {
        try 
        {
            const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
            await element.waitFor({ state: 'visible', timeout });
            logger.debug(`Element visible: ${typeof locator === 'string' ? locator : 'locator'}`);
        } 
        catch (error) 
        {
            logger.error(`Element not visible: ${typeof locator === 'string' ? locator : 'locator'}`, error);
            throw new Error(`Wait for visible failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

    /** Get text content of element */
    protected async getText(locator: Locator | string): Promise<string> 
    {
        try 
        {
            const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
            await element.waitFor({ state: 'visible' });
            const text = await element.textContent();
            return text?.trim() || '';
        } 
        catch (error) 
        {
            logger.error(`Failed to get text: ${typeof locator === 'string' ? locator : 'locator'}`, error);
            throw new Error(`Get text failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }

     /** Check if element is visible */
    protected async isVisible(locator: Locator | string, timeout: number = 5000): Promise<boolean> 
    {
        try 
        {
            const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
            await element.waitFor({ state: 'visible', timeout });
            return true;
        } 
        catch 
        {
            return false;
        }
    }

  /** Wait for network to be idle */
    protected async waitForNetworkIdle(timeout: number = 30000): Promise<void> 
    {
        await waitForNetworkIdle(this.page, timeout);
    }

    /** * Navigate to URL */
    protected async navigateTo(url: string): Promise<void> 
    {
        try 
        {
            await this.page.goto(url, { waitUntil: 'domcontentloaded' });
            // Wait for page to be ready instead of network idle
            await this.page.waitForLoadState('domcontentloaded');
            logger.info(`Navigated to: ${url}`);
        } 
        catch (error) 
        {
            logger.error(`Navigation failed: ${url}`, error);
            throw error;
        }
    }

    /** Get page title */
    async getTitle(): Promise<string> 
    {
        return await this.page.title();
    }

    /** Get current URL */
    getCurrentUrl(): string 
    {
        return this.page.url();
    }

}