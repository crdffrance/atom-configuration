(function() {
  "use strict";
  var Beautifier, MarkoBeautifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = MarkoBeautifier = (function(superClass) {
    extend(MarkoBeautifier, superClass);

    function MarkoBeautifier() {
      return MarkoBeautifier.__super__.constructor.apply(this, arguments);
    }

    MarkoBeautifier.prototype.name = 'Marko Beautifier';

    MarkoBeautifier.prototype.link = "https://github.com/marko-js/marko-prettyprint";

    MarkoBeautifier.prototype.options = {
      Marko: true
    };

    MarkoBeautifier.prototype.beautify = function(text, language, options, context) {
      return new this.Promise(function(resolve, reject) {
        var error, i, indent, indent_char, indent_size, j, markoPrettyprint, prettyprintOptions, ref;
        markoPrettyprint = require('marko-prettyprint');
        indent_char = options.indent_char || ' ';
        indent_size = options.indent_size || 4;
        indent = '';
        for (i = j = 0, ref = indent_size - 1; 0 <= ref ? j <= ref : j >= ref; i = 0 <= ref ? ++j : --j) {
          indent += indent_char;
        }
        prettyprintOptions = {
          syntax: options.syntax,
          filename: (context != null) && (context.filePath != null) ? context.filePath : require.resolve('marko-prettyprint'),
          indent: indent
        };
        try {
          return resolve(markoPrettyprint(text, prettyprintOptions));
        } catch (error1) {
          error = error1;
          return reject(error);
        }
      });
    };

    return MarkoBeautifier;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9tYXJrby1iZWF1dGlmaWVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSwyQkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7OEJBRXJCLElBQUEsR0FBTTs7OEJBQ04sSUFBQSxHQUFNOzs4QkFFTixPQUFBLEdBQ0U7TUFBQSxLQUFBLEVBQU8sSUFBUDs7OzhCQUVGLFFBQUEsR0FBVSxTQUFDLElBQUQsRUFBTyxRQUFQLEVBQWlCLE9BQWpCLEVBQTBCLE9BQTFCO0FBRVIsYUFBVyxJQUFBLElBQUMsQ0FBQSxPQUFELENBQVMsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNsQixZQUFBO1FBQUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLG1CQUFSO1FBRW5CLFdBQUEsR0FBYyxPQUFPLENBQUMsV0FBUixJQUF1QjtRQUNyQyxXQUFBLEdBQWMsT0FBTyxDQUFDLFdBQVIsSUFBdUI7UUFFckMsTUFBQSxHQUFTO0FBRVQsYUFBUywwRkFBVDtVQUNFLE1BQUEsSUFBVTtBQURaO1FBR0Esa0JBQUEsR0FDRTtVQUFBLE1BQUEsRUFBUyxPQUFPLENBQUMsTUFBakI7VUFDQSxRQUFBLEVBQWEsaUJBQUEsSUFBYSwwQkFBaEIsR0FBdUMsT0FBTyxDQUFDLFFBQS9DLEdBQTZELE9BQU8sQ0FBQyxPQUFSLENBQWdCLG1CQUFoQixDQUR2RTtVQUVBLE1BQUEsRUFBUSxNQUZSOztBQUlGO2lCQUNFLE9BQUEsQ0FBUSxnQkFBQSxDQUFpQixJQUFqQixFQUF1QixrQkFBdkIsQ0FBUixFQURGO1NBQUEsY0FBQTtVQUVNO2lCQUVKLE1BQUEsQ0FBTyxLQUFQLEVBSkY7O01BaEJrQixDQUFUO0lBRkg7Ozs7S0FSbUM7QUFIL0MiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3MgTWFya29CZWF1dGlmaWVyIGV4dGVuZHMgQmVhdXRpZmllclxuXG4gIG5hbWU6ICdNYXJrbyBCZWF1dGlmaWVyJ1xuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9tYXJrby1qcy9tYXJrby1wcmV0dHlwcmludFwiXG5cbiAgb3B0aW9uczpcbiAgICBNYXJrbzogdHJ1ZVxuXG4gIGJlYXV0aWZ5OiAodGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMsIGNvbnRleHQpIC0+XG5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBtYXJrb1ByZXR0eXByaW50ID0gcmVxdWlyZSgnbWFya28tcHJldHR5cHJpbnQnKVxuXG4gICAgICBpbmRlbnRfY2hhciA9IG9wdGlvbnMuaW5kZW50X2NoYXIgfHwgJyAnXG4gICAgICBpbmRlbnRfc2l6ZSA9IG9wdGlvbnMuaW5kZW50X3NpemUgfHwgNFxuXG4gICAgICBpbmRlbnQgPSAnJ1xuXG4gICAgICBmb3IgaSBpbiBbMC4uaW5kZW50X3NpemUgLSAxXVxuICAgICAgICBpbmRlbnQgKz0gaW5kZW50X2NoYXJcblxuICAgICAgcHJldHR5cHJpbnRPcHRpb25zID1cbiAgICAgICAgc3ludGF4IDogb3B0aW9ucy5zeW50YXhcbiAgICAgICAgZmlsZW5hbWU6IGlmIGNvbnRleHQ/IGFuZCBjb250ZXh0LmZpbGVQYXRoPyB0aGVuIGNvbnRleHQuZmlsZVBhdGggZWxzZSByZXF1aXJlLnJlc29sdmUoJ21hcmtvLXByZXR0eXByaW50JylcbiAgICAgICAgaW5kZW50OiBpbmRlbnRcblxuICAgICAgdHJ5XG4gICAgICAgIHJlc29sdmUobWFya29QcmV0dHlwcmludCh0ZXh0LCBwcmV0dHlwcmludE9wdGlvbnMpKVxuICAgICAgY2F0Y2ggZXJyb3JcbiAgICAgICAgIyBFcnJvciBvY2N1cnJlZFxuICAgICAgICByZWplY3QoZXJyb3IpXG4gICAgKVxuIl19
