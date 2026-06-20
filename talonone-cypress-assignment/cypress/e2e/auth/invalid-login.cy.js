import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";

describe("Invalid Login Test", () => {
  it("should show an error message for invalid credentials", () => {

    // Open login modal and attempt authentication with invalid credentials
    cy.visit("/");

    cy.intercept("POST", "**/login").as("loginRequest");

    HomePage.openLogin();

    LoginPage.enterUsername("invalid_user");
    LoginPage.enterPassword("wrong_password");

    cy.window().then((win) => {
      cy.stub(win, "alert").as("loginAlert");
    });

    LoginPage.submit();

    // Verify login request was processed by the backend
    cy.wait("@loginRequest")
      .its("response.statusCode")
      .should("eq", 200);

    // Verify user is not allowed to log in
    cy.get("@loginAlert")
      .should("have.been.calledWithMatch", /User does not exist|Wrong password/);
  });
});