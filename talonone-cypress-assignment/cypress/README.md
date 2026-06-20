# Talon.One Cypress Automation Assignment

Author: Gagandeepsingh Jaspalsingh Chawla

## Overview

This project contains Cypress end-to-end tests for the Demoblaze e-commerce application:

https://www.demoblaze.com

The goal of this assignment is to automate the essential user flows for login and purchasing a laptop. Since there was no existing automation coverage, the test suite was created from scratch with a focus on critical business flows, stable execution, and readable test structure.

## Tech Stack

* Cypress
* JavaScript
* Node.js
* Page Object Model
* Cypress Network Intercepts

## Test Scenarios Covered

### Smoke Tests

* Verify homepage loads successfully
* Verify product categories are displayed
* Verify navigation menu items are visible
* Verify products are loaded on the homepage

### Authentication Tests

* Create a new user account
* Login successfully with valid credentials
* Validate error message for invalid login credentials

### Product and Cart Tests

* Navigate to Laptops category
* Verify laptop products are displayed
* Add Sony vaio i5 laptop to cart
* Verify product and price in cart
* Remove product from cart
* Complete laptop purchase flow successfully

## Test Design Approach

The assignment requested focus on the essential login and purchase flow. Therefore, the highest priority was given to the critical user journey:

1. Create a new user
2. Login with the created user
3. Select laptop category
4. Add laptop to cart
5. Verify cart details
6. Complete purchase
7. Verify purchase confirmation

Additional coverage was added for invalid login, category navigation, and cart removal to cover both positive and negative scenarios.

## Synchronization Strategy

The tests avoid unnecessary static waits and use Cypress retry assertions wherever possible.

Network requests are handled using `cy.intercept()` and `cy.wait()` for important backend calls such as:

* Signup
* Login
* Product category loading
* Add to cart
* Remove from cart
* Homepage product loading

Status code validations are also included to confirm backend requests are completed successfully.

## Project Structure

```text
cypress
├── e2e
│   ├── auth
│   │   ├── signup.cy.js
│   │   ├── login.cy.js
│   │   └── invalid-login.cy.js
│   │
│   ├── purchase
│   │   ├── laptop-purchase.cy.js
│   │   └── remove-product.cy.js
│   │
│   └── smoke
│       ├── homepage.cy.js
│       └── category-navigation.cy.js
│
├── pages
│   ├── HomePage.js
│   ├── LoginPage.js
│   ├── SignupPage.js
│   ├── ProductPage.js
│   └── CartPage.js
│
├── support
│   ├── constants
│   │   ├── index.js
│   │   ├── apiEndpoints.js
│   │   ├── selectors.js
│   │   ├── buttonText.js
│   │   ├── categoryNames.js
│   │   ├── productNames.js
│   │   ├── pageText.js
│   │   ├── navLinks.js
│   │   ├── defaultCredentials.js
│   │   ├── statusCodes.js
│   │   ├── timeouts.js
│   │   └── testData.js
│   │
│   ├── commands.js
│   └── e2e.js
│
└── fixtures
```

## Constants Management

To improve readability and avoid hardcoded values, reusable constants are grouped under `cypress/support/constants`.

## How to Run the Tests

### 1. Clone the Repository

git clone <repository-url>

### 2. Navigate to the Project Folder

cd talonone-cypress-assignment

### 3. Install Dependencies

npm install

### 4. Run Tests in Headless Mode

npx cypress run

### 5. Run Tests in Cypress UI Mode

npx cypress open

Then select the required test file from the Cypress test runner.

## Important Notes

* Dynamic usernames are generated during tests to avoid duplicate signup failures.
* The Demoblaze application uses browser alerts, so Cypress stubs are used to validate alert messages.
* The public Demoblaze website can occasionally be flaky. If a test fails, please retry the execution once. Additional timeouts and alert validations have been added to improve reliability.

## Future Improvements

Given more time, the following improvements could be added:

* Add Mochawesome or Cypress Cloud reporting
* Add GitHub Actions pipeline for CI execution
* Add cross-browser test execution
* Add more negative checkout validations

## AI Tool Usage Disclosure

AI tools were used as a support tool during this assignment for brainstorming, troubleshooting, code reviews, and improving Cypress best practices. However, all framework design, implementation, test coverage decisions, project setup, execution, validation, and final submission were independently completed and reviewed by me. The README content was created with AI assistance and then reviewed and customized by me.