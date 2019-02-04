module.exports = function(configuration) {
  const typeMappings = configuration.get('typeMappings');

  this.typesFor = function(ext) {
    var extensions = [ext];

    if (typeMappings[ext]) {
      extensions.push(typeMappings[ext]);
    }
    Object.entries(typeMappings)
      .filter(entry => entry[1] === ext)
      .forEach(entry => extensions.push(entry[0]));

    return extensions;
  };
};
