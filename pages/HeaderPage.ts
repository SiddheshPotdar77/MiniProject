import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class HeaderPage extends BasePage {
  // Locators
  private readonly userDropdown: Locator;
  private readonly logoutLink: Locator;
  private readonly searchInput: Locator;
  private readonly adminMenu: Locator;
  private readonly pimMenu: Locator;
  private readonly leaveMenu: Locator;
  private readonly timeMenu: Locator;
  private readonly recruitmentMenu: Locator;
  private readonly myInfoMenu: Locator;
  private readonly performanceMenu: Locator;
  private readonly dashboardMenu: Locator;
  private readonly directoryMenu: Locator;
  private readonly maintenanceMenu: Locator;
  private readonly claimMenu: Locator;
  private readonly buzzMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.userDropdown = page.locator('.oxd-userdropdown-tab');
    this.logoutLink = page.locator('a:has-text("Logout")');
    this.searchInput = page.locator('input[placeholder="Search"]');
    this.adminMenu = page.locator('a[href*="admin"]').first();
    this.pimMenu = page.locator('a[href*="pim"]').first();
    this.leaveMenu = page.locator('a[href*="leave"]').first();
    this.timeMenu = page.locator('a[href*="time"]').first();
    this.recruitmentMenu = page.locator('a[href*="recruitment"]').first();
    this.myInfoMenu = page.locator('a[href*="myInfo"]').first();
    this.performanceMenu = page.locator('a[href*="performance"]').first();
    this.dashboardMenu = page.locator('a[href*="dashboard"]').first();
    this.directoryMenu = page.locator('a[href*="directory"]').first();
    this.maintenanceMenu = page.locator('a[href*="maintenance"]').first();
    this.claimMenu = page.locator('a[href*="claim"]').first();
    this.buzzMenu = page.locator('a[href*="buzz"]').first();
  }

  /*** Perform logout */
  async logout(): Promise<void> 
  {
    try 
    {
      logger.step('Performing logout');
      await this.clickWithWait(this.userDropdown);
      await this.waitForVisible(this.logoutLink);
      await this.clickWithWait(this.logoutLink);
      // Wait for navigation to login page instead of network idle
      await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
      logger.step('Logout completed');
    } 
    catch (error) 
    {
      logger.error('Logout failed', error);
      throw new Error(`Logout failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /*** Navigate to Dashboard */
  async navigateToDashboard(): Promise<void> {
    await this.clickWithWait(this.dashboardMenu);
    await this.page.waitForLoadState('domcontentloaded', { timeout: 5000 });
    logger.step('Navigated to Dashboard');
  }

   /*** Verify user dropdown is visible */
  async verifyUserDropdownVisible(): Promise<void> {
    await this.waitForVisible(this.userDropdown);
    logger.step('User dropdown verified as visible');
  }

  /*** Get username from dropdown */
  async getUsername(): Promise<string> {
    await this.clickWithWait(this.userDropdown);
    const usernameElement = this.page.locator('.oxd-userdropdown-name');
    return await this.getText(usernameElement);
  }
}