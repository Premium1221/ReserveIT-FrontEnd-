import { defineConfig } from "cypress";
import { defineConfig as defineViteConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5200",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1000,
    viewportHeight: 660,
    defaultCommandTimeout: 10000,
    retries: {
      runMode: 2,
      openMode: 1,
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
      viteConfig: {
        plugins: [react()],
        resolve: {
          alias: {
            '@': '/src'
          }
        }
      }
    },
    specPattern: ['src/**/*.cy.{js,jsx,ts,tsx}'],
    supportFile: 'cypress/support/component.jsx'
  },
});