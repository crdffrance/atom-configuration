(function() {
  var contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        var file;
        file = repo.relativize(path);
        if (file === '') {
          file = '.';
        }
        return git.cmd(['reset', 'HEAD', '--', file], {
          cwd: repo.getWorkingDirectory()
        }).then(notifier.addSuccess)["catch"](notifier.addError);
      });
    } else {
      return notifier.addInfo("No file selected to unstage");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2NvbnRleHQvZ2l0LXVuc3RhZ2UtZmlsZS1jb250ZXh0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLDhCQUFSOztFQUN2QixHQUFBLEdBQU0sT0FBQSxDQUFRLFdBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxnQkFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBO0FBQ2YsUUFBQTtJQUFBLElBQUcsSUFBQSxtREFBaUMsQ0FBRSxxQkFBdEM7YUFDRSxHQUFHLENBQUMsY0FBSixDQUFtQixJQUFuQixDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQUMsSUFBRDtBQUM1QixZQUFBO1FBQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCO1FBQ1AsSUFBYyxJQUFBLEtBQVEsRUFBdEI7VUFBQSxJQUFBLEdBQU8sSUFBUDs7ZUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsT0FBRCxFQUFVLE1BQVYsRUFBa0IsSUFBbEIsRUFBd0IsSUFBeEIsQ0FBUixFQUF1QztVQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO1NBQXZDLENBQ0EsQ0FBQyxJQURELENBQ00sUUFBUSxDQUFDLFVBRGYsQ0FFQSxFQUFDLEtBQUQsRUFGQSxDQUVPLFFBQVEsQ0FBQyxRQUZoQjtNQUg0QixDQUE5QixFQURGO0tBQUEsTUFBQTthQVFFLFFBQVEsQ0FBQyxPQUFULENBQWlCLDZCQUFqQixFQVJGOztFQURlO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsiY29udGV4dFBhY2thZ2VGaW5kZXIgPSByZXF1aXJlICcuLi8uLi9jb250ZXh0LXBhY2thZ2UtZmluZGVyJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi8uLi9ub3RpZmllcidcblxubW9kdWxlLmV4cG9ydHMgPSAtPlxuICBpZiBwYXRoID0gY29udGV4dFBhY2thZ2VGaW5kZXIuZ2V0KCk/LnNlbGVjdGVkUGF0aFxuICAgIGdpdC5nZXRSZXBvRm9yUGF0aChwYXRoKS50aGVuIChyZXBvKSAtPlxuICAgICAgZmlsZSA9IHJlcG8ucmVsYXRpdml6ZShwYXRoKVxuICAgICAgZmlsZSA9ICcuJyBpZiBmaWxlIGlzICcnXG4gICAgICBnaXQuY21kKFsncmVzZXQnLCAnSEVBRCcsICctLScsIGZpbGVdLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4obm90aWZpZXIuYWRkU3VjY2VzcylcbiAgICAgIC5jYXRjaChub3RpZmllci5hZGRFcnJvcilcbiAgZWxzZVxuICAgIG5vdGlmaWVyLmFkZEluZm8gXCJObyBmaWxlIHNlbGVjdGVkIHRvIHVuc3RhZ2VcIlxuIl19
