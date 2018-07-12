const path = require('path');

module.exports = function(document, testNameRegExp) {
  const self = this;
  const extensionName = path.extname(document.fileName);
  const baseName = path.basename(document.fileName, extensionName);
  var testCodeRegExp = new RegExp(testNameRegExp);
  var testPathRegExp = testNameRegExp.includes('^') ? testCodeRegExp : new RegExp(`^${baseName}${testNameRegExp}`);

  this.uri = document.uri;
  this.fileName = document.fileName;
  this.fileNamePatterns = {
    source: `${baseName.replace(testCodeRegExp, '')}${extensionName}`,
    test: `${baseName}*${extensionName}`
  };
  this.pathCheck = {
    source: filepath => path.basename(filepath) === self.fileNamePatterns.source,
    test: filepath => testPathRegExp.test(path.basename(filepath, extensionName))
  };
  this.isTestCode = testCodeRegExp.test(baseName);
};
