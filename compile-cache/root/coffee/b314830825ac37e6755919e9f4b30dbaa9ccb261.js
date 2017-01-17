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
      return $$(function() {
        return this.li((function(_this) {
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

    SelectStageFilesView.prototype.completed = function(items) {
      var files, item;
      files = (function() {
        var i, len, results;
        results = [];
        for (i = 0, len = items.length; i < len; i++) {
          item = items[i];
          results.push(item.path);
        }
        return results;
      })();
      this.cancel();
      return git.cmd(['add', '-f'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        if (data === '') {
          return notifier.addSuccess('File(s) staged successfully');
        } else {
          return notifier.addSuccess(data);
        }
      });
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc2VsZWN0LXN0YWdlLWZpbGVzLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx1RUFBQTtJQUFBOzs7RUFBQSxNQUFVLE9BQUEsQ0FBUSxzQkFBUixDQUFWLEVBQUMsU0FBRCxFQUFJOztFQUVKLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDZCQUFSOztFQUV6QixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O21DQUVKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxLQUFSO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFDWCxzREFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVjthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBSlU7O21DQU1aLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7bUNBRWQsVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsVUFBQSxHQUFhLEVBQUEsQ0FBRyxTQUFBO2VBQ2QsSUFBQyxDQUFBLEdBQUQsQ0FBSztVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8scUJBQVA7U0FBTCxFQUFtQyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO1lBQ2pDLEtBQUMsQ0FBQSxHQUFELENBQUssU0FBQTtxQkFDSCxLQUFDLENBQUEsTUFBRCxDQUFRO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sb0RBQVA7ZUFBUixFQUFxRSxRQUFyRTtZQURHLENBQUw7bUJBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBO3FCQUNILEtBQUMsQ0FBQSxNQUFELENBQVE7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxxREFBUDtlQUFSLEVBQXNFLE9BQXRFO1lBREcsQ0FBTDtVQUhpQztRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBbkM7TUFEYyxDQUFIO01BTWIsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsSUFBcEI7YUFFQSxJQUFDLENBQUEsRUFBRCxDQUFJLE9BQUosRUFBYSxRQUFiLEVBQXVCLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxHQUFEO0FBQ3JCLGNBQUE7VUFEdUIsU0FBRDtVQUN0QixJQUFlLENBQUEsQ0FBRSxNQUFGLENBQVMsQ0FBQyxRQUFWLENBQW1CLGtCQUFuQixDQUFmO1lBQUEsS0FBQyxDQUFBLFFBQUQsQ0FBQSxFQUFBOztVQUNBLElBQWEsQ0FBQSxDQUFFLE1BQUYsQ0FBUyxDQUFDLFFBQVYsQ0FBbUIsbUJBQW5CLENBQWI7bUJBQUEsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUFBOztRQUZxQjtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBdkI7SUFUVTs7bUNBYVosSUFBQSxHQUFNLFNBQUE7O1FBQ0osSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7YUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtJQUhJOzttQ0FLTixTQUFBLEdBQVcsU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELENBQUE7SUFBSDs7bUNBRVgsSUFBQSxHQUFNLFNBQUE7QUFBRyxVQUFBOytDQUFNLENBQUUsT0FBUixDQUFBO0lBQUg7O21DQUVOLFdBQUEsR0FBYSxTQUFDLElBQUQsRUFBTyxVQUFQO2FBQ1gsRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDRixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO2FBQUwsRUFBMEIsU0FBQTtxQkFDeEIsS0FBQyxDQUFBLElBQUQsQ0FBTTtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdCQUFQO2VBQU4sRUFBdUMsSUFBSSxDQUFDLElBQTVDO1lBRHdCLENBQTFCO1lBRUEsSUFBRyxrQkFBSDtxQkFBb0IsS0FBQyxDQUFBLEdBQUQsQ0FBSyxVQUFMLEVBQXBCO2FBQUEsTUFBQTtxQkFBMEMsS0FBQyxDQUFBLElBQUQsQ0FBTSxJQUFJLENBQUMsSUFBWCxFQUExQzs7VUFIRTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSjtNQURDLENBQUg7SUFEVzs7bUNBT2IsU0FBQSxHQUFXLFNBQUMsS0FBRDtBQUNULFVBQUE7TUFBQSxLQUFBOztBQUFTO2FBQUEsdUNBQUE7O3VCQUFBLElBQUksQ0FBQztBQUFMOzs7TUFDVCxJQUFDLENBQUEsTUFBRCxDQUFBO2FBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLEtBQUQsRUFBUSxJQUFSLENBQWEsQ0FBQyxNQUFkLENBQXFCLEtBQXJCLENBQVIsRUFBcUM7UUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7T0FBckMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7UUFDSixJQUFHLElBQUEsS0FBUSxFQUFYO2lCQUNFLFFBQVEsQ0FBQyxVQUFULENBQW9CLDZCQUFwQixFQURGO1NBQUEsTUFBQTtpQkFHRSxRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFwQixFQUhGOztNQURJLENBRE47SUFIUzs7OztLQXZDc0I7QUFQbkMiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgJCR9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5TZWxlY3RMaXN0TXVsdGlwbGVWaWV3ID0gcmVxdWlyZSAnLi9zZWxlY3QtbGlzdC1tdWx0aXBsZS12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTZWxlY3RTdGFnZUZpbGVzVmlldyBleHRlbmRzIFNlbGVjdExpc3RNdWx0aXBsZVZpZXdcblxuICBpbml0aWFsaXplOiAoQHJlcG8sIGl0ZW1zKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBzZXRJdGVtcyBpdGVtc1xuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAncGF0aCdcblxuICBhZGRCdXR0b25zOiAtPlxuICAgIHZpZXdCdXR0b24gPSAkJCAtPlxuICAgICAgQGRpdiBjbGFzczogJ3NlbGVjdC1saXN0LWJ1dHRvbnMnLCA9PlxuICAgICAgICBAZGl2ID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tZXJyb3IgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1jYW5jZWwtYnV0dG9uJywgJ0NhbmNlbCdcbiAgICAgICAgQGRpdiA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLXN1Y2Nlc3MgaW5saW5lLWJsb2NrLXRpZ2h0IGJ0bi1zdGFnZS1idXR0b24nLCAnU3RhZ2UnXG4gICAgdmlld0J1dHRvbi5hcHBlbmRUbyh0aGlzKVxuXG4gICAgQG9uICdjbGljaycsICdidXR0b24nLCAoe3RhcmdldH0pID0+XG4gICAgICBAY29tcGxldGUoKSBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1zdGFnZS1idXR0b24nKVxuICAgICAgQGNhbmNlbCgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLWNhbmNlbC1idXR0b24nKVxuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06IChpdGVtLCBtYXRjaGVkU3RyKSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaW5saW5lLWJsb2NrIGhpZ2hsaWdodCcsIGl0ZW0ubW9kZVxuICAgICAgICBpZiBtYXRjaGVkU3RyPyB0aGVuIEByYXcobWF0Y2hlZFN0cikgZWxzZSBAc3BhbiBpdGVtLnBhdGhcblxuICBjb21wbGV0ZWQ6IChpdGVtcykgLT5cbiAgICBmaWxlcyA9IChpdGVtLnBhdGggZm9yIGl0ZW0gaW4gaXRlbXMpXG4gICAgQGNhbmNlbCgpXG4gICAgZ2l0LmNtZChbJ2FkZCcsICctZiddLmNvbmNhdChmaWxlcyksIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChkYXRhKSAtPlxuICAgICAgaWYgZGF0YSBpcyAnJ1xuICAgICAgICBub3RpZmllci5hZGRTdWNjZXNzICdGaWxlKHMpIHN0YWdlZCBzdWNjZXNzZnVsbHknXG4gICAgICBlbHNlXG4gICAgICAgIG5vdGlmaWVyLmFkZFN1Y2Nlc3MgZGF0YVxuIl19
