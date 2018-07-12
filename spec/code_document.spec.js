/* global jasmine, describe, it, beforeEach, expect */
const CodeDocument = require('../lib/code_document');

describe('CodeDocument', () => {
  let sourceFileDocument, testFileDocument, subject;

  beforeEach(() => {
    sourceFileDocument = { fileName: '/src/path/filename.prg', uri: 'test/path/uri' };
    testFileDocument = { fileName: '/test/path/filename_spec.prg', uri: 'test/path/uri' };
  });

  describe('for a source file document', () => {
    beforeEach(() => {
      subject = new CodeDocument(sourceFileDocument, jasmine.extensionProperties.testNameRegExp);
    });

    it('has the original document uri', () => {
      expect(subject.uri).toEqual('test/path/uri');
    });

    it('has the original document filename', () => {
      expect(subject.fileName).toEqual('/src/path/filename.prg');
    });

    it('has source and test filename patterns', () => {
      expect(subject.fileNamePatterns.source).toEqual('filename.prg');
      expect(subject.fileNamePatterns.test).toEqual('filename*.prg');
    });

    it('is not test code', () => {
      expect(subject.isTestCode).toBe(false);
    });

    it('verifies the test check path for multiple filenames', () => {
      expect(subject.pathCheck.test('/some/path/filename_spec.prg')).toBe(true);
      expect(subject.pathCheck.test('/some/path/filename.spec.prg')).toBe(true);
      expect(subject.pathCheck.test('/some/path/filename-spec.prg')).toBe(true);
      expect(subject.pathCheck.test('/some/path/filename_test.prg')).toBe(true);
      expect(subject.pathCheck.test('/some/path/another_filename_spec.prg')).toBe(false);
      expect(subject.pathCheck.test('/some/path/filename_different_spec.prg')).toBe(false);
      expect(subject.pathCheck.test('/some/path/filename.prg')).toBe(false);
      expect(subject.pathCheck.test('/some/path/filenameSpec.prg')).toBe(false);
      expect(subject.pathCheck.test('/some/path/filenameTest.prg')).toBe(false);
      expect(subject.pathCheck.test('/some/path/test_filename.prg')).toBe(false);
    });
  });

  describe('for a test file document', () => {
    beforeEach(() => {
      subject = new CodeDocument(testFileDocument, jasmine.extensionProperties.testNameRegExp);
    });

    it('has the original document uri', () => {
      expect(subject.uri).toEqual('test/path/uri');
    });

    it('has the original document filename', () => {
      expect(subject.fileName).toEqual('/test/path/filename_spec.prg');
    });

    it('has source and test filename patterns', () => {
      expect(subject.fileNamePatterns.source).toEqual('filename.prg');
      expect(subject.fileNamePatterns.test).toEqual('filename_spec*.prg');
    });

    it('is test code', () => {
      expect(subject.isTestCode).toBe(true);
    });

    it('verifies multiple source check paths', () => {
      expect(subject.pathCheck.source('/some/path/filename.prg')).toBe(true);
      expect(subject.pathCheck.source('/some/other/path/filename.prg')).toBe(true);
      expect(subject.pathCheck.source('/some/path/filename_different.prg')).toBe(false);
      expect(subject.pathCheck.source('/some/path/another_filename.prg')).toBe(false);
    });
  });
});
