import React from 'react';
import { mount } from '@cypress/react';
import ConfirmDialog from '@/components/ConfirmDialog';

describe('ConfirmDialog Component', () => {
    const defaultProps = {
        isOpen: true,
        message: 'Are you sure you want to delete this item?',
        onConfirm: cy.stub(),
        onCancel: cy.stub(),
        title: 'Confirm Action'
    };

    const mountDialog = (props = {}) => {
        mount(
            <ConfirmDialog
                {...defaultProps}
                {...props}
            />
        );
    };

    beforeEach(() => {
        defaultProps.onConfirm.reset();
        defaultProps.onCancel.reset();
    });

    it('should render when isOpen is true', () => {
        mountDialog();
        cy.get('[data-testid="confirm-dialog-overlay"]').should('be.visible');
        cy.get('[data-testid="confirm-dialog"]').should('be.visible');
    });

    it('should not render when isOpen is false', () => {
        mountDialog({ isOpen: false });
        cy.get('[data-testid="confirm-dialog-overlay"]').should('not.exist');
    });

    it('should display the provided title and message', () => {
        const title = 'Custom Title';
        const message = 'Custom message for testing';
        mountDialog({ title, message });

        cy.get('[data-testid="confirm-dialog-title"]').should('contain', title);
        cy.get('[data-testid="confirm-dialog-message"]').should('contain', message);
    });

    it('should call onConfirm when confirm button is clicked', () => {
        mountDialog();
        cy.get('[data-testid="confirm-dialog-confirm-button"]').click();
        cy.wrap(defaultProps.onConfirm).should('have.been.calledOnce');
    });

    it('should call onCancel when cancel button is clicked', () => {
        mountDialog();
        cy.get('[data-testid="confirm-dialog-cancel-button"]').click();
        cy.wrap(defaultProps.onCancel).should('have.been.calledOnce');
    });

    it('should handle custom button text', () => {
        mountDialog({
            confirmText: 'Yes, Delete',
            cancelText: 'No, Keep'
        });

        cy.get('[data-testid="confirm-dialog-confirm-button"]')
            .should('contain', 'Yes, Delete');
        cy.get('[data-testid="confirm-dialog-cancel-button"]')
            .should('contain', 'No, Keep');
    });

    it('should be accessible', () => {
        mountDialog();

        // Check for proper ARIA attributes
        cy.get('[data-testid="confirm-dialog"]')
            .should('have.attr', 'role', 'dialog')
            .and('have.attr', 'aria-modal', 'true');

        // Ensure buttons are keyboard accessible
        cy.get('[data-testid="confirm-dialog-confirm-button"]')
            .focus()
            .should('have.focus')
            .type('{enter}');

        cy.wrap(defaultProps.onConfirm).should('have.been.calledOnce');
    });

    it('should apply warning styles for destructive actions', () => {
        mountDialog({ isDestructive: true });

        cy.get('[data-testid="confirm-dialog-confirm-button"]')
            .should('have.class', 'confirm-button')
            .and('have.css', 'background-color', 'rgb(245, 101, 101)'); // Assuming your CSS color
    });

    it('should handle keyboard interactions', () => {
        mountDialog();

        // Test Escape key
        cy.get('body').type('{esc}');
        cy.wrap(defaultProps.onCancel).should('have.been.calledOnce');

        // Test Tab key navigation
        cy.get('[data-testid="confirm-dialog-cancel-button"]').focus();
        cy.realPress('Tab');
        cy.get('[data-testid="confirm-dialog-confirm-button"]').should('have.focus');
    });
});