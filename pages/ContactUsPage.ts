import {type Page, type Locator} from "@playwright/test"
import {BasePage} from "./BasePage"

export class ContactUsForm extends BasePage{
    readonly contactUsBtn: Locator;
    readonly getIntouchheading: Locator;
    readonly contactName: Locator;
    readonly contactEmail: Locator;
    readonly contactSubject: Locator;
    readonly contactMessage: Locator;
    readonly contactUploadFile: Locator;
    readonly contactSubmitBtn: Locator;
    readonly contactSuccessMsg: Locator;
    readonly contactHomeBtn: Locator;

    constructor(page: Page)
    {
        super(page);
        this.contactUsBtn=page.getByRole('link', {name:' Contact us'});
        this.getIntouchheading=page.getByRole('heading', {name:'Get In Touch'});
        this.contactName=page.locator('[data-qa="name"]');
        this.contactEmail=page.locator('[data-qa="email"]');
        this.contactSubject=page.locator('[data-qa="subject"]');
        this.contactMessage=page.locator('[data-qa="message"]');
        this.contactUploadFile=page.locator('input[name="upload_file"]');
        this.contactSubmitBtn=page.locator('[data-qa="submit-button"]');
        this.contactSuccessMsg=page.locator('.status.alert-success');
        this.contactHomeBtn=page.getByRole('link', {name: ' Home'}).first();

    }

    async ContactForm(contactName: string, contactEmail: string, contactMessage:string)
    {
        await this.contactName.fill(contactName);
        await this.contactEmail.fill(contactEmail);
        await this.contactMessage.fill(contactMessage);
        this.page.on('dialog',dialog=> dialog.accept());
        await this.contactSubmitBtn.click();
    }
} 