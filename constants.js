var path = require('path');

/* TODO not compatible for windows */
var appname = 'dndhelper'
var base = process.env.HOME;
var data_dir = path.join(base, '.config', appname);

module.exports = Object.freeze({
  HOME:    process.env.HOME,
  APPNAME: appname,
  BASE:    base,
  DATADIR: data_dir,
});
