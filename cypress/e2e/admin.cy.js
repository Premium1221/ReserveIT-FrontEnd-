describe('Admin Dashboard', () => {
    let userEmail;
    let restaurantEmail;

    beforeEach(() => {
        cy.loginAs('admin');
        cy.visit('/admin-dashboard');
    });
    describe('Dashboard UI Elements', () => {
        it('should render all dashboard components', () => {
            cy.get('[data-testid="dashboard-header"]').should('exist');
            cy.get('[data-testid="tab-controls"]').should('exist');
            cy.get('[data-testid="controls"]').should('exist');
            cy.get('[data-testid="tab-Users"]').should('be.visible');
            cy.get('[data-testid="tab-Restaurants"]').should('be.visible');
        });

        it('should switch between users and restaurants tabs', () => {
            cy.get('[data-testid="tab-Users"]').click();
            cy.get('[data-testid="user-card"]').should('exist');

            cy.get('[data-testid="tab-Restaurants"]').click();
            cy.get('[data-testid="restaurant-card"]').should('exist');
        });
    });

    describe('User Management', () => {
        beforeEach(() => {
            cy.get('[data-testid="tab-Users"]').click();
        });

        it('should create a new user successfully', () => {
            // Generate unique email for this test run
            userEmail = `test${Date.now()}@example.com`;

            const newUser = {
                firstName: 'Test',
                lastName: 'User',
                email: userEmail,
                role: 'CUSTOMER',
                phone: '1234567890',
            };

            cy.intercept('POST', '/api/admin/users').as('createUser');
            cy.get('[data-testid="add-user-button"]').click();

            // Fill out the form
            cy.get('[data-testid="first-name"]').type(newUser.firstName);
            cy.get('[data-testid="last-name"]').type(newUser.lastName);
            cy.get('[data-testid="email"]').type(newUser.email);
            cy.get('[data-testid="phone-number"]').type(newUser.phone);
            cy.get('[data-testid="role"]').select(newUser.role);
            cy.get('[data-testid="create-user-button"]').click();

            // Wait for creation and verify success
            cy.wait('@createUser').its('response.statusCode').should('eq', 200);
            cy.contains('User created successfully').should('be.visible');
            cy.contains(userEmail).should('be.visible');
        });

        it('should delete the newly created user after confirmation', () => {
            // Ensure the userEmail exists from the previous test
            expect(userEmail).to.exist;
            cy.intercept('DELETE', '/api/admin/users/*').as('deleteUser');

            // First find the card containing our user's email
            cy.get('[data-testid="user-card"]')
                .filter(`:contains("${userEmail}")`)
                .first()
                .should('exist')
                .within(() => {
                    cy.get('[data-testid="delete-user-button"]')
                        .should('be.visible')
                        .click();
                });

            // Handle confirmation dialog
            cy.get('[data-testid="confirm-dialog"]').should('be.visible');
            cy.get('[data-testid="confirm-dialog-confirm-button"]').click();

            // Verify deletion was successful
            cy.wait('@deleteUser').its('response.statusCode').should('eq', 200);
            cy.contains('User deleted successfully').should('be.visible');
            cy.contains(userEmail).should('not.exist');
        });
    });

    describe('Restaurant Management', () => {
        let restaurantEmail; // Declare restaurantEmail variable here

        beforeEach(() => {
            cy.get('[data-testid="tab-Restaurants"]').click();
        });

        it('should create a new restaurant successfully', () => {
            // Assign a unique email for the restaurant
            restaurantEmail = `restaurant${Date.now()}@example.com`;

            const newRestaurant = {
                name: 'Test Restaurant',
                email: restaurantEmail,
                address: '123 Test Address',
                phone: '1234567890',
            };

            cy.intercept('POST', '/api/companies').as('createRestaurant');
            cy.get('[data-testid="add-restaurant-button"]').click();

            // Fill out the restaurant form
            cy.get('[data-testid="add-restaurant-form"]').within(() => {
                cy.get('[data-testid="restaurant-name"]').type(newRestaurant.name);
                cy.get('[data-testid="restaurant-email"]').type(newRestaurant.email);
                cy.get('[data-testid="restaurant-address"]').type(newRestaurant.address);
                cy.get('[data-testid="restaurant-phone"]').type(newRestaurant.phone);
            });

            cy.get('[data-testid="create-restaurant-button"]').click();

            // Wait for creation and verify success
            cy.wait('@createRestaurant').its('response.statusCode').should('eq', 201);
            cy.contains('Restaurant created successfully').should('be.visible');
            cy.contains(newRestaurant.name).should('be.visible');
        });

        it('should delete the newly created restaurant after confirmation', () => {
            // Ensure the restaurantEmail exists from the previous test
            expect(restaurantEmail).to.exist;

            cy.intercept('DELETE', '/api/companies/*').as('deleteRestaurant');

            // Find the card containing the restaurant's email and delete it
            cy.get('[data-testid="restaurant-card"]')
                .filter(`:contains("${restaurantEmail}")`)
                .first()
                .should('exist')
                .within(() => {
                    cy.get('[data-testid="delete-restaurant-button"]')
                        .should('be.visible')
                        .click();
                });

            // Confirm deletion in the dialog
            cy.get('[data-testid="confirm-dialog"]').should('be.visible');
            cy.get('[data-testid="confirm-dialog-confirm-button"]').click();

            // Verify deletion was successful
            cy.wait('@deleteRestaurant').its('response.statusCode').should('eq', 200);
            cy.contains('Restaurant deleted successfully').should('be.visible');
            cy.contains(restaurantEmail).should('not.exist');
        });
    });

});