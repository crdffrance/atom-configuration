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
              if ((repo != null) && (new Directory(repo.getWorkingDirectory())).contains(path)) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvZ2l0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLE1BQStCLE9BQUEsQ0FBUSxNQUFSLENBQS9CLEVBQUMscUNBQUQsRUFBa0I7O0VBRWxCLFlBQUEsR0FBZSxPQUFBLENBQVEsd0JBQVI7O0VBQ2YsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUVYLGlCQUFBLEdBQW9CLFNBQUMsSUFBRCxFQUFPLFlBQVA7QUFDbEIsUUFBQTs7TUFEeUIsZUFBYTs7SUFDdEMsSUFBQSxHQUFPLENBQUMsVUFBRCxFQUFhLElBQWIsRUFBbUIsb0JBQW5CO1dBQ1AsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUFkLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQ0osWUFBWSxDQUFDLE1BQWIsQ0FBb0Isa0JBQUEsQ0FBbUIsSUFBbkIsQ0FBcEI7SUFESSxDQUROO0VBRmtCOztFQU1wQixTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNWLFFBQUE7SUFEa0Isd0JBQUQsTUFBUztJQUMxQixJQUFhLElBQUEsS0FBUSxFQUFyQjtBQUFBLGFBQU8sR0FBUDs7SUFDQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLENBQWlCOzs7QUFDbkI7V0FBQSxpREFBQTs7cUJBQ0g7VUFBQyxNQUFBLElBQUQ7VUFBTyxRQUFBLE1BQVA7VUFBZSxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsR0FBRSxDQUFGLENBQTFCOztBQURHOzs7RUFISzs7RUFNWixrQkFBQSxHQUFxQixTQUFDLElBQUQ7SUFDbkIsSUFBYSxJQUFBLEtBQVEsRUFBckI7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QUFyRCxDQUFiO2dCQUNFLFNBQUEsa0JBQVksSUFBSSxDQUFFLElBQUksQ0FBQyxnQkFBWCxDQUE0QixJQUE1QjtnQkFDWixJQUFHLGlCQUFIO3lCQUFtQixPQUFBLENBQVEsU0FBUixFQUFuQjtpQkFBQSxNQUFBO3lCQUEyQyxPQUFBLENBQVEsSUFBUixFQUEzQztpQkFGRjs7WUFEWSxDQUFkO1VBRDZCLENBQS9CO1FBTFUsQ0FBUixFQUhOOztJQURjLENBdEZoQjtJQXFHQSxZQUFBLEVBQWMsU0FBQyxJQUFEO0FBQ1osVUFBQTs7UUFBQSxtRUFBNEMsQ0FBRSxPQUF0QyxDQUFBOzs7Ozt3REFHRSxDQUFFLGdCQUZaLENBRTZCLElBRjdCO0lBRlksQ0FyR2Q7SUEyR0EsR0FBQSxFQUFLLFNBQUMsYUFBRDs7UUFBQyxnQkFBYzs7YUFDZCxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDVixjQUFBO1VBQUEsSUFBRyxhQUFBLElBQWtCLENBQUEsU0FBQSxHQUFZLEdBQUcsQ0FBQyxZQUFKLENBQUEsQ0FBWixDQUFyQjttQkFDRSxPQUFBLENBQVEsU0FBUyxDQUFDLG1CQUFWLENBQUEsQ0FBUixFQURGO1dBQUEsTUFBQTttQkFHRSxHQUFHLENBQUMsT0FBSixDQUFBLENBQWEsQ0FBQyxJQUFkLENBQW1CLFNBQUMsSUFBRDtxQkFBVSxPQUFBLENBQVEsSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBUjtZQUFWLENBQW5CLEVBSEY7O1FBRFU7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVI7SUFERCxDQTNHTDs7QUEzQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJPcyA9IHJlcXVpcmUgJ29zJ1xue0J1ZmZlcmVkUHJvY2VzcywgRGlyZWN0b3J5fSA9IHJlcXVpcmUgJ2F0b20nXG5cblJlcG9MaXN0VmlldyA9IHJlcXVpcmUgJy4vdmlld3MvcmVwby1saXN0LXZpZXcnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4vbm90aWZpZXInXG5cbmdpdFVudHJhY2tlZEZpbGVzID0gKHJlcG8sIGRhdGFVbnN0YWdlZD1bXSkgLT5cbiAgYXJncyA9IFsnbHMtZmlsZXMnLCAnLW8nLCAnLS1leGNsdWRlLXN0YW5kYXJkJ11cbiAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT5cbiAgICBkYXRhVW5zdGFnZWQuY29uY2F0KF9wcmV0dGlmeVVudHJhY2tlZChkYXRhKSlcblxuX3ByZXR0aWZ5ID0gKGRhdGEsIHtzdGFnZWR9PXt9KSAtPlxuICByZXR1cm4gW10gaWYgZGF0YSBpcyAnJ1xuICBkYXRhID0gZGF0YS5zcGxpdCgvXFwwLylbLi4uLTFdXG4gIFtdID0gZm9yIG1vZGUsIGkgaW4gZGF0YSBieSAyXG4gICAge21vZGUsIHN0YWdlZCwgcGF0aDogZGF0YVtpKzFdfVxuXG5fcHJldHRpZnlVbnRyYWNrZWQgPSAoZGF0YSkgLT5cbiAgcmV0dXJuIFtdIGlmIGRhdGEgaXMgJydcbiAgZGF0YSA9IGRhdGEuc3BsaXQoL1xcbi8pLmZpbHRlciAoZCkgLT4gZCBpc250ICcnXG4gIGRhdGEubWFwIChmaWxlKSAtPiB7bW9kZTogJz8nLCBwYXRoOiBmaWxlfVxuXG5fcHJldHRpZnlEaWZmID0gKGRhdGEpIC0+XG4gIGRhdGEgPSBkYXRhLnNwbGl0KC9eQEAoPz1bIFxcLVxcK1xcLDAtOV0qQEApL2dtKVxuICBkYXRhWzEuLmRhdGEubGVuZ3RoXSA9ICgnQEAnICsgbGluZSBmb3IgbGluZSBpbiBkYXRhWzEuLl0pXG4gIGRhdGFcblxuZ2V0UmVwb0ZvckN1cnJlbnRGaWxlID0gLT5cbiAgbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICBwcm9qZWN0ID0gYXRvbS5wcm9qZWN0XG4gICAgcGF0aCA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpXG4gICAgZGlyZWN0b3J5ID0gcHJvamVjdC5nZXREaXJlY3RvcmllcygpLmZpbHRlcigoZCkgLT4gZC5jb250YWlucyhwYXRoKSlbMF1cbiAgICBpZiBkaXJlY3Rvcnk/XG4gICAgICBwcm9qZWN0LnJlcG9zaXRvcnlGb3JEaXJlY3RvcnkoZGlyZWN0b3J5KS50aGVuIChyZXBvKSAtPlxuICAgICAgICBzdWJtb2R1bGUgPSByZXBvLnJlcG8uc3VibW9kdWxlRm9yUGF0aChwYXRoKVxuICAgICAgICBpZiBzdWJtb2R1bGU/IHRoZW4gcmVzb2x2ZShzdWJtb2R1bGUpIGVsc2UgcmVzb2x2ZShyZXBvKVxuICAgICAgLmNhdGNoIChlKSAtPlxuICAgICAgICByZWplY3QoZSlcbiAgICBlbHNlXG4gICAgICByZWplY3QgXCJubyBjdXJyZW50IGZpbGVcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IGdpdCA9XG4gIGNtZDogKGFyZ3MsIG9wdGlvbnM9eyBlbnY6IHByb2Nlc3MuZW52fSwge2NvbG9yfT17fSkgLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgb3V0cHV0ID0gJydcbiAgICAgIGFyZ3MgPSBbJy1jJywgJ2NvbG9yLnVpPWFsd2F5cyddLmNvbmNhdChhcmdzKSBpZiBjb2xvclxuICAgICAgcHJvY2VzcyA9IG5ldyBCdWZmZXJlZFByb2Nlc3NcbiAgICAgICAgY29tbWFuZDogYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLmdpdFBhdGgnKSA/ICdnaXQnXG4gICAgICAgIGFyZ3M6IGFyZ3NcbiAgICAgICAgb3B0aW9uczogb3B0aW9uc1xuICAgICAgICBzdGRvdXQ6IChkYXRhKSAtPiBvdXRwdXQgKz0gZGF0YS50b1N0cmluZygpXG4gICAgICAgIHN0ZGVycjogKGRhdGEpIC0+XG4gICAgICAgICAgb3V0cHV0ICs9IGRhdGEudG9TdHJpbmcoKVxuICAgICAgICBleGl0OiAoY29kZSkgLT5cbiAgICAgICAgICBpZiBjb2RlIGlzIDBcbiAgICAgICAgICAgIHJlc29sdmUgb3V0cHV0XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgcmVqZWN0IG91dHB1dFxuICAgICAgcHJvY2Vzcy5vbldpbGxUaHJvd0Vycm9yIChlcnJvck9iamVjdCkgLT5cbiAgICAgICAgbm90aWZpZXIuYWRkRXJyb3IgJ0dpdCBQbHVzIGlzIHVuYWJsZSB0byBsb2NhdGUgdGhlIGdpdCBjb21tYW5kLiBQbGVhc2UgZW5zdXJlIHByb2Nlc3MuZW52LlBBVEggY2FuIGFjY2VzcyBnaXQuJ1xuICAgICAgICByZWplY3QgXCJDb3VsZG4ndCBmaW5kIGdpdFwiXG5cbiAgZ2V0Q29uZmlnOiAocmVwbywgc2V0dGluZykgLT4gcmVwby5nZXRDb25maWdWYWx1ZSBzZXR0aW5nLCByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKVxuXG4gIHJlc2V0OiAocmVwbykgLT5cbiAgICBnaXQuY21kKFsncmVzZXQnLCAnSEVBRCddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKS50aGVuICgpIC0+IG5vdGlmaWVyLmFkZFN1Y2Nlc3MgJ0FsbCBjaGFuZ2VzIHVuc3RhZ2VkJ1xuXG4gIHN0YXR1czogKHJlcG8pIC0+XG4gICAgZ2l0LmNtZChbJ3N0YXR1cycsICctLXBvcmNlbGFpbicsICcteiddLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPiBpZiBkYXRhLmxlbmd0aCA+IDIgdGhlbiBkYXRhLnNwbGl0KCdcXDAnKVsuLi4tMV0gZWxzZSBbXVxuXG4gIHJlZnJlc2g6IChyZXBvKSAtPlxuICAgIGlmIHJlcG9cbiAgICAgIHJlcG8ucmVmcmVzaFN0YXR1cz8oKVxuICAgICAgcmVwby5yZWZyZXNoSW5kZXg/KClcbiAgICBlbHNlXG4gICAgICBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKCkuZm9yRWFjaCAocmVwbykgLT4gcmVwby5yZWZyZXNoU3RhdHVzKCkgaWYgcmVwbz9cblxuICByZWxhdGl2aXplOiAocGF0aCkgLT5cbiAgICBnaXQuZ2V0U3VibW9kdWxlKHBhdGgpPy5yZWxhdGl2aXplKHBhdGgpID8gYXRvbS5wcm9qZWN0LmdldFJlcG9zaXRvcmllcygpWzBdPy5yZWxhdGl2aXplKHBhdGgpID8gcGF0aFxuXG4gIGRpZmY6IChyZXBvLCBwYXRoKSAtPlxuICAgIGdpdC5jbWQoWydkaWZmJywgJy1wJywgJy1VMScsIHBhdGhdLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPiBfcHJldHRpZnlEaWZmKGRhdGEpXG5cbiAgc3RhZ2VkRmlsZXM6IChyZXBvKSAtPlxuICAgIGFyZ3MgPSBbJ2RpZmYtaW5kZXgnLCAnLS1jYWNoZWQnLCAnSEVBRCcsICctLW5hbWUtc3RhdHVzJywgJy16J11cbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBfcHJldHRpZnkgZGF0YSwgc3RhZ2VkOiB0cnVlXG4gICAgLmNhdGNoIChlcnJvcikgLT5cbiAgICAgIGlmIGVycm9yLmluY2x1ZGVzIFwiYW1iaWd1b3VzIGFyZ3VtZW50ICdIRUFEJ1wiXG4gICAgICAgIFByb21pc2UucmVzb2x2ZSBbMV1cbiAgICAgIGVsc2VcbiAgICAgICAgbm90aWZpZXIuYWRkRXJyb3IgZXJyb3JcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlIFtdXG5cbiAgdW5zdGFnZWRGaWxlczogKHJlcG8sIHtzaG93VW50cmFja2VkfT17fSkgLT5cbiAgICBhcmdzID0gWydkaWZmLWZpbGVzJywgJy0tbmFtZS1zdGF0dXMnLCAnLXonXVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT5cbiAgICAgIGlmIHNob3dVbnRyYWNrZWRcbiAgICAgICAgZ2l0VW50cmFja2VkRmlsZXMocmVwbywgX3ByZXR0aWZ5KGRhdGEsIHN0YWdlZDogZmFsc2UpKVxuICAgICAgZWxzZVxuICAgICAgICBfcHJldHRpZnkoZGF0YSwgc3RhZ2VkOiBmYWxzZSlcblxuICBhZGQ6IChyZXBvLCB7ZmlsZSwgdXBkYXRlfT17fSkgLT5cbiAgICBhcmdzID0gWydhZGQnXVxuICAgIGlmIHVwZGF0ZSB0aGVuIGFyZ3MucHVzaCAnLS11cGRhdGUnIGVsc2UgYXJncy5wdXNoICctLWFsbCdcbiAgICBhcmdzLnB1c2goaWYgZmlsZSB0aGVuIGZpbGUgZWxzZSAnLicpXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChvdXRwdXQpIC0+XG4gICAgICBpZiBvdXRwdXQgaXNudCBmYWxzZVxuICAgICAgICBub3RpZmllci5hZGRTdWNjZXNzIFwiQWRkZWQgI3tmaWxlID8gJ2FsbCBmaWxlcyd9XCJcbiAgICAuY2F0Y2ggKG1zZykgLT4gbm90aWZpZXIuYWRkRXJyb3IgbXNnXG5cbiAgZ2V0UmVwbzogLT5cbiAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgZ2V0UmVwb0ZvckN1cnJlbnRGaWxlKCkudGhlbiAocmVwbykgLT4gcmVzb2x2ZShyZXBvKVxuICAgICAgLmNhdGNoIChlKSAtPlxuICAgICAgICByZXBvcyA9IGF0b20ucHJvamVjdC5nZXRSZXBvc2l0b3JpZXMoKS5maWx0ZXIgKHIpIC0+IHI/XG4gICAgICAgIGlmIHJlcG9zLmxlbmd0aCBpcyAwXG4gICAgICAgICAgcmVqZWN0KFwiTm8gcmVwb3MgZm91bmRcIilcbiAgICAgICAgZWxzZSBpZiByZXBvcy5sZW5ndGggPiAxXG4gICAgICAgICAgcmVzb2x2ZShuZXcgUmVwb0xpc3RWaWV3KHJlcG9zKS5yZXN1bHQpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICByZXNvbHZlKHJlcG9zWzBdKVxuXG4gIGdldFJlcG9Gb3JQYXRoOiAocGF0aCkgLT5cbiAgICBpZiBub3QgcGF0aD9cbiAgICAgIFByb21pc2UucmVqZWN0IFwiTm8gZmlsZSB0byBmaW5kIHJlcG9zaXRvcnkgZm9yXCJcbiAgICBlbHNlXG4gICAgICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgICAgICByZXBvUHJvbWlzZXMgPVxuICAgICAgICAgIGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpXG4gICAgICAgICAgLm1hcChhdG9tLnByb2plY3QucmVwb3NpdG9yeUZvckRpcmVjdG9yeS5iaW5kKGF0b20ucHJvamVjdCkpXG5cbiAgICAgICAgUHJvbWlzZS5hbGwocmVwb1Byb21pc2VzKS50aGVuIChyZXBvcykgLT5cbiAgICAgICAgICByZXBvcy5mb3JFYWNoIChyZXBvKSAtPlxuICAgICAgICAgICAgaWYgcmVwbz8gYW5kIChuZXcgRGlyZWN0b3J5KHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKSkuY29udGFpbnMgcGF0aFxuICAgICAgICAgICAgICBzdWJtb2R1bGUgPSByZXBvPy5yZXBvLnN1Ym1vZHVsZUZvclBhdGgocGF0aClcbiAgICAgICAgICAgICAgaWYgc3VibW9kdWxlPyB0aGVuIHJlc29sdmUoc3VibW9kdWxlKSBlbHNlIHJlc29sdmUocmVwbylcblxuICBnZXRTdWJtb2R1bGU6IChwYXRoKSAtPlxuICAgIHBhdGggPz0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKClcbiAgICBhdG9tLnByb2plY3QuZ2V0UmVwb3NpdG9yaWVzKCkuZmlsdGVyKChyKSAtPlxuICAgICAgcj8ucmVwbz8uc3VibW9kdWxlRm9yUGF0aCBwYXRoXG4gICAgKVswXT8ucmVwbz8uc3VibW9kdWxlRm9yUGF0aCBwYXRoXG5cbiAgZGlyOiAoYW5kU3VibW9kdWxlcz10cnVlKSAtPlxuICAgIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICBpZiBhbmRTdWJtb2R1bGVzIGFuZCBzdWJtb2R1bGUgPSBnaXQuZ2V0U3VibW9kdWxlKClcbiAgICAgICAgcmVzb2x2ZShzdWJtb2R1bGUuZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgZWxzZVxuICAgICAgICBnaXQuZ2V0UmVwbygpLnRoZW4gKHJlcG8pIC0+IHJlc29sdmUocmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4iXX0=
