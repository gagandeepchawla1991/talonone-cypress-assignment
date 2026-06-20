import HomePage from "../../pages/HomePage";
import SignupPage from "../../pages/SignupPage";

describe("Signup Test", () => {

  it("should create a new user successfully", () => {

    const username = `user_${Date.now()}`;
    const password = "Test@12345";

    cy.visit("/");

    HomePage.openSignup();

    cy.wait(1000);

    SignupPage.enterUsername(username);
    SignupPage.enterPassword(password);

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Sign up successful");
    });

    SignupPage.submit();
  });
});