Cypress.Commands.add('loginAs', (role) => {
    const users = {
        admin: {
            email: Cypress.env('ADMIN_EMAIL'),
            password: Cypress.env('ADMIN_PASSWORD'),
        },
        manager: {
            email: Cypress.env('MANAGER_EMAIL'),
            password: Cypress.env('MANAGER_PASSWORD'),
        },
    };

    const user = users[role.toLowerCase()];
    if (!user) {
        throw new Error(`Unknown role: ${role}`);
    }

    // Visit login page
    cy.visit('/login', {
        onBeforeLoad: (win) => {
            win.sessionStorage.clear();
            win.localStorage.clear();
        },
    });

    // Ensure email input is visible and not disabled, then type email
    cy.get('[data-testid="email-input"]')
        .should('be.visible')
        .and('not.be.disabled');
    cy.get('[data-testid="email-input"]').type(user.email);

    // Ensure password input is visible and not disabled, then type password
    cy.get('[data-testid="password-input"]')
        .should('be.visible')
        .and('not.be.disabled');
    cy.get('[data-testid="password-input"]').type(user.password);

    // Ensure login button is visible and not disabled, then click
    cy.get('[data-testid="login-button"]')
        .should('be.visible')
        .and('not.be.disabled');
    cy.get('[data-testid="login-button"]').click();

    // Validate successful navigation
    cy.url().should('include', '/admin-dashboard');
});