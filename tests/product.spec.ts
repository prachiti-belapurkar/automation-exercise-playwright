import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';

test('TC_001:Validate the flow of all products and product details page.', async({page})=>
{
    const productPage= new ProductPage(page);
    await productPage.goto('/');
    await expect(page).toHaveTitle('Automation Exercise');
    await productPage.goToProduct();
    await productPage.closeAdIfVisible(page);
    await expect(page).toHaveURL('/products');
    await expect(productPage.allProductHeading).toBeVisible();
    await productPage.viewProduct();
    await expect(page).toHaveURL('/product_details/1');
    await expect(productPage.productName).toBeVisible();
    await expect(productPage.productCategory).toBeVisible();
    await expect(productPage.productPrice).toBeVisible();
    await expect(productPage.productAvailability).toBeVisible();
    await expect(productPage.productCondition).toBeVisible();
    await expect(productPage.productBrand).toBeVisible();
}
)
test('TC_002: Validate the flow of searching a product', async({page})=>
{
    const productPage= new ProductPage(page);
    await productPage.goto('/');
    await expect(page).toHaveTitle('Automation Exercise');
    await productPage.goToProduct();
    await productPage.closeAdIfVisible(page);
    await expect(page).toHaveURL('/products');
    await expect(productPage.allProductHeading).toBeVisible();
    await productPage.searchProduct('Top');
    await expect(productPage.searchedProductsHeading).toBeVisible();
    await expect(productPage.searchedProductCard).toBeVisible();

})