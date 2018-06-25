const PatternGenerator = require('./pattern_generator');
const WorkspaceExplorer = require('./workspace_explorer');

module.exports = {
  for: (workspace, extensionName) => {
    const configuration = workspace.getConfiguration(extensionName);
    const patternGenerator = new PatternGenerator(workspace, configuration);
    const explorer = new WorkspaceExplorer(workspace, configuration);
    return {
      readConfiguration: configuration.get.bind(configuration),
      searchFilePatterns: patternGenerator.listPatterns.bind(patternGenerator),
      findFile: explorer.findFile.bind(explorer)
    };
  }
}
