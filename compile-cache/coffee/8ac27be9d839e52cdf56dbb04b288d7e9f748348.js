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
      return item.getURI().includes('.diff');
    })[0];
    if (editorForDiffs) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zaG93LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEseUlBQUE7SUFBQTs7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUosc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUF5QixPQUFBLENBQVEsc0JBQVIsQ0FBekIsRUFBQyxtQ0FBRCxFQUFpQjs7RUFFakIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUVOLGtCQUFBLEdBQXFCLFNBQUMsVUFBRDtXQUNuQixJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsQ0FBQyxNQUFILENBQUEsQ0FBVixFQUEwQixVQUFELEdBQVksT0FBckM7RUFEbUI7O0VBR3JCLE9BQUEsR0FBVSxTQUFDLE1BQUQ7V0FBWSxNQUFBLEtBQVU7RUFBdEI7O0VBRVYsVUFBQSxHQUFhLFNBQUMsSUFBRCxFQUFPLFVBQVAsRUFBbUIsSUFBbkI7QUFDWCxRQUFBO0lBQUEsVUFBQSxHQUFnQixPQUFBLENBQVEsVUFBUixDQUFILEdBQTJCLE1BQTNCLEdBQXVDO0lBQ3BELElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxlQUFUO0lBQ1AsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQjtJQUNuQixJQUE0QyxnQkFBQSxLQUFvQixNQUFoRTtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsV0FBQSxHQUFZLGdCQUF0QixFQUFBOztJQUNBLElBQTJCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FBM0I7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLGFBQVYsRUFBQTs7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O2FBR0UsVUFBQSxDQUFXLElBQVgsRUFBaUIsVUFBakIsRUFBNkIsSUFBN0IsRUFIRjs7RUFEZTtBQXJFakIiLCJzb3VyY2VzQ29udGVudCI6WyJPcyA9IHJlcXVpcmUgJ29zJ1xuUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5cbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57VGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblxuc2hvd0NvbW1pdEZpbGVQYXRoID0gKG9iamVjdEhhc2gpIC0+XG4gIFBhdGguam9pbiBPcy50bXBEaXIoKSwgXCIje29iamVjdEhhc2h9LmRpZmZcIlxuXG5pc0VtcHR5ID0gKHN0cmluZykgLT4gc3RyaW5nIGlzICcnXG5cbnNob3dPYmplY3QgPSAocmVwbywgb2JqZWN0SGFzaCwgZmlsZSkgLT5cbiAgb2JqZWN0SGFzaCA9IGlmIGlzRW1wdHkgb2JqZWN0SGFzaCB0aGVuICdIRUFEJyBlbHNlIG9iamVjdEhhc2hcbiAgYXJncyA9IFsnc2hvdycsICctLWNvbG9yPW5ldmVyJ11cbiAgc2hvd0Zvcm1hdE9wdGlvbiA9IGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMuZ2VuZXJhbC5zaG93Rm9ybWF0J1xuICBhcmdzLnB1c2ggXCItLWZvcm1hdD0je3Nob3dGb3JtYXRPcHRpb259XCIgaWYgc2hvd0Zvcm1hdE9wdGlvbiAhPSAnbm9uZSdcbiAgYXJncy5wdXNoICctLXdvcmQtZGlmZicgaWYgYXRvbS5jb25maWcuZ2V0ICdnaXQtcGx1cy5kaWZmcy53b3JkRGlmZidcbiAgYXJncy5wdXNoIG9iamVjdEhhc2hcbiAgYXJncy5wdXNoICctLScsIGZpbGUgaWYgZmlsZT9cblxuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPiBwcmVwRmlsZShkYXRhLCBvYmplY3RIYXNoKSBpZiBkYXRhLmxlbmd0aCA+IDBcblxucHJlcEZpbGUgPSAodGV4dCwgb2JqZWN0SGFzaCkgLT5cbiAgZnMud3JpdGVGaWxlIHNob3dDb21taXRGaWxlUGF0aChvYmplY3RIYXNoKSwgdGV4dCwgZmxhZzogJ3crJywgKGVycikgLT5cbiAgICBpZiBlcnIgdGhlbiBub3RpZmllci5hZGRFcnJvciBlcnIgZWxzZSBzaG93RmlsZSBvYmplY3RIYXNoXG5cbnNob3dGaWxlID0gKG9iamVjdEhhc2gpIC0+XG4gIGZpbGVQYXRoID0gc2hvd0NvbW1pdEZpbGVQYXRoKG9iamVjdEhhc2gpXG4gIGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgZWRpdG9yRm9yRGlmZnMgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKS5maWx0ZXIoKGl0ZW0pIC0+IGl0ZW0uZ2V0VVJJKCkuaW5jbHVkZXMoJy5kaWZmJykpWzBdXG4gIGlmIGVkaXRvckZvckRpZmZzXG4gICAgZWRpdG9yRm9yRGlmZnMuc2V0VGV4dCBmcy5yZWFkRmlsZVN5bmMoZmlsZVBhdGgsIGVuY29kaW5nOiAndXRmLTgnKVxuICBlbHNlXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgICAgc3BsaXREaXJlY3Rpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwuc3BsaXRQYW5lJylcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVtcInNwbGl0I3tzcGxpdERpcmVjdGlvbn1cIl0oKVxuICAgIGF0b20ud29ya3NwYWNlXG4gICAgICAub3BlbihmaWxlUGF0aCwgcGVuZGluZzogdHJ1ZSwgYWN0aXZhdGVQYW5lOiB0cnVlKVxuICAgICAgLnRoZW4gKHRleHRCdWZmZXIpIC0+XG4gICAgICAgIGlmIHRleHRCdWZmZXI/XG4gICAgICAgICAgZGlzcG9zYWJsZXMuYWRkIHRleHRCdWZmZXIub25EaWREZXN0cm95IC0+XG4gICAgICAgICAgICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICAgICAgICAgIHRyeSBmcy51bmxpbmtTeW5jIGZpbGVQYXRoXG5cbmNsYXNzIElucHV0VmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiA9PlxuICAgICAgQHN1YnZpZXcgJ29iamVjdEhhc2gnLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiAnQ29tbWl0IGhhc2ggdG8gc2hvdy4gKERlZmF1bHRzIHRvIEhFQUQpJylcblxuICBpbml0aWFsaXplOiAoQHJlcG8pIC0+XG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAY3VycmVudFBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAb2JqZWN0SGFzaC5mb2N1cygpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNhbmNlbCc6ID0+IEBkZXN0cm95KClcbiAgICBAZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y29uZmlybSc6ID0+XG4gICAgICB0ZXh0ID0gQG9iamVjdEhhc2guZ2V0TW9kZWwoKS5nZXRUZXh0KCkuc3BsaXQoJyAnKVswXVxuICAgICAgc2hvd09iamVjdChAcmVwbywgdGV4dClcbiAgICAgIEBkZXN0cm95KClcblxuICBkZXN0cm95OiAtPlxuICAgIEBkaXNwb3NhYmxlcz8uZGlzcG9zZSgpXG4gICAgQHBhbmVsPy5kZXN0cm95KClcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywgb2JqZWN0SGFzaCwgZmlsZSkgLT5cbiAgaWYgbm90IG9iamVjdEhhc2g/XG4gICAgbmV3IElucHV0VmlldyhyZXBvKVxuICBlbHNlXG4gICAgc2hvd09iamVjdChyZXBvLCBvYmplY3RIYXNoLCBmaWxlKVxuIl19
