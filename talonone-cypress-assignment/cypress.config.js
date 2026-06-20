const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "https://www.demoblaze.com",

    specPattern: "cypress/e2e/**/*.cy.js",

    viewportWidth: 1280,
    viewportHeight: 720,

    video: false,

    screenshotOnRunFailure: true,

    setupNodeEvents(on, config) {
      return config;
    },
  },
});