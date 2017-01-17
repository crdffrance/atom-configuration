(function() {
  var RemoteListView, git, pull;

  git = require('../git');

  pull = require('./_pull');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo) {
    var extraArgs;
    extraArgs = atom.config.get('git-plus.remoteInteractions.pullRebase') ? ['--rebase'] : [];
    if (atom.config.get('git-plus.remoteInteractions.alwaysPullFromUpstream')) {
      return pull(repo, {
        extraArgs: extraArgs
      });
    } else {
      return git.cmd(['remote'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return new RemoteListView(repo, data, {
          mode: 'pull',
          extraArgs: extraArgs
        }).result;
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1wdWxsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUjs7RUFDUCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO0FBQ2YsUUFBQTtJQUFBLFNBQUEsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLENBQUgsR0FBa0UsQ0FBQyxVQUFELENBQWxFLEdBQW9GO0lBQ2hHLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG9EQUFoQixDQUFIO2FBQ0UsSUFBQSxDQUFLLElBQUwsRUFBVztRQUFDLFdBQUEsU0FBRDtPQUFYLEVBREY7S0FBQSxNQUFBO2FBR0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsQ0FBUixFQUFvQjtRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQXBCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2VBQVUsSUFBSSxjQUFBLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQjtVQUFBLElBQUEsRUFBTSxNQUFOO1VBQWMsU0FBQSxFQUFXLFNBQXpCO1NBQTNCLENBQThELENBQUM7TUFBN0UsQ0FETixFQUhGOztFQUZlO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xucHVsbCA9IHJlcXVpcmUgJy4vX3B1bGwnXG5SZW1vdGVMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGV4dHJhQXJncyA9IGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLnB1bGxSZWJhc2UnKSB0aGVuIFsnLS1yZWJhc2UnXSBlbHNlIFtdXG4gIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucmVtb3RlSW50ZXJhY3Rpb25zLmFsd2F5c1B1bGxGcm9tVXBzdHJlYW0nKVxuICAgIHB1bGwgcmVwbywge2V4dHJhQXJnc31cbiAgZWxzZVxuICAgIGdpdC5jbWQoWydyZW1vdGUnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT4gbmV3IFJlbW90ZUxpc3RWaWV3KHJlcG8sIGRhdGEsIG1vZGU6ICdwdWxsJywgZXh0cmFBcmdzOiBleHRyYUFyZ3MpLnJlc3VsdFxuIl19
