import { Locator, Page, expect } from "@playwright/test";
import path from "path";

export class Account{
    readonly page: Page;

    readonly username: string;
    readonly password: string;
    readonly authFile: string;

    constructor(page: Page) {
        this.page = page;
        this.username = "standard_user";
        this.password = "secret_sauce";
        this.authFile = path.join(__dirname, '../playwright/.auth/user.json');
    }

    async login(page: Page, loginPage: LoginPage) {
        await loginPage.goto();
        await loginPage.usernameInput.fill(this.username);
        await loginPage.passwordInput.fill(this.password);
        await loginPage.loginButton.click();
    }

    async storeLogin(page: Page, loginPage: LoginPage, inventoryPage: InventoryPage) {
        await this.login(page, loginPage);
        await inventoryPage.isReady();
        await page.context().storageState({ path: this.authFile });
    }
}

export class LoginPage{
    readonly url = "https://www.saucedemo.com/";

    readonly page: Page;

    readonly usernameInput: any;
    readonly passwordInput: any;
    readonly loginButton: any;

    constructor(page: Page) {
        this.page = page;
        this.usernameInput = this.page.getByPlaceholder('Username');
        this.passwordInput = this.page.getByPlaceholder('Password');
        this.loginButton = this.page.getByRole('button', { name: 'Login' });
    }

    async goto() {
        await this.page.goto(this.url);
    }
}

export class InventoryPage {
    readonly url = "https://www.saucedemo.com/inventory.html";

    readonly title: Locator;
    readonly inventory_list: Locator;
    readonly inventory_item: Locator;
    readonly shopping_cart: Locator;
    readonly buyItem_button: Locator;
    readonly removeItem_button: Locator;
    readonly itemPrice: Locator;

    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.title = this.page.getByText("Products");
        this.inventory_list = this.page.locator('.inventory_list');
        this.inventory_item = this.page.locator('.inventory_item');
        this.shopping_cart = this.page.locator('.shopping_cart_link');
        this.buyItem_button = this.page.getByRole('button', { name: 'Add to cart' });
        this.removeItem_button = this.page.getByRole('button', { name: 'Remove' });
        this.itemPrice = this.page.locator('.inventory_item_price');
    }

    async isReady(){
        await expect(this.title).toBeVisible();
    }

    async goto() {
        await this.page.goto(this.url);
        await this.isReady();
    }

    async getProducts() {
        const products = await this.inventory_list.locator(this.inventory_item).all();
        return products;
    }

    async getRandomProduct() {
        const products = await this.getProducts();
        const indices = Array.from({ length: products.length }, (_, i) => i);
        const shuffled = indices.sort(() => 0.5 - Math.random()).slice(0, 3);
        return shuffled.map(index => products[index]);
    }

    async getProductPrice(product: Locator) {
        const price = product.locator(this.itemPrice);
        const priceText = await price.innerText();
        const priceValue = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
        return priceValue;
    }

    async addToCart(product: Locator) {
        const addToCartButton = product.locator(this.buyItem_button);
        await addToCartButton.click();
    }

    async removeFromCart(product: Locator) {
        const removeFromCartButton = product.locator(this.removeItem_button);
        await removeFromCartButton.click();
    }

    async getCartCount(){
        const cart = this.shopping_cart;
        return await cart.innerText();
    }

    async goToCart() {
        await this.shopping_cart.click();
    }

    async expectCartCount(expectedCount: number) {       
        const expectedCountString = expectedCount === 0 ? "" : expectedCount.toString();
        const actualCartCountString = await this.getCartCount();
        await expect(actualCartCountString).toBe(expectedCountString);
    }
}

export class CartPage {
    readonly page: Page;
    readonly checkOut_button: Locator;
    readonly yourCart_text: Locator;

    constructor(page: Page) {
        this.page = page;
        this.yourCart_text = this.page.getByText('Your Cart');
        this.checkOut_button = this.page.getByRole('button', { name: 'Checkout' });
    }

    async isReady(){
        await expect(this.yourCart_text).toBeVisible(); // Check if the cart page is visible
    }

    async goToCheckOut() {
        await this.checkOut_button.click();
    }
}

export class CheckOutPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly postalCodeInput: Locator;
    readonly continueButton: Locator;
    readonly finishButton: Locator;
    readonly itemPriceTotal: Locator;
    readonly sucessMessage: Locator;
    readonly checkOutOverview_text: Locator;
    readonly checkOutInfo_text: Locator;

    constructor(page: Page) {
        this.page = page;
        this.checkOutInfo_text = this.page.getByText('Checkout: Your Information');
        this.firstNameInput = this.page.getByPlaceholder('First Name');
        this.lastNameInput = this.page.getByPlaceholder('Last Name');
        this.postalCodeInput = this.page.getByPlaceholder('Zip/Postal Code');
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });
        this.finishButton = this.page.getByRole('button', { name: 'Finish' });
        this.itemPriceTotal = this.page.locator('.summary_subtotal_label');
        this.sucessMessage = this.page.getByText('Thank you for your order!');
        this.checkOutOverview_text = this.page.getByText('Checkout: Overview');
    }

    async isReady(){
        await expect(this.checkOutInfo_text).toBeVisible();
    }

    async fillFormAndContinue(firstName: string, lastName: string, postalCode: string) {
        await this.firstNameInput.fill(firstName);
        await this.lastNameInput.fill(lastName);
        await this.postalCodeInput.fill(postalCode);
        await this.continueButton.click();
    }

    async getItemPriceTotal() {
        const priceText = await this.itemPriceTotal.innerText();
        const price = parseFloat(priceText.replace(/[^0-9.-]+/g, ""));
        return price;
    }

    async goToFinish() {
        await this.finishButton.click();
    }

    async isCheckOutOverviewVisible() {
        await expect(this.checkOutOverview_text).toBeVisible();
    }

    async isSuccessMessageVisible() {
        await expect(this.sucessMessage).toBeVisible();
    }

}