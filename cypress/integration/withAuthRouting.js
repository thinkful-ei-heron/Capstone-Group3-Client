describe("when authenticated", () => {
  before(() => {
    // Login using custom token
    cy.login();
    // Go to /dashboard (which requires user to be logged in)
    cy.visit("/dashboard");
  });

  it("Does not redirect", () => {
    cy.url().should("equal", "/dashboard");
  });
});
