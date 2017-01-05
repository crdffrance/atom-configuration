(function() {
  var defaultIndentSize, ref, ref1, scope, softTabs, tabLength;

  scope = ['source.sh', 'source.bash'];

  tabLength = (ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.tabLength', {
    scope: scope
  }) : void 0) != null ? ref : 2;

  softTabs = (ref1 = typeof atom !== "undefined" && atom !== null ? atom.config.get('editor.softTabs', {
    scope: scope
  }) : void 0) != null ? ref1 : true;

  defaultIndentSize = (softTabs ? tabLength : 1);

  module.exports = {
    name: "Bash",
    namespace: "bash",

    /*
    Supported Grammars
     */
    grammars: ["Shell Script"],
    defaultBeautifier: "beautysh",

    /*
    Supported extensions
     */
    extensions: ["bash", "sh"],
    options: {
      indent_size: {
        type: 'integer',
        "default": defaultIndentSize,
        minimum: 0,
        description: "Indentation size/length"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvYmFzaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEtBQUEsR0FBUSxDQUFDLFdBQUQsRUFBYyxhQUFkOztFQUNSLFNBQUE7OytCQUFpRTs7RUFDakUsUUFBQTs7Z0NBQStEOztFQUMvRCxpQkFBQSxHQUFvQixDQUFJLFFBQUgsR0FBaUIsU0FBakIsR0FBZ0MsQ0FBakM7O0VBRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBRWYsSUFBQSxFQUFNLE1BRlM7SUFHZixTQUFBLEVBQVcsTUFISTs7QUFLZjs7O0lBR0EsUUFBQSxFQUFVLENBQ1IsY0FEUSxDQVJLO0lBWWYsaUJBQUEsRUFBbUIsVUFaSjs7QUFjZjs7O0lBR0EsVUFBQSxFQUFZLENBQ1YsTUFEVSxFQUVWLElBRlUsQ0FqQkc7SUFzQmYsT0FBQSxFQUNFO01BQUEsV0FBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLGlCQURUO1FBRUEsT0FBQSxFQUFTLENBRlQ7UUFHQSxXQUFBLEVBQWEseUJBSGI7T0FERjtLQXZCYTs7QUFMakIiLCJzb3VyY2VzQ29udGVudCI6WyJzY29wZSA9IFsnc291cmNlLnNoJywgJ3NvdXJjZS5iYXNoJ11cbnRhYkxlbmd0aCA9IGF0b20/LmNvbmZpZy5nZXQoJ2VkaXRvci50YWJMZW5ndGgnLCBzY29wZTogc2NvcGUpID8gMlxuc29mdFRhYnMgPSBhdG9tPy5jb25maWcuZ2V0KCdlZGl0b3Iuc29mdFRhYnMnLCBzY29wZTogc2NvcGUpID8gdHJ1ZVxuZGVmYXVsdEluZGVudFNpemUgPSAoaWYgc29mdFRhYnMgdGhlbiB0YWJMZW5ndGggZWxzZSAxKVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIkJhc2hcIlxuICBuYW1lc3BhY2U6IFwiYmFzaFwiXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBHcmFtbWFyc1xuICAjIyNcbiAgZ3JhbW1hcnM6IFtcbiAgICBcIlNoZWxsIFNjcmlwdFwiXG4gIF1cblxuICBkZWZhdWx0QmVhdXRpZmllcjogXCJiZWF1dHlzaFwiXG5cbiAgIyMjXG4gIFN1cHBvcnRlZCBleHRlbnNpb25zXG4gICMjI1xuICBleHRlbnNpb25zOiBbXG4gICAgXCJiYXNoXCJcbiAgICBcInNoXCJcbiAgXVxuXG4gIG9wdGlvbnM6XG4gICAgaW5kZW50X3NpemU6XG4gICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgIGRlZmF1bHQ6IGRlZmF1bHRJbmRlbnRTaXplXG4gICAgICBtaW5pbXVtOiAwXG4gICAgICBkZXNjcmlwdGlvbjogXCJJbmRlbnRhdGlvbiBzaXplL2xlbmd0aFwiXG5cbn1cbiJdfQ==
