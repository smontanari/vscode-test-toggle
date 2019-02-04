/* global jasmine, spyOn, describe, it, beforeEach, expect */
const FileToggle = require('../lib/file_toggle');
const Workspace = require('../lib/workspace_decorator');

describe('FileToggle', () => {
  var subject, mockDocument, mockWorkspace;

  beforeEach(() => {
    mockDocument = {
      pathCheck: {
        source: 'sourcePathCheck',
        test: 'testPathCheck'
      }
    };

    mockWorkspace = jasmine.createSpyObj('workspace', ['openTextDocument']);
  });

  describe('successful toggle', () => {
    beforeEach(() => {
      mockWorkspace = {
        searchFilePatterns: jasmine.createSpy('searchFilePatterns').and.returnValue('search-patterns'),
        findFile: jasmine.createSpy('findFile').and.returnValue(Promise.resolve('target-file'))
      };

      spyOn(Workspace, 'for').and.returnValue(mockWorkspace);
      subject = new FileToggle(mockWorkspace);
    });

    describe('when given a source code document', () => {
      beforeEach(() => {
        mockDocument.isTestCode = false;
      });

      it('returns the test filename corresponding to the source document', done => {
        subject.fromDocument(mockDocument).then((filename) => {
          expect(filename).toEqual('target-file');
          expect(mockWorkspace.searchFilePatterns).toHaveBeenCalledWith(mockDocument, 'source', 'test');
          expect(mockWorkspace.findFile).toHaveBeenCalledWith('search-patterns', 'testPathCheck');
          done();
        });
      });
    });

    describe('when given a test code document', () => {
      beforeEach(() => {
        mockDocument.isTestCode = true;
      });

      it('returns the source filename corresponding to the test document', done => {
        subject.fromDocument(mockDocument).then((filename) => {
          expect(filename).toEqual('target-file');
          expect(mockWorkspace.searchFilePatterns).toHaveBeenCalledWith(mockDocument, 'test', 'source');
          expect(mockWorkspace.findFile).toHaveBeenCalledWith('search-patterns', 'sourcePathCheck');
          done();
        });
      });
    });
  });

  describe('failed toggle', () => {
    beforeEach(() => {
      mockWorkspace = {
        searchFilePatterns: jasmine.createSpy('searchFilePatterns').and.returnValue('search-patterns'),
        findFile: jasmine.createSpy('findFile').and.returnValue(Promise.resolve())
      };

      spyOn(Workspace, 'for').and.returnValue(mockWorkspace);
      subject = new FileToggle(mockWorkspace);
    });

    describe('when given a source code document', () => {
      it('rejects the promise', done => {
        mockDocument.isTestCode = false;
        subject.fromDocument(mockDocument).then(() => {}, error => {
          expect(error.message).toEqual('Unable to find test file');
          done();
        });
      });
    });

    describe('when given a test code document', () => {
      it('rejects the promise', done => {
        mockDocument.isTestCode = true;
        subject.fromDocument(mockDocument).then(() => { }, error => {
          expect(error.message).toEqual('Unable to find source file');
          done();
        });
      });
    });
  });
});
