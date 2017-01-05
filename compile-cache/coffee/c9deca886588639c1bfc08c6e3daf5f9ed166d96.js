(function() {
  "use strict";
  var Beautifier, PrettyDiff,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PrettyDiff = (function(superClass) {
    extend(PrettyDiff, superClass);

    function PrettyDiff() {
      return PrettyDiff.__super__.constructor.apply(this, arguments);
    }

    PrettyDiff.prototype.name = "Pretty Diff";

    PrettyDiff.prototype.link = "https://github.com/prettydiff/prettydiff";

    PrettyDiff.prototype.options = {
      _: {
        inchar: [
          "indent_with_tabs", "indent_char", function(indent_with_tabs, indent_char) {
            if (indent_with_tabs === true) {
              return "\t";
            } else {
              return indent_char;
            }
          }
        ],
        insize: [
          "indent_with_tabs", "indent_size", function(indent_with_tabs, indent_size) {
            if (indent_with_tabs === true) {
              return 1;
            } else {
              return indent_size;
            }
          }
        ],
        objsort: function(objsort) {
          return objsort || false;
        },
        preserve: [
          'preserve_newlines', function(preserve_newlines) {
            if (preserve_newlines === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        cssinsertlines: "newline_between_rules",
        comments: [
          "indent_comments", function(indent_comments) {
            if (indent_comments === false) {
              return "noindent";
            } else {
              return "indent";
            }
          }
        ],
        force: "force_indentation",
        quoteConvert: "convert_quotes",
        vertical: [
          'align_assignments', function(align_assignments) {
            if (align_assignments === true) {
              return "all";
            } else {
              return "none";
            }
          }
        ],
        wrap: "wrap_line_length",
        space: "space_after_anon_function",
        noleadzero: "no_lead_zero",
        endcomma: "end_with_comma",
        methodchain: [
          'break_chained_methods', function(break_chained_methods) {
            if (break_chained_methods === true) {
              return false;
            } else {
              return true;
            }
          }
        ],
        ternaryline: "preserve_ternary_lines",
        bracepadding: "space_in_paren"
      },
      CSV: true,
      Coldfusion: true,
      ERB: true,
      EJS: true,
      HTML: true,
      Handlebars: true,
      Nunjucks: true,
      XML: true,
      SVG: true,
      Spacebars: true,
      JSX: true,
      JavaScript: true,
      CSS: true,
      SCSS: true,
      JSON: true,
      TSS: true,
      Twig: true,
      LESS: true,
      Swig: true,
      "UX Markup": true,
      Visualforce: true,
      "Riot.js": true,
      XTemplate: true
    };

    PrettyDiff.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var _, args, lang, output, prettydiff, result;
          prettydiff = require("prettydiff");
          _ = require('lodash');
          lang = "auto";
          switch (language) {
            case "CSV":
              lang = "csv";
              break;
            case "Coldfusion":
              lang = "html";
              break;
            case "EJS":
            case "Twig":
              lang = "ejs";
              break;
            case "ERB":
              lang = "html_ruby";
              break;
            case "Handlebars":
            case "Mustache":
            case "Spacebars":
            case "Swig":
            case "Riot.js":
            case "XTemplate":
              lang = "handlebars";
              break;
            case "SGML":
              lang = "markup";
              break;
            case "XML":
            case "Visualforce":
            case "SVG":
              lang = "xml";
              break;
            case "HTML":
            case "Nunjucks":
            case "UX Markup":
              lang = "html";
              break;
            case "JavaScript":
              lang = "javascript";
              break;
            case "JSON":
              lang = "json";
              break;
            case "JSX":
              lang = "jsx";
              break;
            case "JSTL":
              lang = "jsp";
              break;
            case "CSS":
              lang = "css";
              break;
            case "LESS":
              lang = "less";
              break;
            case "SCSS":
              lang = "scss";
              break;
            case "TSS":
              lang = "tss";
              break;
            default:
              lang = "auto";
          }
          args = {
            source: text,
            lang: lang,
            mode: "beautify"
          };
          _.merge(options, args);
          _this.verbose('prettydiff', options);
          output = prettydiff.api(options);
          result = output[0];
          return resolve(result);
        };
      })(this));
    };

    return PrettyDiff;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wcmV0dHlkaWZmLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7eUJBQ3JCLElBQUEsR0FBTTs7eUJBQ04sSUFBQSxHQUFNOzt5QkFDTixPQUFBLEdBQVM7TUFFUCxDQUFBLEVBQ0U7UUFBQSxNQUFBLEVBQVE7VUFBQyxrQkFBRCxFQUFxQixhQUFyQixFQUFvQyxTQUFDLGdCQUFELEVBQW1CLFdBQW5CO1lBQzFDLElBQUksZ0JBQUEsS0FBb0IsSUFBeEI7cUJBQ0UsS0FERjthQUFBLE1BQUE7cUJBQ1ksWUFEWjs7VUFEMEMsQ0FBcEM7U0FBUjtRQUlBLE1BQUEsRUFBUTtVQUFDLGtCQUFELEVBQXFCLGFBQXJCLEVBQW9DLFNBQUMsZ0JBQUQsRUFBbUIsV0FBbkI7WUFDMUMsSUFBSSxnQkFBQSxLQUFvQixJQUF4QjtxQkFDRSxFQURGO2FBQUEsTUFBQTtxQkFDUyxZQURUOztVQUQwQyxDQUFwQztTQUpSO1FBUUEsT0FBQSxFQUFTLFNBQUMsT0FBRDtpQkFDUCxPQUFBLElBQVc7UUFESixDQVJUO1FBVUEsUUFBQSxFQUFVO1VBQUMsbUJBQUQsRUFBc0IsU0FBQyxpQkFBRDtZQUM5QixJQUFJLGlCQUFBLEtBQXFCLElBQXpCO3FCQUNFLE1BREY7YUFBQSxNQUFBO3FCQUNhLE9BRGI7O1VBRDhCLENBQXRCO1NBVlY7UUFjQSxjQUFBLEVBQWdCLHVCQWRoQjtRQWVBLFFBQUEsRUFBVTtVQUFDLGlCQUFELEVBQW9CLFNBQUMsZUFBRDtZQUM1QixJQUFJLGVBQUEsS0FBbUIsS0FBdkI7cUJBQ0UsV0FERjthQUFBLE1BQUE7cUJBQ2tCLFNBRGxCOztVQUQ0QixDQUFwQjtTQWZWO1FBbUJBLEtBQUEsRUFBTyxtQkFuQlA7UUFvQkEsWUFBQSxFQUFjLGdCQXBCZDtRQXFCQSxRQUFBLEVBQVU7VUFBQyxtQkFBRCxFQUFzQixTQUFDLGlCQUFEO1lBQzlCLElBQUksaUJBQUEsS0FBcUIsSUFBekI7cUJBQ0UsTUFERjthQUFBLE1BQUE7cUJBQ2EsT0FEYjs7VUFEOEIsQ0FBdEI7U0FyQlY7UUF5QkEsSUFBQSxFQUFNLGtCQXpCTjtRQTBCQSxLQUFBLEVBQU8sMkJBMUJQO1FBMkJBLFVBQUEsRUFBWSxjQTNCWjtRQTRCQSxRQUFBLEVBQVUsZ0JBNUJWO1FBNkJBLFdBQUEsRUFBYTtVQUFDLHVCQUFELEVBQTBCLFNBQUMscUJBQUQ7WUFDckMsSUFBSSxxQkFBQSxLQUF5QixJQUE3QjtxQkFDRSxNQURGO2FBQUEsTUFBQTtxQkFDYSxLQURiOztVQURxQyxDQUExQjtTQTdCYjtRQWlDQSxXQUFBLEVBQWEsd0JBakNiO1FBa0NBLFlBQUEsRUFBYyxnQkFsQ2Q7T0FISztNQXVDUCxHQUFBLEVBQUssSUF2Q0U7TUF3Q1AsVUFBQSxFQUFZLElBeENMO01BeUNQLEdBQUEsRUFBSyxJQXpDRTtNQTBDUCxHQUFBLEVBQUssSUExQ0U7TUEyQ1AsSUFBQSxFQUFNLElBM0NDO01BNENQLFVBQUEsRUFBWSxJQTVDTDtNQTZDUCxRQUFBLEVBQVUsSUE3Q0g7TUE4Q1AsR0FBQSxFQUFLLElBOUNFO01BK0NQLEdBQUEsRUFBSyxJQS9DRTtNQWdEUCxTQUFBLEVBQVcsSUFoREo7TUFpRFAsR0FBQSxFQUFLLElBakRFO01Ba0RQLFVBQUEsRUFBWSxJQWxETDtNQW1EUCxHQUFBLEVBQUssSUFuREU7TUFvRFAsSUFBQSxFQUFNLElBcERDO01BcURQLElBQUEsRUFBTSxJQXJEQztNQXNEUCxHQUFBLEVBQUssSUF0REU7TUF1RFAsSUFBQSxFQUFNLElBdkRDO01Bd0RQLElBQUEsRUFBTSxJQXhEQztNQXlEUCxJQUFBLEVBQU0sSUF6REM7TUEwRFAsV0FBQSxFQUFhLElBMUROO01BMkRQLFdBQUEsRUFBYSxJQTNETjtNQTREUCxTQUFBLEVBQVcsSUE1REo7TUE2RFAsU0FBQSxFQUFXLElBN0RKOzs7eUJBZ0VULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBRVIsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLGNBQUE7VUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLFlBQVI7VUFDYixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7VUFHSixJQUFBLEdBQU87QUFDUCxrQkFBTyxRQUFQO0FBQUEsaUJBQ08sS0FEUDtjQUVJLElBQUEsR0FBTztBQURKO0FBRFAsaUJBR08sWUFIUDtjQUlJLElBQUEsR0FBTztBQURKO0FBSFAsaUJBS08sS0FMUDtBQUFBLGlCQUtjLE1BTGQ7Y0FNSSxJQUFBLEdBQU87QUFERztBQUxkLGlCQU9PLEtBUFA7Y0FRSSxJQUFBLEdBQU87QUFESjtBQVBQLGlCQVNPLFlBVFA7QUFBQSxpQkFTcUIsVUFUckI7QUFBQSxpQkFTaUMsV0FUakM7QUFBQSxpQkFTOEMsTUFUOUM7QUFBQSxpQkFTc0QsU0FUdEQ7QUFBQSxpQkFTaUUsV0FUakU7Y0FVSSxJQUFBLEdBQU87QUFEc0Q7QUFUakUsaUJBV08sTUFYUDtjQVlJLElBQUEsR0FBTztBQURKO0FBWFAsaUJBYU8sS0FiUDtBQUFBLGlCQWFjLGFBYmQ7QUFBQSxpQkFhNkIsS0FiN0I7Y0FjSSxJQUFBLEdBQU87QUFEa0I7QUFiN0IsaUJBZU8sTUFmUDtBQUFBLGlCQWVlLFVBZmY7QUFBQSxpQkFlMkIsV0FmM0I7Y0FnQkksSUFBQSxHQUFPO0FBRGdCO0FBZjNCLGlCQWlCTyxZQWpCUDtjQWtCSSxJQUFBLEdBQU87QUFESjtBQWpCUCxpQkFtQk8sTUFuQlA7Y0FvQkksSUFBQSxHQUFPO0FBREo7QUFuQlAsaUJBcUJPLEtBckJQO2NBc0JJLElBQUEsR0FBTztBQURKO0FBckJQLGlCQXVCTyxNQXZCUDtjQXdCSSxJQUFBLEdBQU87QUFESjtBQXZCUCxpQkF5Qk8sS0F6QlA7Y0EwQkksSUFBQSxHQUFPO0FBREo7QUF6QlAsaUJBMkJPLE1BM0JQO2NBNEJJLElBQUEsR0FBTztBQURKO0FBM0JQLGlCQTZCTyxNQTdCUDtjQThCSSxJQUFBLEdBQU87QUFESjtBQTdCUCxpQkErQk8sS0EvQlA7Y0FnQ0ksSUFBQSxHQUFPO0FBREo7QUEvQlA7Y0FrQ0ksSUFBQSxHQUFPO0FBbENYO1VBcUNBLElBQUEsR0FDRTtZQUFBLE1BQUEsRUFBUSxJQUFSO1lBQ0EsSUFBQSxFQUFNLElBRE47WUFFQSxJQUFBLEVBQU0sVUFGTjs7VUFLRixDQUFDLENBQUMsS0FBRixDQUFRLE9BQVIsRUFBaUIsSUFBakI7VUFHQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBdUIsT0FBdkI7VUFDQSxNQUFBLEdBQVMsVUFBVSxDQUFDLEdBQVgsQ0FBZSxPQUFmO1VBQ1QsTUFBQSxHQUFTLE1BQU8sQ0FBQSxDQUFBO2lCQUdoQixPQUFBLENBQVEsTUFBUjtRQXpEa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7SUFGSDs7OztLQW5FOEI7QUFIMUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUHJldHR5RGlmZiBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJQcmV0dHkgRGlmZlwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3ByZXR0eWRpZmYvcHJldHR5ZGlmZlwiXG4gIG9wdGlvbnM6IHtcbiAgICAjIEFwcGx5IHRoZXNlIG9wdGlvbnMgZmlyc3QgLyBnbG9iYWxseSwgZm9yIGFsbCBsYW5ndWFnZXNcbiAgICBfOlxuICAgICAgaW5jaGFyOiBbXCJpbmRlbnRfd2l0aF90YWJzXCIsIFwiaW5kZW50X2NoYXJcIiwgKGluZGVudF93aXRoX3RhYnMsIGluZGVudF9jaGFyKSAtPlxuICAgICAgICBpZiAoaW5kZW50X3dpdGhfdGFicyBpcyB0cnVlKSB0aGVuIFxcXG4gICAgICAgICAgXCJcXHRcIiBlbHNlIGluZGVudF9jaGFyXG4gICAgICBdXG4gICAgICBpbnNpemU6IFtcImluZGVudF93aXRoX3RhYnNcIiwgXCJpbmRlbnRfc2l6ZVwiLCAoaW5kZW50X3dpdGhfdGFicywgaW5kZW50X3NpemUpIC0+XG4gICAgICAgIGlmIChpbmRlbnRfd2l0aF90YWJzIGlzIHRydWUpIHRoZW4gXFxcbiAgICAgICAgICAxIGVsc2UgaW5kZW50X3NpemVcbiAgICAgIF1cbiAgICAgIG9ianNvcnQ6IChvYmpzb3J0KSAtPlxuICAgICAgICBvYmpzb3J0IG9yIGZhbHNlXG4gICAgICBwcmVzZXJ2ZTogWydwcmVzZXJ2ZV9uZXdsaW5lcycsIChwcmVzZXJ2ZV9uZXdsaW5lcykgLT5cbiAgICAgICAgaWYgKHByZXNlcnZlX25ld2xpbmVzIGlzIHRydWUgKSB0aGVuIFxcXG4gICAgICAgICAgXCJhbGxcIiBlbHNlIFwibm9uZVwiXG4gICAgICBdXG4gICAgICBjc3NpbnNlcnRsaW5lczogXCJuZXdsaW5lX2JldHdlZW5fcnVsZXNcIlxuICAgICAgY29tbWVudHM6IFtcImluZGVudF9jb21tZW50c1wiLCAoaW5kZW50X2NvbW1lbnRzKSAtPlxuICAgICAgICBpZiAoaW5kZW50X2NvbW1lbnRzIGlzIGZhbHNlKSB0aGVuIFxcXG4gICAgICAgICAgXCJub2luZGVudFwiIGVsc2UgXCJpbmRlbnRcIlxuICAgICAgXVxuICAgICAgZm9yY2U6IFwiZm9yY2VfaW5kZW50YXRpb25cIlxuICAgICAgcXVvdGVDb252ZXJ0OiBcImNvbnZlcnRfcXVvdGVzXCJcbiAgICAgIHZlcnRpY2FsOiBbJ2FsaWduX2Fzc2lnbm1lbnRzJywgKGFsaWduX2Fzc2lnbm1lbnRzKSAtPlxuICAgICAgICBpZiAoYWxpZ25fYXNzaWdubWVudHMgaXMgdHJ1ZSApIHRoZW4gXFxcbiAgICAgICAgICBcImFsbFwiIGVsc2UgXCJub25lXCJcbiAgICAgIF1cbiAgICAgIHdyYXA6IFwid3JhcF9saW5lX2xlbmd0aFwiXG4gICAgICBzcGFjZTogXCJzcGFjZV9hZnRlcl9hbm9uX2Z1bmN0aW9uXCJcbiAgICAgIG5vbGVhZHplcm86IFwibm9fbGVhZF96ZXJvXCJcbiAgICAgIGVuZGNvbW1hOiBcImVuZF93aXRoX2NvbW1hXCJcbiAgICAgIG1ldGhvZGNoYWluOiBbJ2JyZWFrX2NoYWluZWRfbWV0aG9kcycsIChicmVha19jaGFpbmVkX21ldGhvZHMpIC0+XG4gICAgICAgIGlmIChicmVha19jaGFpbmVkX21ldGhvZHMgaXMgdHJ1ZSApIHRoZW4gXFxcbiAgICAgICAgICBmYWxzZSBlbHNlIHRydWVcbiAgICAgIF1cbiAgICAgIHRlcm5hcnlsaW5lOiBcInByZXNlcnZlX3Rlcm5hcnlfbGluZXNcIlxuICAgICAgYnJhY2VwYWRkaW5nOiBcInNwYWNlX2luX3BhcmVuXCJcbiAgICAjIEFwcGx5IGxhbmd1YWdlLXNwZWNpZmljIG9wdGlvbnNcbiAgICBDU1Y6IHRydWVcbiAgICBDb2xkZnVzaW9uOiB0cnVlXG4gICAgRVJCOiB0cnVlXG4gICAgRUpTOiB0cnVlXG4gICAgSFRNTDogdHJ1ZVxuICAgIEhhbmRsZWJhcnM6IHRydWVcbiAgICBOdW5qdWNrczogdHJ1ZVxuICAgIFhNTDogdHJ1ZVxuICAgIFNWRzogdHJ1ZVxuICAgIFNwYWNlYmFyczogdHJ1ZVxuICAgIEpTWDogdHJ1ZVxuICAgIEphdmFTY3JpcHQ6IHRydWVcbiAgICBDU1M6IHRydWVcbiAgICBTQ1NTOiB0cnVlXG4gICAgSlNPTjogdHJ1ZVxuICAgIFRTUzogdHJ1ZVxuICAgIFR3aWc6IHRydWVcbiAgICBMRVNTOiB0cnVlXG4gICAgU3dpZzogdHJ1ZVxuICAgIFwiVVggTWFya3VwXCI6IHRydWVcbiAgICBWaXN1YWxmb3JjZTogdHJ1ZVxuICAgIFwiUmlvdC5qc1wiOiB0cnVlXG4gICAgWFRlbXBsYXRlOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuXG4gICAgcmV0dXJuIG5ldyBAUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgcHJldHR5ZGlmZiA9IHJlcXVpcmUoXCJwcmV0dHlkaWZmXCIpXG4gICAgICBfID0gcmVxdWlyZSgnbG9kYXNoJylcblxuICAgICAgIyBTZWxlY3QgUHJldHR5ZGlmZiBsYW5ndWFnZVxuICAgICAgbGFuZyA9IFwiYXV0b1wiXG4gICAgICBzd2l0Y2ggbGFuZ3VhZ2VcbiAgICAgICAgd2hlbiBcIkNTVlwiXG4gICAgICAgICAgbGFuZyA9IFwiY3N2XCJcbiAgICAgICAgd2hlbiBcIkNvbGRmdXNpb25cIlxuICAgICAgICAgIGxhbmcgPSBcImh0bWxcIlxuICAgICAgICB3aGVuIFwiRUpTXCIsIFwiVHdpZ1wiXG4gICAgICAgICAgbGFuZyA9IFwiZWpzXCJcbiAgICAgICAgd2hlbiBcIkVSQlwiXG4gICAgICAgICAgbGFuZyA9IFwiaHRtbF9ydWJ5XCJcbiAgICAgICAgd2hlbiBcIkhhbmRsZWJhcnNcIiwgXCJNdXN0YWNoZVwiLCBcIlNwYWNlYmFyc1wiLCBcIlN3aWdcIiwgXCJSaW90LmpzXCIsIFwiWFRlbXBsYXRlXCJcbiAgICAgICAgICBsYW5nID0gXCJoYW5kbGViYXJzXCJcbiAgICAgICAgd2hlbiBcIlNHTUxcIlxuICAgICAgICAgIGxhbmcgPSBcIm1hcmt1cFwiXG4gICAgICAgIHdoZW4gXCJYTUxcIiwgXCJWaXN1YWxmb3JjZVwiLCBcIlNWR1wiXG4gICAgICAgICAgbGFuZyA9IFwieG1sXCJcbiAgICAgICAgd2hlbiBcIkhUTUxcIiwgXCJOdW5qdWNrc1wiLCBcIlVYIE1hcmt1cFwiXG4gICAgICAgICAgbGFuZyA9IFwiaHRtbFwiXG4gICAgICAgIHdoZW4gXCJKYXZhU2NyaXB0XCJcbiAgICAgICAgICBsYW5nID0gXCJqYXZhc2NyaXB0XCJcbiAgICAgICAgd2hlbiBcIkpTT05cIlxuICAgICAgICAgIGxhbmcgPSBcImpzb25cIlxuICAgICAgICB3aGVuIFwiSlNYXCJcbiAgICAgICAgICBsYW5nID0gXCJqc3hcIlxuICAgICAgICB3aGVuIFwiSlNUTFwiXG4gICAgICAgICAgbGFuZyA9IFwianNwXCJcbiAgICAgICAgd2hlbiBcIkNTU1wiXG4gICAgICAgICAgbGFuZyA9IFwiY3NzXCJcbiAgICAgICAgd2hlbiBcIkxFU1NcIlxuICAgICAgICAgIGxhbmcgPSBcImxlc3NcIlxuICAgICAgICB3aGVuIFwiU0NTU1wiXG4gICAgICAgICAgbGFuZyA9IFwic2Nzc1wiXG4gICAgICAgIHdoZW4gXCJUU1NcIlxuICAgICAgICAgIGxhbmcgPSBcInRzc1wiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsYW5nID0gXCJhdXRvXCJcblxuICAgICAgIyBQcmV0dHlkaWZmIEFyZ3VtZW50c1xuICAgICAgYXJncyA9XG4gICAgICAgIHNvdXJjZTogdGV4dFxuICAgICAgICBsYW5nOiBsYW5nXG4gICAgICAgIG1vZGU6IFwiYmVhdXRpZnlcIlxuXG4gICAgICAjIE1lcmdlIGFyZ3MgaW50b3Mgb3B0aW9uc1xuICAgICAgXy5tZXJnZShvcHRpb25zLCBhcmdzKVxuXG4gICAgICAjIEJlYXV0aWZ5XG4gICAgICBAdmVyYm9zZSgncHJldHR5ZGlmZicsIG9wdGlvbnMpXG4gICAgICBvdXRwdXQgPSBwcmV0dHlkaWZmLmFwaShvcHRpb25zKVxuICAgICAgcmVzdWx0ID0gb3V0cHV0WzBdXG5cbiAgICAgICMgUmV0dXJuIGJlYXV0aWZpZWQgdGV4dFxuICAgICAgcmVzb2x2ZShyZXN1bHQpXG5cbiAgICApXG4iXX0=
