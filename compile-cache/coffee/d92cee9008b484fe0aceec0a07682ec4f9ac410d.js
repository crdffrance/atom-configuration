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
      })["catch"](function(error) {
        console.log(error);
        return notifier.addError('There was an error executing Add + Commit');
      });
    } else {
      return notifier.addInfo("No file selected to add and commit");
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2NvbnRleHQvZ2l0LWFkZC1hbmQtY29tbWl0LWNvbnRleHQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxvQkFBQSxHQUF1QixPQUFBLENBQVEsOEJBQVI7O0VBQ3ZCLEdBQUEsR0FBTSxPQUFBLENBQVEsV0FBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGdCQUFSOztFQUNYLFNBQUEsR0FBWSxPQUFBLENBQVEsZUFBUjs7RUFFWixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBO0FBQ2YsUUFBQTtJQUFBLElBQUcsSUFBQSxtREFBaUMsQ0FBRSxxQkFBdEM7YUFDRSxHQUFHLENBQUMsY0FBSixDQUFtQixJQUFuQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtBQUNKLFlBQUE7UUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEI7UUFDUCxJQUFvQixJQUFBLEtBQVEsRUFBNUI7VUFBQSxJQUFBLEdBQU8sT0FBUDs7ZUFDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztVQUFDLE1BQUEsSUFBRDtTQUFkLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQTtpQkFBRyxTQUFBLENBQVUsSUFBVjtRQUFILENBQTNCO01BSEksQ0FETixDQUtBLEVBQUMsS0FBRCxFQUxBLENBS08sU0FBQyxLQUFEO1FBQ0wsT0FBTyxDQUFDLEdBQVIsQ0FBWSxLQUFaO2VBQ0EsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsMkNBQWxCO01BRkssQ0FMUCxFQURGO0tBQUEsTUFBQTthQVVFLFFBQVEsQ0FBQyxPQUFULENBQWlCLG9DQUFqQixFQVZGOztFQURlO0FBTGpCIiwic291cmNlc0NvbnRlbnQiOlsiY29udGV4dFBhY2thZ2VGaW5kZXIgPSByZXF1aXJlICcuLi8uLi9jb250ZXh0LXBhY2thZ2UtZmluZGVyJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi8uLi9ub3RpZmllcidcbkdpdENvbW1pdCA9IHJlcXVpcmUgJy4uL2dpdC1jb21taXQnXG5cbm1vZHVsZS5leHBvcnRzID0gLT5cbiAgaWYgcGF0aCA9IGNvbnRleHRQYWNrYWdlRmluZGVyLmdldCgpPy5zZWxlY3RlZFBhdGhcbiAgICBnaXQuZ2V0UmVwb0ZvclBhdGgocGF0aClcbiAgICAudGhlbiAocmVwbykgLT5cbiAgICAgIGZpbGUgPSByZXBvLnJlbGF0aXZpemUocGF0aClcbiAgICAgIGZpbGUgPSB1bmRlZmluZWQgaWYgZmlsZSBpcyAnJ1xuICAgICAgZ2l0LmFkZChyZXBvLCB7ZmlsZX0pLnRoZW4gLT4gR2l0Q29tbWl0KHJlcG8pXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGNvbnNvbGUubG9nIGVycm9yXG4gICAgICBub3RpZmllci5hZGRFcnJvciAnVGhlcmUgd2FzIGFuIGVycm9yIGV4ZWN1dGluZyBBZGQgKyBDb21taXQnXG4gIGVsc2VcbiAgICBub3RpZmllci5hZGRJbmZvIFwiTm8gZmlsZSBzZWxlY3RlZCB0byBhZGQgYW5kIGNvbW1pdFwiXG4iXX0=
