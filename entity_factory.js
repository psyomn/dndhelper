module.exports = {
  makeFromJSON: makeFromJSON,
  createEntityInteractive: createEntityInteractive
};

var fs = require('fs');
var constants = require('./constants.js');
var config = require('./config.js');
var Entity = require('./entity.js');
var Type   = require('type-of-is');
var readlineSync = require('readline-sync');

/**
 * Looks for the database file (json), reads, and returns a list of
 * entities.
 *
 * The format of the json file expects that every entity will have a string
 * label. For example like the following:
 *
 * "Orc" : {
 *    "hp": 12,
 *    "height": 12.12
 *    ...
 * }
 *
 * @param jsonFile is the filename which contains the list of entities in json
 * @return Array of entities (objects)
 * @see Entity
 */
function makeFromJSON(jsonFile) {
  var contents = getContents(jsonFile);
  var entityArr = new Array();

  Object.keys(contents).forEach(function(e) {
    var ent = new Entity();
    /* The label is the name of entity */
    ent.att('name', e);
    assignAttributes(ent, contents[e]);
    entityArr.push(ent);
  });

  return entityArr;
}

/**
 * Simply assigns the keys, and the values, as attribute labels, and attribute
 * values. For example, it would assign the attribute 'hp', and assign the value
 * 12 from the following example:
 *
 * "Orc" : {
 *    "hp": 12,
 *    "height": 12.12
 *    ...
 * }
 *
 */
function assignAttributes(entity, attributes) {
  Object.keys(attributes).forEach(function(e){
    entity.att(e, attributes[e]);
  });
}

/**
 * Given a path, it will look in DATADIR/filename, will read the contents,
 * and turn the contents into json.
 * @param jsonFile is the file we want to read in the DATADIR
 * @return JSON the json object containing all the data of the entities
 */
function getContents(jsonFile) {
  var dbPath = constants.dataDirFile(jsonFile);
  var buffer = fs.readFileSync(dbPath).toString();
  var json = JSON.parse(buffer);
  return json;
}

/**
 * Interactively crete an entity.
 */
function createEntityInteractive() {
  var schema = config.readSchema();
  var entityHash = {};
  var ent = new Entity();

  Object.keys(schema).forEach(function(k){
    var schk = schema[k];
    if (Type.is(schk, String)) {
      var val = readlineSync.question("Enter the " + k + ": ");
      entityHash[k] = val;
    }
    else if (Type.is(schk, Number)) {
      var val = readlineSync.question("Enter the " + k + ": ");
      entityHash[k] = parseInt(val);
    }
    else if (Type.is(schk, Array)) {
      var done = false;
      var arr = new Array();
      while (!done) {
        var val = readlineSync.question("  Enter aggregate value for " + k + ": ");
        if (val != '') {
          arr.push(val);
        }
        else done = true;
      }
      entityHash[k] = arr;
    }
    else if (Type.is(schk, Object)) {
      var done = false;
      var hash = {};
      while (!done) {
        var label = readlineSync.question("  Enter aggregate label: ");
        var val = readlineSync.question("  Enter aggregate val: ");
        if (label == '' || val == ''){
          done = true;
        }
        else {
          hash[label] = val;
        }
      }
      entityHash[k] = hash;
    }
  });

  ent.atts = entityHash;
  ent.toTable();
}

