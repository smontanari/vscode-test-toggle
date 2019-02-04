const path = require('path');
const some = require('lodash.some');

module.exports = function(document, fileExtensions, configuration) {
  const extensionName = path.extname(document.fileName);
  const baseName = path.basename(document.fileName, extensionName);
  const testNameRegExp = configuration.get('testNameRegExp');

  const testCodeRegExp = new RegExp(testNameRegExp);
  const testPathRegExp = testNameRegExp.includes('^') ? testCodeRegExp : new RegExp(`^${baseName}${testNameRegExp}`);
  const sourceBaseName = baseName.replace(testCodeRegExp, '');
  const fileTypes = fileExtensions.typesFor(extensionName.slice(1));

  this.uri = document.uri;
  this.fileName = document.fileName;
  this.fileNamePatterns = {
    source: `${sourceBaseName}.{${fileTypes.join(',')}}`,
    test: `${baseName}*.{${fileTypes.join(',')}}`
  };
  this.pathCheck = {
    source: filepath => some(fileTypes, type =>
      path.basename(filepath) === `${sourceBaseName}.${type}`
    ),
    test: filepath => some(fileTypes, type =>
      testPathRegExp.test(path.basename(filepath, `.${type}`))
    )
  };
  this.isTestCode = testCodeRegExp.test(baseName);
};
