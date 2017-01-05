
/*
Requires http://hhvm.com/
 */

(function() {
  "use strict";
  var Beautifier, HhFormat,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = HhFormat = (function(superClass) {
    extend(HhFormat, superClass);

    function HhFormat() {
      return HhFormat.__super__.constructor.apply(this, arguments);
    }

    HhFormat.prototype.name = "hh_format";

    HhFormat.prototype.link = "http://hhvm.com/";

    HhFormat.prototype.options = {
      PHP: false
    };

    HhFormat.prototype.beautify = function(text, language, options) {
      return this.run("hh_format", [this.tempFile("input", text)], {
        help: {
          link: "http://hhvm.com/"
        }
      }).then(function(output) {
        if (output.trim()) {
          return output;
        } else {
          return this.Promise.resolve(new Error("hh_format returned an empty output."));
        }
      });
    };

    return HhFormat;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9oaF9mb3JtYXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLG9CQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7Ozt1QkFDckIsSUFBQSxHQUFNOzt1QkFDTixJQUFBLEdBQU07O3VCQUVOLE9BQUEsR0FDRTtNQUFBLEdBQUEsRUFBSyxLQUFMOzs7dUJBRUYsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLFdBQUwsRUFBa0IsQ0FDaEIsSUFBQyxDQUFBLFFBQUQsQ0FBVSxPQUFWLEVBQW1CLElBQW5CLENBRGdCLENBQWxCLEVBR0E7UUFDRSxJQUFBLEVBQU07VUFDSixJQUFBLEVBQU0sa0JBREY7U0FEUjtPQUhBLENBT0UsQ0FBQyxJQVBILENBT1EsU0FBQyxNQUFEO1FBR04sSUFBRyxNQUFNLENBQUMsSUFBUCxDQUFBLENBQUg7aUJBQ0UsT0FERjtTQUFBLE1BQUE7aUJBR0UsSUFBQyxDQUFBLE9BQU8sQ0FBQyxPQUFULENBQXFCLElBQUEsS0FBQSxDQUFNLHFDQUFOLENBQXJCLEVBSEY7O01BSE0sQ0FQUjtJQURROzs7O0tBUDRCO0FBUHhDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwOi8vaGh2bS5jb20vXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEhoRm9ybWF0IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcImhoX2Zvcm1hdFwiXG4gIGxpbms6IFwiaHR0cDovL2hodm0uY29tL1wiXG5cbiAgb3B0aW9uczpcbiAgICBQSFA6IGZhbHNlXG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBAcnVuKFwiaGhfZm9ybWF0XCIsIFtcbiAgICAgIEB0ZW1wRmlsZShcImlucHV0XCIsIHRleHQpXG4gICAgXSxcbiAgICB7XG4gICAgICBoZWxwOiB7XG4gICAgICAgIGxpbms6IFwiaHR0cDovL2hodm0uY29tL1wiXG4gICAgICB9XG4gICAgfSkudGhlbigob3V0cHV0KSAtPlxuICAgICAgIyBoaF9mb3JtYXQgY2FuIGV4aXQgd2l0aCBzdGF0dXMgMCBhbmQgbm8gb3V0cHV0IGZvciBzb21lIGZpbGVzIHdoaWNoXG4gICAgICAjIGl0IGRvZXNuJ3QgZm9ybWF0LiAgSW4gdGhhdCBjYXNlIHdlIGp1c3QgcmV0dXJuIG9yaWdpbmFsIHRleHQuXG4gICAgICBpZiBvdXRwdXQudHJpbSgpXG4gICAgICAgIG91dHB1dFxuICAgICAgZWxzZVxuICAgICAgICBAUHJvbWlzZS5yZXNvbHZlKG5ldyBFcnJvcihcImhoX2Zvcm1hdCByZXR1cm5lZCBhbiBlbXB0eSBvdXRwdXQuXCIpKVxuICAgIClcbiJdfQ==
