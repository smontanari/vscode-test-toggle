module.exports = function (workspace) {
  this.fromDocument = (currentDocument) => {
    const [toggleFrom, toggleTo] = currentDocument.isTestCode ? ['test', 'source'] : ['source', 'test'];
    const patterns = workspace.searchFilePatterns(currentDocument, toggleFrom, toggleTo);
    return workspace.findFile(patterns, currentDocument.pathCheck[toggleTo])
      .then(file => {
        if (!file) throw new Error(`Unable to find ${toggleTo} file`);
        return file;
      });
    ;
  };
};
