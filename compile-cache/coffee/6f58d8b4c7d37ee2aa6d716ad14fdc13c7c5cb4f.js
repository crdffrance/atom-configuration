
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
      "Objective-C": false,
      "GLSL": true
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jbGFuZy1mb3JtYXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLGlDQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ1AsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUVMLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzBCQUVyQixJQUFBLEdBQU07OzBCQUNOLElBQUEsR0FBTTs7MEJBRU4sT0FBQSxHQUFTO01BQ1AsS0FBQSxFQUFPLEtBREE7TUFFUCxHQUFBLEVBQUssS0FGRTtNQUdQLGFBQUEsRUFBZSxLQUhSO01BSVAsTUFBQSxFQUFRLElBSkQ7Ozs7QUFPVDs7OzswQkFHQSxVQUFBLEdBQVksU0FBQyxJQUFELEVBQThCLFFBQTlCOztRQUFDLE9BQU87OztRQUFzQixXQUFXOztBQUNuRCxhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7aUJBQ2xCLEVBQUUsQ0FBQyxJQUFILENBQVEsSUFBUixFQUFjLEdBQWQsRUFBbUIsU0FBQyxHQUFELEVBQU0sRUFBTjtZQUNqQixLQUFDLENBQUEsS0FBRCxDQUFPLFlBQVAsRUFBcUIsSUFBckIsRUFBMkIsR0FBM0IsRUFBZ0MsRUFBaEM7WUFDQSxJQUFzQixHQUF0QjtBQUFBLHFCQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQVA7O21CQUNBLEVBQUUsQ0FBQyxLQUFILENBQVMsRUFBVCxFQUFhLFFBQWIsRUFBdUIsU0FBQyxHQUFEO2NBQ3JCLElBQXNCLEdBQXRCO0FBQUEsdUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7cUJBQ0EsRUFBRSxDQUFDLEtBQUgsQ0FBUyxFQUFULEVBQWEsU0FBQyxHQUFEO2dCQUNYLElBQXNCLEdBQXRCO0FBQUEseUJBQU8sTUFBQSxDQUFPLEdBQVAsRUFBUDs7dUJBQ0EsT0FBQSxDQUFRLElBQVI7Y0FGVyxDQUFiO1lBRnFCLENBQXZCO1VBSGlCLENBQW5CO1FBRGtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFUO0lBREQ7OzBCQWVaLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBYVIsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixZQUFBO1FBQUEsTUFBQSxzRkFBd0IsQ0FBRSxtQkFBakIsQ0FBQTtRQUNULElBQUcsY0FBSDtVQUNFLFFBQUEsR0FBVyxNQUFNLENBQUMsT0FBUCxDQUFBO1VBQ1gsT0FBQSxHQUFVLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYjtVQUNWLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBTCxDQUFjLFFBQWQ7VUFDWCxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLGlCQUFBLEdBQWtCLFFBQXJDO2lCQUNYLE9BQUEsQ0FBUSxRQUFSLEVBTEY7U0FBQSxNQUFBO2lCQU9FLE1BQUEsQ0FBVyxJQUFBLEtBQUEsQ0FBTSx5QkFBTixDQUFYLEVBUEY7O01BRmtCLENBQVQsQ0FXWCxDQUFDLElBWFUsQ0FXTCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsUUFBRDtBQUVKLGlCQUFPLEtBQUMsQ0FBQSxHQUFELENBQUssY0FBTCxFQUFxQixDQUMxQixLQUFDLENBQUEsVUFBRCxDQUFZLFFBQVosRUFBc0IsSUFBdEIsQ0FEMEIsRUFFMUIsQ0FBQyxjQUFELENBRjBCLENBQXJCLEVBR0Y7WUFBQSxJQUFBLEVBQU07Y0FDUCxJQUFBLEVBQU0sOENBREM7YUFBTjtXQUhFLENBS0gsRUFBQyxPQUFELEVBTEcsQ0FLTyxTQUFBO21CQUNWLEVBQUUsQ0FBQyxNQUFILENBQVUsUUFBVjtVQURVLENBTFA7UUFGSDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FYSztJQWJIOzs7O0tBOUIrQjtBQVQzQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgY2xhbmctZm9ybWF0IChodHRwczovL2NsYW5nLmxsdm0ub3JnKVxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKCdwYXRoJylcbmZzID0gcmVxdWlyZSgnZnMnKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIENsYW5nRm9ybWF0IGV4dGVuZHMgQmVhdXRpZmllclxuXG4gIG5hbWU6IFwiY2xhbmctZm9ybWF0XCJcbiAgbGluazogXCJodHRwczovL2NsYW5nLmxsdm0ub3JnL2RvY3MvQ2xhbmdGb3JtYXQuaHRtbFwiXG5cbiAgb3B0aW9uczoge1xuICAgIFwiQysrXCI6IGZhbHNlXG4gICAgXCJDXCI6IGZhbHNlXG4gICAgXCJPYmplY3RpdmUtQ1wiOiBmYWxzZVxuICAgIFwiR0xTTFwiOiB0cnVlXG4gIH1cblxuICAjIyNcbiAgICBEdW1wIGNvbnRlbnRzIHRvIGEgZ2l2ZW4gZmlsZVxuICAjIyNcbiAgZHVtcFRvRmlsZTogKG5hbWUgPSBcImF0b20tYmVhdXRpZnktZHVtcFwiLCBjb250ZW50cyA9IFwiXCIpIC0+XG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgZnMub3BlbihuYW1lLCBcIndcIiwgKGVyciwgZmQpID0+XG4gICAgICAgIEBkZWJ1ZygnZHVtcFRvRmlsZScsIG5hbWUsIGVyciwgZmQpXG4gICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgZnMud3JpdGUoZmQsIGNvbnRlbnRzLCAoZXJyKSAtPlxuICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgICBmcy5jbG9zZShmZCwgKGVycikgLT5cbiAgICAgICAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICAgICAgICAgIHJlc29sdmUobmFtZSlcbiAgICAgICAgICApXG4gICAgICAgIClcbiAgICAgIClcbiAgICApXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICAjIE5PVEU6IE9uZSBtYXkgd29uZGVyIHdoeSB0aGlzIGNvZGUgZ29lcyBhIGxvbmcgd2F5IHRvIGNvbnN0cnVjdCBhIGZpbGVcbiAgICAjIHBhdGggYW5kIGR1bXAgY29udGVudCB1c2luZyBhIGN1c3RvbSBgZHVtcFRvRmlsZWAuIFdvdWxkbid0IGl0IGJlIGVhc2llclxuICAgICMgdG8gdXNlIGBAdGVtcEZpbGVgIGluc3RlYWQ/IFRoZSByZWFzb24gaGVyZSBpcyB0byB3b3JrIGFyb3VuZCB0aGVcbiAgICAjIGNsYW5nLWZvcm1hdCBjb25maWcgZmlsZSBsb2NhdGluZyBtZWNoYW5pc20uIEFzIGluZGljYXRlZCBpbiB0aGUgbWFudWFsLFxuICAgICMgY2xhbmctZm9ybWF0ICh3aXRoIGAtLXN0eWxlIGZpbGVgKSB0cmllcyB0byBsb2NhdGUgYSBgLmNsYW5nLWZvcm1hdGBcbiAgICAjIGNvbmZpZyBmaWxlIGluIGRpcmVjdG9yeSBhbmQgcGFyZW50IGRpcmVjdG9yaWVzIG9mIHRoZSBpbnB1dCBmaWxlLFxuICAgICMgYW5kIHJldHJlYXQgdG8gZGVmYXVsdCBzdHlsZSBpZiBub3QgZm91bmQuIFByb2plY3RzIG9mdGVuIG1ha2VzIHVzZSBvZlxuICAgICMgdGhpcyBydWxlIHRvIGRlZmluZSB0aGVpciBvd24gc3R5bGUgaW4gaXRzIHRvcCBkaXJlY3RvcnkuIFVzZXJzIG9mdGVuXG4gICAgIyBwdXQgYSBgLmNsYW5nLWZvcm1hdGAgaW4gdGhlaXIgJEhPTUUgdG8gZGVmaW5lIGhpcy9oZXIgc3R5bGUuIFRvIGhvbm9yXG4gICAgIyB0aGlzIHJ1bGUsIHdlIEhBVkUgVE8gZ2VuZXJhdGUgdGhlIHRlbXAgZmlsZSBpbiBUSEUgU0FNRSBkaXJlY3RvcnkgYXNcbiAgICAjIHRoZSBlZGl0aW5nIGZpbGUuIEhvd2V2ZXIsIHRoaXMgbWVjaGFuaXNtIGlzIG5vdCBkaXJlY3RseSBzdXBwb3J0ZWQgYnlcbiAgICAjIGF0b20tYmVhdXRpZnkgYXQgdGhlIG1vbWVudC4gU28gd2UgaW50cm9kdWNlIGxvdHMgb2YgY29kZSBoZXJlLlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGVkaXRvciA9IGF0b20/LndvcmtzcGFjZT8uZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBpZiBlZGl0b3I/XG4gICAgICAgIGZ1bGxQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBjdXJyRGlyID0gcGF0aC5kaXJuYW1lKGZ1bGxQYXRoKVxuICAgICAgICBjdXJyRmlsZSA9IHBhdGguYmFzZW5hbWUoZnVsbFBhdGgpXG4gICAgICAgIGR1bXBGaWxlID0gcGF0aC5qb2luKGN1cnJEaXIsIFwiLmF0b20tYmVhdXRpZnkuI3tjdXJyRmlsZX1cIilcbiAgICAgICAgcmVzb2x2ZSBkdW1wRmlsZVxuICAgICAgZWxzZVxuICAgICAgICByZWplY3QobmV3IEVycm9yKFwiTm8gYWN0aXZlIGVkaXRvciBmb3VuZCFcIikpXG4gICAgKVxuICAgIC50aGVuKChkdW1wRmlsZSkgPT5cbiAgICAgICMgY29uc29sZS5sb2coXCJjbGFuZy1mb3JtYXRcIiwgZHVtcEZpbGUpXG4gICAgICByZXR1cm4gQHJ1bihcImNsYW5nLWZvcm1hdFwiLCBbXG4gICAgICAgIEBkdW1wVG9GaWxlKGR1bXBGaWxlLCB0ZXh0KVxuICAgICAgICBbXCItLXN0eWxlPWZpbGVcIl1cbiAgICAgICAgXSwgaGVscDoge1xuICAgICAgICAgIGxpbms6IFwiaHR0cHM6Ly9jbGFuZy5sbHZtLm9yZy9kb2NzL0NsYW5nRm9ybWF0Lmh0bWxcIlxuICAgICAgICB9KS5maW5hbGx5KCAtPlxuICAgICAgICAgIGZzLnVubGluayhkdW1wRmlsZSlcbiAgICAgICAgKVxuICAgIClcbiJdfQ==
