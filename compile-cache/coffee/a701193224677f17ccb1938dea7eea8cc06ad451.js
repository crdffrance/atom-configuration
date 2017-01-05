(function() {
  var CompositeDisposable, Path, cleanup, cleanupUnstagedText, commit, destroyCommitEditor, diffFiles, disposables, fs, getGitStatus, getStagedFiles, git, notifier, parse, prepFile, prettifyFileStatuses, prettifyStagedFiles, prettyifyPreviousFile, showFile,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Path = require('path');

  CompositeDisposable = require('atom').CompositeDisposable;

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  disposables = new CompositeDisposable;

  prettifyStagedFiles = function(data) {
    var i, mode;
    if (data === '') {
      return [];
    }
    data = data.split(/\0/).slice(0, -1);
    return (function() {
      var j, len, results;
      results = [];
      for (i = j = 0, len = data.length; j < len; i = j += 2) {
        mode = data[i];
        results.push({
          mode: mode,
          path: data[i + 1]
        });
      }
      return results;
    })();
  };

  prettyifyPreviousFile = function(data) {
    return {
      mode: data[0],
      path: data.substring(1).trim()
    };
  };

  prettifyFileStatuses = function(files) {
    return files.map(function(arg) {
      var mode, path;
      mode = arg.mode, path = arg.path;
      switch (mode) {
        case 'M':
          return "modified:   " + path;
        case 'A':
          return "new file:   " + path;
        case 'D':
          return "deleted:   " + path;
        case 'R':
          return "renamed:   " + path;
      }
    });
  };

  getStagedFiles = function(repo) {
    return git.stagedFiles(repo).then(function(files) {
      var args;
      if (files.length >= 1) {
        args = ['diff-index', '--no-color', '--cached', 'HEAD', '--name-status', '-z'];
        return git.cmd(args, {
          cwd: repo.getWorkingDirectory()
        }).then(function(data) {
          return prettifyStagedFiles(data);
        });
      } else {
        return Promise.resolve([]);
      }
    });
  };

  getGitStatus = function(repo) {
    return git.cmd(['-c', 'color.ui=false', 'status'], {
      cwd: repo.getWorkingDirectory()
    });
  };

  diffFiles = function(previousFiles, currentFiles) {
    var currentPaths;
    previousFiles = previousFiles.map(function(p) {
      return prettyifyPreviousFile(p);
    });
    currentPaths = currentFiles.map(function(arg) {
      var path;
      path = arg.path;
      return path;
    });
    return previousFiles.filter(function(p) {
      var ref;
      return (ref = p.path, indexOf.call(currentPaths, ref) >= 0) === false;
    });
  };

  parse = function(prevCommit) {
    var indexOfStatus, lines, message, prevChangedFiles, prevMessage, statusRegex;
    lines = prevCommit.split(/\n/).filter(function(line) {
      return line !== '/n';
    });
    statusRegex = /(([ MADRCU?!])\s(.*))/;
    indexOfStatus = lines.findIndex(function(line) {
      return statusRegex.test(line);
    });
    prevMessage = lines.splice(0, indexOfStatus - 1);
    prevMessage.reverse();
    if (prevMessage[0] === '') {
      prevMessage.shift();
    }
    prevMessage.reverse();
    prevChangedFiles = lines.filter(function(line) {
      return line !== '';
    });
    message = prevMessage.join('\n');
    return {
      message: message,
      prevChangedFiles: prevChangedFiles
    };
  };

  cleanupUnstagedText = function(status) {
    var text, unstagedFiles;
    unstagedFiles = status.indexOf("Changes not staged for commit:");
    if (unstagedFiles >= 0) {
      text = status.substring(unstagedFiles);
      return status = (status.substring(0, unstagedFiles - 1)) + "\n" + (text.replace(/\s*\(.*\)\n/g, ""));
    } else {
      return status;
    }
  };

  prepFile = function(arg) {
    var commentChar, currentChanges, filePath, message, nothingToCommit, prevChangedFiles, replacementText, status, textToReplace;
    commentChar = arg.commentChar, message = arg.message, prevChangedFiles = arg.prevChangedFiles, status = arg.status, filePath = arg.filePath;
    status = cleanupUnstagedText(status);
    status = status.replace(/\s*\(.*\)\n/g, "\n").replace(/\n/g, "\n" + commentChar + " ");
    if (prevChangedFiles.length > 0) {
      nothingToCommit = "nothing to commit, working directory clean";
      currentChanges = "committed:\n" + commentChar;
      textToReplace = null;
      if (status.indexOf(nothingToCommit) > -1) {
        textToReplace = nothingToCommit;
      } else if (status.indexOf(currentChanges) > -1) {
        textToReplace = currentChanges;
      }
      replacementText = "committed:\n" + (prevChangedFiles.map(function(f) {
        return commentChar + "   " + f;
      }).join("\n"));
      status = status.replace(textToReplace, replacementText);
    }
    return fs.writeFileSync(filePath, message + "\n" + commentChar + " Please enter the commit message for your changes. Lines starting\n" + commentChar + " with '" + commentChar + "' will be ignored, and an empty message aborts the commit.\n" + commentChar + "\n" + commentChar + " " + status);
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

  destroyCommitEditor = function(filePath) {
    var ref, ref1;
    if (atom.config.get('git-plus.openInPane')) {
      return (ref = atom.workspace.paneForURI(filePath)) != null ? ref.destroy() : void 0;
    } else {
      return (ref1 = atom.workspace.paneForURI(filePath).itemForURI(filePath)) != null ? ref1.destroy() : void 0;
    }
  };

  commit = function(directory, filePath) {
    var args;
    args = ['commit', '--amend', '--cleanup=strip', "--file=" + filePath];
    return git.cmd(args, {
      cwd: directory
    }).then(function(data) {
      notifier.addSuccess(data);
      destroyCommitEditor(filePath);
      return git.refresh();
    });
  };

  cleanup = function(currentPane, filePath) {
    if (currentPane.isAlive()) {
      currentPane.activate();
    }
    disposables.dispose();
    return fs.removeSync(filePath);
  };

  module.exports = function(repo) {
    var commentChar, currentPane, cwd, filePath, ref;
    currentPane = atom.workspace.getActivePane();
    filePath = Path.join(repo.getPath(), 'COMMIT_EDITMSG');
    cwd = repo.getWorkingDirectory();
    commentChar = (ref = git.getConfig(repo, 'core.commentchar')) != null ? ref : '#';
    return git.cmd(['whatchanged', '-1', '--name-status', '--format=%B'], {
      cwd: cwd
    }).then(function(amend) {
      return parse(amend);
    }).then(function(arg) {
      var message, prevChangedFiles;
      message = arg.message, prevChangedFiles = arg.prevChangedFiles;
      return getStagedFiles(repo).then(function(files) {
        prevChangedFiles = prettifyFileStatuses(diffFiles(prevChangedFiles, files));
        return {
          message: message,
          prevChangedFiles: prevChangedFiles
        };
      });
    }).then(function(arg) {
      var message, prevChangedFiles;
      message = arg.message, prevChangedFiles = arg.prevChangedFiles;
      return getGitStatus(repo).then(function(status) {
        return prepFile({
          commentChar: commentChar,
          message: message,
          prevChangedFiles: prevChangedFiles,
          status: status,
          filePath: filePath
        });
      }).then(function() {
        return showFile(filePath);
      });
    }).then(function(textEditor) {
      disposables.add(textEditor.onDidSave(function() {
        return commit(repo.getWorkingDirectory(), filePath);
      }));
      return disposables.add(textEditor.onDidDestroy(function() {
        return cleanup(currentPane, filePath);
      }));
    })["catch"](function(msg) {
      return notifier.addInfo(msg);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jb21taXQtYW1lbmQuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSwwUEFBQTtJQUFBOztFQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDTixzQkFBdUIsT0FBQSxDQUFRLE1BQVI7O0VBQ3hCLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUVYLFdBQUEsR0FBYyxJQUFJOztFQUVsQixtQkFBQSxHQUFzQixTQUFDLElBQUQ7QUFDcEIsUUFBQTtJQUFBLElBQWEsSUFBQSxLQUFRLEVBQXJCO0FBQUEsYUFBTyxHQUFQOztJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUI7OztBQUNuQjtXQUFBLGlEQUFBOztxQkFDSDtVQUFDLE1BQUEsSUFBRDtVQUFPLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBbEI7O0FBREc7OztFQUhlOztFQU10QixxQkFBQSxHQUF3QixTQUFDLElBQUQ7V0FDdEI7TUFBQSxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsQ0FBWDtNQUNBLElBQUEsRUFBTSxJQUFJLENBQUMsU0FBTCxDQUFlLENBQWYsQ0FBaUIsQ0FBQyxJQUFsQixDQUFBLENBRE47O0VBRHNCOztFQUl4QixvQkFBQSxHQUF1QixTQUFDLEtBQUQ7V0FDckIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxTQUFDLEdBQUQ7QUFDUixVQUFBO01BRFUsaUJBQU07QUFDaEIsY0FBTyxJQUFQO0FBQUEsYUFDTyxHQURQO2lCQUVJLGNBQUEsR0FBZTtBQUZuQixhQUdPLEdBSFA7aUJBSUksY0FBQSxHQUFlO0FBSm5CLGFBS08sR0FM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QXFCLFNBQUEsQ0FBVSxnQkFBVixFQUE0QixLQUE1QixDQUFyQjtlQUNuQjtVQUFDLFNBQUEsT0FBRDtVQUFVLGtCQUFBLGdCQUFWOztNQUZJLENBRE47SUFESSxDQUZOLENBT0EsQ0FBQyxJQVBELENBT00sU0FBQyxHQUFEO0FBQ0osVUFBQTtNQURNLHVCQUFTO2FBQ2YsWUFBQSxDQUFhLElBQWIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLE1BQUQ7ZUFBWSxRQUFBLENBQVM7VUFBQyxhQUFBLFdBQUQ7VUFBYyxTQUFBLE9BQWQ7VUFBdUIsa0JBQUEsZ0JBQXZCO1VBQXlDLFFBQUEsTUFBekM7VUFBaUQsVUFBQSxRQUFqRDtTQUFUO01BQVosQ0FETixDQUVBLENBQUMsSUFGRCxDQUVNLFNBQUE7ZUFBRyxRQUFBLENBQVMsUUFBVDtNQUFILENBRk47SUFESSxDQVBOLENBV0EsQ0FBQyxJQVhELENBV00sU0FBQyxVQUFEO01BQ0osV0FBVyxDQUFDLEdBQVosQ0FBZ0IsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsU0FBQTtlQUFHLE1BQUEsQ0FBTyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFQLEVBQW1DLFFBQW5DO01BQUgsQ0FBckIsQ0FBaEI7YUFDQSxXQUFXLENBQUMsR0FBWixDQUFnQixVQUFVLENBQUMsWUFBWCxDQUF3QixTQUFBO2VBQUcsT0FBQSxDQUFRLFdBQVIsRUFBcUIsUUFBckI7TUFBSCxDQUF4QixDQUFoQjtJQUZJLENBWE4sQ0FjQSxFQUFDLEtBQUQsRUFkQSxDQWNPLFNBQUMsR0FBRDthQUFTLFFBQVEsQ0FBQyxPQUFULENBQWlCLEdBQWpCO0lBQVQsQ0FkUDtFQUxlO0FBN0hqQiIsInNvdXJjZXNDb250ZW50IjpbIlBhdGggPSByZXF1aXJlICdwYXRoJ1xue0NvbXBvc2l0ZURpc3Bvc2FibGV9ID0gcmVxdWlyZSAnYXRvbSdcbmZzID0gcmVxdWlyZSAnZnMtcGx1cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5cbmRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcblxucHJldHRpZnlTdGFnZWRGaWxlcyA9IChkYXRhKSAtPlxuICByZXR1cm4gW10gaWYgZGF0YSBpcyAnJ1xuICBkYXRhID0gZGF0YS5zcGxpdCgvXFwwLylbLi4uLTFdXG4gIFtdID0gZm9yIG1vZGUsIGkgaW4gZGF0YSBieSAyXG4gICAge21vZGUsIHBhdGg6IGRhdGFbaSsxXSB9XG5cbnByZXR0eWlmeVByZXZpb3VzRmlsZSA9IChkYXRhKSAtPlxuICBtb2RlOiBkYXRhWzBdXG4gIHBhdGg6IGRhdGEuc3Vic3RyaW5nKDEpLnRyaW0oKVxuXG5wcmV0dGlmeUZpbGVTdGF0dXNlcyA9IChmaWxlcykgLT5cbiAgZmlsZXMubWFwICh7bW9kZSwgcGF0aH0pIC0+XG4gICAgc3dpdGNoIG1vZGVcbiAgICAgIHdoZW4gJ00nXG4gICAgICAgIFwibW9kaWZpZWQ6ICAgI3twYXRofVwiXG4gICAgICB3aGVuICdBJ1xuICAgICAgICBcIm5ldyBmaWxlOiAgICN7cGF0aH1cIlxuICAgICAgd2hlbiAnRCdcbiAgICAgICAgXCJkZWxldGVkOiAgICN7cGF0aH1cIlxuICAgICAgd2hlbiAnUidcbiAgICAgICAgXCJyZW5hbWVkOiAgICN7cGF0aH1cIlxuXG5nZXRTdGFnZWRGaWxlcyA9IChyZXBvKSAtPlxuICBnaXQuc3RhZ2VkRmlsZXMocmVwbykudGhlbiAoZmlsZXMpIC0+XG4gICAgaWYgZmlsZXMubGVuZ3RoID49IDFcbiAgICAgIGFyZ3MgPSBbJ2RpZmYtaW5kZXgnLCAnLS1uby1jb2xvcicsICctLWNhY2hlZCcsICdIRUFEJywgJy0tbmFtZS1zdGF0dXMnLCAnLXonXVxuICAgICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKGRhdGEpIC0+IHByZXR0aWZ5U3RhZ2VkRmlsZXMgZGF0YVxuICAgIGVsc2VcbiAgICAgIFByb21pc2UucmVzb2x2ZSBbXVxuXG5nZXRHaXRTdGF0dXMgPSAocmVwbykgLT5cbiAgZ2l0LmNtZCBbJy1jJywgJ2NvbG9yLnVpPWZhbHNlJywgJ3N0YXR1cyddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbmRpZmZGaWxlcyA9IChwcmV2aW91c0ZpbGVzLCBjdXJyZW50RmlsZXMpIC0+XG4gIHByZXZpb3VzRmlsZXMgPSBwcmV2aW91c0ZpbGVzLm1hcCAocCkgLT4gcHJldHR5aWZ5UHJldmlvdXNGaWxlIHBcbiAgY3VycmVudFBhdGhzID0gY3VycmVudEZpbGVzLm1hcCAoe3BhdGh9KSAtPiBwYXRoXG4gIHByZXZpb3VzRmlsZXMuZmlsdGVyIChwKSAtPiBwLnBhdGggaW4gY3VycmVudFBhdGhzIGlzIGZhbHNlXG5cbnBhcnNlID0gKHByZXZDb21taXQpIC0+XG4gIGxpbmVzID0gcHJldkNvbW1pdC5zcGxpdCgvXFxuLykuZmlsdGVyIChsaW5lKSAtPiBsaW5lIGlzbnQgJy9uJ1xuICBzdGF0dXNSZWdleCA9IC8oKFsgTUFEUkNVPyFdKVxccyguKikpL1xuICBpbmRleE9mU3RhdHVzID0gbGluZXMuZmluZEluZGV4IChsaW5lKSAtPiBzdGF0dXNSZWdleC50ZXN0IGxpbmVcblxuICBwcmV2TWVzc2FnZSA9IGxpbmVzLnNwbGljZSAwLCBpbmRleE9mU3RhdHVzIC0gMVxuICBwcmV2TWVzc2FnZS5yZXZlcnNlKClcbiAgcHJldk1lc3NhZ2Uuc2hpZnQoKSBpZiBwcmV2TWVzc2FnZVswXSBpcyAnJ1xuICBwcmV2TWVzc2FnZS5yZXZlcnNlKClcbiAgcHJldkNoYW5nZWRGaWxlcyA9IGxpbmVzLmZpbHRlciAobGluZSkgLT4gbGluZSBpc250ICcnXG4gIG1lc3NhZ2UgPSBwcmV2TWVzc2FnZS5qb2luKCdcXG4nKVxuICB7bWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlc31cblxuY2xlYW51cFVuc3RhZ2VkVGV4dCA9IChzdGF0dXMpIC0+XG4gIHVuc3RhZ2VkRmlsZXMgPSBzdGF0dXMuaW5kZXhPZiBcIkNoYW5nZXMgbm90IHN0YWdlZCBmb3IgY29tbWl0OlwiXG4gIGlmIHVuc3RhZ2VkRmlsZXMgPj0gMFxuICAgIHRleHQgPSBzdGF0dXMuc3Vic3RyaW5nIHVuc3RhZ2VkRmlsZXNcbiAgICBzdGF0dXMgPSBcIiN7c3RhdHVzLnN1YnN0cmluZygwLCB1bnN0YWdlZEZpbGVzIC0gMSl9XFxuI3t0ZXh0LnJlcGxhY2UgL1xccypcXCguKlxcKVxcbi9nLCBcIlwifVwiXG4gIGVsc2VcbiAgICBzdGF0dXNcblxucHJlcEZpbGUgPSAoe2NvbW1lbnRDaGFyLCBtZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzLCBzdGF0dXMsIGZpbGVQYXRofSkgLT5cbiAgICBzdGF0dXMgPSBjbGVhbnVwVW5zdGFnZWRUZXh0IHN0YXR1c1xuICAgIHN0YXR1cyA9IHN0YXR1cy5yZXBsYWNlKC9cXHMqXFwoLipcXClcXG4vZywgXCJcXG5cIikucmVwbGFjZSgvXFxuL2csIFwiXFxuI3tjb21tZW50Q2hhcn0gXCIpXG4gICAgaWYgcHJldkNoYW5nZWRGaWxlcy5sZW5ndGggPiAwXG4gICAgICBub3RoaW5nVG9Db21taXQgPSBcIm5vdGhpbmcgdG8gY29tbWl0LCB3b3JraW5nIGRpcmVjdG9yeSBjbGVhblwiXG4gICAgICBjdXJyZW50Q2hhbmdlcyA9IFwiY29tbWl0dGVkOlxcbiN7Y29tbWVudENoYXJ9XCJcbiAgICAgIHRleHRUb1JlcGxhY2UgPSBudWxsXG4gICAgICBpZiBzdGF0dXMuaW5kZXhPZihub3RoaW5nVG9Db21taXQpID4gLTFcbiAgICAgICAgdGV4dFRvUmVwbGFjZSA9IG5vdGhpbmdUb0NvbW1pdFxuICAgICAgZWxzZSBpZiBzdGF0dXMuaW5kZXhPZihjdXJyZW50Q2hhbmdlcykgPiAtMVxuICAgICAgICB0ZXh0VG9SZXBsYWNlID0gY3VycmVudENoYW5nZXNcbiAgICAgIHJlcGxhY2VtZW50VGV4dCA9XG4gICAgICAgIFwiXCJcImNvbW1pdHRlZDpcbiAgICAgICAgI3tcbiAgICAgICAgICBwcmV2Q2hhbmdlZEZpbGVzLm1hcCgoZikgLT4gXCIje2NvbW1lbnRDaGFyfSAgICN7Zn1cIikuam9pbihcIlxcblwiKVxuICAgICAgICB9XCJcIlwiXG4gICAgICBzdGF0dXMgPSBzdGF0dXMucmVwbGFjZSB0ZXh0VG9SZXBsYWNlLCByZXBsYWNlbWVudFRleHRcbiAgICBmcy53cml0ZUZpbGVTeW5jIGZpbGVQYXRoLFxuICAgICAgXCJcIlwiI3ttZXNzYWdlfVxuICAgICAgI3tjb21tZW50Q2hhcn0gUGxlYXNlIGVudGVyIHRoZSBjb21taXQgbWVzc2FnZSBmb3IgeW91ciBjaGFuZ2VzLiBMaW5lcyBzdGFydGluZ1xuICAgICAgI3tjb21tZW50Q2hhcn0gd2l0aCAnI3tjb21tZW50Q2hhcn0nIHdpbGwgYmUgaWdub3JlZCwgYW5kIGFuIGVtcHR5IG1lc3NhZ2UgYWJvcnRzIHRoZSBjb21taXQuXG4gICAgICAje2NvbW1lbnRDaGFyfVxuICAgICAgI3tjb21tZW50Q2hhcn0gI3tzdGF0dXN9XCJcIlwiXG5cbnNob3dGaWxlID0gKGZpbGVQYXRoKSAtPlxuICBjb21taXRFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKT8uaXRlbUZvclVSSShmaWxlUGF0aClcbiAgaWYgbm90IGNvbW1pdEVkaXRvclxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMub3BlbkluUGFuZScpXG4gICAgICBzcGxpdERpcmVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuc3BsaXRQYW5lJylcbiAgICAgIGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVtcInNwbGl0I3tzcGxpdERpcmVjdGlvbn1cIl0oKVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4gZmlsZVBhdGhcbiAgZWxzZVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMub3BlbkluUGFuZScpXG4gICAgICBhdG9tLndvcmtzcGFjZS5wYW5lRm9yVVJJKGZpbGVQYXRoKS5hY3RpdmF0ZSgpXG4gICAgZWxzZVxuICAgICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuYWN0aXZhdGVJdGVtRm9yVVJJKGZpbGVQYXRoKVxuICAgIFByb21pc2UucmVzb2x2ZShjb21taXRFZGl0b3IpXG5cbmRlc3Ryb3lDb21taXRFZGl0b3IgPSAoZmlsZVBhdGgpIC0+XG4gIGlmIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMub3BlbkluUGFuZScpXG4gICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCk/LmRlc3Ryb3koKVxuICBlbHNlXG4gICAgYXRvbS53b3Jrc3BhY2UucGFuZUZvclVSSShmaWxlUGF0aCkuaXRlbUZvclVSSShmaWxlUGF0aCk/LmRlc3Ryb3koKVxuXG5jb21taXQgPSAoZGlyZWN0b3J5LCBmaWxlUGF0aCkgLT5cbiAgYXJncyA9IFsnY29tbWl0JywgJy0tYW1lbmQnLCAnLS1jbGVhbnVwPXN0cmlwJywgXCItLWZpbGU9I3tmaWxlUGF0aH1cIl1cbiAgZ2l0LmNtZChhcmdzLCBjd2Q6IGRpcmVjdG9yeSlcbiAgLnRoZW4gKGRhdGEpIC0+XG4gICAgbm90aWZpZXIuYWRkU3VjY2VzcyBkYXRhXG4gICAgZGVzdHJveUNvbW1pdEVkaXRvcihmaWxlUGF0aClcbiAgICBnaXQucmVmcmVzaCgpXG5cbmNsZWFudXAgPSAoY3VycmVudFBhbmUsIGZpbGVQYXRoKSAtPlxuICBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpIGlmIGN1cnJlbnRQYW5lLmlzQWxpdmUoKVxuICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgZnMucmVtb3ZlU3luYyBmaWxlUGF0aFxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICBmaWxlUGF0aCA9IFBhdGguam9pbihyZXBvLmdldFBhdGgoKSwgJ0NPTU1JVF9FRElUTVNHJylcbiAgY3dkID0gcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgY29tbWVudENoYXIgPSBnaXQuZ2V0Q29uZmlnKHJlcG8sICdjb3JlLmNvbW1lbnRjaGFyJykgPyAnIydcbiAgZ2l0LmNtZChbJ3doYXRjaGFuZ2VkJywgJy0xJywgJy0tbmFtZS1zdGF0dXMnLCAnLS1mb3JtYXQ9JUInXSwge2N3ZH0pXG4gIC50aGVuIChhbWVuZCkgLT4gcGFyc2UgYW1lbmRcbiAgLnRoZW4gKHttZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzfSkgLT5cbiAgICBnZXRTdGFnZWRGaWxlcyhyZXBvKVxuICAgIC50aGVuIChmaWxlcykgLT5cbiAgICAgIHByZXZDaGFuZ2VkRmlsZXMgPSBwcmV0dGlmeUZpbGVTdGF0dXNlcyhkaWZmRmlsZXMgcHJldkNoYW5nZWRGaWxlcywgZmlsZXMpXG4gICAgICB7bWVzc2FnZSwgcHJldkNoYW5nZWRGaWxlc31cbiAgLnRoZW4gKHttZXNzYWdlLCBwcmV2Q2hhbmdlZEZpbGVzfSkgLT5cbiAgICBnZXRHaXRTdGF0dXMocmVwbylcbiAgICAudGhlbiAoc3RhdHVzKSAtPiBwcmVwRmlsZSB7Y29tbWVudENoYXIsIG1lc3NhZ2UsIHByZXZDaGFuZ2VkRmlsZXMsIHN0YXR1cywgZmlsZVBhdGh9XG4gICAgLnRoZW4gLT4gc2hvd0ZpbGUgZmlsZVBhdGhcbiAgLnRoZW4gKHRleHRFZGl0b3IpIC0+XG4gICAgZGlzcG9zYWJsZXMuYWRkIHRleHRFZGl0b3Iub25EaWRTYXZlIC0+IGNvbW1pdChyZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwgZmlsZVBhdGgpXG4gICAgZGlzcG9zYWJsZXMuYWRkIHRleHRFZGl0b3Iub25EaWREZXN0cm95IC0+IGNsZWFudXAgY3VycmVudFBhbmUsIGZpbGVQYXRoXG4gIC5jYXRjaCAobXNnKSAtPiBub3RpZmllci5hZGRJbmZvIG1zZ1xuIl19
