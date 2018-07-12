const PatternGenerator = require('./pattern_generator');
const WorkspaceExplorer = require('./workspace_explorer');

module.exports = {
  for: (workspace, extensionName) => {
    const configuration = () => workspace.getConfiguration(extensionName);
    return {
      readConfiguration: function() {
        const c = configuration();
        return c.get.apply(c, arguments);
      },
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
}
