(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, ref, ref1, scope, softTabs, tabLength;

  scope = ['text.jade'];

  tabLength = (ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.tabLength', {
    scope: scope
  }) : void 0) != null ? ref : 4;

  softTabs = (ref1 = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.softTabs', {
    scope: scope
  }) : void 0) != null ? ref1 : true;

  defaultIndentSize = (softTabs ? tabLength : 1);

  defaultIndentChar = (softTabs ? " " : "\t");

  defaultIndentWithTabs = !softTabs;

  module.exports = {
    name: "Jade",
    namespace: "jade",
    fallback: ['html'],

    /*
    Supported Grammars
     */
    grammars: ["Jade", "Pug"],

    /*
    Supported extensions
     */
    extensions: ["jade", "pug"],
    options: [
      {
        indent_size: {
          type: 'integer',
          "default": defaultIndentSize,
          minimum: 0,
          description: "Indentation size/length"
        },
        indent_char: {
          type: 'string',
          "default": defaultIndentChar,
          description: "Indentation character"
        },
        omit_div: {
          type: 'boolean',
          "default": false,
          description: "Whether to omit/remove the 'div' tags."
        }
      }
    ],
    defaultBeautifier: "Pug Beautify"
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvamFkZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7QUFBQSxNQUFBOztFQUFBLEtBQUEsR0FBUSxDQUFDLFdBQUQ7O0VBQ1IsU0FBQTs7K0JBQWlFOztFQUNqRSxRQUFBOztnQ0FBK0Q7O0VBQy9ELGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixTQUFqQixHQUFnQyxDQUFqQzs7RUFDcEIsaUJBQUEsR0FBb0IsQ0FBSSxRQUFILEdBQWlCLEdBQWpCLEdBQTBCLElBQTNCOztFQUNwQixxQkFBQSxHQUF3QixDQUFJOztFQUU1QixNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxNQUZTO0lBR2YsU0FBQSxFQUFXLE1BSEk7SUFJZixRQUFBLEVBQVUsQ0FBQyxNQUFELENBSks7O0FBTWY7OztJQUdBLFFBQUEsRUFBVSxDQUNSLE1BRFEsRUFDQSxLQURBLENBVEs7O0FBYWY7OztJQUdBLFVBQUEsRUFBWSxDQUNWLE1BRFUsRUFDRixLQURFLENBaEJHO0lBb0JmLE9BQUEsRUFBUztNQUNQO1FBQUEsV0FBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47VUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGlCQURUO1VBRUEsT0FBQSxFQUFTLENBRlQ7VUFHQSxXQUFBLEVBQWEseUJBSGI7U0FERjtRQUtBLFdBQUEsRUFDRTtVQUFBLElBQUEsRUFBTSxRQUFOO1VBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxpQkFEVDtVQUVBLFdBQUEsRUFBYSx1QkFGYjtTQU5GO1FBU0EsUUFBQSxFQUNFO1VBQUEsSUFBQSxFQUFNLFNBQU47VUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7VUFFQSxXQUFBLEVBQWEsd0NBRmI7U0FWRjtPQURPO0tBcEJNO0lBb0NmLGlCQUFBLEVBQW1CLGNBcENKOztBQVBqQiIsInNvdXJjZXNDb250ZW50IjpbIiMgR2V0IEF0b20gZGVmYXVsdHNcbnNjb3BlID0gWyd0ZXh0LmphZGUnXVxudGFiTGVuZ3RoID0gYXRvbT8uY29uZmlnLmdldCgnZWRpdG9yLnRhYkxlbmd0aCcsIHNjb3BlOiBzY29wZSkgPyA0XG5zb2Z0VGFicyA9IGF0b20/LmNvbmZpZy5nZXQoJ2VkaXRvci5zb2Z0VGFicycsIHNjb3BlOiBzY29wZSkgPyB0cnVlXG5kZWZhdWx0SW5kZW50U2l6ZSA9IChpZiBzb2Z0VGFicyB0aGVuIHRhYkxlbmd0aCBlbHNlIDEpXG5kZWZhdWx0SW5kZW50Q2hhciA9IChpZiBzb2Z0VGFicyB0aGVuIFwiIFwiIGVsc2UgXCJcXHRcIilcbmRlZmF1bHRJbmRlbnRXaXRoVGFicyA9IG5vdCBzb2Z0VGFic1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIkphZGVcIlxuICBuYW1lc3BhY2U6IFwiamFkZVwiXG4gIGZhbGxiYWNrOiBbJ2h0bWwnXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgR3JhbW1hcnNcbiAgIyMjXG4gIGdyYW1tYXJzOiBbXG4gICAgXCJKYWRlXCIsIFwiUHVnXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwiamFkZVwiLCBcInB1Z1wiXG4gIF1cblxuICBvcHRpb25zOiBbXG4gICAgaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRJbmRlbnRTaXplXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG4gICAgaW5kZW50X2NoYXI6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogZGVmYXVsdEluZGVudENoYXJcbiAgICAgIGRlc2NyaXB0aW9uOiBcIkluZGVudGF0aW9uIGNoYXJhY3RlclwiXG4gICAgb21pdF9kaXY6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJXaGV0aGVyIHRvIG9taXQvcmVtb3ZlIHRoZSAnZGl2JyB0YWdzLlwiXG4gIF1cblxuICBkZWZhdWx0QmVhdXRpZmllcjogXCJQdWcgQmVhdXRpZnlcIlxuXG59XG4iXX0=
