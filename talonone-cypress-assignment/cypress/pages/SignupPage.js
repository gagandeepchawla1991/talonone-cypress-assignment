import { BUTTON_TEXT, SELECTORS, API_ENDPOINTS, STATUS_CODES } from "../support/constants";

class SignupPage {
  signupAndClose(username, password, retries = 2) {
    cy.intercept("POST", API_ENDPOINTS.signup).as("signupRequest");
    
    cy.get(SELECTORS.signupModal).should("be.visible");
    
    cy.window().then((win) => {
      cy.stub(win, "alert").as("signupAlert");
    });

    const trySignup = (candidateUsername, remainingRetries) => {
      cy.get(SELECTORS.signupUsername).clear().type(candidateUsername);
      cy.get(SELECTORS.signupPassword).clear().type(password);

      cy.contains("button", BUTTON_TEXT.signUp).click();

      cy.wait("@signupRequest")
        .its("response.statusCode")
        .should("eq", STATUS_CODES.ok);

      return cy.get("@signupAlert")
        .should("have.been.called")
        .then((signupAlert) => {
          const latestAlertText = signupAlert.getCall(signupAlert.callCount - 1).args[0] || "";

          if (/Sign up successful/i.test(latestAlertText)) {
            cy.get(`${SELECTORS.signupModal} .close`)
              .click({ force: true });

            cy.get(SELECTORS.signupModal)
              .should("not.be.visible");

            return cy.wrap(candidateUsername);
          }

          if (/already exist/i.test(latestAlertText) && remainingRetries > 0) {
            const nextUsername = `${candidateUsername}_${Cypress._.random(1000, 9999)}`;
            return trySignup(nextUsername, remainingRetries - 1);
          }

          throw new Error(`Signup failed with alert: ${latestAlertText}`);
        });
    };

    return trySignup(username, retries);
  }
}

export default new SignupPage();