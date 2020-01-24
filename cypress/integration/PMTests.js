describe('navigate to a project', () => {
  const login = () => {
    cy.visit('/login')
    cy.get('[test-id=login-email]').type('bridgerrhammond@gmail.com')
    cy.get('[test-id=login-password]').type('password')
    cy.get('[test-id=login-button]')
      .click()
      .wait(500)
  }

  const logout = () => {
    cy.get('[test-id=logout-button]')
      .click()
      .wait(500)
  }

  const clickAndType = (target, text) => {
    cy.get(`[test-id=${target}]`)
      .click()
      .type(`${text}`)
      .wait(200)
    cy.get(`[test-id=${target}]`).should('have.value', `${text}`)
  }

  before(() => {
    login()
  })
  after(() => {
    logout()
  })

  // just ignore the random XHR errors in Cypress, they're fine!

  it('Inputs correct information on New Project', () => {
    cy.get('[test-id=new-project]')
      .click()
      .wait(200)
    clickAndType('project_name', 'Cypress Project Name')
    clickAndType('project_desc', 'Cypress Project Desc')
    clickAndType('project_deadline', '2021-01-25')
    cy.contains('Select...')
      .click()
      .wait(200)
    cy.contains('ggg')
      .first()
      .click()
      .wait(200)
    // unable to test due to custom/React classes being used
    // cy.get('[test-id=prject_man')
  })
  it('Submits filled out project form', () => {
    cy.get('[test-id=project-submit]')
      .click()
      .wait(500)
    cy.get('[test-id=project-link]')
      .contains('Cypress Project Name')
      .should('be.visible')
  })
  it('Opens project correctly', () => {
    cy.get('[test-id=project-link]')
      .contains('Cypress Project Name')
      .click()
      .wait(200)
    cy.get('[test-id=projectContainer]')
      .invoke('attr', 'test-data')
      .then(projId => {
        cy.url().should('include', projId)
      })
  })
  it('Allows PM to fill out task info', () => {
    cy.get('[test-id=add-task]')
      .click()
      .wait(200)
    clickAndType('task-name', 'testing')
    clickAndType('task-desc', 'text desc')
    clickAndType('task-hours', '10')
    clickAndType('task-deadline', '2021-01-24')
    cy.contains('Assign Employees')
      .click()
      .wait(200)
    cy.contains('newsignup')
      .first()
      .click()
      .wait(200)
  })
  it('Allows PM to submit new task', () => {
    // currently bugged, unable to submit tasks using WORC promotions?
    cy.get('[test-id=submit-task')
      .click()
      .wait(200)
    cy.contains('testing').should('be.visible')
  })
})
