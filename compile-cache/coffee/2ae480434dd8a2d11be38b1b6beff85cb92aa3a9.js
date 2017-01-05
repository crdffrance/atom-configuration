(function() {
  module.exports = {
    includeStagedDiff: {
      title: 'Include staged diffs?',
      type: 'boolean',
      "default": true
    },
    openInPane: {
      type: 'boolean',
      "default": true,
      description: 'Allow commands to open new panes'
    },
    splitPane: {
      title: 'Split pane direction',
      type: 'string',
      "default": 'Down',
      description: 'Where should new panes go? (Defaults to Right)',
      "enum": ['Up', 'Right', 'Down', 'Left']
    },
    wordDiff: {
      type: 'boolean',
      "default": true,
      description: 'Should word diffs be highlighted in diffs?'
    },
    syntaxHighlighting: {
      title: 'Enable syntax highlighting in diffs?',
      type: 'boolean',
      "default": true
    },
    numberOfCommitsToShow: {
      type: 'integer',
      "default": 25,
      minimum: 1
    },
    gitPath: {
      type: 'string',
      "default": 'git',
      description: 'Where is your git?'
    },
    messageTimeout: {
      type: 'integer',
      "default": 5,
      description: 'How long should success/error messages be shown?'
    },
    showFormat: {
      description: 'Which format to use for git show? (none will use your git config default)',
      type: 'string',
      "default": 'full',
      "enum": ['oneline', 'short', 'medium', 'full', 'fuller', 'email', 'raw', 'none']
    },
    pullBeforePush: {
      description: 'Pull from remote before pushing',
      type: 'boolean',
      "default": false
    },
    pullRebase: {
      description: 'Pull with --rebase flag',
      type: 'boolean',
      "default": false
    },
    experimental: {
      description: 'Enable beta features and behavior',
      type: 'boolean',
      "default": false
    },
    verboseCommits: {
      description: 'Show diffs in commit pane?',
      type: 'boolean',
      "default": false
    },
    alwaysPullFromUpstream: {
      description: 'Always pull from current branch upstream?',
      type: 'boolean',
      "default": false
    },
    enableStatusBarIcon: {
      type: 'boolean',
      "default": true
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxpQkFBQSxFQUNFO01BQUEsS0FBQSxFQUFPLHVCQUFQO01BQ0EsSUFBQSxFQUFNLFNBRE47TUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRlQ7S0FERjtJQUlBLFVBQUEsRUFDRTtNQUFBLElBQUEsRUFBTSxTQUFOO01BQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO01BRUEsV0FBQSxFQUFhLGtDQUZiO0tBTEY7SUFRQSxTQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sc0JBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFGVDtNQUdBLFdBQUEsRUFBYSxnREFIYjtNQUlBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixNQUFoQixFQUF3QixNQUF4QixDQUpOO0tBVEY7SUFjQSxRQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sU0FBTjtNQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtNQUVBLFdBQUEsRUFBYSw0Q0FGYjtLQWZGO0lBa0JBLGtCQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sc0NBQVA7TUFDQSxJQUFBLEVBQU0sU0FETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtLQW5CRjtJQXNCQSxxQkFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLFNBQU47TUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRFQ7TUFFQSxPQUFBLEVBQVMsQ0FGVDtLQXZCRjtJQTBCQSxPQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sUUFBTjtNQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FEVDtNQUVBLFdBQUEsRUFBYSxvQkFGYjtLQTNCRjtJQThCQSxjQUFBLEVBQ0U7TUFBQSxJQUFBLEVBQU0sU0FBTjtNQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsQ0FEVDtNQUVBLFdBQUEsRUFBYSxrREFGYjtLQS9CRjtJQWtDQSxVQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQWEsMkVBQWI7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsTUFGVDtNQUdBLENBQUEsSUFBQSxDQUFBLEVBQU0sQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixRQUFyQixFQUErQixNQUEvQixFQUF1QyxRQUF2QyxFQUFpRCxPQUFqRCxFQUEwRCxLQUExRCxFQUFpRSxNQUFqRSxDQUhOO0tBbkNGO0lBdUNBLGNBQUEsRUFDRTtNQUFBLFdBQUEsRUFBYSxpQ0FBYjtNQUNBLElBQUEsRUFBTSxTQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO0tBeENGO0lBMkNBLFVBQUEsRUFDRTtNQUFBLFdBQUEsRUFBYSx5QkFBYjtNQUNBLElBQUEsRUFBTSxTQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO0tBNUNGO0lBK0NBLFlBQUEsRUFDRTtNQUFBLFdBQUEsRUFBYSxtQ0FBYjtNQUNBLElBQUEsRUFBTSxTQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO0tBaERGO0lBbURBLGNBQUEsRUFDRTtNQUFBLFdBQUEsRUFBYSw0QkFBYjtNQUNBLElBQUEsRUFBTSxTQUROO01BRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUZUO0tBcERGO0lBdURBLHNCQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQWEsMkNBQWI7TUFDQSxJQUFBLEVBQU0sU0FETjtNQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsS0FGVDtLQXhERjtJQTJEQSxtQkFBQSxFQUNFO01BQUEsSUFBQSxFQUFNLFNBQU47TUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLElBRFQ7S0E1REY7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIGluY2x1ZGVTdGFnZWREaWZmOlxuICAgIHRpdGxlOiAnSW5jbHVkZSBzdGFnZWQgZGlmZnM/J1xuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IHRydWVcbiAgb3BlbkluUGFuZTpcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiB0cnVlXG4gICAgZGVzY3JpcHRpb246ICdBbGxvdyBjb21tYW5kcyB0byBvcGVuIG5ldyBwYW5lcydcbiAgc3BsaXRQYW5lOlxuICAgIHRpdGxlOiAnU3BsaXQgcGFuZSBkaXJlY3Rpb24nXG4gICAgdHlwZTogJ3N0cmluZydcbiAgICBkZWZhdWx0OiAnRG93bidcbiAgICBkZXNjcmlwdGlvbjogJ1doZXJlIHNob3VsZCBuZXcgcGFuZXMgZ28/IChEZWZhdWx0cyB0byBSaWdodCknXG4gICAgZW51bTogWydVcCcsICdSaWdodCcsICdEb3duJywgJ0xlZnQnXVxuICB3b3JkRGlmZjpcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiB0cnVlXG4gICAgZGVzY3JpcHRpb246ICdTaG91bGQgd29yZCBkaWZmcyBiZSBoaWdobGlnaHRlZCBpbiBkaWZmcz8nXG4gIHN5bnRheEhpZ2hsaWdodGluZzpcbiAgICB0aXRsZTogJ0VuYWJsZSBzeW50YXggaGlnaGxpZ2h0aW5nIGluIGRpZmZzPydcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiB0cnVlXG4gIG51bWJlck9mQ29tbWl0c1RvU2hvdzpcbiAgICB0eXBlOiAnaW50ZWdlcidcbiAgICBkZWZhdWx0OiAyNVxuICAgIG1pbmltdW06IDFcbiAgZ2l0UGF0aDpcbiAgICB0eXBlOiAnc3RyaW5nJ1xuICAgIGRlZmF1bHQ6ICdnaXQnXG4gICAgZGVzY3JpcHRpb246ICdXaGVyZSBpcyB5b3VyIGdpdD8nXG4gIG1lc3NhZ2VUaW1lb3V0OlxuICAgIHR5cGU6ICdpbnRlZ2VyJ1xuICAgIGRlZmF1bHQ6IDVcbiAgICBkZXNjcmlwdGlvbjogJ0hvdyBsb25nIHNob3VsZCBzdWNjZXNzL2Vycm9yIG1lc3NhZ2VzIGJlIHNob3duPydcbiAgc2hvd0Zvcm1hdDpcbiAgICBkZXNjcmlwdGlvbjogJ1doaWNoIGZvcm1hdCB0byB1c2UgZm9yIGdpdCBzaG93PyAobm9uZSB3aWxsIHVzZSB5b3VyIGdpdCBjb25maWcgZGVmYXVsdCknXG4gICAgdHlwZTogJ3N0cmluZydcbiAgICBkZWZhdWx0OiAnZnVsbCdcbiAgICBlbnVtOiBbJ29uZWxpbmUnLCAnc2hvcnQnLCAnbWVkaXVtJywgJ2Z1bGwnLCAnZnVsbGVyJywgJ2VtYWlsJywgJ3JhdycsICdub25lJ11cbiAgcHVsbEJlZm9yZVB1c2g6XG4gICAgZGVzY3JpcHRpb246ICdQdWxsIGZyb20gcmVtb3RlIGJlZm9yZSBwdXNoaW5nJ1xuICAgIHR5cGU6ICdib29sZWFuJ1xuICAgIGRlZmF1bHQ6IGZhbHNlXG4gIHB1bGxSZWJhc2U6XG4gICAgZGVzY3JpcHRpb246ICdQdWxsIHdpdGggLS1yZWJhc2UgZmxhZydcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuICBleHBlcmltZW50YWw6XG4gICAgZGVzY3JpcHRpb246ICdFbmFibGUgYmV0YSBmZWF0dXJlcyBhbmQgYmVoYXZpb3InXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgdmVyYm9zZUNvbW1pdHM6XG4gICAgZGVzY3JpcHRpb246ICdTaG93IGRpZmZzIGluIGNvbW1pdCBwYW5lPydcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiBmYWxzZVxuICBhbHdheXNQdWxsRnJvbVVwc3RyZWFtOlxuICAgIGRlc2NyaXB0aW9uOiAnQWx3YXlzIHB1bGwgZnJvbSBjdXJyZW50IGJyYW5jaCB1cHN0cmVhbT8nXG4gICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgZGVmYXVsdDogZmFsc2VcbiAgZW5hYmxlU3RhdHVzQmFySWNvbjpcbiAgICB0eXBlOiAnYm9vbGVhbidcbiAgICBkZWZhdWx0OiB0cnVlXG4iXX0=
