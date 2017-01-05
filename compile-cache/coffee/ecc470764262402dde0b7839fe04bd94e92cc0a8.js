(function() {
  "use strict";
  var Beautifier, VueBeautifier, _, prettydiff,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  prettydiff = require("prettydiff");

  _ = require('lodash');

  module.exports = VueBeautifier = (function(superClass) {
    extend(VueBeautifier, superClass);

    function VueBeautifier() {
      return VueBeautifier.__super__.constructor.apply(this, arguments);
    }

    VueBeautifier.prototype.name = "Vue Beautifier";

    VueBeautifier.prototype.options = {
      Vue: true
    };

    VueBeautifier.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var regexp;
        regexp = /(<(template|script|style)[^>]*>)((\s|\S)*?)<\/\2>/gi;
        return resolve(text.replace(regexp, function(match, begin, type, text) {
          var lang, ref;
          lang = (ref = /lang\s*=\s*['"](\w+)["']/.exec(begin)) != null ? ref[1] : void 0;
          switch (type) {
            case "template":
              switch (lang) {
                case "pug":
                case "jade":
                  return match.replace(text, "\n" + require("pug-beautify")(text, options) + "\n");
                case void 0:
                  return match.replace(text, "\n" + require("js-beautify").html(text, options) + "\n");
                default:
                  return match;
              }
              break;
            case "script":
              return match.replace(text, "\n" + require("js-beautify")(text, options) + "\n");
            case "style":
              switch (lang) {
                case "sass":
                case "scss":
                  options = _.merge(options, {
                    source: text,
                    lang: "scss",
                    mode: "beautify"
                  });
                  return match.replace(text, prettydiff.api(options)[0]);
                case "less":
                  options = _.merge(options, {
                    source: text,
                    lang: "less",
                    mode: "beautify"
                  });
                  return match.replace(text, prettydiff.api(options)[0]);
                case void 0:
                  return match.replace(text, "\n" + require("js-beautify").css(text, options) + "\n");
                default:
                  return match;
              }
          }
        }));
      });
    };

    return VueBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy92dWUtYmVhdXRpZmllci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsd0NBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUNiLFVBQUEsR0FBYSxPQUFBLENBQVEsWUFBUjs7RUFDYixDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVI7O0VBRUosTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7NEJBQ3JCLElBQUEsR0FBTTs7NEJBRU4sT0FBQSxHQUNFO01BQUEsR0FBQSxFQUFLLElBQUw7Ozs0QkFFRixRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsWUFBQTtRQUFBLE1BQUEsR0FBUztlQUVULE9BQUEsQ0FBUSxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQWIsRUFBcUIsU0FBQyxLQUFELEVBQVEsS0FBUixFQUFlLElBQWYsRUFBcUIsSUFBckI7QUFDM0IsY0FBQTtVQUFBLElBQUEsK0RBQStDLENBQUEsQ0FBQTtBQUUvQyxrQkFBTyxJQUFQO0FBQUEsaUJBQ08sVUFEUDtBQUVJLHNCQUFPLElBQVA7QUFBQSxxQkFDTyxLQURQO0FBQUEscUJBQ2MsTUFEZDt5QkFFSSxLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsRUFBb0IsSUFBQSxHQUFPLE9BQUEsQ0FBUSxjQUFSLENBQUEsQ0FBd0IsSUFBeEIsRUFBOEIsT0FBOUIsQ0FBUCxHQUFnRCxJQUFwRTtBQUZKLHFCQUdPLE1BSFA7eUJBSUksS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDLElBQXZCLENBQTRCLElBQTVCLEVBQWtDLE9BQWxDLENBQVAsR0FBb0QsSUFBeEU7QUFKSjt5QkFNSTtBQU5KO0FBREc7QUFEUCxpQkFTTyxRQVRQO3FCQVVJLEtBQUssQ0FBQyxPQUFOLENBQWMsSUFBZCxFQUFvQixJQUFBLEdBQU8sT0FBQSxDQUFRLGFBQVIsQ0FBQSxDQUF1QixJQUF2QixFQUE2QixPQUE3QixDQUFQLEdBQStDLElBQW5FO0FBVkosaUJBV08sT0FYUDtBQVlJLHNCQUFPLElBQVA7QUFBQSxxQkFDTyxNQURQO0FBQUEscUJBQ2UsTUFEZjtrQkFFSSxPQUFBLEdBQVUsQ0FBQyxDQUFDLEtBQUYsQ0FBUSxPQUFSLEVBQ1I7b0JBQUEsTUFBQSxFQUFRLElBQVI7b0JBQ0EsSUFBQSxFQUFNLE1BRE47b0JBRUEsSUFBQSxFQUFNLFVBRk47bUJBRFE7eUJBSVYsS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLFVBQVUsQ0FBQyxHQUFYLENBQWUsT0FBZixDQUF3QixDQUFBLENBQUEsQ0FBNUM7QUFOSixxQkFPTyxNQVBQO2tCQVFJLE9BQUEsR0FBVSxDQUFDLENBQUMsS0FBRixDQUFRLE9BQVIsRUFDVjtvQkFBQSxNQUFBLEVBQVEsSUFBUjtvQkFDQSxJQUFBLEVBQU0sTUFETjtvQkFFQSxJQUFBLEVBQU0sVUFGTjttQkFEVTt5QkFJVixLQUFLLENBQUMsT0FBTixDQUFjLElBQWQsRUFBb0IsVUFBVSxDQUFDLEdBQVgsQ0FBZSxPQUFmLENBQXdCLENBQUEsQ0FBQSxDQUE1QztBQVpKLHFCQWFPLE1BYlA7eUJBY0ksS0FBSyxDQUFDLE9BQU4sQ0FBYyxJQUFkLEVBQW9CLElBQUEsR0FBTyxPQUFBLENBQVEsYUFBUixDQUFzQixDQUFDLEdBQXZCLENBQTJCLElBQTNCLEVBQWlDLE9BQWpDLENBQVAsR0FBbUQsSUFBdkU7QUFkSjt5QkFnQkk7QUFoQko7QUFaSjtRQUgyQixDQUFyQixDQUFSO01BSGtCLENBQVQ7SUFESDs7OztLQU5pQztBQUw3QyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcbnByZXR0eWRpZmYgPSByZXF1aXJlKFwicHJldHR5ZGlmZlwiKVxuXyA9IHJlcXVpcmUoJ2xvZGFzaCcpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVnVlQmVhdXRpZmllciBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJWdWUgQmVhdXRpZmllclwiXG5cbiAgb3B0aW9uczpcbiAgICBWdWU6IHRydWVcblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIHJlZ2V4cCA9IC8oPCh0ZW1wbGF0ZXxzY3JpcHR8c3R5bGUpW14+XSo+KSgoXFxzfFxcUykqPyk8XFwvXFwyPi9naVxuXG4gICAgICByZXNvbHZlKHRleHQucmVwbGFjZShyZWdleHAsIChtYXRjaCwgYmVnaW4sIHR5cGUsIHRleHQpIC0+XG4gICAgICAgIGxhbmcgPSAvbGFuZ1xccyo9XFxzKlsnXCJdKFxcdyspW1wiJ10vLmV4ZWMoYmVnaW4pP1sxXVxuXG4gICAgICAgIHN3aXRjaCB0eXBlXG4gICAgICAgICAgd2hlbiBcInRlbXBsYXRlXCJcbiAgICAgICAgICAgIHN3aXRjaCBsYW5nXG4gICAgICAgICAgICAgIHdoZW4gXCJwdWdcIiwgXCJqYWRlXCJcbiAgICAgICAgICAgICAgICBtYXRjaC5yZXBsYWNlKHRleHQsIFwiXFxuXCIgKyByZXF1aXJlKFwicHVnLWJlYXV0aWZ5XCIpKHRleHQsIG9wdGlvbnMpICsgXCJcXG5cIilcbiAgICAgICAgICAgICAgd2hlbiB1bmRlZmluZWRcbiAgICAgICAgICAgICAgICBtYXRjaC5yZXBsYWNlKHRleHQsIFwiXFxuXCIgKyByZXF1aXJlKFwianMtYmVhdXRpZnlcIikuaHRtbCh0ZXh0LCBvcHRpb25zKSArIFwiXFxuXCIpXG4gICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICBtYXRjaFxuICAgICAgICAgIHdoZW4gXCJzY3JpcHRcIlxuICAgICAgICAgICAgbWF0Y2gucmVwbGFjZSh0ZXh0LCBcIlxcblwiICsgcmVxdWlyZShcImpzLWJlYXV0aWZ5XCIpKHRleHQsIG9wdGlvbnMpICsgXCJcXG5cIilcbiAgICAgICAgICB3aGVuIFwic3R5bGVcIlxuICAgICAgICAgICAgc3dpdGNoIGxhbmdcbiAgICAgICAgICAgICAgd2hlbiBcInNhc3NcIiwgXCJzY3NzXCJcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gXy5tZXJnZSBvcHRpb25zLFxuICAgICAgICAgICAgICAgICAgc291cmNlOiB0ZXh0XG4gICAgICAgICAgICAgICAgICBsYW5nOiBcInNjc3NcIlxuICAgICAgICAgICAgICAgICAgbW9kZTogXCJiZWF1dGlmeVwiXG4gICAgICAgICAgICAgICAgbWF0Y2gucmVwbGFjZSh0ZXh0LCBwcmV0dHlkaWZmLmFwaShvcHRpb25zKVswXSlcbiAgICAgICAgICAgICAgd2hlbiBcImxlc3NcIlxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSBfLm1lcmdlIG9wdGlvbnMsXG4gICAgICAgICAgICAgICAgc291cmNlOiB0ZXh0XG4gICAgICAgICAgICAgICAgbGFuZzogXCJsZXNzXCJcbiAgICAgICAgICAgICAgICBtb2RlOiBcImJlYXV0aWZ5XCJcbiAgICAgICAgICAgICAgICBtYXRjaC5yZXBsYWNlKHRleHQsIHByZXR0eWRpZmYuYXBpKG9wdGlvbnMpWzBdKVxuICAgICAgICAgICAgICB3aGVuIHVuZGVmaW5lZFxuICAgICAgICAgICAgICAgIG1hdGNoLnJlcGxhY2UodGV4dCwgXCJcXG5cIiArIHJlcXVpcmUoXCJqcy1iZWF1dGlmeVwiKS5jc3ModGV4dCwgb3B0aW9ucykgKyBcIlxcblwiKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbWF0Y2hcbiAgICAgICkpXG4gICAgKVxuIl19
