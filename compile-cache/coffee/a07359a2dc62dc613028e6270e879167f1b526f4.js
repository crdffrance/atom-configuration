
/*
Requires [puppet-link](http://puppet-lint.com/)
 */

(function() {
  "use strict";
  var Beautifier, PuppetFix,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PuppetFix = (function(superClass) {
    extend(PuppetFix, superClass);

    function PuppetFix() {
      return PuppetFix.__super__.constructor.apply(this, arguments);
    }

    PuppetFix.prototype.name = "puppet-lint";

    PuppetFix.prototype.link = "http://puppet-lint.com/";

    PuppetFix.prototype.options = {
      Puppet: true
    };

    PuppetFix.prototype.cli = function(options) {
      if (options.puppet_path == null) {
        return new Error("'puppet-lint' path is not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.puppet_path;
      }
    };

    PuppetFix.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("puppet-lint", ['--fix', tempFile = this.tempFile("input", text)], {
        ignoreReturnCode: true,
        help: {
          link: "http://puppet-lint.com/"
        }
      }).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return PuppetFix;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wdXBwZXQtZml4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUdBO0FBSEEsTUFBQSxxQkFBQTtJQUFBOzs7RUFJQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBRXJCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFFTixPQUFBLEdBQVM7TUFDUCxNQUFBLEVBQVEsSUFERDs7O3dCQUlULEdBQUEsR0FBSyxTQUFDLE9BQUQ7TUFDSCxJQUFPLDJCQUFQO0FBQ0UsZUFBVyxJQUFBLEtBQUEsQ0FBTSxnQ0FBQSxHQUNmLHlEQURTLEVBRGI7T0FBQSxNQUFBO0FBSUUsZUFBTyxPQUFPLENBQUMsWUFKakI7O0lBREc7O3dCQU9MLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTthQUFBLElBQUMsQ0FBQSxHQUFELENBQUssYUFBTCxFQUFvQixDQUNsQixPQURrQixFQUVsQixRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRk8sQ0FBcEIsRUFHSztRQUNELGdCQUFBLEVBQWtCLElBRGpCO1FBRUQsSUFBQSxFQUFNO1VBQ0osSUFBQSxFQUFNLHlCQURGO1NBRkw7T0FITCxDQVNFLENBQUMsSUFUSCxDQVNRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FUUjtJQURROzs7O0tBaEI2QjtBQU56QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgW3B1cHBldC1saW5rXShodHRwOi8vcHVwcGV0LWxpbnQuY29tLylcbiMjI1xuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFB1cHBldEZpeCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgIyB0aGlzIGlzIHdoYXQgZGlzcGxheXMgYXMgeW91ciBEZWZhdWx0IEJlYXV0aWZpZXIgaW4gTGFuZ3VhZ2UgQ29uZmlnXG4gIG5hbWU6IFwicHVwcGV0LWxpbnRcIlxuICBsaW5rOiBcImh0dHA6Ly9wdXBwZXQtbGludC5jb20vXCJcblxuICBvcHRpb25zOiB7XG4gICAgUHVwcGV0OiB0cnVlXG4gIH1cblxuICBjbGk6IChvcHRpb25zKSAtPlxuICAgIGlmIG5vdCBvcHRpb25zLnB1cHBldF9wYXRoP1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcihcIidwdXBwZXQtbGludCcgcGF0aCBpcyBub3Qgc2V0IVwiICtcbiAgICAgICAgXCIgUGxlYXNlIHNldCB0aGlzIGluIHRoZSBBdG9tIEJlYXV0aWZ5IHBhY2thZ2Ugc2V0dGluZ3MuXCIpXG4gICAgZWxzZVxuICAgICAgcmV0dXJuIG9wdGlvbnMucHVwcGV0X3BhdGhcblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJwdXBwZXQtbGludFwiLCBbXG4gICAgICAnLS1maXgnXG4gICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgICBdLCB7XG4gICAgICAgIGlnbm9yZVJldHVybkNvZGU6IHRydWVcbiAgICAgICAgaGVscDoge1xuICAgICAgICAgIGxpbms6IFwiaHR0cDovL3B1cHBldC1saW50LmNvbS9cIlxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLnRoZW4oPT5cbiAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgKVxuIl19
