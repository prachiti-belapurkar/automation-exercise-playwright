import{type Page, type Locator} from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage
{
    readonly footerText: Locator;
    readonly subscribeEmailAddress: Locator;
    readonly subscribeBtn: Locator;

    constructor(page: Page)
    {
        super(page);
        this.footerText=page.getByRole('heading', {name: 'Subscription'});
        this.subscribeEmailAddress=page.getByPlaceholder('Your email address');
        this.subscribeBtn=page.locator('#subscribe');
    }

    async emailSubscribe(email: string)
    {
        await this.subscribeEmailAddress.fill(email);
        await this.subscribeBtn.click();

    }

}
