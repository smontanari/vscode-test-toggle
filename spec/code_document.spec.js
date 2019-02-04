/* global jasmine, describe, it, beforeEach, expect */
const CodeDocument = require('../lib/code_document');

describe('CodeDocument', () => {
  let sourceFileDocument, testFileDocument, mockFileExtensions, mockConfiguration, subject;

  beforeEach(() => {
    sourceFileDocument = { fileName: '/src/path/filename.prg', uri: 'test/path/uri' };
    testFileDocument = { fileName: '/test/path/filename_spec.prg', uri: 'test/path/uri' };
    mockConfiguration = {
      get: jasmine.createSpy().and.callFake(name => (
        jasmine.extensionProperties[name]
      ))
    };
    mockFileExtensions = {
      typesFor: jasmine.createSpy().and.returnValue(['type1', 'type2'])
    };
  });

  describe('for a source file document', () => {
    beforeEach(() => {
      subject = new CodeDocument(sourceFileDocument, mockFileExtensions, mockConfiguration);
    });

    it('has the original document uri', () => {
      expect(subject.uri).toEqual('test/path/uri');
    });

    it('has the original document filename', () => {
      expect(subject.fileName).toEqual('/src/path/filename.prg');
    });

    it('is not test code', () => {
      expect(subject.isTestCode).toBe(false);
    });

    it('has source and test filename patterns', () => {
      expect(subject.fileNamePatterns.source).toEqual('filename.{type1,type2}');
      expect(subject.fileNamePatterns.test).toEqual('filename*.{type1,type2}');
    });

    it('verifies the test check path for filenames with same basename', () => {
      ['_', '.', '-'].forEach(separator => {
        ['spec', 'test'].forEach(pattern => {
          expect(subject.pathCheck.test(`/some/path/filename${separator}${pattern}.type1`)).toBe(true);
          expect(subject.pathCheck.test(`/some/path/filename${separator}${pattern}.type2`)).toBe(true);
        })
      });
    });

    it('fails the test check path for filenames with different basenames', () => {
      expect(subject.pathCheck.test('/some/path/another_filename_spec.type1')).toBe(false);
      expect(subject.pathCheck.test('/some/path/filename_different_spec.type1')).toBe(false);
      expect(subject.pathCheck.test('/some/path/filename.type1')).toBe(false);
      expect(subject.pathCheck.test('/some/path/filenameSpec.type1')).toBe(false);
      expect(subject.pathCheck.test('/some/path/filenameTest.type1')).toBe(false);
      expect(subject.pathCheck.test('/some/path/test_filename.type1')).toBe(false);
    });

    it('fails the test check path for filenames with different type', () => {
      ['_', '.', '-'].forEach(separator => {
        ['spec', 'test'].forEach(pattern =>
          expect(subject.pathCheck.test(`/some/path/filename${separator}${pattern}.type3`)).toBe(false)
        )
      });
    });
  });

  describe('for a test file document', () => {
    beforeEach(() => {
      subject = new CodeDocument(testFileDocument, mockFileExtensions, mockConfiguration);
    });

    it('has the original document uri', () => {
      expect(subject.uri).toEqual('test/path/uri');
    });

    it('has the original document filename', () => {
      expect(subject.fileName).toEqual('/test/path/filename_spec.prg');
    });

    it('is test code', () => {
      expect(subject.isTestCode).toBe(true);
    });

    it('has source and test filename patterns', () => {
      expect(subject.fileNamePatterns.source).toEqual('filename.{type1,type2}');
      expect(subject.fileNamePatterns.test).toEqual('filename_spec*.{type1,type2}');
    });

    it('verifies multiple source check paths', () => {
      ['type1', 'type2'].forEach(type => {
        expect(subject.pathCheck.source(`/some/path/filename.${type}`)).toBe(true);
        expect(subject.pathCheck.source(`/some/other/path/filename.${type}`)).toBe(true);
      });
    });

    it('fails the source check path for filenames with different basenames', () => {
      expect(subject.pathCheck.source('/some/path/filename_different.type1')).toBe(false);
      expect(subject.pathCheck.source('/some/path/another_filename.type1')).toBe(false);
    });

    it('fails the test check path for filenames with different type', () => {
      expect(subject.pathCheck.source(`/some/path/filename.type3`)).toBe(false)
      expect(subject.pathCheck.source('/some/other/path/filename.type3')).toBe(false);
    });
  });
});
