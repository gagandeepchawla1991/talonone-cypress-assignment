import { BUTTON_TEXT, SELECTORS, TEST_DATA } from "../support/constants";

class CartPage {
  placeOrder() {
    cy.contains(BUTTON_TEXT.placeOrder).click();
  }

  fillOrderForm() {
    cy.get(SELECTORS.orderName).type(TEST_DATA.orderCustomerName);
    cy.get(SELECTORS.orderCountry).type(TEST_DATA.orderCountry);
    cy.get(SELECTORS.orderCity).type(TEST_DATA.orderCity);
    cy.get(SELECTORS.orderCard).type(TEST_DATA.orderCardNumber);
    cy.get(SELECTORS.orderMonth).type(TEST_DATA.orderMonth);
    cy.get(SELECTORS.orderYear).type(TEST_DATA.orderYear);
  }

  confirmOrder() {
    cy.contains(BUTTON_TEXT.purchase).click();
  }
}

export default new CartPage();