/*
Core class that will hold all xcompatibility-checker related functionality
!!! Still under development !!!
*/

const fs = require('fs');

function Xcc() {
  this.rawDb_path = null;
  this.db = null;
}

Xcc.prototype.PreprocessDB = function PreprocessDB() {};

(function PreprocessDB(rawDb) {
  this.rawDb_path = rawDb;

  this.rawDb = fs.readFileSync(rawDb);
}());

module.exports = Xcc;
