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
    return atom.config.get('git-plus.commits.verboseCommits');
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
    var e;
    if (filePath) {
      try {
        return fs.readFileSync(fs.absolute(filePath.trim())).toString().trim();
      } catch (error) {
        e = error;
        throw new Error("Your configured commit template file can't be found.");
      }
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
    if (atom.config.get('git-plus.general.openInPane')) {
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
    return disposables.dispose();
  };

  showFile = function(filePath) {
    var commitEditor, ref, splitDirection;
    commitEditor = (ref = atom.workspace.paneForURI(filePath)) != null ? ref.itemForURI(filePath) : void 0;
    if (!commitEditor) {
      if (atom.config.get('git-plus.general.openInPane')) {
        splitDirection = atom.config.get('git-plus.general.splitPane');
        atom.workspace.getActivePane()["split" + splitDirection]();
      }
      return atom.workspace.open(filePath);
    } else {
      if (atom.config.get('git-plus.general.openInPane')) {
        atom.workspace.paneForURI(filePath).activate();
      } else {
        atom.workspace.paneForURI(filePath).activateItemForURI(filePath);
      }
      return Promise.resolve(commitEditor);
    }
  };

  module.exports = function(repo, arg) {
    var andPush, commentChar, currentPane, e, filePath, init, ref, ref1, stageChanges, startCommit, template;
    ref = arg != null ? arg : {}, stageChanges = ref.stageChanges, andPush = ref.andPush;
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    currentPane = atom.workspace.getActivePane();
    commentChar = (ref1 = git.getConfig(repo, 'core.commentchar')) != null ? ref1 : '#';
    try {
      template = getTemplate(git.getConfig(repo, 'commit.template'));
    } catch (error) {
      e = error;
      notifier.addError(e.message);
      return Promise.reject(e.message);
    }
    init = function() {
      return getStagedFiles(repo).then(function(status) {
        var args;
        if (verboseCommitsEnabled()) {
          args = ['diff', '--color=never', '--staged'];
          if (atom.config.get('git-plus.diffs.wordDiff')) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jb21taXQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBQ04sc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBQ1YsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSOztFQUVWLFdBQUEsR0FBYyxJQUFJOztFQUVsQixxQkFBQSxHQUF3QixTQUFBO1dBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQjtFQUFIOztFQUV4QixjQUFBLEdBQWlCLFNBQUMsSUFBRDtXQUNmLEdBQUcsQ0FBQyxXQUFKLENBQWdCLElBQWhCLENBQXFCLENBQUMsSUFBdEIsQ0FBMkIsU0FBQyxLQUFEO01BQ3pCLElBQUcsS0FBSyxDQUFDLE1BQU4sSUFBZ0IsQ0FBbkI7ZUFDRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsSUFBRCxFQUFPLGdCQUFQLEVBQXlCLFFBQXpCLENBQVIsRUFBNEM7VUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtTQUE1QyxFQURGO09BQUEsTUFBQTtlQUdFLE9BQU8sQ0FBQyxNQUFSLENBQWUsb0JBQWYsRUFIRjs7SUFEeUIsQ0FBM0I7RUFEZTs7RUFPakIsV0FBQSxHQUFjLFNBQUMsUUFBRDtBQUNaLFFBQUE7SUFBQSxJQUFHLFFBQUg7QUFDRTtlQUNFLEVBQUUsQ0FBQyxZQUFILENBQWdCLEVBQUUsQ0FBQyxRQUFILENBQVksUUFBUSxDQUFDLElBQVQs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LE1BQUEsQ0FBTyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFQLEVBQW1DLFFBQW5DLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQTtZQUFHLElBQWlCLE9BQWpCO3FCQUFBLE9BQUEsQ0FBUSxJQUFSLEVBQUE7O1VBQUgsQ0FETjtRQUZtQyxDQUFyQixDQUFoQjtlQUlBLFdBQVcsQ0FBQyxHQUFaLENBQWdCLFVBQVUsQ0FBQyxZQUFYLENBQXdCLFNBQUE7aUJBQUcsT0FBQSxDQUFRLFdBQVIsRUFBcUIsUUFBckI7UUFBSCxDQUF4QixDQUFoQjtNQUxJLENBRE4sQ0FPQSxFQUFDLEtBQUQsRUFQQSxDQU9PLFNBQUMsR0FBRDtlQUFTLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQWxCO01BQVQsQ0FQUDtJQURZO0lBVWQsSUFBRyxZQUFIO2FBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7UUFBQSxNQUFBLEVBQVEsWUFBUjtPQUFkLENBQW1DLENBQUMsSUFBcEMsQ0FBeUMsU0FBQTtlQUFHLElBQUEsQ0FBQTtNQUFILENBQXpDLENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsU0FBQTtlQUFHLFdBQUEsQ0FBQTtNQUFILENBQXpELEVBREY7S0FBQSxNQUFBO2FBR0UsSUFBQSxDQUFBLENBQU0sQ0FBQyxJQUFQLENBQVksU0FBQTtlQUFHLFdBQUEsQ0FBQTtNQUFILENBQVosQ0FDQSxFQUFDLEtBQUQsRUFEQSxDQUNPLFNBQUMsT0FBRDtRQUNMLDZDQUFHLE9BQU8sQ0FBQyxTQUFVLGdCQUFyQjtpQkFDRSxXQUFBLENBQUEsRUFERjtTQUFBLE1BQUE7aUJBR0UsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsT0FBakIsRUFIRjs7TUFESyxDQURQLEVBSEY7O0VBNUJlO0FBeEZqQiIsInNvdXJjZXNDb250ZW50IjpbIlBhdGggPSByZXF1aXJlICdwYXRoJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5HaXRQdXNoID0gcmVxdWlyZSAnLi9naXQtcHVzaCdcbkdpdFB1bGwgPSByZXF1aXJlICcuL2dpdC1wdWxsJ1xuXG5kaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG5cbnZlcmJvc2VDb21taXRzRW5hYmxlZCA9IC0+IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuY29tbWl0cy52ZXJib3NlQ29tbWl0cycpXG5cbmdldFN0YWdlZEZpbGVzID0gKHJlcG8pIC0+XG4gIGdpdC5zdGFnZWRGaWxlcyhyZXBvKS50aGVuIChmaWxlcykgLT5cbiAgICBpZiBmaWxlcy5sZW5ndGggPj0gMVxuICAgICAgZ2l0LmNtZChbJy1jJywgJ2NvbG9yLnVpPWZhbHNlJywgJ3N0YXR1cyddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIGVsc2VcbiAgICAgIFByb21pc2UucmVqZWN0IFwiTm90aGluZyB0byBjb21taXQuXCJcblxuZ2V0VGVtcGxhdGUgPSAoZmlsZVBhdGgpIC0+XG4gIGlmIGZpbGVQYXRoXG4gICAgdHJ5XG4gICAgICBmcy5yZWFkRmlsZVN5bmMoZnMuYWJzb2x1dGUoZmlsZVBhdGgudHJpbSgpKSkudG9TdHJpbmcoKS50cmltKClcbiAgICBjYXRjaCBlXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJZb3VyIGNvbmZpZ3VyZWQgY29tbWl0IHRlbXBsYXRlIGZpbGUgY2FuJ3QgYmUgZm91bmQuXCIpXG4gIGVsc2VcbiAgICAnJ1xuXG5wcmVwRmlsZSA9ICh7c3RhdHVzLCBmaWxlUGF0aCwgZGlmZiwgY29tbWVudENoYXIsIHRlbXBsYXRlfSkgLT5cbiAgY3dkID0gUGF0aC5kaXJuYW1lKGZpbGVQYXRoKVxuICBzdGF0dXMgPSBzdGF0dXMucmVwbGFjZSgvXFxzKlxcKC4qXFwpXFxuL2csIFwiXFxuXCIpXG4gIHN0YXR1cyA9IHN0YXR1cy50cmltKCkucmVwbGFjZSgvXFxuL2csIFwiXFxuI3tjb21tZW50Q2hhcn0gXCIpXG4gIGNvbnRlbnQgPVxuICAgIFwiXCJcIiN7dGVtcGxhdGV9XG4gICAgI3tjb21tZW50Q2hhcn0gUGxlYXNlIGVudGVyIHRoZSBjb21taXQgbWVzc2FnZSBmb3IgeW91ciBjaGFuZ2VzLiBMaW5lcyBzdGFydGluZ1xuICAgICN7Y29tbWVudENoYXJ9IHdpdGggJyN7Y29tbWVudENoYXJ9JyB3aWxsIGJlIGlnbm9yZWQsIGFuZCBhbiBlbXB0eSBtZXNzYWdlIGFib3J0cyB0aGUgY29tbWl0LlxuICAgICN7Y29tbWVudENoYXJ9XG4gICAgI3tjb21tZW50Q2hhcn0gI3tzdGF0dXN9XCJcIlwiXG4gIGlmIGRpZmZcbiAgICBjb250ZW50ICs9XG4gICAgICBcIlwiXCJcXG4je2NvbW1lbnRDaGFyfVxuICAgICAgI3tjb21tZW50Q2hhcn0gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tID44IC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgI3tjb21tZW50Q2hhcn0gRG8gbm90IHRvdWNoIHRoZSBsaW5lIGFib3ZlLlxuICAgICAgI3tjb21tZW50Q2hhcn0gRXZlcnl0aGluZyBiZWxvdyB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICAje2RpZmZ9XCJcIlwiXG4gIGZzLndyaXRlRmlsZVN5bmMgZmlsZVBhdGgsIGNvbnRlbnRcblxuZGVzdHJveUNvbW1pdEVkaXRvciA9IChmaWxlUGF0aCkgLT5cbiAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpPy5kZXN0cm95KClcbiAgZWxzZVxuICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpLml0ZW1Gb3JVUkkoZmlsZVBhdGgpPy5kZXN0cm95KClcblxudHJpbUZpbGUgPSAoZmlsZVBhdGgsIGNvbW1lbnRDaGFyKSAtPlxuICBjd2QgPSBQYXRoLmRpcm5hbWUoZmlsZVBhdGgpXG4gIGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoZnMuYWJzb2x1dGUoZmlsZVBhdGgpKS50b1N0cmluZygpXG4gIHN0YXJ0T2ZDb21tZW50cyA9IGNvbnRlbnQuaW5kZXhPZihjb250ZW50LnNwbGl0KCdcXG4nKS5maW5kIChsaW5lKSAtPiBsaW5lLnN0YXJ0c1dpdGggY29tbWVudENoYXIpXG4gIGNvbnRlbnQgPSBjb250ZW50LnN1YnN0cmluZygwLCBzdGFydE9mQ29tbWVudHMpXG4gIGZzLndyaXRlRmlsZVN5bmMgZmlsZVBhdGgsIGNvbnRlbnRcblxuY29tbWl0ID0gKGRpcmVjdG9yeSwgZmlsZVBhdGgpIC0+XG4gIGdpdC5jbWQoWydjb21taXQnLCBcIi0tY2xlYW51cD1zdHJpcFwiLCBcIi0tZmlsZT0je2ZpbGVQYXRofVwiXSwgY3dkOiBkaXJlY3RvcnkpXG4gIC50aGVuIChkYXRhKSAtPlxuICAgIG5vdGlmaWVyLmFkZFN1Y2Nlc3MgZGF0YVxuICAgIGRlc3Ryb3lDb21taXRFZGl0b3IoZmlsZVBhdGgpXG4gICAgZ2l0LnJlZnJlc2goKVxuICAuY2F0Y2ggKGRhdGEpIC0+XG4gICAgbm90aWZpZXIuYWRkRXJyb3IgZGF0YVxuICAgIGRlc3Ryb3lDb21taXRFZGl0b3IoZmlsZVBhdGgpXG5cbmNsZWFudXAgPSAoY3VycmVudFBhbmUsIGZpbGVQYXRoKSAtPlxuICBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpIGlmIGN1cnJlbnRQYW5lLmlzQWxpdmUoKVxuICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuc2hvd0ZpbGUgPSAoZmlsZVBhdGgpIC0+XG4gIGNvbW1pdEVkaXRvciA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpPy5pdGVtRm9yVVJJKGZpbGVQYXRoKVxuICBpZiBub3QgY29tbWl0RWRpdG9yXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgICAgc3BsaXREaXJlY3Rpb24gPSBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwuc3BsaXRQYW5lJylcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVtcInNwbGl0I3tzcGxpdERpcmVjdGlvbn1cIl0oKVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gZmlsZVBhdGhcbiAgZWxzZVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5vcGVuSW5QYW5lJylcbiAgICAgIGF0b20ud29ya3NwYWNlLnBhbmVGb3JVUkkoZmlsZVBhdGgpLmFjdGl2YXRlKClcbiAgICBlbHNlXG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5hY3RpdmF0ZUl0ZW1Gb3JVUkkoZmlsZVBhdGgpXG4gICAgUHJvbWlzZS5yZXNvbHZlKGNvbW1pdEVkaXRvcilcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge3N0YWdlQ2hhbmdlcywgYW5kUHVzaH09e30pIC0+XG4gIGZpbGVQYXRoID0gUGF0aC5qb2luKHJlcG8uZ2V0UGF0aCgpLCAnQ09NTUlUX0VESVRNU0cnKVxuICBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICBjb21tZW50Q2hhciA9IGdpdC5nZXRDb25maWcocmVwbywgJ2NvcmUuY29tbWVudGNoYXInKSA/ICcjJ1xuICB0cnlcbiAgICB0ZW1wbGF0ZSA9IGdldFRlbXBsYXRlKGdpdC5nZXRDb25maWcocmVwbywgJ2NvbW1pdC50ZW1wbGF0ZScpKVxuICBjYXRjaCBlXG4gICAgbm90aWZpZXIuYWRkRXJyb3IoZS5tZXNzYWdlKVxuICAgIHJldHVybiBQcm9taXNlLnJlamVjdChlLm1lc3NhZ2UpXG5cbiAgaW5pdCA9IC0+IGdldFN0YWdlZEZpbGVzKHJlcG8pLnRoZW4gKHN0YXR1cykgLT5cbiAgICBpZiB2ZXJib3NlQ29tbWl0c0VuYWJsZWQoKVxuICAgICAgYXJncyA9IFsnZGlmZicsICctLWNvbG9yPW5ldmVyJywgJy0tc3RhZ2VkJ11cbiAgICAgIGFyZ3MucHVzaCAnLS13b3JkLWRpZmYnIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZGlmZnMud29yZERpZmYnKVxuICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKGRpZmYpIC0+IHByZXBGaWxlIHtzdGF0dXMsIGZpbGVQYXRoLCBkaWZmLCBjb21tZW50Q2hhciwgdGVtcGxhdGV9XG4gICAgZWxzZVxuICAgICAgcHJlcEZpbGUge3N0YXR1cywgZmlsZVBhdGgsIGNvbW1lbnRDaGFyLCB0ZW1wbGF0ZX1cbiAgc3RhcnRDb21taXQgPSAtPlxuICAgIHNob3dGaWxlIGZpbGVQYXRoXG4gICAgLnRoZW4gKHRleHRFZGl0b3IpIC0+XG4gICAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEVkaXRvci5vbkRpZFNhdmUgLT5cbiAgICAgICAgdHJpbUZpbGUoZmlsZVBhdGgsIGNvbW1lbnRDaGFyKSBpZiB2ZXJib3NlQ29tbWl0c0VuYWJsZWQoKVxuICAgICAgICBjb21taXQocmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIGZpbGVQYXRoKVxuICAgICAgICAudGhlbiAtPiBHaXRQdXNoKHJlcG8pIGlmIGFuZFB1c2hcbiAgICAgIGRpc3Bvc2FibGVzLmFkZCB0ZXh0RWRpdG9yLm9uRGlkRGVzdHJveSAtPiBjbGVhbnVwIGN1cnJlbnRQYW5lLCBmaWxlUGF0aFxuICAgIC5jYXRjaCAobXNnKSAtPiBub3RpZmllci5hZGRFcnJvciBtc2dcblxuICBpZiBzdGFnZUNoYW5nZXNcbiAgICBnaXQuYWRkKHJlcG8sIHVwZGF0ZTogc3RhZ2VDaGFuZ2VzKS50aGVuKC0+IGluaXQoKSkudGhlbiAtPiBzdGFydENvbW1pdCgpXG4gIGVsc2VcbiAgICBpbml0KCkudGhlbiAtPiBzdGFydENvbW1pdCgpXG4gICAgLmNhdGNoIChtZXNzYWdlKSAtPlxuICAgICAgaWYgbWVzc2FnZS5pbmNsdWRlcz8oJ0NSTEYnKVxuICAgICAgICBzdGFydENvbW1pdCgpXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEluZm8gbWVzc2FnZVxuIl19
