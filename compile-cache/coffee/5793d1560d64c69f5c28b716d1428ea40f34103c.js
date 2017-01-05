
/*
Language Support and default options.
 */

(function() {
  "use strict";
  var Languages, _, extend;

  _ = require('lodash');

  extend = null;

  module.exports = Languages = (function() {
    Languages.prototype.languageNames = ["apex", "arduino", "bash", "c-sharp", "c", "clojure", "coffeescript", "coldfusion", "cpp", "crystal", "css", "csv", "d", "ejs", "elm", "erb", "erlang", "gherkin", "glsl", "go", "fortran", "handlebars", "haskell", "html", "jade", "java", "javascript", "json", "jsx", "latex", "less", "lua", "markdown", 'marko', "mustache", "nunjucks", "objective-c", "ocaml", "pawn", "perl", "php", "puppet", "python", "r", "riotjs", "ruby", "rust", "sass", "scss", "spacebars", "sql", "svg", "swig", "tss", "twig", "typescript", "ux_markup", "vala", "vue", "visualforce", "xml", "xtemplate"];


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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvaW5kZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBR0E7QUFIQSxNQUFBOztFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUjs7RUFDSixNQUFBLEdBQVM7O0VBR1QsTUFBTSxDQUFDLE9BQVAsR0FBdUI7d0JBSXJCLGFBQUEsR0FBZSxDQUNiLE1BRGEsRUFFYixTQUZhLEVBR2IsTUFIYSxFQUliLFNBSmEsRUFLYixHQUxhLEVBTWIsU0FOYSxFQU9iLGNBUGEsRUFRYixZQVJhLEVBU2IsS0FUYSxFQVViLFNBVmEsRUFXYixLQVhhLEVBWWIsS0FaYSxFQWFiLEdBYmEsRUFjYixLQWRhLEVBZWIsS0FmYSxFQWdCYixLQWhCYSxFQWlCYixRQWpCYSxFQWtCYixTQWxCYSxFQW1CYixNQW5CYSxFQW9CYixJQXBCYSxFQXFCYixTQXJCYSxFQXNCYixZQXRCYSxFQXVCYixTQXZCYSxFQXdCYixNQXhCYSxFQXlCYixNQXpCYSxFQTBCYixNQTFCYSxFQTJCYixZQTNCYSxFQTRCYixNQTVCYSxFQTZCYixLQTdCYSxFQThCYixPQTlCYSxFQStCYixNQS9CYSxFQWdDYixLQWhDYSxFQWlDYixVQWpDYSxFQWtDYixPQWxDYSxFQW1DYixVQW5DYSxFQW9DYixVQXBDYSxFQXFDYixhQXJDYSxFQXNDYixPQXRDYSxFQXVDYixNQXZDYSxFQXdDYixNQXhDYSxFQXlDYixLQXpDYSxFQTBDYixRQTFDYSxFQTJDYixRQTNDYSxFQTRDYixHQTVDYSxFQTZDYixRQTdDYSxFQThDYixNQTlDYSxFQStDYixNQS9DYSxFQWdEYixNQWhEYSxFQWlEYixNQWpEYSxFQWtEYixXQWxEYSxFQW1EYixLQW5EYSxFQW9EYixLQXBEYSxFQXFEYixNQXJEYSxFQXNEYixLQXREYSxFQXVEYixNQXZEYSxFQXdEYixZQXhEYSxFQXlEYixXQXpEYSxFQTBEYixNQTFEYSxFQTJEYixLQTNEYSxFQTREYixhQTVEYSxFQTZEYixLQTdEYSxFQThEYixXQTlEYTs7O0FBaUVmOzs7O3dCQUdBLFNBQUEsR0FBVzs7O0FBRVg7Ozs7d0JBR0EsVUFBQSxHQUFZOzs7QUFFWjs7OztJQUdhLG1CQUFBO01BQ1gsSUFBQyxDQUFBLFNBQUQsR0FBYSxDQUFDLENBQUMsR0FBRixDQUFNLElBQUMsQ0FBQSxhQUFQLEVBQXNCLFNBQUMsSUFBRDtlQUNqQyxPQUFBLENBQVEsSUFBQSxHQUFLLElBQWI7TUFEaUMsQ0FBdEI7TUFHYixJQUFDLENBQUEsVUFBRCxHQUFjLENBQUMsQ0FBQyxHQUFGLENBQU0sSUFBQyxDQUFBLFNBQVAsRUFBa0IsU0FBQyxRQUFEO2VBQWMsUUFBUSxDQUFDO01BQXZCLENBQWxCO0lBSkg7OztBQU1iOzs7O3dCQUdBLFlBQUEsR0FBYyxTQUFDLEdBQUQ7QUFFWixVQUFBO01BRmMsaUJBQU0sMkJBQVcsdUJBQVM7YUFFeEMsQ0FBQyxDQUFDLEtBQUYsQ0FDRSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxTQUFWLEVBQXFCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxPQUFGLENBQVUsUUFBUSxDQUFDLElBQW5CLEVBQXlCLElBQXpCO01BQWQsQ0FBckIsQ0FERixFQUVFLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBQyxDQUFBLFNBQVYsRUFBcUIsU0FBQyxRQUFEO2VBQWMsQ0FBQyxDQUFDLE9BQUYsQ0FBVSxRQUFRLENBQUMsU0FBbkIsRUFBOEIsU0FBOUI7TUFBZCxDQUFyQixDQUZGLEVBR0UsQ0FBQyxDQUFDLE1BQUYsQ0FBUyxJQUFDLENBQUEsU0FBVixFQUFxQixTQUFDLFFBQUQ7ZUFBYyxDQUFDLENBQUMsUUFBRixDQUFXLFFBQVEsQ0FBQyxRQUFwQixFQUE4QixPQUE5QjtNQUFkLENBQXJCLENBSEYsRUFJRSxDQUFDLENBQUMsTUFBRixDQUFTLElBQUMsQ0FBQSxTQUFWLEVBQXFCLFNBQUMsUUFBRDtlQUFjLENBQUMsQ0FBQyxRQUFGLENBQVcsUUFBUSxDQUFDLFVBQXBCLEVBQWdDLFNBQWhDO01BQWQsQ0FBckIsQ0FKRjtJQUZZOzs7OztBQXBHaEIiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbkxhbmd1YWdlIFN1cHBvcnQgYW5kIGRlZmF1bHQgb3B0aW9ucy5cbiMjI1xuXCJ1c2Ugc3RyaWN0XCJcbiMgTGF6eSBsb2FkZWQgZGVwZW5kZW5jaWVzXG5fID0gcmVxdWlyZSgnbG9kYXNoJylcbmV4dGVuZCA9IG51bGxcblxuI1xubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBMYW5ndWFnZXNcblxuICAjIFN1cHBvcnRlZCB1bmlxdWUgY29uZmlndXJhdGlvbiBrZXlzXG4gICMgVXNlZCBmb3IgZGV0ZWN0aW5nIG5lc3RlZCBjb25maWd1cmF0aW9ucyBpbiAuanNiZWF1dGlmeXJjXG4gIGxhbmd1YWdlTmFtZXM6IFtcbiAgICBcImFwZXhcIlxuICAgIFwiYXJkdWlub1wiXG4gICAgXCJiYXNoXCJcbiAgICBcImMtc2hhcnBcIlxuICAgIFwiY1wiXG4gICAgXCJjbG9qdXJlXCJcbiAgICBcImNvZmZlZXNjcmlwdFwiXG4gICAgXCJjb2xkZnVzaW9uXCJcbiAgICBcImNwcFwiXG4gICAgXCJjcnlzdGFsXCJcbiAgICBcImNzc1wiXG4gICAgXCJjc3ZcIlxuICAgIFwiZFwiXG4gICAgXCJlanNcIlxuICAgIFwiZWxtXCJcbiAgICBcImVyYlwiXG4gICAgXCJlcmxhbmdcIlxuICAgIFwiZ2hlcmtpblwiXG4gICAgXCJnbHNsXCJcbiAgICBcImdvXCJcbiAgICBcImZvcnRyYW5cIlxuICAgIFwiaGFuZGxlYmFyc1wiXG4gICAgXCJoYXNrZWxsXCJcbiAgICBcImh0bWxcIlxuICAgIFwiamFkZVwiXG4gICAgXCJqYXZhXCJcbiAgICBcImphdmFzY3JpcHRcIlxuICAgIFwianNvblwiXG4gICAgXCJqc3hcIlxuICAgIFwibGF0ZXhcIlxuICAgIFwibGVzc1wiXG4gICAgXCJsdWFcIlxuICAgIFwibWFya2Rvd25cIlxuICAgICdtYXJrbydcbiAgICBcIm11c3RhY2hlXCJcbiAgICBcIm51bmp1Y2tzXCJcbiAgICBcIm9iamVjdGl2ZS1jXCJcbiAgICBcIm9jYW1sXCJcbiAgICBcInBhd25cIlxuICAgIFwicGVybFwiXG4gICAgXCJwaHBcIlxuICAgIFwicHVwcGV0XCJcbiAgICBcInB5dGhvblwiXG4gICAgXCJyXCJcbiAgICBcInJpb3Rqc1wiXG4gICAgXCJydWJ5XCJcbiAgICBcInJ1c3RcIlxuICAgIFwic2Fzc1wiXG4gICAgXCJzY3NzXCJcbiAgICBcInNwYWNlYmFyc1wiXG4gICAgXCJzcWxcIlxuICAgIFwic3ZnXCJcbiAgICBcInN3aWdcIlxuICAgIFwidHNzXCJcbiAgICBcInR3aWdcIlxuICAgIFwidHlwZXNjcmlwdFwiXG4gICAgXCJ1eF9tYXJrdXBcIlxuICAgIFwidmFsYVwiXG4gICAgXCJ2dWVcIlxuICAgIFwidmlzdWFsZm9yY2VcIlxuICAgIFwieG1sXCJcbiAgICBcInh0ZW1wbGF0ZVwiXG4gIF1cblxuICAjIyNcbiAgTGFuZ3VhZ2VzXG4gICMjI1xuICBsYW5ndWFnZXM6IG51bGxcblxuICAjIyNcbiAgTmFtZXNwYWNlc1xuICAjIyNcbiAgbmFtZXNwYWNlczogbnVsbFxuXG4gICMjI1xuICBDb25zdHJ1Y3RvclxuICAjIyNcbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQGxhbmd1YWdlcyA9IF8ubWFwKEBsYW5ndWFnZU5hbWVzLCAobmFtZSkgLT5cbiAgICAgIHJlcXVpcmUoXCIuLyN7bmFtZX1cIilcbiAgICApXG4gICAgQG5hbWVzcGFjZXMgPSBfLm1hcChAbGFuZ3VhZ2VzLCAobGFuZ3VhZ2UpIC0+IGxhbmd1YWdlLm5hbWVzcGFjZSlcblxuICAjIyNcbiAgR2V0IGxhbmd1YWdlIGZvciBncmFtbWFyIGFuZCBleHRlbnNpb25cbiAgIyMjXG4gIGdldExhbmd1YWdlczogKHtuYW1lLCBuYW1lc3BhY2UsIGdyYW1tYXIsIGV4dGVuc2lvbn0pIC0+XG4gICAgIyBjb25zb2xlLmxvZygnZ2V0TGFuZ3VhZ2VzJywgbmFtZSwgbmFtZXNwYWNlLCBncmFtbWFyLCBleHRlbnNpb24sIEBsYW5ndWFnZXMpXG4gICAgXy51bmlvbihcbiAgICAgIF8uZmlsdGVyKEBsYW5ndWFnZXMsIChsYW5ndWFnZSkgLT4gXy5pc0VxdWFsKGxhbmd1YWdlLm5hbWUsIG5hbWUpKVxuICAgICAgXy5maWx0ZXIoQGxhbmd1YWdlcywgKGxhbmd1YWdlKSAtPiBfLmlzRXF1YWwobGFuZ3VhZ2UubmFtZXNwYWNlLCBuYW1lc3BhY2UpKVxuICAgICAgXy5maWx0ZXIoQGxhbmd1YWdlcywgKGxhbmd1YWdlKSAtPiBfLmluY2x1ZGVzKGxhbmd1YWdlLmdyYW1tYXJzLCBncmFtbWFyKSlcbiAgICAgIF8uZmlsdGVyKEBsYW5ndWFnZXMsIChsYW5ndWFnZSkgLT4gXy5pbmNsdWRlcyhsYW5ndWFnZS5leHRlbnNpb25zLCBleHRlbnNpb24pKVxuICAgIClcbiJdfQ==
