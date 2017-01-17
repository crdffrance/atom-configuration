(function() {
  var CompositeDisposable, InputView, Os, Path, TextEditorView, View, fs, git, isEmpty, prepFile, ref, showCommitFilePath, showFile, showObject,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), TextEditorView = ref.TextEditorView, View = ref.View;

  git = require('../git');

  showCommitFilePath = function(objectHash) {
    return Path.join(Os.tmpDir(), objectHash + ".diff");
  };

  isEmpty = function(string) {
    return string === '';
  };

  showObject = function(repo, objectHash, file) {
    var args, showFormatOption;
    objectHash = isEmpty(objectHash) ? 'HEAD' : objectHash;
    args = ['show', '--color=never'];
    showFormatOption = atom.config.get('git-plus.general.showFormat');
    if (showFormatOption !== 'none') {
      args.push("--format=" + showFormatOption);
    }
    if (atom.config.get('git-plus.diffs.wordDiff')) {
      args.push('--word-diff');
    }
    args.push(objectHash);
    if (file != null) {
      args.push('--', file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      if (data.length > 0) {
        return prepFile(data, objectHash);
      }
    });
  };

  prepFile = function(text, objectHash) {
    return fs.writeFile(showCommitFilePath(objectHash), text, {
      flag: 'w+'
    }, function(err) {
      if (err) {
        return notifier.addError(err);
      } else {
        return showFile(objectHash);
      }
    });
  };

  showFile = function(objectHash) {
    var disposables, editorForDiffs, filePath, splitDirection;
    filePath = showCommitFilePath(objectHash);
    disposables = new CompositeDisposable;
    editorForDiffs = atom.workspace.getPaneItems().filter(function(item) {
      var ref1;
      return (ref1 = item.getURI()) != null ? ref1.includes('.diff') : void 0;
    })[0];
    if (editorForDiffs != null) {
      return editorForDiffs.setText(fs.readFileSync(filePath, {
        encoding: 'utf-8'
      }));
    } else {
      if (atom.config.get('git-plus.general.openInPane')) {
        splitDirection = atom.config.get('git-plus.general.splitPane');
        atom.workspace.getActivePane()["split" + splitDirection]();
      }
      return atom.workspace.open(filePath, {
        pending: true,
        activatePane: true
      }).then(function(textBuffer) {
        if (textBuffer != null) {
          return disposables.add(textBuffer.onDidDestroy(function() {
            disposables.dispose();
            try {
              return fs.unlinkSync(filePath);
            } catch (error) {}
          }));
        }
      });
    }
  };

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('objectHash', new TextEditorView({
            mini: true,
            placeholderText: 'Commit hash to show. (Defaults to HEAD)'
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
      this.objectHash.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            var text;
            text = _this.objectHash.getModel().getText().split(' ')[0];
            showObject(_this.repo, text);
            return _this.destroy();
          };
        })(this)
      }));
    };

    InputView.prototype.destroy = function() {
      var ref1, ref2;
      if ((ref1 = this.disposables) != null) {
        ref1.dispose();
      }
      return (ref2 = this.panel) != null ? ref2.destroy() : void 0;
    };

    return InputView;

  })(View);

  module.exports = function(repo, objectHash, file) {
    if (objectHash == null) {
      return new InputView(repo);
    } else {
      return showObject(repo, objectHash, file);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zaG93LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUlBQUE7SUFBQTs7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUosc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxtQ0FBRCxFQUFpQjs7RUFFakIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUVOLGtCQUFBLEdBQXFCLFNBQUMsVUFBRDtXQUNuQixJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUEwQixVQUFELEdBQVksT0FBckM7RUFEbUI7O0VBR3JCLE9BQUEsR0FBVSxTQUFDLE1BQUQ7V0FBWSxNQUFBLEtBQVU7RUFBdEI7O0VBRVYsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsSUFBbkI7QUFDWCxRQUFBO0lBQUEsVUFBQSxHQUFnQixPQUFBLENBQVEsVUFBUixDQUFILEdBQTJCLE1BQTNCLEdBQXVDO0lBQ3BELElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxlQUFUO0lBQ1AsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQjtJQUNuQixJQUE0QyxnQkFBQSxLQUFvQixNQUFoRTtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBQSxHQUFZLGdCQUF0QixFQUFBOztJQUNBLElBQTJCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBM0I7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLGFBQVYsRUFBQTs7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QVcsSUFBWCxFQUFpQixVQUFqQixFQUE2QixJQUE3QixFQUhGOztFQURlO0FBckVqQiIsInNvdXJjZXNDb250ZW50IjpbIk9zID0gcmVxdWlyZSAnb3MnXG5QYXRoID0gcmVxdWlyZSAncGF0aCdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcblxue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbntUZXh0RWRpdG9yVmlldywgVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuXG5zaG93Q29tbWl0RmlsZVBhdGggPSAob2JqZWN0SGFzaCkgLT5cbiAgUGF0aC5qb2luIE9zLnRtcERpcigpLCBcIiN7b2JqZWN0SGFzaH0uZGlmZlwiXG5cbmlzRW1wdHkgPSAoc3RyaW5nKSAtPiBzdHJpbmcgaXMgJydcblxuc2hvd09iamVjdCA9IChyZXBvLCBvYmplY3RIYXNoLCBmaWxlKSAtPlxuICBvYmplY3RIYXNoID0gaWYgaXNFbXB0eSBvYmplY3RIYXNoIHRoZW4gJ0hFQUQnIGVsc2Ugb2JqZWN0SGFzaFxuICBhcmdzID0gWydzaG93JywgJy0tY29sb3I9bmV2ZXInXVxuICBzaG93Rm9ybWF0T3B0aW9uID0gYXRvbS5jb25maWcuZ2V0ICdnaXQtcGx1cy5nZW5lcmFsLnNob3dGb3JtYXQnXG4gIGFyZ3MucHVzaCBcIi0tZm9ybWF0PSN7c2hvd0Zvcm1hdE9wdGlvbn1cIiBpZiBzaG93Rm9ybWF0T3B0aW9uICE9ICdub25lJ1xuICBhcmdzLnB1c2ggJy0td29yZC1kaWZmJyBpZiBhdG9tLmNvbmZpZy5nZXQgJ2dpdC1wbHVzLmRpZmZzLndvcmREaWZmJ1xuICBhcmdzLnB1c2ggb2JqZWN0SGFzaFxuICBhcmdzLnB1c2ggJy0tJywgZmlsZSBpZiBmaWxlP1xuXG4gIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+IHByZXBGaWxlKGRhdGEsIG9iamVjdEhhc2gpIGlmIGRhdGEubGVuZ3RoID4gMFxuXG5wcmVwRmlsZSA9ICh0ZXh0LCBvYmplY3RIYXNoKSAtPlxuICBmcy53cml0ZUZpbGUgc2hvd0NvbW1pdEZpbGVQYXRoKG9iamVjdEhhc2gpLCB0ZXh0LCBmbGFnOiAndysnLCAoZXJyKSAtPlxuICAgIGlmIGVyciB0aGVuIG5vdGlmaWVyLmFkZEVycm9yIGVyciBlbHNlIHNob3dGaWxlIG9iamVjdEhhc2hcblxuc2hvd0ZpbGUgPSAob2JqZWN0SGFzaCkgLT5cbiAgZmlsZVBhdGggPSBzaG93Q29tbWl0RmlsZVBhdGgob2JqZWN0SGFzaClcbiAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBlZGl0b3JGb3JEaWZmcyA9IGF0b20ud29ya3NwYWNlLmdldFBhbmVJdGVtcygpLmZpbHRlcigoaXRlbSkgLT4gaXRlbS5nZXRVUkkoKT8uaW5jbHVkZXMoJy5kaWZmJykpWzBdXG4gIGlmIGVkaXRvckZvckRpZmZzP1xuICAgIGVkaXRvckZvckRpZmZzLnNldFRleHQgZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCBlbmNvZGluZzogJ3V0Zi04JylcbiAgZWxzZVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClbXCJzcGxpdCN7c3BsaXREaXJlY3Rpb259XCJdKClcbiAgICBhdG9tLndvcmtzcGFjZVxuICAgICAgLm9wZW4oZmlsZVBhdGgsIHBlbmRpbmc6IHRydWUsIGFjdGl2YXRlUGFuZTogdHJ1ZSlcbiAgICAgIC50aGVuICh0ZXh0QnVmZmVyKSAtPlxuICAgICAgICBpZiB0ZXh0QnVmZmVyP1xuICAgICAgICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0QnVmZmVyLm9uRGlkRGVzdHJveSAtPlxuICAgICAgICAgICAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgICAgICAgICB0cnkgZnMudW5saW5rU3luYyBmaWxlUGF0aFxuXG5jbGFzcyBJbnB1dFZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgPT5cbiAgICAgIEBzdWJ2aWV3ICdvYmplY3RIYXNoJywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogJ0NvbW1pdCBoYXNoIHRvIHNob3cuIChEZWZhdWx0cyB0byBIRUFEKScpXG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQG9iamVjdEhhc2guZm9jdXMoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnOiA9PiBAZGVzdHJveSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNvbmZpcm0nOiA9PlxuICAgICAgdGV4dCA9IEBvYmplY3RIYXNoLmdldE1vZGVsKCkuZ2V0VGV4dCgpLnNwbGl0KCcgJylbMF1cbiAgICAgIHNob3dPYmplY3QoQHJlcG8sIHRleHQpXG4gICAgICBAZGVzdHJveSgpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAZGlzcG9zYWJsZXM/LmRpc3Bvc2UoKVxuICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIG9iamVjdEhhc2gsIGZpbGUpIC0+XG4gIGlmIG5vdCBvYmplY3RIYXNoP1xuICAgIG5ldyBJbnB1dFZpZXcocmVwbylcbiAgZWxzZVxuICAgIHNob3dPYmplY3QocmVwbywgb2JqZWN0SGFzaCwgZmlsZSlcbiJdfQ==
