(function() {
  var $$, GitDiff, Path, SelectListView, StatusListView, fs, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  fs = require('fs-plus');

  Path = require('path');

  git = require('../git');

  GitDiff = require('../models/git-diff');

  notifier = require('../notifier');

  module.exports = StatusListView = (function(superClass) {
    extend(StatusListView, superClass);

    function StatusListView() {
      return StatusListView.__super__.constructor.apply(this, arguments);
    }

    StatusListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      StatusListView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(this.parseData(this.data));
      return this.focusFilterEditor();
    };

    StatusListView.prototype.parseData = function(files) {
      var i, len, line, results;
      results = [];
      for (i = 0, len = files.length; i < len; i++) {
        line = files[i];
        if (!(/^([ MADRCU?!]{2})\s{1}(.*)/.test(line))) {
          continue;
        }
        line = line.match(/^([ MADRCU?!]{2})\s{1}(.*)/);
        results.push({
          type: line[1],
          path: line[2]
        });
      }
      return results;
    };

    StatusListView.prototype.getFilterKey = function() {
      return 'path';
    };

    StatusListView.prototype.getEmptyMessage = function() {
      return "Nothing to commit, working directory clean.";
    };

    StatusListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    StatusListView.prototype.cancelled = function() {
      return this.hide();
    };

    StatusListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    StatusListView.prototype.viewForItem = function(arg) {
      var getIcon, path, type;
      type = arg.type, path = arg.path;
      getIcon = function(s) {
        if (s[0] === 'A') {
          return 'status-added icon icon-diff-added';
        }
        if (s[0] === 'D') {
          return 'status-removed icon icon-diff-removed';
        }
        if (s[0] === 'R') {
          return 'status-renamed icon icon-diff-renamed';
        }
        if (s[0] === 'M' || s[1] === 'M') {
          return 'status-modified icon icon-diff-modified';
        }
        return '';
      };
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right highlight',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, type);
            _this.span({
              "class": getIcon(type)
            });
            return _this.span(path);
          };
        })(this));
      });
    };

    StatusListView.prototype.confirmed = function(arg) {
      var fullPath, openFile, path, type;
      type = arg.type, path = arg.path;
      this.cancel();
      if (type === '??') {
        return git.add(this.repo, {
          file: path
        });
      } else {
        openFile = confirm("Open " + path + "?");
        fullPath = Path.join(this.repo.getWorkingDirectory(), path);
        return fs.stat(fullPath, (function(_this) {
          return function(err, stat) {
            var isDirectory;
            if (err) {
              return notifier.addError(err.message);
            } else {
              isDirectory = stat != null ? stat.isDirectory() : void 0;
              if (openFile) {
                if (isDirectory) {
                  return atom.open({
                    pathsToOpen: fullPath,
                    newWindow: true
                  });
                } else {
                  return atom.workspace.open(fullPath);
                }
              } else {
                return GitDiff(_this.repo, {
                  file: path
                });
              }
            }
          };
        })(this));
      }
    };

    return StatusListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc3RhdHVzLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlFQUFBO0lBQUE7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFDTCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixPQUFBLEdBQVUsT0FBQSxDQUFRLG9CQUFSOztFQUNWLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OzZCQUNKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxJQUFSO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsT0FBRDtNQUNsQixnREFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsSUFBQyxDQUFBLFNBQUQsQ0FBVyxJQUFDLENBQUEsSUFBWixDQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFKVTs7NkJBTVosU0FBQSxHQUFXLFNBQUMsS0FBRDtBQUNULFVBQUE7QUFBQTtXQUFBLHVDQUFBOztjQUF1Qiw0QkFBNEIsQ0FBQyxJQUE3QixDQUFrQyxJQUFsQzs7O1FBQ3JCLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLDRCQUFYO3FCQUNQO1VBQUMsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLENBQVo7VUFBZ0IsSUFBQSxFQUFNLElBQUssQ0FBQSxDQUFBLENBQTNCOztBQUZGOztJQURTOzs2QkFLWCxZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7OzZCQUVkLGVBQUEsR0FBaUIsU0FBQTthQUFHO0lBQUg7OzZCQUVqQixJQUFBLEdBQU0sU0FBQTs7UUFDSixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBSEk7OzZCQUtOLFNBQUEsR0FBVyxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQUFIOzs2QkFFWCxJQUFBLEdBQU0sU0FBQTtBQUFHLFVBQUE7K0NBQU0sQ0FBRSxPQUFSLENBQUE7SUFBSDs7NkJBRU4sV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxpQkFBTTtNQUNuQixPQUFBLEdBQVUsU0FBQyxDQUFEO1FBQ1IsSUFBOEMsQ0FBRSxDQUFBLENBQUEsQ0FBRixLQUFRLEdBQXREO0FBQUEsaUJBQU8sb0NBQVA7O1FBQ0EsSUFBa0QsQ0FBRSxDQUFBLENBQUEsQ0FBRixLQUFRLEdBQTFEO0FBQUEsaUJBQU8sd0NBQVA7O1FBQ0EsSUFBa0QsQ0FBRSxDQUFBLENBQUEsQ0FBRixLQUFRLEdBQTFEO0FBQUEsaUJBQU8sd0NBQVA7O1FBQ0EsSUFBb0QsQ0FBRSxDQUFBLENBQUEsQ0FBRixLQUFRLEdBQVIsSUFBZSxDQUFFLENBQUEsQ0FBQSxDQUFGLEtBQVEsR0FBM0U7QUFBQSxpQkFBTywwQ0FBUDs7QUFDQSxlQUFPO01BTEM7YUFPVixFQUFBLENBQUcsU0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUNGLEtBQUMsQ0FBQSxHQUFELENBQ0U7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHNCQUFQO2NBQ0EsS0FBQSxFQUFPLCtDQURQO2FBREYsRUFHRSxJQUhGO1lBSUEsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sT0FBQSxDQUFRLElBQVIsQ0FBUDthQUFOO21CQUNBLEtBQUMsQ0FBQSxJQUFELENBQU0sSUFBTjtVQU5FO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFKO01BREMsQ0FBSDtJQVJXOzs2QkFpQmIsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxpQkFBTTtNQUNqQixJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBRyxJQUFBLEtBQVEsSUFBWDtlQUNFLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBQyxDQUFBLElBQVQsRUFBZTtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQWYsRUFERjtPQUFBLE1BQUE7UUFHRSxRQUFBLEdBQVcsT0FBQSxDQUFRLE9BQUEsR0FBUSxJQUFSLEdBQWEsR0FBckI7UUFDWCxRQUFBLEdBQVcsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBVixFQUF1QyxJQUF2QztlQUVYLEVBQUUsQ0FBQyxJQUFILENBQVEsUUFBUixFQUFrQixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLEdBQUQsRUFBTSxJQUFOO0FBQ2hCLGdCQUFBO1lBQUEsSUFBRyxHQUFIO3FCQUNFLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQUcsQ0FBQyxPQUF0QixFQURGO2FBQUEsTUFBQTtjQUdFLFdBQUEsa0JBQWMsSUFBSSxDQUFFLFdBQU4sQ0FBQTtjQUNkLElBQUcsUUFBSDtnQkFDRSxJQUFHLFdBQUg7eUJBQ0UsSUFBSSxDQUFDLElBQUwsQ0FBVTtvQkFBQSxXQUFBLEVBQWEsUUFBYjtvQkFBdUIsU0FBQSxFQUFXLElBQWxDO21CQUFWLEVBREY7aUJBQUEsTUFBQTt5QkFHRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsUUFBcEIsRUFIRjtpQkFERjtlQUFBLE1BQUE7dUJBTUUsT0FBQSxDQUFRLEtBQUMsQ0FBQSxJQUFULEVBQWU7a0JBQUEsSUFBQSxFQUFNLElBQU47aUJBQWYsRUFORjtlQUpGOztVQURnQjtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbEIsRUFORjs7SUFGUzs7OztLQTFDZ0I7QUFSN0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5HaXREaWZmID0gcmVxdWlyZSAnLi4vbW9kZWxzL2dpdC1kaWZmJ1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgU3RhdHVzTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICBpbml0aWFsaXplOiAoQHJlcG8sIEBkYXRhKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBzZXRJdGVtcyBAcGFyc2VEYXRhIEBkYXRhXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBwYXJzZURhdGE6IChmaWxlcykgLT5cbiAgICBmb3IgbGluZSBpbiBmaWxlcyB3aGVuIC9eKFsgTUFEUkNVPyFdezJ9KVxcc3sxfSguKikvLnRlc3QgbGluZVxuICAgICAgbGluZSA9IGxpbmUubWF0Y2ggL14oWyBNQURSQ1U/IV17Mn0pXFxzezF9KC4qKS9cbiAgICAgIHt0eXBlOiBsaW5lWzFdLCBwYXRoOiBsaW5lWzJdfVxuXG4gIGdldEZpbHRlcktleTogLT4gJ3BhdGgnXG5cbiAgZ2V0RW1wdHlNZXNzYWdlOiAtPiBcIk5vdGhpbmcgdG8gY29tbWl0LCB3b3JraW5nIGRpcmVjdG9yeSBjbGVhbi5cIlxuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7dHlwZSwgcGF0aH0pIC0+XG4gICAgZ2V0SWNvbiA9IChzKSAtPlxuICAgICAgcmV0dXJuICdzdGF0dXMtYWRkZWQgaWNvbiBpY29uLWRpZmYtYWRkZWQnIGlmIHNbMF0gaXMgJ0EnXG4gICAgICByZXR1cm4gJ3N0YXR1cy1yZW1vdmVkIGljb24gaWNvbi1kaWZmLXJlbW92ZWQnIGlmIHNbMF0gaXMgJ0QnXG4gICAgICByZXR1cm4gJ3N0YXR1cy1yZW5hbWVkIGljb24gaWNvbi1kaWZmLXJlbmFtZWQnIGlmIHNbMF0gaXMgJ1InXG4gICAgICByZXR1cm4gJ3N0YXR1cy1tb2RpZmllZCBpY29uIGljb24tZGlmZi1tb2RpZmllZCcgaWYgc1swXSBpcyAnTScgb3Igc1sxXSBpcyAnTSdcbiAgICAgIHJldHVybiAnJ1xuXG4gICAgJCQgLT5cbiAgICAgIEBsaSA9PlxuICAgICAgICBAZGl2XG4gICAgICAgICAgY2xhc3M6ICdwdWxsLXJpZ2h0IGhpZ2hsaWdodCdcbiAgICAgICAgICBzdHlsZTogJ3doaXRlLXNwYWNlOiBwcmUtd3JhcDsgZm9udC1mYW1pbHk6IG1vbm9zcGFjZSdcbiAgICAgICAgICB0eXBlXG4gICAgICAgIEBzcGFuIGNsYXNzOiBnZXRJY29uKHR5cGUpXG4gICAgICAgIEBzcGFuIHBhdGhcblxuICBjb25maXJtZWQ6ICh7dHlwZSwgcGF0aH0pIC0+XG4gICAgQGNhbmNlbCgpXG4gICAgaWYgdHlwZSBpcyAnPz8nXG4gICAgICBnaXQuYWRkIEByZXBvLCBmaWxlOiBwYXRoXG4gICAgZWxzZVxuICAgICAgb3BlbkZpbGUgPSBjb25maXJtKFwiT3BlbiAje3BhdGh9P1wiKVxuICAgICAgZnVsbFBhdGggPSBQYXRoLmpvaW4oQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpLCBwYXRoKVxuXG4gICAgICBmcy5zdGF0IGZ1bGxQYXRoLCAoZXJyLCBzdGF0KSA9PlxuICAgICAgICBpZiBlcnJcbiAgICAgICAgICBub3RpZmllci5hZGRFcnJvcihlcnIubWVzc2FnZSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGlzRGlyZWN0b3J5ID0gc3RhdD8uaXNEaXJlY3RvcnkoKVxuICAgICAgICAgIGlmIG9wZW5GaWxlXG4gICAgICAgICAgICBpZiBpc0RpcmVjdG9yeVxuICAgICAgICAgICAgICBhdG9tLm9wZW4ocGF0aHNUb09wZW46IGZ1bGxQYXRoLCBuZXdXaW5kb3c6IHRydWUpXG4gICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZnVsbFBhdGgpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgR2l0RGlmZihAcmVwbywgZmlsZTogcGF0aClcbiJdfQ==
