/* global jasmine, spyOn, describe, it, beforeEach, expect */
const fs = require('fs');
const first = require('lodash.first');
const last = require('lodash.last');
const CodeDocument = require('../../lib/code_document');
const PatternGenerator = require('../../lib/workspace_decorator/pattern_generator');

describe('PatternGenerator', () => {
  var mockWorkspace, mockDocument;
  beforeEach(() => {
    mockWorkspace = {
      getWorkspaceFolder: jasmine.createSpy().and.returnValue({
        uri: { fsPath: '/path/to/workspace' }
      })
    };
    mockDocument = {
      uri: 'test/path/uri',
      fileName: '/path/to/workspace/some/folder/code_document.prg',
    };
  });

  describe('when no project paths have been defined', () => {
    var patterns;
    beforeEach(() => {
      patterns = new PatternGenerator(mockWorkspace, { source: [], test: [] }).listPatterns(
        new CodeDocument(mockDocument, jasmine.extensionProperties.testNameRegExp),
        'source', 'test');
    });

    it('has a first pattern scanning the base folder of the code document', () => {
      expect(first(patterns)).toEqual('some/folder/**/code_document*.prg');
    });

    it('has a last pattern scanning every folder', () => {
      expect(last(patterns)).toEqual('**/code_document*.prg');
    });

    it('does not have any other pattern', () => {
      expect(patterns.slice(1, patterns.length - 1)).toEqual([]);
    });
  });

  describe('when test project paths have been defined', () => {
    var patterns;
    beforeEach(() => {
      spyOn(fs, 'existsSync').and.returnValues(true, false, true);
      patterns = new PatternGenerator(mockWorkspace, { source: [], test: ['unit_tests', 'integration_tests', 'e2e_tests'] }).listPatterns(
        new CodeDocument(mockDocument, jasmine.extensionProperties.testNameRegExp),
        'source', 'test');
    });

    it('has a first pattern scanning the base folder of the code document', () => {
      expect(first(patterns)).toEqual('some/folder/**/code_document*.prg');
    });

    it('has a last pattern scanning every folder', () => {
      expect(last(patterns)).toEqual('**/code_document*.prg');
    });

    it('has patterns scanning existing test folders', () => {
      expect(patterns.slice(1, patterns.length - 1)).toEqual([
        'unit_tests/some/folder/code_document*.prg',
        'unit_tests/**/code_document*.prg',
        'integration_tests/**/code_document*.prg',
        'e2e_tests/some/folder/code_document*.prg',
        'e2e_tests/**/code_document*.prg'
      ]);
    });
  });

  describe('when source and test project paths have been defined', () => {
    var patterns;
    beforeEach(() => {
      spyOn(fs, 'existsSync').and.returnValues(
        false, false, true,
        true, false, false,
        false, false, true);
      patterns = new PatternGenerator(mockWorkspace, {
        source: ['src', 'some'],
        test: ['unit_tests', 'integration_tests', 'e2e_tests']
      }).listPatterns(
        new CodeDocument(mockDocument, jasmine.extensionProperties.testNameRegExp),
        'source', 'test');
    });

    it('has a first pattern scanning the base folder of the code document', () => {
      expect(first(patterns)).toEqual('some/folder/**/code_document*.prg');
    });

    it('has a last pattern scanning every folder', () => {
      expect(last(patterns)).toEqual('**/code_document*.prg');
    });

    it('has patterns scanning existing test folders', () => {
      expect(patterns.slice(1, patterns.length - 1)).toEqual([
        'unit_tests/some/folder/code_document*.prg',
        'unit_tests/**/code_document*.prg',
        'integration_tests/folder/code_document*.prg',
        'integration_tests/**/code_document*.prg',
        'e2e_tests/some/folder/code_document*.prg',
        'e2e_tests/**/code_document*.prg'
      ]);
    });
  });
});
