import { BUTTON_TEXT, SELECTORS, API_ENDPOINTS, STATUS_CODES, TIMEOUTS } from "../support/constants";

class LoginPage {
  enterUsername(username) {
    cy.get(SELECTORS.loginUsername).clear().type(username);
  }

  enterPassword(password) {
    cy.get(SELECTORS.loginPassword).clear().type(password);
  }

  submit() {
    cy.contains("button", BUTTON_TEXT.logIn).click();
  }

  login(username, password) {
    cy.intercept("POST", API_ENDPOINTS.login).as("loginRequest");

    cy.get(SELECTORS.loginModal)
      .should("be.visible");

    this.enterUsername(username);
    this.enterPassword(password);
    this.submit();

    cy.wait("@loginRequest")
      .its("response.statusCode")
      .should("eq", STATUS_CODES.ok);

    cy.get(SELECTORS.userNameDisplay, { timeout: TIMEOUTS.default })
      .should("be.visible")
      .and("contain", username);

    return cy.wrap(username);
  }
}

export default new LoginPage();