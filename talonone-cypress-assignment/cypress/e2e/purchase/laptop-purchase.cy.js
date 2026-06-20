import HomePage from "../../pages/HomePage";
import ProductPage from "../../pages/ProductPage";
import CartPage from "../../pages/CartPage";

const password = "Test@12345";

const generateUsername = () => {
  return `gagan${Date.now()}${Cypress._.random(10000, 99999)}`;
};

const signupUser = (retries = 2) => {
  const username = generateUsername();

  HomePage.openSignup();

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

  return cy.get("@signupAlert")
    .should("have.been.called")
    .then((alertStub) => {
      const alertText = alertStub.getCall(0).args[0];

      if (alertText.includes("Sign up successful")) {
        cy.get("#signInModal .close").click({ force: true });
        return cy.wrap(username);
      }

      if (alertText.includes("already exist") && retries > 0) {
        cy.get("#signInModal .close").click({ force: true });
        cy.wait(1000);
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
      HomePage.openLogin();

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

      cy.get("#nameofuser", { timeout: 10000 })
        .should("be.visible")
        .and("contain", username);

      cy.intercept("POST", "**/bycat").as("loadLaptops");

      HomePage.selectCategory("Laptops");

      cy.wait("@loadLaptops");

      cy.contains(".card-title", "Sony vaio i5", { timeout: 10000 })
        .should("be.visible")
        .click();

      cy.intercept("POST", "**/addtocart").as("addToCart");

      cy.window().then((win) => {
        cy.stub(win, "alert").as("cartAlert");
      });

      ProductPage.addToCart();

      cy.wait("@addToCart");

      cy.get("@cartAlert")
        .should("have.been.calledWithMatch", /Product added/);

      ProductPage.goToCart();

      cy.contains("Sony vaio i5", { timeout: 10000 })
        .should("be.visible");

      cy.get("#totalp", { timeout: 10000 })
        .should("be.visible")
        .and("contain", "790");

      CartPage.placeOrder();

      cy.get("#orderModal")
        .should("be.visible");

      cy.get("#name").type("Test User");
      cy.get("#country").type("Germany");
      cy.get("#city").type("Berlin");
      cy.get("#card").type("4111111111111111");
      cy.get("#month").type("12");
      cy.get("#year").type("2028");

      cy.contains("button", "Purchase")
        .should("be.visible")
        .click();

      cy.contains("Thank you for your purchase!", { timeout: 10000 })
        .should("be.visible");
    });
  });
});