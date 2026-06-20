class CartPage {
  placeOrder() {
    cy.contains("Place Order").click();
  }

  fillOrderForm() {
    cy.get("#name").type("Test User");
    cy.get("#country").type("Germany");
    cy.get("#city").type("Berlin");
    cy.get("#card").type("4111111111111111");
    cy.get("#month").type("12");
    cy.get("#year").type("2028");
  }

  confirmOrder() {
    cy.contains("Purchase").click();
  }
}

export default new CartPage();