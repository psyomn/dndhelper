module.exports = Entity;

var Table = require('cli-table');
var Type  = require('type-of-is');

function Entity () {
  this.atts = {};
}

Entity.prototype.att = function(attName) {
  return this.atts[attName];
}

Entity.prototype.att = function(attName, attValue) {
  this.atts[attName] = attValue;
}

Entity.prototype.toTable = function() {
  var maxLabel = 0;
  var maxValue = 0;
  var localAtts = this.atts;

  Object.keys(this.atts).forEach(function(e){
    var val = localAtts[e];
    maxLabel = maxLabel < e.length   ? e.length : maxLabel;
    maxValue = maxValue < val.length ? val.length : maxValue;
  });

  var table = new Table({
    head: ['Label', 'Value'],
  });

  Object.keys(this.atts).forEach(function(e){
    var contents = localAtts[e];
    var toDemo = "";
    if (Type.is(contents, Array))
      toDemo = contents.join(", ");
    else if (Type.is(contents, Object))
      toDemo = JSON.stringify(contents);
    else
      toDemo = contents;
    table.push([e, toDemo]);
  });

  console.log(table.toString());
}

