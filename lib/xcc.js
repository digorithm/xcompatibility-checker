/*
Core class that will hold all xcompatibility-checker related functionality
*/

const fs = require('fs');
const esprima = require('esprima');


/**
 * Type definitions (making Javascript suck less)
 */

/**
 * @typedef {Object}  TriggeredKeywordInfo
 * @property {number} GlobalNumber Total compatibility of this given keyword
 * @property {string} Suggestion   Short text containing suggestive actions to be taken
 */

/**
 * @typedef {Object} CodeCompatibility
 * @property {number} OverallCompatibility Overall browser compatibility of the code
 * @property {TriggeredKeywordInfo[]} TriggeredKeywords Information for each keyword triggered
 */

/** 
 * @class
 * @classdesc Xcc stands for Cross-Compatibility Checker. This class will hold the main
 * functionality for this library.
 */
function Xcc() {
  this.rawDb_path = null;
  this.db = null;
}

/**
 * Load generated DB to be used
 *
 */
Xcc.prototype.LoadDB = function LoadDB() {
  this.db = JSON.parse(fs.readFileSync('db.json'));
};

/**
 * Returns a list of tokens from js code
 *
 * @param {string} code code to be *parsed*, it can be one line or multiple lines
 * @returns {ParsedJSCode} Javascript tokens extracted from Javascript string argument
 */
Xcc.prototype.ParseJSCode = function ParseJSCode(code) {
  const parsedJSCode = esprima.tokenize(code);
  return parsedJSCode;
};

/**
 * Check compatibility of the JS code
 *
 * @param {string} code code to be checked, it can be one line or multiple lines
 * @returns {CodeCompatibility} Compatibility of parsed Javascript code
 */
Xcc.prototype.CheckJSCodeCompatibility = function CheckJSCodeCompatibility(code) {
  const parsedCode = this.ParseJSCode(code);

  // for each token, check if it matches with the trigger keywords in db
  // if it matches, query caniuse, get necessary data 

  return parsedCode;
};

module.exports = Xcc;
