(function() {
  var $, BranchListView, CompositeDisposable, InputView, RemoteBranchListView, TextEditorView, View, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('../views/branch-list-view');

  RemoteBranchListView = require('../views/remote-branch-list-view');

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('branchEditor', new TextEditorView({
            mini: true,
            placeholderText: 'New branch name'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo1) {
      this.repo = repo1;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      this.panel = atom.workspace.addModalPanel({
        item: this
      });
      this.panel.show();
      this.branchEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(event) {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function(event) {
            return _this.createBranch();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      this.panel.destroy();
      this.disposables.dispose();
      return this.currentPane.activate();
    };

    InputView.prototype.createBranch = function() {
      var name;
      this.destroy();
      name = this.branchEditor.getModel().getText();
      if (name.length > 0) {
        return git.cmd(['checkout', '-b', name], {
          cwd: this.repo.getWorkingDirectory()
        }).then((function(_this) {
          return function(message) {
            notifier.addSuccess(message);
            return git.refresh(_this.repo);
          };
        })(this))["catch"]((function(_this) {
          return function(err) {
            return notifier.addError(err);
          };
        })(this));
      }
    };

    return InputView;

  })(View);

  module.exports.newBranch = function(repo) {
    return new InputView(repo);
  };

  module.exports.gitBranches = function(repo) {
    return git.cmd(['branch', '--no-color'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new BranchListView(repo, data);
    });
  };

  module.exports.gitRemoteBranches = function(repo) {
    return git.cmd(['branch', '-r', '--no-color'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new RemoteBranchListView(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1icmFuY2guY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxpSEFBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxtQ0FBSixFQUFvQjs7RUFFcEIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUjs7RUFDakIsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLGtDQUFSOztFQUVqQjs7Ozs7OztJQUNKLFNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUssQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNILEtBQUMsQ0FBQSxPQUFELENBQVMsY0FBVCxFQUE2QixJQUFBLGNBQUEsQ0FBZTtZQUFBLElBQUEsRUFBTSxJQUFOO1lBQVksZUFBQSxFQUFpQixpQkFBN0I7V0FBZixDQUE3QjtRQURHO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMO0lBRFE7O3dCQUlWLFVBQUEsR0FBWSxTQUFDLEtBQUQ7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUNYLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSTtNQUNuQixJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBO01BQ2YsSUFBQyxDQUFBLEtBQUQsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7UUFBQSxJQUFBLEVBQU0sSUFBTjtPQUE3QjtNQUNULElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO01BRUEsSUFBQyxDQUFBLFlBQVksQ0FBQyxLQUFkLENBQUE7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLEdBQWIsQ0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQztRQUFBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEtBQUQ7bUJBQVcsS0FBQyxDQUFBLE9BQUQsQ0FBQTtVQUFYO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO09BQXRDLENBQWpCO2FBQ0EsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7UUFBQSxjQUFBLEVBQWdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsS0FBRDttQkFBVyxLQUFDLENBQUEsWUFBRCxDQUFBO1VBQVg7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO09BQXRDLENBQWpCO0lBUlU7O3dCQVVaLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBO0lBSE87O3dCQUtULFlBQUEsR0FBYyxTQUFBO0FBQ1osVUFBQTtNQUFBLElBQUMsQ0FBQSxPQUFELENBQUE7TUFDQSxJQUFBLEdBQU8sSUFBQyxDQUFBLFlBQVksQ0FBQyxRQUFkLENBQUEsQ0FBd0IsQ0FBQyxPQUF6QixDQUFBO01BQ1AsSUFBRyxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWpCO2VBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFVBQUQsRUFBYSxJQUFiLEVBQW1CLElBQW5CLENBQVIsRUFBa0M7VUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7U0FBbEMsQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLE9BQUQ7WUFDSixRQUFRLENBQUMsVUFBVCxDQUFvQixPQUFwQjttQkFDQSxHQUFHLENBQUMsT0FBSixDQUFZLEtBQUMsQ0FBQSxJQUFiO1VBRkk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBRE4sQ0FJQSxFQUFDLEtBQUQsRUFKQSxDQUlPLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsR0FBRDttQkFDTCxRQUFRLENBQUMsUUFBVCxDQUFrQixHQUFsQjtVQURLO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUpQLEVBREY7O0lBSFk7Ozs7S0FwQlE7O0VBK0J4QixNQUFNLENBQUMsT0FBTyxDQUFDLFNBQWYsR0FBMkIsU0FBQyxJQUFEO1dBQ3JCLElBQUEsU0FBQSxDQUFVLElBQVY7RUFEcUI7O0VBRzNCLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBZixHQUE2QixTQUFDLElBQUQ7V0FDM0IsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsRUFBVyxZQUFYLENBQVIsRUFBa0M7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFsQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDthQUFjLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsSUFBckI7SUFBZCxDQUROO0VBRDJCOztFQUk3QixNQUFNLENBQUMsT0FBTyxDQUFDLGlCQUFmLEdBQW1DLFNBQUMsSUFBRDtXQUNqQyxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxFQUFXLElBQVgsRUFBaUIsWUFBakIsQ0FBUixFQUF3QztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQXhDLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQWMsSUFBQSxvQkFBQSxDQUFxQixJQUFyQixFQUEyQixJQUEzQjtJQUFkLENBRE47RUFEaUM7QUE5Q25DIiwic291cmNlc0NvbnRlbnQiOlsie0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbnskLCBUZXh0RWRpdG9yVmlldywgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbkJyYW5jaExpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvYnJhbmNoLWxpc3QtdmlldydcblJlbW90ZUJyYW5jaExpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvcmVtb3RlLWJyYW5jaC1saXN0LXZpZXcnXG5cbmNsYXNzIElucHV0VmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiA9PlxuICAgICAgQHN1YnZpZXcgJ2JyYW5jaEVkaXRvcicsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdOZXcgYnJhbmNoIG5hbWUnKVxuXG4gIGluaXRpYWxpemU6IChAcmVwbykgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIEBwYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG5cbiAgICBAYnJhbmNoRWRpdG9yLmZvY3VzKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJzogKGV2ZW50KSA9PiBAZGVzdHJveSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNvbmZpcm0nOiAoZXZlbnQpID0+IEBjcmVhdGVCcmFuY2goKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQHBhbmVsLmRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBAY3VycmVudFBhbmUuYWN0aXZhdGUoKVxuXG4gIGNyZWF0ZUJyYW5jaDogLT5cbiAgICBAZGVzdHJveSgpXG4gICAgbmFtZSA9IEBicmFuY2hFZGl0b3IuZ2V0TW9kZWwoKS5nZXRUZXh0KClcbiAgICBpZiBuYW1lLmxlbmd0aCA+IDBcbiAgICAgIGdpdC5jbWQoWydjaGVja291dCcsICctYicsIG5hbWVdLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChtZXNzYWdlKSA9PlxuICAgICAgICBub3RpZmllci5hZGRTdWNjZXNzIG1lc3NhZ2VcbiAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgIC5jYXRjaCAoZXJyKSA9PlxuICAgICAgICBub3RpZmllci5hZGRFcnJvciBlcnJcblxubW9kdWxlLmV4cG9ydHMubmV3QnJhbmNoID0gKHJlcG8pIC0+XG4gIG5ldyBJbnB1dFZpZXcocmVwbylcblxubW9kdWxlLmV4cG9ydHMuZ2l0QnJhbmNoZXMgPSAocmVwbykgLT5cbiAgZ2l0LmNtZChbJ2JyYW5jaCcsICctLW5vLWNvbG9yJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPiBuZXcgQnJhbmNoTGlzdFZpZXcocmVwbywgZGF0YSlcblxubW9kdWxlLmV4cG9ydHMuZ2l0UmVtb3RlQnJhbmNoZXMgPSAocmVwbykgLT5cbiAgZ2l0LmNtZChbJ2JyYW5jaCcsICctcicsICctLW5vLWNvbG9yJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPiBuZXcgUmVtb3RlQnJhbmNoTGlzdFZpZXcocmVwbywgZGF0YSlcbiJdfQ==
