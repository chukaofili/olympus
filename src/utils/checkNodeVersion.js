// Libraries
const semver = require('semver');


/**
* Check we are using the right version of node.
* The mimimum version of node should be defined in package.json with a range
* comparator (for example >=8.6.0).
*
* @function
*/
const checkNodeVersion = (Package) => {
  if (Package.engines) {
    const range = Package.engines.node;
    const version = process.versions.node;
    const message = (
      `Node version ${version} is not supported, please use Node ${range}.`
    );

    if (!semver.satisfies(version, range)) {
      console.log(message)
      process.exit(1);
    }
  }
};

module.exports = checkNodeVersion;
