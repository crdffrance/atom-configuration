(function() {
  var BufferedProcess, Os, RepoListView, _prettify, _prettifyDiff, _prettifyUntracked, getRepoForCurrentFile, git, gitUntrackedFiles, notifier;

  Os = require('os');

  BufferedProcess = require('atom').BufferedProcess;

  RepoListView = require('./views/repo-list-view');

  notifier = require('./notifier');

  gitUntrackedFiles = function(repo, dataUnstaged) {
    var args;
    if (dataUnstaged == null) {
      dataUnstaged = [];
    }
    args = ['ls-files', '-o', '--exclude-standard'];
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return dataUnstaged.concat(_prettifyUntracked(data));
    });
  };

  _prettify = function(data, arg) {
    var i, mode, staged;
    staged = (arg != null ? arg : {}).staged;
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
          staged: staged,
          path: data[i + 1]
        });
      }
      return results;
    })();
  };

  _prettifyUntracked = function(data) {
    if (data === '') {
      return [];
    }
    data = data.split(/\n/).filter(function(d) {
      return d !== '';
    });
    return data.map(function(file) {
      return {
        mode: '?',
        path: file
      };
    });
  };

  _prettifyDiff = function(data) {
    var line, ref;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(ref = (function() {
      var j, len, ref1, results;
      ref1 = data.slice(1);
      results = [];
      for (j = 0, len = ref1.length; j < len; j++) {
        line = ref1[j];
        results.push('@@' + line);
      }
      return results;
    })())), ref;
    return data;
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, ref;
      project = atom.project;
      path = (ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0;
      directory = project.getDirectories().filter(function(d) {
        return d.contains(path);
      })[0];
      if (directory != null) {
        return project.repositoryForDirectory(directory).then(function(repo) {
          var submodule;
          submodule = repo.repo.submoduleForPath(path);
          if (submodule != null) {
            return resolve(submodule);
          } else {
            return resolve(repo);
          }
        })["catch"](function(e) {
          return reject(e);
        });
      } else {
        return reject("no current file");
      }
    });
  };

  module.exports = git = {
    cmd: function(args, options, arg) {
      var color;
      if (options == null) {
        options = {
          env: process.env
        };
      }
      color = (arg != null ? arg : {}).color;
      return new Promise(function(resolve, reject) {
        var output, process, ref;
        output = '';
        if (color) {
          args = ['-c', 'color.ui=always'].concat(args);
        }
        process = new BufferedProcess({
          command: (ref = atom.config.get('git-plus.general.gitPath')) != null ? ref : 'git',
          args: args,
          options: options,
          stdout: function(data) {
            return output += data.toString();
          },
          stderr: function(data) {
            return output += data.toString();
          },
          exit: function(code) {
            if (code === 0) {
              return resolve(output);
            } else {
              return reject(output);
            }
          }
        });
        return process.onWillThrowError(function(errorObject) {
          notifier.addError('Git Plus is unable to locate the git command. Please ensure process.env.PATH can access git.');
          return reject("Couldn't find git");
        });
      });
    },
    getConfig: function(repo, setting) {
      return repo.getConfigValue(setting, repo.getWorkingDirectory());
    },
    reset: function(repo) {
      return git.cmd(['reset', 'HEAD'], {
        cwd: repo.getWorkingDirectory()
      }).then(function() {
        return notifier.addSuccess('All changes unstaged');
      });
    },
    status: function(repo) {
      return git.cmd(['status', '--porcelain', '-z'], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (data.length > 2) {
          return data.split('\0').slice(0, -1);
        } else {
          return [];
        }
      });
    },
    refresh: function(repo) {
      if (repo) {
        if (typeof repo.refreshStatus === "function") {
          repo.refreshStatus();
        }
        return typeof repo.refreshIndex === "function" ? repo.refreshIndex() : void 0;
      } else {
        return atom.project.getRepositories().forEach(function(repo) {
          if (repo != null) {
            return repo.refreshStatus();
          }
        });
      }
    },
    relativize: function(path) {
      var ref, ref1, ref2, ref3;
      return (ref = (ref1 = (ref2 = git.getSubmodule(path)) != null ? ref2.relativize(path) : void 0) != null ? ref1 : (ref3 = atom.project.getRepositories()[0]) != null ? ref3.relativize(path) : void 0) != null ? ref : path;
    },
    diff: function(repo, path) {
      return git.cmd(['diff', '-p', '-U1', path], {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettifyDiff(data);
      });
    },
    stagedFiles: function(repo) {
      var args;
      args = ['diff-index', '--cached', 'HEAD', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        return _prettify(data, {
          staged: true
        });
      })["catch"](function(error) {
        if (error.includes("ambiguous argument 'HEAD'")) {
          return Promise.resolve([1]);
        } else {
          notifier.addError(error);
          return Promise.resolve([]);
        }
      });
    },
    unstagedFiles: function(repo, arg) {
      var args, showUntracked;
      showUntracked = (arg != null ? arg : {}).showUntracked;
      args = ['diff-files', '--name-status', '-z'];
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(data) {
        if (showUntracked) {
          return gitUntrackedFiles(repo, _prettify(data, {
            staged: false
          }));
        } else {
          return _prettify(data, {
            staged: false
          });
        }
      });
    },
    add: function(repo, arg) {
      var args, file, ref, update;
      ref = arg != null ? arg : {}, file = ref.file, update = ref.update;
      args = ['add'];
      if (update) {
        args.push('--update');
      } else {
        args.push('--all');
      }
      args.push(file ? file : '.');
      return git.cmd(args, {
        cwd: repo.getWorkingDirectory()
      }).then(function(output) {
        if (output !== false) {
          return notifier.addSuccess("Added " + (file != null ? file : 'all files'));
        }
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    },
    getRepo: function() {
      return new Promise(function(resolve, reject) {
        return getRepoForCurrentFile().then(function(repo) {
          return resolve(repo);
        })["catch"](function(e) {
          var repos;
          repos = atom.project.getRepositories().filter(function(r) {
            return r != null;
          });
          if (repos.length === 0) {
            return reject("No repos found");
          } else if (repos.length > 1) {
            return resolve(new RepoListView(repos).result);
          } else {
            return resolve(repos[0]);
          }
        });
      });
    },
    getRepoForPath: function(path) {
      if (path == null) {
        return Promise.reject("No file to find repository for");
      } else {
        return new Promise(function(resolve, reject) {
          var directory, project;
          project = atom.project;
          directory = project.getDirectories().filter(function(d) {
            return d.contains(path) || d.getPath() === path;
          })[0];
          if (directory != null) {
            return project.repositoryForDirectory(directory).then(function(repo) {
              var submodule;
              submodule = repo.repo.submoduleForPath(path);
              if (submodule != null) {
                return resolve(submodule);
              } else {
                return resolve(repo);
              }
            })["catch"](function(e) {
              return reject(e);
            });
          } else {
            return reject("no current file");
          }
        });
      }
    },
    getSubmodule: function(path) {
      var ref, ref1, ref2;
      if (path == null) {
        path = (ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0;
      }
      return (ref1 = atom.project.getRepositories().filter(function(r) {
        var ref2;
        return r != null ? (ref2 = r.repo) != null ? ref2.submoduleForPath(path) : void 0 : void 0;
      })[0]) != null ? (ref2 = ref1.repo) != null ? ref2.submoduleForPath(path) : void 0 : void 0;
    },
    dir: function(andSubmodules) {
      if (andSubmodules == null) {
        andSubmodules = true;
      }
      return new Promise((function(_this) {
        return function(resolve, reject) {
          var submodule;
          if (andSubmodules && (submodule = git.getSubmodule())) {
            return resolve(submodule.getWorkingDirectory());
          } else {
            return git.getRepo().then(function(repo) {
              return resolve(repo.getWorkingDirectory());
            });
          }
        };
      })(this));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvZ2l0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNKLGtCQUFtQixPQUFBLENBQVEsTUFBUjs7RUFFcEIsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUjs7RUFDZixRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBRVgsaUJBQUEsR0FBb0IsU0FBQyxJQUFELEVBQU8sWUFBUDtBQUNsQixRQUFBOztNQUR5QixlQUFhOztJQUN0QyxJQUFBLEdBQU8sQ0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixvQkFBbkI7V0FDUCxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFDSixZQUFZLENBQUMsTUFBYixDQUFvQixrQkFBQSxDQUFtQixJQUFuQixDQUFwQjtJQURJLENBRE47RUFGa0I7O0VBTXBCLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ1YsUUFBQTtJQURrQix3QkFBRCxNQUFTO0lBQzFCLElBQWEsSUFBQSxLQUFRLEVBQXJCO0FBQUEsYUFBTyxHQUFQOztJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUI7OztBQUNuQjtXQUFBLGlEQUFBOztxQkFDSDtVQUFDLE1BQUEsSUFBRDtVQUFPLFFBQUEsTUFBUDtVQUFlLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBMUI7O0FBREc7OztFQUhLOztFQU1aLGtCQUFBLEdBQXFCLFNBQUMsSUFBRDtJQUNuQixJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sR0FBUDs7SUFDQSxJ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QixPQUFBLENBQVEsU0FBUixFQUFuQjtlQUFBLE1BQUE7dUJBQTJDLE9BQUEsQ0FBUSxJQUFSLEVBQTNDOztZQUZJLENBRE4sQ0FJQSxFQUFDLEtBQUQsRUFKQSxDQUlPLFNBQUMsQ0FBRDtxQkFDTCxNQUFBLENBQU8sQ0FBUDtZQURLLENBSlAsRUFERjtXQUFBLE1BQUE7bUJBUUUsTUFBQSxDQUFPLGlCQUFQLEVBUkY7O1FBSFUsQ0FBUixFQUhOOztJQURjLENBdEZoQjtJQXVHQSxZQUFBLEVBQWMsU0FBQyxJQUFEO0FBQ1osVUFBQTs7UUFBQSxpRUFBNEMsQ0FBRSxPQUF0QyxDQUFBOzs7Ozt3REFHRSxDQUFFLGdCQUZaLENBRTZCLElBRjdCO0lBRlksQ0F2R2Q7SUE2R0EsR0FBQSxFQUFLLFNBQUMsYUFBRDs7UUFBQyxnQkFBYzs7YUFDZCxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDVixjQUFBO1VBQUEsSUFBRyxhQUFBLElBQWtCLENBQUEsU0FBQSxHQUFZLEdBQUcsQ0FBQyxZQUFKLENBQUEsQ0FBWixDQUFyQjttQkFDRSxPQUFBLENBQVEsU0FBUyxDQUFDLG1CQUFWLENBQUEsQ0FBUixFQURGO1dBQUEsTUFBQTttQkFHRSxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDtxQkFBVSxPQUFBLENBQVEsSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBUjtZQUFWLENBQW5CLEVBSEY7O1FBRFU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7SUFERCxDQTdHTDs7QUEzQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJPcyA9IHJlcXVpcmUgJ29zJ1xue0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xuXG5SZXBvTGlzdFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL3JlcG8tbGlzdC12aWV3J1xubm90aWZpZXIgPSByZXF1aXJlICcuL25vdGlmaWVyJ1xuXG5naXRVbnRyYWNrZWRGaWxlcyA9IChyZXBvLCBkYXRhVW5zdGFnZWQ9W10pIC0+XG4gIGFyZ3MgPSBbJ2xzLWZpbGVzJywgJy1vJywgJy0tZXhjbHVkZS1zdGFuZGFyZCddXG4gIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+XG4gICAgZGF0YVVuc3RhZ2VkLmNvbmNhdChfcHJldHRpZnlVbnRyYWNrZWQoZGF0YSkpXG5cbl9wcmV0dGlmeSA9IChkYXRhLCB7c3RhZ2VkfT17fSkgLT5cbiAgcmV0dXJuIFtdIGlmIGRhdGEgaXMgJydcbiAgZGF0YSA9IGRhdGEuc3BsaXQoL1xcMC8pWy4uLi0xXVxuICBbXSA9IGZvciBtb2RlLCBpIGluIGRhdGEgYnkgMlxuICAgIHttb2RlLCBzdGFnZWQsIHBhdGg6IGRhdGFbaSsxXX1cblxuX3ByZXR0aWZ5VW50cmFja2VkID0gKGRhdGEpIC0+XG4gIHJldHVybiBbXSBpZiBkYXRhIGlzICcnXG4gIGRhdGEgPSBkYXRhLnNwbGl0KC9cXG4vKS5maWx0ZXIgKGQpIC0+IGQgaXNudCAnJ1xuICBkYXRhLm1hcCAoZmlsZSkgLT4ge21vZGU6ICc/JywgcGF0aDogZmlsZX1cblxuX3ByZXR0aWZ5RGlmZiA9IChkYXRhKSAtPlxuICBkYXRhID0gZGF0YS5zcGxpdCgvXkBAKD89WyBcXC1cXCtcXCwwLTldKkBAKS9nbSlcbiAgZGF0YVsxLi5kYXRhLmxlbmd0aF0gPSAoJ0BAJyArIGxpbmUgZm9yIGxpbmUgaW4gZGF0YVsxLi5dKVxuICBkYXRhXG5cbmdldFJlcG9Gb3JDdXJyZW50RmlsZSA9IC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgcHJvamVjdCA9IGF0b20ucHJvamVjdFxuICAgIHBhdGggPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKVxuICAgIGRpcmVjdG9yeSA9IHByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKS5maWx0ZXIoKGQpIC0+IGQuY29udGFpbnMocGF0aCkpWzBdXG4gICAgaWYgZGlyZWN0b3J5P1xuICAgICAgcHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KGRpcmVjdG9yeSkudGhlbiAocmVwbykgLT5cbiAgICAgICAgc3VibW9kdWxlID0gcmVwby5yZXBvLnN1Ym1vZHVsZUZvclBhdGgocGF0aClcbiAgICAgICAgaWYgc3VibW9kdWxlPyB0aGVuIHJlc29sdmUoc3VibW9kdWxlKSBlbHNlIHJlc29sdmUocmVwbylcbiAgICAgIC5jYXRjaCAoZSkgLT5cbiAgICAgICAgcmVqZWN0KGUpXG4gICAgZWxzZVxuICAgICAgcmVqZWN0IFwibm8gY3VycmVudCBmaWxlXCJcblxubW9kdWxlLmV4cG9ydHMgPSBnaXQgPVxuICBjbWQ6IChhcmdzLCBvcHRpb25zPXsgZW52OiBwcm9jZXNzLmVudn0sIHtjb2xvcn09e30pIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIG91dHB1dCA9ICcnXG4gICAgICBhcmdzID0gWyctYycsICdjb2xvci51aT1hbHdheXMnXS5jb25jYXQoYXJncykgaWYgY29sb3JcbiAgICAgIHByb2Nlc3MgPSBuZXcgQnVmZmVyZWRQcm9jZXNzXG4gICAgICAgIGNvbW1hbmQ6IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuZ2VuZXJhbC5naXRQYXRoJykgPyAnZ2l0J1xuICAgICAgICBhcmdzOiBhcmdzXG4gICAgICAgIG9wdGlvbnM6IG9wdGlvbnNcbiAgICAgICAgc3Rkb3V0OiAoZGF0YSkgLT4gb3V0cHV0ICs9IGRhdGEudG9TdHJpbmcoKVxuICAgICAgICBzdGRlcnI6IChkYXRhKSAtPlxuICAgICAgICAgIG91dHB1dCArPSBkYXRhLnRvU3RyaW5nKClcbiAgICAgICAgZXhpdDogKGNvZGUpIC0+XG4gICAgICAgICAgaWYgY29kZSBpcyAwXG4gICAgICAgICAgICByZXNvbHZlIG91dHB1dFxuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIHJlamVjdCBvdXRwdXRcbiAgICAgIHByb2Nlc3Mub25XaWxsVGhyb3dFcnJvciAoZXJyb3JPYmplY3QpIC0+XG4gICAgICAgIG5vdGlmaWVyLmFkZEVycm9yICdHaXQgUGx1cyBpcyB1bmFibGUgdG8gbG9jYXRlIHRoZSBnaXQgY29tbWFuZC4gUGxlYXNlIGVuc3VyZSBwcm9jZXNzLmVudi5QQVRIIGNhbiBhY2Nlc3MgZ2l0LidcbiAgICAgICAgcmVqZWN0IFwiQ291bGRuJ3QgZmluZCBnaXRcIlxuXG4gIGdldENvbmZpZzogKHJlcG8sIHNldHRpbmcpIC0+IHJlcG8uZ2V0Q29uZmlnVmFsdWUgc2V0dGluZywgcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KClcblxuICByZXNldDogKHJlcG8pIC0+XG4gICAgZ2l0LmNtZChbJ3Jlc2V0JywgJ0hFQUQnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSkudGhlbiAoKSAtPiBub3RpZmllci5hZGRTdWNjZXNzICdBbGwgY2hhbmdlcyB1bnN0YWdlZCdcblxuICBzdGF0dXM6IChyZXBvKSAtPlxuICAgIGdpdC5jbWQoWydzdGF0dXMnLCAnLS1wb3JjZWxhaW4nLCAnLXonXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT4gaWYgZGF0YS5sZW5ndGggPiAyIHRoZW4gZGF0YS5zcGxpdCgnXFwwJylbLi4uLTFdIGVsc2UgW11cblxuICByZWZyZXNoOiAocmVwbykgLT5cbiAgICBpZiByZXBvXG4gICAgICByZXBvLnJlZnJlc2hTdGF0dXM/KClcbiAgICAgIHJlcG8ucmVmcmVzaEluZGV4PygpXG4gICAgZWxzZVxuICAgICAgYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpLmZvckVhY2ggKHJlcG8pIC0+IHJlcG8ucmVmcmVzaFN0YXR1cygpIGlmIHJlcG8/XG5cbiAgcmVsYXRpdml6ZTogKHBhdGgpIC0+XG4gICAgZ2l0LmdldFN1Ym1vZHVsZShwYXRoKT8ucmVsYXRpdml6ZShwYXRoKSA/IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKVswXT8ucmVsYXRpdml6ZShwYXRoKSA/IHBhdGhcblxuICBkaWZmOiAocmVwbywgcGF0aCkgLT5cbiAgICBnaXQuY21kKFsnZGlmZicsICctcCcsICctVTEnLCBwYXRoXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT4gX3ByZXR0aWZ5RGlmZihkYXRhKVxuXG4gIHN0YWdlZEZpbGVzOiAocmVwbykgLT5cbiAgICBhcmdzID0gWydkaWZmLWluZGV4JywgJy0tY2FjaGVkJywgJ0hFQUQnLCAnLS1uYW1lLXN0YXR1cycsICcteiddXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgX3ByZXR0aWZ5IGRhdGEsIHN0YWdlZDogdHJ1ZVxuICAgIC5jYXRjaCAoZXJyb3IpIC0+XG4gICAgICBpZiBlcnJvci5pbmNsdWRlcyBcImFtYmlndW91cyBhcmd1bWVudCAnSEVBRCdcIlxuICAgICAgICBQcm9taXNlLnJlc29sdmUgWzFdXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZEVycm9yIGVycm9yXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSBbXVxuXG4gIHVuc3RhZ2VkRmlsZXM6IChyZXBvLCB7c2hvd1VudHJhY2tlZH09e30pIC0+XG4gICAgYXJncyA9IFsnZGlmZi1maWxlcycsICctLW5hbWUtc3RhdHVzJywgJy16J11cbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBpZiBzaG93VW50cmFja2VkXG4gICAgICAgIGdpdFVudHJhY2tlZEZpbGVzKHJlcG8sIF9wcmV0dGlmeShkYXRhLCBzdGFnZWQ6IGZhbHNlKSlcbiAgICAgIGVsc2VcbiAgICAgICAgX3ByZXR0aWZ5KGRhdGEsIHN0YWdlZDogZmFsc2UpXG5cbiAgYWRkOiAocmVwbywge2ZpbGUsIHVwZGF0ZX09e30pIC0+XG4gICAgYXJncyA9IFsnYWRkJ11cbiAgICBpZiB1cGRhdGUgdGhlbiBhcmdzLnB1c2ggJy0tdXBkYXRlJyBlbHNlIGFyZ3MucHVzaCAnLS1hbGwnXG4gICAgYXJncy5wdXNoKGlmIGZpbGUgdGhlbiBmaWxlIGVsc2UgJy4nKVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAob3V0cHV0KSAtPlxuICAgICAgaWYgb3V0cHV0IGlzbnQgZmFsc2VcbiAgICAgICAgbm90aWZpZXIuYWRkU3VjY2VzcyBcIkFkZGVkICN7ZmlsZSA/ICdhbGwgZmlsZXMnfVwiXG4gICAgLmNhdGNoIChtc2cpIC0+IG5vdGlmaWVyLmFkZEVycm9yIG1zZ1xuXG4gIGdldFJlcG86IC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIGdldFJlcG9Gb3JDdXJyZW50RmlsZSgpLnRoZW4gKHJlcG8pIC0+IHJlc29sdmUocmVwbylcbiAgICAgIC5jYXRjaCAoZSkgLT5cbiAgICAgICAgcmVwb3MgPSBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKCkuZmlsdGVyIChyKSAtPiByP1xuICAgICAgICBpZiByZXBvcy5sZW5ndGggaXMgMFxuICAgICAgICAgIHJlamVjdChcIk5vIHJlcG9zIGZvdW5kXCIpXG4gICAgICAgIGVsc2UgaWYgcmVwb3MubGVuZ3RoID4gMVxuICAgICAgICAgIHJlc29sdmUobmV3IFJlcG9MaXN0VmlldyhyZXBvcykucmVzdWx0KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgcmVzb2x2ZShyZXBvc1swXSlcblxuICBnZXRSZXBvRm9yUGF0aDogKHBhdGgpIC0+XG4gICAgaWYgbm90IHBhdGg/XG4gICAgICBQcm9taXNlLnJlamVjdCBcIk5vIGZpbGUgdG8gZmluZCByZXBvc2l0b3J5IGZvclwiXG4gICAgZWxzZVxuICAgICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgICAgcHJvamVjdCA9IGF0b20ucHJvamVjdFxuICAgICAgICBkaXJlY3RvcnkgPSBwcm9qZWN0LmdldERpcmVjdG9yaWVzKCkuZmlsdGVyKChkKSAtPiBkLmNvbnRhaW5zKHBhdGgpIG9yIGQuZ2V0UGF0aCgpIGlzIHBhdGgpWzBdXG4gICAgICAgIGlmIGRpcmVjdG9yeT9cbiAgICAgICAgICBwcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkoZGlyZWN0b3J5KVxuICAgICAgICAgIC50aGVuIChyZXBvKSAtPlxuICAgICAgICAgICAgc3VibW9kdWxlID0gcmVwby5yZXBvLnN1Ym1vZHVsZUZvclBhdGgocGF0aClcbiAgICAgICAgICAgIGlmIHN1Ym1vZHVsZT8gdGhlbiByZXNvbHZlKHN1Ym1vZHVsZSkgZWxzZSByZXNvbHZlKHJlcG8pXG4gICAgICAgICAgLmNhdGNoIChlKSAtPlxuICAgICAgICAgICAgcmVqZWN0KGUpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZWplY3QgXCJubyBjdXJyZW50IGZpbGVcIlxuXG4gIGdldFN1Ym1vZHVsZTogKHBhdGgpIC0+XG4gICAgcGF0aCA/PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKVxuICAgIGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5maWx0ZXIoKHIpIC0+XG4gICAgICByPy5yZXBvPy5zdWJtb2R1bGVGb3JQYXRoIHBhdGhcbiAgICApWzBdPy5yZXBvPy5zdWJtb2R1bGVGb3JQYXRoIHBhdGhcblxuICBkaXI6IChhbmRTdWJtb2R1bGVzPXRydWUpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIGlmIGFuZFN1Ym1vZHVsZXMgYW5kIHN1Ym1vZHVsZSA9IGdpdC5nZXRTdWJtb2R1bGUoKVxuICAgICAgICByZXNvbHZlKHN1Ym1vZHVsZS5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICBlbHNlXG4gICAgICAgIGdpdC5nZXRSZXBvKCkudGhlbiAocmVwbykgLT4gcmVzb2x2ZShyZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiJdfQ==
