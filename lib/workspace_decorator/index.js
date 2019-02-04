const PatternGenerator = require('./pattern_generator');
const WorkspaceExplorer = require('./workspace_explorer');

const validateConfiguration = (config) => {
  const testNameRegExp = config.get('testNameRegExp');
  if (!testNameRegExp || testNameRegExp.length === 0) {
    throw new Error('Invalid "testToggle.testNameRegExp" configuration');
  }
};

module.exports = {
  for: (workspace, extensionName) => {
    const configuration = () => {
      const config = workspace.getConfiguration(extensionName);
      validateConfiguration(config);
      return config;
    };

    return {
      configuration,
      searchFilePatterns: function() {
        const pg = new PatternGenerator(workspace, configuration().get('paths'));
        return pg.listPatterns.apply(pg, arguments);
      },
      findFile: function() {
        const explorer = new WorkspaceExplorer(workspace, configuration().get('excludePattern'));
        return explorer.findFile.apply(explorer, arguments);
      }
    };
  }
};
