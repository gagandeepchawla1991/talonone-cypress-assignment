import { API_ENDPOINTS, BUTTON_TEXT, CATEGORY_NAMES, NAV_LINKS, PAGE_TEXT, SELECTORS } from "../../support/constants";
import { STATUS_CODES } from "../../support/constants/statusCodes";
import { TIMEOUTS } from "../../support/constants/timeouts";

describe("Homepage Smoke Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load homepage successfully", () => {
    // Verify application branding is displayed
    cy.get(SELECTORS.navBarHeader)
      .should("be.visible")
      .and("contain", PAGE_TEXT.productStore);
  });

  it("should display all product categories", () => {
    // Verify product categories are available to users
    cy.get(SELECTORS.categoriesSection)
      .should("be.visible");

    cy.get(".list-group")
      .should("contain", CATEGORY_NAMES.phones)
      .and("contain", CATEGORY_NAMES.laptops)
      .and("contain", CATEGORY_NAMES.monitors);
  });

  it("should display navigation menu items", () => {
    // Verify primary navigation menu items
    cy.get(SELECTORS.navbar)
      .should("be.visible")
      .within(() => {
        cy.contains("a.nav-link", NAV_LINKS.home).should("be.visible");
        cy.contains("a.nav-link", NAV_LINKS.contact).should("be.visible");
        cy.contains("a.nav-link", NAV_LINKS.about).should("be.visible");
        cy.contains("a.nav-link", NAV_LINKS.cart).should("be.visible");
        cy.contains("a.nav-link", BUTTON_TEXT.logIn).should("be.visible");
        cy.contains("a.nav-link", BUTTON_TEXT.signUp).should("be.visible");
      });
  });

  it("should display products on homepage", () => {
    // Verify products are loaded successfully from the backend
    cy.intercept("GET", API_ENDPOINTS.entries).as("loadProducts");

    cy.reload();

    cy.wait("@loadProducts")
      .its("response.statusCode")
      .should("eq", STATUS_CODES.ok);

    cy.get(".card", { timeout: TIMEOUTS.default })
      .should("have.length.greaterThan", 0);
  });
});