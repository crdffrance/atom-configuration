
/*
Requires https://github.com/nrc/rustfmt
 */

(function() {
  "use strict";
  var Beautifier, Rustfmt, path, versionCheckState,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  versionCheckState = false;

  module.exports = Rustfmt = (function(superClass) {
    extend(Rustfmt, superClass);

    function Rustfmt() {
      return Rustfmt.__super__.constructor.apply(this, arguments);
    }

    Rustfmt.prototype.name = "rustfmt";

    Rustfmt.prototype.link = "https://github.com/nrc/rustfmt";

    Rustfmt.prototype.options = {
      Rust: true
    };

    Rustfmt.prototype.beautify = function(text, language, options, context) {
      var cwd, help, p, program;
      cwd = context.filePath && path.dirname(context.filePath);
      program = options.rustfmt_path || "rustfmt";
      help = {
        link: "https://github.com/nrc/rustfmt",
        program: "rustfmt",
        pathOption: "Rust - Rustfmt Path"
      };
      p = versionCheckState === program ? this.Promise.resolve() : this.run(program, ["--version"], {
        help: help
      }).then(function(stdout) {
        if (/^0\.(?:[0-4]\.[0-9])/.test(stdout.trim())) {
          versionCheckState = false;
          throw new Error("rustfmt version 0.5.0 or newer required");
        } else {
          versionCheckState = program;
          return void 0;
        }
      });
      return p.then((function(_this) {
        return function() {
          return _this.run(program, [], {
            cwd: cwd,
            help: help,
            onStdin: function(stdin) {
              return stdin.end(text);
            }
          });
        };
      })(this));
    };

    return Rustfmt;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9ydXN0Zm10LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSw0Q0FBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQLGlCQUFBLEdBQW9COztFQUVwQixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztzQkFDckIsSUFBQSxHQUFNOztzQkFDTixJQUFBLEdBQU07O3NCQUVOLE9BQUEsR0FBUztNQUNQLElBQUEsRUFBTSxJQURDOzs7c0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakIsRUFBMEIsT0FBMUI7QUFDUixVQUFBO01BQUEsR0FBQSxHQUFNLE9BQU8sQ0FBQyxRQUFSLElBQXFCLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBTyxDQUFDLFFBQXJCO01BQzNCLE9BQUEsR0FBVSxPQUFPLENBQUMsWUFBUixJQUF3QjtNQUNsQyxJQUFBLEdBQU87UUFDTCxJQUFBLEVBQU0sZ0NBREQ7UUFFTCxPQUFBLEVBQVMsU0FGSjtRQUdMLFVBQUEsRUFBWSxxQkFIUDs7TUFTUCxDQUFBLEdBQU8saUJBQUEsS0FBcUIsT0FBeEIsR0FDRixJQUFDLENBQUEsT0FBTyxDQUFDLE9BQVQsQ0FBQSxDQURFLEdBR0YsSUFBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsQ0FBQyxXQUFELENBQWQsRUFBNkI7UUFBQSxJQUFBLEVBQU0sSUFBTjtPQUE3QixDQUNFLENBQUMsSUFESCxDQUNRLFNBQUMsTUFBRDtRQUNKLElBQUcsc0JBQXNCLENBQUMsSUFBdkIsQ0FBNEIsTUFBTSxDQUFDLElBQVAsQ0FBQSxDQUE1QixDQUFIO1VBQ0UsaUJBQUEsR0FBb0I7QUFDcEIsZ0JBQVUsSUFBQSxLQUFBLENBQU0seUNBQU4sRUFGWjtTQUFBLE1BQUE7VUFJRSxpQkFBQSxHQUFvQjtpQkFDcEIsT0FMRjs7TUFESSxDQURSO2FBVUYsQ0FBQyxDQUFDLElBQUYsQ0FBTyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ0wsS0FBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsRUFBZCxFQUFrQjtZQUNoQixHQUFBLEVBQUssR0FEVztZQUVoQixJQUFBLEVBQU0sSUFGVTtZQUdoQixPQUFBLEVBQVMsU0FBQyxLQUFEO3FCQUNQLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVjtZQURPLENBSE87V0FBbEI7UUFESztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUDtJQXpCUTs7OztLQVIyQjtBQVZ2QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL25yYy9ydXN0Zm10XG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxucGF0aCA9IHJlcXVpcmUoJ3BhdGgnKVxuXG52ZXJzaW9uQ2hlY2tTdGF0ZSA9IGZhbHNlXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUnVzdGZtdCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJydXN0Zm10XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vbnJjL3J1c3RmbXRcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBSdXN0OiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zLCBjb250ZXh0KSAtPlxuICAgIGN3ZCA9IGNvbnRleHQuZmlsZVBhdGggYW5kIHBhdGguZGlybmFtZSBjb250ZXh0LmZpbGVQYXRoXG4gICAgcHJvZ3JhbSA9IG9wdGlvbnMucnVzdGZtdF9wYXRoIG9yIFwicnVzdGZtdFwiXG4gICAgaGVscCA9IHtcbiAgICAgIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL25yYy9ydXN0Zm10XCJcbiAgICAgIHByb2dyYW06IFwicnVzdGZtdFwiXG4gICAgICBwYXRoT3B0aW9uOiBcIlJ1c3QgLSBSdXN0Zm10IFBhdGhcIlxuICAgIH1cblxuICAgICMgMC41LjAgaXMgYSByZWxhdGl2ZWx5IG5ldyB2ZXJzaW9uIGF0IHRoZSBwb2ludCBvZiB3cml0aW5nLFxuICAgICMgYnV0IGlzIGVzc2VudGlhbCBmb3IgdGhpcyB0byB3b3JrIHdpdGggc3RkaW4uXG4gICAgIyA9PiBDaGVjayBmb3IgaXQgc3BlY2lmaWNhbGx5LlxuICAgIHAgPSBpZiB2ZXJzaW9uQ2hlY2tTdGF0ZSA9PSBwcm9ncmFtXG4gICAgICBAUHJvbWlzZS5yZXNvbHZlKClcbiAgICBlbHNlXG4gICAgICBAcnVuKHByb2dyYW0sIFtcIi0tdmVyc2lvblwiXSwgaGVscDogaGVscClcbiAgICAgICAgLnRoZW4oKHN0ZG91dCkgLT5cbiAgICAgICAgICBpZiAvXjBcXC4oPzpbMC00XVxcLlswLTldKS8udGVzdChzdGRvdXQudHJpbSgpKVxuICAgICAgICAgICAgdmVyc2lvbkNoZWNrU3RhdGUgPSBmYWxzZVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwicnVzdGZtdCB2ZXJzaW9uIDAuNS4wIG9yIG5ld2VyIHJlcXVpcmVkXCIpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgdmVyc2lvbkNoZWNrU3RhdGUgPSBwcm9ncmFtXG4gICAgICAgICAgICB1bmRlZmluZWRcbiAgICAgICAgKVxuXG4gICAgcC50aGVuKD0+XG4gICAgICBAcnVuKHByb2dyYW0sIFtdLCB7XG4gICAgICAgIGN3ZDogY3dkXG4gICAgICAgIGhlbHA6IGhlbHBcbiAgICAgICAgb25TdGRpbjogKHN0ZGluKSAtPlxuICAgICAgICAgIHN0ZGluLmVuZCB0ZXh0XG4gICAgICB9KVxuICAgIClcbiJdfQ==
