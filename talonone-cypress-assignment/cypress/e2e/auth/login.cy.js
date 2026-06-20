import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";

describe("Login Test", () => {

  it("should login successfully with valid credentials", () => {

    const username = `user_${Date.now()}`;
    const password = "Test@12345";

    // Open app
    cy.visit("/");

    // SIGNUP FLOW
    HomePage.openSignup();

    cy.wait(1000);

    cy.get("#sign-username").type(username);
    cy.get("#sign-password").type(password);

    cy.on("window:alert", (text) => {
      expect(text).to.contains("Sign up successful");
    });

    cy.contains("button", "Sign up").click();

    cy.wait(2000);

    // Close signup modal manually
    cy.get("#signInModal")
      .should("not.be.visible");

    // LOGIN FLOW
    HomePage.openLogin();

    cy.wait(1000);

    LoginPage.enterUsername(username);
    LoginPage.enterPassword(password);

    LoginPage.submit();

    cy.wait(3000);

    // ASSERTION
    cy.get("#nameofuser", { timeout: 10000 })
      .should("be.visible")
      .and("contain", username);

  });
});