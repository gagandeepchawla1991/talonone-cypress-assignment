import HomePage from "../../pages/HomePage";

describe("Category Navigation Test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display laptop products after selecting Laptops category", () => {

    // Navigate to laptops category
    cy.intercept("POST", "**/bycat").as("loadLaptops");

    HomePage.selectCategory("Laptops");

    cy.wait("@loadLaptops")
      .its("response.statusCode")
      .should("eq", 200);

    // Verify laptop products are displayed
    cy.contains(".card-title", "Sony vaio i5", { timeout: 10000 })
      .should("be.visible");

    cy.contains(".card-title", "MacBook air", { timeout: 10000 })
      .should("be.visible");
  });
});