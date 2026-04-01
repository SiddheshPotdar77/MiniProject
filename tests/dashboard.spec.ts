import {test,expect} from '@playwright/test'
import { LoginPage } from '../pages/LoginPage'
import { DashboardPage } from '../pages/DashboardPage'
import { logger } from '../utils/logger'

test.describe("Dashboard Functionality",()=>
{
    let loginPage:LoginPage
    let dashboardPage:DashboardPage;
    test.beforeEach(async({page})=>
    {
        loginPage=new LoginPage(page);
        dashboardPage=new DashboardPage(page)

        //Login before test
        await loginPage.goto();
        await loginPage.login('Admin',"admin123")

    })

    test('@smoke @regression Should display all main widgets', async ({ page }) => 
    {
        await test.step('Navigate to dashboard', async () => {
        await dashboardPage.goto();
        await dashboardPage.verifyPageLoaded();
        logger.step('Navigated to dashboard');
    });

    await test.step('Verify Time at Work widget', async () => 
    {
      await dashboardPage.verifyTimeAtWorkWidget();
      logger.step('Time at Work widget verified');
    });

    await test.step('Verify My Actions widget', async () => 
    {
      await dashboardPage.verifyMyActionsWidget();
      logger.step('My Actions widget verified');
    });

    await test.step('Verify Quick Launch widget', async () => 
    {
      await dashboardPage.verifyQuickLaunchWidget();
      logger.step('Quick Launch widget verified');
    });
  });

})