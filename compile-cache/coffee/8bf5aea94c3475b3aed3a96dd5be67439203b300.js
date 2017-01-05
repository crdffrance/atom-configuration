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
      EJS: true,
      JSX: true,
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9qcy1iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsc0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCO0FBQ3JCLFFBQUE7Ozs7Ozs7O3lCQUFBLElBQUEsR0FBTTs7eUJBQ04sSUFBQSxHQUFNOzt5QkFFTixPQUFBLEdBQVM7TUFDUCxJQUFBLEVBQU0sSUFEQztNQUVQLEdBQUEsRUFBSyxJQUZFO01BR1AsVUFBQSxFQUFZLElBSEw7TUFJUCxRQUFBLEVBQVUsSUFKSDtNQUtQLFVBQUEsRUFBWSxJQUxMO01BTVAsR0FBQSxFQUFLLElBTkU7TUFPUCxHQUFBLEVBQUssSUFQRTtNQVFQLElBQUEsRUFBTSxJQVJDO01BU1AsR0FBQSxFQUNFO1FBQUEsV0FBQSxFQUFhLElBQWI7UUFDQSxXQUFBLEVBQWEsSUFEYjtRQUVBLDBCQUFBLEVBQTRCLElBRjVCO1FBR0EscUJBQUEsRUFBdUIsSUFIdkI7UUFJQSxpQkFBQSxFQUFtQixJQUpuQjtRQUtBLGdCQUFBLEVBQWtCLElBTGxCO1FBTUEsZ0JBQUEsRUFBa0IsSUFObEI7T0FWSzs7O3lCQW1CVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7TUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLHVCQUFBLEdBQXdCLFFBQWpDO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBTSx1QkFBQSxHQUF1QixDQUFDLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixFQUF3QixJQUF4QixFQUE4QixDQUE5QixDQUFELENBQTdCO01BR0EsT0FBTyxDQUFDLEdBQVIsa0RBQXVDLE9BQU8sQ0FBQztBQUMvQyxhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsY0FBQTtBQUFBO0FBQ0Usb0JBQU8sUUFBUDtBQUFBLG1CQUNPLE1BRFA7QUFBQSxtQkFDZSxZQURmO2dCQUVJLFVBQUEsR0FBYSxPQUFBLENBQVEsYUFBUjtnQkFDYixJQUFBLEdBQU8sVUFBQSxDQUFXLElBQVgsRUFBaUIsT0FBakI7dUJBQ1AsT0FBQSxDQUFRLElBQVI7QUFKSixtQkFLTyxZQUxQO0FBQUEsbUJBS3FCLFVBTHJCO2dCQU9JLE9BQU8sQ0FBQyxpQkFBUixHQUE0QjtnQkFFNUIsWUFBQSxHQUFlLE9BQUEsQ0FBUSxhQUFSLENBQXNCLENBQUM7Z0JBQ3RDLElBQUEsR0FBTyxZQUFBLENBQWEsSUFBYixFQUFtQixPQUFuQjt1QkFDUCxPQUFBLENBQVEsSUFBUjtBQVhKLG1CQVlPLGVBWlA7QUFBQSxtQkFZd0IsTUFaeEI7QUFBQSxtQkFZZ0MsS0FaaEM7QUFBQSxtQkFZdUMsdUJBWnZDO0FBQUEsbUJBWWdFLGtCQVpoRTtnQkFhSSxZQUFBLEdBQWUsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQztnQkFDdEMsSUFBQSxHQUFPLFlBQUEsQ0FBYSxJQUFiLEVBQW1CLE9BQW5CO2dCQUNQLEtBQUMsQ0FBQSxLQUFELENBQU8sbUJBQUEsR0FBb0IsSUFBM0I7dUJBQ0EsT0FBQSxDQUFRLElBQVI7QUFoQkosbUJBaUJPLEtBakJQO2dCQWtCSSxXQUFBLEdBQWMsT0FBQSxDQUFRLGFBQVIsQ0FBc0IsQ0FBQztnQkFDckMsSUFBQSxHQUFPLFdBQUEsQ0FBWSxJQUFaLEVBQWtCLE9BQWxCO3VCQUNQLE9BQUEsQ0FBUSxJQUFSO0FBcEJKLGFBREY7V0FBQSxhQUFBO1lBc0JNO1lBQ0osS0FBQyxDQUFBLEtBQUQsQ0FBTyxxQkFBQSxHQUFzQixHQUE3QjttQkFDQSxNQUFBLENBQU8sR0FBUCxFQXhCRjs7UUFEa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7SUFOSDs7SUE0Q1Ysb0JBQUEsR0FBc0IsU0FBQTtBQUNwQixjQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix3Q0FBaEIsQ0FBUDtBQUFBLGFBQ08sSUFEUDtBQUVJLGlCQUFPO0FBRlgsYUFHTyxNQUhQO0FBSUksaUJBQU87QUFKWCxhQUtPLFlBTFA7VUFNVyxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXZCO21CQUFvQyxPQUFwQztXQUFBLE1BQUE7bUJBQWdELEtBQWhEOztBQU5YO0FBUUksaUJBQU87QUFSWDtJQURvQjs7OztLQW5Fa0I7QUFIMUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgSlNCZWF1dGlmeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJKUyBCZWF1dGlmeVwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL2JlYXV0aWZ5LXdlYi9qcy1iZWF1dGlmeVwiXG5cbiAgb3B0aW9uczoge1xuICAgIEhUTUw6IHRydWVcbiAgICBYTUw6IHRydWVcbiAgICBIYW5kbGViYXJzOiB0cnVlXG4gICAgTXVzdGFjaGU6IHRydWVcbiAgICBKYXZhU2NyaXB0OiB0cnVlXG4gICAgRUpTOiB0cnVlXG4gICAgSlNYOiB0cnVlXG4gICAgSlNPTjogdHJ1ZVxuICAgIENTUzpcbiAgICAgIGluZGVudF9zaXplOiB0cnVlXG4gICAgICBpbmRlbnRfY2hhcjogdHJ1ZVxuICAgICAgc2VsZWN0b3Jfc2VwYXJhdG9yX25ld2xpbmU6IHRydWVcbiAgICAgIG5ld2xpbmVfYmV0d2Vlbl9ydWxlczogdHJ1ZVxuICAgICAgcHJlc2VydmVfbmV3bGluZXM6IHRydWVcbiAgICAgIHdyYXBfbGluZV9sZW5ndGg6IHRydWVcbiAgICAgIGVuZF93aXRoX25ld2xpbmU6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgQHZlcmJvc2UoXCJKUyBCZWF1dGlmeSBsYW5ndWFnZSAje2xhbmd1YWdlfVwiKVxuICAgIEBpbmZvKFwiSlMgQmVhdXRpZnkgT3B0aW9uczogI3tKU09OLnN0cmluZ2lmeShvcHRpb25zLCBudWxsLCA0KX1cIilcbiAgICAjVE9ETyByZWNvbnNpZGVyIGhhbmRsaW5nIG9mIEVPTCBvbmNlIGpzLWJlYXV0aWZ5IGFkZHMgRU9MIGRldGVjdGlvblxuICAgICNzZWUgaHR0cHM6Ly9naXRodWIuY29tL2JlYXV0aWZ5LXdlYi9qcy1iZWF1dGlmeS9pc3N1ZXMvODk5XG4gICAgb3B0aW9ucy5lb2wgPSBnZXREZWZhdWx0TGluZUVuZGluZygpID8gb3B0aW9ucy5lb2wgI2ZpeGVzIGlzc3VlICM3MDdcbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICB0cnlcbiAgICAgICAgc3dpdGNoIGxhbmd1YWdlXG4gICAgICAgICAgd2hlbiBcIkpTT05cIiwgXCJKYXZhU2NyaXB0XCJcbiAgICAgICAgICAgIGJlYXV0aWZ5SlMgPSByZXF1aXJlKFwianMtYmVhdXRpZnlcIilcbiAgICAgICAgICAgIHRleHQgPSBiZWF1dGlmeUpTKHRleHQsIG9wdGlvbnMpXG4gICAgICAgICAgICByZXNvbHZlIHRleHRcbiAgICAgICAgICB3aGVuIFwiSGFuZGxlYmFyc1wiLCBcIk11c3RhY2hlXCJcbiAgICAgICAgICAgICMganNoaW50IGlnbm9yZTogc3RhcnRcbiAgICAgICAgICAgIG9wdGlvbnMuaW5kZW50X2hhbmRsZWJhcnMgPSB0cnVlICMgRm9yY2UganNiZWF1dGlmeSB0byBpbmRlbnRfaGFuZGxlYmFyc1xuICAgICAgICAgICAgIyBqc2hpbnQgaWdub3JlOiBlbmRcbiAgICAgICAgICAgIGJlYXV0aWZ5SFRNTCA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5odG1sXG4gICAgICAgICAgICB0ZXh0ID0gYmVhdXRpZnlIVE1MKHRleHQsIG9wdGlvbnMpXG4gICAgICAgICAgICByZXNvbHZlIHRleHRcbiAgICAgICAgICB3aGVuIFwiSFRNTCAoTGlxdWlkKVwiLCBcIkhUTUxcIiwgXCJYTUxcIiwgXCJXZWIgRm9ybS9Db250cm9sIChDIylcIiwgXCJXZWIgSGFuZGxlciAoQyMpXCJcbiAgICAgICAgICAgIGJlYXV0aWZ5SFRNTCA9IHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5odG1sXG4gICAgICAgICAgICB0ZXh0ID0gYmVhdXRpZnlIVE1MKHRleHQsIG9wdGlvbnMpXG4gICAgICAgICAgICBAZGVidWcoXCJCZWF1dGlmaWVkIEhUTUw6ICN7dGV4dH1cIilcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgICAgIHdoZW4gXCJDU1NcIlxuICAgICAgICAgICAgYmVhdXRpZnlDU1MgPSByZXF1aXJlKFwianMtYmVhdXRpZnlcIikuY3NzXG4gICAgICAgICAgICB0ZXh0ID0gYmVhdXRpZnlDU1ModGV4dCwgb3B0aW9ucylcbiAgICAgICAgICAgIHJlc29sdmUgdGV4dFxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIEBlcnJvcihcIkpTIEJlYXV0aWZ5IGVycm9yOiAje2Vycn1cIilcbiAgICAgICAgcmVqZWN0KGVycilcblxuICAgIClcblxuICAjIFJldHJpZXZlcyB0aGUgZGVmYXVsdCBsaW5lIGVuZGluZyBiYXNlZCB1cG9uIHRoZSBBdG9tIGNvbmZpZ3VyYXRpb25cbiAgIyAgYGxpbmUtZW5kaW5nLXNlbGVjdG9yLmRlZmF1bHRMaW5lRW5kaW5nYC4gSWYgdGhlIEF0b20gY29uZmlndXJhdGlvblxuICAjICBpbmRpY2F0ZXMgXCJPUyBEZWZhdWx0XCIsIHRoZSBgcHJvY2Vzcy5wbGF0Zm9ybWAgaXMgcXVlcmllZCwgcmV0dXJuaW5nXG4gICMgIENSTEYgZm9yIFdpbmRvd3Mgc3lzdGVtcyBhbmQgTEYgZm9yIGFsbCBvdGhlciBzeXN0ZW1zLlxuICAjIENvZGUgbW9kaWZpZWQgZnJvbSBhdG9tL2xpbmUtZW5kaW5nLXNlbGVjdG9yXG4gICMgcmV0dXJuczogVGhlIGNvcnJlY3QgbGluZS1lbmRpbmcgY2hhcmFjdGVyIHNlcXVlbmNlIGJhc2VkIHVwb24gdGhlIEF0b21cbiAgIyAgY29uZmlndXJhdGlvbiwgb3IgYG51bGxgIGlmIHRoZSBBdG9tIGxpbmUgZW5kaW5nIGNvbmZpZ3VyYXRpb24gd2FzIG5vdFxuICAjICByZWNvZ25pemVkLlxuICAjIHNlZTogaHR0cHM6Ly9naXRodWIuY29tL2F0b20vbGluZS1lbmRpbmctc2VsZWN0b3IvYmxvYi9tYXN0ZXIvbGliL21haW4uanNcbiAgZ2V0RGVmYXVsdExpbmVFbmRpbmc9IC0+XG4gICAgc3dpdGNoIGF0b20uY29uZmlnLmdldCgnbGluZS1lbmRpbmctc2VsZWN0b3IuZGVmYXVsdExpbmVFbmRpbmcnKVxuICAgICAgd2hlbiAnTEYnXG4gICAgICAgIHJldHVybiAnXFxuJ1xuICAgICAgd2hlbiAnQ1JMRidcbiAgICAgICAgcmV0dXJuICdcXHJcXG4nXG4gICAgICB3aGVuICdPUyBEZWZhdWx0J1xuICAgICAgICByZXR1cm4gaWYgcHJvY2Vzcy5wbGF0Zm9ybSBpcyAnd2luMzInIHRoZW4gJ1xcclxcbicgZWxzZSAnXFxuJ1xuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gbnVsbFxuIl19
