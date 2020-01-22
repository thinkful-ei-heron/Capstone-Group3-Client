describe("navigate to a project", () => {
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
  it("Dashboard check", () => {
    cy.url().should("equal", "http://localhost:3000/dashboard");
  });

  it("Renders correct project", () => {
    cy.get("[test-id=project-link]").click();
    cy.get("[test-id=projectContainer]")
      .invoke("attr", "test-data")
      .then(projId => {
        cy.url().should("include", projId);
      });
  });
});
