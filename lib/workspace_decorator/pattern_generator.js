const fs = require('fs');
const path = require('path');

module.exports = function (workspace, configuration) {
  const projectPaths = configuration.get('paths');

  this.listPatterns = (codeDocument, toggleFrom, toggleTo) => {
    const workspacePath = workspace.getWorkspaceFolder(codeDocument.uri).uri.fsPath;
    const baseFolder = path.relative(workspacePath, path.dirname(codeDocument.fileName));

    let patterns = [
      path.join(baseFolder, '**', codeDocument.fileNamePatterns[toggleTo])
    ];
    projectPaths[toggleTo].forEach(folderTo => {
      let candidateFolders = new Set(projectPaths[toggleFrom]
        .filter(folderFrom => baseFolder.startsWith(folderFrom))
        .reduce((folders, folderFrom) => {
          folders.push(path.join(folderTo, path.relative(folderFrom, baseFolder)));
          folders.push(path.relative(folderFrom, baseFolder));
          return folders;
        }, []));
      candidateFolders.add(path.join(folderTo, baseFolder));
      candidateFolders
        .forEach(folder => {
          if (fs.existsSync(path.join(workspacePath, folder))) {
            patterns.push(path.join(folder, codeDocument.fileNamePatterns[toggleTo]))
          }
        })
      patterns.push(path.join(folderTo, '**', codeDocument.fileNamePatterns[toggleTo]));
    });
    patterns.push(path.join('**', codeDocument.fileNamePatterns[toggleTo]));

    return patterns;
  };
};
