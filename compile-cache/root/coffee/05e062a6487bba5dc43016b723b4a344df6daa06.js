(function() {
  var $, $$, SelectListMultipleView, SelectStageHunks, fs, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs-plus');

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageHunks = (function(superClass) {
    extend(SelectStageHunks, superClass);

    function SelectStageHunks() {
      return SelectStageHunks.__super__.constructor.apply(this, arguments);
    }

    SelectStageHunks.prototype.initialize = function(repo, data) {
      this.repo = repo;
      SelectStageHunks.__super__.initialize.apply(this, arguments);
      this.patch_header = data[0];
      if (data.length === 2) {
        return this.completed(this._generateObjects(data.slice(1)));
      }
      this.show();
      this.setItems(this._generateObjects(data.slice(1)));
      return this.focusFilterEditor();
    };

    SelectStageHunks.prototype.getFilterKey = function() {
      return 'pos';
    };

    SelectStageHunks.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-stage-button'
              }, 'Stage');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-stage-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageHunks.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageHunks.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageHunks.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    SelectStageHunks.prototype.viewForItem = function(item, matchedStr) {
      var viewItem;
      return viewItem = $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'inline-block highlight'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.pos);
              }
            });
            return _this.div({
              "class": 'text-warning gp-item-diff',
              style: 'white-space: pre-wrap; font-family: monospace'
            }, item.diff);
          };
        })(this));
      });
    };

    SelectStageHunks.prototype.completed = function(items) {
      var patchPath, patch_full;
      this.cancel();
      if (items.length < 1) {
        return;
      }
      patch_full = this.patch_header;
      items.forEach(function(item) {
        return patch_full += (item != null ? item.patch : void 0);
      });
      patchPath = this.repo.getWorkingDirectory() + '/GITPLUS_PATCH';
      return fs.writeFile(patchPath, patch_full, {
        flag: 'w+'
      }, (function(_this) {
        return function(err) {
          if (!err) {
            return git.cmd(['apply', '--cached', '--', patchPath], {
              cwd: _this.repo.getWorkingDirectory()
            }).then(function(data) {
              data = (data != null) && data !== '' ? data : 'Hunk has been staged!';
              notifier.addSuccess(data);
              try {
                return fs.unlink(patchPath);
              } catch (error) {}
            });
          } else {
            return notifier.addError(err);
          }
        };
      })(this));
    };

    SelectStageHunks.prototype._generateObjects = function(data) {
      var hunk, hunkSplit, i, len, results;
      results = [];
      for (i = 0, len = data.length; i < len; i++) {
        hunk = data[i];
        if (!(hunk !== '')) {
          continue;
        }
        hunkSplit = hunk.match(/(@@[ \-\+\,0-9]*@@.*)\n([\s\S]*)/);
        results.push({
          pos: hunkSplit[1],
          diff: hunkSplit[2],
          patch: hunk
        });
      }
      return results;
    };

    return SelectStageHunks;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc2VsZWN0LXN0YWdlLWh1bmtzLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1RUFBQTtJQUFBOzs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBQ0wsTUFBVSxPQUFBLENBQVEsc0JBQVIsQ0FBVixFQUFDLFNBQUQsRUFBSTs7RUFFSixHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLHNCQUFBLEdBQXlCLE9BQUEsQ0FBUSw2QkFBUjs7RUFFekIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OzsrQkFDSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsSUFBUjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQ1gsa0RBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUssQ0FBQSxDQUFBO01BQ3JCLElBQWtELElBQUksQ0FBQyxNQUFMLEtBQWUsQ0FBakU7QUFBQSxlQUFPLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLGdCQUFELENBQWtCLElBQUssU0FBdkIsQ0FBWCxFQUFQOztNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixJQUFLLFNBQXZCLENBQVY7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQU5VOzsrQkFRWixZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7OytCQUVkLFVBQUEsR0FBWSxTQUFBO0FBQ1YsVUFBQTtNQUFBLFVBQUEsR0FBYSxFQUFBLENBQUcsU0FBQTtlQUNkLElBQUMsQ0FBQSxHQUFELENBQUs7VUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFNBQVA7U0FBTCxFQUF1QixDQUFBLFNB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LEVBQXdCLFVBQXhCLEVBQW9DO1FBQUEsSUFBQSxFQUFNLElBQU47T0FBcEMsRUFBZ0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7VUFDOUMsSUFBQSxDQUFPLEdBQVA7bUJBQ0UsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLE9BQUQsRUFBVSxVQUFWLEVBQXNCLElBQXRCLEVBQTRCLFNBQTVCLENBQVIsRUFBZ0Q7Y0FBQSxHQUFBLEVBQUssS0FBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7YUFBaEQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7Y0FDSixJQUFBLEdBQVUsY0FBQSxJQUFVLElBQUEsS0FBVSxFQUF2QixHQUErQixJQUEvQixHQUF5QztjQUNoRCxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFwQjtBQUNBO3VCQUFJLEVBQUUsQ0FBQyxNQUFILENBQVUsU0FBVixFQUFKO2VBQUE7WUFISSxDQUROLEVBREY7V0FBQSxNQUFBO21CQU9FLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQWxCLEVBUEY7O1FBRDhDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoRDtJQVRTOzsrQkFtQlgsZ0JBQUEsR0FBa0IsU0FBQyxJQUFEO0FBQ2hCLFVBQUE7QUFBQTtXQUFBLHNDQUFBOztjQUFzQixJQUFBLEtBQVU7OztRQUM5QixTQUFBLEdBQVksSUFBSSxDQUFDLEtBQUwsQ0FBVyxrQ0FBWDtxQkFDWjtVQUNFLEdBQUEsRUFBSyxTQUFVLENBQUEsQ0FBQSxDQURqQjtVQUVFLElBQUEsRUFBTSxTQUFVLENBQUEsQ0FBQSxDQUZsQjtVQUdFLEtBQUEsRUFBTyxJQUhUOztBQUZGOztJQURnQjs7OztLQTNEVztBQVIvQiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMtcGx1cydcbnskLCAkJH0gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblNlbGVjdExpc3RNdWx0aXBsZVZpZXcgPSByZXF1aXJlICcuL3NlbGVjdC1saXN0LW11bHRpcGxlLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNlbGVjdFN0YWdlSHVua3MgZXh0ZW5kcyBTZWxlY3RMaXN0TXVsdGlwbGVWaWV3XG4gIGluaXRpYWxpemU6IChAcmVwbywgZGF0YSkgLT5cbiAgICBzdXBlclxuICAgIEBwYXRjaF9oZWFkZXIgPSBkYXRhWzBdXG4gICAgcmV0dXJuIEBjb21wbGV0ZWQgQF9nZW5lcmF0ZU9iamVjdHMoZGF0YVsxLi5dKSBpZiBkYXRhLmxlbmd0aCBpcyAyXG4gICAgQHNob3coKVxuICAgIEBzZXRJdGVtcyBAX2dlbmVyYXRlT2JqZWN0cyhkYXRhWzEuLl0pXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICdwb3MnXG5cbiAgYWRkQnV0dG9uczogLT5cbiAgICB2aWV3QnV0dG9uID0gJCQgLT5cbiAgICAgIEBkaXYgY2xhc3M6ICdidXR0b25zJywgPT5cbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLWxlZnQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLWVycm9yIGlubGluZS1ibG9jay10aWdodCBidG4tY2FuY2VsLWJ1dHRvbicsICdDYW5jZWwnXG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tc3VjY2VzcyBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLXN0YWdlLWJ1dHRvbicsICdTdGFnZSdcbiAgICB2aWV3QnV0dG9uLmFwcGVuZFRvKHRoaXMpXG5cbiAgICBAb24gJ2NsaWNrJywgJ2J1dHRvbicsICh7dGFyZ2V0fSkgPT5cbiAgICAgIEBjb21wbGV0ZSgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLXN0YWdlLWJ1dHRvbicpXG4gICAgICBAY2FuY2VsKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tY2FuY2VsLWJ1dHRvbicpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0sIG1hdGNoZWRTdHIpIC0+XG4gICAgdmlld0l0ZW0gPSAkJCAtPlxuICAgICAgQGxpID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdpbmxpbmUtYmxvY2sgaGlnaGxpZ2h0JywgPT5cbiAgICAgICAgICBpZiBtYXRjaGVkU3RyPyB0aGVuIEByYXcobWF0Y2hlZFN0cikgZWxzZSBAc3BhbiBpdGVtLnBvc1xuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC13YXJuaW5nIGdwLWl0ZW0tZGlmZicsIHN0eWxlOiAnd2hpdGUtc3BhY2U6IHByZS13cmFwOyBmb250LWZhbWlseTogbW9ub3NwYWNlJywgaXRlbS5kaWZmXG5cbiAgY29tcGxldGVkOiAoaXRlbXMpIC0+XG4gICAgQGNhbmNlbCgpXG4gICAgcmV0dXJuIGlmIGl0ZW1zLmxlbmd0aCA8IDFcblxuICAgIHBhdGNoX2Z1bGwgPSBAcGF0Y2hfaGVhZGVyXG4gICAgaXRlbXMuZm9yRWFjaCAoaXRlbSkgLT5cbiAgICAgIHBhdGNoX2Z1bGwgKz0gKGl0ZW0/LnBhdGNoKVxuXG4gICAgcGF0Y2hQYXRoID0gQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpICsgJy9HSVRQTFVTX1BBVENIJ1xuICAgIGZzLndyaXRlRmlsZSBwYXRjaFBhdGgsIHBhdGNoX2Z1bGwsIGZsYWc6ICd3KycsIChlcnIpID0+XG4gICAgICB1bmxlc3MgZXJyXG4gICAgICAgIGdpdC5jbWQoWydhcHBseScsICctLWNhY2hlZCcsICctLScsIHBhdGNoUGF0aF0sIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgICAudGhlbiAoZGF0YSkgPT5cbiAgICAgICAgICBkYXRhID0gaWYgZGF0YT8gYW5kIGRhdGEgaXNudCAnJyB0aGVuIGRhdGEgZWxzZSAnSHVuayBoYXMgYmVlbiBzdGFnZWQhJ1xuICAgICAgICAgIG5vdGlmaWVyLmFkZFN1Y2Nlc3MoZGF0YSlcbiAgICAgICAgICB0cnkgZnMudW5saW5rIHBhdGNoUGF0aFxuICAgICAgZWxzZVxuICAgICAgICBub3RpZmllci5hZGRFcnJvciBlcnJcblxuICBfZ2VuZXJhdGVPYmplY3RzOiAoZGF0YSkgLT5cbiAgICBmb3IgaHVuayBpbiBkYXRhIHdoZW4gaHVuayBpc250ICcnXG4gICAgICBodW5rU3BsaXQgPSBodW5rLm1hdGNoIC8oQEBbIFxcLVxcK1xcLDAtOV0qQEAuKilcXG4oW1xcc1xcU10qKS9cbiAgICAgIHtcbiAgICAgICAgcG9zOiBodW5rU3BsaXRbMV1cbiAgICAgICAgZGlmZjogaHVua1NwbGl0WzJdXG4gICAgICAgIHBhdGNoOiBodW5rXG4gICAgICB9XG4iXX0=
