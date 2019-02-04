/* global jasmine */
const pkgInfo = require('../../package.json');

const properties = pkgInfo.contributes.configuration.properties;

jasmine.extensionProperties = {
  testNameRegExp: properties['testToggle.testNameRegExp'].default,
  typeMappings: properties['testToggle.typeMappings'].default
};
