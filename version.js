import { version } from './package.json';

// function printVersion() {
//   console.log(`Current app version: v${version}`);
//   process.exit(0);  // Exit the application
// }

// printVersion();

function getAppVersion() {
  return version; // Return the version from package.json
}

export default { getAppVersion };