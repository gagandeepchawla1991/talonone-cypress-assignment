import HomePage from "../../pages/HomePage";
import SignupPage from "../../pages/SignupPage";

describe("Signup Test", () => {
  it("should create a new user successfully", () => {
    const username = `user_${Date.now()}${Cypress._.random(1000, 9999)}`;
    const password = "Test@12345";

    cy.visit("/");

    // Create a new user account
    cy.intercept("POST", "**/signup").as("signupRequest");

    HomePage.openSignup();

    SignupPage.enterUsername(username);
    SignupPage.enterPassword(password);

    cy.window().then((win) => {
      cy.stub(win, "alert").as("signupAlert");
    });

    SignupPage.submit();

    cy.wait("@signupRequest")
      .its("response.statusCode")
      .should("eq", 200);

    // Verify successful account creation
    cy.get("@signupAlert")
      .should("have.been.calledWithMatch", /Sign up successful/);
  });
});