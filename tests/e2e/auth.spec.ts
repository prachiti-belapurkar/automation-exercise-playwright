import {test, expect} from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';

test('TC_001: Validate the flow of registering new user', async ({page}) =>
{
    const registerPage=new RegisterPage(page);
    await registerPage.goto('/login');
    await registerPage.signUp('Test User9289', 'testuserbla@gmail.com');
    await expect(page.getByText('Enter Account Information')).toBeVisible();
    await expect(registerPage.name).toBeEditable();
    await expect(registerPage.name).toHaveValue("Test User9289");
    await expect(registerPage.email).toBeDisabled();
    await registerPage.signUpForm('Mr.', 'abc@123', 3,10,1989,true,true,'Sunil', 'Rakesh','abc','ghi','uuu','45678','2223567123');
    await expect(registerPage.accountCreated).toBeVisible();
    await registerPage.continue.click();
    await expect(page.getByText('Logged in as Test User9289')).toBeVisible();
    await registerPage.deleteAccount();
    await expect(registerPage.accountDeletedMsg).toBeVisible();
    await registerPage.continue.click();

})
test('TC_002: Validate the login flow with valid credentials.', async({page}) => {
    const loginPage= new LoginPage(page);
    await loginPage.goto('/login');
    await loginPage.login('testuser123.4@gmail.com', 'test@1234');
    await expect(page.getByText('Logged in as Test User')).toBeVisible();
    await loginPage.logout();

})
test('TC_003: Validate the login flow with invalid email credentials.',async({page}) =>
{
    const loginPage= new LoginPage(page);
    await loginPage.goto('/login');
    await loginPage.login('testuser123@gmail.com', 'test@1234');
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
})

test('TC_004: Validate the login flow with invalid password credentials.', async({page}) =>
{
    const loginPage= new LoginPage(page);
    await loginPage.goto('/login');
    await loginPage.login('testuser123@gmail.com', 'test@1234.5');
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
})
