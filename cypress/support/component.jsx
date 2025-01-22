// cypress/support/component.jsx
import './commands'
import { mount } from 'cypress/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../src/context/AuthContext'
import React from 'react'


import '../../src/index.css'

Cypress.Commands.add('mount', (component, options = {}) => {
    const { routerProps = {}, ...mountOptions } = options

    const wrapped = (
        <AuthProvider>
            <BrowserRouter {...routerProps}>
                {component}
            </BrowserRouter>
        </AuthProvider>
    )

    return mount(wrapped, mountOptions)
})