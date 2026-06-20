import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import SignupPage from "../../pages/SignupPage";
import { DEFAULT_CREDENTIALS } from "../../support/constants/defaultCredentials";

describe("Login Test", () => {
  it("should login successfully with valid credentials", () => {
    const username = `u${Date.now().toString().slice(-6)}`;
    const password = DEFAULT_CREDENTIALS.password;

    cy.visit("/");

    // Create a new user account for login validation
    HomePage.openSignup();
    SignupPage.signupAndClose(username, password).then(() => {
      // Login with the newly created user
      HomePage.openLogin();

      LoginPage.login(username, password);
    });
  });
});