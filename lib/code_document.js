const path = require('path');

module.exports = function (document, testNameRegExp) {
  const self = this;
  const extensionName = path.extname(document.fileName);
  const baseName = path.basename(document.fileName, extensionName);


  this.uri = document.uri;
  this.fileName = document.fileName;
  this.fileNamePatterns = {
    source: `${baseName.replace(testNameRegExp, '')}${extensionName}`,
    test: `${baseName}*${extensionName}`
  };
  this.pathCheck = {
    source: filepath => path.basename(filepath) === self.fileNamePatterns.source,
    test: filepath => testNameRegExp.test(path.basename(filepath, extensionName))
  };
  this.isTestCode = testNameRegExp.test(baseName);
};
