const Xcc = require('./xcc.js');

const x = new Xcc();

x.LoadDB();

x.ParseJSCode('const answer = 42');

