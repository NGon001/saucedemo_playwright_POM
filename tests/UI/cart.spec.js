import { test } from '../../Helper/base.ts';
import { expect } from "@playwright/test";

test.beforeEach(async ({ context }) => {
    await context.route('**/*.{png,jpg,jpeg,svg}', route => route.abort());
    await context.route('**/*.{woff,woff2,ttf}', route => route.abort());
});

test('Add products to cart and remove from cart', async ({ inventoryPage }) => {
    let products = [];

    await test.step('Go to inventory page and add products to cart', async () => {
        await inventoryPage.goto();
        products = await inventoryPage.getRandomProduct(); // Select up to 3 random products
        for (const product of products) {
            await inventoryPage.addToCart(product);
        }
        await inventoryPage.expectCartCount(products.length);
    });   
    
    await test.step('Remove products from cart', async () => {
        for (const product of products) {
            await inventoryPage.removeFromCart(product);
        }
        await inventoryPage.expectCartCount(0);
    });
});


test('Add products to cart and checkout', async ({ inventoryPage, cartPage, checkOutPage }) => {
    let products = [];
    let totalProductsPrice  = 0;

    await test.step('Go to inventory page and add products to cart', async () => {
        await inventoryPage.goto();
        products = await inventoryPage.getRandomProduct(); // Select up to 3 random products
        for (const product of products) {
            await inventoryPage.addToCart(product);
            totalProductsPrice  += await inventoryPage.getProductPrice(product);
        }
    });
    
    await test.step('Go to cart and process checkout', async () => {
        await inventoryPage.goToCart();
        await cartPage.goToCheckOut();
        await checkOutPage.fillFormAndContinue("John", "Doe", "12345");
    });

    await test.step('Verify products price and finish checkout', async () => {
        await expect(await checkOutPage.getItemPriceTotal()).toBe(totalProductsPrice ); 
        await checkOutPage.goToFinish();
        await checkOutPage.isSuccessMessageVisible();
    });
});
    