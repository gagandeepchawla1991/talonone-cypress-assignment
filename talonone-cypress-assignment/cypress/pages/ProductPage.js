class ProductPage {
  addToCart() {
    cy.contains("Add to cart").click();
  }

  goToCart() {
    cy.get("#cartur").click();
  }
}

export default new ProductPage();