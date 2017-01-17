(function() {
  var $, CompositeDisposable, InputView, OutputViewManager, TextEditorView, View, git, notifier, ref, runCommand,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  runCommand = function(args, workingDirectory) {
    var view;
    view = OutputViewManager.create();
    return git.cmd(args, {
      cwd: workingDirectory
    }, {
      color: true
    }).then(function(data) {
      var msg;
      msg = "git " + (args.join(' ')) + " was successful";
      notifier.addSuccess(msg);
      if ((data != null ? data.length : void 0) > 0) {
        view.setContent(data);
      } else {
        view.reset();
      }
      return view.finish();
    })["catch"]((function(_this) {
      return function(msg) {
        if ((msg != null ? msg.length : void 0) > 0) {
          view.setContent(msg);
        } else {
          view.reset();
        }
        return view.finish();
      };
    })(this));
  };

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('commandEditor', new TextEditorView({
            mini: true,
            placeholderText: 'Git command and arguments'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo1) {
      this.repo = repo1;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.commandEditor.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(e) {
            var ref1;
            if ((ref1 = _this.panel) != null) {
              ref1.destroy();
            }
            _this.currentPane.activate();
            return _this.disposables.dispose();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function(e) {
          var args, ref1;
          _this.disposables.dispose();
          if ((ref1 = _this.panel) != null) {
            ref1.destroy();
          }
          args = _this.commandEditor.getText().split(' ');
          if (args[0] === 1) {
            args.shift();
          }
          return runCommand(args, _this.repo.getWorkingDirectory()).then(function() {
            return _this.currentPane.activate();
          });
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = function(repo, args) {
    if (args) {
      args = args.split(' ');
      return runCommand(args, repo.getWorkingDirectory());
    } else {
      return new InputView(repo);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1ydW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwwR0FBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxtQ0FBSixFQUFvQjs7RUFFcEIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBRXBCLFVBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxnQkFBUDtBQUNYLFFBQUE7SUFBQSxJQUFBLEdBQU8saUJBQWlCLENBQUMsTUFBbEIsQ0FBQTtXQUNQLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO01BQUEsR0FBQSxFQUFLLGdCQUFMO0tBQWQsRUFBcUM7TUFBQyxLQUFBLEVBQU8sSUFBUjtLQUFyQyxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtBQUNKLFVBQUE7TUFBQSxHQUFBLEdBQU0sTUFBQSxHQUFNLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBQUQsQ0FBTixHQUFzQjtNQUM1QixRQUFRLENBQUMsVUFBVCxDQUFvQixHQUFwQjtNQUNBLG9CQUFHLElBQUksQ0FBRSxnQkFBTixHQUFlLENBQWxCO1FBQ0UsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEIsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFJLENBQUMsS0FBTCxDQUFBLEVBSEY7O2FBSUEsSUFBSSxDQUFDLE1BQUwsQ0FBQTtJQVBJLENBRE4sQ0FTQSxFQUFDLEtBQUQsRUFUQSxDQVNPLENBQUEsU0FBQSxLQUFBO2FBQUEsU0FBQyxHQUFEO1FBQ0wsbUJBQUcsR0FBRyxDQUFFLGdCQUFMLEdBQWMsQ0FBakI7VUFDRSxJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixFQURGO1NBQUEsTUFBQTtVQUdFLElBQUksQ0FBQyxLQUFMLENBQUEsRUFIRjs7ZUFJQSxJQUFJLENBQUMsTUFBTCxDQUFBO01BTEs7SUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBVFA7RUFGVzs7RUFrQlA7Ozs7Ozs7SUFDSixTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSCxLQUFDLENBQUEsT0FBRCxDQUFTLGVBQVQsRUFBOEIsSUFBQSxjQUFBLENBQWU7WUFBQSxJQUFBLEVBQU0sSUFBTjtZQUFZLGVBQUEsRUFBaUIsMkJBQTdCO1dBQWYsQ0FBOUI7UUFERztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTDtJQURROzt3QkFJVixVQUFBLEdBQVksU0FBQyxLQUFEO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFDWCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTs7UUFDZixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsS0FBZixDQUFBO01BRUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7UUFBQSxhQUFBLEVBQWUsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO0FBQ3BFLGdCQUFBOztrQkFBTSxDQUFFLE9BQVIsQ0FBQTs7WUFDQSxLQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBQTttQkFDQSxLQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTtVQUhvRTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZjtPQUF0QyxDQUFqQjthQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLGNBQXRDLEVBQXNELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO0FBQ3JFLGNBQUE7VUFBQSxLQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTs7Z0JBQ00sQ0FBRSxPQUFSLENBQUE7O1VBQ0EsSUFBQSxHQUFPLEtBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBLENBQXdCLENBQUMsS0FBekIsQ0FBK0IsR0FBL0I7VUFFUCxJQUFHLElBQUssQ0FBQSxDQUFBLENBQUwsS0FBVyxDQUFkO1lBQXFCLElBQUksQ0FBQyxLQUFMLENBQUEsRUFBckI7O2lCQUNBLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLEtBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFqQixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUE7bUJBQUcsS0FBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUE7VUFBSCxDQUROO1FBTnFFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0RCxDQUFqQjtJQVpVOzs7O0tBTFU7O0VBMEJ4QixNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFDLElBQUQsRUFBTyxJQUFQO0lBQ2YsSUFBRyxJQUFIO01BQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWDthQUNQLFVBQUEsQ0FBVyxJQUFYLEVBQWlCLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQWpCLEVBRkY7S0FBQSxNQUFBO2FBSU0sSUFBQSxTQUFBLENBQVUsSUFBVixFQUpOOztFQURlO0FBbkRqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5PdXRwdXRWaWV3TWFuYWdlciA9IHJlcXVpcmUgJy4uL291dHB1dC12aWV3LW1hbmFnZXInXG5cbnJ1bkNvbW1hbmQgPSAoYXJncywgd29ya2luZ0RpcmVjdG9yeSkgLT5cbiAgdmlldyA9IE91dHB1dFZpZXdNYW5hZ2VyLmNyZWF0ZSgpXG4gIGdpdC5jbWQoYXJncywgY3dkOiB3b3JraW5nRGlyZWN0b3J5LCB7Y29sb3I6IHRydWV9KVxuICAudGhlbiAoZGF0YSkgLT5cbiAgICBtc2cgPSBcImdpdCAje2FyZ3Muam9pbignICcpfSB3YXMgc3VjY2Vzc2Z1bFwiXG4gICAgbm90aWZpZXIuYWRkU3VjY2Vzcyhtc2cpXG4gICAgaWYgZGF0YT8ubGVuZ3RoID4gMFxuICAgICAgdmlldy5zZXRDb250ZW50IGRhdGFcbiAgICBlbHNlXG4gICAgICB2aWV3LnJlc2V0KClcbiAgICB2aWV3LmZpbmlzaCgpXG4gIC5jYXRjaCAobXNnKSA9PlxuICAgIGlmIG1zZz8ubGVuZ3RoID4gMFxuICAgICAgdmlldy5zZXRDb250ZW50IG1zZ1xuICAgIGVsc2VcbiAgICAgIHZpZXcucmVzZXQoKVxuICAgIHZpZXcuZmluaXNoKClcblxuY2xhc3MgSW5wdXRWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2ID0+XG4gICAgICBAc3VidmlldyAnY29tbWFuZEVkaXRvcicsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdHaXQgY29tbWFuZCBhbmQgYXJndW1lbnRzJylcblxuICBpbml0aWFsaXplOiAoQHJlcG8pIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAY3VycmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAY29tbWFuZEVkaXRvci5mb2N1cygpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJzogKGUpID0+XG4gICAgICBAcGFuZWw/LmRlc3Ryb3koKVxuICAgICAgQGN1cnJlbnRQYW5lLmFjdGl2YXRlKClcbiAgICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjb25maXJtJywgKGUpID0+XG4gICAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICBAcGFuZWw/LmRlc3Ryb3koKVxuICAgICAgYXJncyA9IEBjb21tYW5kRWRpdG9yLmdldFRleHQoKS5zcGxpdCgnICcpXG4gICAgICAjIFRPRE86IHJlbW92ZSB0aGlzP1xuICAgICAgaWYgYXJnc1swXSBpcyAxIHRoZW4gYXJncy5zaGlmdCgpXG4gICAgICBydW5Db21tYW5kIGFyZ3MsIEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuICAgICAgLnRoZW4gPT4gQGN1cnJlbnRQYW5lLmFjdGl2YXRlKClcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywgYXJncykgLT5cbiAgaWYgYXJnc1xuICAgIGFyZ3MgPSBhcmdzLnNwbGl0KCcgJylcbiAgICBydW5Db21tYW5kIGFyZ3MsIHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gIGVsc2VcbiAgICBuZXcgSW5wdXRWaWV3KHJlcG8pXG4iXX0=
