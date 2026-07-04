# Playwright & TypeScript Concepts — Learning Notes

These are explanations of core concepts discussed while building this framework.

---

## 0. Page Class Structure — The Golden Template

Every page class follows this exact order:

```typescript
// 1. IMPORTS — bring in only what THIS file directly uses
import { type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

// 2. DECLARATIONS — blueprint: list what properties the class has
export class LoginPage extends BasePage {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  // 3. CONSTRUCTOR — construction crew: receive page, call super(), assign locators using this
  constructor(page: any) {
    super(page);                                            // parent crew runs first
    this.emailInput = page.locator('[name="email"]');      // "my" emailInput = this locator
    this.passwordInput = page.locator('[name="password"]');
    this.loginButton = page.locator('[type="submit"]');
  }

  // 4. METHODS — actions this page can perform
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

This same structure repeats for every page class — only the locators and methods change.

---

## 1. Locator Strategy Decision Tree

### Priority Order (best → last resort)

| Priority | Method | When to use |
|---|---|---|
| 1st | `getByRole` | Buttons, links, headings, checkboxes — `name` must be the visible label text, NOT the HTML `id` or `value` |
| 2nd | `getByLabel` | Form inputs with a `<label>` tag |
| 3rd | `getByPlaceholder` | Inputs with placeholder text, no label |
| 4th | `getByText` | Error messages, visible static text |
| 5th | `getByTestId` | Elements with `data-testid` attribute |
| Last | `locator()` | ID or name attribute — only when nothing else works |

**Never use:** CSS class selectors (`.fa-lock`), structural selectors (`div:nth-child(3)`) — they break on UI changes.

### Quick decision tree
```
Button, link, heading, checkbox?    → getByRole('button/link/heading', { name: '...' })
Form field with <label>?            → getByLabel('...')
Input with placeholder, no label?   → getByPlaceholder('...')
Visible text on page?               → getByText('...')
Has data-testid attribute?          → getByTestId('...')
Nothing else works?                 → locator('#id') or locator('[name="..."]')
```

### Examples from LoginPage.ts
```typescript
// Input with placeholder → getByPlaceholder
this.emailInput = page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address');

// Button with text → getByRole
this.loginBtn = page.locator('form').filter({ hasText: 'Login' }).getByRole('button', { name: 'Login' });

// Link with text → getByRole
this.logOut = page.getByRole('link', { name: 'Logout' });

// Error message text → getByText
this.loginError = page.getByText('Your email or password is incorrect!');
```

### When multiple elements match — use filter()
```typescript
// Too broad — finds all email inputs on the page
page.getByPlaceholder('Email Address')

// Specific — only inside the Login form
page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address')
```

### When to use `data-qa` vs `getByLabel`

- `getByLabel('Email')` — only works when a `<label for="...">` tag is properly linked to the input
- `locator('[data-qa="email"]')` — use when the element has a `data-qa` attribute (added by devs for automation)

**How to check:** In DevTools, look for `<label for="xyz">` pointing to the input's `id`. If no label exists but `data-qa` does — use `locator('[data-qa="..."]')`.

```typescript
// ✅ correct
page.locator('[data-qa="name"]')

// ❌ wrong — mixing getByLabel with a CSS selector
page.getByLabel('[data-qa="name"]')

// ❌ wrong syntax — use = not : inside CSS attribute selectors
page.locator('[data-qa:"name"]')
```

### `selectOption()` — for dropdowns
Use `selectOption()` for `<select>` dropdown elements. No need to `.click()` first — Playwright handles it in one step.

```typescript
await this.dayOfBirth.selectOption(String(day));  // converts number to string
```

### Union types — restricting parameter values
Use `'Mr.' | 'Mrs.'` to tell TypeScript a parameter can only be one of those exact values. Passing anything else causes an immediate TypeScript error.

```typescript
async signUpForm(title: 'Mr.' | 'Mrs.') {
    if (title === 'Mr.') {
        await this.title1.click();
    } else {
        await this.title2.click();
    }
}
```

### Optional vs Required parameters
- All parameters are **required by default** in TypeScript
- Add `?` after the parameter name to make it optional
- **Rule: optional parameters must always come AFTER required ones**

```typescript
// ✅ correct — optional params at the end
async signUpForm(firstName: string, lastName: string, company?: string, address2?: string)

// ❌ wrong — required param after optional
async signUpForm(company?: string, address: string)
```

Handle optional params inside the method with an `if` check:
```typescript
if (company) {
    await this.company.fill(company);
}
```

### `this.locator` vs parameter value — don't confuse them
- `this.address` = the **Locator** (the text box element on the page)
- `address` (parameter) = the **string value** to type into the box

```typescript
await this.address.fill(address);  // locator.fill(value) — always this pattern
```

Never do `this.address.fill(this.address)` — you'd be passing a Locator into fill(), not a string.

### `string` vs `String` in TypeScript
Always use lowercase primitives:
- `string` ✅ — TypeScript primitive type
- `String` ❌ — JavaScript String object class (avoid in TypeScript)

Same applies to `number` vs `Number`, `boolean` vs `Boolean`.

### VS Code autocomplete inside `fill()`
When typing `fill(` inside a class, VS Code autocomplete suggests `this.propertyName`. 
This is wrong for fill() — you want the **parameter value**, not the locator.
Ignore the autocomplete and type the parameter name manually.

---

## 2. What is a `class`?

A class is a **blueprint**.

Think of it like a blueprint for building a house. The blueprint itself isn't a house — it describes *what every house built from it will have*: 2 bedrooms, 1 kitchen, 1 bathroom.

```typescript
class LoginPage {
  emailInput: Locator;
  passwordInput: Locator;
  loginButton: Locator;
}
```

This blueprint says: every `LoginPage` object will have these three things. The class itself doesn't do anything yet — it's just the plan.

---

## 2. What is a `constructor`?

A constructor is the **moment of building** — it runs automatically the moment you create an object from the blueprint.

Back to the house analogy: the constructor is the construction crew. The moment you say "build me a house from this blueprint", the crew shows up and actually puts the walls, kitchen, and bedrooms in place.

```typescript
constructor(page: Page) {
  this.emailInput = page.locator('#email');       // put the email input in place
  this.passwordInput = page.locator('#password'); // put the password input in place
  this.loginButton = page.locator('#loginBtn');   // put the login button in place
}
```

The moment you write `new LoginPage(page)` in your test — the constructor runs and all three locators get set up.

---

## 3. What is `this`?

`this` means **"the current object"** — like the word "my" in English.

When you say *"my name is Prachiti"*, the word *"my"* refers to you. `this` works the same way inside a class — it refers to the specific object the code is running on.

```typescript
constructor(page: Page) {
  this.emailInput = page.locator('#email');
  // "this" = the LoginPage object being created
  // so this.emailInput = MY emailInput
}

async fillEmail() {
  await this.emailInput.fill('test@test.com');
  // "this" = same LoginPage object
  // so this.emailInput = the same one stored above
}
```

`this.emailInput` in the constructor and `this.emailInput` in `fillEmail()` refer to the **same thing**.

Why do we need it? Because inside a class, writing `emailInput` alone doesn't tell JavaScript whether you mean the class property or some local variable. `this.emailInput` makes it unambiguous: *"the emailInput that belongs to this object"*.

---

## 4. What are Locators?

A `Locator` is a **saved description of where to find an element** on the page.

Think of it like a saved contact on your phone. You don't type the number every time — you save it once as "Mom" and call that. Similarly, a locator saves *how to find a button or input* so you don't write the selector every time.

```typescript
this.getStartedLink = page.locator('a', { hasText: 'Get started' });
```

This line says: "find an `<a>` tag whose text says 'Get started'". But **nothing happens yet** — the locator is just a saved description. It only actually searches the page when you call `.click()` or `.fill()` on it.

Why define locators in the constructor instead of inside methods?

```typescript
// BAD — selector written inside the method
async getStarted() {
  await page.locator('a', { hasText: 'Get started' }).click();
}

// GOOD — selector defined once in constructor, reused everywhere
constructor(page: Page) {
  this.getStartedLink = page.locator('a', { hasText: 'Get started' });
}

async getStarted() {
  await this.getStartedLink.click();
}
```

If the button text changes, you update it in **one place** (the constructor) and all methods that use it get the fix automatically.

---

## 5. Putting it all together — Page Object Model

```typescript
import { type Locator, type Page } from '@playwright/test';

class LoginPage {                                   // BLUEPRINT
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {                         // CONSTRUCTION — runs at new LoginPage(page)
    this.page = page;                               // store the browser tab
    this.emailInput = page.locator('#email');       // map the email field
    this.passwordInput = page.locator('#password'); // map the password field
    this.loginButton = page.locator('#loginBtn');   // map the login button
  }

  async goto() {
    await this.page.goto('/login');                 // "this.page" = the browser tab we stored
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);              // "this.emailInput" = the locator we stored
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

// In your test file:
const loginPage = new LoginPage(page);  // construction crew builds the object
await loginPage.goto();                 // navigate to login page
await loginPage.login('a@b.com', '123'); // fill and submit the form
```

**One-line summaries:**
- `class` = blueprint (what an object will have)
- `constructor` = construction crew (sets everything up at creation time)
- `this` = "my" (refers to the current object)
- `Locator` = saved description of where an element lives on the page
- `new LoginPage(page)` = build one object from the blueprint
