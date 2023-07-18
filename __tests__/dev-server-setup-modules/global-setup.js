/* Export async function that creates an instance of nextjs dev server on port 3000 is it is not in use */

const { setup: setupDevServer } = require("jest-dev-server");

module.exports = async function globalSetup() {
  globalThis.servers = await setupDevServer({
    command: `npm run dev`,
    port: 3000,
    usedPortAction: "ignore",
  });
};