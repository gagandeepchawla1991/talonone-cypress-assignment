import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";

describe("Login Test", () => {
  it("should login successfully with valid credentials", () => {
    const username = `user_${Date.now()}${Cypress._.random(1000, 9999)}`;
    const password = "Test@12345";

    cy.visit("/");

    // SIGNUP FLOW
    cy.intercept("POST", "**/signup").as("signupRequest");

    HomePage.openSignup();

    cy.get("#sign-username")
      .should("be.visible")
      .clear()
      .type(username);

    cy.get("#sign-password")
      .should("be.visible")
      .clear()
      .type(password);

    cy.window().then((win) => {
      cy.stub(win, "alert").as("signupAlert");
    });

    cy.contains("button", "Sign up")
      .should("be.visible")
      .click();

    cy.wait("@signupRequest")
      .its("response.statusCode")
      .should("eq", 200);

    cy.get("@signupAlert")
      .should("have.been.calledWithMatch", /Sign up successful/);

    cy.get("#signInModal .close").click({ force: true });

    // LOGIN FLOW
    cy.intercept("POST", "**/login").as("loginRequest");

    HomePage.openLogin();

    LoginPage.enterUsername(username);
    LoginPage.enterPassword(password);
    LoginPage.submit();

    cy.wait("@loginRequest")
      .its("response.statusCode")
      .should("eq", 200);

    cy.get("#nameofuser", { timeout: 10000 })
      .should("be.visible")
      .and("contain", username);
  });
});