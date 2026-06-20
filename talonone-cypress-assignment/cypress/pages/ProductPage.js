import { BUTTON_TEXT, SELECTORS } from "../support/constants";

class ProductPage {
  addToCart() {
    cy.contains(BUTTON_TEXT.addToCart).click();
  }

  goToCart() {
    cy.get(SELECTORS.cartLink).click();
  }
}

export default new ProductPage();