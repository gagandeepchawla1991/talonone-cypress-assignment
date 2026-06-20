import HomePage from "../../pages/HomePage";
import ProductPage from "../../pages/ProductPage";
import { API_ENDPOINTS, CATEGORY_NAMES, PRODUCT_NAMES, BUTTON_TEXT, SELECTORS } from "../../support/constants";
import { STATUS_CODES } from "../../support/constants/statusCodes";
import { TIMEOUTS } from "../../support/constants/timeouts";
import { TEST_DATA } from "../../support/constants/testData";

describe("Remove Product From Cart Test", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should remove a laptop from the cart successfully", () => {

    // Navigate to laptops category and add product to cart
    cy.intercept("POST", API_ENDPOINTS.categories).as("loadLaptops");

    HomePage.selectCategory(CATEGORY_NAMES.laptops);

    cy.wait("@loadLaptops")
      .its("response.statusCode")
      .should("eq", STATUS_CODES.ok);

    cy.contains(SELECTORS.cardTitle, PRODUCT_NAMES.sonyVaioI5, { timeout: TIMEOUTS.default })
      .should("be.visible")
      .click();

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

    // Verify product is present in the cart
    ProductPage.goToCart();

    cy.contains(PRODUCT_NAMES.sonyVaioI5, { timeout: TIMEOUTS.default })
      .should("be.visible");

    cy.get(SELECTORS.totalPrice, { timeout: TIMEOUTS.default })
      .should("contain", TEST_DATA.expectedCartTotal);

    // Remove product and verify cart is updated
    cy.intercept("POST", API_ENDPOINTS.deleteItem).as("deleteItem");

    cy.contains("tr", PRODUCT_NAMES.sonyVaioI5)
      .within(() => {
        cy.contains("a", BUTTON_TEXT.delete).click();
      });

    cy.wait("@deleteItem")
      .its("response.statusCode")
      .should("eq", STATUS_CODES.ok);

    cy.contains(PRODUCT_NAMES.sonyVaioI5)
      .should("not.exist");

    cy.get(SELECTORS.totalPrice)
      .should("not.contain", TEST_DATA.expectedCartTotal);
  });
});