import { faker } from '@faker-js/faker';

export const generateUserData = () => ({
    // for signUp() — step 1
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: 'Test@1234',
    dayOfBirth: faker.number.int({ min: 1, max: 28 }),
    monthOfBirth: faker.number.int({ min: 1, max: 12 }),
    yearOfBirth: faker.number.int({ min: 1970, max: 2000 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address: faker.location.streetAddress(),
    state: faker.location.state(),
    city: faker.location.city(),
    zipCode: faker.location.zipCode('#####'),
    mobileNumber: faker.string.numeric(10),
    company: faker.company.name(),
    address2: faker.location.secondaryAddress(),
    

});
