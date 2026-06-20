import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import { API_ENDPOINTS, STATUS_CODES } from "../../support/constants";

describe("Invalid Login Test", () => {
  it("should show an error message for invalid credentials", () => {

    // Open login modal and attempt authentication with invalid credentials
    cy.visit("/");

    cy.intercept("POST", API_ENDPOINTS.login).as("loginRequest");

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
      .should("eq", STATUS_CODES.ok);

    // Verify user is not allowed to log in
    cy.get("@loginAlert")
      .should("have.been.calledWithMatch", /User does not exist|Wrong password/);
  });
});