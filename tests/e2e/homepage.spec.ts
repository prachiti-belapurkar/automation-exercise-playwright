import { test, expect } from "@playwright/test";
import { HomePage } from "../../pages/HomePage";
import { generateUserData } from "../../utils/faker";

test('TC_001:Validate the subscription link on the Homepage', async({page})=>
{
    const user= generateUserData();
    const homepage= new HomePage(page);
    await homepage.goto('');
    await expect(page).toHaveTitle('Automation Exercise');
    await expect(homepage.footerText).toBeVisible();
    await homepage.emailSubscribe(user.email);
    await expect(page.getByText('You have been successfully subscribed!')).toBeVisible();

}
)