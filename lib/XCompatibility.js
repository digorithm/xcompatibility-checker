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
 * @classdesc This class will hold the main functionality for this library.
 */
function XCompatibility() {
  this.rawDb_path = null;
  this.db = null;
}

/**
 * Load generated DB to be used
 */
XCompatibility.prototype.LoadKeywordsMap = function LoadKeywordsMap() {
  this.db = JSON.parse(fs.readFileSync('db.json'));
};

/**
 * Returns a list of tokens from js code
 *
 * @param {string} code code to be *parsed*, it can be one line or multiple lines
 * @returns {JSKeywords} Javascript keywords extracted from Javascript string argument
 */
XCompatibility.prototype.ParseJSCode = function ParseJSCode(code) {
  
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
XCompatibility.prototype.ParseHTMLCode = function ParseHTMLCode(code) {
  
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
XCompatibility.prototype.ParseCSSCode = function ParseCSSCode(code) {
  
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
XCompatibility.prototype.CheckJSCode = function CheckJSCode(code) {
  const parsedCode = this.ParseJSCode(code);

  // for each token, check if it matches with the trigger keywords in db
  // if it matches, query caniuse, get necessary data 
  // Build CodeCompatibility data and return it

  // temp
  return parsedCode;
};

/**
 * Check compatibility of the HTML code
 *
 * @param {string} code code to be checked, it can be one line or multiple lines
 * @returns {CodeCompatibility} Compatibility of parsed HTML code
 */
XCompatibility.prototype.CheckHTMLCode = function CheckHTMLCode(code) {
  const parsedCode = this.ParseHTMLCode(code);

  // for each token, check if it matches with the trigger keywords in db
  // if it matches, query caniuse, get necessary data 
  // Build CodeCompatibility data and return it

  // temp
  return parsedCode;
};

/**
 * Check compatibility of the CSS code
 *
 * @param {string} code code to be checked, it can be one line or multiple lines
 * @returns {CodeCompatibility} Compatibility of parsed CSS code
 */
XCompatibility.prototype.CheckCSSCode = function CheckCSSCode(code) {
  const parsedCode = this.ParseCSSCode(code);

  // for each token, check if it matches with the trigger keywords in db
  // if it matches, query caniuse, get necessary data 
  // Build CodeCompatibility data and return it

  // temp
  return parsedCode;
}

/**
 * Check compatibility of the code files being passed to the function 
 *
 * @param {string[]} files Path to the files to be checked
 * @returns {CodeCompatibility} Compatibility of the codebase
 */
XCompatibility.prototype.CheckCodebase = function CheckCodebase(files) {

  // This will hold the compatibility of each file in files
  let compatibilities = {};

  files.forEach(function (file) {
    
    code = fs.readFileSync(file);

    switch (file.split('.').pop()){
      
      case "css":
        const CSSCompatibility = this.CheckCSSCode(code)
        compatibilities.push(CSSCompatibility);
        break;

      case "html":
        const HTMLCompatibility = this.CheckHTMLCode(code)
        compatibilities.push(HTMLCompatibility);
        break;

      case "js":
        const JSCompatibility = this.CheckJSCode(code)
        compatibilities.push(JSCompatibility);
        break;
    }
    
    // TODO: Merge compatibilities and return it

    return compatibilities;

  });
}

module.exports = XCompatibility;
