/* Export async function globalSetup() */
/* Creates an instance of nextjs dev server on port 3000 if it is not in use */

const { setup: setupDevServer } = require("jest-dev-server");

module.exports = async function globalSetup() {
  globalThis.servers = await setupDevServer({
    command: `npm run dev`,
    port: 3000,
    usedPortAction: "ignore",
  });
};