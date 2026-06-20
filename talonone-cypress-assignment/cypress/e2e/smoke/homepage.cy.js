describe("Homepage Smoke Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load homepage successfully", () => {
    // Verify application branding is displayed
    cy.get("#nava")
      .should("be.visible")
      .and("contain", "PRODUCT STORE");
  });

  it("should display all product categories", () => {
    // Verify product categories are available to users
    cy.get("#cat")
      .should("be.visible");

    cy.get(".list-group")
      .should("contain", "Phones")
      .and("contain", "Laptops")
      .and("contain", "Monitors");
  });

  it("should display navigation menu items", () => {
    // Verify primary navigation menu items
    cy.get(".navbar-nav")
      .should("be.visible")
      .within(() => {
        cy.contains("a.nav-link", "Home").should("be.visible");
        cy.contains("a.nav-link", "Contact").should("be.visible");
        cy.contains("a.nav-link", "About us").should("be.visible");
        cy.contains("a.nav-link", "Cart").should("be.visible");
        cy.contains("a.nav-link", "Log in").should("be.visible");
        cy.contains("a.nav-link", "Sign up").should("be.visible");
      });
  });

  it("should display products on homepage", () => {
    // Verify products are loaded successfully from the backend
    cy.intercept("GET", "**/entries").as("loadProducts");

    cy.reload();

    cy.wait("@loadProducts")
      .its("response.statusCode")
      .should("eq", 200);

    cy.get(".card", { timeout: 10000 })
      .should("have.length.greaterThan", 0);
  });
});