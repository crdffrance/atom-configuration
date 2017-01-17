(function() {
  var GitDiff, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitDiff = require('../git-diff');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        var file;
        if (path === repo.getWorkingDirectory()) {
          file = path;
        } else {
          file = repo.relativize(path);
        }
        if (file === '') {
          file = void 0;
        }
        return GitDiff(repo, {
          file: file
        });
      });
    } else {
      return notifier.addInfo("No file selected to diff");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2NvbnRleHQvZ2l0LWRpZmYtY29udGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSw4QkFBUjs7RUFDdkIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxXQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsZ0JBQVI7O0VBQ1gsT0FBQSxHQUFVLE9BQUEsQ0FBUSxhQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsSUFBRyxJQUFBLG1EQUFpQyxDQUFFLHFCQUF0QzthQUNFLEdBQUcsQ0FBQyxjQUFKLENBQW1CLElBQW5CLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBQyxJQUFEO0FBQzVCLFlBQUE7UUFBQSxJQUFHLElBQUEsS0FBUSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFYO1VBQ0UsSUFBQSxHQUFPLEtBRFQ7U0FBQSxNQUFBO1VBR0UsSUFBQSxHQUFPLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCLEVBSFQ7O1FBSUEsSUFBb0IsSUFBQSxLQUFRLEVBQTVCO1VBQUEsSUFBQSxHQUFPLE9BQVA7O2VBQ0EsT0FBQSxDQUFRLElBQVIsRUFBYztVQUFDLE1BQUEsSUFBRDtTQUFkO01BTjRCLENBQTlCLEVBREY7S0FBQSxNQUFBO2FBU0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsMEJBQWpCLEVBVEY7O0VBRGU7QUFMakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb250ZXh0UGFja2FnZUZpbmRlciA9IHJlcXVpcmUgJy4uLy4uL2NvbnRleHQtcGFja2FnZS1maW5kZXInXG5naXQgPSByZXF1aXJlICcuLi8uLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uLy4uL25vdGlmaWVyJ1xuR2l0RGlmZiA9IHJlcXVpcmUgJy4uL2dpdC1kaWZmJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IC0+XG4gIGlmIHBhdGggPSBjb250ZXh0UGFja2FnZUZpbmRlci5nZXQoKT8uc2VsZWN0ZWRQYXRoXG4gICAgZ2l0LmdldFJlcG9Gb3JQYXRoKHBhdGgpLnRoZW4gKHJlcG8pIC0+XG4gICAgICBpZiBwYXRoIGlzIHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gICAgICAgIGZpbGUgPSBwYXRoXG4gICAgICBlbHNlXG4gICAgICAgIGZpbGUgPSByZXBvLnJlbGF0aXZpemUocGF0aClcbiAgICAgIGZpbGUgPSB1bmRlZmluZWQgaWYgZmlsZSBpcyAnJ1xuICAgICAgR2l0RGlmZiByZXBvLCB7ZmlsZX1cbiAgZWxzZVxuICAgIG5vdGlmaWVyLmFkZEluZm8gXCJObyBmaWxlIHNlbGVjdGVkIHRvIGRpZmZcIlxuIl19
