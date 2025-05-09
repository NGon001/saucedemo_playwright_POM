import { chromium } from '@playwright/test';
import { Account, InventoryPage, LoginPage } from '../Helper/pom';

export default async function globalSetup() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());
    await page.route('**/*.{woff,woff2,ttf}', route => route.abort());

    const account = new Account(page);
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    console.log('Starting login process...');
    try {
        await account.storeLogin(page, loginPage, inventoryPage);
    } catch (error) {
        console.error('Error during login process:', error);
        throw error;
    }
    console.log('Login process completed successfully.');
    await browser.close();
}
