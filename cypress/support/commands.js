// cypress/support/commands.js

Cypress.Commands.add('login', (userType = 'staff') => {
    // Define mock users
    const users = {
        staff: {
            email: 'staff@example.com',
            password: 'password123',
            mockResponse: {
                accessToken: 'staff-token',
                role: 'STAFF',
                userData: {
                    email: 'staff@example.com',
                    firstName: 'Staff',
                    lastName: 'User',
                    role: 'STAFF',
                    companyId: '1'
                }
            }
        },
        manager: {
            email: 'manager@example.com',
            password: 'password123',
            mockResponse: {
                accessToken: 'manager-token',
                role: 'MANAGER',
                userData: {
                    email: 'manager@example.com',
                    firstName: 'Manager',
                    lastName: 'User',
                    role: 'MANAGER',
                    companyId: '1'
                }
            }
        },
        customer: {
            email: 'customer@example.com',
            password: 'password123',
            mockResponse: {
                accessToken: 'customer-token',
                role: 'CUSTOMER',
                userData: {
                    email: 'customer@example.com',
                    firstName: 'Customer',
                    lastName: 'User',
                    role: 'CUSTOMER'
                }
            }
        }
    };

    const user = users[userType];

    if (!user) {
        throw new Error(`Unknown user type: ${userType}`);
    }

    // Mock the login endpoint
    cy.intercept('POST', '**/api/auth/login', {
        statusCode: 200,
        body: user.mockResponse
    }).as('loginRequest');

    // Mock the user data endpoint
    cy.intercept('GET', '**/api/users/byEmail/*', {
        statusCode: 200,
        body: user.mockResponse.userData
    }).as('getUserData');

    // Visit login page
    cy.visit('/login');

    // Perform login
    cy.get('[data-testid=email-input]').type(user.email);
    cy.get('[data-testid=password-input]').type(user.password);
    cy.get('[data-testid=login-button]').click();

    // Wait for login request to complete
    cy.wait('@loginRequest');
});