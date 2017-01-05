(function() {
  var GitCommit, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitCommit = require('../git-commit');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        var file;
        file = repo.relativize(path);
        if (file === '') {
          file = void 0;
        }
        return git.add(repo, {
          file: file
        }).then(function() {
          return GitCommit(repo);
        });
      });
    } else {
      return notifier.addInfo("No file selected to add and commit");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2NvbnRleHQvZ2l0LWFkZC1hbmQtY29tbWl0LWNvbnRleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsOEJBQVI7O0VBQ3ZCLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGdCQUFSOztFQUNYLFNBQUEsR0FBWSxPQUFBLENBQVEsZUFBUjs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBO0FBQ2YsUUFBQTtJQUFBLElBQUcsSUFBQSxtREFBaUMsQ0FBRSxxQkFBdEM7YUFDRSxHQUFHLENBQUMsY0FBSixDQUFtQixJQUFuQixDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQUMsSUFBRDtBQUM1QixZQUFBO1FBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCO1FBQ1AsSUFBb0IsSUFBQSxLQUFRLEVBQTVCO1VBQUEsSUFBQSxHQUFPLE9BQVA7O2VBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7VUFBQyxNQUFBLElBQUQ7U0FBZCxDQUFxQixDQUFDLElBQXRCLENBQTJCLFNBQUE7aUJBQUcsU0FBQSxDQUFVLElBQVY7UUFBSCxDQUEzQjtNQUg0QixDQUE5QixFQURGO0tBQUEsTUFBQTthQU1FLFFBQVEsQ0FBQyxPQUFULENBQWlCLG9DQUFqQixFQU5GOztFQURlO0FBTGpCIiwic291cmNlc0NvbnRlbnQiOlsiY29udGV4dFBhY2thZ2VGaW5kZXIgPSByZXF1aXJlICcuLi8uLi9jb250ZXh0LXBhY2thZ2UtZmluZGVyJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi8uLi9ub3RpZmllcidcbkdpdENvbW1pdCA9IHJlcXVpcmUgJy4uL2dpdC1jb21taXQnXG5cbm1vZHVsZS5leHBvcnRzID0gLT5cbiAgaWYgcGF0aCA9IGNvbnRleHRQYWNrYWdlRmluZGVyLmdldCgpPy5zZWxlY3RlZFBhdGhcbiAgICBnaXQuZ2V0UmVwb0ZvclBhdGgocGF0aCkudGhlbiAocmVwbykgLT5cbiAgICAgIGZpbGUgPSByZXBvLnJlbGF0aXZpemUocGF0aClcbiAgICAgIGZpbGUgPSB1bmRlZmluZWQgaWYgZmlsZSBpcyAnJ1xuICAgICAgZ2l0LmFkZChyZXBvLCB7ZmlsZX0pLnRoZW4gLT4gR2l0Q29tbWl0KHJlcG8pXG4gIGVsc2VcbiAgICBub3RpZmllci5hZGRJbmZvIFwiTm8gZmlsZSBzZWxlY3RlZCB0byBhZGQgYW5kIGNvbW1pdFwiXG4iXX0=
