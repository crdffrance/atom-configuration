(function() {
  var CompositeDisposable, GitPull, GitPush, Path, cleanup, commit, destroyCommitEditor, disposables, fs, getStagedFiles, getTemplate, git, notifier, prepFile, showFile, trimFile, verboseCommitsEnabled;

  Path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  GitPush = require('./git-push');

  GitPull = require('./git-pull');

  disposables = new CompositeDisposable;

  verboseCommitsEnabled = function() {
    return atom.config.get('git-plus.verboseCommits');
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      if (files.length >= 1) {
        return git.cmd(['-c', 'color.ui=false', 'status'], {
          cwd: repo.getWorkingDirectory()
        });
      } else {
        return Promise.reject("Nothing to commit.");
      }
    });
  };

  getTemplate = function(filePath) {
    if (filePath) {
      return fs.readFileSync(fs.absolute(filePath.trim())).toString().trim();
    } else {
      return '';
    }
  };

  prepFile = function(arg) {
    var commentChar, content, cwd, diff, filePath, status, template;
    status = arg.status, filePath = arg.filePath, diff = arg.diff, commentChar = arg.commentChar, template = arg.template;
    cwd = Path.dirname(filePath);
    status = status.replace(/\s*\(.*\)\n/g, "\n");
    status = status.trim().replace(/\n/g, "\n" + commentChar + " ");
    content = template + "\n" + commentChar + " Please enter the commit message for your changes. Lines starting\n" + commentChar + " with '" + commentChar + "' will be ignored, and an empty message aborts the commit.\n" + commentChar + "\n" + commentChar + " " + status;
    if (diff) {
      content += "\n" + commentChar + "\n" + commentChar + " ------------------------ >8 ------------------------\n" + commentChar + " Do not touch the line above.\n" + commentChar + " Everything below will be removed.\n" + diff;
    }
    return fs.writeFileSync(filePath, content);
  };

  destroyCommitEditor = function(filePath) {
    var ref, ref1;
    if (atom.config.get('git-plus.openInPane')) {
      return (ref = atom.workspace.paneForURI(filePath)) != null ? ref.destroy() : void 0;
    } else {
      return (ref1 = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref1.destroy() : void 0;
    }
  };

  trimFile = function(filePath, commentChar) {
    var content, cwd, startOfComments;
    cwd = Path.dirname(filePath);
    content = fs.readFileSync(fs.absolute(filePath)).toString();
    startOfComments = content.indexOf(content.split('\n').find(function(line) {
      return line.startsWith(commentChar);
    }));
    content = content.substring(0, startOfComments);
    return fs.writeFileSync(filePath, content);
  };

  commit = function(directory, filePath) {
    return git.cmd(['commit', "--cleanup=strip", "--file=" + filePath], {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor(filePath);
      return git.refresh();
    })["catch"](function(data) {
      notifier.addError(data);
      return destroyCommitEditor(filePath);
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    disposables.dispose();
    return fs.removeSync(filePath);
  };

  showFile = function(filePath) {
    var commitEditor, ref, splitDirection;
    commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0;
    if (!commitEditor) {
      if (atom.config.get('git-plus.openInPane')) {
        splitDirection = atom.config.get('git-plus.splitPane');
        atom.workspace.getActivePane()["split" + splitDirection]();
      }
      return atom.workspace.open(filePath);
    } else {
      if (atom.config.get('git-plus.openInPane')) {
        atom.workspace.paneForURI(filePath).activate();
      } else {
        atom.workspace.paneForURI(filePath).activateItemForURI(filePath);
      }
      return Promise.resolve(commitEditor);
    }
  };

  module.exports = function(repo, arg) {
    var andPush, commentChar, currentPane, filePath, init, ref, ref1, stageChanges, startCommit, template;
    ref = arg != null ? arg : {}, stageChanges = ref.stageChanges, andPush = ref.andPush;
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    currentPane = atom.workspace.getActivePane();
    commentChar = (ref1 = git.getConfig(repo, 'core.commentchar')) != null ? ref1 : '#';
    template = getTemplate(git.getConfig(repo, 'commit.template'));
    init = function() {
      return getStagedFiles(repo).then(function(status) {
        var args;
        if (verboseCommitsEnabled()) {
          args = ['diff', '--color=never', '--staged'];
          if (atom.config.get('git-plus.wordDiff')) {
            args.push('--word-diff');
          }
          return git.cmd(args, {
            cwd: repo.getWorkingDirectory()
          }).then(function(diff) {
            return prepFile({
              status: status,
              filePath: filePath,
              diff: diff,
              commentChar: commentChar,
              template: template
            });
          });
        } else {
          return prepFile({
            status: status,
            filePath: filePath,
            commentChar: commentChar,
            template: template
          });
        }
      });
    };
    startCommit = function() {
      return showFile(filePath).then(function(textEditor) {
        disposables.add(textEditor.onDidSave(function() {
          if (verboseCommitsEnabled()) {
            trimFile(filePath, commentChar);
          }
          return commit(repo.getWorkingDirectory(), filePath).then(function() {
            if (andPush) {
              return GitPush(repo);
            }
          });
        }));
        return disposables.add(textEditor.onDidDestroy(function() {
          return cleanup(currentPane, filePath);
        }));
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };
    if (stageChanges) {
      return git.add(repo, {
        update: stageChanges
      }).then(function() {
        return init();
      }).then(function() {
        return startCommit();
      });
    } else {
      return init().then(function() {
        return startCommit();
      })["catch"](function(message) {
        if (typeof message.includes === "function" ? message.includes('CRLF') : void 0) {
          return startCommit();
        } else {
          return notifier.addInfo(message);
        }
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jb21taXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBQ1YsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUVWLFdBQUEsR0FBYyxJQUFJOztFQUVsQixxQkFBQSxHQUF3QixTQUFBO1dBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQjtFQUFIOztFQUV4QixjQUFBLEdBQWlCLFNBQUMsSUFBRDtXQUNmLEdBQUcsQ0FBQyxXQUFKLENBQWdCLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQyxLQUFEO01BQ3pCLElBQUcsS0FBSyxDQUFDLE1BQU4sSUFBZ0IsQ0FBbkI7ZUFDRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLGdCQUFQLEVBQXlCLFFBQXpCLENBQVIsRUFBNEM7VUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUE1QyxFQURGO09BQUEsTUFBQTtlQUdFLE9BQU8sQ0FBQyxNQUFSLENBQWUsb0JBQWYsRUFIRjs7SUFEeUIsQ0FBM0I7RUFEZTs7RUFPakIsV0FBQSxHQUFjLFNBQUMsUUFBRDtJQUNaLElBQUcsUUFBSDthQUNFLEVBQUUsQ0FBQyxZQUFILENBQWdCLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBUSxDQUFDLElBQVQsQ0FBQSxDQUFaLENBQWhC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LEdBQVosQ0FBZ0IsVUFBVSxDQUFDLFlBQVgsQ0FBd0IsU0FBQTtpQkFBRyxPQUFBLENBQVEsV0FBUixFQUFxQixRQUFyQjtRQUFILENBQXhCLENBQWhCO01BTEksQ0FETixDQU9BLEVBQUMsS0FBRCxFQVBBLENBT08sU0FBQyxHQUFEO2VBQVMsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsR0FBbEI7TUFBVCxDQVBQO0lBRFk7SUFVZCxJQUFHLFlBQUg7YUFDRSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztRQUFBLE1BQUEsRUFBUSxZQUFSO09BQWQsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxTQUFBO2VBQUcsSUFBQSxDQUFBO01BQUgsQ0FBekMsQ0FBbUQsQ0FBQyxJQUFwRCxDQUF5RCxTQUFBO2VBQUcsV0FBQSxDQUFBO01BQUgsQ0FBekQsRUFERjtLQUFBLE1BQUE7YUFHRSxJQUFBLENBQUEsQ0FBTSxDQUFDLElBQVAsQ0FBWSxTQUFBO2VBQUcsV0FBQSxDQUFBO01BQUgsQ0FBWixDQUNBLEVBQUMsS0FBRCxFQURBLENBQ08sU0FBQyxPQUFEO1FBQ0wsNkNBQUcsT0FBTyxDQUFDLFNBQVUsZ0JBQXJCO2lCQUNFLFdBQUEsQ0FBQSxFQURGO1NBQUEsTUFBQTtpQkFHRSxRQUFRLENBQUMsT0FBVCxDQUFpQixPQUFqQixFQUhGOztNQURLLENBRFAsRUFIRjs7RUF2QmU7QUF0RmpCIiwic291cmNlc0NvbnRlbnQiOlsiUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcbkdpdFB1c2ggPSByZXF1aXJlICcuL2dpdC1wdXNoJ1xuR2l0UHVsbCA9IHJlcXVpcmUgJy4vZ2l0LXB1bGwnXG5cbmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxudmVyYm9zZUNvbW1pdHNFbmFibGVkID0gLT4gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy52ZXJib3NlQ29tbWl0cycpXG5cbmdldFN0YWdlZEZpbGVzID0gKHJlcG8pIC0+XG4gIGdpdC5zdGFnZWRGaWxlcyhyZXBvKS50aGVuIChmaWxlcykgLT5cbiAgICBpZiBmaWxlcy5sZW5ndGggPj0gMVxuICAgICAgZ2l0LmNtZChbJy1jJywgJ2NvbG9yLnVpPWZhbHNlJywgJ3N0YXR1cyddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIGVsc2VcbiAgICAgIFByb21pc2UucmVqZWN0IFwiTm90aGluZyB0byBjb21taXQuXCJcblxuZ2V0VGVtcGxhdGUgPSAoZmlsZVBhdGgpIC0+XG4gIGlmIGZpbGVQYXRoXG4gICAgZnMucmVhZEZpbGVTeW5jKGZzLmFic29sdXRlKGZpbGVQYXRoLnRyaW0oKSkpLnRvU3RyaW5nKCkudHJpbSgpXG4gIGVsc2VcbiAgICAnJ1xuXG5wcmVwRmlsZSA9ICh7c3RhdHVzLCBmaWxlUGF0aCwgZGlmZiwgY29tbWVudENoYXIsIHRlbXBsYXRlfSkgLT5cbiAgY3dkID0gUGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICBzdGF0dXMgPSBzdGF0dXMucmVwbGFjZSgvXFxzKlxcKC4qXFwpXFxuL2csIFwiXFxuXCIpXG4gIHN0YXR1cyA9IHN0YXR1cy50cmltKCkucmVwbGFjZSgvXFxuL2csIFwiXFxuI3tjb21tZW50Q2hhcn0gXCIpXG4gIGNvbnRlbnQgPVxuICAgIFwiXCJcIiN7dGVtcGxhdGV9XG4gICAgI3tjb21tZW50Q2hhcn0gUGxlYXNlIGVudGVyIHRoZSBjb21taXQgbWVzc2FnZSBmb3IgeW91ciBjaGFuZ2VzLiBMaW5lcyBzdGFydGluZ1xuICAgICN7Y29tbWVudENoYXJ9IHdpdGggJyN7Y29tbWVudENoYXJ9JyB3aWxsIGJlIGlnbm9yZWQsIGFuZCBhbiBlbXB0eSBtZXNzYWdlIGFib3J0cyB0aGUgY29tbWl0LlxuICAgICN7Y29tbWVudENoYXJ9XG4gICAgI3tjb21tZW50Q2hhcn0gI3tzdGF0dXN9XCJcIlwiXG4gIGlmIGRpZmZcbiAgICBjb250ZW50ICs9XG4gICAgICBcIlwiXCJcXG4je2NvbW1lbnRDaGFyfVxuICAgICAgI3tjb21tZW50Q2hhcn0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tID44IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgI3tjb21tZW50Q2hhcn0gRG8gbm90IHRvdWNoIHRoZSBsaW5lIGFib3ZlLlxuICAgICAgI3tjb21tZW50Q2hhcn0gRXZlcnl0aGluZyBiZWxvdyB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICAje2RpZmZ9XCJcIlwiXG4gIGZzLndyaXRlRmlsZVN5bmMgZmlsZVBhdGgsIGNvbnRlbnRcblxuZGVzdHJveUNvbW1pdEVkaXRvciA9IChmaWxlUGF0aCkgLT5cbiAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5vcGVuSW5QYW5lJylcbiAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKT8uZGVzdHJveSgpXG4gIGVsc2VcbiAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5pdGVtRm9yVVJJKGZpbGVQYXRoKT8uZGVzdHJveSgpXG5cbnRyaW1GaWxlID0gKGZpbGVQYXRoLCBjb21tZW50Q2hhcikgLT5cbiAgY3dkID0gUGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICBjb250ZW50ID0gZnMucmVhZEZpbGVTeW5jKGZzLmFic29sdXRlKGZpbGVQYXRoKSkudG9TdHJpbmcoKVxuICBzdGFydE9mQ29tbWVudHMgPSBjb250ZW50LmluZGV4T2YoY29udGVudC5zcGxpdCgnXFxuJykuZmluZCAobGluZSkgLT4gbGluZS5zdGFydHNXaXRoIGNvbW1lbnRDaGFyKVxuICBjb250ZW50ID0gY29udGVudC5zdWJzdHJpbmcoMCwgc3RhcnRPZkNvbW1lbnRzKVxuICBmcy53cml0ZUZpbGVTeW5jIGZpbGVQYXRoLCBjb250ZW50XG5cbmNvbW1pdCA9IChkaXJlY3RvcnksIGZpbGVQYXRoKSAtPlxuICBnaXQuY21kKFsnY29tbWl0JywgXCItLWNsZWFudXA9c3RyaXBcIiwgXCItLWZpbGU9I3tmaWxlUGF0aH1cIl0sIGN3ZDogZGlyZWN0b3J5KVxuICAudGhlbiAoZGF0YSkgLT5cbiAgICBub3RpZmllci5hZGRTdWNjZXNzIGRhdGFcbiAgICBkZXN0cm95Q29tbWl0RWRpdG9yKGZpbGVQYXRoKVxuICAgIGdpdC5yZWZyZXNoKClcbiAgLmNhdGNoIChkYXRhKSAtPlxuICAgIG5vdGlmaWVyLmFkZEVycm9yIGRhdGFcbiAgICBkZXN0cm95Q29tbWl0RWRpdG9yKGZpbGVQYXRoKVxuXG5jbGVhbnVwID0gKGN1cnJlbnRQYW5lLCBmaWxlUGF0aCkgLT5cbiAgY3VycmVudFBhbmUuYWN0aXZhdGUoKSBpZiBjdXJyZW50UGFuZS5pc0FsaXZlKClcbiAgZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gIGZzLnJlbW92ZVN5bmMgZmlsZVBhdGhcblxuc2hvd0ZpbGUgPSAoZmlsZVBhdGgpIC0+XG4gIGNvbW1pdEVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpPy5pdGVtRm9yVVJJKGZpbGVQYXRoKVxuICBpZiBub3QgY29tbWl0RWRpdG9yXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5vcGVuSW5QYW5lJylcbiAgICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5zcGxpdFBhbmUnKVxuICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpW1wic3BsaXQje3NwbGl0RGlyZWN0aW9ufVwiXSgpXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbiBmaWxlUGF0aFxuICBlbHNlXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5vcGVuSW5QYW5lJylcbiAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpLmFjdGl2YXRlKClcbiAgICBlbHNlXG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5hY3RpdmF0ZUl0ZW1Gb3JVUkkoZmlsZVBhdGgpXG4gICAgUHJvbWlzZS5yZXNvbHZlKGNvbW1pdEVkaXRvcilcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge3N0YWdlQ2hhbmdlcywgYW5kUHVzaH09e30pIC0+XG4gIGZpbGVQYXRoID0gUGF0aC5qb2luKHJlcG8uZ2V0UGF0aCgpLCAnQ09NTUlUX0VESVRNU0cnKVxuICBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICBjb21tZW50Q2hhciA9IGdpdC5nZXRDb25maWcocmVwbywgJ2NvcmUuY29tbWVudGNoYXInKSA/ICcjJ1xuICB0ZW1wbGF0ZSA9IGdldFRlbXBsYXRlKGdpdC5nZXRDb25maWcocmVwbywgJ2NvbW1pdC50ZW1wbGF0ZScpKVxuICBpbml0ID0gLT4gZ2V0U3RhZ2VkRmlsZXMocmVwbykudGhlbiAoc3RhdHVzKSAtPlxuICAgIGlmIHZlcmJvc2VDb21taXRzRW5hYmxlZCgpXG4gICAgICBhcmdzID0gWydkaWZmJywgJy0tY29sb3I9bmV2ZXInLCAnLS1zdGFnZWQnXVxuICAgICAgYXJncy5wdXNoICctLXdvcmQtZGlmZicgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy53b3JkRGlmZicpXG4gICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAoZGlmZikgLT4gcHJlcEZpbGUge3N0YXR1cywgZmlsZVBhdGgsIGRpZmYsIGNvbW1lbnRDaGFyLCB0ZW1wbGF0ZX1cbiAgICBlbHNlXG4gICAgICBwcmVwRmlsZSB7c3RhdHVzLCBmaWxlUGF0aCwgY29tbWVudENoYXIsIHRlbXBsYXRlfVxuICBzdGFydENvbW1pdCA9IC0+XG4gICAgc2hvd0ZpbGUgZmlsZVBhdGhcbiAgICAudGhlbiAodGV4dEVkaXRvcikgLT5cbiAgICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0RWRpdG9yLm9uRGlkU2F2ZSAtPlxuICAgICAgICB0cmltRmlsZShmaWxlUGF0aCwgY29tbWVudENoYXIpIGlmIHZlcmJvc2VDb21taXRzRW5hYmxlZCgpXG4gICAgICAgIGNvbW1pdChyZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwgZmlsZVBhdGgpXG4gICAgICAgIC50aGVuIC0+IEdpdFB1c2gocmVwbykgaWYgYW5kUHVzaFxuICAgICAgZGlzcG9zYWJsZXMuYWRkIHRleHRFZGl0b3Iub25EaWREZXN0cm95IC0+IGNsZWFudXAgY3VycmVudFBhbmUsIGZpbGVQYXRoXG4gICAgLmNhdGNoIChtc2cpIC0+IG5vdGlmaWVyLmFkZEVycm9yIG1zZ1xuXG4gIGlmIHN0YWdlQ2hhbmdlc1xuICAgIGdpdC5hZGQocmVwbywgdXBkYXRlOiBzdGFnZUNoYW5nZXMpLnRoZW4oLT4gaW5pdCgpKS50aGVuIC0+IHN0YXJ0Q29tbWl0KClcbiAgZWxzZVxuICAgIGluaXQoKS50aGVuIC0+IHN0YXJ0Q29tbWl0KClcbiAgICAuY2F0Y2ggKG1lc3NhZ2UpIC0+XG4gICAgICBpZiBtZXNzYWdlLmluY2x1ZGVzPygnQ1JMRicpXG4gICAgICAgIHN0YXJ0Q29tbWl0KClcbiAgICAgIGVsc2VcbiAgICAgICAgbm90aWZpZXIuYWRkSW5mbyBtZXNzYWdlXG4iXX0=
