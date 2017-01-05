
/*
Requires https://github.com/bbatsov/rubocop
 */

(function() {
  "use strict";
  var Beautifier, Rubocop,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Rubocop = (function(superClass) {
    extend(Rubocop, superClass);

    function Rubocop() {
      return Rubocop.__super__.constructor.apply(this, arguments);
    }

    Rubocop.prototype.name = "Rubocop";

    Rubocop.prototype.link = "https://github.com/bbatsov/rubocop";

    Rubocop.prototype.options = {
      Ruby: {
        indent_size: true,
        rubocop_path: true
      }
    };

    Rubocop.prototype.beautify = function(text, language, options) {
      return this.Promise.all([options.rubocop_path ? this.which(options.rubocop_path) : void 0, this.which('rubocop')]).then((function(_this) {
        return function(paths) {
          var _, config, configFile, fs, path, rubocopPath, tempFile, yaml;
          _this.debug('rubocop paths', paths);
          _ = require('lodash');
          path = require('path');
          rubocopPath = _.find(paths, function(p) {
            return p && path.isAbsolute(p);
          });
          _this.verbose('rubocopPath', rubocopPath);
          _this.debug('rubocopPath', rubocopPath, paths);
          configFile = path.join(atom.project.getPaths()[0], ".rubocop.yml");
          fs = require('fs');
          if (fs.existsSync(configFile)) {
            _this.debug("rubocop", config, fs.readFileSync(configFile, 'utf8'));
          } else {
            yaml = require("yaml-front-matter");
            config = {
              "Style/IndentationWidth": {
                "Width": options.indent_size
              }
            };
            configFile = _this.tempFile("rubocop-config", yaml.safeDump(config));
            _this.debug("rubocop", config, configFile);
          }
          if (rubocopPath != null) {
            return _this.run(rubocopPath, ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text)], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.run("rubocop", ["--auto-correct", "--config", configFile, tempFile = _this.tempFile("temp", text)], {
              ignoreReturnCode: true
            }).then(function() {
              return _this.readFile(tempFile);
            });
          }
        };
      })(this));
    };

    return Rubocop;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9ydWJvY29wLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtFQUlBO0FBSkEsTUFBQSxtQkFBQTtJQUFBOzs7RUFLQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7c0JBQ3JCLElBQUEsR0FBTTs7c0JBQ04sSUFBQSxHQUFNOztzQkFFTixPQUFBLEdBQVM7TUFDUCxJQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsSUFBYjtRQUNBLFlBQUEsRUFBYyxJQURkO09BRks7OztzQkFNVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNSLElBQUMsQ0FBQSxPQUFPLENBQUMsR0FBVCxDQUFhLENBQ3FCLE9BQU8sQ0FBQyxZQUF4QyxHQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sT0FBTyxDQUFDLFlBQWYsQ0FBQSxHQUFBLE1BRFcsRUFFWCxJQUFDLENBQUEsS0FBRCxDQUFPLFNBQVAsQ0FGVyxDQUFiLENBR0UsQ0FBQyxJQUhILENBR1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEtBQUQ7QUFDTixjQUFBO1VBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTyxlQUFQLEVBQXdCLEtBQXhCO1VBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSO1VBQ0osSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSO1VBRVAsV0FBQSxHQUFjLENBQUMsQ0FBQyxJQUFGLENBQU8sS0FBUCxFQUFjLFNBQUMsQ0FBRDttQkFBTyxDQUFBLElBQU0sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsQ0FBaEI7VUFBYixDQUFkO1VBQ2QsS0FBQyxDQUFBLE9BQUQsQ0FBUyxhQUFULEVBQXdCLFdBQXhCO1VBQ0EsS0FBQyxDQUFBLEtBQUQsQ0FBTyxhQUFQLEVBQXNCLFdBQXRCLEVBQW1DLEtBQW5DO1VBRUEsVUFBQSxHQUFhLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FBd0IsQ0FBQSxDQUFBLENBQWxDLEVBQXNDLGNBQXRDO1VBRWIsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSO1VBRUwsSUFBRyxFQUFFLENBQUMsVUFBSCxDQUFjLFVBQWQsQ0FBSDtZQUNFLEtBQUMsQ0FBQSxLQUFELENBQU8sU0FBUCxFQUFrQixNQUFsQixFQUEwQixFQUFFLENBQUMsWUFBSCxDQUFnQixVQUFoQixFQUE0QixNQUE1QixDQUExQixFQURGO1dBQUEsTUFBQTtZQUdFLElBQUEsR0FBTyxPQUFBLENBQVEsbUJBQVI7WUFFUCxNQUFBLEdBQVM7Y0FDUCx3QkFBQSxFQUNFO2dCQUFBLE9BQUEsRUFBUyxPQUFPLENBQUMsV0FBakI7ZUFGSzs7WUFLVCxVQUFBLEdBQWEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxnQkFBVixFQUE0QixJQUFJLENBQUMsUUFBTCxDQUFjLE1BQWQsQ0FBNUI7WUFDYixLQUFDLENBQUEsS0FBRCxDQUFPLFNBQVAsRUFBa0IsTUFBbEIsRUFBMEIsVUFBMUIsRUFYRjs7VUFjQSxJQUFHLG1CQUFIO21CQUNFLEtBQUMsQ0FBQSxHQUFELENBQUssV0FBTCxFQUFrQixDQUNoQixnQkFEZ0IsRUFFaEIsVUFGZ0IsRUFFSixVQUZJLEVBR2hCLFFBQUEsR0FBVyxLQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FISyxDQUFsQixFQUlLO2NBQUMsZ0JBQUEsRUFBa0IsSUFBbkI7YUFKTCxDQUtFLENBQUMsSUFMSCxDQUtRLFNBQUE7cUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1lBREksQ0FMUixFQURGO1dBQUEsTUFBQTttQkFVRSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsRUFBZ0IsQ0FDZCxnQkFEYyxFQUVkLFVBRmMsRUFFRixVQUZFLEVBR2QsUUFBQSxHQUFXLEtBQUMsQ0FBQSxRQUFELENBQVUsTUFBVixFQUFrQixJQUFsQixDQUhHLENBQWhCLEVBSUs7Y0FBQyxnQkFBQSxFQUFrQixJQUFuQjthQUpMLENBS0UsQ0FBQyxJQUxILENBS1EsU0FBQTtxQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7WUFESSxDQUxSLEVBVkY7O1FBM0JNO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUhSO0lBRFE7Ozs7S0FWMkI7QUFQdkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9iYmF0c292L3J1Ym9jb3BcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUnVib2NvcCBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJSdWJvY29wXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vYmJhdHNvdi9ydWJvY29wXCJcblxuICBvcHRpb25zOiB7XG4gICAgUnVieTpcbiAgICAgIGluZGVudF9zaXplOiB0cnVlXG4gICAgICBydWJvY29wX3BhdGg6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQFByb21pc2UuYWxsKFtcbiAgICAgIEB3aGljaChvcHRpb25zLnJ1Ym9jb3BfcGF0aCkgaWYgb3B0aW9ucy5ydWJvY29wX3BhdGhcbiAgICAgIEB3aGljaCgncnVib2NvcCcpXG4gICAgXSkudGhlbigocGF0aHMpID0+XG4gICAgICBAZGVidWcoJ3J1Ym9jb3AgcGF0aHMnLCBwYXRocylcbiAgICAgIF8gPSByZXF1aXJlICdsb2Rhc2gnXG4gICAgICBwYXRoID0gcmVxdWlyZSAncGF0aCdcbiAgICAgICMgR2V0IGZpcnN0IHZhbGlkLCBhYnNvbHV0ZSBwYXRoXG4gICAgICBydWJvY29wUGF0aCA9IF8uZmluZChwYXRocywgKHApIC0+IHAgYW5kIHBhdGguaXNBYnNvbHV0ZShwKSApXG4gICAgICBAdmVyYm9zZSgncnVib2NvcFBhdGgnLCBydWJvY29wUGF0aClcbiAgICAgIEBkZWJ1ZygncnVib2NvcFBhdGgnLCBydWJvY29wUGF0aCwgcGF0aHMpXG5cbiAgICAgIGNvbmZpZ0ZpbGUgPSBwYXRoLmpvaW4oYXRvbS5wcm9qZWN0LmdldFBhdGhzKClbMF0sIFwiLnJ1Ym9jb3AueW1sXCIpXG5cbiAgICAgIGZzID0gcmVxdWlyZSAnZnMnXG5cbiAgICAgIGlmIGZzLmV4aXN0c1N5bmMoY29uZmlnRmlsZSlcbiAgICAgICAgQGRlYnVnKFwicnVib2NvcFwiLCBjb25maWcsIGZzLnJlYWRGaWxlU3luYyhjb25maWdGaWxlLCAndXRmOCcpKVxuICAgICAgZWxzZVxuICAgICAgICB5YW1sID0gcmVxdWlyZShcInlhbWwtZnJvbnQtbWF0dGVyXCIpXG4gICAgICAgICMgR2VuZXJhdGUgY29uZmlnIGZpbGVcbiAgICAgICAgY29uZmlnID0ge1xuICAgICAgICAgIFwiU3R5bGUvSW5kZW50YXRpb25XaWR0aFwiOlxuICAgICAgICAgICAgXCJXaWR0aFwiOiBvcHRpb25zLmluZGVudF9zaXplXG4gICAgICAgIH1cblxuICAgICAgICBjb25maWdGaWxlID0gQHRlbXBGaWxlKFwicnVib2NvcC1jb25maWdcIiwgeWFtbC5zYWZlRHVtcChjb25maWcpKVxuICAgICAgICBAZGVidWcoXCJydWJvY29wXCIsIGNvbmZpZywgY29uZmlnRmlsZSlcblxuICAgICAgIyBDaGVjayBpZiBQSFAtQ1MtRml4ZXIgcGF0aCB3YXMgZm91bmRcbiAgICAgIGlmIHJ1Ym9jb3BQYXRoP1xuICAgICAgICBAcnVuKHJ1Ym9jb3BQYXRoLCBbXG4gICAgICAgICAgXCItLWF1dG8tY29ycmVjdFwiXG4gICAgICAgICAgXCItLWNvbmZpZ1wiLCBjb25maWdGaWxlXG4gICAgICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJ0ZW1wXCIsIHRleHQpXG4gICAgICAgICAgXSwge2lnbm9yZVJldHVybkNvZGU6IHRydWV9KVxuICAgICAgICAgIC50aGVuKD0+XG4gICAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgICAgKVxuICAgICAgZWxzZVxuICAgICAgICBAcnVuKFwicnVib2NvcFwiLCBbXG4gICAgICAgICAgXCItLWF1dG8tY29ycmVjdFwiXG4gICAgICAgICAgXCItLWNvbmZpZ1wiLCBjb25maWdGaWxlXG4gICAgICAgICAgdGVtcEZpbGUgPSBAdGVtcEZpbGUoXCJ0ZW1wXCIsIHRleHQpXG4gICAgICAgICAgXSwge2lnbm9yZVJldHVybkNvZGU6IHRydWV9KVxuICAgICAgICAgIC50aGVuKD0+XG4gICAgICAgICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgICAgICAgKVxuKVxuIl19
