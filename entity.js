module.exports = Entity;

var Table = require('cli-table');

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
  var table = new Table({
    head: ['Label', 'Value'],
    colWidths: [20, 20]
  });

  var localAtts = this.atts;

  Object.keys(this.atts).forEach(function(e){
    table.push([e, localAtts[e]]);
  });

  console.log(table.toString());
}
