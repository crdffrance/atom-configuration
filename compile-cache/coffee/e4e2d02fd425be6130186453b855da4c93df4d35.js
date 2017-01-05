
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Autopep8, Beautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Autopep8 = (function(superClass) {
    extend(Autopep8, superClass);

    function Autopep8() {
      return Autopep8.__super__.constructor.apply(this, arguments);
    }

    Autopep8.prototype.name = "autopep8";

    Autopep8.prototype.link = "https://github.com/hhatto/autopep8";

    Autopep8.prototype.options = {
      Python: true
    };

    Autopep8.prototype.beautify = function(text, language, options) {
      var tempFile;
      return this.run("autopep8", [tempFile = this.tempFile("input", text), "-i", options.max_line_length != null ? ["--max-line-length", "" + options.max_line_length] : void 0, options.indent_size != null ? ["--indent-size", "" + options.indent_size] : void 0, options.ignore != null ? ["--ignore", "" + (options.ignore.join(','))] : void 0], {
        help: {
          link: "https://github.com/hhatto/autopep8"
        }
      }).then((function(_this) {
        return function() {
          if (options.sort_imports) {
            return _this.run("isort", [tempFile], {
              help: {
                link: "https://github.com/timothycrosley/isort"
              }
            }).then(function() {
              return _this.readFile(tempFile);
            });
          } else {
            return _this.readFile(tempFile);
          }
        };
      })(this));
    };

    return Autopep8;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9hdXRvcGVwOC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsb0JBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3VCQUVyQixJQUFBLEdBQU07O3VCQUNOLElBQUEsR0FBTTs7dUJBRU4sT0FBQSxHQUFTO01BQ1AsTUFBQSxFQUFRLElBREQ7Ozt1QkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLFVBQUwsRUFBaUIsQ0FDZixRQUFBLEdBQVcsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBREksRUFFZixJQUZlLEVBR3dDLCtCQUF2RCxHQUFBLENBQUMsbUJBQUQsRUFBc0IsRUFBQSxHQUFHLE9BQU8sQ0FBQyxlQUFqQyxDQUFBLEdBQUEsTUFIZSxFQUkrQiwyQkFBOUMsR0FBQSxDQUFDLGVBQUQsRUFBaUIsRUFBQSxHQUFHLE9BQU8sQ0FBQyxXQUE1QixDQUFBLEdBQUEsTUFKZSxFQUsrQixzQkFBOUMsR0FBQSxDQUFDLFVBQUQsRUFBWSxFQUFBLEdBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQWYsQ0FBb0IsR0FBcEIsQ0FBRCxDQUFkLENBQUEsR0FBQSxNQUxlLENBQWpCLEVBTUs7UUFBQSxJQUFBLEVBQU07VUFDUCxJQUFBLEVBQU0sb0NBREM7U0FBTjtPQU5MLENBU0UsQ0FBQyxJQVRILENBU1EsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ0osSUFBRyxPQUFPLENBQUMsWUFBWDttQkFDRSxLQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFDRSxDQUFDLFFBQUQsQ0FERixFQUVFO2NBQUEsSUFBQSxFQUFNO2dCQUNKLElBQUEsRUFBTSx5Q0FERjtlQUFOO2FBRkYsQ0FLQSxDQUFDLElBTEQsQ0FLTSxTQUFBO3FCQUNKLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtZQURJLENBTE4sRUFERjtXQUFBLE1BQUE7bUJBVUUsS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWLEVBVkY7O1FBREk7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBVFI7SUFEUTs7OztLQVQ0QjtBQVB4QyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuUmVxdWlyZXMgaHR0cHM6Ly9naXRodWIuY29tL2hoYXR0by9hdXRvcGVwOFxuIyMjXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBBdXRvcGVwOCBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiBcImF1dG9wZXA4XCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vaGhhdHRvL2F1dG9wZXA4XCJcblxuICBvcHRpb25zOiB7XG4gICAgUHl0aG9uOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJhdXRvcGVwOFwiLCBbXG4gICAgICB0ZW1wRmlsZSA9IEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgICBcIi1pXCJcbiAgICAgIFtcIi0tbWF4LWxpbmUtbGVuZ3RoXCIsIFwiI3tvcHRpb25zLm1heF9saW5lX2xlbmd0aH1cIl0gaWYgb3B0aW9ucy5tYXhfbGluZV9sZW5ndGg/XG4gICAgICBbXCItLWluZGVudC1zaXplXCIsXCIje29wdGlvbnMuaW5kZW50X3NpemV9XCJdIGlmIG9wdGlvbnMuaW5kZW50X3NpemU/XG4gICAgICBbXCItLWlnbm9yZVwiLFwiI3tvcHRpb25zLmlnbm9yZS5qb2luKCcsJyl9XCJdIGlmIG9wdGlvbnMuaWdub3JlP1xuICAgICAgXSwgaGVscDoge1xuICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9oaGF0dG8vYXV0b3BlcDhcIlxuICAgICAgfSlcbiAgICAgIC50aGVuKD0+XG4gICAgICAgIGlmIG9wdGlvbnMuc29ydF9pbXBvcnRzXG4gICAgICAgICAgQHJ1bihcImlzb3J0XCIsXG4gICAgICAgICAgICBbdGVtcEZpbGVdLFxuICAgICAgICAgICAgaGVscDoge1xuICAgICAgICAgICAgICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS90aW1vdGh5Y3Jvc2xleS9pc29ydFwiXG4gICAgICAgICAgfSlcbiAgICAgICAgICAudGhlbig9PlxuICAgICAgICAgICAgQHJlYWRGaWxlKHRlbXBGaWxlKVxuICAgICAgICAgIClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgIClcbiJdfQ==
