(function() {
  "use strict";
  var Beautifier, LatexBeautify, fs, path, temp,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  path = require('path');

  fs = require("fs");

  temp = require("temp").track();

  module.exports = LatexBeautify = (function(superClass) {
    extend(LatexBeautify, superClass);

    function LatexBeautify() {
      return LatexBeautify.__super__.constructor.apply(this, arguments);
    }

    LatexBeautify.prototype.name = "Latex Beautify";

    LatexBeautify.prototype.link = "https://github.com/cmhughes/latexindent.pl";

    LatexBeautify.prototype.options = {
      LaTeX: true
    };

    LatexBeautify.prototype.buildConfigFile = function(options) {
      var config, delim, i, indentChar, len, ref;
      indentChar = options.indent_char;
      if (options.indent_with_tabs) {
        indentChar = "\\t";
      }
      config = "defaultIndent: \"" + indentChar + "\"\nalwaysLookforSplitBraces: " + (+options.always_look_for_split_braces) + "\nalwaysLookforSplitBrackets: " + (+options.always_look_for_split_brackets) + "\nindentPreamble: " + (+options.indent_preamble) + "\nremoveTrailingWhitespace: " + (+options.remove_trailing_whitespace) + "\nlookForAlignDelims:\n";
      ref = options.align_columns_in_environments;
      for (i = 0, len = ref.length; i < len; i++) {
        delim = ref[i];
        config += "\t" + delim + ": 1\n";
      }
      return config;
    };

    LatexBeautify.prototype.setUpDir = function(dirPath, text, config) {
      this.texFile = path.join(dirPath, "latex.tex");
      fs.writeFile(this.texFile, text, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.configFile = path.join(dirPath, "localSettings.yaml");
      fs.writeFile(this.configFile, config, function(err) {
        if (err) {
          return reject(err);
        }
      });
      this.logFile = path.join(dirPath, "indent.log");
      return fs.writeFile(this.logFile, "", function(err) {
        if (err) {
          return reject(err);
        }
      });
    };

    LatexBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        return temp.mkdir("latex", function(err, dirPath) {
          if (err) {
            return reject(err);
          }
          return resolve(dirPath);
        });
      }).then((function(_this) {
        return function(dirPath) {
          var run;
          _this.setUpDir(dirPath, text, _this.buildConfigFile(options));
          return run = _this.run("latexindent", ["-o", "-s", "-l", "-c=" + dirPath, _this.texFile, _this.texFile], {
            help: {
              link: "https://github.com/cmhughes/latexindent.pl"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(_this.texFile);
        };
      })(this));
    };

    return LatexBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9sYXRleC1iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEseUNBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQWUsQ0FBQyxLQUFoQixDQUFBOztFQUdQLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7OzRCQUNyQixJQUFBLEdBQU07OzRCQUNOLElBQUEsR0FBTTs7NEJBRU4sT0FBQSxHQUFTO01BQ1AsS0FBQSxFQUFPLElBREE7Ozs0QkFNVCxlQUFBLEdBQWlCLFNBQUMsT0FBRDtBQUNmLFVBQUE7TUFBQSxVQUFBLEdBQWEsT0FBTyxDQUFDO01BQ3JCLElBQUcsT0FBTyxDQUFDLGdCQUFYO1FBQ0UsVUFBQSxHQUFhLE1BRGY7O01BR0EsTUFBQSxHQUFTLG1CQUFBLEdBQ21CLFVBRG5CLEdBQzhCLGdDQUQ5QixHQUUyQixDQUFDLENBQUMsT0FBTyxDQUFDLDRCQUFWLENBRjNCLEdBRWtFLGdDQUZsRSxHQUc2QixDQUFDLENBQUMsT0FBTyxDQUFDLDhCQUFWLENBSDdCLEdBR3NFLG9CQUh0RSxHQUlpQixDQUFDLENBQUMsT0FBTyxDQUFDLGVBQVYsQ0FKakIsR0FJMkMsOEJBSjNDLEdBSzJCLENBQUMsQ0FBQyxPQUFPLENBQUMsMEJBQVYsQ0FMM0IsR0FLZ0U7QUFHekU7QUFBQSxXQUFBLHFDQUFBOztRQUNFLE1BQUEsSUFBVSxJQUFBLEdBQUssS0FBTCxHQUFXO0FBRHZCO0FBRUEsYUFBTztJQWZROzs0QkFxQmpCLFFBQUEsR0FBVSxTQUFDLE9BQUQsRUFBVSxJQUFWLEVBQWdCLE1BQWhCO01BQ1IsSUFBQyxDQUFBLE9BQUQsR0FBVyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsV0FBbkI7TUFDWCxFQUFFLENBQUMsU0FBSCxDQUFhLElBQUMsQ0FBQSxPQUFkLEVBQXVCLElBQXZCLEVBQTZCLFNBQUMsR0FBRDtRQUMzQixJQUFzQixHQUF0QjtBQUFBLGlCQUFPLE1BQUEsQ0FBTyxHQUFQLEVBQVA7O01BRDJCLENBQTdCO01BRUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxJQUFJLENBQUMsSUFBTCxDQUFVLE9BQVYsRUFBbUIsb0JBQW5CO01BQ2QsRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFDLENBQUEsVUFBZCxFQUEwQixNQUExQixFQUFrQyxTQUFDLEdBQUQ7UUFDaEMsSUFBc0IsR0FBdEI7QUFBQSxpQkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOztNQURnQyxDQUFsQztNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxPQUFWLEVBQW1CLFlBQW5CO2FBQ1gsRUFBRSxDQUFDLFNBQUgsQ0FBYSxJQUFDLENBQUEsT0FBZCxFQUF1QixFQUF2QixFQUEyQixTQUFDLEdBQUQ7UUFDekIsSUFBc0IsR0FBdEI7QUFBQSxpQkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOztNQUR5QixDQUEzQjtJQVJROzs0QkFZVixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjthQUNKLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWO2VBQ1gsSUFBSSxDQUFDLEtBQUwsQ0FBVyxPQUFYLEVBQW9CLFNBQUMsR0FBRCxFQUFNLE9BQU47VUFDbEIsSUFBc0IsR0FBdEI7QUFBQSxtQkFBTyxNQUFBLENBQU8sR0FBUCxFQUFQOztpQkFDQSxPQUFBLENBQVEsT0FBUjtRQUZrQixDQUFwQjtNQURXLENBQVQsQ0FNSixDQUFDLElBTkcsQ0FNRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtBQUNKLGNBQUE7VUFBQSxLQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsRUFBeUIsS0FBQyxDQUFBLGVBQUQsQ0FBaUIsT0FBakIsQ0FBekI7aUJBQ0EsR0FBQSxHQUFNLEtBQUMsQ0FBQSxHQUFELENBQUssYUFBTCxFQUFvQixDQUN4QixJQUR3QixFQUV4QixJQUZ3QixFQUd4QixJQUh3QixFQUl4QixLQUFBLEdBQVEsT0FKZ0IsRUFLeEIsS0FBQyxDQUFBLE9BTHVCLEVBTXhCLEtBQUMsQ0FBQSxPQU51QixDQUFwQixFQU9IO1lBQUEsSUFBQSxFQUFNO2NBQ1AsSUFBQSxFQUFNLDRDQURDO2FBQU47V0FQRztRQUZGO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQU5GLENBbUJKLENBQUMsSUFuQkcsQ0FtQkcsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNMLEtBQUMsQ0FBQSxRQUFELENBQVUsS0FBQyxDQUFBLE9BQVg7UUFESztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FuQkg7SUFESTs7OztLQTNDaUM7QUFQN0MiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5wYXRoID0gcmVxdWlyZSgncGF0aCcpXG5mcyA9IHJlcXVpcmUoXCJmc1wiKVxudGVtcCA9IHJlcXVpcmUoXCJ0ZW1wXCIpLnRyYWNrKClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIExhdGV4QmVhdXRpZnkgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiTGF0ZXggQmVhdXRpZnlcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9jbWh1Z2hlcy9sYXRleGluZGVudC5wbFwiXG5cbiAgb3B0aW9uczoge1xuICAgIExhVGVYOiB0cnVlXG4gIH1cblxuICAjIFRoZXJlIGFyZSB0b28gbWFueSBvcHRpb25zIHdpdGggbGF0ZXhtaywgSSBoYXZlIHRyaWVkIHRvIHNsaW0gdGhpcyBkb3duIHRvIHRoZSBtb3N0IHVzZWZ1bCBvbmVzLlxuICAjIFRoaXMgbWV0aG9kIGNyZWF0ZXMgYSBjb25maWd1cmF0aW9uIGZpbGUgZm9yIGxhdGV4aW5kZW50LlxuICBidWlsZENvbmZpZ0ZpbGU6IChvcHRpb25zKSAtPlxuICAgIGluZGVudENoYXIgPSBvcHRpb25zLmluZGVudF9jaGFyXG4gICAgaWYgb3B0aW9ucy5pbmRlbnRfd2l0aF90YWJzXG4gICAgICBpbmRlbnRDaGFyID0gXCJcXFxcdFwiXG4gICAgIyArdHJ1ZSA9IDEgYW5kICtmYWxzZSA9IDBcbiAgICBjb25maWcgPSBcIlwiXCJcbiAgICAgICAgICAgICBkZWZhdWx0SW5kZW50OiBcXFwiI3tpbmRlbnRDaGFyfVxcXCJcbiAgICAgICAgICAgICBhbHdheXNMb29rZm9yU3BsaXRCcmFjZXM6ICN7K29wdGlvbnMuYWx3YXlzX2xvb2tfZm9yX3NwbGl0X2JyYWNlc31cbiAgICAgICAgICAgICBhbHdheXNMb29rZm9yU3BsaXRCcmFja2V0czogI3srb3B0aW9ucy5hbHdheXNfbG9va19mb3Jfc3BsaXRfYnJhY2tldHN9XG4gICAgICAgICAgICAgaW5kZW50UHJlYW1ibGU6ICN7K29wdGlvbnMuaW5kZW50X3ByZWFtYmxlfVxuICAgICAgICAgICAgIHJlbW92ZVRyYWlsaW5nV2hpdGVzcGFjZTogI3srb3B0aW9ucy5yZW1vdmVfdHJhaWxpbmdfd2hpdGVzcGFjZX1cbiAgICAgICAgICAgICBsb29rRm9yQWxpZ25EZWxpbXM6XFxuXG4gICAgICAgICAgICAgXCJcIlwiXG4gICAgZm9yIGRlbGltIGluIG9wdGlvbnMuYWxpZ25fY29sdW1uc19pbl9lbnZpcm9ubWVudHNcbiAgICAgIGNvbmZpZyArPSBcIlxcdCN7ZGVsaW19OiAxXFxuXCJcbiAgICByZXR1cm4gY29uZmlnXG5cbiAgIyBMYXRleGluZGVudCBhY2NlcHRzIGNvbmZpZ3VyYXRpb24gX2ZpbGVzXyBvbmx5LlxuICAjIFRoaXMgZmlsZSBoYXMgdG8gYmUgbmFtZWQgbG9jYWxTZXR0aW5ncy55YW1sIGFuZCBiZSBpbiB0aGUgc2FtZSBmb2xkZXIgYXMgdGhlIHRleCBmaWxlLlxuICAjIEl0IGFsc28gaW5zaXN0cyBvbiBjcmVhdGluZyBhIGxvZyBmaWxlIHNvbWV3aGVyZS5cbiAgIyBTbyB3ZSBzZXQgdXAgYSBkaXJlY3Rvcnkgd2l0aCBhbGwgdGhlIGZpbGVzIGluIHBsYWNlLlxuICBzZXRVcERpcjogKGRpclBhdGgsIHRleHQsIGNvbmZpZykgLT5cbiAgICBAdGV4RmlsZSA9IHBhdGguam9pbihkaXJQYXRoLCBcImxhdGV4LnRleFwiKVxuICAgIGZzLndyaXRlRmlsZSBAdGV4RmlsZSwgdGV4dCwgKGVycikgLT5cbiAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcbiAgICBAY29uZmlnRmlsZSA9IHBhdGguam9pbihkaXJQYXRoLCBcImxvY2FsU2V0dGluZ3MueWFtbFwiKVxuICAgIGZzLndyaXRlRmlsZSBAY29uZmlnRmlsZSwgY29uZmlnLCAoZXJyKSAtPlxuICAgICAgcmV0dXJuIHJlamVjdChlcnIpIGlmIGVyclxuICAgIEBsb2dGaWxlID0gcGF0aC5qb2luKGRpclBhdGgsIFwiaW5kZW50LmxvZ1wiKVxuICAgIGZzLndyaXRlRmlsZSBAbG9nRmlsZSwgXCJcIiwgKGVycikgLT5cbiAgICAgIHJldHVybiByZWplY3QoZXJyKSBpZiBlcnJcblxuICAjQmVhdXRpZmllciBkb2VzIG5vdCBjdXJyZW50bHkgaGF2ZSBhIG1ldGhvZCBmb3IgY3JlYXRpbmcgZGlyZWN0b3JpZXMsIHNvIHdlIGNhbGwgdGVtcCBkaXJlY3RseS5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIHRlbXAubWtkaXIoXCJsYXRleFwiLCAoZXJyLCBkaXJQYXRoKSAtPlxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycikgaWYgZXJyXG4gICAgICAgIHJlc29sdmUoZGlyUGF0aClcbiAgICAgIClcbiAgICApXG4gICAgLnRoZW4oKGRpclBhdGgpPT5cbiAgICAgIEBzZXRVcERpcihkaXJQYXRoLCB0ZXh0LCBAYnVpbGRDb25maWdGaWxlKG9wdGlvbnMpKVxuICAgICAgcnVuID0gQHJ1biBcImxhdGV4aW5kZW50XCIsIFtcbiAgICAgICAgXCItb1wiICAgICAgICAgICAgI091dHB1dCB0byB0aGUgc2FtZSBsb2NhdGlvbiBhcyBmaWxlLCAtdyBjcmVhdGVzIGEgYmFja3VwIGZpbGUsIHdoZXJlYXMgdGhpcyBkb2VzIG5vdFxuICAgICAgICBcIi1zXCIgICAgICAgICAgICAjU2lsZW50IG1vZGVcbiAgICAgICAgXCItbFwiICAgICAgICAgICAgI1RlbGwgbGF0ZXhpbmRlbnQgd2UgaGF2ZSBhIGxvY2FsIGNvbmZpZ3VyYXRpb24gZmlsZVxuICAgICAgICBcIi1jPVwiICsgZGlyUGF0aCAjVGVsbCBsYXRleGluZGVudCB0byBwbGFjZSB0aGUgbG9nIGZpbGUgaW4gdGhpcyBkaXJlY3RvcnlcbiAgICAgICAgQHRleEZpbGVcbiAgICAgICAgQHRleEZpbGVcbiAgICAgIF0sIGhlbHA6IHtcbiAgICAgICAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vY21odWdoZXMvbGF0ZXhpbmRlbnQucGxcIlxuICAgICAgfVxuICAgIClcbiAgICAudGhlbiggPT5cbiAgICAgIEByZWFkRmlsZShAdGV4RmlsZSlcbiAgICApXG4iXX0=
