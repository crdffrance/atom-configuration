(function() {
  var RemoteListView, git;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo, arg) {
    var setUpstream;
    setUpstream = (arg != null ? arg : {}).setUpstream;
    return git.cmd(['remote'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      var mode;
      mode = setUpstream ? 'push -u' : 'push';
      return new RemoteListView(repo, data, {
        mode: mode
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1wdXNoLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ2YsUUFBQTtJQUR1Qiw2QkFBRCxNQUFjO1dBQ3BDLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELENBQVIsRUFBb0I7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFwQixDQUFvRCxDQUFDLElBQXJELENBQTBELFNBQUMsSUFBRDtBQUN4RCxVQUFBO01BQUEsSUFBQSxHQUFVLFdBQUgsR0FBb0IsU0FBcEIsR0FBbUM7YUFDdEMsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQjtRQUFDLE1BQUEsSUFBRDtPQUEzQjtJQUZvRCxDQUExRDtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuUmVtb3RlTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9yZW1vdGUtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7c2V0VXBzdHJlYW19PXt9KSAtPlxuICBnaXQuY21kKFsncmVtb3RlJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpLnRoZW4gKGRhdGEpIC0+XG4gICAgbW9kZSA9IGlmIHNldFVwc3RyZWFtIHRoZW4gJ3B1c2ggLXUnIGVsc2UgJ3B1c2gnXG4gICAgbmV3IFJlbW90ZUxpc3RWaWV3KHJlcG8sIGRhdGEsIHttb2RlfSlcbiJdfQ==
