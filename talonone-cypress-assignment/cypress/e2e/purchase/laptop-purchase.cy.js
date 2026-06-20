import HomePage from "../../pages/HomePage";
import ProductPage from "../../pages/ProductPage";
import CartPage from "../../pages/CartPage";
import LoginPage from "../../pages/LoginPage";
import SignupPage from "../../pages/SignupPage";
import {
  API_ENDPOINTS,
  CATEGORY_NAMES,
  PRODUCT_NAMES,
  SELECTORS,
  BUTTON_TEXT,
  DEFAULT_CREDENTIALS,
  PAGE_TEXT,
  STATUS_CODES,
  TIMEOUTS,
  TEST_DATA,
} from "../../support/constants";

const password = DEFAULT_CREDENTIALS.password;

const generateUsername = () => {
  return `u${Cypress._.random(10000, 99999)}`;
};

describe("Laptop Purchase Flow", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should complete laptop purchase successfully", () => {
    const username = generateUsername();

    HomePage.openSignup();
    SignupPage.signupAndClose(username, password).then((createdUsername) => {

      // Login with the newly created user
      HomePage.openLogin();

      LoginPage.login(createdUsername, password);

      // Navigate to laptops category and add product to cart
      cy.intercept("POST", API_ENDPOINTS.categories).as("loadLaptops");

      HomePage.selectCategory(CATEGORY_NAMES.laptops);

      cy.wait("@loadLaptops")
        .its("response.statusCode")
        .should("eq", STATUS_CODES.ok);

      cy.contains(SELECTORS.cardTitle, PRODUCT_NAMES.sonyVaioI5, { timeout: TIMEOUTS.default })
        .should("be.visible")
        .click();

      cy.url()
        .should("include", "prod.html");

      cy.intercept("POST", API_ENDPOINTS.addToCart).as("addToCart");

      cy.window().then((win) => {
        cy.stub(win, "alert").as("cartAlert");
      });

      ProductPage.addToCart();

      cy.wait("@addToCart")
        .its("response.statusCode")
        .should("eq", STATUS_CODES.ok);

      cy.get("@cartAlert")
        .should("have.been.calledWithMatch", /Product added/);

      // Verify cart details before checkout
      ProductPage.goToCart();

      cy.contains(PRODUCT_NAMES.sonyVaioI5, { timeout: TIMEOUTS.default })
        .should("be.visible");

      cy.get(SELECTORS.totalPrice, { timeout: TIMEOUTS.default })
        .should("be.visible")
        .and("contain", TEST_DATA.expectedCartTotal);

      // Complete purchase and verify order confirmation
      CartPage.placeOrder();

      cy.get(SELECTORS.orderModal)
        .should("be.visible");

      CartPage.fillOrderForm();

      CartPage.confirmOrder();

      cy.contains(PAGE_TEXT.purchaseConfirmation, { timeout: TIMEOUTS.default })
        .should("be.visible");
    });
  });
});