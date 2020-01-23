describe('catchall Page', () => {
  describe('/testing redir to /', () => {
    before(() => {
      cy.visit('/testing', { timeout: 8000 })
    })
    it('Redirects to Home (/)', () => {
      console.log(cy.url())
      cy.url().should('equal', 'http://localhost:3000/')
    })
  })
})

describe('Redirect', () => {
  describe('/dashboard redir to /', () => {
    before(() => {
      cy.visit('/dashboard', { timeout: 8000 })
    })
    it('Redirects to Home (/)', () => {
      console.log(cy.url())
      cy.url().should('equal', 'http://localhost:3000/')
    })
  })
})
