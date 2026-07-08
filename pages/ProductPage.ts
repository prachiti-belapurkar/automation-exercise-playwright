import { type Page, type Locator} from '@playwright/test';
import {BasePage} from './BasePage';

export class ProductPage extends BasePage{
    readonly productBtn: Locator;
    readonly allProductHeading: Locator;
    readonly viewProductBtn: Locator;
    readonly productName: Locator;
    readonly productCategory: Locator;
    readonly productPrice: Locator;
    readonly productAvailability: Locator;
    readonly productCondition: Locator;
    readonly productBrand: Locator;


    constructor(page: Page)
    {
        super(page);
        this.productBtn=page.getByRole('link', {name:'Products'});
        this.allProductHeading= page.getByRole('heading', {name:'All Products'});
        this.viewProductBtn= page.getByRole('link', {name:'View Product'}).first();
        this.productName=page.locator('.product-information h2');
        this.productCategory=page.locator('.product-information p').filter({hasText:'Category:'});
        this.productPrice=page.locator('.product-information span span').filter({hasText: 'Rs.'});
        this.productAvailability=page.locator('.product-information p').filter({hasText: 'Availability:'});
        this.productCondition=page.locator('.product-information p').filter({hasText: 'Condition:'});
        this.productBrand=page.locator('.product-information p').filter({hasText: 'Brand:'});

    }

    async goToProduct()
    {
        await this.productBtn.click();
    }

    async viewProduct()
    {
        await this.viewProductBtn.click();
    }
    async closeAdIfVisible(page: Page)
    {
        const ad = page.locator('#google_vignette');
        if (await ad.isVisible()) {
            await page.goto('/products');
        }
    }

}