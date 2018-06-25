const clone = require('lodash.clone');

module.exports = function (workspace, configuration) {
  const excludePattern = configuration.get('excludePattern');

  const searchFile = (searchPatterns, filter) => {
    let patterns = clone(searchPatterns);
    let pattern = patterns.shift();
    return workspace.findFiles(pattern, excludePattern)
      .then(uris => {
        let file = uris.map(uri => uri.fsPath).find(filter);
        if (!file && patterns.length > 0) {
          return searchFile(patterns, filter);
        }
        return file;
      });
  };

  this.findFile = searchFile;
};
