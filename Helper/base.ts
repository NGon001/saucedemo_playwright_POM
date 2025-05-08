import {test as baseTest} from '@playwright/test';
import { LoginPage, InventoryPage, Account, CartPage, CheckOutPage } from './pom';


type MyFixtures = {
    account: Account;
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    cartPage: CartPage;
    checkOutPage: CheckOutPage;
}

export const test = baseTest.extend<MyFixtures>({
    loginPage: async ({page}, use) => {
        await use(new LoginPage(page));
    },
    inventoryPage: async ({page}, use) => {
        await use(new InventoryPage(page));
    },
    account: async ({page}, use) => {
        await use(new Account(page));
    },
    cartPage: async ({page}, use) => {
        await use(new CartPage(page));
    },
    checkOutPage: async ({page}, use) => {
        await use(new CheckOutPage(page));
    },
});

export {expect} from '@playwright/test';