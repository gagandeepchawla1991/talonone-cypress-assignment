import HomePage from "../../pages/HomePage";
import { API_ENDPOINTS, CATEGORY_NAMES, PRODUCT_NAMES, SELECTORS } from "../../support/constants";
import { STATUS_CODES } from "../../support/constants/statusCodes";
import { TIMEOUTS } from "../../support/constants/timeouts";

describe("Category Navigation Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display laptop products after selecting Laptops category", () => {

    // Navigate to laptops category
    cy.intercept("POST", API_ENDPOINTS.categories).as("loadLaptops");

    HomePage.selectCategory(CATEGORY_NAMES.laptops);

    cy.wait("@loadLaptops")
      .its("response.statusCode")
      .should("eq", STATUS_CODES.ok);

    // Verify laptop products are displayed
    cy.contains(SELECTORS.cardTitle, PRODUCT_NAMES.sonyVaioI5, { timeout: TIMEOUTS.default })
      .should("be.visible");

    cy.contains(SELECTORS.cardTitle, PRODUCT_NAMES.macBookAir, { timeout: TIMEOUTS.default })
      .should("be.visible");
  });
});