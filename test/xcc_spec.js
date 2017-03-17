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



    describe.only('Testing compatibility checker', function() {

      it("Check simple JS code", function () {
        const x = new XCompatibility();
        x.LoadKeywordsMap();

        const code = "function reportEvent(event) { var data = JSON.stringify({ event: event, time: performance.now() }); navigator.sendBeacon('/collector', data);}"

          const compatibility = x.CheckJSCode(code);

          expect(compatibility.overall_compatibility).to.equal(72.91);
      })

      it("Check simple HTML code", function () {
        const x = new XCompatibility();
        x.LoadKeywordsMap();

        const code = '<html> <body> <h1>My First Heading</h1> <article> hey </article> <p>My first paragraph. </p> </body> </html>';

        const compatibility = x.CheckHTMLCode(code);
        expect(compatibility.overall_compatibility).to.equal(97.84);
      })

      it("Check simple CSS code", function () {
        const x = new XCompatibility();
        x.LoadKeywordsMap();

        const code = 'body{padding-left:11em;font-family:Georgia, "Times New Roman", Times, serif;color:purple;background-color:#d8da3d}ul.navbar{ hyphens: none; list-style-type:none;padding:0;margin:0;position:absolute;top:2em;left:1em;width:9em}h1{font-family:Helvetica, Geneva, Arial, SunSans-Regular, sans-serif}ul.navbar li{background:white;margin:0.5em 0;padding:0.3em;border-right:1em solid black}ul.navbar a{text-decoration:none}a:link{color:blue}a:visited{color:purple}address{margin-top:1em;padding-top:1em;border-top:thin dotted}'
        const compatibility= x.CheckCSSCode(code);
        expect(compatibility.overall_compatibility).to.equal(18.619999999999997);
      })

      it('Parse codebase (many files containing code)', function() {
        const x = new XCompatibility();

        x.LoadKeywordsMap();

        files = ["test/test_code/cssfile.css", "test/test_code/htmlfile.html", "test/test_code/jsfile.js"];

        const CodeCompatibility = x.CheckCodebase(files);

        expect(CodeCompatibility.overall_compatibility).to.equal(18.619999999999997)
      });

      it.only('Checking loomio codebase', function() {
        const x = new XCompatibility();

        x.LoadKeywordsMap();

        const path = "test/test_code/loomio";

        let files = ['/app/assets/javascripts/active_admin.js',
        '/app/assets/javascripts/angular_ahoy.js',
        '/app/assets/stylesheets/email.css',
        '/app/assets/stylesheets/poll_mailer.css',
        '/profile.html',
        '/public/service-worker.js',
        '/public/404.html',
        '/public/422.html',
        '/public/429.html',
        '/public/500.html',
        '/public/google2d27e29427405bf7.html']

        files = files.map(function(e) {
          e = path + e;
          return e;
        });

        const CodeCompatibility = x.CheckCodebase(files);

        expect(CodeCompatibility.overall_compatibility).to.equal(18.619999999999997)
      });

      it('Checking troublesome file', function() {
        const x = new XCompatibility();

        x.LoadKeywordsMap();

        const css_file = ["test/test_code/sharetribe/client/app/assets/styles/mixins.css"]

        const CSSCompatibility = x.CheckCodebase(css_file);
        console.log(CSSCompatibility);
      });
    });

  });
});
