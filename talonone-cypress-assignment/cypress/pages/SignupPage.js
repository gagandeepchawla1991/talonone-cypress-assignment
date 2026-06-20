class SignupPage {
  enterUsername(username) {
    cy.get("#sign-username").type(username);
  }

  enterPassword(password) {
    cy.get("#sign-password").type(password);
  }

  submit() {
    cy.contains("button", "Sign up").click();
  }
}

export default new SignupPage();