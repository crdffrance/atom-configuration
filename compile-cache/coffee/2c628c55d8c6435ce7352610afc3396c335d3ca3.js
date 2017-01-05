(function() {
  "use strict";
  var Beautifier, TypeScriptFormatter,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = TypeScriptFormatter = (function(superClass) {
    extend(TypeScriptFormatter, superClass);

    function TypeScriptFormatter() {
      return TypeScriptFormatter.__super__.constructor.apply(this, arguments);
    }

    TypeScriptFormatter.prototype.name = "TypeScript Formatter";

    TypeScriptFormatter.prototype.link = "https://github.com/vvakame/typescript-formatter";

    TypeScriptFormatter.prototype.options = {
      TypeScript: true
    };

    TypeScriptFormatter.prototype.beautify = function(text, language, options) {
      return new this.Promise((function(_this) {
        return function(resolve, reject) {
          var e, format, formatterUtils, opts, result;
          try {
            format = require("typescript-formatter/lib/formatter")["default"];
            formatterUtils = require("typescript-formatter/lib/utils");
            opts = formatterUtils.createDefaultFormatCodeOptions();
            if (options.indent_with_tabs) {
              opts.ConvertTabsToSpaces = false;
            } else {
              opts.TabSize = options.tab_width || options.indent_size;
              opts.IndentSize = options.indent_size;
              opts.IndentStyle = 'space';
            }
            _this.verbose('typescript', text, opts);
            result = format('', text, opts);
            _this.verbose(result);
            return resolve(result);
          } catch (error) {
            e = error;
            return reject(e);
          }
        };
      })(this));
    };

    return TypeScriptFormatter;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy90eXBlc2NyaXB0LWZvcm1hdHRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQTtBQUFBLE1BQUEsK0JBQUE7SUFBQTs7O0VBQ0EsVUFBQSxHQUFhLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQXVCOzs7Ozs7O2tDQUNyQixJQUFBLEdBQU07O2tDQUNOLElBQUEsR0FBTTs7a0NBQ04sT0FBQSxHQUFTO01BQ1AsVUFBQSxFQUFZLElBREw7OztrQ0FJVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUVsQixjQUFBO0FBQUE7WUFDRSxNQUFBLEdBQVMsT0FBQSxDQUFRLG9DQUFSLENBQTZDLEVBQUMsT0FBRDtZQUN0RCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxnQ0FBUjtZQUdqQixJQUFBLEdBQU8sY0FBYyxDQUFDLDhCQUFmLENBQUE7WUFFUCxJQUFHLE9BQU8sQ0FBQyxnQkFBWDtjQUNFLElBQUksQ0FBQyxtQkFBTCxHQUEyQixNQUQ3QjthQUFBLE1BQUE7Y0FHRSxJQUFJLENBQUMsT0FBTCxHQUFlLE9BQU8sQ0FBQyxTQUFSLElBQXFCLE9BQU8sQ0FBQztjQUM1QyxJQUFJLENBQUMsVUFBTCxHQUFrQixPQUFPLENBQUM7Y0FDMUIsSUFBSSxDQUFDLFdBQUwsR0FBbUIsUUFMckI7O1lBT0EsS0FBQyxDQUFBLE9BQUQsQ0FBUyxZQUFULEVBQXVCLElBQXZCLEVBQTZCLElBQTdCO1lBQ0EsTUFBQSxHQUFTLE1BQUEsQ0FBTyxFQUFQLEVBQVcsSUFBWCxFQUFpQixJQUFqQjtZQUNULEtBQUMsQ0FBQSxPQUFELENBQVMsTUFBVDttQkFDQSxPQUFBLENBQVEsTUFBUixFQWpCRjtXQUFBLGFBQUE7WUFrQk07QUFDSixtQkFBTyxNQUFBLENBQU8sQ0FBUCxFQW5CVDs7UUFGa0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVQ7SUFESDs7OztLQVB1QztBQUhuRCIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBUeXBlU2NyaXB0Rm9ybWF0dGVyIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIlR5cGVTY3JpcHQgRm9ybWF0dGVyXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vdnZha2FtZS90eXBlc2NyaXB0LWZvcm1hdHRlclwiXG4gIG9wdGlvbnM6IHtcbiAgICBUeXBlU2NyaXB0OiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIHJldHVybiBuZXcgQFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT5cblxuICAgICAgdHJ5XG4gICAgICAgIGZvcm1hdCA9IHJlcXVpcmUoXCJ0eXBlc2NyaXB0LWZvcm1hdHRlci9saWIvZm9ybWF0dGVyXCIpLmRlZmF1bHRcbiAgICAgICAgZm9ybWF0dGVyVXRpbHMgPSByZXF1aXJlKFwidHlwZXNjcmlwdC1mb3JtYXR0ZXIvbGliL3V0aWxzXCIpXG4gICAgICAgICMgQHZlcmJvc2UoJ2Zvcm1hdCcsIGZvcm1hdCwgZm9ybWF0dGVyVXRpbHMpXG5cbiAgICAgICAgb3B0cyA9IGZvcm1hdHRlclV0aWxzLmNyZWF0ZURlZmF1bHRGb3JtYXRDb2RlT3B0aW9ucygpXG5cbiAgICAgICAgaWYgb3B0aW9ucy5pbmRlbnRfd2l0aF90YWJzXG4gICAgICAgICAgb3B0cy5Db252ZXJ0VGFic1RvU3BhY2VzID0gZmFsc2VcbiAgICAgICAgZWxzZVxuICAgICAgICAgIG9wdHMuVGFiU2l6ZSA9IG9wdGlvbnMudGFiX3dpZHRoIG9yIG9wdGlvbnMuaW5kZW50X3NpemVcbiAgICAgICAgICBvcHRzLkluZGVudFNpemUgPSBvcHRpb25zLmluZGVudF9zaXplXG4gICAgICAgICAgb3B0cy5JbmRlbnRTdHlsZSA9ICdzcGFjZSdcblxuICAgICAgICBAdmVyYm9zZSgndHlwZXNjcmlwdCcsIHRleHQsIG9wdHMpXG4gICAgICAgIHJlc3VsdCA9IGZvcm1hdCgnJywgdGV4dCwgb3B0cylcbiAgICAgICAgQHZlcmJvc2UocmVzdWx0KVxuICAgICAgICByZXNvbHZlIHJlc3VsdFxuICAgICAgY2F0Y2ggZVxuICAgICAgICByZXR1cm4gcmVqZWN0KGUpXG5cbiAgICApXG4iXX0=
