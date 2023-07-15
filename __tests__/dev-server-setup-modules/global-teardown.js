/* Export function globalTeardown() */
/* Shuts down testing server instances created by global-setup module function globalSetup() */

const { teardown: teardownDevServer } = require("jest-dev-server");

module.exports = async function globalTeardown() {
  await teardownDevServer(globalThis.servers);
}

