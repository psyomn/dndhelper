module.exports = {
  lsDataSources: lsDataSources,
  lsSchemas:     lsSchemas,
  setDataSource: setDataSource,
  setSchemaSource: setSchemaSource,
};

var constants = require('./constants.js');
var fs        = require('fs');
var colors    = require('colors');
var util      = require('util');
var sprintf   = require('sprintf-js').sprintf;

/*
 * This should take care setting information about the overall project.
 *
 * Let's get some jargon out of the way:
 *   - datbase: in our context are json files. A database file contains data in
 *       json format. For the time being, we have a list of monsters in this
 *       format. An example format is the following:
 *
 *         {
 *           "gobling": {
 *             "hp": 12,
 *             "attack": "12d2",
 *             ...
 *           },
 *           "imp": {
 *             ...
 *           }
 *         }
 *
 *  - schema: describes what fields the data should have. We use the schema for
 *      two things: 1) we use it to create new entities interactively. 2) we can
 *      use the schema in order to filter out extra fields. This way, different
 *      monsters could be shared between games (this is a nice to have at the
 *      moment).
 *
 */

function setDataSource(index) {
  var filename = lsFiltered(constants.DB_EXTENSION)[index];
  setAttribute("datasource", filename);
}

function setSchemaSource(index) {
  var filename = lsFiltered(constants.SCHEMA_EXTENSION)[index];
  console.log("write: " + filename  + " , " + "Datasource");
  setAttribute("schemasource", filename);
}

function setAttribute(label, value) {
  var prevConfig = readConfiguration();
  if (prevConfig == undefined) prevConfig = {};
  prevConfig[label] = value;
  writeConfiguration(prevConfig);
}

/**
 * @return String the filename of the data source file
 */
function getDataSource() {
  var config = readConfiguration();
  return config["datasource"];
}

/**
 * @return String the filename of the schema
 */
function getSchemaSource() {
  var config = readConfiguration();
  return config["schemasource"];
}

/**
 * list all the files which are databases
 */
function lsDataSources() {
  var ext = constants.DB_EXTENSION;
  var chosen = getDataSource();
  lsPretty(ext, chosen, "database");
}

/**
 * list things in a pretty fashion (to be used with extensions). For example,
 * this function may be reused for schemas, or even database files.
 */
function lsPretty(ext, usedFilename, label) {
  var message = "Available " + label + "(s):";
  console.log(message.green);
  lsFiltered(ext).forEach(function(e,x,a){
    var star = usedFilename == e ? '*' : ' ';
    var num  = sprintf(" %s%2d", star, x);
    console.log(num.cyan + ' ' + e.magenta);
  });
}

function lsSchemas() {
  var ext = constants.SCHEMA_EXTENSION;
  var filename = getSchemaSource();
  lsPretty(ext, filename, "schema");
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

function readSchema() {
  var filename = getSchemaSource();
}

