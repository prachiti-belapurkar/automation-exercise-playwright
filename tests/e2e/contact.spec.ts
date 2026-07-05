import { test, expect } from "@playwright/test";
import { ContactUsForm } from "../../pages/ContactUsPage";
import { generateUserData } from "../../utils/faker";

test('TC_001: Validate the flow of contact us form from the homepage.', async ({page})=> 
{
    const user= generateUserData();
    const contactusForm= new ContactUsForm(page);
    await contactusForm.goto('/contact_us');
    await contactusForm.ContactForm(user.name,user.email, 'This is test message' );
    await expect(contactusForm.contactSuccessMsg).toBeVisible();
    await contactusForm.contactHomeBtn.click();

});