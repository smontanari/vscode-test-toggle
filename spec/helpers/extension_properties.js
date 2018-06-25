/* global jasmine */
const pkgInfo = require('../../package.json');

const properties = pkgInfo.contributes.configuration.properties;

jasmine.extensionProperties = {
  testNameRegExp: new RegExp(properties['testToggle.testNameRegExp'].default)
};
