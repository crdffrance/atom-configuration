
/*
Requires https://github.com/hhatto/autopep8
 */

(function() {
  "use strict";
  var Beautifier, ErlTidy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = ErlTidy = (function(superClass) {
    extend(ErlTidy, superClass);

    function ErlTidy() {
      return ErlTidy.__super__.constructor.apply(this, arguments);
    }

    ErlTidy.prototype.name = "erl_tidy";

    ErlTidy.prototype.link = "http://erlang.org/doc/man/erl_tidy.html";

    ErlTidy.prototype.options = {
      Erlang: true
    };

    ErlTidy.prototype.beautify = function(text, language, options) {
      var tempFile;
      tempFile = void 0;
      return this.tempFile("input", text).then((function(_this) {
        return function(path) {
          tempFile = path;
          return _this.run("erl", [["-eval", 'erl_tidy:file("' + tempFile + '")'], ["-noshell", "-s", "init", "stop"]], {
            help: {
              link: "http://erlang.org/doc/man/erl_tidy.html"
            }
          });
        };
      })(this)).then((function(_this) {
        return function() {
          return _this.readFile(tempFile);
        };
      })(this));
    };

    return ErlTidy;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9lcmxfdGlkeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFJQTtBQUpBLE1BQUEsbUJBQUE7SUFBQTs7O0VBS0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3NCQUVyQixJQUFBLEdBQU07O3NCQUNOLElBQUEsR0FBTTs7c0JBRU4sT0FBQSxHQUFTO01BQ1AsTUFBQSxFQUFRLElBREQ7OztzQkFJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7TUFBQSxRQUFBLEdBQVc7YUFDWCxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtVQUM1QixRQUFBLEdBQVc7aUJBQ1gsS0FBQyxDQUFBLEdBQUQsQ0FBSyxLQUFMLEVBQVksQ0FDVixDQUFDLE9BQUQsRUFBVSxpQkFBQSxHQUFvQixRQUFwQixHQUErQixJQUF6QyxDQURVLEVBRVYsQ0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixNQUFuQixFQUEyQixNQUEzQixDQUZVLENBQVosRUFJRTtZQUFFLElBQUEsRUFBTTtjQUFFLElBQUEsRUFBTSx5Q0FBUjthQUFSO1dBSkY7UUFGNEI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBUUMsQ0FBQyxJQVJGLENBUU8sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNMLEtBQUMsQ0FBQSxRQUFELENBQVUsUUFBVjtRQURLO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQVJQO0lBRlE7Ozs7S0FUMkI7QUFQdkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vZ2l0aHViLmNvbS9oaGF0dG8vYXV0b3BlcDhcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgRXJsVGlkeSBleHRlbmRzIEJlYXV0aWZpZXJcblxuICBuYW1lOiBcImVybF90aWR5XCJcbiAgbGluazogXCJodHRwOi8vZXJsYW5nLm9yZy9kb2MvbWFuL2VybF90aWR5Lmh0bWxcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBFcmxhbmc6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgdGVtcEZpbGUgPSB1bmRlZmluZWRcbiAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KS50aGVuKChwYXRoKSA9PlxuICAgICAgdGVtcEZpbGUgPSBwYXRoXG4gICAgICBAcnVuKFwiZXJsXCIsIFtcbiAgICAgICAgW1wiLWV2YWxcIiwgJ2VybF90aWR5OmZpbGUoXCInICsgdGVtcEZpbGUgKyAnXCIpJ11cbiAgICAgICAgW1wiLW5vc2hlbGxcIiwgXCItc1wiLCBcImluaXRcIiwgXCJzdG9wXCJdXG4gICAgICAgIF0sXG4gICAgICAgIHsgaGVscDogeyBsaW5rOiBcImh0dHA6Ly9lcmxhbmcub3JnL2RvYy9tYW4vZXJsX3RpZHkuaHRtbFwiIH0gfVxuICAgICAgICApXG4gICAgKS50aGVuKD0+XG4gICAgICBAcmVhZEZpbGUodGVtcEZpbGUpXG4gICAgKVxuIl19
