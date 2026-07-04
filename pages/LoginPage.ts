import { type Page, type Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage{
    readonly emailInput: Locator;
    readonly password: Locator;
    readonly loginBtn: Locator;
    readonly loginError: Locator;
    readonly logOut: Locator;

    constructor (page: Page){
        
    super(page);
    this.emailInput= page.locator('form').filter({hasText: 'Login'}).getByPlaceholder('Email Address');
    this.password= page.locator('form').filter({hasText: 'Login'}).getByPlaceholder('Password');
    this.loginBtn= page.locator('form').filter({hasText: 'Login'}).getByRole('button',{name: 'Login'});
    this.loginError= page.locator('form').filter({hasText: 'Your email or password is incorrect!'});
    this.logOut=page.getByRole('link', {name: 'logout'});
    }

    async login(email: string, password: string)
    {
        await this.emailInput.fill(email);
        await this.password.fill(password);
        await this.loginBtn.click();
    }
    async logout()
    {
        await this.logOut.click();
    }

}