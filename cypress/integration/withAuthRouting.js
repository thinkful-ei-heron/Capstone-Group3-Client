describe("when authenticated", () => {
  const login = () => {
    cy.visit("/login");
    cy.get("[test-id=login-email]").type("bridgerrhammond@gmail.com");
    cy.get("[test-id=login-password]").type("password");
    cy.get("[test-id=login-button]").click();
  };

  const logout = () => {
    cy.get("[test-id=logout-button]").click();
  };

  before(() => {
    login();
  });
  after(() => {
    logout();
  });

  // just ignore the random XHR errors in Cypress, they're fine!
  it("Does not redirect", () => {
    // this will randomly fail,
    //we have no idea why redirect isn't 100% for this yet.
    cy.url().should("equal", "http://localhost:3000/dashboard");
  });
  it("Has correct name and role in header", () => {
    cy.get("[test-id=header-name").should(
      "have.text",
      "Welcome, Bridger Hammond!"
    );
  });
});
