/**
 * Authentication Fixtures
 * 
 * Provides authenticated page fixtures for tests
 */

import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

type AuthFixtures = {
  authenticatedPage: {
    loginPage: LoginPage;
    dashboardPage: DashboardPage;
  };
};

export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    // Perform login
    await loginPage.goto();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.verifyPageLoaded();
    await use({ loginPage,dashboardPage});
  },
});

export { expect } from '@playwright/test';