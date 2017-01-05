
/*
Requires https://www.gnu.org/software/emacs/
 */

(function() {
  "use strict";
  var Beautifier, FortranBeautifier, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('../beautifier');

  path = require("path");

  module.exports = FortranBeautifier = (function(superClass) {
    extend(FortranBeautifier, superClass);

    function FortranBeautifier() {
      return FortranBeautifier.__super__.constructor.apply(this, arguments);
    }

    FortranBeautifier.prototype.name = "Fortran Beautifier";

    FortranBeautifier.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/fortran-beautifier/emacs-fortran-formating-script.lisp";

    FortranBeautifier.prototype.options = {
      Fortran: true
    };

    FortranBeautifier.prototype.beautify = function(text, language, options) {
      var args, emacs_path, emacs_script_path, tempFile;
      this.debug('fortran-beautifier', options);
      emacs_path = options.emacs_path;
      emacs_script_path = options.emacs_script_path;
      if (!emacs_script_path) {
        emacs_script_path = path.resolve(__dirname, "emacs-fortran-formating-script.lisp");
      }
      this.debug('fortran-beautifier', 'emacs script path: ' + emacs_script_path);
      args = ['--batch', '-l', emacs_script_path, '-f', 'f90-batch-indent-region', tempFile = this.tempFile("temp", text)];
      if (emacs_path) {
        return this.run(emacs_path, args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      } else {
        return this.run("emacs", args, {
          ignoreReturnCode: false
        }).then((function(_this) {
          return function() {
            return _this.readFile(tempFile);
          };
        })(this));
      }
    };

    return FortranBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9mb3J0cmFuLWJlYXV0aWZpZXIvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBSUE7QUFKQSxNQUFBLG1DQUFBO0lBQUE7OztFQUtBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFDYixJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7Z0NBQ3JCLElBQUEsR0FBTTs7Z0NBQ04sSUFBQSxHQUFNOztnQ0FFTixPQUFBLEdBQVM7TUFDUCxPQUFBLEVBQVMsSUFERjs7O2dDQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsVUFBQTtNQUFBLElBQUMsQ0FBQSxLQUFELENBQU8sb0JBQVAsRUFBNkIsT0FBN0I7TUFFQSxVQUFBLEdBQWEsT0FBTyxDQUFDO01BQ3JCLGlCQUFBLEdBQW9CLE9BQU8sQ0FBQztNQUU1QixJQUFHLENBQUksaUJBQVA7UUFDRSxpQkFBQSxHQUFvQixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IscUNBQXhCLEVBRHRCOztNQUdBLElBQUMsQ0FBQSxLQUFELENBQU8sb0JBQVAsRUFBNkIscUJBQUEsR0FBd0IsaUJBQXJEO01BRUEsSUFBQSxHQUFPLENBQ0wsU0FESyxFQUVMLElBRkssRUFHTCxpQkFISyxFQUlMLElBSkssRUFLTCx5QkFMSyxFQU1MLFFBQUEsR0FBVyxJQUFDLENBQUEsUUFBRCxDQUFVLE1BQVYsRUFBa0IsSUFBbEIsQ0FOTjtNQVNQLElBQUcsVUFBSDtlQUNFLElBQUMsQ0FBQSxHQUFELENBQUssVUFBTCxFQUFpQixJQUFqQixFQUF1QjtVQUFDLGdCQUFBLEVBQWtCLEtBQW5CO1NBQXZCLENBQ0UsQ0FBQyxJQURILENBQ1EsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDSixLQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7VUFESTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEUixFQURGO09BQUEsTUFBQTtlQU1FLElBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLElBQWQsRUFBb0I7VUFBQyxnQkFBQSxFQUFrQixLQUFuQjtTQUFwQixDQUNFLENBQUMsSUFESCxDQUNRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQ0osS0FBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO1VBREk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRFIsRUFORjs7SUFwQlE7Ozs7S0FScUM7QUFSakQiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcblJlcXVpcmVzIGh0dHBzOi8vd3d3LmdudS5vcmcvc29mdHdhcmUvZW1hY3MvXG4jIyNcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuLi9iZWF1dGlmaWVyJylcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIEZvcnRyYW5CZWF1dGlmaWVyIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkZvcnRyYW4gQmVhdXRpZmllclwiXG4gIGxpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L2Jsb2IvbWFzdGVyL3NyYy9iZWF1dGlmaWVycy9mb3J0cmFuLWJlYXV0aWZpZXIvZW1hY3MtZm9ydHJhbi1mb3JtYXRpbmctc2NyaXB0Lmxpc3BcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICBGb3J0cmFuOiB0cnVlXG4gIH1cblxuICBiZWF1dGlmeTogKHRleHQsIGxhbmd1YWdlLCBvcHRpb25zKSAtPlxuICAgIEBkZWJ1ZygnZm9ydHJhbi1iZWF1dGlmaWVyJywgb3B0aW9ucylcblxuICAgIGVtYWNzX3BhdGggPSBvcHRpb25zLmVtYWNzX3BhdGhcbiAgICBlbWFjc19zY3JpcHRfcGF0aCA9IG9wdGlvbnMuZW1hY3Nfc2NyaXB0X3BhdGhcblxuICAgIGlmIG5vdCBlbWFjc19zY3JpcHRfcGF0aFxuICAgICAgZW1hY3Nfc2NyaXB0X3BhdGggPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImVtYWNzLWZvcnRyYW4tZm9ybWF0aW5nLXNjcmlwdC5saXNwXCIpXG5cbiAgICBAZGVidWcoJ2ZvcnRyYW4tYmVhdXRpZmllcicsICdlbWFjcyBzY3JpcHQgcGF0aDogJyArIGVtYWNzX3NjcmlwdF9wYXRoKVxuXG4gICAgYXJncyA9IFtcbiAgICAgICctLWJhdGNoJ1xuICAgICAgJy1sJ1xuICAgICAgZW1hY3Nfc2NyaXB0X3BhdGhcbiAgICAgICctZidcbiAgICAgICdmOTAtYmF0Y2gtaW5kZW50LXJlZ2lvbidcbiAgICAgIHRlbXBGaWxlID0gQHRlbXBGaWxlKFwidGVtcFwiLCB0ZXh0KVxuICAgICAgXVxuXG4gICAgaWYgZW1hY3NfcGF0aFxuICAgICAgQHJ1bihlbWFjc19wYXRoLCBhcmdzLCB7aWdub3JlUmV0dXJuQ29kZTogZmFsc2V9KVxuICAgICAgICAudGhlbig9PlxuICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgKVxuICAgIGVsc2VcbiAgICAgIEBydW4oXCJlbWFjc1wiLCBhcmdzLCB7aWdub3JlUmV0dXJuQ29kZTogZmFsc2V9KVxuICAgICAgICAudGhlbig9PlxuICAgICAgICAgIEByZWFkRmlsZSh0ZW1wRmlsZSlcbiAgICAgICAgKVxuIl19
