class HomePage {
  openLogin() {
    cy.get("#login2").click();
  }

  openSignup() {
    cy.get("#signin2").click();
  }

  selectCategory(category) {
    cy.contains(category).click();
  }

  openProduct(productName) {
    cy.contains(productName).click();
  }
}

export default new HomePage();