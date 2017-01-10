(function() {
  var GitCheckoutFile, contextPackageFinder, git, notifier;

  contextPackageFinder = require('../../context-package-finder');

  git = require('../../git');

  notifier = require('../../notifier');

  GitCheckoutFile = require('../git-checkout-file');

  module.exports = function() {
    var path, ref;
    if (path = (ref = contextPackageFinder.get()) != null ? ref.selectedPath : void 0) {
      return git.getRepoForPath(path).then(function(repo) {
        return atom.confirm({
          message: "Are you sure you want to reset " + (repo.relativize(path)) + " to HEAD",
          buttons: {
            Yes: function() {
              return GitCheckoutFile(repo, {
                file: repo.relativize(path)
              });
            },
            No: function() {}
          }
        });
      });
    } else {
      return notifier.addInfo("No file selected to checkout");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2NvbnRleHQvZ2l0LWNoZWNrb3V0LWZpbGUtY29udGV4dC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLG9CQUFBLEdBQXVCLE9BQUEsQ0FBUSw4QkFBUjs7RUFDdkIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxXQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsZ0JBQVI7O0VBQ1gsZUFBQSxHQUFrQixPQUFBLENBQVEsc0JBQVI7O0VBRWxCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUE7QUFDZixRQUFBO0lBQUEsSUFBRyxJQUFBLG1EQUFpQyxDQUFFLHFCQUF0QzthQUNFLEdBQUcsQ0FBQyxjQUFKLENBQW1CLElBQW5CLENBQXdCLENBQUMsSUFBekIsQ0FBOEIsU0FBQyxJQUFEO2VBQzVCLElBQUksQ0FBQyxPQUFMLENBQ0U7VUFBQSxPQUFBLEVBQVMsaUNBQUEsR0FBaUMsQ0FBQyxJQUFJLENBQUMsVUFBTCxDQUFnQixJQUFoQixDQUFELENBQWpDLEdBQXdELFVBQWpFO1VBQ0EsT0FBQSxFQUNFO1lBQUEsR0FBQSxFQUFLLFNBQUE7cUJBQUcsZUFBQSxDQUFnQixJQUFoQixFQUFzQjtnQkFBQSxJQUFBLEVBQU0sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBTjtlQUF0QjtZQUFILENBQUw7WUFDQSxFQUFBLEVBQUssU0FBQSxHQUFBLENBREw7V0FGRjtTQURGO01BRDRCLENBQTlCLEVBREY7S0FBQSxNQUFBO2FBUUUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsOEJBQWpCLEVBUkY7O0VBRGU7QUFMakIiLCJzb3VyY2VzQ29udGVudCI6WyJjb250ZXh0UGFja2FnZUZpbmRlciA9IHJlcXVpcmUgJy4uLy4uL2NvbnRleHQtcGFja2FnZS1maW5kZXInXG5naXQgPSByZXF1aXJlICcuLi8uLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uLy4uL25vdGlmaWVyJ1xuR2l0Q2hlY2tvdXRGaWxlID0gcmVxdWlyZSAnLi4vZ2l0LWNoZWNrb3V0LWZpbGUnXG5cbm1vZHVsZS5leHBvcnRzID0gLT5cbiAgaWYgcGF0aCA9IGNvbnRleHRQYWNrYWdlRmluZGVyLmdldCgpPy5zZWxlY3RlZFBhdGhcbiAgICBnaXQuZ2V0UmVwb0ZvclBhdGgocGF0aCkudGhlbiAocmVwbykgLT5cbiAgICAgIGF0b20uY29uZmlybVxuICAgICAgICBtZXNzYWdlOiBcIkFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byByZXNldCAje3JlcG8ucmVsYXRpdml6ZShwYXRoKX0gdG8gSEVBRFwiXG4gICAgICAgIGJ1dHRvbnM6XG4gICAgICAgICAgWWVzOiAtPiBHaXRDaGVja291dEZpbGUgcmVwbywgZmlsZTogcmVwby5yZWxhdGl2aXplKHBhdGgpXG4gICAgICAgICAgTm86ICAtPlxuICBlbHNlXG4gICAgbm90aWZpZXIuYWRkSW5mbyBcIk5vIGZpbGUgc2VsZWN0ZWQgdG8gY2hlY2tvdXRcIlxuIl19
