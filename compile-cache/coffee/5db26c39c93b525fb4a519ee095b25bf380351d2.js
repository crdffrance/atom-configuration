(function() {
  "use strict";
  var Beautifier, PugBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PugBeautify = (function(superClass) {
    extend(PugBeautify, superClass);

    function PugBeautify() {
      return PugBeautify.__super__.constructor.apply(this, arguments);
    }

    PugBeautify.prototype.name = "Pug Beautify";

    PugBeautify.prototype.link = "https://github.com/vingorius/pug-beautify";

    PugBeautify.prototype.options = {
      Jade: {
        fill_tab: [
          'indent_char', function(indent_char) {
            return indent_char === "\t";
          }
        ],
        omit_div: true,
        tab_size: "indent_size"
      }
    };

    PugBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var error, pugBeautify;
        pugBeautify = require("pug-beautify");
        try {
          return resolve(pugBeautify(text, options));
        } catch (error1) {
          error = error1;
          return reject(error);
        }
      });
    };

    return PugBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wdWctYmVhdXRpZnkuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OzswQkFDckIsSUFBQSxHQUFNOzswQkFDTixJQUFBLEdBQU07OzBCQUNOLE9BQUEsR0FBUztNQUVQLElBQUEsRUFDRTtRQUFBLFFBQUEsRUFBVTtVQUFDLGFBQUQsRUFBZ0IsU0FBQyxXQUFEO0FBRXhCLG1CQUFRLFdBQUEsS0FBZTtVQUZDLENBQWhCO1NBQVY7UUFJQSxRQUFBLEVBQVUsSUFKVjtRQUtBLFFBQUEsRUFBVSxhQUxWO09BSEs7OzswQkFXVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUVSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsWUFBQTtRQUFBLFdBQUEsR0FBYyxPQUFBLENBQVEsY0FBUjtBQUNkO2lCQUNFLE9BQUEsQ0FBUSxXQUFBLENBQVksSUFBWixFQUFrQixPQUFsQixDQUFSLEVBREY7U0FBQSxjQUFBO1VBRU07aUJBRUosTUFBQSxDQUFPLEtBQVAsRUFKRjs7TUFGa0IsQ0FBVDtJQUZIOzs7O0tBZCtCO0FBSDNDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFB1Z0JlYXV0aWZ5IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIlB1ZyBCZWF1dGlmeVwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL3Zpbmdvcml1cy9wdWctYmVhdXRpZnlcIlxuICBvcHRpb25zOiB7XG4gICAgIyBBcHBseSB0aGVzZSBvcHRpb25zIGZpcnN0IC8gZ2xvYmFsbHksIGZvciBhbGwgbGFuZ3VhZ2VzXG4gICAgSmFkZTpcbiAgICAgIGZpbGxfdGFiOiBbJ2luZGVudF9jaGFyJywgKGluZGVudF9jaGFyKSAtPlxuICAgICAgICAjIFNob3VsZCB1c2UgdGFicz9cbiAgICAgICAgcmV0dXJuIChpbmRlbnRfY2hhciBpcyBcIlxcdFwiKVxuICAgICAgXVxuICAgICAgb21pdF9kaXY6IHRydWVcbiAgICAgIHRhYl9zaXplOiBcImluZGVudF9zaXplXCJcbiAgfVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpIC0+XG5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBwdWdCZWF1dGlmeSA9IHJlcXVpcmUoXCJwdWctYmVhdXRpZnlcIilcbiAgICAgIHRyeVxuICAgICAgICByZXNvbHZlKHB1Z0JlYXV0aWZ5KHRleHQsIG9wdGlvbnMpKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgIyBFcnJvciBvY2N1cnJlZFxuICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgKVxuIl19
