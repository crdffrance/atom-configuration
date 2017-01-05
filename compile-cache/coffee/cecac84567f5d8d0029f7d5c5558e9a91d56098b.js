
/*
 */

(function() {
  var Beautifier, Lua, path,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  path = require("path");

  "use strict";

  Beautifier = require('../beautifier');

  module.exports = Lua = (function(superClass) {
    extend(Lua, superClass);

    function Lua() {
      return Lua.__super__.constructor.apply(this, arguments);
    }

    Lua.prototype.name = "Lua beautifier";

    Lua.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/lua-beautifier/beautifier.pl";

    Lua.prototype.options = {
      Lua: true
    };

    Lua.prototype.beautify = function(text, language, options) {
      var lua_beautifier;
      lua_beautifier = path.resolve(__dirname, "beautifier.pl");
      return this.run("perl", [lua_beautifier, '<', this.tempFile("input", text)]);
    };

    return Lua;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9sdWEtYmVhdXRpZmllci9pbmRleC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7QUFBQTtBQUFBLE1BQUEscUJBQUE7SUFBQTs7O0VBRUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUVQOztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsZUFBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztrQkFDckIsSUFBQSxHQUFNOztrQkFDTixJQUFBLEdBQU07O2tCQUVOLE9BQUEsR0FBUztNQUNQLEdBQUEsRUFBSyxJQURFOzs7a0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixVQUFBO01BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsT0FBTCxDQUFhLFNBQWIsRUFBd0IsZUFBeEI7YUFDakIsSUFBQyxDQUFBLEdBQUQsQ0FBSyxNQUFMLEVBQWEsQ0FDWCxjQURXLEVBRVgsR0FGVyxFQUdYLElBQUMsQ0FBQSxRQUFELENBQVUsT0FBVixFQUFtQixJQUFuQixDQUhXLENBQWI7SUFGUTs7OztLQVJ1QjtBQVBuQyIsInNvdXJjZXNDb250ZW50IjpbIiMjI1xuIyMjXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcblxuXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBMdWEgZXh0ZW5kcyBCZWF1dGlmaWVyXG4gIG5hbWU6IFwiTHVhIGJlYXV0aWZpZXJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9HbGF2aW4wMDEvYXRvbS1iZWF1dGlmeS9ibG9iL21hc3Rlci9zcmMvYmVhdXRpZmllcnMvbHVhLWJlYXV0aWZpZXIvYmVhdXRpZmllci5wbFwiXG5cbiAgb3B0aW9uczoge1xuICAgIEx1YTogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICBsdWFfYmVhdXRpZmllciA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiYmVhdXRpZmllci5wbFwiKVxuICAgIEBydW4oXCJwZXJsXCIsIFtcbiAgICAgIGx1YV9iZWF1dGlmaWVyLFxuICAgICAgJzwnLFxuICAgICAgQHRlbXBGaWxlKFwiaW5wdXRcIiwgdGV4dClcbiAgICAgIF0pXG4iXX0=
