(function() {
  "use strict";
  var Beautifier, JSBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(superClass) {
    var getDefaultLineEnding;

    extend(JSBeautify, superClass);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "JS Beautify";

    JSBeautify.prototype.link = "https://github.com/beautify-web/js-beautify";

    JSBeautify.prototype.options = {
      HTML: true,
      XML: true,
      Handlebars: true,
      Mustache: true,
      JavaScript: true,
      JSON: true,
      CSS: {
        indent_size: true,
        indent_char: true,
        selector_separator_newline: true,
        newline_between_rules: true,
        preserve_newlines: true,
        wrap_line_length: true,
        end_with_newline: true
      }
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      var ref;
      this.verbose("JS Beautify language " + language);
      this.info("JS Beautify Options: " + (JSON.stringify(options, null, 4)));
      options.eol = (ref = getDefaultLineEnding()) != null ? ref : options.eol;
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var beautifyCSS, beautifyHTML, beautifyJS, err;
          try {
            switch (language) {
              case "JSON":
              case "JavaScript":
                beautifyJS = require("js-beautify");
                text = beautifyJS(text, options);
                return resolve(text);
              case "Handlebars":
              case "Mustache":
                options.indent_handlebars = true;
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                return resolve(text);
              case "HTML (Liquid)":
              case "HTML":
              case "XML":
              case "Web Form/Control (C#)":
              case "Web Handler (C#)":
                beautifyHTML = require("js-beautify").html;
                text = beautifyHTML(text, options);
                _this.debug("Beautified HTML: " + text);
                return resolve(text);
              case "CSS":
                beautifyCSS = require("js-beautify").css;
                text = beautifyCSS(text, options);
                return resolve(text);
            }
          } catch (error) {
            err = error;
            _this.error("JS Beautify error: " + err);
            return reject(err);
          }
        };
      })(this));
    };

    getDefaultLineEnding = function() {
      switch (atom.config.get('line-ending-selector.defaultLineEnding')) {
        case 'LF':
          return '\n';
        case 'CRLF':
          return '\r\n';
        case 'OS Default':
          if (process.platform === 'win32') {
            return '\r\n';
          } else {
            return '\n';
          }
        default:
          return null;
      }
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9qcy1iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLFFBQUE7Ozs7Ozs7O3lCQUFBLElBQUEsR0FBTTs7eUJBQ04sSUFBQSxHQUFNOzt5QkFFTixPQUFBLEdBQVM7TUFDUCxJQUFBLEVBQU0sSUFEQztNQUVQLEdBQUEsRUFBSyxJQUZFO01BR1AsVUFBQSxFQUFZLElBSEw7TUFJUCxRQUFBLEVBQVUsSUFKSDtNQUtQLFVBQUEsRUFBWSxJQUxMO01BTVAsSUFBQSxFQUFNLElBTkM7TUFPUCxHQUFBLEVBQ0U7UUFBQSxXQUFBLEVBQWEsSUFBYjtRQUNBLFdBQUEsRUFBYSxJQURiO1FBRUEsMEJBQUEsRUFBNEIsSUFGNUI7UUFHQSxxQkFBQSxFQUF1QixJQUh2QjtRQUlBLGlCQUFBLEVBQW1CLElBSm5CO1FBS0EsZ0JBQUEsRUFBa0IsSUFMbEI7UUFNQSxnQkFBQSxFQUFrQixJQU5sQjtPQVJLOzs7eUJBaUJULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsdUJBQUEsR0FBd0IsUUFBakM7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLHVCQUFBLEdBQXVCLENBQUMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFmLEVBQXdCLElBQXhCLEVBQThCLENBQTlCLENBQUQsQ0FBN0I7TUFHQSxPQUFPLENBQUMsR0FBUixrREFBdUMsT0FBTyxDQUFDO0FBQy9DLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixjQUFBO0FBQUE7QUFDRSxvQkFBTyxRQUFQO0FBQUEsbUJBQ08sTUFEUDtBQUFBLG1CQUNlLFlBRGY7Z0JBRUksVUFBQSxHQUFhLE9BQUEsQ0FBUSxhQUFSO2dCQUNiLElBQUEsR0FBTyxVQUFBLENBQVcsSUFBWCxFQUFpQixPQUFqQjt1QkFDUCxPQUFBLENBQVEsSUFBUjtBQUpKLG1CQUtPLFlBTFA7QUFBQSxtQkFLcUIsVUFMckI7Z0JBT0ksT0FBTyxDQUFDLGlCQUFSLEdBQTRCO2dCQUU1QixZQUFBLEdBQWUsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQztnQkFDdEMsSUFBQSxHQUFPLFlBQUEsQ0FBYSxJQUFiLEVBQW1CLE9BQW5CO3VCQUNQLE9BQUEsQ0FBUSxJQUFSO0FBWEosbUJBWU8sZUFaUDtBQUFBLG1CQVl3QixNQVp4QjtBQUFBLG1CQVlnQyxLQVpoQztBQUFBLG1CQVl1Qyx1QkFadkM7QUFBQSxtQkFZZ0Usa0JBWmhFO2dCQWFJLFlBQUEsR0FBZSxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDO2dCQUN0QyxJQUFBLEdBQU8sWUFBQSxDQUFhLElBQWIsRUFBbUIsT0FBbkI7Z0JBQ1AsS0FBQyxDQUFBLEtBQUQsQ0FBTyxtQkFBQSxHQUFvQixJQUEzQjt1QkFDQSxPQUFBLENBQVEsSUFBUjtBQWhCSixtQkFpQk8sS0FqQlA7Z0JBa0JJLFdBQUEsR0FBYyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDO2dCQUNyQyxJQUFBLEdBQU8sV0FBQSxDQUFZLElBQVosRUFBa0IsT0FBbEI7dUJBQ1AsT0FBQSxDQUFRLElBQVI7QUFwQkosYUFERjtXQUFBLGFBQUE7WUFzQk07WUFDSixLQUFDLENBQUEsS0FBRCxDQUFPLHFCQUFBLEdBQXNCLEdBQTdCO21CQUNBLE1BQUEsQ0FBTyxHQUFQLEVBeEJGOztRQURrQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVDtJQU5IOztJQTRDVixvQkFBQSxHQUFzQixTQUFBO0FBQ3BCLGNBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixDQUFQO0FBQUEsYUFDTyxJQURQO0FBRUksaUJBQU87QUFGWCxhQUdPLE1BSFA7QUFJSSxpQkFBTztBQUpYLGFBS08sWUFMUDtVQU1XLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkI7bUJBQW9DLE9BQXBDO1dBQUEsTUFBQTttQkFBZ0QsS0FBaEQ7O0FBTlg7QUFRSSxpQkFBTztBQVJYO0lBRG9COzs7O0tBakVrQjtBQUgxQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBKU0JlYXV0aWZ5IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkpTIEJlYXV0aWZ5XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vYmVhdXRpZnktd2ViL2pzLWJlYXV0aWZ5XCJcblxuICBvcHRpb25zOiB7XG4gICAgSFRNTDogdHJ1ZVxuICAgIFhNTDogdHJ1ZVxuICAgIEhhbmRsZWJhcnM6IHRydWVcbiAgICBNdXN0YWNoZTogdHJ1ZVxuICAgIEphdmFTY3JpcHQ6IHRydWVcbiAgICBKU09OOiB0cnVlXG4gICAgQ1NTOlxuICAgICAgaW5kZW50X3NpemU6IHRydWVcbiAgICAgIGluZGVudF9jaGFyOiB0cnVlXG4gICAgICBzZWxlY3Rvcl9zZXBhcmF0b3JfbmV3bGluZTogdHJ1ZVxuICAgICAgbmV3bGluZV9iZXR3ZWVuX3J1bGVzOiB0cnVlXG4gICAgICBwcmVzZXJ2ZV9uZXdsaW5lczogdHJ1ZVxuICAgICAgd3JhcF9saW5lX2xlbmd0aDogdHJ1ZVxuICAgICAgZW5kX3dpdGhfbmV3bGluZTogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAdmVyYm9zZShcIkpTIEJlYXV0aWZ5IGxhbmd1YWdlICN7bGFuZ3VhZ2V9XCIpXG4gICAgQGluZm8oXCJKUyBCZWF1dGlmeSBPcHRpb25zOiAje0pTT04uc3RyaW5naWZ5KG9wdGlvbnMsIG51bGwsIDQpfVwiKVxuICAgICNUT0RPIHJlY29uc2lkZXIgaGFuZGxpbmcgb2YgRU9MIG9uY2UganMtYmVhdXRpZnkgYWRkcyBFT0wgZGV0ZWN0aW9uXG4gICAgI3NlZSBodHRwczovL2dpdGh1Yi5jb20vYmVhdXRpZnktd2ViL2pzLWJlYXV0aWZ5L2lzc3Vlcy84OTlcbiAgICBvcHRpb25zLmVvbCA9IGdldERlZmF1bHRMaW5lRW5kaW5nKCkgPyBvcHRpb25zLmVvbCAjZml4ZXMgaXNzdWUgIzcwN1xuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIHRyeVxuICAgICAgICBzd2l0Y2ggbGFuZ3VhZ2VcbiAgICAgICAgICB3aGVuIFwiSlNPTlwiLCBcIkphdmFTY3JpcHRcIlxuICAgICAgICAgICAgYmVhdXRpZnlKUyA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKVxuICAgICAgICAgICAgdGV4dCA9IGJlYXV0aWZ5SlModGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIHdoZW4gXCJIYW5kbGViYXJzXCIsIFwiTXVzdGFjaGVcIlxuICAgICAgICAgICAgIyBqc2hpbnQgaWdub3JlOiBzdGFydFxuICAgICAgICAgICAgb3B0aW9ucy5pbmRlbnRfaGFuZGxlYmFycyA9IHRydWUgIyBGb3JjZSBqc2JlYXV0aWZ5IHRvIGluZGVudF9oYW5kbGViYXJzXG4gICAgICAgICAgICAjIGpzaGludCBpZ25vcmU6IGVuZFxuICAgICAgICAgICAgYmVhdXRpZnlIVE1MID0gcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpLmh0bWxcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUhUTUwodGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIHdoZW4gXCJIVE1MIChMaXF1aWQpXCIsIFwiSFRNTFwiLCBcIlhNTFwiLCBcIldlYiBGb3JtL0NvbnRyb2wgKEMjKVwiLCBcIldlYiBIYW5kbGVyIChDIylcIlxuICAgICAgICAgICAgYmVhdXRpZnlIVE1MID0gcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpLmh0bWxcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUhUTUwodGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIEBkZWJ1ZyhcIkJlYXV0aWZpZWQgSFRNTDogI3t0ZXh0fVwiKVxuICAgICAgICAgICAgcmVzb2x2ZSB0ZXh0XG4gICAgICAgICAgd2hlbiBcIkNTU1wiXG4gICAgICAgICAgICBiZWF1dGlmeUNTUyA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5jc3NcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUNTUyh0ZXh0LCBvcHRpb25zKVxuICAgICAgICAgICAgcmVzb2x2ZSB0ZXh0XG4gICAgICBjYXRjaCBlcnJcbiAgICAgICAgQGVycm9yKFwiSlMgQmVhdXRpZnkgZXJyb3I6ICN7ZXJyfVwiKVxuICAgICAgICByZWplY3QoZXJyKVxuXG4gICAgKVxuXG4gICMgUmV0cmlldmVzIHRoZSBkZWZhdWx0IGxpbmUgZW5kaW5nIGJhc2VkIHVwb24gdGhlIEF0b20gY29uZmlndXJhdGlvblxuICAjICBgbGluZS1lbmRpbmctc2VsZWN0b3IuZGVmYXVsdExpbmVFbmRpbmdgLiBJZiB0aGUgQXRvbSBjb25maWd1cmF0aW9uXG4gICMgIGluZGljYXRlcyBcIk9TIERlZmF1bHRcIiwgdGhlIGBwcm9jZXNzLnBsYXRmb3JtYCBpcyBxdWVyaWVkLCByZXR1cm5pbmdcbiAgIyAgQ1JMRiBmb3IgV2luZG93cyBzeXN0ZW1zIGFuZCBMRiBmb3IgYWxsIG90aGVyIHN5c3RlbXMuXG4gICMgQ29kZSBtb2RpZmllZCBmcm9tIGF0b20vbGluZS1lbmRpbmctc2VsZWN0b3JcbiAgIyByZXR1cm5zOiBUaGUgY29ycmVjdCBsaW5lLWVuZGluZyBjaGFyYWN0ZXIgc2VxdWVuY2UgYmFzZWQgdXBvbiB0aGUgQXRvbVxuICAjICBjb25maWd1cmF0aW9uLCBvciBgbnVsbGAgaWYgdGhlIEF0b20gbGluZSBlbmRpbmcgY29uZmlndXJhdGlvbiB3YXMgbm90XG4gICMgIHJlY29nbml6ZWQuXG4gICMgc2VlOiBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9saW5lLWVuZGluZy1zZWxlY3Rvci9ibG9iL21hc3Rlci9saWIvbWFpbi5qc1xuICBnZXREZWZhdWx0TGluZUVuZGluZz0gLT5cbiAgICBzd2l0Y2ggYXRvbS5jb25maWcuZ2V0KCdsaW5lLWVuZGluZy1zZWxlY3Rvci5kZWZhdWx0TGluZUVuZGluZycpXG4gICAgICB3aGVuICdMRidcbiAgICAgICAgcmV0dXJuICdcXG4nXG4gICAgICB3aGVuICdDUkxGJ1xuICAgICAgICByZXR1cm4gJ1xcclxcbidcbiAgICAgIHdoZW4gJ09TIERlZmF1bHQnXG4gICAgICAgIHJldHVybiBpZiBwcm9jZXNzLnBsYXRmb3JtIGlzICd3aW4zMicgdGhlbiAnXFxyXFxuJyBlbHNlICdcXG4nXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBudWxsXG4iXX0=
