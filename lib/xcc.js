/*
Core class that will hold all xcompatibility-checker related functionality
*/

const fs = require('fs');
const esprima = require('esprima');
const TokenStream = require ('html-lexer');
const css = require('css');


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
 */
Xcc.prototype.LoadDB = function LoadDB() {
  this.db = JSON.parse(fs.readFileSync('db.json'));
};

/**
 * Returns a list of tokens from js code
 *
 * @param {string} code code to be *parsed*, it can be one line or multiple lines
 * @returns {JSKeywords} Javascript keywords extracted from Javascript string argument
 */
Xcc.prototype.ParseJSCode = function ParseJSCode(code) {
  
  const parsedJSCode = esprima.tokenize(code);
  const keywords = [];
  
  parsedJSCode.forEach(function(token){
    if (token.type === "Keyword") {
      keywords.push(token.value);
    }
  });
  
  return keywords;
};

/**
 * Returns a list of tokens (tagName) from HTML5 code
 *
 * @param {string} code code to be checked, it can be one line or multiple lines
 * @returns {HTMLTags} HTML5 tag names
 */
Xcc.prototype.ParseHTMLCode = function ParseHTMLCode(code) {
  
  const tokens = new TokenStream(code)
  var token = tokens.next()

  const keywords = [];  
  
  while (token != null) {
  	if (token[0] === "tagName"){
      keywords.push(token[1]);
    }
  	token = tokens.next();
  }
  
  return keywords;
}

/**
 * Returns a list of keywordsfrom CSS code
 *
 * @param {string} code code to be checked, it can be one line or multiple lines
 * @returns {CSSKeywords} CSS keywords
 */
Xcc.prototype.ParseCSSCode = function ParseCSSCode(code) {
  
  const keywords = [];

  var obj = css.parse(code);

  obj.stylesheet.rules.forEach(function(rule) {
    if (rule.type === "rule"){
      
      rule.selectors.map(e => keywords.push(e));

      rule.declarations.forEach(function(declaration) {
        keywords.push(declaration.property);
      });
    }
  });
  
  return keywords;
}

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

// TODO: do the same thing for HTML and CSS
// TODO: create func API specs for `CheckCodebaseCompatibility(files)`
// With these two TODOs done, we can way for mohammed to finish the db so we can actually
// the functionalities