import React from 'react';
import { mount } from '@cypress/react';
import { BrowserRouter } from 'react-router-dom';
import RestaurantCard from "@/components/RestaurantCard/RestaurantCard.jsx";
import {AuthProvider} from "@/context/AuthContext.jsx";

describe('RestaurantCard Component', () => {
    const restaurant = {
        id: '1',
        name: 'Test Restaurant',
        pictureUrl: '/test-restaurant.jpg',
        rating: 4.5,
        address: '123 Test Address',
    };

    beforeEach(() => {
        mount(
            <AuthProvider>
                <BrowserRouter>
                    <RestaurantCard
                        restaurant={restaurant}
                        onLike={cy.stub().as('onLike')}
                    />
                </BrowserRouter>
            </AuthProvider>
        );
    });

    it('should display restaurant details correctly', () => {
        cy.get('.restaurant-name').should('contain', restaurant.name);
        cy.get('.address').should('contain', restaurant.address);
        cy.get('.card-image').should('have.attr', 'src', restaurant.pictureUrl);
        cy.get('.rating').should('contain', `★ ${restaurant.rating.toFixed(1)}`);
    });

    it('should handle liking the restaurant', () => {
        cy.get('.like-button').click();
        cy.get('@onLike').should('have.been.calledWith', restaurant.id, true);

        cy.get('.like-button').click();
        cy.get('@onLike').should('have.been.calledWith', restaurant.id, false);
    });

    it('should display restaurant image with fallback', () => {
        mount(
            <AuthProvider>
                <BrowserRouter>
                    <RestaurantCard
                        restaurant={{ ...restaurant, pictureUrl: null }}
                        onLike={cy.stub()}
                    />
                </BrowserRouter>
            </AuthProvider>
        );

        cy.get('.card-image').should('have.attr', 'src', '/default-restaurant.jpg');
    });

    it('should display rating if available', () => {
        mount(
            <AuthProvider>
                <BrowserRouter>
                    <RestaurantCard
                        restaurant={{ ...restaurant, rating: 3.7 }}
                        onLike={cy.stub()}
                    />
                </BrowserRouter>
            </AuthProvider>
        );

        cy.get('.rating').should('contain', '★ 3.7');
    });

    it('should not display rating if not available', () => {
        mount(
            <AuthProvider>
                <BrowserRouter>
                    <RestaurantCard
                        restaurant={{ ...restaurant, rating: 0 }}
                        onLike={cy.stub()}
                    />
                </BrowserRouter>
            </AuthProvider>
        );

        cy.get('.rating').should('not.exist');
    });
});