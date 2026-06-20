import HomePage from "../../pages/HomePage";
import ProductPage from "../../pages/ProductPage";
import CartPage from "../../pages/CartPage";

const password = "Test@12345";

const generateUsername = () => {
  return `u${Cypress._.random(10000, 99999)}`;
};

// Create a new user account
const signupUser = (retries = 2) => {
  const username = generateUsername();

  cy.intercept("POST", "**/signup").as("signupRequest");

  HomePage.openSignup();

  cy.get("#signInModal")
    .should("be.visible");

  cy.get("#sign-username")
    .should("be.visible")
    .clear()
    .type(username);

  cy.get("#sign-password")
    .should("be.visible")
    .clear()
    .type(password);

  cy.window().then((win) => {
    cy.stub(win, "alert").as("signupAlert");
  });

  cy.contains("button", "Sign up")
    .should("be.visible")
    .click();

  cy.wait("@signupRequest")
    .its("response.statusCode")
    .should("eq", 200);

  return cy.get("@signupAlert")
    .should("have.been.called")
    .then((alertStub) => {
      const alertText = alertStub.getCall(0).args[0];

      if (alertText.includes("Sign up successful")) {
        cy.get("#signInModal .close").click({ force: true });

        cy.get("#signInModal")
          .should("not.be.visible");

        return cy.wrap(username);
      }

      if (alertText.includes("already exist") && retries > 0) {
        cy.get("#signInModal .close").click({ force: true });

        cy.get("#signInModal")
          .should("not.be.visible");

        return signupUser(retries - 1);
      }

      throw new Error(`Signup failed with alert: ${alertText}`);
    });
};

describe("Laptop Purchase Flow", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should complete laptop purchase successfully", () => {
    signupUser().then((username) => {

      // Login with the newly created user
      cy.intercept("POST", "**/login").as("loginRequest");

      HomePage.openLogin();

      cy.get("#logInModal")
        .should("be.visible");

      cy.get("#loginusername")
        .should("be.visible")
        .clear()
        .type(username);

      cy.get("#loginpassword")
        .should("be.visible")
        .clear()
        .type(password);

      cy.contains("button", "Log in")
        .should("be.visible")
        .click();

      cy.wait("@loginRequest")
        .its("response.statusCode")
        .should("eq", 200);

      cy.get("#nameofuser", { timeout: 10000 })
        .should("be.visible")
        .and("contain", username);

      // Navigate to laptops category and add product to cart
      cy.intercept("POST", "**/bycat").as("loadLaptops");

      HomePage.selectCategory("Laptops");

      cy.wait("@loadLaptops")
        .its("response.statusCode")
        .should("eq", 200);

      cy.contains(".card-title", "Sony vaio i5", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.url()
        .should("include", "prod.html");

      cy.intercept("POST", "**/addtocart").as("addToCart");

      cy.window().then((win) => {
        cy.stub(win, "alert").as("cartAlert");
      });

      ProductPage.addToCart();

      cy.wait("@addToCart")
        .its("response.statusCode")
        .should("eq", 200);

      cy.get("@cartAlert")
        .should("have.been.calledWithMatch", /Product added/);

      // Verify cart details before checkout
      ProductPage.goToCart();

      cy.contains("Sony vaio i5", { timeout: 10000 })
        .should("be.visible");

      cy.get("#totalp", { timeout: 10000 })
        .should("be.visible")
        .and("contain", "790");

      // Complete purchase and verify order confirmation
      CartPage.placeOrder();

      cy.get("#orderModal")
        .should("be.visible");

      cy.get("#name").should("be.visible").clear().type("Test User");
      cy.get("#country").clear().type("Germany");
      cy.get("#city").clear().type("Berlin");
      cy.get("#card").clear().type("4111111111111111");
      cy.get("#month").clear().type("12");
      cy.get("#year").clear().type("2028");

      cy.contains("button", "Purchase")
        .should("be.visible")
        .click();

      cy.contains("Thank you for your purchase!", { timeout: 10000 })
        .should("be.visible");
    });
  });
});