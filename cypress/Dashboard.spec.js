describe("Dashboard Page", () => {
  describe("when not authenticated", () => {
    before(() => {
      // Attempt to go to /dashboard (requires user to be logged in)
      cy.visit("/dashboard");
    });
    it("Redirects to Home (/)", () => {
      cy.url().should("equal", "/");
    });
  });

  // describe("when authenticated", () => {
  //   before(() => {
  //     // Login using custom token
  //     cy.login();
  //     // Go to /projects (which requires user to be logged in)
  //     cy.visit("/projects");
  //   });

  //   it("Does not redirect", () => {
  //     cy.url().should("equal", "/projects");
  //   });
  // });
});
