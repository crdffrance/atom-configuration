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
              submodule = repo != null ? repo.repo.submoduleForPath(path) : void 0;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvZ2l0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNKLGtCQUFtQixPQUFBLENBQVEsTUFBUjs7RUFFcEIsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUjs7RUFDZixRQUFBLEdBQVcsT0FBQSxDQUFRLFlBQVI7O0VBRVgsaUJBQUEsR0FBb0IsU0FBQyxJQUFELEVBQU8sWUFBUDtBQUNsQixRQUFBOztNQUR5QixlQUFhOztJQUN0QyxJQUFBLEdBQU8sQ0FBQyxVQUFELEVBQWEsSUFBYixFQUFtQixvQkFBbkI7V0FDUCxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFDSixZQUFZLENBQUMsTUFBYixDQUFvQixrQkFBQSxDQUFtQixJQUFuQixDQUFwQjtJQURJLENBRE47RUFGa0I7O0VBTXBCLFNBQUEsR0FBWSxTQUFDLElBQUQsRUFBTyxHQUFQO0FBQ1YsUUFBQTtJQURrQix3QkFBRCxNQUFTO0lBQzFCLElBQWEsSUFBQSxLQUFRLEVBQXJCO0FBQUEsYUFBTyxHQUFQOztJQUNBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLElBQVgsQ0FBaUI7OztBQUNuQjtXQUFBLGlEQUFBOztxQkFDSDtVQUFDLE1BQUEsSUFBRDtVQUFPLFFBQUEsTUFBUDtVQUFlLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxHQUFFLENBQUYsQ0FBMUI7O0FBREc7OztFQUhLOztFQU1aLGtCQUFBLEdBQXFCLFNBQUMsSUFBRDtJQUNuQixJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sR0FBUDs7SUFDQSxJ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bUIsT0FBQSxDQUFRLFNBQVIsRUFBbkI7ZUFBQSxNQUFBO3VCQUEyQyxPQUFBLENBQVEsSUFBUixFQUEzQzs7WUFGSSxDQUROLENBSUEsRUFBQyxLQUFELEVBSkEsQ0FJTyxTQUFDLENBQUQ7cUJBQ0wsTUFBQSxDQUFPLENBQVA7WUFESyxDQUpQLEVBREY7V0FBQSxNQUFBO21CQVFFLE1BQUEsQ0FBTyxpQkFBUCxFQVJGOztRQUhVLENBQVIsRUFITjs7SUFEYyxDQXRGaEI7SUF1R0EsWUFBQSxFQUFjLFNBQUMsSUFBRDtBQUNaLFVBQUE7O1FBQUEsaUVBQTRDLENBQUUsT0FBdEMsQ0FBQTs7Ozs7d0RBR0UsQ0FBRSxnQkFGWixDQUU2QixJQUY3QjtJQUZZLENBdkdkO0lBNkdBLEdBQUEsRUFBSyxTQUFDLGFBQUQ7O1FBQUMsZ0JBQWM7O2FBQ2QsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ1YsY0FBQTtVQUFBLElBQUcsYUFBQSxJQUFrQixDQUFBLFNBQUEsR0FBWSxHQUFHLENBQUMsWUFBSixDQUFBLENBQVosQ0FBckI7bUJBQ0UsT0FBQSxDQUFRLFNBQVMsQ0FBQyxtQkFBVixDQUFBLENBQVIsRUFERjtXQUFBLE1BQUE7bUJBR0UsR0FBRyxDQUFDLE9BQUosQ0FBQSxDQUFhLENBQUMsSUFBZCxDQUFtQixTQUFDLElBQUQ7cUJBQVUsT0FBQSxDQUFRLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQVI7WUFBVixDQUFuQixFQUhGOztRQURVO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO0lBREQsQ0E3R0w7O0FBM0NGIiwic291cmNlc0NvbnRlbnQiOlsiT3MgPSByZXF1aXJlICdvcydcbntCdWZmZXJlZFByb2Nlc3N9ID0gcmVxdWlyZSAnYXRvbSdcblxuUmVwb0xpc3RWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9yZXBvLWxpc3Qtdmlldydcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi9ub3RpZmllcidcblxuZ2l0VW50cmFja2VkRmlsZXMgPSAocmVwbywgZGF0YVVuc3RhZ2VkPVtdKSAtPlxuICBhcmdzID0gWydscy1maWxlcycsICctbycsICctLWV4Y2x1ZGUtc3RhbmRhcmQnXVxuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPlxuICAgIGRhdGFVbnN0YWdlZC5jb25jYXQoX3ByZXR0aWZ5VW50cmFja2VkKGRhdGEpKVxuXG5fcHJldHRpZnkgPSAoZGF0YSwge3N0YWdlZH09e30pIC0+XG4gIHJldHVybiBbXSBpZiBkYXRhIGlzICcnXG4gIGRhdGEgPSBkYXRhLnNwbGl0KC9cXDAvKVsuLi4tMV1cbiAgW10gPSBmb3IgbW9kZSwgaSBpbiBkYXRhIGJ5IDJcbiAgICB7bW9kZSwgc3RhZ2VkLCBwYXRoOiBkYXRhW2krMV19XG5cbl9wcmV0dGlmeVVudHJhY2tlZCA9IChkYXRhKSAtPlxuICByZXR1cm4gW10gaWYgZGF0YSBpcyAnJ1xuICBkYXRhID0gZGF0YS5zcGxpdCgvXFxuLykuZmlsdGVyIChkKSAtPiBkIGlzbnQgJydcbiAgZGF0YS5tYXAgKGZpbGUpIC0+IHttb2RlOiAnPycsIHBhdGg6IGZpbGV9XG5cbl9wcmV0dGlmeURpZmYgPSAoZGF0YSkgLT5cbiAgZGF0YSA9IGRhdGEuc3BsaXQoL15AQCg/PVsgXFwtXFwrXFwsMC05XSpAQCkvZ20pXG4gIGRhdGFbMS4uZGF0YS5sZW5ndGhdID0gKCdAQCcgKyBsaW5lIGZvciBsaW5lIGluIGRhdGFbMS4uXSlcbiAgZGF0YVxuXG5nZXRSZXBvRm9yQ3VycmVudEZpbGUgPSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgIHByb2plY3QgPSBhdG9tLnByb2plY3RcbiAgICBwYXRoID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKClcbiAgICBkaXJlY3RvcnkgPSBwcm9qZWN0LmdldERpcmVjdG9yaWVzKCkuZmlsdGVyKChkKSAtPiBkLmNvbnRhaW5zKHBhdGgpKVswXVxuICAgIGlmIGRpcmVjdG9yeT9cbiAgICAgIHByb2plY3QucmVwb3NpdG9yeUZvckRpcmVjdG9yeShkaXJlY3RvcnkpLnRoZW4gKHJlcG8pIC0+XG4gICAgICAgIHN1Ym1vZHVsZSA9IHJlcG8ucmVwby5zdWJtb2R1bGVGb3JQYXRoKHBhdGgpXG4gICAgICAgIGlmIHN1Ym1vZHVsZT8gdGhlbiByZXNvbHZlKHN1Ym1vZHVsZSkgZWxzZSByZXNvbHZlKHJlcG8pXG4gICAgICAuY2F0Y2ggKGUpIC0+XG4gICAgICAgIHJlamVjdChlKVxuICAgIGVsc2VcbiAgICAgIHJlamVjdCBcIm5vIGN1cnJlbnQgZmlsZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gZ2l0ID1cbiAgY21kOiAoYXJncywgb3B0aW9ucz17IGVudjogcHJvY2Vzcy5lbnZ9LCB7Y29sb3J9PXt9KSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBvdXRwdXQgPSAnJ1xuICAgICAgYXJncyA9IFsnLWMnLCAnY29sb3IudWk9YWx3YXlzJ10uY29uY2F0KGFyZ3MpIGlmIGNvbG9yXG4gICAgICBwcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzc1xuICAgICAgICBjb21tYW5kOiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwuZ2l0UGF0aCcpID8gJ2dpdCdcbiAgICAgICAgYXJnczogYXJnc1xuICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgIHN0ZG91dDogKGRhdGEpIC0+IG91dHB1dCArPSBkYXRhLnRvU3RyaW5nKClcbiAgICAgICAgc3RkZXJyOiAoZGF0YSkgLT5cbiAgICAgICAgICBvdXRwdXQgKz0gZGF0YS50b1N0cmluZygpXG4gICAgICAgIGV4aXQ6IChjb2RlKSAtPlxuICAgICAgICAgIGlmIGNvZGUgaXMgMFxuICAgICAgICAgICAgcmVzb2x2ZSBvdXRwdXRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZWplY3Qgb3V0cHV0XG4gICAgICBwcm9jZXNzLm9uV2lsbFRocm93RXJyb3IgKGVycm9yT2JqZWN0KSAtPlxuICAgICAgICBub3RpZmllci5hZGRFcnJvciAnR2l0IFBsdXMgaXMgdW5hYmxlIHRvIGxvY2F0ZSB0aGUgZ2l0IGNvbW1hbmQuIFBsZWFzZSBlbnN1cmUgcHJvY2Vzcy5lbnYuUEFUSCBjYW4gYWNjZXNzIGdpdC4nXG4gICAgICAgIHJlamVjdCBcIkNvdWxkbid0IGZpbmQgZ2l0XCJcblxuICBnZXRDb25maWc6IChyZXBvLCBzZXR0aW5nKSAtPiByZXBvLmdldENvbmZpZ1ZhbHVlIHNldHRpbmcsIHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbiAgcmVzZXQ6IChyZXBvKSAtPlxuICAgIGdpdC5jbWQoWydyZXNldCcsICdIRUFEJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpLnRoZW4gKCkgLT4gbm90aWZpZXIuYWRkU3VjY2VzcyAnQWxsIGNoYW5nZXMgdW5zdGFnZWQnXG5cbiAgc3RhdHVzOiAocmVwbykgLT5cbiAgICBnaXQuY21kKFsnc3RhdHVzJywgJy0tcG9yY2VsYWluJywgJy16J10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+IGlmIGRhdGEubGVuZ3RoID4gMiB0aGVuIGRhdGEuc3BsaXQoJ1xcMCcpWy4uLi0xXSBlbHNlIFtdXG5cbiAgcmVmcmVzaDogKHJlcG8pIC0+XG4gICAgaWYgcmVwb1xuICAgICAgcmVwby5yZWZyZXNoU3RhdHVzPygpXG4gICAgICByZXBvLnJlZnJlc2hJbmRleD8oKVxuICAgIGVsc2VcbiAgICAgIGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5mb3JFYWNoIChyZXBvKSAtPiByZXBvLnJlZnJlc2hTdGF0dXMoKSBpZiByZXBvP1xuXG4gIHJlbGF0aXZpemU6IChwYXRoKSAtPlxuICAgIGdpdC5nZXRTdWJtb2R1bGUocGF0aCk/LnJlbGF0aXZpemUocGF0aCkgPyBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbMF0/LnJlbGF0aXZpemUocGF0aCkgPyBwYXRoXG5cbiAgZGlmZjogKHJlcG8sIHBhdGgpIC0+XG4gICAgZ2l0LmNtZChbJ2RpZmYnLCAnLXAnLCAnLVUxJywgcGF0aF0sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+IF9wcmV0dGlmeURpZmYoZGF0YSlcblxuICBzdGFnZWRGaWxlczogKHJlcG8pIC0+XG4gICAgYXJncyA9IFsnZGlmZi1pbmRleCcsICctLWNhY2hlZCcsICdIRUFEJywgJy0tbmFtZS1zdGF0dXMnLCAnLXonXVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT5cbiAgICAgIF9wcmV0dGlmeSBkYXRhLCBzdGFnZWQ6IHRydWVcbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgaWYgZXJyb3IuaW5jbHVkZXMgXCJhbWJpZ3VvdXMgYXJndW1lbnQgJ0hFQUQnXCJcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlIFsxXVxuICAgICAgZWxzZVxuICAgICAgICBub3RpZmllci5hZGRFcnJvciBlcnJvclxuICAgICAgICBQcm9taXNlLnJlc29sdmUgW11cblxuICB1bnN0YWdlZEZpbGVzOiAocmVwbywge3Nob3dVbnRyYWNrZWR9PXt9KSAtPlxuICAgIGFyZ3MgPSBbJ2RpZmYtZmlsZXMnLCAnLS1uYW1lLXN0YXR1cycsICcteiddXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgaWYgc2hvd1VudHJhY2tlZFxuICAgICAgICBnaXRVbnRyYWNrZWRGaWxlcyhyZXBvLCBfcHJldHRpZnkoZGF0YSwgc3RhZ2VkOiBmYWxzZSkpXG4gICAgICBlbHNlXG4gICAgICAgIF9wcmV0dGlmeShkYXRhLCBzdGFnZWQ6IGZhbHNlKVxuXG4gIGFkZDogKHJlcG8sIHtmaWxlLCB1cGRhdGV9PXt9KSAtPlxuICAgIGFyZ3MgPSBbJ2FkZCddXG4gICAgaWYgdXBkYXRlIHRoZW4gYXJncy5wdXNoICctLXVwZGF0ZScgZWxzZSBhcmdzLnB1c2ggJy0tYWxsJ1xuICAgIGFyZ3MucHVzaChpZiBmaWxlIHRoZW4gZmlsZSBlbHNlICcuJylcbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKG91dHB1dCkgLT5cbiAgICAgIGlmIG91dHB1dCBpc250IGZhbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZFN1Y2Nlc3MgXCJBZGRlZCAje2ZpbGUgPyAnYWxsIGZpbGVzJ31cIlxuICAgIC5jYXRjaCAobXNnKSAtPiBub3RpZmllci5hZGRFcnJvciBtc2dcblxuICBnZXRSZXBvOiAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBnZXRSZXBvRm9yQ3VycmVudEZpbGUoKS50aGVuIChyZXBvKSAtPiByZXNvbHZlKHJlcG8pXG4gICAgICAuY2F0Y2ggKGUpIC0+XG4gICAgICAgIHJlcG9zID0gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpLmZpbHRlciAocikgLT4gcj9cbiAgICAgICAgaWYgcmVwb3MubGVuZ3RoIGlzIDBcbiAgICAgICAgICByZWplY3QoXCJObyByZXBvcyBmb3VuZFwiKVxuICAgICAgICBlbHNlIGlmIHJlcG9zLmxlbmd0aCA+IDFcbiAgICAgICAgICByZXNvbHZlKG5ldyBSZXBvTGlzdFZpZXcocmVwb3MpLnJlc3VsdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlc29sdmUocmVwb3NbMF0pXG5cbiAgZ2V0UmVwb0ZvclBhdGg6IChwYXRoKSAtPlxuICAgIGlmIG5vdCBwYXRoP1xuICAgICAgUHJvbWlzZS5yZWplY3QgXCJObyBmaWxlIHRvIGZpbmQgcmVwb3NpdG9yeSBmb3JcIlxuICAgIGVsc2VcbiAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgIHByb2plY3QgPSBhdG9tLnByb2plY3RcbiAgICAgICAgZGlyZWN0b3J5ID0gcHJvamVjdC5nZXREaXJlY3RvcmllcygpLmZpbHRlcigoZCkgLT4gZC5jb250YWlucyhwYXRoKSBvciBkLmdldFBhdGgoKSBpcyBwYXRoKVswXVxuICAgICAgICBpZiBkaXJlY3Rvcnk/XG4gICAgICAgICAgcHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5KGRpcmVjdG9yeSlcbiAgICAgICAgICAudGhlbiAocmVwbykgLT5cbiAgICAgICAgICAgIHN1Ym1vZHVsZSA9IHJlcG8/LnJlcG8uc3VibW9kdWxlRm9yUGF0aChwYXRoKVxuICAgICAgICAgICAgaWYgc3VibW9kdWxlPyB0aGVuIHJlc29sdmUoc3VibW9kdWxlKSBlbHNlIHJlc29sdmUocmVwbylcbiAgICAgICAgICAuY2F0Y2ggKGUpIC0+XG4gICAgICAgICAgICByZWplY3QoZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlamVjdCBcIm5vIGN1cnJlbnQgZmlsZVwiXG5cbiAgZ2V0U3VibW9kdWxlOiAocGF0aCkgLT5cbiAgICBwYXRoID89IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpXG4gICAgYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpLmZpbHRlcigocikgLT5cbiAgICAgIHI/LnJlcG8/LnN1Ym1vZHVsZUZvclBhdGggcGF0aFxuICAgIClbMF0/LnJlcG8/LnN1Ym1vZHVsZUZvclBhdGggcGF0aFxuXG4gIGRpcjogKGFuZFN1Ym1vZHVsZXM9dHJ1ZSkgLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSA9PlxuICAgICAgaWYgYW5kU3VibW9kdWxlcyBhbmQgc3VibW9kdWxlID0gZ2l0LmdldFN1Ym1vZHVsZSgpXG4gICAgICAgIHJlc29sdmUoc3VibW9kdWxlLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIGVsc2VcbiAgICAgICAgZ2l0LmdldFJlcG8oKS50aGVuIChyZXBvKSAtPiByZXNvbHZlKHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuIl19
