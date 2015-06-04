module.exports = {makeDataDirs: makeDataDirs};

var constants = require('./constants.js');
var fs        = require('fs');
var path      = require('path');
var mkdirp    = require('mkdirp');
var colors    = require('colors');

/*
 * Will check for existance of $HOME/.config/dndhelper and will
 * create directory if no such directory exists
 */
function makeDataDirs() {
  if (!data_dir_exists()) {
    console.log("Running for first time!".green);
    console.log("Creating data directories...");
    mkdirp(constants.DATADIR, function (err) {
      if (err)
        console.log(err);
      else
        console.log("Created data dirs successfully!");
    });
  }
}

function data_dir_exists() {
  try {
    var stats = fs.lstatSync(constants.DATADIR);
    return stats.isDirectory();
  }
  catch(e) {
    return false;
  }
}
