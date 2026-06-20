class LoginPage {
  enterUsername(username) {
    cy.get("#loginusername").clear().type(username);
  }

  enterPassword(password) {
    cy.get("#loginpassword").clear().type(password);
  }

  submit() {
    cy.contains("button", "Log in").click();
  }
}

export default new LoginPage();