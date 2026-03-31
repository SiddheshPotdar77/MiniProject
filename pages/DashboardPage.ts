/**
 * Dashboard Page Object
 * 
 * Handles all interactions with the OrangeHRM dashboard
 */

import { Page, Locator,test,expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { logger } from '../utils/logger';

export class DashboardPage extends BasePage 
{
  // Locators
  private readonly dashboardHeader: Locator;
  private readonly quickLaunchSection: Locator;
  private readonly myActionsSection: Locator;
  private readonly timeAtWorkWidget: Locator;
  private readonly myActionsWidget: Locator;
  private readonly quickLaunchWidget: Locator;
  private readonly buzzLatestPostsWidget: Locator;
  private readonly employeesOnLeaveWidget: Locator;
  private readonly employeeDistributionWidget: Locator;
  private readonly legendWidget: Locator;

  constructor(page: Page) {
    super(page);
    //this.dashboardHeader = page.locator('.oxd-text.oxd-text--h6.oxd-topbar-header-breadcrumb-module');
    this.dashboardHeader = page.locator("h6:has-text('Dashboard')");
    this.quickLaunchSection = page.locator('.orangehrm-quick-launch-card');
    this.myActionsSection = page.locator('.orangehrm-my-actions-card');
    this.timeAtWorkWidget = page.locator('.orangehrm-dashboard-widget-name:has-text("Time at Work")');
    this.myActionsWidget = page.locator('.orangehrm-dashboard-widget-name:has-text("My Actions")');
    this.quickLaunchWidget = page.locator('.orangehrm-dashboard-widget-name:has-text("Quick Launch")');
    this.buzzLatestPostsWidget = page.locator('.orangehrm-dashboard-widget-name:has-text("Buzz Latest Posts")');
    this.employeesOnLeaveWidget = page.locator('.orangehrm-dashboard-widget-name:has-text("Employees on Leave Today")');
    this.employeeDistributionWidget = page.locator('.orangehrm-dashboard-widget-name:has-text("Employee Distribution by Sub Unit")');
    this.legendWidget = page.locator('.orangehrm-dashboard-widget-name:has-text("Legend")');
  }

  /**
   * Navigate to dashboard
   */
  async goto(): Promise<void> {
    await this.navigateTo('/web/index.php/dashboard/index');
    await this.waitForVisible(this.dashboardHeader);
    logger.step('Navigated to dashboard');
  }

  /* Verify dashboard is loaded */
  async verifyPageLoaded(): Promise<void> {
    await this.waitForVisible(this.dashboardHeader,15000);
    logger.step('Dashboard page verified as loaded');
  }

  /**
   * Verify Time at Work widget is visible
   */
  async verifyTimeAtWorkWidget(): Promise<void> {
    await this.waitForVisible(this.timeAtWorkWidget);
    logger.step('Time at Work widget verified');
  }

  /**
   * Verify My Actions widget is visible
   */
  async verifyMyActionsWidget(): Promise<void> {
    await this.waitForVisible(this.myActionsWidget);
    logger.step('My Actions widget verified');
  }

  /**
   * Verify Quick Launch widget is visible
   */
  async verifyQuickLaunchWidget(): Promise<void> {
    await this.waitForVisible(this.quickLaunchWidget);
    logger.step('Quick Launch widget verified');
  }

  /**
   * Verify all main widgets are visible
   */
  async verifyAllWidgets(): Promise<void> {
    logger.step('Verifying all dashboard widgets');
    await this.verifyTimeAtWorkWidget();
    await this.verifyMyActionsWidget();
    await this.verifyQuickLaunchWidget();
    logger.step('All dashboard widgets verified');
  }

  /**
   * Check if widget is visible
   */
  async isWidgetVisible(widgetName: string): Promise<boolean> {
    const widget = this.page.locator(`.orangehrm-dashboard-widget-name:has-text("${widgetName}")`);
    return await this.isVisible(widget);
  }

  /**
   * Get widget count
   */
  async getWidgetCount(): Promise<number> {
    const widgets = this.page.locator('.orangehrm-dashboard-widget');
    return await widgets.count();
  }
}
