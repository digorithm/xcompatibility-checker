const expect = require('chai').expect;
const XCompatibility = require('../lib/XCompatibility.js');

describe('Testing XCompatibility', function() {

  describe('Testing DB functionality', function() {
    
    it('DB should be null when initialized', function() {
      const x = new XCompatibility();
      expect(x.db).to.equal(null);
    });
    
    it('Testing DB load (just checking for non-null in DB prop; improve it later)', function() {
      const x = new XCompatibility();
      x.LoadKeywordsMap();
      expect(x.db).to.not.equal(null);
    });
    
    
  });
  describe('Testing parsing functionality', function() {
    it('Parse simple JS code', function() {
        const x = new XCompatibility();
        x.LoadKeywordsMap();
        
        // This code is supposed to have 8 keywords
        const NumberOfKeywords = 8

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

        expect(parsedCode.length).to.equal(NumberOfKeywords);
      });

    it('Parse simple HTML5 code', function() {
      const x = new XCompatibility();
      x.LoadKeywordsMap();

      const code = '<html> <body> <h1>My First Heading</h1> <p>My first paragraph. </p> </body> </html>';

      const NumberOfTags = 8;
  
      const parsedCode = x.ParseHTMLCode(code);

      expect(parsedCode.length).to.equal(NumberOfTags);
    });
    
    it('Parse simple CSS code', function() {
      const x = new XCompatibility();
      x.LoadKeywordsMap();

      const code = 'body{padding-left:11em;font-family:Georgia, "Times New Roman", Times, serif;color:purple;background-color:#d8da3d}ul.navbar{list-style-type:none;padding:0;margin:0;position:absolute;top:2em;left:1em;width:9em}h1{font-family:Helvetica, Geneva, Arial, SunSans-Regular, sans-serif}ul.navbar li{background:white;margin:0.5em 0;padding:0.3em;border-right:1em solid black}ul.navbar a{text-decoration:none}a:link{color:blue}a:visited{color:purple}address{margin-top:1em;padding-top:1em;border-top:thin dotted}'

      const NumberOfKeywords = 30;
  
      const parsedCode = x.ParseCSSCode(code);

      expect(parsedCode.length).to.equal(NumberOfKeywords);

    });
    
    it('Parse codebase (many files containing code)', function() {
      const x = new XCompatibility();
      x.LoadKeywordsMap();

      files = ["cssfile.css", "htmlfile.html", "jsfile.js"];

      x.CheckCodebase(files);

    });

  });
});
