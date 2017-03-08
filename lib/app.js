const XCompatibility = require('./XCompatibility.js');

const x = new XCompatibility();

x.LoadKeywordsMap();

var result = x.ParseJSCode('const answer = 42');

console.log(result);

