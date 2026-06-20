describe("Homepage Smoke Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load homepage successfully", () => {
    cy.get("#nava")
      .should("be.visible")
      .and("contain", "PRODUCT STORE");
  });

  it("should display all product categories", () => {
    cy.get("#cat").should("be.visible");

    cy.get(".list-group")
      .should("contain", "Phones")
      .and("contain", "Laptops")
      .and("contain", "Monitors");
  });

  it("should display navigation menu items", () => {
    cy.get(".navbar-nav")
      .should("be.visible")
      .within(() => {
        cy.get("a.nav-link").contains("Home").should("be.visible");
        cy.get("a.nav-link").contains("Contact").should("be.visible");
        cy.get("a.nav-link").contains("About us").should("be.visible");
        cy.get("a.nav-link").contains("Cart").should("be.visible");
        cy.get("a.nav-link").contains("Log in").should("be.visible");
        cy.get("a.nav-link").contains("Sign up").should("be.visible");
      });
  });

  it("should display products on homepage", () => {
    cy.get(".card", { timeout: 10000 })
      .should("have.length.greaterThan", 0);
  });
});