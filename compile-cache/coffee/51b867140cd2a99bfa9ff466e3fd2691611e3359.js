
/*
Requires [perltidy](http://perltidy.sourceforge.net)
 */

(function() {
  "use strict";
  var Beautifier, PerlTidy,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = PerlTidy = (function(superClass) {
    extend(PerlTidy, superClass);

    function PerlTidy() {
      return PerlTidy.__super__.constructor.apply(this, arguments);
    }

    PerlTidy.prototype.name = "Perltidy";

    PerlTidy.prototype.link = "http://perltidy.sourceforge.net/";

    PerlTidy.prototype.options = {
      Perl: true
    };

    PerlTidy.prototype.cli = function(options) {
      if (options.perltidy_path == null) {
        return new Error("'Perl Perltidy Path' not set!" + " Please set this in the Atom Beautify package settings.");
      } else {
        return options.perltidy_path;
      }
    };

    PerlTidy.prototype.beautify = function(text, language, options) {
      var ref;
      return this.run("perltidy", ['--standard-output', '--standard-error-output', '--quiet', ((ref = options.perltidy_profile) != null ? ref.length : void 0) ? "--profile=" + options.perltidy_profile : void 0, this.tempFile("input", text)], {
        help: {
          link: "http://perltidy.sourceforge.net/"
        }
      });
    };

    return PerlTidy;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9wZXJsdGlkeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUEsb0JBQUE7SUFBQTs7O0VBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O3VCQUNyQixJQUFBLEdBQU07O3VCQUNOLElBQUEsR0FBTTs7dUJBRU4sT0FBQSxHQUFTO01BQ1AsSUFBQSxFQUFNLElBREM7Ozt1QkFJVCxHQUFBLEdBQUssU0FBQyxPQUFEO01BQ0gsSUFBTyw2QkFBUDtBQUNFLGVBQVcsSUFBQSxLQUFBLENBQU0sK0JBQUEsR0FDZix5REFEUyxFQURiO09BQUEsTUFBQTtBQUlFLGVBQU8sT0FBTyxDQUFDLGNBSmpCOztJQURHOzt1QkFPTCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLFVBQUE7YUFBQSxJQUFDLENBQUEsR0FBRCxDQUFLLFVBQUwsRUFBaUIsQ0FDZixtQkFEZSxFQUVmLHlCQUZlLEVBR2YsU0FIZSxpREFJb0QsQ0FBRSxnQkFBckUsR0FBQSxZQUFBLEdBQWEsT0FBTyxDQUFDLGdCQUFyQixHQUFBLE1BSmUsRUFLZixJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVYsRUFBbUIsSUFBbkIsQ0FMZSxDQUFqQixFQU1LO1FBQUEsSUFBQSxFQUFNO1VBQ1AsSUFBQSxFQUFNLGtDQURDO1NBQU47T0FOTDtJQURROzs7O0tBZjRCO0FBTnhDIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBbcGVybHRpZHldKGh0dHA6Ly9wZXJsdGlkeS5zb3VyY2Vmb3JnZS5uZXQpXG4jIyNcblwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBQZXJsVGlkeSBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJQZXJsdGlkeVwiXG4gIGxpbms6IFwiaHR0cDovL3Blcmx0aWR5LnNvdXJjZWZvcmdlLm5ldC9cIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBQZXJsOiB0cnVlXG4gIH1cblxuICBjbGk6IChvcHRpb25zKSAtPlxuICAgIGlmIG5vdCBvcHRpb25zLnBlcmx0aWR5X3BhdGg/XG4gICAgICByZXR1cm4gbmV3IEVycm9yKFwiJ1BlcmwgUGVybHRpZHkgUGF0aCcgbm90IHNldCFcIiArXG4gICAgICAgIFwiIFBsZWFzZSBzZXQgdGhpcyBpbiB0aGUgQXRvbSBCZWF1dGlmeSBwYWNrYWdlIHNldHRpbmdzLlwiKVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBvcHRpb25zLnBlcmx0aWR5X3BhdGhcblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBydW4oXCJwZXJsdGlkeVwiLCBbXG4gICAgICAnLS1zdGFuZGFyZC1vdXRwdXQnXG4gICAgICAnLS1zdGFuZGFyZC1lcnJvci1vdXRwdXQnXG4gICAgICAnLS1xdWlldCdcbiAgICAgIFwiLS1wcm9maWxlPSN7b3B0aW9ucy5wZXJsdGlkeV9wcm9maWxlfVwiIGlmIG9wdGlvbnMucGVybHRpZHlfcHJvZmlsZT8ubGVuZ3RoXG4gICAgICBAdGVtcEZpbGUoXCJpbnB1dFwiLCB0ZXh0KVxuICAgICAgXSwgaGVscDoge1xuICAgICAgICBsaW5rOiBcImh0dHA6Ly9wZXJsdGlkeS5zb3VyY2Vmb3JnZS5uZXQvXCJcbiAgICAgIH0pXG4iXX0=
