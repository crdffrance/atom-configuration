
/*
Requires https://github.com/avh4/elm-format
 */

(function() {
  "use strict";
  var Beautifier, ElmFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = ElmFormat = (function(superClass) {
    extend(ElmFormat, superClass);

    function ElmFormat() {
      return ElmFormat.__super__.constructor.apply(this, arguments);
    }

    ElmFormat.prototype.name = "elm-format";

    ElmFormat.prototype.link = "https://github.com/avh4/elm-format";

    ElmFormat.prototype.options = {
      Elm: true
    };

    ElmFormat.prototype.beautify = function(text, language, options) {
      var tempfile;
      return tempfile = this.tempFile("input", text, ".elm").then((function(_this) {
        return function(name) {
          return _this.run("elm-format", ['--yes', name], {
            help: {
              link: 'https://github.com/avh4/elm-format#installation-'
            }
          }).then(function() {
            return _this.readFile(name);
          });
        };
      })(this));
    };

    return ElmFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9lbG0tZm9ybWF0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBO0FBSEEsTUFBQSxxQkFBQTtJQUFBOzs7RUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBQ3JCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFFTixPQUFBLEdBQVM7TUFDUCxHQUFBLEVBQUssSUFERTs7O3dCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTthQUFBLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUIsTUFBekIsQ0FDWCxDQUFDLElBRFUsQ0FDTCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtpQkFDSixLQUFDLENBQUEsR0FBRCxDQUFLLFlBQUwsRUFBbUIsQ0FDakIsT0FEaUIsRUFFakIsSUFGaUIsQ0FBbkIsRUFJRTtZQUFFLElBQUEsRUFBTTtjQUFFLElBQUEsRUFBTSxrREFBUjthQUFSO1dBSkYsQ0FNQSxDQUFDLElBTkQsQ0FNTSxTQUFBO21CQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsSUFBVjtVQURJLENBTk47UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FESztJQURIOzs7O0tBUjZCO0FBTnpDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwczovL2dpdGh1Yi5jb20vYXZoNC9lbG0tZm9ybWF0XG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBFbG1Gb3JtYXQgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiZWxtLWZvcm1hdFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2F2aDQvZWxtLWZvcm1hdFwiXG5cbiAgb3B0aW9uczoge1xuICAgIEVsbTogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICB0ZW1wZmlsZSA9IEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQsIFwiLmVsbVwiKVxuICAgIC50aGVuIChuYW1lKSA9PlxuICAgICAgQHJ1bihcImVsbS1mb3JtYXRcIiwgW1xuICAgICAgICAnLS15ZXMnLFxuICAgICAgICBuYW1lXG4gICAgICAgIF0sXG4gICAgICAgIHsgaGVscDogeyBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2F2aDQvZWxtLWZvcm1hdCNpbnN0YWxsYXRpb24tJyB9IH1cbiAgICAgIClcbiAgICAgIC50aGVuICgpID0+XG4gICAgICAgIEByZWFkRmlsZShuYW1lKVxuIl19
