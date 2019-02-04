/* global jasmine, spyOn, describe, it, beforeEach, expect */
const fs = require('fs');
const first = require('lodash.first');
const last = require('lodash.last');
const PatternGenerator = require('../../lib/workspace_decorator/pattern_generator');

describe('PatternGenerator', () => {
  var mockWorkspace, mockCodeDocument;
  beforeEach(() => {
    mockWorkspace = {
      getWorkspaceFolder: jasmine.createSpy().and.returnValue({
        uri: { fsPath: '/path/to/workspace' }
      })
    };
    mockCodeDocument = {
      uri: 'test/path/uri',
      fileName: '/path/to/workspace/some/folder/code_document.prg',
      fileNamePatterns: {
        source: 'code_document.{ext1,ext2}',
        test: 'code_document*.{ext1,ext2}'
      }
    };
  });

  describe('when no project paths have been defined', () => {
    var patterns;
    beforeEach(() => {
      patterns = new PatternGenerator(mockWorkspace, { source: [], test: [] })
        .listPatterns(mockCodeDocument, 'source', 'test');
    });

    it('has a first pattern scanning the base folder of the code document', () => {
      expect(first(patterns)).toEqual('some/folder/**/code_document*.{ext1,ext2}');
    });

    it('has a last pattern scanning every folder', () => {
      expect(last(patterns)).toEqual('**/code_document*.{ext1,ext2}');
    });

    it('does not have any other pattern', () => {
      expect(patterns.length).toEqual(2);
    });
  });

  describe('when test project paths have been defined', () => {
    var patterns;
    beforeEach(() => {
      spyOn(fs, 'existsSync').and.returnValues(true, false, true);
      patterns = new PatternGenerator(mockWorkspace, { source: [], test: ['unit_tests', 'integration_tests', 'e2e_tests'] })
        .listPatterns(mockCodeDocument, 'source', 'test');
    });

    it('has a first pattern scanning the base folder of the code document', () => {
      expect(first(patterns)).toEqual('some/folder/**/code_document*.{ext1,ext2}');
    });

    it('has a last pattern scanning every folder', () => {
      expect(last(patterns)).toEqual('**/code_document*.{ext1,ext2}');
    });

    it('has patterns scanning existing test folders', () => {
      expect(patterns.slice(1, patterns.length - 1)).toEqual([
        'unit_tests/some/folder/code_document*.{ext1,ext2}',
        'unit_tests/**/code_document*.{ext1,ext2}',
        'integration_tests/**/code_document*.{ext1,ext2}',
        'e2e_tests/some/folder/code_document*.{ext1,ext2}',
        'e2e_tests/**/code_document*.{ext1,ext2}'
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
      }).listPatterns(mockCodeDocument, 'source', 'test');
    });

    it('has a first pattern scanning the base folder of the code document', () => {
      expect(first(patterns)).toEqual('some/folder/**/code_document*.{ext1,ext2}');
    });

    it('has a last pattern scanning every folder', () => {
      expect(last(patterns)).toEqual('**/code_document*.{ext1,ext2}');
    });

    it('has patterns scanning existing test folders', () => {
      expect(patterns.slice(1, patterns.length - 1)).toEqual([
        'unit_tests/some/folder/code_document*.{ext1,ext2}',
        'unit_tests/**/code_document*.{ext1,ext2}',
        'integration_tests/folder/code_document*.{ext1,ext2}',
        'integration_tests/**/code_document*.{ext1,ext2}',
        'e2e_tests/some/folder/code_document*.{ext1,ext2}',
        'e2e_tests/**/code_document*.{ext1,ext2}'
      ]);
    });
  });
});
