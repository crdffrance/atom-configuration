(function() {
  var GitDiffTool, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitDiffTool = require('../git-difftool');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        return GitDiffTool(repo, {
          file: repo.relativize(path)
        });
      });
    } else {
      return notifier.addInfo("No file selected to diff");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2NvbnRleHQvZ2l0LWRpZmZ0b29sLWNvbnRleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsOEJBQVI7O0VBQ3ZCLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGdCQUFSOztFQUNYLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQTtBQUNmLFFBQUE7SUFBQSxJQUFHLElBQUEsbURBQWlDLENBQUUscUJBQXRDO2FBQ0UsR0FBRyxDQUFDLGNBQUosQ0FBbUIsSUFBbkIsQ0FBd0IsQ0FBQyxJQUF6QixDQUE4QixTQUFDLElBQUQ7ZUFDNUIsV0FBQSxDQUFZLElBQVosRUFBa0I7VUFBQSxJQUFBLEVBQU0sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBTjtTQUFsQjtNQUQ0QixDQUE5QixFQURGO0tBQUEsTUFBQTthQUlFLFFBQVEsQ0FBQyxPQUFULENBQWlCLDBCQUFqQixFQUpGOztFQURlO0FBTGpCIiwic291cmNlc0NvbnRlbnQiOlsiY29udGV4dFBhY2thZ2VGaW5kZXIgPSByZXF1aXJlICcuLi8uLi9jb250ZXh0LXBhY2thZ2UtZmluZGVyJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi8uLi9ub3RpZmllcidcbkdpdERpZmZUb29sID0gcmVxdWlyZSAnLi4vZ2l0LWRpZmZ0b29sJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IC0+XG4gIGlmIHBhdGggPSBjb250ZXh0UGFja2FnZUZpbmRlci5nZXQoKT8uc2VsZWN0ZWRQYXRoXG4gICAgZ2l0LmdldFJlcG9Gb3JQYXRoKHBhdGgpLnRoZW4gKHJlcG8pIC0+XG4gICAgICBHaXREaWZmVG9vbCByZXBvLCBmaWxlOiByZXBvLnJlbGF0aXZpemUocGF0aClcbiAgZWxzZVxuICAgIG5vdGlmaWVyLmFkZEluZm8gXCJObyBmaWxlIHNlbGVjdGVkIHRvIGRpZmZcIlxuIl19
