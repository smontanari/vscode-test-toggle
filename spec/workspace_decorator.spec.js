/* global jasmine, describe, it, beforeEach, expect */

const Workspace = require('../lib/workspace_decorator');

describe('WorkspaceDecorator', () => {
  let mockWorkspace, mockConfiguration, mockConfiguration2;

  beforeEach(() => {
    mockWorkspace = jasmine.createSpyObj('workspace', ['getConfiguration']);
    mockConfiguration = jasmine.createSpyObj('configuration', ['get']);
    mockConfiguration2 = jasmine.createSpyObj('configuration2', ['get']);
  });

  describe('returning the configuration', () => {
    it('throws an error if the testNameRegExp is missing', () => {
      mockWorkspace.getConfiguration.and.returnValue(mockConfiguration);
      mockConfiguration.get.and.returnValue();

      expect(() => Workspace.for(mockWorkspace, 'test-ext').configuration()).toThrowError();
      expect(mockConfiguration.get).toHaveBeenCalledWith('testNameRegExp');
    });

    it('reads the configuration every time', () => {
      mockWorkspace.getConfiguration.and.returnValues(mockConfiguration, mockConfiguration2);
      mockConfiguration.get.and.returnValue('config-value');
      mockConfiguration2.get.and.returnValue('config-value2');

      let workspace = Workspace.for(mockWorkspace, 'test-ext');
      expect(workspace.configuration().get('foo')).toEqual('config-value');
      expect(workspace.configuration().get('foo')).toEqual('config-value2');
    });
  });
});
