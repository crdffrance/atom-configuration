(function() {
  var OutputViewManager, git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = function(repo, arg) {
    var args, cwd, message;
    message = (arg != null ? arg : {}).message;
    cwd = repo.getWorkingDirectory();
    args = ['stash', 'save'];
    if (message) {
      args.push(message);
    }
    return git.cmd(args, {
      cwd: cwd
    }, {
      color: true
    }).then(function(msg) {
      if (msg !== '') {
        return OutputViewManager.create().setContent(msg).finish();
      }
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFzaC1zYXZlLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO0lBRHVCLHlCQUFELE1BQVU7SUFDaEMsR0FBQSxHQUFNLElBQUksQ0FBQyxtQkFBTCxDQUFBO0lBQ04sSUFBQSxHQUFPLENBQUMsT0FBRCxFQUFVLE1BQVY7SUFDUCxJQUFzQixPQUF0QjtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsT0FBVixFQUFBOztXQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO01BQUMsS0FBQSxHQUFEO0tBQWQsRUFBcUI7TUFBQSxLQUFBLEVBQU8sSUFBUDtLQUFyQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsR0FBRDtNQUNKLElBQXVELEdBQUEsS0FBUyxFQUFoRTtlQUFBLGlCQUFpQixDQUFDLE1BQWxCLENBQUEsQ0FBMEIsQ0FBQyxVQUEzQixDQUFzQyxHQUF0QyxDQUEwQyxDQUFDLE1BQTNDLENBQUEsRUFBQTs7SUFESSxDQUROLENBR0EsRUFBQyxLQUFELEVBSEEsQ0FHTyxTQUFDLEdBQUQ7YUFDTCxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQjtJQURLLENBSFA7RUFKZTtBQUpqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5PdXRwdXRWaWV3TWFuYWdlciA9IHJlcXVpcmUgJy4uL291dHB1dC12aWV3LW1hbmFnZXInXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHttZXNzYWdlfT17fSkgLT5cbiAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgYXJncyA9IFsnc3Rhc2gnLCAnc2F2ZSddXG4gIGFyZ3MucHVzaChtZXNzYWdlKSBpZiBtZXNzYWdlXG4gIGdpdC5jbWQoYXJncywge2N3ZH0sIGNvbG9yOiB0cnVlKVxuICAudGhlbiAobXNnKSAtPlxuICAgIE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpLnNldENvbnRlbnQobXNnKS5maW5pc2goKSBpZiBtc2cgaXNudCAnJ1xuICAuY2F0Y2ggKG1zZykgLT5cbiAgICBub3RpZmllci5hZGRJbmZvIG1zZ1xuIl19
