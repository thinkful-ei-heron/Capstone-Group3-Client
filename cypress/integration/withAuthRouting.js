describe("when authenticated", () => {
  const login = () => {
    cy.visit("/login");
    cy.get("#login-email").type("bridgerrhammond@gmail.com");
    cy.get("#login-password").type("password");
    cy.get("#login-button").click();
  };

  before(() => {
    // Login using UI
    login();
  });
  afterEach(() => {
    cy.get("#logout-button").click();
    cy.visit("/");
  });

  it("Does not redirect", () => {
    // just ignore the random XHR errors in Cypress, they're fine!
    cy.url().should("equal", "http://localhost:3000/dashboard");
  });
});
