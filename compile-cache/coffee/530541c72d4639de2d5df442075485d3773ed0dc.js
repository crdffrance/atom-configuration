(function() {
  "use strict";
  var Beautifier, TidyMarkdown,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = TidyMarkdown = (function(superClass) {
    extend(TidyMarkdown, superClass);

    function TidyMarkdown() {
      return TidyMarkdown.__super__.constructor.apply(this, arguments);
    }

    TidyMarkdown.prototype.name = "Tidy Markdown";

    TidyMarkdown.prototype.link = "https://github.com/slang800/tidy-markdown";

    TidyMarkdown.prototype.options = {
      Markdown: false
    };

    TidyMarkdown.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, tidyMarkdown;
        tidyMarkdown = require('tidy-markdown');
        cleanMarkdown = tidyMarkdown(text);
        return resolve(cleanMarkdown);
      });
    };

    return TidyMarkdown;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy90aWR5LW1hcmtkb3duLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSx3QkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7MkJBQ3JCLElBQUEsR0FBTTs7MkJBQ04sSUFBQSxHQUFNOzsyQkFDTixPQUFBLEdBQVM7TUFDUCxRQUFBLEVBQVUsS0FESDs7OzJCQUlULFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCO0FBQ1IsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixZQUFBO1FBQUEsWUFBQSxHQUFlLE9BQUEsQ0FBUSxlQUFSO1FBQ2YsYUFBQSxHQUFnQixZQUFBLENBQWEsSUFBYjtlQUNoQixPQUFBLENBQVEsYUFBUjtNQUhrQixDQUFUO0lBREg7Ozs7S0FQZ0M7QUFINUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgVGlkeU1hcmtkb3duIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIlRpZHkgTWFya2Rvd25cIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9zbGFuZzgwMC90aWR5LW1hcmtkb3duXCJcbiAgb3B0aW9uczoge1xuICAgIE1hcmtkb3duOiBmYWxzZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICB0aWR5TWFya2Rvd24gPSByZXF1aXJlICd0aWR5LW1hcmtkb3duJ1xuICAgICAgY2xlYW5NYXJrZG93biA9IHRpZHlNYXJrZG93bih0ZXh0KVxuICAgICAgcmVzb2x2ZShjbGVhbk1hcmtkb3duKVxuICAgIClcbiJdfQ==
