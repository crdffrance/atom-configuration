(function() {
  var RemoteListView, git, pull;

  git = require('../git');

  pull = require('./_pull');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo) {
    var extraArgs;
    extraArgs = atom.config.get('git-plus.pullRebase') ? ['--rebase'] : [];
    if (atom.config.get('git-plus.alwaysPullFromUpstream')) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1wdWxsLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUjs7RUFDUCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO0FBQ2YsUUFBQTtJQUFBLFNBQUEsR0FBZSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBQUgsR0FBK0MsQ0FBQyxVQUFELENBQS9DLEdBQWlFO0lBQzdFLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUFIO2FBQ0UsSUFBQSxDQUFLLElBQUwsRUFBVztRQUFDLFdBQUEsU0FBRDtPQUFYLEVBREY7S0FBQSxNQUFBO2FBR0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsQ0FBUixFQUFvQjtRQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO09BQXBCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2VBQVUsSUFBSSxjQUFBLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQjtVQUFBLElBQUEsRUFBTSxNQUFOO1VBQWMsU0FBQSxFQUFXLFNBQXpCO1NBQTNCLENBQThELENBQUM7TUFBN0UsQ0FETixFQUhGOztFQUZlO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xucHVsbCA9IHJlcXVpcmUgJy4vX3B1bGwnXG5SZW1vdGVMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGV4dHJhQXJncyA9IGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucHVsbFJlYmFzZScpIHRoZW4gWyctLXJlYmFzZSddIGVsc2UgW11cbiAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5hbHdheXNQdWxsRnJvbVVwc3RyZWFtJylcbiAgICBwdWxsIHJlcG8sIHtleHRyYUFyZ3N9XG4gIGVsc2VcbiAgICBnaXQuY21kKFsncmVtb3RlJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+IG5ldyBSZW1vdGVMaXN0VmlldyhyZXBvLCBkYXRhLCBtb2RlOiAncHVsbCcsIGV4dHJhQXJnczogZXh0cmFBcmdzKS5yZXN1bHRcbiJdfQ==
