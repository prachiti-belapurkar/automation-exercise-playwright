# Automation Exercise - Playwright Test Suite

![CI](https://github.com/prachiti-belapurkar/automation-exercise-playwright/actions/workflows/playwright.yml/badge.svg)

An end-to-end test automation project for [automationexercise.com](https://automationexercise.com) built using Playwright and TypeScript.

---

## What this project does

It automates real user flows on a demo e-commerce website — things like registering an account, logging in, and handling error scenarios. The goal is to catch bugs before they reach real users.

---

## Tech Stack

- **Playwright** — for browser automation
- **TypeScript** — for type-safe test code
- **Faker.js** — for generating random test data
- **GitHub Actions** — for running tests automatically on every push

---

## Project Structure

```
├── pages/          # Page Object Models (one file per page)
├── tests/e2e/      # Test files
├── utils/          # Helpers like random data generation
├── playwright.config.ts
```

The **Page Object Model (POM)** pattern is used — each page of the website has its own class that holds the locators and actions for that page. This keeps test files clean and easy to read.

---

## Test Cases

| Test | Description |
|------|-------------|
| TC001 | Register a new user successfully |
| TC002 | Login with valid credentials |
| TC003 | Login with an invalid email |
| TC004 | Login with an invalid password |
| TC005 | Register with an email that already exists |

---

## How to Run Locally

**1. Clone the repo and install dependencies**
```bash
npm install
npx playwright install
```

**2. Run all tests**
```bash
npx playwright test
```

**3. View the test report**
```bash
npx playwright show-report
```

---

## CI/CD

Tests run automatically on every push to `main` via GitHub Actions. You can see the results in the Actions tab of this repo.
