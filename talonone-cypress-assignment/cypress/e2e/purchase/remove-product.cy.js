import HomePage from "../../pages/HomePage";
import ProductPage from "../../pages/ProductPage";

describe("Remove Product From Cart Test", () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit("/");
  });

  it("should remove a laptop from the cart successfully", () => {

    // Navigate to laptops category and add product to cart
    cy.intercept("POST", "**/bycat").as("loadLaptops");

    HomePage.selectCategory("Laptops");

    cy.wait("@loadLaptops")
      .its("response.statusCode")
      .should("eq", 200);

    cy.contains(".card-title", "Sony vaio i5", { timeout: 10000 })
      .should("be.visible")
      .click();

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

    // Verify product is present in the cart
    ProductPage.goToCart();

    cy.contains("Sony vaio i5", { timeout: 10000 })
      .should("be.visible");

    cy.get("#totalp", { timeout: 10000 })
      .should("contain", "790");

    // Remove product and verify cart is updated
    cy.intercept("POST", "**/deleteitem").as("deleteItem");

    cy.contains("tr", "Sony vaio i5")
      .within(() => {
        cy.contains("a", "Delete").click();
      });

    cy.wait("@deleteItem")
      .its("response.statusCode")
      .should("eq", 200);

    cy.contains("Sony vaio i5")
      .should("not.exist");

    cy.get("#totalp")
      .should("not.contain", "790");
  });
});