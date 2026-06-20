import HomePage from "../../pages/HomePage";
import SignupPage from "../../pages/SignupPage";
import { DEFAULT_CREDENTIALS } from "../../support/constants";

describe("Signup Test", () => {
  it("should create a new user successfully", () => {
    const username = `user_${Date.now()}${Cypress._.random(1000, 9999)}`;
    const password = DEFAULT_CREDENTIALS.password;

    cy.visit("/");

    HomePage.openSignup();

    SignupPage.signupAndClose(username, password);
  });
});