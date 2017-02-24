const expect = require('chai').expect;
const Xcc = require('../lib/xcc.js');

describe('Testing Xcc', function() {

  describe('Testing DB functionality', function() {
    
    it('DB should be null when initialized', function() {
      const x = new Xcc();
      expect(x.db).to.equal(null);
    });
    
    it('Testing DB load (just checking for non-null in DB prop; improve it later)', function() {
      const x = new Xcc();
      x.LoadDB();
      expect(x.db).to.not.equal(null);
    });
    
    it('Parse simple JS code', function() {
      const x = new Xcc();
      x.LoadDB();
      
      // This code is supposed to have 76 tokens
      const NumberOfTokens = 76

      const code = '(function(exports) { \
                      "use strict"; \
                      function Cow(name) { \
                        this.name = name || "Anon cow"; \
                      } \
                    exports.Cow = Cow; \
                    Cow.prototype = { \
                      greets: function(target) { \
                        if (!target) \
                          return console.error("missing target"); \
                        console.log(this.name + " greets " + target); \
                      } \
                    }; \
                  })(this);'
      
      const parsedCode = x.ParseJSCode(code);

      expect(parsedCode.length).to.equal(NumberOfTokens);

    });
  });

});
