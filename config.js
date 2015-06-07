module.exports = {
  listDataSources: listDataSources,
  setDataSource:   setDataSource,
  getDataSourceFilename: getDataSourceFilename
};

var constants = require('./constants.js');
var fs        = require('fs');
var colors    = require('colors');
var util      = require('util');
var sprintf   = require('sprintf-js').sprintf;
/*
 * This should take care setting information about the overall project
 */

function setDataSource(index) {
  var prevConfig = readConfiguration();
  if (prevConfig == undefined) prevConfig = {};
  prevConfig["datasource"] = index;
  writeConfiguration(prevConfig);
}

function getDataSource() {
  var config = readConfiguration();
  return config["datasource"];
}

function getDataSourceFilename() {
  var dataSourceIndex = getDataSource();
  var files = lsFiltered(constants.DB_EXTENSION);
  return files[dataSourceIndex];
}

function listDataSources() {
  var ext = constants.DB_EXTENSION;
  var chosen = getDataSource();
  console.log('Available databases: '.green);
  lsFiltered(ext).forEach(function(e,x,a){
    var star = chosen == x ? '*' : ' ';
    var num  = sprintf("%s%2d", star, x);
    var selected = ' ';
    console.log(selected + num.cyan + ' ' + e.magenta);
  });
}

function listSchemas() {
  /** TODO */
}

/**
 * @param ext is the extension we're looking for.
 */
function lsFiltered(ext) {
  var files = fs.readdirSync(constants.DATADIR);
  var filtered = new Array();

  files.forEach(function(e) {
    if (e.split('.').splice(1).join('.') == ext){
      filtered.push(e);
    }
  });

  return filtered;
}

/**
 * Reads the configuration information about application, stored in DATADIR.
 * @return JSON an object denoting the current configuration.
 */
function readConfiguration() {
  var file = constants.CONFIG;
  var contents = fs.readFileSync(file);
  return JSON.parse(contents);
}

/**
 * Write the configuration out to some file.
 */
function writeConfiguration(json) {
  var file = constants.CONFIG;
  fs.writeFileSync(file, JSON.stringify(json));
}

function maybeCreateWrite(absPath, contents) {
  var fd;
  fd = fs.openSync(absPath);
  fs.writeSync(fd, contents);
  fs.closeSync(fd);
}
