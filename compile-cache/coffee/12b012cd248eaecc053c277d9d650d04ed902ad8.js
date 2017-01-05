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
    showFormatOption = atom.config.get('git-plus.showFormat');
    if (showFormatOption !== 'none') {
      args.push("--format=" + showFormatOption);
    }
    if (atom.config.get('git-plus.wordDiff')) {
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
    var disposables, splitDirection;
    disposables = new CompositeDisposable;
    if (atom.config.get('git-plus.openInPane')) {
      splitDirection = atom.config.get('git-plus.splitPane');
      atom.workspace.getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(showCommitFilePath(objectHash), {
      activatePane: true
    }).then(function(textBuffer) {
      if (textBuffer != null) {
        return disposables.add(textBuffer.onDidDestroy(function() {
          disposables.dispose();
          try {
            return fs.unlinkSync(showCommitFilePath(objectHash));
          } catch (error) {}
        }));
      }
    });
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zaG93LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUlBQUE7SUFBQTs7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUosc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxtQ0FBRCxFQUFpQjs7RUFFakIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUVOLGtCQUFBLEdBQXFCLFNBQUMsVUFBRDtXQUNuQixJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUEwQixVQUFELEdBQVksT0FBckM7RUFEbUI7O0VBR3JCLE9BQUEsR0FBVSxTQUFDLE1BQUQ7V0FBWSxNQUFBLEtBQVU7RUFBdEI7O0VBRVYsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsSUFBbkI7QUFDWCxRQUFBO0lBQUEsVUFBQSxHQUFnQixPQUFBLENBQVEsVUFBUixDQUFILEdBQTJCLE1BQTNCLEdBQXVDO0lBQ3BELElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxlQUFUO0lBQ1AsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQjtJQUNuQixJQUE0QyxnQkFBQSxLQUFvQixNQUFoRTtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBQSxHQUFZLGdCQUF0QixFQUFBOztJQUNBLElBQTJCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixtQkFBaEIsQ0FBM0I7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLGFBQVYsRUFBQTs7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QUEsQ0FBZjtPQUF0QyxDQUFqQjthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsR0FBYixDQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isa0JBQWxCLEVBQXNDO1FBQUEsY0FBQSxFQUFnQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO0FBQ3JFLGdCQUFBO1lBQUEsSUFBQSxHQUFPLEtBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBQXNCLENBQUMsT0FBdkIsQ0FBQSxDQUFnQyxDQUFDLEtBQWpDLENBQXVDLEdBQXZDLENBQTRDLENBQUEsQ0FBQTtZQUNuRCxVQUFBLENBQVcsS0FBQyxDQUFBLElBQVosRUFBa0IsSUFBbEI7bUJBQ0EsS0FBQyxDQUFBLE9BQUQsQ0FBQTtVQUhxRTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBaEI7T0FBdEMsQ0FBakI7SUFQVTs7d0JBWVosT0FBQSxHQUFTLFNBQUE7QUFDUCxVQUFBOztZQUFZLENBQUUsT0FBZCxDQUFBOzsrQ0FDTSxDQUFFLE9BQVIsQ0FBQTtJQUZPOzs7O0tBakJhOztFQXFCeEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sVUFBUCxFQUFtQixJQUFuQjtJQUNmLElBQU8sa0JBQVA7YUFDTSxJQUFBLFNBQUEsQ0FBVSxJQUFWLEVBRE47S0FBQSxNQUFBO2FBR0UsVUFBQSxDQUFXLElBQVgsRUFBaUIsVUFBakIsRUFBNkIsSUFBN0IsRUFIRjs7RUFEZTtBQWhFakIiLCJzb3VyY2VzQ29udGVudCI6WyJPcyA9IHJlcXVpcmUgJ29zJ1xuUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5cbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57VGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblxuc2hvd0NvbW1pdEZpbGVQYXRoID0gKG9iamVjdEhhc2gpIC0+XG4gIFBhdGguam9pbiBPcy50bXBEaXIoKSwgXCIje29iamVjdEhhc2h9LmRpZmZcIlxuXG5pc0VtcHR5ID0gKHN0cmluZykgLT4gc3RyaW5nIGlzICcnXG5cbnNob3dPYmplY3QgPSAocmVwbywgb2JqZWN0SGFzaCwgZmlsZSkgLT5cbiAgb2JqZWN0SGFzaCA9IGlmIGlzRW1wdHkgb2JqZWN0SGFzaCB0aGVuICdIRUFEJyBlbHNlIG9iamVjdEhhc2hcbiAgYXJncyA9IFsnc2hvdycsICctLWNvbG9yPW5ldmVyJ11cbiAgc2hvd0Zvcm1hdE9wdGlvbiA9IGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMuc2hvd0Zvcm1hdCdcbiAgYXJncy5wdXNoIFwiLS1mb3JtYXQ9I3tzaG93Rm9ybWF0T3B0aW9ufVwiIGlmIHNob3dGb3JtYXRPcHRpb24gIT0gJ25vbmUnXG4gIGFyZ3MucHVzaCAnLS13b3JkLWRpZmYnIGlmIGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMud29yZERpZmYnXG4gIGFyZ3MucHVzaCBvYmplY3RIYXNoXG4gIGFyZ3MucHVzaCAnLS0nLCBmaWxlIGlmIGZpbGU/XG5cbiAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT4gcHJlcEZpbGUoZGF0YSwgb2JqZWN0SGFzaCkgaWYgZGF0YS5sZW5ndGggPiAwXG5cbnByZXBGaWxlID0gKHRleHQsIG9iamVjdEhhc2gpIC0+XG4gIGZzLndyaXRlRmlsZSBzaG93Q29tbWl0RmlsZVBhdGgob2JqZWN0SGFzaCksIHRleHQsIGZsYWc6ICd3KycsIChlcnIpIC0+XG4gICAgaWYgZXJyIHRoZW4gbm90aWZpZXIuYWRkRXJyb3IgZXJyIGVsc2Ugc2hvd0ZpbGUgb2JqZWN0SGFzaFxuXG5zaG93RmlsZSA9IChvYmplY3RIYXNoKSAtPlxuICBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMub3BlbkluUGFuZScpXG4gICAgc3BsaXREaXJlY3Rpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLnNwbGl0UGFuZScpXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpW1wic3BsaXQje3NwbGl0RGlyZWN0aW9ufVwiXSgpXG4gIGF0b20ud29ya3NwYWNlXG4gICAgLm9wZW4oc2hvd0NvbW1pdEZpbGVQYXRoKG9iamVjdEhhc2gpLCBhY3RpdmF0ZVBhbmU6IHRydWUpXG4gICAgLnRoZW4gKHRleHRCdWZmZXIpIC0+XG4gICAgICBpZiB0ZXh0QnVmZmVyP1xuICAgICAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEJ1ZmZlci5vbkRpZERlc3Ryb3kgLT5cbiAgICAgICAgICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgICAgICB0cnkgZnMudW5saW5rU3luYyBzaG93Q29tbWl0RmlsZVBhdGgob2JqZWN0SGFzaClcblxuY2xhc3MgSW5wdXRWaWV3IGV4dGVuZHMgVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2ID0+XG4gICAgICBAc3VidmlldyAnb2JqZWN0SGFzaCcsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdDb21taXQgaGFzaCB0byBzaG93LiAoRGVmYXVsdHMgdG8gSEVBRCknKVxuXG4gIGluaXRpYWxpemU6IChAcmVwbykgLT5cbiAgICBAZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBvYmplY3RIYXNoLmZvY3VzKClcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJzogPT4gQGRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjb25maXJtJzogPT5cbiAgICAgIHRleHQgPSBAb2JqZWN0SGFzaC5nZXRNb2RlbCgpLmdldFRleHQoKS5zcGxpdCgnICcpWzBdXG4gICAgICBzaG93T2JqZWN0KEByZXBvLCB0ZXh0KVxuICAgICAgQGRlc3Ryb3koKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGRpc3Bvc2FibGVzPy5kaXNwb3NlKClcbiAgICBAcGFuZWw/LmRlc3Ryb3koKVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCBvYmplY3RIYXNoLCBmaWxlKSAtPlxuICBpZiBub3Qgb2JqZWN0SGFzaD9cbiAgICBuZXcgSW5wdXRWaWV3KHJlcG8pXG4gIGVsc2VcbiAgICBzaG93T2JqZWN0KHJlcG8sIG9iamVjdEhhc2gsIGZpbGUpXG4iXX0=
