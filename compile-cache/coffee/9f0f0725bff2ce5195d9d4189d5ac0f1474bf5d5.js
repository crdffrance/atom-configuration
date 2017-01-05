
/*
Requires clang-format (https://clang.llvm.org)
 */

(function() {
  "use strict";
  var Beautifier, ClangFormat, fs, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require('fs');

  module.exports = ClangFormat = (function(superClass) {
    extend(ClangFormat, superClass);

    function ClangFormat() {
      return ClangFormat.__super__.constructor.apply(this, arguments);
    }

    ClangFormat.prototype.name = "clang-format";

    ClangFormat.prototype.link = "https://clang.llvm.org/docs/ClangFormat.html";

    ClangFormat.prototype.options = {
      "C++": false,
      "C": false,
      "Objective-C": false
    };


    /*
      Dump contents to a given file
     */

    ClangFormat.prototype.dumpToFile = function(name, contents) {
      if (name == null) {
        name = "atom-beautify-dump";
      }
      if (contents == null) {
        contents = "";
      }
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          return fs.open(name, "w", function(err, fd) {
            _this.debug('dumpToFile', name, err, fd);
            if (err) {
              return reject(err);
            }
            return fs.write(fd, contents, function(err) {
              if (err) {
                return reject(err);
              }
              return fs.close(fd, function(err) {
                if (err) {
                  return reject(err);
                }
                return resolve(name);
              });
            });
          });
        };
      })(this));
    };

    ClangFormat.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var currDir, currFile, dumpFile, editor, fullPath, ref;
        editor = typeof atom !== "undefined" && atom !== null ? (ref = atom.workspace) != null ? ref.getActiveTextEditor() : void 0 : void 0;
        if (editor != null) {
          fullPath = editor.getPath();
          currDir = path.dirname(fullPath);
          currFile = path.basename(fullPath);
          dumpFile = path.join(currDir, ".atom-beautify." + currFile);
          return resolve(dumpFile);
        } else {
          return reject(new Error("No active editor found!"));
        }
      }).then((function(_this) {
        return function(dumpFile) {
          return _this.run("clang-format", [_this.dumpToFile(dumpFile, text), ["--style=file"]], {
            help: {
              link: "https://clang.llvm.org/docs/ClangFormat.html"
            }
          })["finally"](function() {
            return fs.unlink(dumpFile);
          });
        };
      })(this));
    };

    return ClangFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jbGFuZy1mb3JtYXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLGlDQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzBCQUVyQixJQUFBLEdBQU07OzBCQUNOLElBQUEsR0FBTTs7MEJBRU4sT0FBQSxHQUFTO01BQ1AsS0FBQSxFQUFPLEtBREE7TUFFUCxHQUFBLEVBQUssS0FGRTtNQUdQLGFBQUEsRUFBZSxLQUhSOzs7O0FBTVQ7Ozs7MEJBR0EsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUE4QixRQUE5Qjs7UUFBQyxPQUFPOzs7UUFBc0IsV0FBVzs7QUFDbkQsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO2lCQUNsQixFQUFFLENBQUMsSUFBSCxDQUFRLElBQVIsRUFBYyxHQUFkLEVBQW1CLFNBQUMsR0FBRCxFQUFNLEVBQU47WUFDakIsS0FBQyxDQUFBLEtBQUQsQ0FBTyxZQUFQLEVBQXFCLElBQXJCLEVBQTJCLEdBQTNCLEVBQWdDLEVBQWhDO1lBQ0EsSUFBc0IsR0FBdEI7QUFBQSxxQkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOzttQkFDQSxFQUFFLENBQUMsS0FBSCxDQUFTLEVBQVQsRUFBYSxRQUFiLEVBQXVCLFNBQUMsR0FBRDtjQUNyQixJQUFzQixHQUF0QjtBQUFBLHVCQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQVA7O3FCQUNBLEVBQUUsQ0FBQyxLQUFILENBQVMsRUFBVCxFQUFhLFNBQUMsR0FBRDtnQkFDWCxJQUFzQixHQUF0QjtBQUFBLHlCQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQVA7O3VCQUNBLE9BQUEsQ0FBUSxJQUFSO2NBRlcsQ0FBYjtZQUZxQixDQUF2QjtVQUhpQixDQUFuQjtRQURrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDtJQUREOzswQkFlWixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQWFSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsWUFBQTtRQUFBLE1BQUEsc0ZBQXdCLENBQUUsbUJBQWpCLENBQUE7UUFDVCxJQUFHLGNBQUg7VUFDRSxRQUFBLEdBQVcsTUFBTSxDQUFDLE9BQVAsQ0FBQTtVQUNYLE9BQUEsR0FBVSxJQUFJLENBQUMsT0FBTCxDQUFhLFFBQWI7VUFDVixRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsQ0FBYyxRQUFkO1VBQ1gsUUFBQSxHQUFXLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFtQixpQkFBQSxHQUFrQixRQUFyQztpQkFDWCxPQUFBLENBQVEsUUFBUixFQUxGO1NBQUEsTUFBQTtpQkFPRSxNQUFBLENBQVcsSUFBQSxLQUFBLENBQU0seUJBQU4sQ0FBWCxFQVBGOztNQUZrQixDQUFULENBV1gsQ0FBQyxJQVhVLENBV0wsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLFFBQUQ7QUFFSixpQkFBTyxLQUFDLENBQUEsR0FBRCxDQUFLLGNBQUwsRUFBcUIsQ0FDMUIsS0FBQyxDQUFBLFVBQUQsQ0FBWSxRQUFaLEVBQXNCLElBQXRCLENBRDBCLEVBRTFCLENBQUMsY0FBRCxDQUYwQixDQUFyQixFQUdGO1lBQUEsSUFBQSxFQUFNO2NBQ1AsSUFBQSxFQUFNLDhDQURDO2FBQU47V0FIRSxDQUtILEVBQUMsT0FBRCxFQUxHLENBS08sU0FBQTttQkFDVixFQUFFLENBQUMsTUFBSCxDQUFVLFFBQVY7VUFEVSxDQUxQO1FBRkg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBWEs7SUFiSDs7OztLQTdCK0I7QUFUM0MiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGNsYW5nLWZvcm1hdCAoaHR0cHM6Ly9jbGFuZy5sbHZtLm9yZylcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5mcyA9IHJlcXVpcmUoJ2ZzJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBDbGFuZ0Zvcm1hdCBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiBcImNsYW5nLWZvcm1hdFwiXG4gIGxpbms6IFwiaHR0cHM6Ly9jbGFuZy5sbHZtLm9yZy9kb2NzL0NsYW5nRm9ybWF0Lmh0bWxcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBcIkMrK1wiOiBmYWxzZVxuICAgIFwiQ1wiOiBmYWxzZVxuICAgIFwiT2JqZWN0aXZlLUNcIjogZmFsc2VcbiAgfVxuXG4gICMjI1xuICAgIER1bXAgY29udGVudHMgdG8gYSBnaXZlbiBmaWxlXG4gICMjI1xuICBkdW1wVG9GaWxlOiAobmFtZSA9IFwiYXRvbS1iZWF1dGlmeS1kdW1wXCIsIGNvbnRlbnRzID0gXCJcIikgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBmcy5vcGVuKG5hbWUsIFwid1wiLCAoZXJyLCBmZCkgPT5cbiAgICAgICAgQGRlYnVnKCdkdW1wVG9GaWxlJywgbmFtZSwgZXJyLCBmZClcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgICAgICBmcy53cml0ZShmZCwgY29udGVudHMsIChlcnIpIC0+XG4gICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgICAgICAgIGZzLmNsb3NlKGZkLCAoZXJyKSAtPlxuICAgICAgICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgICAgICAgICAgcmVzb2x2ZShuYW1lKVxuICAgICAgICAgIClcbiAgICAgICAgKVxuICAgICAgKVxuICAgIClcblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgICMgTk9URTogT25lIG1heSB3b25kZXIgd2h5IHRoaXMgY29kZSBnb2VzIGEgbG9uZyB3YXkgdG8gY29uc3RydWN0IGEgZmlsZVxuICAgICMgcGF0aCBhbmQgZHVtcCBjb250ZW50IHVzaW5nIGEgY3VzdG9tIGBkdW1wVG9GaWxlYC4gV291bGRuJ3QgaXQgYmUgZWFzaWVyXG4gICAgIyB0byB1c2UgYEB0ZW1wRmlsZWAgaW5zdGVhZD8gVGhlIHJlYXNvbiBoZXJlIGlzIHRvIHdvcmsgYXJvdW5kIHRoZVxuICAgICMgY2xhbmctZm9ybWF0IGNvbmZpZyBmaWxlIGxvY2F0aW5nIG1lY2hhbmlzbS4gQXMgaW5kaWNhdGVkIGluIHRoZSBtYW51YWwsXG4gICAgIyBjbGFuZy1mb3JtYXQgKHdpdGggYC0tc3R5bGUgZmlsZWApIHRyaWVzIHRvIGxvY2F0ZSBhIGAuY2xhbmctZm9ybWF0YFxuICAgICMgY29uZmlnIGZpbGUgaW4gZGlyZWN0b3J5IGFuZCBwYXJlbnQgZGlyZWN0b3JpZXMgb2YgdGhlIGlucHV0IGZpbGUsXG4gICAgIyBhbmQgcmV0cmVhdCB0byBkZWZhdWx0IHN0eWxlIGlmIG5vdCBmb3VuZC4gUHJvamVjdHMgb2Z0ZW4gbWFrZXMgdXNlIG9mXG4gICAgIyB0aGlzIHJ1bGUgdG8gZGVmaW5lIHRoZWlyIG93biBzdHlsZSBpbiBpdHMgdG9wIGRpcmVjdG9yeS4gVXNlcnMgb2Z0ZW5cbiAgICAjIHB1dCBhIGAuY2xhbmctZm9ybWF0YCBpbiB0aGVpciAkSE9NRSB0byBkZWZpbmUgaGlzL2hlciBzdHlsZS4gVG8gaG9ub3JcbiAgICAjIHRoaXMgcnVsZSwgd2UgSEFWRSBUTyBnZW5lcmF0ZSB0aGUgdGVtcCBmaWxlIGluIFRIRSBTQU1FIGRpcmVjdG9yeSBhc1xuICAgICMgdGhlIGVkaXRpbmcgZmlsZS4gSG93ZXZlciwgdGhpcyBtZWNoYW5pc20gaXMgbm90IGRpcmVjdGx5IHN1cHBvcnRlZCBieVxuICAgICMgYXRvbS1iZWF1dGlmeSBhdCB0aGUgbW9tZW50LiBTbyB3ZSBpbnRyb2R1Y2UgbG90cyBvZiBjb2RlIGhlcmUuXG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgZWRpdG9yID0gYXRvbT8ud29ya3NwYWNlPy5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGlmIGVkaXRvcj9cbiAgICAgICAgZnVsbFBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgIGN1cnJEaXIgPSBwYXRoLmRpcm5hbWUoZnVsbFBhdGgpXG4gICAgICAgIGN1cnJGaWxlID0gcGF0aC5iYXNlbmFtZShmdWxsUGF0aClcbiAgICAgICAgZHVtcEZpbGUgPSBwYXRoLmpvaW4oY3VyckRpciwgXCIuYXRvbS1iZWF1dGlmeS4je2N1cnJGaWxlfVwiKVxuICAgICAgICByZXNvbHZlIGR1bXBGaWxlXG4gICAgICBlbHNlXG4gICAgICAgIHJlamVjdChuZXcgRXJyb3IoXCJObyBhY3RpdmUgZWRpdG9yIGZvdW5kIVwiKSlcbiAgICApXG4gICAgLnRoZW4oKGR1bXBGaWxlKSA9PlxuICAgICAgIyBjb25zb2xlLmxvZyhcImNsYW5nLWZvcm1hdFwiLCBkdW1wRmlsZSlcbiAgICAgIHJldHVybiBAcnVuKFwiY2xhbmctZm9ybWF0XCIsIFtcbiAgICAgICAgQGR1bXBUb0ZpbGUoZHVtcEZpbGUsIHRleHQpXG4gICAgICAgIFtcIi0tc3R5bGU9ZmlsZVwiXVxuICAgICAgICBdLCBoZWxwOiB7XG4gICAgICAgICAgbGluazogXCJodHRwczovL2NsYW5nLmxsdm0ub3JnL2RvY3MvQ2xhbmdGb3JtYXQuaHRtbFwiXG4gICAgICAgIH0pLmZpbmFsbHkoIC0+XG4gICAgICAgICAgZnMudW5saW5rKGR1bXBGaWxlKVxuICAgICAgICApXG4gICAgKVxuIl19
