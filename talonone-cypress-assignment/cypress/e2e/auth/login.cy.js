import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";

describe("Login Test", () => {
  it("should login successfully with valid credentials", () => {
    const username = `u${Date.now().toString().slice(-6)}`;
    const password = "Test@12345";

    cy.visit("/");

    // Create a new user account for login validation
    cy.intercept("POST", "**/signup").as("signupRequest");

    HomePage.openSignup();

    cy.get("#signInModal")
      .should("be.visible");

    cy.get("#sign-username")
      .should("be.visible")
      .clear()
      .type(username)
      .should("have.value", username);

    cy.get("#sign-password")
      .should("be.visible")
      .clear()
      .type(password)
      .should("have.value", password);

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

    cy.get("#signInModal .close")
      .click({ force: true });

    cy.get("#signInModal")
      .should("not.be.visible");

    // Login with the newly created user
    cy.intercept("POST", "**/login").as("loginRequest");

    HomePage.openLogin();

    cy.get("#logInModal")
      .should("be.visible");

    cy.get("#loginusername")
      .should("be.visible")
      .clear()
      .type(username)
      .should("have.value", username);

    cy.get("#loginpassword")
      .should("be.visible")
      .clear()
      .type(password)
      .should("have.value", password);

    LoginPage.submit();

    cy.wait("@loginRequest")
      .its("response.statusCode")
      .should("eq", 200);

    // Verify successful authentication
    cy.get("#nameofuser", { timeout: 10000 })
      .should("be.visible")
      .and("contain", username);
  });
});