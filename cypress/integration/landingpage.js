describe("catchall Page", () => {
  describe("it works", () => {
    before(() => {
      // Attempt to go to /dashboard (requires user to be logged in)
      cy.visit("/testing", { timeout: 8000 });
    });
    it("Redirects to Home (/)", () => {
      console.log(cy.url());
      cy.url().should("equal", "http://localhost:3000/testing");
    });
  });
});

describe("Redirect", () => {
  describe("landing page with no auth", () => {
    before(() => {
      // Attempt to go to /dashboard (requires user to be logged in)
      cy.visit("/dashboard", { timeout: 8000 });
    });
    it("Redirects to Home (/)", () => {
      console.log(cy.url());
      cy.url().should("equal", "http://localhost:3000/");
    });
  });
});
