/* global jasmine, describe, it, beforeEach, expect */
const FileExtensions = require('../lib/file_extensions');

describe('FileExtensions', () => {
  var mockConfiguration;

  beforeEach(() => {
    mockConfiguration = jasmine.createSpyObj('config', ['get']);
  });

  describe('No type mappings', () => {
    beforeEach(() => {
      mockConfiguration.get.and.returnValue({});
    });

    it('retrieves the correct configuration key', () => {
      new FileExtensions(mockConfiguration);

      expect(mockConfiguration.get).toHaveBeenCalledWith('typeMappings');
    });

    it('returns an array with the given type', () => {
      expect(new FileExtensions(mockConfiguration).typesFor('js')).toEqual(['js']);
    });
  });

  describe('With one type mapping', () => {
    beforeEach(() => {
      mockConfiguration.get.and.returnValue({ 'vue': 'js' });
    });

    it('returns an array with the given type and its mapping', () => {
      expect(new FileExtensions(mockConfiguration).typesFor('vue')).toEqual(['vue', 'js']);
      expect(new FileExtensions(mockConfiguration).typesFor('js')).toEqual(['js', 'vue']);
    });
  });

  describe('With two type mappings', () => {
    beforeEach(() => {
      mockConfiguration.get.and.returnValue({
        'vue': 'js',
        'jsx': 'js'
      });
    });

    it('returns an array with the given type and its mappings', () => {
      expect(new FileExtensions(mockConfiguration).typesFor('vue')).toEqual(['vue', 'js']);
      expect(new FileExtensions(mockConfiguration).typesFor('jsx')).toEqual(['jsx', 'js']);
      expect(new FileExtensions(mockConfiguration).typesFor('js')).toEqual(['js', 'vue', 'jsx']);
    });
  });
});
