var path = require('path');

/* TODO not compatible for windows */
var appname = 'dndhelper'
var base = process.env.HOME;
var data_dir = path.join(base, '.config', appname);
var configuration = path.join(data_dir, 'configuration.json');

/**
 * @param filename is the filename to append to the datadir.
 * @example
 *     data_dir_file("database.json");
 *     // will evaluate to $HOME/.config/appname/database.json
 * @return String denoting the absolute path to the data dir, and the file
 *   concatenated in the end
 */
function dataDirFile(filename) {
  return path.join(data_dir, filename);
}

module.exports = Object.freeze({
  HOME:          process.env.HOME,
  APPNAME:       appname,
  BASE:          base,
  DATADIR:       data_dir,
  DB_EXTENSION:  'db.json',
  SCHEMA_EXTENSION: 'schema.json',
  CONFIG:        configuration,

  /* functions */
  dataDirFile: dataDirFile,
});


