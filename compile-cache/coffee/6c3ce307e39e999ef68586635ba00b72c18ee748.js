(function() {
  var defaultIndentChar, defaultIndentSize, defaultIndentWithTabs, ref, ref1, scope, softTabs, tabLength;

  scope = ['source.js'];

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
    name: "LaTeX",
    namespace: "latex",

    /*
    Supported Grammars
     */
    grammars: ["LaTeX"],

    /*
    Supported extensions
     */
    extensions: ["tex"],
    defaultBeautifier: "Latex Beautify",

    /*
     */
    options: {
      indent_char: {
        type: 'string',
        "default": defaultIndentChar,
        description: "Indentation character"
      },
      indent_with_tabs: {
        type: 'boolean',
        "default": true,
        description: "Indentation uses tabs, overrides `Indent Size` and `Indent Char`"
      },
      indent_preamble: {
        type: 'boolean',
        "default": false,
        description: "Indent the preable"
      },
      always_look_for_split_braces: {
        type: 'boolean',
        "default": true,
        description: "If `latexindent` should look for commands that split braces across lines"
      },
      always_look_for_split_brackets: {
        type: 'boolean',
        "default": false,
        description: "If `latexindent` should look for commands that split brackets across lines"
      },
      remove_trailing_whitespace: {
        type: 'boolean',
        "default": false,
        description: "Remove trailing whitespace"
      },
      align_columns_in_environments: {
        type: 'array',
        "default": ["tabular", "matrix", "bmatrix", "pmatrix"],
        decription: "Aligns columns by the alignment tabs for environments specified"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvbGF0ZXguY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0FBQUEsTUFBQTs7RUFBQSxLQUFBLEdBQVEsQ0FBQyxXQUFEOztFQUNSLFNBQUE7OytCQUFpRTs7RUFDakUsUUFBQTs7Z0NBQStEOztFQUMvRCxpQkFBQSxHQUFvQixDQUFJLFFBQUgsR0FBaUIsU0FBakIsR0FBZ0MsQ0FBakM7O0VBQ3BCLGlCQUFBLEdBQW9CLENBQUksUUFBSCxHQUFpQixHQUFqQixHQUEwQixJQUEzQjs7RUFDcEIscUJBQUEsR0FBd0IsQ0FBSTs7RUFFNUIsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sT0FGUztJQUdmLFNBQUEsRUFBVyxPQUhJOztBQUtmOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixPQURRLENBUks7O0FBWWY7OztJQUdBLFVBQUEsRUFBWSxDQUNWLEtBRFUsQ0FmRztJQW1CZixpQkFBQSxFQUFtQixnQkFuQko7O0FBcUJmOztJQUdBLE9BQUEsRUFDRTtNQUFBLFdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxRQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxpQkFEVDtRQUVBLFdBQUEsRUFBYSx1QkFGYjtPQURGO01BSUEsZ0JBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLGtFQUZiO09BTEY7TUFRQSxlQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSxvQkFGYjtPQVRGO01BWUEsNEJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLDBFQUZiO09BYkY7TUFnQkEsOEJBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQURUO1FBRUEsV0FBQSxFQUFhLDRFQUZiO09BakJGO01Bb0JBLDBCQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtRQUVBLFdBQUEsRUFBYSw0QkFGYjtPQXJCRjtNQXdCQSw2QkFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLE9BQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFRLENBQUMsU0FBRCxFQUFZLFFBQVosRUFBc0IsU0FBdEIsRUFBaUMsU0FBakMsQ0FEUjtRQUVBLFVBQUEsRUFBWSxpRUFGWjtPQXpCRjtLQXpCYTs7QUFQakIiLCJzb3VyY2VzQ29udGVudCI6WyIjIEdldCBBdG9tIGRlZmF1bHRzXG5zY29wZSA9IFsnc291cmNlLmpzJ11cbnRhYkxlbmd0aCA9IGF0b20/LmNvbmZpZy5nZXQoJ2VkaXRvci50YWJMZW5ndGgnLCBzY29wZTogc2NvcGUpID8gNFxuc29mdFRhYnMgPSBhdG9tPy5jb25maWcuZ2V0KCdlZGl0b3Iuc29mdFRhYnMnLCBzY29wZTogc2NvcGUpID8gdHJ1ZVxuZGVmYXVsdEluZGVudFNpemUgPSAoaWYgc29mdFRhYnMgdGhlbiB0YWJMZW5ndGggZWxzZSAxKVxuZGVmYXVsdEluZGVudENoYXIgPSAoaWYgc29mdFRhYnMgdGhlbiBcIiBcIiBlbHNlIFwiXFx0XCIpXG5kZWZhdWx0SW5kZW50V2l0aFRhYnMgPSBub3Qgc29mdFRhYnNcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cbiAgbmFtZTogXCJMYVRlWFwiXG4gIG5hbWVzcGFjZTogXCJsYXRleFwiXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIkxhVGVYXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwidGV4XCJcbiAgXVxuXG4gIGRlZmF1bHRCZWF1dGlmaWVyOiBcIkxhdGV4IEJlYXV0aWZ5XCJcblxuICAjIyNcblxuICAjIyNcbiAgb3B0aW9uczpcbiAgICBpbmRlbnRfY2hhcjpcbiAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICBkZWZhdWx0OiBkZWZhdWx0SW5kZW50Q2hhclxuICAgICAgZGVzY3JpcHRpb246IFwiSW5kZW50YXRpb24gY2hhcmFjdGVyXCJcbiAgICBpbmRlbnRfd2l0aF90YWJzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiB1c2VzIHRhYnMsIG92ZXJyaWRlcyBgSW5kZW50IFNpemVgIGFuZCBgSW5kZW50IENoYXJgXCJcbiAgICBpbmRlbnRfcHJlYW1ibGU6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnQgdGhlIHByZWFibGVcIlxuICAgIGFsd2F5c19sb29rX2Zvcl9zcGxpdF9icmFjZXM6XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiBcIklmIGBsYXRleGluZGVudGAgc2hvdWxkIGxvb2sgZm9yIGNvbW1hbmRzIHRoYXQgc3BsaXQgYnJhY2VzIGFjcm9zcyBsaW5lc1wiXG4gICAgYWx3YXlzX2xvb2tfZm9yX3NwbGl0X2JyYWNrZXRzOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiSWYgYGxhdGV4aW5kZW50YCBzaG91bGQgbG9vayBmb3IgY29tbWFuZHMgdGhhdCBzcGxpdCBicmFja2V0cyBhY3Jvc3MgbGluZXNcIlxuICAgIHJlbW92ZV90cmFpbGluZ193aGl0ZXNwYWNlOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgZGVzY3JpcHRpb246IFwiUmVtb3ZlIHRyYWlsaW5nIHdoaXRlc3BhY2VcIlxuICAgIGFsaWduX2NvbHVtbnNfaW5fZW52aXJvbm1lbnRzOlxuICAgICAgdHlwZTogJ2FycmF5J1xuICAgICAgZGVmYXVsdDpbXCJ0YWJ1bGFyXCIsIFwibWF0cml4XCIsIFwiYm1hdHJpeFwiLCBcInBtYXRyaXhcIl1cbiAgICAgIGRlY3JpcHRpb246IFwiQWxpZ25zIGNvbHVtbnMgYnkgdGhlIGFsaWdubWVudCB0YWJzIGZvciBlbnZpcm9ubWVudHMgc3BlY2lmaWVkXCJcbn1cbiJdfQ==
