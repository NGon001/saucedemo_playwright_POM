# 🧪 Playwright self-study project

This repository contains automated UI test cases for the [SauceDemo](https://www.saucedemo.com/) web application, built using **Playwright**.  
All tests are written as part of my **self-study practice to improve as a QA specialist**.

## 🔧 Tech Stack

- **Framework:** [Playwright](https://playwright.dev/)
- **Design Pattern:** Page Object Model (POM)
- **Helper Location:** All page objects and utility classes are located in the `../Helper` folder.
- **Authentication Handling:**  The project uses Playwright’s storage state feature to save and reuse cookies and session data

---

# 🧪 Test Cases:

## ✅ Test Case 1: Add Products to Cart and Remove from Cart

**Description:**  This test verifies that users can add products to the cart and then remove them. It ensures that the cart count updates correctly after both actions.

### 🔄 Steps

1. Navigate to the [Inventory Page](https://www.saucedemo.com/inventory.html).
2. Wait until the page is fully loaded.
3. Select up to **3 random products** from the inventory.
4. Add the selected products to the cart.
5. Verify that the cart icon shows the correct count of added products.
6. Remove all products from the cart.
7. Verify that the cart count is reset (empty).

### ✅ Expected Results

- The cart count should match the number of products added.
- After removing all products, the cart count should display as empty (`no count badge`).

---

## ✅ Test Case 2: Add Products to Cart and Complete Checkout

**Description:**  This test ensures that products can be added to the cart, the checkout process can be successfully completed, and the total price displayed matches the sum of selected product prices.

### 🔄 Steps

1. Navigate to the [Inventory Page](https://www.saucedemo.com/inventory.html).
2. Wait until the page is fully loaded.
3. Select up to **3 random products** and note their prices.
4. Add the selected products to the cart.
5. Navigate to the **Cart Page**.
6. Click **Checkout**.
7. Fill in the form with valid details:
   - First Name
   - Last Name
   - Postal Code
8. On the **Overview Page**, verify that the total price matches the sum of selected product prices.
9. Click **Finish** to complete the order.
10. Verify that the **"Thank you for your order!"** success message appears.

### ✅ Expected Results

- The total displayed during checkout matches the sum of the individual product prices.
- A success confirmation message is shown after completing the order.

  ---
