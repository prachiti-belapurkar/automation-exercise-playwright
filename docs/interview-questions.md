# Playwright Automation — Interview Questions

This document covers two sections:
1. **Topic-wise questions** — based on what we discussed while building this framework
2. **Most asked questions** — sourced from LinkedIn, Naukri, Glassdoor, Reddit, and company interview experiences

---

## SECTION 1 — Topic-wise Questions (From Our Learning)

---

### Playwright Basics

**Q: What is Playwright?**
Playwright is an open-source browser automation library by Microsoft. It supports TypeScript, JavaScript, Python, C#, and Java. It connects directly to browsers via DevTools protocol — no WebDriver needed (unlike Selenium).

**Q: How is Playwright different from Selenium?**
| Feature | Playwright | Selenium |
|---|---|---|
| Auto-waiting | Built-in | Manual waits needed |
| API testing | Built-in | Not supported |
| Speed | Faster | Slower |
| WebDriver | Not needed | Required |
| Multi-browser | Single API | Separate drivers |

**Q: What is auto-waiting in Playwright?**
Playwright automatically waits for elements to be: attached to DOM, visible, stable (not animating), enabled, and able to receive events — before performing any action. This eliminates most `sleep()` and explicit wait calls.

**Q: Does Playwright require WebDriver?**
No. Playwright connects directly to browsers using DevTools Protocol (CDP for Chromium, similar for Firefox and WebKit).

---

### Locators

**Q: What are Locators in Playwright?**
Locators are Playwright's abstraction for finding elements. They are lazy (don't query DOM until an action is performed), auto-retry, and automatically wait for the element to be actionable. Unlike raw selectors, they don't fail immediately if the element isn't ready yet.

**Q: What locator strategies does Playwright provide? Which do you prefer?**
In priority order:
1. `getByRole` — targets element's purpose (button, link, heading)
2. `getByLabel` — targets form inputs by their label text
3. `getByPlaceholder` — targets inputs by placeholder text
4. `getByText` — targets any visible text
5. `getByTestId` — targets elements with `data-testid` attribute
6. `locator()` with CSS — last resort (ID, name attribute)

Avoid: XPath, CSS class selectors tied to styling (e.g., `.fa-lock`)

**Q: What is `getByRole` and why is it recommended?**
`getByRole` finds elements by their HTML role (button, link, textbox, heading) and accessible name (visible text or aria-label). It's recommended because:
- Mirrors how users interact with the page
- Resilient to CSS/HTML structure changes
- Matches accessibility standards

```typescript
page.getByRole('button', { name: 'Login' })
page.getByRole('link', { name: 'Logout' })
```

**Q: What is the `name` in `getByRole({ name: '...' })`? Is it the HTML `name` attribute?**
No. It is the **accessible name** — usually the visible text of the element, or its `aria-label`. It has nothing to do with the HTML `name` attribute.

**Q: What is the difference between `getByLabel` and `locator('[data-qa="..."]')`?**
- `getByLabel` works only when a proper `<label for="...">` tag is linked to the input
- `locator('[data-qa="..."]')` targets elements with a `data-qa` attribute added by developers specifically for automation
- Never pass a CSS selector into `getByLabel` — they are completely different things

**Q: How do you interact with dropdowns in Playwright?**
Use `selectOption()` — no need to click first. Playwright handles opening and selecting in one step:
```typescript
await this.dayDropdown.selectOption('15');       // by value
await this.monthDropdown.selectOption('June');   // by visible text
```

**Q: What is a union type in TypeScript? Give an example from your framework.**
A union type restricts a parameter to only specific values:
```typescript
async selectTitle(title: 'Mr.' | 'Mrs.') { ... }
```
Passing any other value causes a TypeScript error immediately — catching mistakes at compile time rather than runtime.

**Q: What is the difference between optional and required parameters in TypeScript?**
All parameters are required by default. Add `?` to make a parameter optional. Optional parameters must always come after required ones — TypeScript enforces this rule.
```typescript
async signUpForm(firstName: string, company?: string)  // ✅
async signUpForm(company?: string, firstName: string)  // ❌ TypeScript error
```

**Q: What is the difference between `string` and `String` in TypeScript?**
- `string` (lowercase) — TypeScript primitive type, always use this
- `String` (uppercase) — JavaScript String object class, avoid in TypeScript
Same rule applies: `number` vs `Number`, `boolean` vs `Boolean`.

**Q: What is strict mode violation in Playwright?**
When a locator matches more than one element, Playwright throws a strict mode violation error — it refuses to guess which element you mean. Fix: make your locator more specific using `.filter()` or chain more specific locators.

```typescript
// Too broad — matches 3 email inputs
page.getByPlaceholder('Email Address')

// Specific — only inside the Login form
page.locator('form').filter({ hasText: 'Login' }).getByPlaceholder('Email Address')
```

---

### Page Object Model (POM)

**Q: What is the Page Object Model and why do you use it?**
POM is a design pattern where each page/component is represented as a class encapsulating locators and action methods. Benefits:
- No duplicate selectors across test files
- One place to update when UI changes
- Tests read like plain English
- Separation of concerns (what to test vs how to interact)

**Q: What is the structure of a Page class in Playwright?**
```
1. Imports — only what this file directly uses
2. Declarations — readonly properties for each locator
3. Constructor — receives page, calls super(), assigns locators using this
4. Methods — actions the page can perform
```

**Q: Where do assertions go — in the Page Object or in the test?**
In the test. Page Objects expose actions and readable state (e.g., `getErrorMessage()`). Assertions belong in tests because:
- Page Objects become reusable across multiple tests with different assertions
- Mixing concerns makes Page Objects harder to maintain

**Q: What is `extends` and `super()` in POM?**
- `extends` — inheritance. `LoginPage extends BasePage` means LoginPage gets `this.page` and `goto()` from BasePage for free.
- `super(page)` — calls the parent class constructor. Must be the first line inside the child constructor.

**Q: What is `readonly` and why use it on locators?**
`readonly` means the property can only be assigned in the constructor and cannot be reassigned later. It protects locators from accidental overwriting and signals to other developers that this value is intentional and fixed.

**Q: What is `this` in TypeScript?**
`this` refers to the current object instance — like "my" in English. `this.emailInput` means "my emailInput" — the property belonging to this specific object.

---

### TypeScript Basics Used in Framework

**Q: Why do we use `type` in imports like `import { type Page }`?**
The `type` keyword tells TypeScript this import is only used as a type annotation, not as a runtime value. It results in cleaner compiled JavaScript as type-only imports are erased at build time.

**Q: What is a `class` in TypeScript?**
A class is a blueprint. It describes what properties and methods every object created from it will have. The class itself does nothing — you need `new ClassName()` to create an actual object from it.

**Q: What is a `constructor`?**
The constructor is a special method that runs automatically when you create an object with `new`. It sets up the object's initial state — receiving arguments and assigning properties using `this`.

---

### Test Structure

**Q: Why should tests be independent of each other?**
Playwright can run tests in any order, in parallel, or individually. If Test B depends on Test A having run first, running Test B alone will fail. Each test must set up its own state from scratch.

**Q: What is the naming convention for test names?**
`should + expected behaviour` — e.g.:
- `should login with valid credentials`
- `should show error for invalid credentials`
- `should redirect to homepage after logout`

**Q: What is `baseURL` in `playwright.config.ts`?**
A shared base URL that Playwright prepends to all relative paths. Instead of `page.goto('https://automationexercise.com/login')`, you write `page.goto('/login')` and Playwright combines them automatically.

---

### Configuration

**Q: What does `screenshot: 'only-on-failure'` do?**
Playwright captures a screenshot automatically when a test fails. Options:
- `'on'` — capture for every test
- `'only-on-failure'` — capture only on failure (standard for real projects)
- `'off'` — never capture

**Q: What does `trace: 'on-first-retry'` do?**
Playwright records a trace (DOM snapshots, network, console logs, screenshots) when a test is retried. You can view it with `npx playwright show-trace`. Extremely useful for debugging CI failures.

**Q: What is `fullyParallel: true`?**
Every test runs in its own worker process simultaneously. Tests must be independent (no shared state) for this to work correctly.

**Q: What is `retries: process.env.CI ? 2 : 0`?**
On CI, failed tests are retried up to 2 times before being marked as failed. Locally, no retries — you want immediate feedback during development.

---

## SECTION 2 — Most Asked Questions (LinkedIn, Naukri, Glassdoor, Company Interviews)

*Source: CTS, Capgemini, Wipro, product startups interview experiences, Naukri job posts, Glassdoor reviews*

---

### Top 10 Most Frequently Asked

**1. How does Playwright differ from Selenium and Cypress?**
- vs Selenium: no WebDriver, built-in auto-wait, faster, API testing built-in
- vs Cypress: Playwright supports multiple browsers including WebKit (Safari), multi-tab, multi-origin, and is not limited to JavaScript

**2. What is auto-waiting? When does it fall short?**
Auto-waiting checks: attached, visible, stable, enabled, receivable. It falls short for:
- Custom animations with non-standard timing
- Elements that appear after a network response — use `waitForResponse()` instead
- Assertions on non-element state — use explicit `expect().toHaveURL()` etc.

**3. What locator strategies are available and which do you prefer?**
*(See Section 1 — Locators)*

**4. What is a fixture in Playwright and why use it over `beforeEach`?**
Fixtures are Playwright's dependency injection. Unlike `beforeEach`:
- Reusable across any test file
- Lazily created (only if the test uses them)
- Automatically torn down after test
- Composable — fixtures can use other fixtures
- Type-safe

**5. Explain Page Object Model with an example.**
*(See Section 1 — POM)*

**6. How do you handle authentication in tests?**
Options:
- Login via UI in a fixture, save `storageState` to a file, reuse across tests
- Login via API call (faster), set cookies/tokens on the browser context
- Worker-scoped fixture for expensive auth setup shared across tests in a worker

**7. How do you store sensitive data like credentials securely?**
Use `.env` file with `dotenv` library. The `.env` file is listed in `.gitignore` and never pushed to GitHub. Tests read credentials via `process.env.EMAIL` etc.

**8. How do you handle iframes in Playwright?**
```typescript
const frame = page.frameLocator('iframe#id');
await frame.getByRole('button', { name: 'Submit' }).click();
```

**9. What is the difference between hard and soft assertions?**
- Hard (default): test stops immediately on failure
- Soft: test continues, all failures collected and reported at the end
```typescript
await expect.soft(page.getByText('Error')).toBeVisible();
```

**10. How are your tests integrated with CI/CD?**
GitHub Actions workflow triggers on push/PR. It installs dependencies, installs browsers, runs tests, and uploads HTML report as artifact. Failed runs retain screenshots and videos for debugging.

---

### Framework Design Questions (Senior/SDET Level)

**Q: How did you structure your automation framework?**
`pages/` for POM classes, `tests/e2e/` for UI tests, `tests/api/` for API tests, `fixtures/` for shared setup, `utils/` for helpers, `test-data/` for JSON data. Config centralised in `playwright.config.ts`. CI via GitHub Actions.

**Q: How do you manage test data?**
- Static JSON files for stable reference data
- `@faker-js/faker` for unique user data per run
- `.env` for credentials that must not be committed

**Q: How do you avoid flaky tests?**
- Use Playwright's built-in locators (auto-wait)
- Never use `page.waitForTimeout()` (hardcoded sleep)
- Isolate test state — no shared state between tests
- Use `expect().toBeVisible()` with appropriate timeouts
- Run tests in isolation to catch order-dependency issues

**Q: How do you speed up CI test runs?**
- Sharding: `--shard=1/3` splits tests across machines
- Worker-scoped fixtures reduce expensive setup (e.g., auth)
- Cache browser binaries in CI
- Run only changed tests with `--grep`

**Q: What is the difference between `page`, `context`, and `browser` in Playwright?**
- `browser` — the browser instance (Chrome, Firefox, WebKit)
- `context` — isolated session (like incognito window) — has its own cookies, storage
- `page` — a single tab within a context

Each test gets its own `context` by default — that's why tests are isolated.

---

### QA Fundamentals (Also Asked)

**Q: What is the difference between smoke and sanity testing?**
- Smoke: broad, shallow — does the build work at all? (e.g., can you open the app, login, navigate)
- Sanity: narrow, deep — does this specific feature/fix work correctly after a change?

**Q: What is severity vs priority of a defect?**
- Severity: how badly does it impact the system? (technical impact)
- Priority: how urgently must it be fixed? (business impact)
Example: broken logo = low severity, but high priority if it's a brand-critical release.

**Q: What is RTM (Requirement Traceability Matrix)?**
A document that maps each requirement to its corresponding test cases — ensures every requirement is tested and no test exists without a requirement.

**Q: What factors decide which test cases to automate?**
- Repetitive tests run frequently (regression)
- Stable features (not changing every sprint)
- Data-driven tests with many combinations
- High business risk areas
- NOT: one-time tests, exploratory tests, tests requiring human judgement

---

## Sources
- [70+ Playwright Interview Questions (softwaretestingmaterial.com)](https://www.softwaretestingmaterial.com/playwright-interview-questions/)
- [CTS Playwright Interview Questions (testleaf.com)](https://www.testleaf.com/blog/cts-playwright-interview-questions-with-real-world-answers/)
- [85+ Playwright Questions (testdino.com)](https://testdino.com/playwright-interview-questions-answers-2026)
- [Playwright Q&A (interviewbit.com)](https://www.interviewbit.com/playwright-interview-questions-answers/)
- [Automation Testing Questions (naukri.com)](https://www.naukri.com/code360/library/automation-testing-interview-questions)
- [Playwright Jobs on Naukri — 2964 openings](https://www.naukri.com/playwright-jobs)
- [Glassdoor — Playwright QA Interview Experiences](https://www.glassdoor.com/Interview/automation-qa-playwright-interview-questions-SRCH_KO0,24.htm)
