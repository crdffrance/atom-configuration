(function() {
  var $, CompositeDisposable, InputView, OutputViewManager, TextEditorView, View, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

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
          var args, ref1, view;
          _this.disposables.dispose();
          if ((ref1 = _this.panel) != null) {
            ref1.destroy();
          }
          view = OutputViewManager.create();
          args = _this.commandEditor.getText().split(' ');
          if (args[0] === 1) {
            args.shift();
          }
          return git.cmd(args, {
            cwd: _this.repo.getWorkingDirectory()
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
            view.finish();
            git.refresh(_this.repo);
            return _this.currentPane.activate();
          })["catch"](function(msg) {
            if ((msg != null ? msg.length : void 0) > 0) {
              view.setContent(msg);
            } else {
              view.reset();
            }
            view.finish();
            git.refresh(_this.repo);
            return _this.currentPane.activate();
          });
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = function(repo) {
    return new InputView(repo);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1ydW4uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSw4RkFBQTtJQUFBOzs7RUFBQyxzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLE1BQTRCLE9BQUEsQ0FBUSxzQkFBUixDQUE1QixFQUFDLFNBQUQsRUFBSSxtQ0FBSixFQUFvQjs7RUFFcEIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBRWQ7Ozs7Ozs7SUFDSixTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSCxLQUFDLENBQUEsT0FBRCxDQUFTLGVBQVQsRUFBOEIsSUFBQSxjQUFBLENBQWU7WUFBQSxJQUFBLEVBQU0sSUFBTjtZQUFZLGVBQUEsRUFBaUIsMkJBQTdCO1dBQWYsQ0FBOUI7UUFERztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBTDtJQURROzt3QkFJVixVQUFBLEdBQVksU0FBQyxLQUFEO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFDWCxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUk7TUFDbkIsSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBQTs7UUFDZixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsS0FBZixDQUFBO01BRUEsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixrQkFBbEIsRUFBc0M7UUFBQSxhQUFBLEVBQWUsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO0FBQ3BFLGdCQUFBOztrQkFBTSxDQUFFLE9BQVIsQ0FBQTs7WUFDQSxLQUFDLENBQUEsV0FBVyxDQUFDLFFBQWIsQ0FBQTttQkFDQSxLQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTtVQUhvRTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBZjtPQUF0QyxDQUFqQjthQUtBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDLGNBQXRDLEVBQXNELENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxDQUFEO0FBQ3JFLGNBQUE7VUFBQSxLQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTs7Z0JBQ00sQ0FBRSxPQUFSLENBQUE7O1VBQ0EsSUFBQSxHQUFPLGlCQUFpQixDQUFDLE1BQWxCLENBQUE7VUFDUCxJQUFBLEdBQU8sS0FBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBd0IsQ0FBQyxLQUF6QixDQUErQixHQUEvQjtVQUNQLElBQUcsSUFBSyxDQUFBLENBQUEsQ0FBTCxLQUFXLENBQWQ7WUFBcUIsSUFBSSxDQUFDLEtBQUwsQ0FBQSxFQUFyQjs7aUJBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7WUFBQSxHQUFBLEVBQUssS0FBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7V0FBZCxFQUFnRDtZQUFDLEtBQUEsRUFBTyxJQUFSO1dBQWhELENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO0FBQ0osZ0JBQUE7WUFBQSxHQUFBLEdBQU0sTUFBQSxHQUFNLENBQUMsSUFBSSxDQUFDLElBQUwsQ0FBVSxHQUFWLENBQUQsQ0FBTixHQUFzQjtZQUM1QixRQUFRLENBQUMsVUFBVCxDQUFvQixHQUFwQjtZQUNBLG9CQUFHLElBQUksQ0FBRSxnQkFBTixHQUFlLENBQWxCO2NBQ0UsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEIsRUFERjthQUFBLE1BQUE7Y0FHRSxJQUFJLENBQUMsS0FBTCxDQUFBLEVBSEY7O1lBSUEsSUFBSSxDQUFDLE1BQUwsQ0FBQTtZQUNBLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBQyxDQUFBLElBQWI7bUJBQ0EsS0FBQyxDQUFBLFdBQVcsQ0FBQyxRQUFiLENBQUE7VUFUSSxDQUROLENBV0EsRUFBQyxLQUFELEVBWEEsQ0FXTyxTQUFDLEdBQUQ7WUFDTCxtQkFBRyxHQUFHLENBQUUsZ0JBQUwsR0FBYyxDQUFqQjtjQUNFLElBQUksQ0FBQyxVQUFMLENBQWdCLEdBQWhCLEVBREY7YUFBQSxNQUFBO2NBR0UsSUFBSSxDQUFDLEtBQUwsQ0FBQSxFQUhGOztZQUlBLElBQUksQ0FBQyxNQUFMLENBQUE7WUFDQSxHQUFHLENBQUMsT0FBSixDQUFZLEtBQUMsQ0FBQSxJQUFiO21CQUNBLEtBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBO1VBUEssQ0FYUDtRQU5xRTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdEQsQ0FBakI7SUFaVTs7OztLQUxVOztFQTJDeEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO1dBQWMsSUFBQSxTQUFBLENBQVUsSUFBVjtFQUFkO0FBbERqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5PdXRwdXRWaWV3TWFuYWdlciA9IHJlcXVpcmUgJy4uL291dHB1dC12aWV3LW1hbmFnZXInXG5cbmNsYXNzIElucHV0VmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiA9PlxuICAgICAgQHN1YnZpZXcgJ2NvbW1hbmRFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiAnR2l0IGNvbW1hbmQgYW5kIGFyZ3VtZW50cycpXG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQGNvbW1hbmRFZGl0b3IuZm9jdXMoKVxuXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNhbmNlbCc6IChlKSA9PlxuICAgICAgQHBhbmVsPy5kZXN0cm95KClcbiAgICAgIEBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpXG4gICAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG5cbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y29uZmlybScsIChlKSA9PlxuICAgICAgQGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgICAgQHBhbmVsPy5kZXN0cm95KClcbiAgICAgIHZpZXcgPSBPdXRwdXRWaWV3TWFuYWdlci5jcmVhdGUoKVxuICAgICAgYXJncyA9IEBjb21tYW5kRWRpdG9yLmdldFRleHQoKS5zcGxpdCgnICcpXG4gICAgICBpZiBhcmdzWzBdIGlzIDEgdGhlbiBhcmdzLnNoaWZ0KClcbiAgICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgbXNnID0gXCJnaXQgI3thcmdzLmpvaW4oJyAnKX0gd2FzIHN1Y2Nlc3NmdWxcIlxuICAgICAgICBub3RpZmllci5hZGRTdWNjZXNzKG1zZylcbiAgICAgICAgaWYgZGF0YT8ubGVuZ3RoID4gMFxuICAgICAgICAgIHZpZXcuc2V0Q29udGVudCBkYXRhXG4gICAgICAgIGVsc2VcbiAgICAgICAgICB2aWV3LnJlc2V0KClcbiAgICAgICAgdmlldy5maW5pc2goKVxuICAgICAgICBnaXQucmVmcmVzaCBAcmVwb1xuICAgICAgICBAY3VycmVudFBhbmUuYWN0aXZhdGUoKVxuICAgICAgLmNhdGNoIChtc2cpID0+XG4gICAgICAgIGlmIG1zZz8ubGVuZ3RoID4gMFxuICAgICAgICAgIHZpZXcuc2V0Q29udGVudCBtc2dcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHZpZXcucmVzZXQoKVxuICAgICAgICB2aWV3LmZpbmlzaCgpXG4gICAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICAgIEBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+IG5ldyBJbnB1dFZpZXcocmVwbylcbiJdfQ==
