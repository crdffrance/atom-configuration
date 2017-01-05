(function() {
  var GitPush, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitPush = require('../git-push');

  module.exports = function(options) {
    var path, ref;
    if (options == null) {
      options = {};
    }
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        return GitPush(repo, options);
      });
    } else {
      return notifier.addInfo("No repository found");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2NvbnRleHQvZ2l0LXB1c2gtY29udGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSw4QkFBUjs7RUFDdkIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxXQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsZ0JBQVI7O0VBQ1gsT0FBQSxHQUFVLE9BQUEsQ0FBUSxhQUFSOztFQUVWLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsT0FBRDtBQUNmLFFBQUE7O01BRGdCLFVBQVE7O0lBQ3hCLElBQUcsSUFBQSxtREFBaUMsQ0FBRSxxQkFBdEM7YUFDRSxHQUFHLENBQUMsY0FBSixDQUFtQixJQUFuQixDQUF3QixDQUFDLElBQXpCLENBQThCLFNBQUMsSUFBRDtlQUFVLE9BQUEsQ0FBUSxJQUFSLEVBQWMsT0FBZDtNQUFWLENBQTlCLEVBREY7S0FBQSxNQUFBO2FBR0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIscUJBQWpCLEVBSEY7O0VBRGU7QUFMakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb250ZXh0UGFja2FnZUZpbmRlciA9IHJlcXVpcmUgJy4uLy4uL2NvbnRleHQtcGFja2FnZS1maW5kZXInXG5naXQgPSByZXF1aXJlICcuLi8uLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uLy4uL25vdGlmaWVyJ1xuR2l0UHVzaCA9IHJlcXVpcmUgJy4uL2dpdC1wdXNoJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChvcHRpb25zPXt9KS0+XG4gIGlmIHBhdGggPSBjb250ZXh0UGFja2FnZUZpbmRlci5nZXQoKT8uc2VsZWN0ZWRQYXRoXG4gICAgZ2l0LmdldFJlcG9Gb3JQYXRoKHBhdGgpLnRoZW4gKHJlcG8pIC0+IEdpdFB1c2gocmVwbywgb3B0aW9ucylcbiAgZWxzZVxuICAgIG5vdGlmaWVyLmFkZEluZm8gXCJObyByZXBvc2l0b3J5IGZvdW5kXCJcbiJdfQ==
