(function() {
  var BufferedProcess, Directory, Os, RepoListView, _prettify, _prettifyDiff, _prettifyUntracked, getRepoForCurrentFile, git, gitUntrackedFiles, notifier, ref;

  Os = require('os');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, Directory = ref.Directory;

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
    var line, ref1;
    data = data.split(/^@@(?=[ \-\+\,0-9]*@@)/gm);
    [].splice.apply(data, [1, data.length - 1 + 1].concat(ref1 = (function() {
      var j, len, ref2, results;
      ref2 = data.slice(1);
      results = [];
      for (j = 0, len = ref2.length; j < len; j++) {
        line = ref2[j];
        results.push('@@' + line);
      }
      return results;
    })())), ref1;
    return data;
  };

  getRepoForCurrentFile = function() {
    return new Promise(function(resolve, reject) {
      var directory, path, project, ref1;
      project = atom.project;
      path = (ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0;
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
        var output, process, ref1;
        output = '';
        if (color) {
          args = ['-c', 'color.ui=always'].concat(args);
        }
        process = new BufferedProcess({
          command: (ref1 = atom.config.get('git-plus.general.gitPath')) != null ? ref1 : 'git',
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
      var ref1, ref2, ref3, ref4;
      return (ref1 = (ref2 = (ref3 = git.getSubmodule(path)) != null ? ref3.relativize(path) : void 0) != null ? ref2 : (ref4 = atom.project.getRepositories()[0]) != null ? ref4.relativize(path) : void 0) != null ? ref1 : path;
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
      var args, file, ref1, update;
      ref1 = arg != null ? arg : {}, file = ref1.file, update = ref1.update;
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
          var repoPromises;
          repoPromises = atom.project.getDirectories().map(atom.project.repositoryForDirectory.bind(atom.project));
          return Promise.all(repoPromises).then(function(repos) {
            return repos.forEach(function(repo) {
              var submodule;
              if ((new Directory(repo.getWorkingDirectory())).contains(path)) {
                submodule = repo != null ? repo.repo.submoduleForPath(path) : void 0;
                if (submodule != null) {
                  return resolve(submodule);
                } else {
                  return resolve(repo);
                }
              }
            });
          });
        });
      }
    },
    getSubmodule: function(path) {
      var ref1, ref2, ref3;
      if (path == null) {
        path = (ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0;
      }
      return (ref2 = atom.project.getRepositories().filter(function(r) {
        var ref3;
        return r != null ? (ref3 = r.repo) != null ? ref3.submoduleForPath(path) : void 0 : void 0;
      })[0]) != null ? (ref3 = ref2.repo) != null ? ref3.submoduleForPath(path) : void 0 : void 0;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvZ2l0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLE1BQStCLE9BQUEsQ0FBUSxNQUFSLENBQS9CLEVBQUMscUNBQUQsRUFBa0I7O0VBRWxCLFlBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVI7O0VBQ2YsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUVYLGlCQUFBLEdBQW9CLFNBQUMsSUFBRCxFQUFPLFlBQVA7QUFDbEIsUUFBQTs7TUFEeUIsZUFBYTs7SUFDdEMsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsb0JBQW5CO1dBQ1AsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQ0osWUFBWSxDQUFDLE1BQWIsQ0FBb0Isa0JBQUEsQ0FBbUIsSUFBbkIsQ0FBcEI7SUFESSxDQUROO0VBRmtCOztFQU1wQixTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNWLFFBQUE7SUFEa0Isd0JBQUQsTUFBUztJQUMxQixJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sR0FBUDs7SUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCOzs7QUFDbkI7V0FBQSxpREFBQTs7cUJBQ0g7VUFBQyxNQUFBLElBQUQ7VUFBTyxRQUFBLE1BQVA7VUFBZSxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsR0FBRSxDQUFGLENBQTFCOztBQURHOzs7RUFISzs7RUFNWixrQkFBQSxHQUFxQixTQUFDLElBQUQ7SUFDbkIsSUFBYSxJQUFBLEtBQVEsRUFBckI7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Z0JBQ0UsU0FBQSxrQkFBWSxJQUFJLENBQUUsSUFBSSxDQUFDLGdCQUFYLENBQTRCLElBQTVCO2dCQUNaLElBQUcsaUJBQUg7eUJBQW1CLE9BQUEsQ0FBUSxTQUFSLEVBQW5CO2lCQUFBLE1BQUE7eUJBQTJDLE9BQUEsQ0FBUSxJQUFSLEVBQTNDO2lCQUZGOztZQURZLENBQWQ7VUFENkIsQ0FBL0I7UUFMVSxDQUFSLEVBSE47O0lBRGMsQ0F0RmhCO0lBcUdBLFlBQUEsRUFBYyxTQUFDLElBQUQ7QUFDWixVQUFBOztRQUFBLG1FQUE0QyxDQUFFLE9BQXRDLENBQUE7Ozs7O3dEQUdFLENBQUUsZ0JBRlosQ0FFNkIsSUFGN0I7SUFGWSxDQXJHZDtJQTJHQSxHQUFBLEVBQUssU0FBQyxhQUFEOztRQUFDLGdCQUFjOzthQUNkLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNWLGNBQUE7VUFBQSxJQUFHLGFBQUEsSUFBa0IsQ0FBQSxTQUFBLEdBQVksR0FBRyxDQUFDLFlBQUosQ0FBQSxDQUFaLENBQXJCO21CQUNFLE9BQUEsQ0FBUSxTQUFTLENBQUMsbUJBQVYsQ0FBQSxDQUFSLEVBREY7V0FBQSxNQUFBO21CQUdFLEdBQUcsQ0FBQyxPQUFKLENBQUEsQ0FBYSxDQUFDLElBQWQsQ0FBbUIsU0FBQyxJQUFEO3FCQUFVLE9BQUEsQ0FBUSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFSO1lBQVYsQ0FBbkIsRUFIRjs7UUFEVTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUjtJQURELENBM0dMOztBQTNDRiIsInNvdXJjZXNDb250ZW50IjpbIk9zID0gcmVxdWlyZSAnb3MnXG57QnVmZmVyZWRQcm9jZXNzLCBEaXJlY3Rvcnl9ID0gcmVxdWlyZSAnYXRvbSdcblxuUmVwb0xpc3RWaWV3ID0gcmVxdWlyZSAnLi92aWV3cy9yZXBvLWxpc3Qtdmlldydcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi9ub3RpZmllcidcblxuZ2l0VW50cmFja2VkRmlsZXMgPSAocmVwbywgZGF0YVVuc3RhZ2VkPVtdKSAtPlxuICBhcmdzID0gWydscy1maWxlcycsICctbycsICctLWV4Y2x1ZGUtc3RhbmRhcmQnXVxuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPlxuICAgIGRhdGFVbnN0YWdlZC5jb25jYXQoX3ByZXR0aWZ5VW50cmFja2VkKGRhdGEpKVxuXG5fcHJldHRpZnkgPSAoZGF0YSwge3N0YWdlZH09e30pIC0+XG4gIHJldHVybiBbXSBpZiBkYXRhIGlzICcnXG4gIGRhdGEgPSBkYXRhLnNwbGl0KC9cXDAvKVsuLi4tMV1cbiAgW10gPSBmb3IgbW9kZSwgaSBpbiBkYXRhIGJ5IDJcbiAgICB7bW9kZSwgc3RhZ2VkLCBwYXRoOiBkYXRhW2krMV19XG5cbl9wcmV0dGlmeVVudHJhY2tlZCA9IChkYXRhKSAtPlxuICByZXR1cm4gW10gaWYgZGF0YSBpcyAnJ1xuICBkYXRhID0gZGF0YS5zcGxpdCgvXFxuLykuZmlsdGVyIChkKSAtPiBkIGlzbnQgJydcbiAgZGF0YS5tYXAgKGZpbGUpIC0+IHttb2RlOiAnPycsIHBhdGg6IGZpbGV9XG5cbl9wcmV0dGlmeURpZmYgPSAoZGF0YSkgLT5cbiAgZGF0YSA9IGRhdGEuc3BsaXQoL15AQCg/PVsgXFwtXFwrXFwsMC05XSpAQCkvZ20pXG4gIGRhdGFbMS4uZGF0YS5sZW5ndGhdID0gKCdAQCcgKyBsaW5lIGZvciBsaW5lIGluIGRhdGFbMS4uXSlcbiAgZGF0YVxuXG5nZXRSZXBvRm9yQ3VycmVudEZpbGUgPSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgIHByb2plY3QgPSBhdG9tLnByb2plY3RcbiAgICBwYXRoID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKClcbiAgICBkaXJlY3RvcnkgPSBwcm9qZWN0LmdldERpcmVjdG9yaWVzKCkuZmlsdGVyKChkKSAtPiBkLmNvbnRhaW5zKHBhdGgpKVswXVxuICAgIGlmIGRpcmVjdG9yeT9cbiAgICAgIHByb2plY3QucmVwb3NpdG9yeUZvckRpcmVjdG9yeShkaXJlY3RvcnkpLnRoZW4gKHJlcG8pIC0+XG4gICAgICAgIHN1Ym1vZHVsZSA9IHJlcG8ucmVwby5zdWJtb2R1bGVGb3JQYXRoKHBhdGgpXG4gICAgICAgIGlmIHN1Ym1vZHVsZT8gdGhlbiByZXNvbHZlKHN1Ym1vZHVsZSkgZWxzZSByZXNvbHZlKHJlcG8pXG4gICAgICAuY2F0Y2ggKGUpIC0+XG4gICAgICAgIHJlamVjdChlKVxuICAgIGVsc2VcbiAgICAgIHJlamVjdCBcIm5vIGN1cnJlbnQgZmlsZVwiXG5cbm1vZHVsZS5leHBvcnRzID0gZ2l0ID1cbiAgY21kOiAoYXJncywgb3B0aW9ucz17IGVudjogcHJvY2Vzcy5lbnZ9LCB7Y29sb3J9PXt9KSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBvdXRwdXQgPSAnJ1xuICAgICAgYXJncyA9IFsnLWMnLCAnY29sb3IudWk9YWx3YXlzJ10uY29uY2F0KGFyZ3MpIGlmIGNvbG9yXG4gICAgICBwcm9jZXNzID0gbmV3IEJ1ZmZlcmVkUHJvY2Vzc1xuICAgICAgICBjb21tYW5kOiBhdG9tLmNvbmZpZy5nZXQoJ2dpdC1wbHVzLmdlbmVyYWwuZ2l0UGF0aCcpID8gJ2dpdCdcbiAgICAgICAgYXJnczogYXJnc1xuICAgICAgICBvcHRpb25zOiBvcHRpb25zXG4gICAgICAgIHN0ZG91dDogKGRhdGEpIC0+IG91dHB1dCArPSBkYXRhLnRvU3RyaW5nKClcbiAgICAgICAgc3RkZXJyOiAoZGF0YSkgLT5cbiAgICAgICAgICBvdXRwdXQgKz0gZGF0YS50b1N0cmluZygpXG4gICAgICAgIGV4aXQ6IChjb2RlKSAtPlxuICAgICAgICAgIGlmIGNvZGUgaXMgMFxuICAgICAgICAgICAgcmVzb2x2ZSBvdXRwdXRcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICByZWplY3Qgb3V0cHV0XG4gICAgICBwcm9jZXNzLm9uV2lsbFRocm93RXJyb3IgKGVycm9yT2JqZWN0KSAtPlxuICAgICAgICBub3RpZmllci5hZGRFcnJvciAnR2l0IFBsdXMgaXMgdW5hYmxlIHRvIGxvY2F0ZSB0aGUgZ2l0IGNvbW1hbmQuIFBsZWFzZSBlbnN1cmUgcHJvY2Vzcy5lbnYuUEFUSCBjYW4gYWNjZXNzIGdpdC4nXG4gICAgICAgIHJlamVjdCBcIkNvdWxkbid0IGZpbmQgZ2l0XCJcblxuICBnZXRDb25maWc6IChyZXBvLCBzZXR0aW5nKSAtPiByZXBvLmdldENvbmZpZ1ZhbHVlIHNldHRpbmcsIHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG5cbiAgcmVzZXQ6IChyZXBvKSAtPlxuICAgIGdpdC5jbWQoWydyZXNldCcsICdIRUFEJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpLnRoZW4gKCkgLT4gbm90aWZpZXIuYWRkU3VjY2VzcyAnQWxsIGNoYW5nZXMgdW5zdGFnZWQnXG5cbiAgc3RhdHVzOiAocmVwbykgLT5cbiAgICBnaXQuY21kKFsnc3RhdHVzJywgJy0tcG9yY2VsYWluJywgJy16J10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+IGlmIGRhdGEubGVuZ3RoID4gMiB0aGVuIGRhdGEuc3BsaXQoJ1xcMCcpWy4uLi0xXSBlbHNlIFtdXG5cbiAgcmVmcmVzaDogKHJlcG8pIC0+XG4gICAgaWYgcmVwb1xuICAgICAgcmVwby5yZWZyZXNoU3RhdHVzPygpXG4gICAgICByZXBvLnJlZnJlc2hJbmRleD8oKVxuICAgIGVsc2VcbiAgICAgIGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5mb3JFYWNoIChyZXBvKSAtPiByZXBvLnJlZnJlc2hTdGF0dXMoKSBpZiByZXBvP1xuXG4gIHJlbGF0aXZpemU6IChwYXRoKSAtPlxuICAgIGdpdC5nZXRTdWJtb2R1bGUocGF0aCk/LnJlbGF0aXZpemUocGF0aCkgPyBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKClbMF0/LnJlbGF0aXZpemUocGF0aCkgPyBwYXRoXG5cbiAgZGlmZjogKHJlcG8sIHBhdGgpIC0+XG4gICAgZ2l0LmNtZChbJ2RpZmYnLCAnLXAnLCAnLVUxJywgcGF0aF0sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+IF9wcmV0dGlmeURpZmYoZGF0YSlcblxuICBzdGFnZWRGaWxlczogKHJlcG8pIC0+XG4gICAgYXJncyA9IFsnZGlmZi1pbmRleCcsICctLWNhY2hlZCcsICdIRUFEJywgJy0tbmFtZS1zdGF0dXMnLCAnLXonXVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT5cbiAgICAgIF9wcmV0dGlmeSBkYXRhLCBzdGFnZWQ6IHRydWVcbiAgICAuY2F0Y2ggKGVycm9yKSAtPlxuICAgICAgaWYgZXJyb3IuaW5jbHVkZXMgXCJhbWJpZ3VvdXMgYXJndW1lbnQgJ0hFQUQnXCJcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlIFsxXVxuICAgICAgZWxzZVxuICAgICAgICBub3RpZmllci5hZGRFcnJvciBlcnJvclxuICAgICAgICBQcm9taXNlLnJlc29sdmUgW11cblxuICB1bnN0YWdlZEZpbGVzOiAocmVwbywge3Nob3dVbnRyYWNrZWR9PXt9KSAtPlxuICAgIGFyZ3MgPSBbJ2RpZmYtZmlsZXMnLCAnLS1uYW1lLXN0YXR1cycsICcteiddXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgaWYgc2hvd1VudHJhY2tlZFxuICAgICAgICBnaXRVbnRyYWNrZWRGaWxlcyhyZXBvLCBfcHJldHRpZnkoZGF0YSwgc3RhZ2VkOiBmYWxzZSkpXG4gICAgICBlbHNlXG4gICAgICAgIF9wcmV0dGlmeShkYXRhLCBzdGFnZWQ6IGZhbHNlKVxuXG4gIGFkZDogKHJlcG8sIHtmaWxlLCB1cGRhdGV9PXt9KSAtPlxuICAgIGFyZ3MgPSBbJ2FkZCddXG4gICAgaWYgdXBkYXRlIHRoZW4gYXJncy5wdXNoICctLXVwZGF0ZScgZWxzZSBhcmdzLnB1c2ggJy0tYWxsJ1xuICAgIGFyZ3MucHVzaChpZiBmaWxlIHRoZW4gZmlsZSBlbHNlICcuJylcbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKG91dHB1dCkgLT5cbiAgICAgIGlmIG91dHB1dCBpc250IGZhbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZFN1Y2Nlc3MgXCJBZGRlZCAje2ZpbGUgPyAnYWxsIGZpbGVzJ31cIlxuICAgIC5jYXRjaCAobXNnKSAtPiBub3RpZmllci5hZGRFcnJvciBtc2dcblxuICBnZXRSZXBvOiAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICBnZXRSZXBvRm9yQ3VycmVudEZpbGUoKS50aGVuIChyZXBvKSAtPiByZXNvbHZlKHJlcG8pXG4gICAgICAuY2F0Y2ggKGUpIC0+XG4gICAgICAgIHJlcG9zID0gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpLmZpbHRlciAocikgLT4gcj9cbiAgICAgICAgaWYgcmVwb3MubGVuZ3RoIGlzIDBcbiAgICAgICAgICByZWplY3QoXCJObyByZXBvcyBmb3VuZFwiKVxuICAgICAgICBlbHNlIGlmIHJlcG9zLmxlbmd0aCA+IDFcbiAgICAgICAgICByZXNvbHZlKG5ldyBSZXBvTGlzdFZpZXcocmVwb3MpLnJlc3VsdClcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHJlc29sdmUocmVwb3NbMF0pXG5cbiAgZ2V0UmVwb0ZvclBhdGg6IChwYXRoKSAtPlxuICAgIGlmIG5vdCBwYXRoP1xuICAgICAgUHJvbWlzZS5yZWplY3QgXCJObyBmaWxlIHRvIGZpbmQgcmVwb3NpdG9yeSBmb3JcIlxuICAgIGVsc2VcbiAgICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAgIHJlcG9Qcm9taXNlcyA9XG4gICAgICAgICAgYXRvbS5wcm9qZWN0LmdldERpcmVjdG9yaWVzKClcbiAgICAgICAgICAubWFwKGF0b20ucHJvamVjdC5yZXBvc2l0b3J5Rm9yRGlyZWN0b3J5LmJpbmQoYXRvbS5wcm9qZWN0KSlcbiAgICAgICAgICBcbiAgICAgICAgUHJvbWlzZS5hbGwocmVwb1Byb21pc2VzKS50aGVuIChyZXBvcykgLT5cbiAgICAgICAgICByZXBvcy5mb3JFYWNoIChyZXBvKSAtPlxuICAgICAgICAgICAgaWYgKG5ldyBEaXJlY3RvcnkocmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpKS5jb250YWlucyBwYXRoXG4gICAgICAgICAgICAgIHN1Ym1vZHVsZSA9IHJlcG8/LnJlcG8uc3VibW9kdWxlRm9yUGF0aChwYXRoKVxuICAgICAgICAgICAgICBpZiBzdWJtb2R1bGU/IHRoZW4gcmVzb2x2ZShzdWJtb2R1bGUpIGVsc2UgcmVzb2x2ZShyZXBvKVxuXG4gIGdldFN1Ym1vZHVsZTogKHBhdGgpIC0+XG4gICAgcGF0aCA/PSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKVxuICAgIGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5maWx0ZXIoKHIpIC0+XG4gICAgICByPy5yZXBvPy5zdWJtb2R1bGVGb3JQYXRoIHBhdGhcbiAgICApWzBdPy5yZXBvPy5zdWJtb2R1bGVGb3JQYXRoIHBhdGhcblxuICBkaXI6IChhbmRTdWJtb2R1bGVzPXRydWUpIC0+XG4gICAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgIGlmIGFuZFN1Ym1vZHVsZXMgYW5kIHN1Ym1vZHVsZSA9IGdpdC5nZXRTdWJtb2R1bGUoKVxuICAgICAgICByZXNvbHZlKHN1Ym1vZHVsZS5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICBlbHNlXG4gICAgICAgIGdpdC5nZXRSZXBvKCkudGhlbiAocmVwbykgLT4gcmVzb2x2ZShyZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiJdfQ==
