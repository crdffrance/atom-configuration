(function() {
  var configs;

  configs = {
    general: {
      order: 1,
      type: "object",
      properties: {
        analytics: {
          order: 1,
          title: "Anonymous Analytics",
          type: "boolean",
          "default": true,
          description: "[Google Analytics](http://www.google.com/analytics/) is used to track which features are being used the most and causing the most errors. Everything is anonymized and no personal information, source code, or repository information is sent."
        },
        _analyticsUserId: {
          order: 2,
          title: "Analytics User Id",
          type: "string",
          "default": "",
          description: "Unique identifier for this user for tracking usage analytics"
        },
        gitPath: {
          order: 3,
          title: "Git Path",
          type: "string",
          "default": "git",
          description: "If git is not in your PATH, specify where the executable is"
        },
        enableStatusBarIcon: {
          order: 4,
          title: "Status-bar Pin Icon",
          type: "boolean",
          "default": true,
          description: "The pin icon in the bottom-right of the status-bar toggles the output view above the status-bar"
        },
        openInPane: {
          order: 5,
          title: "Allow commands to open new panes",
          type: "boolean",
          "default": true,
          description: "Commands like `Commit`, `Log`, `Show`, `Diff` can be split into new panes"
        },
        splitPane: {
          order: 6,
          title: "Split pane direction",
          type: "string",
          "default": "Down",
          description: "Where should new panes go?",
          "enum": ["Up", "Right", "Down", "Left"]
        },
        messageTimeout: {
          order: 7,
          title: "Output view timeout",
          type: "integer",
          "default": 5,
          description: "For how many seconds should the output view above the status-bar stay open?"
        },
        showFormat: {
          order: 9,
          title: "Format option for 'Git Show'",
          type: "string",
          "default": "full",
          "enum": ["oneline", "short", "medium", "full", "fuller", "email", "raw", "none"],
          description: "Which format to use for `git show`? (`none` will use your git config default)"
        }
      }
    },
    commits: {
      order: 2,
      type: "object",
      properties: {
        verboseCommits: {
          title: "Verbose Commits",
          description: "Show diffs in commit pane?",
          type: "boolean",
          "default": false
        }
      }
    },
    diffs: {
      order: 3,
      type: "object",
      properties: {
        includeStagedDiff: {
          order: 1,
          title: "Include staged diffs?",
          type: "boolean",
          "default": true
        },
        wordDiff: {
          order: 2,
          title: "Word diff",
          type: "boolean",
          "default": true,
          description: "Should diffs be generated with the `--word-diff` flag?"
        },
        syntaxHighlighting: {
          order: 3,
          title: "Enable syntax highlighting in diffs?",
          type: "boolean",
          "default": true
        }
      }
    },
    logs: {
      order: 4,
      type: "object",
      properties: {
        numberOfCommitsToShow: {
          order: 1,
          title: "Number of commits to load",
          type: "integer",
          "default": 25,
          minimum: 1,
          description: "Initial amount of commits to load when running the `Log` command"
        }
      }
    },
    remoteInteractions: {
      order: 5,
      type: "object",
      properties: {
        pullRebase: {
          order: 1,
          title: "Pull Rebase",
          type: "boolean",
          "default": false,
          description: "Pull with `--rebase` flag?"
        },
        pullBeforePush: {
          order: 2,
          title: "Pull Before Pushing",
          type: "boolean",
          "default": false,
          description: "Pull from remote before pushing"
        },
        alwaysPullFromUpstream: {
          order: 3,
          title: "Pull From Upstream",
          type: "boolean",
          "default": false,
          description: "Always pull from current branch upstream?"
        }
      }
    },
    experimental: {
      order: 6,
      type: "object",
      properties: {
        stageFilesBeta: {
          order: 1,
          title: "Stage Files Beta",
          type: "boolean",
          "default": true,
          description: "Stage and unstage files in a single command"
        },
        customCommands: {
          order: 2,
          title: "Custom Commands",
          type: "boolean",
          "default": false,
          description: "Allow custom commands to be declared in your `init` file and run within Git-plus"
        }
      }
    }
  };

  module.exports = function() {
    var ref, userConfigs;
    if (userConfigs = (ref = atom.config.getAll('git-plus')[0]) != null ? ref.value : void 0) {
      Object.keys(userConfigs).forEach((function(_this) {
        return function(key) {
          if (!configs[key]) {
            return atom.config.unset("git-plus." + key);
          }
        };
      })(this));
    }
    return configs;
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvY29uZmlnLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsT0FBQSxHQUNFO0lBQUEsT0FBQSxFQUNFO01BQUEsS0FBQSxFQUFPLENBQVA7TUFDQSxJQUFBLEVBQU0sUUFETjtNQUVBLFVBQUEsRUFDRTtRQUFBLFNBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLHFCQURQO1VBRUEsSUFBQSxFQUFPLFNBRlA7VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLElBSFY7VUFJQSxXQUFBLEVBQWMsaVBBSmQ7U0FERjtRQU1BLGdCQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxtQkFEUDtVQUVBLElBQUEsRUFBTyxRQUZQO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBVSxFQUhWO1VBSUEsV0FBQSxFQUFjLDhEQUpkO1NBUEY7UUFZQSxPQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxVQURQO1VBRUEsSUFBQSxFQUFNLFFBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7VUFJQSxXQUFBLEVBQWEsNkRBSmI7U0FiRjtRQWtCQSxtQkFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLENBQVA7VUFDQSxLQUFBLEVBQU8scUJBRFA7VUFFQSxJQUFBLEVBQU0sU0FGTjtVQUdBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFIVDtVQUlBLFdBQUEsRUFBYSxpR0FKYjtTQW5CRjtRQXdCQSxVQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxrQ0FEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1VBSUEsV0FBQSxFQUFhLDJFQUpiO1NBekJGO1FB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YjtTQVBGO1FBWUEsc0JBQUEsRUFDRTtVQUFBLEtBQUEsRUFBTyxDQUFQO1VBQ0EsS0FBQSxFQUFPLG9CQURQO1VBRUEsSUFBQSxFQUFNLFNBRk47VUFHQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBSFQ7VUFJQSxXQUFBLEVBQWEsMkNBSmI7U0FiRjtPQUhGO0tBL0ZGO0lBb0hBLFlBQUEsRUFDRTtNQUFBLEtBQUEsRUFBTyxDQUFQO01BQ0EsSUFBQSxFQUFNLFFBRE47TUFFQSxVQUFBLEVBQ0U7UUFBQSxjQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxrQkFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQUhUO1VBSUEsV0FBQSxFQUFhLDZDQUpiO1NBREY7UUFNQSxjQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sQ0FBUDtVQUNBLEtBQUEsRUFBTyxpQkFEUDtVQUVBLElBQUEsRUFBTSxTQUZOO1VBR0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxLQUhUO1VBSUEsV0FBQSxFQUFhLGtGQUpiO1NBUEY7T0FIRjtLQXJIRjs7O0VBcUlGLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7QUFFZixRQUFBO0lBQUEsSUFBRyxXQUFBLDBEQUErQyxDQUFFLGNBQXBEO01BQ0UsTUFBTSxDQUFDLElBQVAsQ0FBWSxXQUFaLENBQXdCLENBQUMsT0FBekIsQ0FBaUMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7VUFDL0IsSUFBdUMsQ0FBSSxPQUFRLENBQUEsR0FBQSxDQUFuRDttQkFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQVosQ0FBa0IsV0FBQSxHQUFZLEdBQTlCLEVBQUE7O1FBRCtCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxFQURGOztXQUlBO0VBTmU7QUF0SWpCIiwic291cmNlc0NvbnRlbnQiOlsiY29uZmlncyA9XG4gIGdlbmVyYWw6XG4gICAgb3JkZXI6IDFcbiAgICB0eXBlOiBcIm9iamVjdFwiXG4gICAgcHJvcGVydGllczpcbiAgICAgIGFuYWx5dGljczpcbiAgICAgICAgb3JkZXI6IDFcbiAgICAgICAgdGl0bGU6IFwiQW5vbnltb3VzIEFuYWx5dGljc1wiXG4gICAgICAgIHR5cGUgOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0IDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiW0dvb2dsZSBBbmFseXRpY3NdKGh0dHA6Ly93d3cuZ29vZ2xlLmNvbS9hbmFseXRpY3MvKSBpcyB1c2VkIHRvIHRyYWNrIHdoaWNoIGZlYXR1cmVzIGFyZSBiZWluZyB1c2VkIHRoZSBtb3N0IGFuZCBjYXVzaW5nIHRoZSBtb3N0IGVycm9ycy4gRXZlcnl0aGluZyBpcyBhbm9ueW1pemVkIGFuZCBubyBwZXJzb25hbCBpbmZvcm1hdGlvbiwgc291cmNlIGNvZGUsIG9yIHJlcG9zaXRvcnkgaW5mb3JtYXRpb24gaXMgc2VudC5cIlxuICAgICAgX2FuYWx5dGljc1VzZXJJZDpcbiAgICAgICAgb3JkZXI6IDJcbiAgICAgICAgdGl0bGU6IFwiQW5hbHl0aWNzIFVzZXIgSWRcIlxuICAgICAgICB0eXBlIDogXCJzdHJpbmdcIlxuICAgICAgICBkZWZhdWx0IDogXCJcIlxuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiVW5pcXVlIGlkZW50aWZpZXIgZm9yIHRoaXMgdXNlciBmb3IgdHJhY2tpbmcgdXNhZ2UgYW5hbHl0aWNzXCJcbiAgICAgIGdpdFBhdGg6XG4gICAgICAgIG9yZGVyOiAzXG4gICAgICAgIHRpdGxlOiBcIkdpdCBQYXRoXCJcbiAgICAgICAgdHlwZTogXCJzdHJpbmdcIlxuICAgICAgICBkZWZhdWx0OiBcImdpdFwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIklmIGdpdCBpcyBub3QgaW4geW91ciBQQVRILCBzcGVjaWZ5IHdoZXJlIHRoZSBleGVjdXRhYmxlIGlzXCJcbiAgICAgIGVuYWJsZVN0YXR1c0Jhckljb246XG4gICAgICAgIG9yZGVyOiA0XG4gICAgICAgIHRpdGxlOiBcIlN0YXR1cy1iYXIgUGluIEljb25cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlRoZSBwaW4gaWNvbiBpbiB0aGUgYm90dG9tLXJpZ2h0IG9mIHRoZSBzdGF0dXMtYmFyIHRvZ2dsZXMgdGhlIG91dHB1dCB2aWV3IGFib3ZlIHRoZSBzdGF0dXMtYmFyXCJcbiAgICAgIG9wZW5JblBhbmU6XG4gICAgICAgIG9yZGVyOiA1XG4gICAgICAgIHRpdGxlOiBcIkFsbG93IGNvbW1hbmRzIHRvIG9wZW4gbmV3IHBhbmVzXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJDb21tYW5kcyBsaWtlIGBDb21taXRgLCBgTG9nYCwgYFNob3dgLCBgRGlmZmAgY2FuIGJlIHNwbGl0IGludG8gbmV3IHBhbmVzXCJcbiAgICAgIHNwbGl0UGFuZTpcbiAgICAgICAgb3JkZXI6IDZcbiAgICAgICAgdGl0bGU6IFwiU3BsaXQgcGFuZSBkaXJlY3Rpb25cIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiRG93blwiXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIldoZXJlIHNob3VsZCBuZXcgcGFuZXMgZ28/XCJcbiAgICAgICAgZW51bTogW1wiVXBcIiwgXCJSaWdodFwiLCBcIkRvd25cIiwgXCJMZWZ0XCJdXG4gICAgICBtZXNzYWdlVGltZW91dDpcbiAgICAgICAgb3JkZXI6IDdcbiAgICAgICAgdGl0bGU6IFwiT3V0cHV0IHZpZXcgdGltZW91dFwiXG4gICAgICAgIHR5cGU6IFwiaW50ZWdlclwiXG4gICAgICAgIGRlZmF1bHQ6IDVcbiAgICAgICAgZGVzY3JpcHRpb246IFwiRm9yIGhvdyBtYW55IHNlY29uZHMgc2hvdWxkIHRoZSBvdXRwdXQgdmlldyBhYm92ZSB0aGUgc3RhdHVzLWJhciBzdGF5IG9wZW4/XCJcbiAgICAgIHNob3dGb3JtYXQ6XG4gICAgICAgIG9yZGVyOiA5XG4gICAgICAgIHRpdGxlOiBcIkZvcm1hdCBvcHRpb24gZm9yICdHaXQgU2hvdydcIlxuICAgICAgICB0eXBlOiBcInN0cmluZ1wiXG4gICAgICAgIGRlZmF1bHQ6IFwiZnVsbFwiXG4gICAgICAgIGVudW06IFtcIm9uZWxpbmVcIiwgXCJzaG9ydFwiLCBcIm1lZGl1bVwiLCBcImZ1bGxcIiwgXCJmdWxsZXJcIiwgXCJlbWFpbFwiLCBcInJhd1wiLCBcIm5vbmVcIl1cbiAgICAgICAgZGVzY3JpcHRpb246IFwiV2hpY2ggZm9ybWF0IHRvIHVzZSBmb3IgYGdpdCBzaG93YD8gKGBub25lYCB3aWxsIHVzZSB5b3VyIGdpdCBjb25maWcgZGVmYXVsdClcIlxuICBjb21taXRzOlxuICAgIG9yZGVyOiAyXG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICB2ZXJib3NlQ29tbWl0czpcbiAgICAgICAgdGl0bGU6IFwiVmVyYm9zZSBDb21taXRzXCJcbiAgICAgICAgZGVzY3JpcHRpb246IFwiU2hvdyBkaWZmcyBpbiBjb21taXQgcGFuZT9cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICBkaWZmczpcbiAgICBvcmRlcjogM1xuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgaW5jbHVkZVN0YWdlZERpZmY6XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHRpdGxlOiBcIkluY2x1ZGUgc3RhZ2VkIGRpZmZzP1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIHdvcmREaWZmOlxuICAgICAgICBvcmRlcjogMlxuICAgICAgICB0aXRsZTogXCJXb3JkIGRpZmZcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlNob3VsZCBkaWZmcyBiZSBnZW5lcmF0ZWQgd2l0aCB0aGUgYC0td29yZC1kaWZmYCBmbGFnP1wiXG4gICAgICBzeW50YXhIaWdobGlnaHRpbmc6XG4gICAgICAgIG9yZGVyOiAzXG4gICAgICAgIHRpdGxlOiBcIkVuYWJsZSBzeW50YXggaGlnaGxpZ2h0aW5nIGluIGRpZmZzP1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IHRydWVcbiAgbG9nczpcbiAgICBvcmRlcjogNFxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgbnVtYmVyT2ZDb21taXRzVG9TaG93OlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJOdW1iZXIgb2YgY29tbWl0cyB0byBsb2FkXCJcbiAgICAgICAgdHlwZTogXCJpbnRlZ2VyXCJcbiAgICAgICAgZGVmYXVsdDogMjVcbiAgICAgICAgbWluaW11bTogMVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJJbml0aWFsIGFtb3VudCBvZiBjb21taXRzIHRvIGxvYWQgd2hlbiBydW5uaW5nIHRoZSBgTG9nYCBjb21tYW5kXCJcbiAgcmVtb3RlSW50ZXJhY3Rpb25zOlxuICAgIG9yZGVyOiA1XG4gICAgdHlwZTogXCJvYmplY3RcIlxuICAgIHByb3BlcnRpZXM6XG4gICAgICBwdWxsUmViYXNlOlxuICAgICAgICBvcmRlcjogMVxuICAgICAgICB0aXRsZTogXCJQdWxsIFJlYmFzZVwiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlB1bGwgd2l0aCBgLS1yZWJhc2VgIGZsYWc/XCJcbiAgICAgIHB1bGxCZWZvcmVQdXNoOlxuICAgICAgICBvcmRlcjogMlxuICAgICAgICB0aXRsZTogXCJQdWxsIEJlZm9yZSBQdXNoaW5nXCJcbiAgICAgICAgdHlwZTogXCJib29sZWFuXCJcbiAgICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgICAgZGVzY3JpcHRpb246IFwiUHVsbCBmcm9tIHJlbW90ZSBiZWZvcmUgcHVzaGluZ1wiXG4gICAgICBhbHdheXNQdWxsRnJvbVVwc3RyZWFtOlxuICAgICAgICBvcmRlcjogM1xuICAgICAgICB0aXRsZTogXCJQdWxsIEZyb20gVXBzdHJlYW1cIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbjogXCJBbHdheXMgcHVsbCBmcm9tIGN1cnJlbnQgYnJhbmNoIHVwc3RyZWFtP1wiXG4gIGV4cGVyaW1lbnRhbDpcbiAgICBvcmRlcjogNlxuICAgIHR5cGU6IFwib2JqZWN0XCJcbiAgICBwcm9wZXJ0aWVzOlxuICAgICAgc3RhZ2VGaWxlc0JldGE6XG4gICAgICAgIG9yZGVyOiAxXG4gICAgICAgIHRpdGxlOiBcIlN0YWdlIEZpbGVzIEJldGFcIlxuICAgICAgICB0eXBlOiBcImJvb2xlYW5cIlxuICAgICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIlN0YWdlIGFuZCB1bnN0YWdlIGZpbGVzIGluIGEgc2luZ2xlIGNvbW1hbmRcIlxuICAgICAgY3VzdG9tQ29tbWFuZHM6XG4gICAgICAgIG9yZGVyOiAyXG4gICAgICAgIHRpdGxlOiBcIkN1c3RvbSBDb21tYW5kc1wiXG4gICAgICAgIHR5cGU6IFwiYm9vbGVhblwiXG4gICAgICAgIGRlZmF1bHQ6IGZhbHNlXG4gICAgICAgIGRlc2NyaXB0aW9uOiBcIkFsbG93IGN1c3RvbSBjb21tYW5kcyB0byBiZSBkZWNsYXJlZCBpbiB5b3VyIGBpbml0YCBmaWxlIGFuZCBydW4gd2l0aGluIEdpdC1wbHVzXCJcblxubW9kdWxlLmV4cG9ydHMgPSAtPlxuICAjIENsZWFudXAgdXNlcidzIGNvbmZpZy5jc29uIGlmIGNvbmZpZyBwcm9wZXJ0aWVzIGNoYW5nZVxuICBpZiB1c2VyQ29uZmlncyA9IGF0b20uY29uZmlnLmdldEFsbCgnZ2l0LXBsdXMnKVswXT8udmFsdWVcbiAgICBPYmplY3Qua2V5cyh1c2VyQ29uZmlncykuZm9yRWFjaCAoa2V5KSA9PlxuICAgICAgYXRvbS5jb25maWcudW5zZXQgXCJnaXQtcGx1cy4je2tleX1cIiBpZiBub3QgY29uZmlnc1trZXldXG5cbiAgY29uZmlnc1xuIl19
