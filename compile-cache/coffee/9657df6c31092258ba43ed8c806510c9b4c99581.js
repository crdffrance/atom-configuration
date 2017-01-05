
/*
Requires [formatR](https://github.com/yihui/formatR)
 */

(function() {
  var Beautifier, R, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require("path");

  "use strict";

  Beautifier = require('../beautifier');

  module.exports = R = (function(superClass) {
    extend(R, superClass);

    function R() {
      return R.__super__.constructor.apply(this, arguments);
    }

    R.prototype.name = "formatR";

    R.prototype.link = "https://github.com/yihui/formatR";

    R.prototype.options = {
      R: true
    };

    R.prototype.beautify = function(text, language, options) {
      var r_beautifier;
      r_beautifier = path.resolve(__dirname, "formatR.r");
      return this.run("Rscript", [r_beautifier, options.indent_size, this.tempFile("input", text), '>', this.tempFile("input", text)]);
    };

    return R;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9mb3JtYXRSL2luZGV4LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7QUFBQTtBQUFBLE1BQUEsbUJBQUE7SUFBQTs7O0VBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQOztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztnQkFDckIsSUFBQSxHQUFNOztnQkFDTixJQUFBLEdBQU07O2dCQUVOLE9BQUEsR0FBUztNQUNQLENBQUEsRUFBRyxJQURJOzs7Z0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsWUFBQSxHQUFlLElBQUksQ0FBQyxPQUFMLENBQWEsU0FBYixFQUF3QixXQUF4QjthQUNmLElBQUMsQ0FBQSxHQUFELENBQUssU0FBTCxFQUFnQixDQUNkLFlBRGMsRUFFZCxPQUFPLENBQUMsV0FGTSxFQUdkLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUhjLEVBSWQsR0FKYyxFQUtkLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUxjLENBQWhCO0lBRlE7Ozs7S0FScUI7QUFSakMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIFtmb3JtYXRSXShodHRwczovL2dpdGh1Yi5jb20veWlodWkvZm9ybWF0UilcbiMjI1xucGF0aCA9IHJlcXVpcmUoXCJwYXRoXCIpXG5cblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgUiBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJmb3JtYXRSXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20veWlodWkvZm9ybWF0UlwiXG5cbiAgb3B0aW9uczoge1xuICAgIFI6IHRydWVcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG4gICAgcl9iZWF1dGlmaWVyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJmb3JtYXRSLnJcIilcbiAgICBAcnVuKFwiUnNjcmlwdFwiLCBbXG4gICAgICByX2JlYXV0aWZpZXIsXG4gICAgICBvcHRpb25zLmluZGVudF9zaXplLFxuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dCksXG4gICAgICAnPicsXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSlcbiJdfQ==
