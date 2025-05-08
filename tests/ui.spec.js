import { test } from '../Helper/base';
import { expect } from "@playwright/test";

test('Add products to cart and remove from cart', async ({ inventoryPage }) => {
    // #ADD PRODUCTS TO CART

    await inventoryPage.goto();
    await inventoryPage.isReady();

    var products = await inventoryPage.getRandomProduct(); // Get random products from the inventory page 3 maximum

    for (const product of products) {
        await inventoryPage.addToCart(product);
    }

    await inventoryPage.getCartCount().then(async (count) => { 
        await expect(count).toBe(products.length.toString());
    });

    // #REMOVE PRODUCTS FROM CART
    for (const product of products) {
        await inventoryPage.removeFromCart(product);
    }
    await inventoryPage.getCartCount().then(async (count) => {
        await expect(count).toBe("");
    });
});


test('Add products to cart and checkout', async ({ inventoryPage, cartPage, checkOutPage }) => {
    // #ADD PRODUCTS TO CART
    await inventoryPage.goto();
    await inventoryPage.isReady();

    let products = await inventoryPage.getRandomProduct(); // Get random products from the inventory page 3 maximum
    let toatlProductsPrice = 0;
    for (const product of products) {
        await inventoryPage.addToCart(product);
        await inventoryPage.getProductPrice(product).then(async (price) => {
            toatlProductsPrice += price;
        });
    }

    //#GO TO CART AND CHECKOUT
    inventoryPage.goToCart();
    await cartPage.goToCheckOut();

    await checkOutPage.fillFormAndContinue("John", "Doe", "12345");
    await checkOutPage.getItemPriceTotal().then(async (total) => {
        await expect(total).toBe(toatlProductsPrice); 
    });
 
    await checkOutPage.goToFinish();
    await checkOutPage.isSuccessMessageVisible();
});
    