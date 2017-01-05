
/*
Language Support and default options.
 */

(function() {
  "use strict";
  var Languages, _, extend;

  _ = require('lodash');

  extend = null;

  module.exports = Languages = (function() {
    Languages.prototype.languageNames = ["apex", "arduino", "c-sharp", "c", "clojure", "coffeescript", "coldfusion", "cpp", "crystal", "css", "csv", "d", "ejs", "elm", "erb", "erlang", "gherkin", "go", "fortran", "handlebars", "haskell", "html", "jade", "java", "javascript", "json", "jsx", "latex", "less", "lua", "markdown", 'marko', "mustache", "nunjucks", "objective-c", "ocaml", "pawn", "perl", "php", "puppet", "python", "r", "riotjs", "ruby", "rust", "sass", "scss", "spacebars", "sql", "svg", "swig", "tss", "twig", "typescript", "ux_markup", "vala", "vue", "visualforce", "xml", "xtemplate"];


    /*
    Languages
     */

    Languages.prototype.languages = null;


    /*
    Namespaces
     */

    Languages.prototype.namespaces = null;


    /*
    Constructor
     */

    function Languages() {
      this.languages = _.map(this.languageNames, function(name) {
        return require("./" + name);
      });
      this.namespaces = _.map(this.languages, function(language) {
        return language.namespace;
      });
    }


    /*
    Get language for grammar and extension
     */

    Languages.prototype.getLanguages = function(arg) {
      var extension, grammar, name, namespace;
      name = arg.name, namespace = arg.namespace, grammar = arg.grammar, extension = arg.extension;
      return _.union(_.filter(this.languages, function(language) {
        return _.isEqual(language.name, name);
      }), _.filter(this.languages, function(language) {
        return _.isEqual(language.namespace, namespace);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.grammars, grammar);
      }), _.filter(this.languages, function(language) {
        return _.includes(language.extensions, extension);
      }));
    };

    return Languages;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBR0E7QUFIQSxNQUFBOztFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixNQUFBLEdBQVM7O0VBR1QsTUFBTSxDQUFDLE9BQVAsR0FBdUI7d0JBSXJCLGFBQUEsR0FBZSxDQUNiLE1BRGEsRUFFYixTQUZhLEVBR2IsU0FIYSxFQUliLEdBSmEsRUFLYixTQUxhLEVBTWIsY0FOYSxFQU9iLFlBUGEsRUFRYixLQVJhLEVBU2IsU0FUYSxFQVViLEtBVmEsRUFXYixLQVhhLEVBWWIsR0FaYSxFQWFiLEtBYmEsRUFjYixLQWRhLEVBZWIsS0FmYSxFQWdCYixRQWhCYSxFQWlCYixTQWpCYSxFQWtCYixJQWxCYSxFQW1CYixTQW5CYSxFQW9CYixZQXBCYSxFQXFCYixTQXJCYSxFQXNCYixNQXRCYSxFQXVCYixNQXZCYSxFQXdCYixNQXhCYSxFQXlCYixZQXpCYSxFQTBCYixNQTFCYSxFQTJCYixLQTNCYSxFQTRCYixPQTVCYSxFQTZCYixNQTdCYSxFQThCYixLQTlCYSxFQStCYixVQS9CYSxFQWdDYixPQWhDYSxFQWlDYixVQWpDYSxFQWtDYixVQWxDYSxFQW1DYixhQW5DYSxFQW9DYixPQXBDYSxFQXFDYixNQXJDYSxFQXNDYixNQXRDYSxFQXVDYixLQXZDYSxFQXdDYixRQXhDYSxFQXlDYixRQXpDYSxFQTBDYixHQTFDYSxFQTJDYixRQTNDYSxFQTRDYixNQTVDYSxFQTZDYixNQTdDYSxFQThDYixNQTlDYSxFQStDYixNQS9DYSxFQWdEYixXQWhEYSxFQWlEYixLQWpEYSxFQWtEYixLQWxEYSxFQW1EYixNQW5EYSxFQW9EYixLQXBEYSxFQXFEYixNQXJEYSxFQXNEYixZQXREYSxFQXVEYixXQXZEYSxFQXdEYixNQXhEYSxFQXlEYixLQXpEYSxFQTBEYixhQTFEYSxFQTJEYixLQTNEYSxFQTREYixXQTVEYTs7O0FBK0RmOzs7O3dCQUdBLFNBQUEsR0FBVzs7O0FBRVg7Ozs7d0JBR0EsVUFBQSxHQUFZOzs7QUFFWjs7OztJQUdhLG1CQUFBO01BQ1gsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFDLENBQUMsR0FBRixDQUFNLElBQUMsQ0FBQSxhQUFQLEVBQXNCLFNBQUMsSUFBRDtlQUNqQyxPQUFBLENBQVEsSUFBQSxHQUFLLElBQWI7TUFEaUMsQ0FBdEI7TUFHYixJQUFDLENBQUEsVUFBRCxHQUFjLENBQUMsQ0FBQyxHQUFGLENBQU0sSUFBQyxDQUFBLFNBQVAsRUFBa0IsU0FBQyxRQUFEO2VBQWMsUUFBUSxDQUFDO01BQXZCLENBQWxCO0lBSkg7OztBQU1iOzs7O3dCQUdBLFlBQUEsR0FBYyxTQUFDLEdBQUQ7QUFFWixVQUFBO01BRmMsaUJBQU0sMkJBQVcsdUJBQVM7YUFFeEMsQ0FBQyxDQUFDLEtBQUYsQ0FDRSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxTQUFWLEVBQXFCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxPQUFGLENBQVUsUUFBUSxDQUFDLElBQW5CLEVBQXlCLElBQXpCO01BQWQsQ0FBckIsQ0FERixFQUVFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFEO2VBQWMsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxRQUFRLENBQUMsU0FBbkIsRUFBOEIsU0FBOUI7TUFBZCxDQUFyQixDQUZGLEVBR0UsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsU0FBVixFQUFxQixTQUFDLFFBQUQ7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxRQUFwQixFQUE4QixPQUE5QjtNQUFkLENBQXJCLENBSEYsRUFJRSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxTQUFWLEVBQXFCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxRQUFGLENBQVcsUUFBUSxDQUFDLFVBQXBCLEVBQWdDLFNBQWhDO01BQWQsQ0FBckIsQ0FKRjtJQUZZOzs7OztBQWxHaEIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbkxhbmd1YWdlIFN1cHBvcnQgYW5kIGRlZmF1bHQgb3B0aW9ucy5cbiMjI1xuXCJ1c2Ugc3RyaWN0XCJcbiMgTGF6eSBsb2FkZWQgZGVwZW5kZW5jaWVzXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcbmV4dGVuZCA9IG51bGxcblxuI1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBMYW5ndWFnZXNcblxuICAjIFN1cHBvcnRlZCB1bmlxdWUgY29uZmlndXJhdGlvbiBrZXlzXG4gICMgVXNlZCBmb3IgZGV0ZWN0aW5nIG5lc3RlZCBjb25maWd1cmF0aW9ucyBpbiAuanNiZWF1dGlmeXJjXG4gIGxhbmd1YWdlTmFtZXM6IFtcbiAgICBcImFwZXhcIlxuICAgIFwiYXJkdWlub1wiXG4gICAgXCJjLXNoYXJwXCJcbiAgICBcImNcIlxuICAgIFwiY2xvanVyZVwiXG4gICAgXCJjb2ZmZWVzY3JpcHRcIlxuICAgIFwiY29sZGZ1c2lvblwiXG4gICAgXCJjcHBcIlxuICAgIFwiY3J5c3RhbFwiXG4gICAgXCJjc3NcIlxuICAgIFwiY3N2XCJcbiAgICBcImRcIlxuICAgIFwiZWpzXCJcbiAgICBcImVsbVwiXG4gICAgXCJlcmJcIlxuICAgIFwiZXJsYW5nXCJcbiAgICBcImdoZXJraW5cIlxuICAgIFwiZ29cIlxuICAgIFwiZm9ydHJhblwiXG4gICAgXCJoYW5kbGViYXJzXCJcbiAgICBcImhhc2tlbGxcIlxuICAgIFwiaHRtbFwiXG4gICAgXCJqYWRlXCJcbiAgICBcImphdmFcIlxuICAgIFwiamF2YXNjcmlwdFwiXG4gICAgXCJqc29uXCJcbiAgICBcImpzeFwiXG4gICAgXCJsYXRleFwiXG4gICAgXCJsZXNzXCJcbiAgICBcImx1YVwiXG4gICAgXCJtYXJrZG93blwiXG4gICAgJ21hcmtvJ1xuICAgIFwibXVzdGFjaGVcIlxuICAgIFwibnVuanVja3NcIlxuICAgIFwib2JqZWN0aXZlLWNcIlxuICAgIFwib2NhbWxcIlxuICAgIFwicGF3blwiXG4gICAgXCJwZXJsXCJcbiAgICBcInBocFwiXG4gICAgXCJwdXBwZXRcIlxuICAgIFwicHl0aG9uXCJcbiAgICBcInJcIlxuICAgIFwicmlvdGpzXCJcbiAgICBcInJ1YnlcIlxuICAgIFwicnVzdFwiXG4gICAgXCJzYXNzXCJcbiAgICBcInNjc3NcIlxuICAgIFwic3BhY2ViYXJzXCJcbiAgICBcInNxbFwiXG4gICAgXCJzdmdcIlxuICAgIFwic3dpZ1wiXG4gICAgXCJ0c3NcIlxuICAgIFwidHdpZ1wiXG4gICAgXCJ0eXBlc2NyaXB0XCJcbiAgICBcInV4X21hcmt1cFwiXG4gICAgXCJ2YWxhXCJcbiAgICBcInZ1ZVwiXG4gICAgXCJ2aXN1YWxmb3JjZVwiXG4gICAgXCJ4bWxcIlxuICAgIFwieHRlbXBsYXRlXCJcbiAgXVxuXG4gICMjI1xuICBMYW5ndWFnZXNcbiAgIyMjXG4gIGxhbmd1YWdlczogbnVsbFxuXG4gICMjI1xuICBOYW1lc3BhY2VzXG4gICMjI1xuICBuYW1lc3BhY2VzOiBudWxsXG5cbiAgIyMjXG4gIENvbnN0cnVjdG9yXG4gICMjI1xuICBjb25zdHJ1Y3RvcjogLT5cbiAgICBAbGFuZ3VhZ2VzID0gXy5tYXAoQGxhbmd1YWdlTmFtZXMsIChuYW1lKSAtPlxuICAgICAgcmVxdWlyZShcIi4vI3tuYW1lfVwiKVxuICAgIClcbiAgICBAbmFtZXNwYWNlcyA9IF8ubWFwKEBsYW5ndWFnZXMsIChsYW5ndWFnZSkgLT4gbGFuZ3VhZ2UubmFtZXNwYWNlKVxuXG4gICMjI1xuICBHZXQgbGFuZ3VhZ2UgZm9yIGdyYW1tYXIgYW5kIGV4dGVuc2lvblxuICAjIyNcbiAgZ2V0TGFuZ3VhZ2VzOiAoe25hbWUsIG5hbWVzcGFjZSwgZ3JhbW1hciwgZXh0ZW5zaW9ufSkgLT5cbiAgICAjIGNvbnNvbGUubG9nKCdnZXRMYW5ndWFnZXMnLCBuYW1lLCBuYW1lc3BhY2UsIGdyYW1tYXIsIGV4dGVuc2lvbiwgQGxhbmd1YWdlcylcbiAgICBfLnVuaW9uKFxuICAgICAgXy5maWx0ZXIoQGxhbmd1YWdlcywgKGxhbmd1YWdlKSAtPiBfLmlzRXF1YWwobGFuZ3VhZ2UubmFtZSwgbmFtZSkpXG4gICAgICBfLmZpbHRlcihAbGFuZ3VhZ2VzLCAobGFuZ3VhZ2UpIC0+IF8uaXNFcXVhbChsYW5ndWFnZS5uYW1lc3BhY2UsIG5hbWVzcGFjZSkpXG4gICAgICBfLmZpbHRlcihAbGFuZ3VhZ2VzLCAobGFuZ3VhZ2UpIC0+IF8uaW5jbHVkZXMobGFuZ3VhZ2UuZ3JhbW1hcnMsIGdyYW1tYXIpKVxuICAgICAgXy5maWx0ZXIoQGxhbmd1YWdlcywgKGxhbmd1YWdlKSAtPiBfLmluY2x1ZGVzKGxhbmd1YWdlLmV4dGVuc2lvbnMsIGV4dGVuc2lvbikpXG4gICAgKVxuIl19
