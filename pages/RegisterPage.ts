import {type Page, type Locator} from "@playwright/test";
import { BasePage } from "./BasePage";

export class RegisterPage extends BasePage
{
    readonly newUserEmail: Locator;
    readonly newUserName: Locator;
    readonly signUpBtn: Locator;
    readonly title1: Locator;
    readonly title2: Locator;
    readonly name: Locator;
    readonly email: Locator;
    readonly newUserPassword: Locator;
    readonly dayOfBirth: Locator;
    readonly monthOfBirth: Locator;
    readonly yearOfBirth: Locator;
    readonly newsLetterSignUp: Locator;
    readonly specialOffer: Locator;
    readonly firstName: Locator;
    readonly lastName: Locator;
    readonly company: Locator;
    readonly address: Locator;
    readonly address2: Locator;
    //readonly country: Locator;
    readonly state: Locator;
    readonly city: Locator;
    readonly zipCode: Locator;
    readonly mobileNumber: Locator;
    readonly createAccountbtn: Locator;
    readonly accountCreated: Locator;
    readonly continue: Locator;
    readonly deleteAccountBtn: Locator;
    readonly accountDeletedMsg: Locator;
    readonly emailExistsErrorMsg: Locator;

    constructor (page: Page)
    {
        super(page);
        this.newUserName=page.locator('form').filter({hasText: 'signup'}).getByPlaceholder('Name');
        this.newUserEmail=page.locator('form').filter({hasText: 'signup'}).getByPlaceholder('Email Address');
        this.signUpBtn= page.locator('form').filter({hasText:'signup'}).getByRole('button', {name:'Signup'});
        this.title1=page.getByLabel('Mr.');
        this.title2=page.getByLabel('Mrs.');
        this.name=page.locator('[data-qa="name"]');
        this.email=page.locator('[data-qa="email"]');
        this.newUserPassword= page.locator('[data-qa="password"]');
        this.dayOfBirth=page.locator('[data-qa="days"]');
        this.monthOfBirth=page.locator('[data-qa="months"]');
        this.yearOfBirth=page.locator('[data-qa="years"]');
        this.newsLetterSignUp=page.getByRole('checkbox', { name: 'Sign up for our newsletter!' });
        this.specialOffer=page.getByRole('checkbox', { name: 'Receive special offers from our partners!' });
        this.firstName= page.locator('[data-qa="first_name"]');
        this.lastName=page.locator('[data-qa="last_name"]');
        this.company=page.locator('[data-qa="company"]');
        this.address=page.locator('[data-qa="address"]');
        this.address2=page.locator('[data-qa="address2"]');
        //this.country=page.locator('[data-qa="country"]');
        this.state=page.locator('[data-qa="state"]');
        this.city=page.locator('[data-qa="city"]');
        this.zipCode=page.locator('[data-qa="zipcode"]');
        this.mobileNumber=page.locator('[data-qa="mobile_number"]');
        this.createAccountbtn=page.locator('[data-qa="create-account"]');
        this.accountCreated=page.locator('[data-qa="account-created"]');
        this.continue=page.locator('[data-qa="continue-button"]');
        this.deleteAccountBtn=page.getByRole('link', {name: 'Delete Account'});
        this.accountDeletedMsg=page.locator('[data-qa="account-deleted"]');
        this.emailExistsErrorMsg=page.getByText('Email Address already exist!');

    }

    async signUp(newUserName: string, newUserEmail: string)
    {
        await this.newUserName.fill(newUserName);
        await this.newUserEmail.fill(newUserEmail);
        await this.signUpBtn.click();

    }

    async signUpForm(title: 'Mr.' |'Mrs.', newUserPassword: string, dayOfBirth: number, monthOfBirth: number, yearOfBirth: number, newsLetterSignUp: boolean, specialOffer: boolean, firstName: string, lastName: string, address: string, state: string, city: string, zipCode: string, mobileNumber: string,company?: string, address2?: string,country?: string)
    {
        if (title=='Mr.')
        {
            await this.title1.click();
        }
        else
        {
            await this.title2.click();
        }
        await this.newUserPassword.fill(newUserPassword);
        await this.dayOfBirth.selectOption(String(dayOfBirth));
        await this.monthOfBirth.selectOption(String(monthOfBirth));
        await this.yearOfBirth.selectOption(String(yearOfBirth));

        if(newsLetterSignUp)
        {
            await this.newsLetterSignUp.check();
        }
        
        if(specialOffer)
        {
            await this.specialOffer.check();
        }
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        if(company)
        {
        await this.company.fill(company);
        }
        await this.address.fill(address);
        if(address2)
        {
        await this.address2.fill(address2);
        }
        //await this.country.fill(country);
        await this.state.fill(state);
        await this.city.fill(city);
        await this.zipCode.fill(zipCode);
        await this.mobileNumber.fill(mobileNumber);
        await this.createAccountbtn.click();
        
    }

    async deleteAccount()
    {
        await this.deleteAccountBtn.click();
    }
}
