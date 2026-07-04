import {test, expect} from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { generateUserData } from '../../utils/faker';

test('TC_001: Validate the flow of registering new user', async ({page}) =>
{
    const user= generateUserData();
    const registerPage=new RegisterPage(page);
    await registerPage.goto('/login');
    await registerPage.signUp(user.name, user.email);
    await expect(page.getByText('Enter Account Information')).toBeVisible();
    await expect(registerPage.name).toBeEditable();
    await expect(registerPage.name).toHaveValue(user.name);
    await expect(registerPage.email).toBeDisabled();
    await registerPage.signUpForm('Mr.', user.password, user.dayOfBirth, user.monthOfBirth,user.yearOfBirth, true, false, user.firstName, user.lastName,user.address, user.state, user.city, user.zipCode, user.mobileNumber);
    await expect(registerPage.accountCreated).toBeVisible();
    await registerPage.continue.click();
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
    await registerPage.deleteAccount();
    await expect(registerPage.accountDeletedMsg).toBeVisible();
    await registerPage.continue.click();

})
test('TC_002: Validate the login flow with valid credentials.', async({page}) => {
    const user= generateUserData();
    const registerPage= new RegisterPage(page);
    const loginPage= new LoginPage(page);
    await loginPage.goto('/login');
    await expect(loginPage.loginHeading).toBeVisible();
    await registerPage.signUp(user.name, user.email);
    await registerPage.signUpForm('Mr.', user.password, user.dayOfBirth, user.monthOfBirth,user.yearOfBirth, true, false, user.firstName, user.lastName,user.address, user.state, user.city, user.zipCode, user.mobileNumber);
    await registerPage.continue.click();
    await loginPage.logout();
    await loginPage.login(user.email, user.password);
    await expect(page.getByText(`Logged in as ${user.name}`)).toBeVisible();
    await registerPage.deleteAccount();
    await expect(registerPage.accountDeletedMsg).toBeVisible();
    await registerPage.continue.click();

})
test('TC_003: Validate the login flow with invalid email credentials.',async({page}) =>
{
    const user= generateUserData();
    const loginPage= new LoginPage(page);
    await loginPage.goto('/login');
    await loginPage.login(user.email, user.password);
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
})

test('TC_004: Validate the login flow with invalid password credentials.', async({page}) =>
{
    const loginPage= new LoginPage(page);
    await loginPage.goto('/login');
    await loginPage.login('testuser123@gmail.com', 'test@1234.5');
    await expect(page.getByText('Your email or password is incorrect!')).toBeVisible();
})
test('TC_005: Validate the flow of registering an user with an existing email address.', async({page})=>
{
    const loginPage= new LoginPage(page);
    const registerPage= new RegisterPage(page);
    await loginPage.goto('/login');
    await registerPage.signUp('Test User44', 'testuser123.4@gmail.com');
    await expect(registerPage.emailExistsErrorMsg).toBeVisible();
}
)
