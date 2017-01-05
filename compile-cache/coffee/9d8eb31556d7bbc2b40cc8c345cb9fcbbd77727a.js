
/*
Requires http://pear.php.net/package/PHP_Beautifier
 */

(function() {
  "use strict";
  var fs, possibleOptions, temp;

  fs = require("fs");

  temp = require("temp").track();

  possibleOptions = require("./possible-options.json");

  module.exports = function(options, cb) {
    var ic, isPossible, k, text, v, vs;
    text = "";
    options.output_tab_size = options.output_tab_size || options.indent_size;
    options.input_tab_size = options.input_tab_size || options.indent_size;
    delete options.indent_size;
    ic = options.indent_char;
    if (options.indent_with_tabs === 0 || options.indent_with_tabs === 1 || options.indent_with_tabs === 2) {
      null;
    } else if (ic === " ") {
      options.indent_with_tabs = 0;
    } else if (ic === "\t") {
      options.indent_with_tabs = 2;
    } else {
      options.indent_with_tabs = 1;
    }
    delete options.indent_char;
    delete options.languageOverride;
    delete options.configPath;
    for (k in options) {
      isPossible = possibleOptions.indexOf(k) !== -1;
      if (isPossible) {
        v = options[k];
        vs = v;
        if (typeof vs === "boolean") {
          if (vs === true) {
            vs = "True";
          } else {
            vs = "False";
          }
        }
        text += k + " = " + vs + "\n";
      } else {
        delete options[k];
      }
    }
    return temp.open({
      suffix: ".cfg"
    }, function(err, info) {
      if (!err) {
        return fs.write(info.fd, text || "", function(err) {
          if (err) {
            return cb(err);
          }
          return fs.close(info.fd, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, info.path);
          });
        });
      } else {
        return cb(err);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy91bmNydXN0aWZ5L2NmZy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7O0FBQUE7RUFHQTtBQUhBLE1BQUE7O0VBSUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUFlLENBQUMsS0FBaEIsQ0FBQTs7RUFDUCxlQUFBLEdBQWtCLE9BQUEsQ0FBUSx5QkFBUjs7RUFDbEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxPQUFELEVBQVUsRUFBVjtBQUNmLFFBQUE7SUFBQSxJQUFBLEdBQU87SUFHUCxPQUFPLENBQUMsZUFBUixHQUEwQixPQUFPLENBQUMsZUFBUixJQUEyQixPQUFPLENBQUM7SUFDN0QsT0FBTyxDQUFDLGNBQVIsR0FBeUIsT0FBTyxDQUFDLGNBQVIsSUFBMEIsT0FBTyxDQUFDO0lBQzNELE9BQU8sT0FBTyxDQUFDO0lBUWYsRUFBQSxHQUFLLE9BQU8sQ0FBQztJQUNiLElBQUcsT0FBTyxDQUFDLGdCQUFSLEtBQTRCLENBQTVCLElBQWlDLE9BQU8sQ0FBQyxnQkFBUixLQUE0QixDQUE3RCxJQUFrRSxPQUFPLENBQUMsZ0JBQVIsS0FBNEIsQ0FBakc7TUFDRSxLQURGO0tBQUEsTUFFSyxJQUFHLEVBQUEsS0FBTSxHQUFUO01BQ0gsT0FBTyxDQUFDLGdCQUFSLEdBQTJCLEVBRHhCO0tBQUEsTUFFQSxJQUFHLEVBQUEsS0FBTSxJQUFUO01BQ0gsT0FBTyxDQUFDLGdCQUFSLEdBQTJCLEVBRHhCO0tBQUEsTUFBQTtNQUdILE9BQU8sQ0FBQyxnQkFBUixHQUEyQixFQUh4Qjs7SUFJTCxPQUFPLE9BQU8sQ0FBQztJQUtmLE9BQU8sT0FBTyxDQUFDO0lBQ2YsT0FBTyxPQUFPLENBQUM7QUFHZixTQUFBLFlBQUE7TUFFRSxVQUFBLEdBQWEsZUFBZSxDQUFDLE9BQWhCLENBQXdCLENBQXhCLENBQUEsS0FBZ0MsQ0FBQztNQUM5QyxJQUFHLFVBQUg7UUFDRSxDQUFBLEdBQUksT0FBUSxDQUFBLENBQUE7UUFDWixFQUFBLEdBQUs7UUFDTCxJQUFHLE9BQU8sRUFBUCxLQUFhLFNBQWhCO1VBQ0UsSUFBRyxFQUFBLEtBQU0sSUFBVDtZQUNFLEVBQUEsR0FBSyxPQURQO1dBQUEsTUFBQTtZQUdFLEVBQUEsR0FBSyxRQUhQO1dBREY7O1FBS0EsSUFBQSxJQUFRLENBQUEsR0FBSSxLQUFKLEdBQVksRUFBWixHQUFpQixLQVIzQjtPQUFBLE1BQUE7UUFXRSxPQUFPLE9BQVEsQ0FBQSxDQUFBLEVBWGpCOztBQUhGO1dBaUJBLElBQUksQ0FBQyxJQUFMLENBQ0U7TUFBQSxNQUFBLEVBQVEsTUFBUjtLQURGLEVBRUUsU0FBQyxHQUFELEVBQU0sSUFBTjtNQUNBLElBQUEsQ0FBTyxHQUFQO2VBR0UsRUFBRSxDQUFDLEtBQUgsQ0FBUyxJQUFJLENBQUMsRUFBZCxFQUFrQixJQUFBLElBQVEsRUFBMUIsRUFBOEIsU0FBQyxHQUFEO1VBRzVCLElBQWtCLEdBQWxCO0FBQUEsbUJBQU8sRUFBQSxDQUFHLEdBQUgsRUFBUDs7aUJBQ0EsRUFBRSxDQUFDLEtBQUgsQ0FBUyxJQUFJLENBQUMsRUFBZCxFQUFrQixTQUFDLEdBQUQ7WUFHaEIsSUFBa0IsR0FBbEI7QUFBQSxxQkFBTyxFQUFBLENBQUcsR0FBSCxFQUFQOzttQkFDQSxFQUFBLENBQUcsSUFBSCxFQUFTLElBQUksQ0FBQyxJQUFkO1VBSmdCLENBQWxCO1FBSjRCLENBQTlCLEVBSEY7T0FBQSxNQUFBO2VBZUUsRUFBQSxDQUFHLEdBQUgsRUFmRjs7SUFEQSxDQUZGO0VBakRlO0FBUGpCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5SZXF1aXJlcyBodHRwOi8vcGVhci5waHAubmV0L3BhY2thZ2UvUEhQX0JlYXV0aWZpZXJcbiMjI1xuXCJ1c2Ugc3RyaWN0XCJcbmZzID0gcmVxdWlyZShcImZzXCIpXG50ZW1wID0gcmVxdWlyZShcInRlbXBcIikudHJhY2soKVxucG9zc2libGVPcHRpb25zID0gcmVxdWlyZSBcIi4vcG9zc2libGUtb3B0aW9ucy5qc29uXCJcbm1vZHVsZS5leHBvcnRzID0gKG9wdGlvbnMsIGNiKSAtPlxuICB0ZXh0ID0gXCJcIlxuXG4gICMgQXBwbHkgaW5kZW50X3NpemUgdG8gb3V0cHV0X3RhYl9zaXplXG4gIG9wdGlvbnMub3V0cHV0X3RhYl9zaXplID0gb3B0aW9ucy5vdXRwdXRfdGFiX3NpemUgb3Igb3B0aW9ucy5pbmRlbnRfc2l6ZSAjIGpzaGludCBpZ25vcmU6IGxpbmVcbiAgb3B0aW9ucy5pbnB1dF90YWJfc2l6ZSA9IG9wdGlvbnMuaW5wdXRfdGFiX3NpemUgb3Igb3B0aW9ucy5pbmRlbnRfc2l6ZSAjIGpzaGludCBpZ25vcmU6IGxpbmVcbiAgZGVsZXRlIG9wdGlvbnMuaW5kZW50X3NpemUgIyBqc2hpbnQgaWdub3JlOiBsaW5lXG5cbiAgIyBJbmRlbnQgd2l0aCBUYWJzP1xuICAjIEhvdyB0byB1c2UgdGFicyB3aGVuIGluZGVudGluZyBjb2RlXG4gICMgMD1zcGFjZXMgb25seVxuICAjIDE9aW5kZW50IHdpdGggdGFicyB0byBicmFjZSBsZXZlbCwgYWxpZ24gd2l0aCBzcGFjZXNcbiAgIyAyPWluZGVudCBhbmQgYWxpZ24gd2l0aCB0YWJzLCB1c2luZyBzcGFjZXMgd2hlbiBub3Qgb24gYSB0YWJzdG9wXG4gICMganNoaW50IGlnbm9yZTogc3RhcnRcbiAgaWMgPSBvcHRpb25zLmluZGVudF9jaGFyXG4gIGlmIG9wdGlvbnMuaW5kZW50X3dpdGhfdGFicyBpcyAwIG9yIG9wdGlvbnMuaW5kZW50X3dpdGhfdGFicyBpcyAxIG9yIG9wdGlvbnMuaW5kZW50X3dpdGhfdGFicyBpcyAyXG4gICAgbnVsbCAjIElnbm9yZSBpbmRlbnRfY2hhciBvcHRpb25cbiAgZWxzZSBpZiBpYyBpcyBcIiBcIlxuICAgIG9wdGlvbnMuaW5kZW50X3dpdGhfdGFicyA9IDAgIyBTcGFjZXMgb25seVxuICBlbHNlIGlmIGljIGlzIFwiXFx0XCJcbiAgICBvcHRpb25zLmluZGVudF93aXRoX3RhYnMgPSAyICMgaW5kZW50IGFuZCBhbGlnbiB3aXRoIHRhYnMsIHVzaW5nIHNwYWNlcyB3aGVuIG5vdCBvbiBhIHRhYnN0b3BcbiAgZWxzZVxuICAgIG9wdGlvbnMuaW5kZW50X3dpdGhfdGFicyA9IDEgIyBpbmRlbnQgd2l0aCB0YWJzIHRvIGJyYWNlIGxldmVsLCBhbGlnbiB3aXRoIHNwYWNlc1xuICBkZWxldGUgb3B0aW9ucy5pbmRlbnRfY2hhclxuXG5cbiAgIyBqc2hpbnQgaWdub3JlOiBlbmRcbiAgIyBSZW1vdmUgbWlzY1xuICBkZWxldGUgb3B0aW9ucy5sYW5ndWFnZU92ZXJyaWRlXG4gIGRlbGV0ZSBvcHRpb25zLmNvbmZpZ1BhdGhcblxuICAjIEl0ZXJhdGUgb3ZlciBlYWNoIHByb3BlcnR5IGFuZCB3cml0ZSB0byBjb25maWd1cmF0aW9uIGZpbGVcbiAgZm9yIGsgb2Ygb3B0aW9uc1xuICAgICMgUmVtb3ZlIGFsbCBub24tcG9zc2libGUgb3B0aW9uc1xuICAgIGlzUG9zc2libGUgPSBwb3NzaWJsZU9wdGlvbnMuaW5kZXhPZihrKSBpc250IC0xXG4gICAgaWYgaXNQb3NzaWJsZVxuICAgICAgdiA9IG9wdGlvbnNba11cbiAgICAgIHZzID0gdlxuICAgICAgaWYgdHlwZW9mIHZzIGlzIFwiYm9vbGVhblwiXG4gICAgICAgIGlmIHZzIGlzIHRydWVcbiAgICAgICAgICB2cyA9IFwiVHJ1ZVwiXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2cyA9IFwiRmFsc2VcIlxuICAgICAgdGV4dCArPSBrICsgXCIgPSBcIiArIHZzICsgXCJcXG5cIlxuICAgIGVsc2VcbiAgICAgICMgY29uc29sZS5sb2coXCJyZW1vdmluZyAje2t9IG9wdGlvblwiKVxuICAgICAgZGVsZXRlIG9wdGlvbnNba11cblxuICAjIENyZWF0ZSB0ZW1wIGlucHV0IGZpbGVcbiAgdGVtcC5vcGVuXG4gICAgc3VmZml4OiBcIi5jZmdcIlxuICAsIChlcnIsIGluZm8pIC0+XG4gICAgdW5sZXNzIGVyclxuXG4gICAgICAjIFNhdmUgY3VycmVudCB0ZXh0IHRvIGlucHV0IGZpbGVcbiAgICAgIGZzLndyaXRlIGluZm8uZmQsIHRleHQgb3IgXCJcIiwgKGVycikgLT5cblxuICAgICAgICAjIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgICAgICBmcy5jbG9zZSBpbmZvLmZkLCAoZXJyKSAtPlxuXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgIHJldHVybiBjYihlcnIpIGlmIGVyclxuICAgICAgICAgIGNiIG51bGwsIGluZm8ucGF0aFxuXG5cbiAgICBlbHNlXG4gICAgICBjYiBlcnJcbiJdfQ==
