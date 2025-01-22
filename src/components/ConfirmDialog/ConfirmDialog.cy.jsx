// src/components/ConfirmDialog.cy.jsx
import React from 'react';
import ConfirmDialog from './ConfirmDialog';


describe('ConfirmDialog', () => {
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            isOpen: true,
            title: 'Delete Item',
            message: 'Are you sure you want to delete this item?',
            onConfirm: cy.stub().as('onConfirm'), // Create stubs inside the test setup
            onCancel: cy.stub().as('onCancel'),
        };
    });

    it('renders dialog with correct content', () => {
        cy.mount(<ConfirmDialog {...defaultProps} />);

        cy.get('[data-testid="confirm-dialog"]').should('be.visible');
        cy.get('[data-testid="confirm-dialog-title"]').should('have.text', defaultProps.title);
        cy.get('[data-testid="confirm-dialog-message"]').should('have.text', defaultProps.message);
    });

    it('does not render when isOpen is false', () => {
        cy.mount(<ConfirmDialog {...defaultProps} isOpen={false} />);
        cy.get('[data-testid="confirm-dialog"]').should('not.exist');
    });

    it('calls onConfirm when confirm button is clicked', () => {
        cy.mount(<ConfirmDialog {...defaultProps} />);
        cy.get('[data-testid="confirm-dialog-confirm-button"]').click();
        cy.get('@onConfirm').should('have.been.calledOnce');
    });

    it('calls onCancel when cancel button is clicked', () => {
        cy.mount(<ConfirmDialog {...defaultProps} />);
        cy.get('[data-testid="confirm-dialog-cancel-button"]').click();
        cy.get('@onCancel').should('have.been.calledOnce');
    });

    it('applies warning styles for delete confirmation', () => {
        cy.mount(
            <ConfirmDialog
                {...defaultProps}
                title="Delete Confirmation"
            />
        );
        cy.get('[data-testid="confirm-dialog-confirm-button"]')
            .should('have.class', 'confirm-button');
    });


});
