import React from 'react';
import { mount } from '@cypress/react';
import QuickReservationDialog from './QuickReservationDialog';

describe('QuickReservationDialog Component', () => {
    let onCloseStub;
    let onSubmitStub;
    const selectedTable = {
        id: 'table-1',
        capacity: 4,
    };

    beforeEach(() => {
        // Initialize stubs inside the test context
        onCloseStub = cy.stub().as('onClose');
        onSubmitStub = cy.stub().as('onSubmit');

        // Mount the component
        mount(
            <QuickReservationDialog
                isOpen={true}
                onClose={onCloseStub}
                onSubmit={onSubmitStub}
                selectedTable={selectedTable}
            />
        );
    });

    it('renders correctly when open', () => {
        cy.get('[data-testid="quick-reservation-dialog"]').should('exist');
        cy.get('[data-testid="dialog-title"]').should('contain', 'Quick Reservation');
    });

    it('does not render when closed', () => {
        mount(
            <QuickReservationDialog
                isOpen={false}
                onClose={onCloseStub}
                onSubmit={onSubmitStub}
                selectedTable={selectedTable}
            />
        );
        cy.get('[data-testid="quick-reservation-dialog"]').should('not.exist');
    });

    it('displays the correct party size options', () => {
        cy.get('[data-testid="party-size-select"] option').should(
            'have.length',
            selectedTable.capacity
        );
        for (let i = 1; i <= selectedTable.capacity; i++) {
            cy.get(`[data-testid="party-size-option-${i}"]`).should('exist');
        }
    });

    it('allows changing the party size', () => {
        cy.get('[data-testid="party-size-select"]').select('3');
        cy.get('[data-testid="party-size-select"]').should('have.value', '3');
    });

    it('toggles reservation type between immediate and scheduled', () => {
        cy.get('[data-testid="immediate-seating-radio"]').should('be.checked');

        cy.get('[data-testid="scheduled-seating-radio"]').click();
        cy.get('[data-testid="scheduled-seating-radio"]').should('be.checked');

        cy.get('[data-testid="arrival-time-select"]').should('exist');
    });

    it('updates arrival time when scheduled seating is selected', () => {
        cy.get('[data-testid="scheduled-seating-radio"]').click();

        cy.get('[data-testid="arrival-time-select"]').select('30');
        cy.get('[data-testid="arrival-time-select"]').should('have.value', '30');
    });

    it('submits the form with correct data', () => {
        cy.get('[data-testid="scheduled-seating-radio"]').click();
        cy.get('[data-testid="arrival-time-select"]').select('45');
        cy.get('[data-testid="party-size-select"]').select('3');

        cy.get('[data-testid="reservation-form"]').submit();

        cy.get('@onSubmit').should('have.been.calledWith', {
            tableId: selectedTable.id,
            partySize: 3,
            immediate: false,
            arrivalMinutes: 45,
        });
    });

    it('closes the dialog when the cancel button is clicked', () => {
        cy.get('[data-testid="cancel-reservation"]').click();
        cy.get('@onClose').should('have.been.calledOnce');
    });

    it('closes the dialog when the close button is clicked', () => {
        cy.get('.button-cancel').click();
        cy.get('@onClose').should('have.been.calledOnce');
    });
});
