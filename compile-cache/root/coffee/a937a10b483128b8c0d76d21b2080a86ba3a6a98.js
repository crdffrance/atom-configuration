(function() {
  var $, $$, SelectListMultipleView, SelectStageFilesView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageFilesView = (function(superClass) {
    extend(SelectStageFilesView, superClass);

    function SelectStageFilesView() {
      return SelectStageFilesView.__super__.constructor.apply(this, arguments);
    }

    SelectStageFilesView.prototype.initialize = function(repo, items) {
      this.repo = repo;
      SelectStageFilesView.__super__.initialize.apply(this, arguments);
      this.selectedItems.push('foobar');
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    SelectStageFilesView.prototype.getFilterKey = function() {
      return 'path';
    };

    SelectStageFilesView.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'select-list-buttons'
        }, (function(_this) {
          return function() {
            _this.div(function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.div(function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-apply-button'
              }, 'Apply');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-apply-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageFilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageFilesView.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageFilesView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    SelectStageFilesView.prototype.viewForItem = function(item, matchedStr) {
      var classString;
      classString = item.staged ? 'active' : '';
      return $$(function() {
        return this.li({
          "class": classString
        }, (function(_this) {
          return function() {
            _this.div({
              "class": 'pull-right'
            }, function() {
              return _this.span({
                "class": 'inline-block highlight'
              }, item.mode);
            });
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item.path);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.confirmed = function(item, viewItem) {
      item.staged = !item.staged;
      return viewItem.toggleClass('active');
    };

    SelectStageFilesView.prototype.completed = function(_) {
      var stage, stagePromise, unstage, unstagePromise;
      stage = this.items.filter(function(item) {
        return item.staged;
      }).map(function(arg) {
        var path;
        path = arg.path;
        return path;
      });
      unstage = this.items.filter(function(item) {
        return !item.staged;
      }).map(function(arg) {
        var path;
        path = arg.path;
        return path;
      });
      stagePromise = stage.length > 0 ? git.cmd(['add', '-f'].concat(stage), {
        cwd: this.repo.getWorkingDirectory()
      }) : void 0;
      unstagePromise = unstage.length > 0 ? git.cmd(['reset', 'HEAD', '--'].concat(unstage), {
        cwd: this.repo.getWorkingDirectory()
      }) : void 0;
      Promise.all([stagePromise, unstagePromise]).then(function(data) {
        return notifier.addSuccess('Index updated successfully');
      })["catch"](notifier.addError);
      return this.cancel();
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc2VsZWN0LXN0YWdlLWZpbGVzLXZpZXctYmV0YS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVFQUFBO0lBQUE7OztFQUFBLE1BQVUsT0FBQSxDQUFRLHNCQUFSLENBQVYsRUFBQyxTQUFELEVBQUk7O0VBRUosR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVI7O0VBRXpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7bUNBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLEtBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUNYLHNEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsYUFBYSxDQUFDLElBQWYsQ0FBb0IsUUFBcEI7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFMVTs7bUNBT1osWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOzttQ0FFZCxVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxVQUFBLEdBQWEsRUFBQSxDQUFHLFNBQUE7ZUFDZCxJQUFDLENBQUEsR0FBRCxDQUFLO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxxQkFBUDtTQUFMLEVBQW1DLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDakMsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBO3FCQUNILEtBQUMsQ0FBQSxNQUFELENBQVE7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxvREFBUDtlQUFSLEVBQXFFLFFBQXJFO1lBREcsQ0FBTDttQkFFQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUE7cUJB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R0FBMEIsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLEtBQUQsRUFBUSxJQUFSLENBQWEsQ0FBQyxNQUFkLENBQXFCLEtBQXJCLENBQVIsRUFBcUM7UUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7T0FBckMsQ0FBMUIsR0FBQTtNQUNmLGNBQUEsR0FBb0IsT0FBTyxDQUFDLE1BQVIsR0FBaUIsQ0FBcEIsR0FBMkIsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLE9BQUQsRUFBVSxNQUFWLEVBQWtCLElBQWxCLENBQXVCLENBQUMsTUFBeEIsQ0FBK0IsT0FBL0IsQ0FBUixFQUFpRDtRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUFqRCxDQUEzQixHQUFBO01BQ2pCLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBQyxZQUFELEVBQWUsY0FBZixDQUFaLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2VBQVUsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsNEJBQXBCO01BQVYsQ0FETixDQUVBLEVBQUMsS0FBRCxFQUZBLENBRU8sUUFBUSxDQUFDLFFBRmhCO2FBR0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQVJTOzs7O0tBNUNzQjtBQVBuQyIsInNvdXJjZXNDb250ZW50IjpbInskLCAkJH0gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblNlbGVjdExpc3RNdWx0aXBsZVZpZXcgPSByZXF1aXJlICcuL3NlbGVjdC1saXN0LW11bHRpcGxlLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFNlbGVjdFN0YWdlRmlsZXNWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdE11bHRpcGxlVmlld1xuICBpbml0aWFsaXplOiAoQHJlcG8sIGl0ZW1zKSAtPlxuICAgIHN1cGVyXG4gICAgQHNlbGVjdGVkSXRlbXMucHVzaCAnZm9vYmFyJyAjIGhhY2sgdG8gb3ZlcnJpZGUgc3VwZXIgY2xhc3MgYmVoYXZpb3Igc28gOjpjb21wbGV0ZWQgd2lsbCBiZSBjYWxsZWRcbiAgICBAc2hvdygpXG4gICAgQHNldEl0ZW1zIGl0ZW1zXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICdwYXRoJ1xuXG4gIGFkZEJ1dHRvbnM6IC0+XG4gICAgdmlld0J1dHRvbiA9ICQkIC0+XG4gICAgICBAZGl2IGNsYXNzOiAnc2VsZWN0LWxpc3QtYnV0dG9ucycsID0+XG4gICAgICAgIEBkaXYgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1lcnJvciBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLWNhbmNlbC1idXR0b24nLCAnQ2FuY2VsJ1xuICAgICAgICBAZGl2ID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tc3VjY2VzcyBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLWFwcGx5LWJ1dHRvbicsICdBcHBseSdcbiAgICB2aWV3QnV0dG9uLmFwcGVuZFRvKHRoaXMpXG5cbiAgICBAb24gJ2NsaWNrJywgJ2J1dHRvbicsICh7dGFyZ2V0fSkgPT5cbiAgICAgIEBjb21wbGV0ZSgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLWFwcGx5LWJ1dHRvbicpXG4gICAgICBAY2FuY2VsKCkgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tY2FuY2VsLWJ1dHRvbicpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKGl0ZW0sIG1hdGNoZWRTdHIpIC0+XG4gICAgY2xhc3NTdHJpbmcgPSBpZiBpdGVtLnN0YWdlZCB0aGVuICdhY3RpdmUnIGVsc2UgJydcbiAgICAkJCAtPlxuICAgICAgQGxpIGNsYXNzOiBjbGFzc1N0cmluZywgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaW5saW5lLWJsb2NrIGhpZ2hsaWdodCcsIGl0ZW0ubW9kZVxuICAgICAgICBpZiBtYXRjaGVkU3RyPyB0aGVuIEByYXcobWF0Y2hlZFN0cikgZWxzZSBAc3BhbiBpdGVtLnBhdGhcblxuICBjb25maXJtZWQ6IChpdGVtLCB2aWV3SXRlbSkgLT5cbiAgICBpdGVtLnN0YWdlZCA9IG5vdCBpdGVtLnN0YWdlZFxuICAgIHZpZXdJdGVtLnRvZ2dsZUNsYXNzKCdhY3RpdmUnKVxuXG4gIGNvbXBsZXRlZDogKF8pIC0+XG4gICAgc3RhZ2UgPSBAaXRlbXMuZmlsdGVyKChpdGVtKSAtPiBpdGVtLnN0YWdlZCkubWFwICh7cGF0aH0pIC0+IHBhdGhcbiAgICB1bnN0YWdlID0gQGl0ZW1zLmZpbHRlcigoaXRlbSkgLT4gbm90IGl0ZW0uc3RhZ2VkKS5tYXAgKHtwYXRofSkgLT4gcGF0aFxuICAgIHN0YWdlUHJvbWlzZSA9IGlmIHN0YWdlLmxlbmd0aCA+IDAgIHRoZW4gZ2l0LmNtZChbJ2FkZCcsICctZiddLmNvbmNhdChzdGFnZSksIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIHVuc3RhZ2VQcm9taXNlID0gaWYgdW5zdGFnZS5sZW5ndGggPiAwIHRoZW4gZ2l0LmNtZChbJ3Jlc2V0JywgJ0hFQUQnLCAnLS0nXS5jb25jYXQodW5zdGFnZSksIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIFByb21pc2UuYWxsKFtzdGFnZVByb21pc2UsIHVuc3RhZ2VQcm9taXNlXSlcbiAgICAudGhlbiAoZGF0YSkgLT4gbm90aWZpZXIuYWRkU3VjY2VzcyAnSW5kZXggdXBkYXRlZCBzdWNjZXNzZnVsbHknXG4gICAgLmNhdGNoIG5vdGlmaWVyLmFkZEVycm9yXG4gICAgQGNhbmNlbCgpXG4iXX0=
