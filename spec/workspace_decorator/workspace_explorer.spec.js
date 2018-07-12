/* global jasmine, describe, it, beforeEach, expect */
const WorkspaceExplorer = require('../../lib/workspace_decorator/workspace_explorer');

describe('WorkspaceExplorer', () => {
  var subject, mockWorkspace;

  beforeEach(() => {
    mockWorkspace = {
      findFiles: jasmine.createSpy().and.returnValues(
        Promise.resolve([
          { fsPath: 'path/to/file1' },
          { fsPath: 'path/to/file2' }
        ]),
        Promise.resolve([
          { fsPath: 'path/to/fileA' },
          { fsPath: 'path/to/fileB' }
        ])
      )
    };

    subject = new WorkspaceExplorer(mockWorkspace, 'exclude-pattern');
  });

  it('returns the first found file', (done) => {
    subject.findFile(
      ['search-pattern1', 'search-pattern2', 'search-pattern3'],
      path => path.match(/fileA/)
    ).then(filepath => {
        expect(filepath).toEqual('path/to/fileA');

        expect(mockWorkspace.findFiles).toHaveBeenCalledWith('search-pattern1', 'exclude-pattern');
        expect(mockWorkspace.findFiles).toHaveBeenCalledWith('search-pattern2', 'exclude-pattern');
        expect(mockWorkspace.findFiles).not.toHaveBeenCalledWith('search-pattern3', 'exclude-pattern');
        done();
      });
  });

  it('returns nothing when no files are found', (done) => {
    subject.findFile(
      ['search-pattern1', 'search-pattern2'],
      path => path.match(/fileC/)
    ).then(file => {
      expect(file).toBeUndefined();
      expect(mockWorkspace.findFiles).toHaveBeenCalledWith('search-pattern1', 'exclude-pattern');
      expect(mockWorkspace.findFiles).toHaveBeenCalledWith('search-pattern2', 'exclude-pattern');
      done();
    });
  });
});
