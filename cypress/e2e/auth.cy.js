describe('Login Functionality', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  describe('UI Elements', () => {
    it('should render all login form elements', () => {
      cy.get('[data-testid="login-form"]').should('exist');
      cy.get('[data-testid="email-input"]').should('exist');
      cy.get('[data-testid="password-input"]').should('exist');
      cy.get('[data-testid="login-button"]').should('exist');
      cy.get('[data-testid="register-link"]').should('exist');
    });

    it('should have correct initial state', () => {
      cy.get('[data-testid="email-input"]').should('be.empty');
      cy.get('[data-testid="password-input"]').should('be.empty');
      cy.get('[data-testid="login-button"]').should('be.enabled');
      cy.get('[data-testid="login-error"]').should('not.exist');
    });
  });

  describe('Form Validation', () => {
    it('should validate email format', () => {
      cy.get('[data-testid="email-input"]').type('invalid-email');
      cy.get('[data-testid="login-button"]').click();
      cy.get('[data-testid="email-input"]:invalid').should('exist');
    });

    it('should validate password minimum length', () => {
      cy.get('[data-testid="email-input"]').type(Cypress.env('ADMIN_EMAIL'));
      cy.get('[data-testid="password-input"]').type('123'); // Invalid password
      cy.get('[data-testid="login-button"]').click(); // Submit form

      // Check for custom error message
      cy.get('[data-testid="login-error"]').should('contain', 'Password must be at least 6 characters');
    });

    it('should trim whitespace from email', () => {
      // Set up interception before the login button click
      cy.intercept('POST', '/api/auth/login').as('loginRequest');

      cy.get('[data-testid="email-input"]').type('  test@example.com  '); // Input with whitespace
      cy.get('[data-testid="password-input"]').type('password123'); // Input password
      cy.get('[data-testid="login-button"]').click(); // Trigger login request

      // Wait for the intercepted request
      cy.wait('@loginRequest').then((interception) => {
        // Verify the email in the request body is trimmed
        expect(interception.request.body.email).to.equal('test@example.com');
      });
    });
  });

  describe('Authentication Flows', () => {
    it('should successfully log in with valid credentials', () => {
      cy.get('[data-testid="email-input"]').type(Cypress.env('MANAGER_EMAIL'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('MANAGER_PASSWORD'));
      cy.get('[data-testid="login-button"]').click();
      cy.url().should('include', '/restaurant-dashboard');
      cy.contains('Welcome back').should('be.visible');
    });

    it('should show an error message for invalid credentials', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        body: { message: 'Invalid email or password' }
      }).as('loginRequest');

      cy.get('[data-testid="email-input"]').type('wrong@example.com');
      cy.get('[data-testid="password-input"]').type('wrongpassword');
      cy.get('[data-testid="login-button"]').click();

      cy.wait('@loginRequest');
      cy.get('[data-testid="login-error"]')
          .should('be.visible')
          .and('contain', 'Invalid email or password');
    });

    it('should show error for server error', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 500,
        body: { message: 'Internal server error' }
      }).as('loginRequest');

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      cy.wait('@loginRequest');
      cy.get('[data-testid="login-error"]').should('be.visible');
    });

    it('should handle network errors gracefully', () => {
      cy.intercept('POST', '/api/auth/login', {
        forceNetworkError: true
      }).as('loginRequest');

      cy.get('[data-testid="email-input"]').type('test@example.com');
      cy.get('[data-testid="password-input"]').type('password123');
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="login-error"]').should('be.visible');
    });
  });

  describe('Loading States', () => {
    it('should prevent login while loading', () => {
      cy.intercept('POST', '/api/auth/login', {
        delay: 2000,
        statusCode: 200,
        body: { accessToken: 'mockedToken' }
      }).as('loginRequest');

      cy.get('[data-testid="email-input"]').type(Cypress.env('MANAGER_EMAIL'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('MANAGER_PASSWORD'));
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="login-button"]')
          .should('be.disabled')
          .and('contain', 'Logging in...');

      cy.wait('@loginRequest');
    });

    it('should re-enable button after failed login', () => {
      cy.intercept('POST', '/api/auth/login', {
        statusCode: 401,
        delay: 1000,
        body: { message: 'Invalid credentials' }
      }).as('loginRequest');

      cy.get('[data-testid="email-input"]').type('wrong@example.com');
      cy.get('[data-testid="password-input"]').type('wrongpass');
      cy.get('[data-testid="login-button"]').click();

      cy.get('[data-testid="login-button"]').should('be.disabled');
      cy.wait('@loginRequest');
      cy.get('[data-testid="login-button"]')
          .should('be.enabled')
          .and('contain', 'Login');
    });
  });

  describe('Navigation', () => {
    it('should redirect to register page when clicking register link', () => {
      cy.get('[data-testid="register-link"]').click();
      cy.url().should('include', '/register');
    });

    it('should maintain return URL when redirecting to login', () => {
      cy.visit('/restaurant-dashboard');

      // Check that the user is redirected to /login
      cy.url().should('include', '/login');

      // Check that the returnUrl parameter is appended
      const expectedReturnUrl = encodeURIComponent('/restaurant-dashboard');
      cy.url().should('include', `returnUrl=${expectedReturnUrl}`);
    });
  });

  describe('Role-based Redirection', () => {
    it('should redirect admin to admin dashboard', () => {
      cy.get('[data-testid="email-input"]').type(Cypress.env('ADMIN_EMAIL'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('ADMIN_PASSWORD'));
      cy.get('[data-testid="login-button"]').click();
      cy.url().should('include', '/admin-dashboard');
    });

    it('should redirect staff to staff dashboard', () => {
      cy.get('[data-testid="email-input"]').type(Cypress.env('STAFF_EMAIL'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('STAFF_PASSWORD'));
      cy.get('[data-testid="login-button"]').click();
      cy.url().should('include', '/staff-dashboard');
    });

    it('should redirect customer to home page', () => {
      cy.get('[data-testid="email-input"]').type(Cypress.env('CUSTOMER_EMAIL'));
      cy.get('[data-testid="password-input"]').type(Cypress.env('CUSTOMER_PASSWORD'));
      cy.get('[data-testid="login-button"]').click();
      cy.url().should('eq', Cypress.config().baseUrl + '/');
    });
  });
});