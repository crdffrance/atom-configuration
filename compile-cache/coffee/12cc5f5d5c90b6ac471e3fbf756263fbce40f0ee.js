(function() {
  "use strict";
  var Beautifier, Checker, JSCSFixer, checker, cliConfig,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  Checker = null;

  cliConfig = null;

  checker = null;

  module.exports = JSCSFixer = (function(superClass) {
    extend(JSCSFixer, superClass);

    function JSCSFixer() {
      return JSCSFixer.__super__.constructor.apply(this, arguments);
    }

    JSCSFixer.prototype.name = "JSCS Fixer";

    JSCSFixer.prototype.link = "https://github.com/jscs-dev/node-jscs/";

    JSCSFixer.prototype.options = {
      JavaScript: false
    };

    JSCSFixer.prototype.beautify = function(text, language, options) {
      this.verbose("JSCS Fixer language " + language);
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var config, editor, err, path, result;
          try {
            if (checker == null) {
              cliConfig = require('jscs/lib/cli-config');
              Checker = require('jscs');
              checker = new Checker();
              checker.registerDefaultRules();
            }
            editor = atom.workspace.getActiveTextEditor();
            path = editor != null ? editor.getPath() : void 0;
            config = path != null ? cliConfig.load(void 0, atom.project.relativizePath(path)[0]) : void 0;
            if (config == null) {
              throw new Error("No JSCS config found.");
            }
            checker.configure(config);
            result = checker.fixString(text, path);
            if (result.errors.getErrorCount() > 0) {
              _this.error(result.errors.getErrorList().reduce(function(res, err) {
                return res + "<br> Line " + err.line + ": " + err.message;
              }, "JSCS Fixer error:"));
            }
            return resolve(result.output);
          } catch (error) {
            err = error;
            _this.error("JSCS Fixer error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    return JSCSFixer;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9qc2NzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxrREFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsT0FBQSxHQUFVOztFQUNWLFNBQUEsR0FBWTs7RUFDWixPQUFBLEdBQVU7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7d0JBQ3JCLElBQUEsR0FBTTs7d0JBQ04sSUFBQSxHQUFNOzt3QkFFTixPQUFBLEdBQVM7TUFDUCxVQUFBLEVBQVksS0FETDs7O3dCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO01BQ1IsSUFBQyxDQUFBLE9BQUQsQ0FBUyxzQkFBQSxHQUF1QixRQUFoQztBQUNBLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixjQUFBO0FBQUE7WUFDRSxJQUFJLGVBQUo7Y0FDRSxTQUFBLEdBQVksT0FBQSxDQUFRLHFCQUFSO2NBQ1osT0FBQSxHQUFVLE9BQUEsQ0FBUSxNQUFSO2NBQ1YsT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFBO2NBQ2QsT0FBTyxDQUFDLG9CQUFSLENBQUEsRUFKRjs7WUFLQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1lBQ1QsSUFBQSxHQUFVLGNBQUgsR0FBZ0IsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUFoQixHQUFzQztZQUM3QyxNQUFBLEdBQVksWUFBSCxHQUFjLFNBQVMsQ0FBQyxJQUFWLENBQWUsTUFBZixFQUEwQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsSUFBNUIsQ0FBa0MsQ0FBQSxDQUFBLENBQTVELENBQWQsR0FBbUY7WUFDNUYsSUFBSSxjQUFKO0FBQ0Usb0JBQVUsSUFBQSxLQUFBLENBQU0sdUJBQU4sRUFEWjs7WUFFQSxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQjtZQUNBLE1BQUEsR0FBUyxPQUFPLENBQUMsU0FBUixDQUFrQixJQUFsQixFQUF3QixJQUF4QjtZQUNULElBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxhQUFkLENBQUEsQ0FBQSxHQUFnQyxDQUFuQztjQUNFLEtBQUMsQ0FBQSxLQUFELENBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxZQUFkLENBQUEsQ0FBNEIsQ0FBQyxNQUE3QixDQUFvQyxTQUFDLEdBQUQsRUFBTSxHQUFOO3VCQUN0QyxHQUFELEdBQUssWUFBTCxHQUFpQixHQUFHLENBQUMsSUFBckIsR0FBMEIsSUFBMUIsR0FBOEIsR0FBRyxDQUFDO2NBREssQ0FBcEMsRUFFTCxtQkFGSyxDQUFQLEVBREY7O21CQUtBLE9BQUEsQ0FBUSxNQUFNLENBQUMsTUFBZixFQWxCRjtXQUFBLGFBQUE7WUFvQk07WUFDSixLQUFDLENBQUEsS0FBRCxDQUFPLG9CQUFBLEdBQXFCLEdBQTVCO21CQUNBLE1BQUEsQ0FBTyxHQUFQLEVBdEJGOztRQURrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDtJQUZIOzs7O0tBUjZCO0FBUHpDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5DaGVja2VyID0gbnVsbFxuY2xpQ29uZmlnID0gbnVsbFxuY2hlY2tlciA9IG51bGxcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBKU0NTRml4ZXIgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiSlNDUyBGaXhlclwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2pzY3MtZGV2L25vZGUtanNjcy9cIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBKYXZhU2NyaXB0OiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAdmVyYm9zZShcIkpTQ1MgRml4ZXIgbGFuZ3VhZ2UgI3tsYW5ndWFnZX1cIilcbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICB0cnlcbiAgICAgICAgaWYgIWNoZWNrZXI/XG4gICAgICAgICAgY2xpQ29uZmlnID0gcmVxdWlyZSAnanNjcy9saWIvY2xpLWNvbmZpZydcbiAgICAgICAgICBDaGVja2VyID0gcmVxdWlyZSAnanNjcydcbiAgICAgICAgICBjaGVja2VyID0gbmV3IENoZWNrZXIoKVxuICAgICAgICAgIGNoZWNrZXIucmVnaXN0ZXJEZWZhdWx0UnVsZXMoKVxuICAgICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgICAgcGF0aCA9IGlmIGVkaXRvcj8gdGhlbiBlZGl0b3IuZ2V0UGF0aCgpIGVsc2UgdW5kZWZpbmVkXG4gICAgICAgIGNvbmZpZyA9IGlmIHBhdGg/IHRoZW4gY2xpQ29uZmlnLmxvYWQodW5kZWZpbmVkLCBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgocGF0aClbMF0pIGVsc2UgdW5kZWZpbmVkXG4gICAgICAgIGlmICFjb25maWc/XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gSlNDUyBjb25maWcgZm91bmQuXCIpXG4gICAgICAgIGNoZWNrZXIuY29uZmlndXJlKGNvbmZpZylcbiAgICAgICAgcmVzdWx0ID0gY2hlY2tlci5maXhTdHJpbmcodGV4dCwgcGF0aClcbiAgICAgICAgaWYgcmVzdWx0LmVycm9ycy5nZXRFcnJvckNvdW50KCkgPiAwXG4gICAgICAgICAgQGVycm9yKHJlc3VsdC5lcnJvcnMuZ2V0RXJyb3JMaXN0KCkucmVkdWNlKChyZXMsIGVycikgLT5cbiAgICAgICAgICAgIFwiI3tyZXN9PGJyPiBMaW5lICN7ZXJyLmxpbmV9OiAje2Vyci5tZXNzYWdlfVwiXG4gICAgICAgICAgLCBcIkpTQ1MgRml4ZXIgZXJyb3I6XCIpKVxuXG4gICAgICAgIHJlc29sdmUgcmVzdWx0Lm91dHB1dFxuXG4gICAgICBjYXRjaCBlcnJcbiAgICAgICAgQGVycm9yKFwiSlNDUyBGaXhlciBlcnJvcjogI3tlcnJ9XCIpXG4gICAgICAgIHJlamVjdChlcnIpXG5cbiAgICApXG4iXX0=
