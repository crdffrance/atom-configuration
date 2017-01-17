(function() {
  var $$, SelectListView, UsagesView, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  path = require('path');

  module.exports = UsagesView = (function(superClass) {
    extend(UsagesView, superClass);

    function UsagesView() {
      return UsagesView.__super__.constructor.apply(this, arguments);
    }

    UsagesView.prototype.initialize = function(matches) {
      UsagesView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for usages');
      return this.focusFilterEditor();
    };

    UsagesView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    UsagesView.prototype.viewForItem = function(arg) {
      var _, column, fileName, line, moduleName, name, ref1, relativePath;
      name = arg.name, moduleName = arg.moduleName, fileName = arg.fileName, line = arg.line, column = arg.column;
      ref1 = atom.project.relativizePath(fileName), _ = ref1[0], relativePath = ref1[1];
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div("" + name, {
              "class": 'primary-line'
            });
            return _this.div(relativePath + ", line " + line, {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    UsagesView.prototype.getFilterKey = function() {
      return 'fileName';
    };

    UsagesView.prototype.scrollToItemView = function() {
      var column, editor, fileName, line, moduleName, name, ref1;
      UsagesView.__super__.scrollToItemView.apply(this, arguments);
      ref1 = this.getSelectedItem(), name = ref1.name, moduleName = ref1.moduleName, fileName = ref1.fileName, line = ref1.line, column = ref1.column;
      editor = atom.workspace.getActiveTextEditor();
      if (editor.getBuffer().file.path === fileName) {
        editor.setSelectedBufferRange([[line - 1, column], [line - 1, column + name.length]]);
        return editor.scrollToBufferPosition([line - 1, column], {
          center: true
        });
      }
    };

    UsagesView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No usages found';
      } else {
        return UsagesView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    UsagesView.prototype.confirmed = function(arg) {
      var column, fileName, line, moduleName, name, promise;
      name = arg.name, moduleName = arg.moduleName, fileName = arg.fileName, line = arg.line, column = arg.column;
      this.cancelPosition = null;
      this.cancel();
      promise = atom.workspace.open(fileName);
      return promise.then(function(editor) {
        editor.setCursorBufferPosition([line - 1, column]);
        editor.setSelectedBufferRange([[line - 1, column], [line - 1, column + name.length]]);
        return editor.scrollToCursorPosition();
      });
    };

    UsagesView.prototype.cancelled = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.hide() : void 0;
    };

    return UsagesView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi91c2FnZXMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlDQUFBO0lBQUE7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFDTCxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7O0VBRVAsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozt5QkFDSixVQUFBLEdBQVksU0FBQyxPQUFEO01BQ1YsNENBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxjQUFWOztRQUNBLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO01BQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBWSxvQkFBWjthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBUFU7O3lCQVNaLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLE1BQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxLQUFLLENBQUMsT0FBUCxDQUFBO0lBRk87O3lCQUlULFdBQUEsR0FBYSxTQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGEsaUJBQU0sNkJBQVkseUJBQVUsaUJBQU07TUFDL0MsT0FBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQXBCLEVBQUMsV0FBRCxFQUFJO0FBQ0osYUFBTyxFQUFBLENBQUcsU0FBQTtlQUNSLElBQUMsQ0FBQSxFQUFELENBQUk7VUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFdBQVA7U0FBSixFQUF3QixDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO1lBQ3RCLEtBQUMsQ0FBQSxHQUFELENBQUssRUFBQSxHQUFHLElBQVIsRUFBZ0I7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVA7YUFBaEI7bUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBUSxZQUFELEdBQWMsU0FBZCxHQUF1QixJQUE5QixFQUFzQztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQVA7YUFBdEM7VUFGc0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO01BRFEsQ0FBSDtJQUZJOzt5QkFPYixZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7O3lCQUVkLGdCQUFBLEdBQWtCLFNBQUE7QUFDaEIsVUFBQTtNQUFBLGtEQUFBLFNBQUE7TUFDQSxPQUE2QyxJQUFDLENBQUEsZUFBRCxDQUFBLENBQTdDLEVBQUMsZ0JBQUQsRUFBTyw0QkFBUCxFQUFtQix3QkFBbkIsRUFBNkIsZ0JBQTdCLEVBQW1DO01BQ25DLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxJQUFHLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxJQUFJLENBQUMsSUFBeEIsS0FBZ0MsUUFBbkM7UUFDRSxNQUFNLENBQUMsc0JBQVAsQ0FBOEIsQ0FDNUIsQ0FBQyxJQUFBLEdBQU8sQ0FBUixFQUFXLE1BQVgsQ0FENEIsRUFDUixDQUFDLElBQUEsR0FBTyxDQUFSLEVBQVcsTUFBQSxHQUFTLElBQUksQ0FBQyxNQUF6QixDQURRLENBQTlCO2VBRUEsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQUMsSUFBQSxHQUFPLENBQVIsRUFBVyxNQUFYLENBQTlCLEVBQWtEO1VBQUEsTUFBQSxFQUFRLElBQVI7U0FBbEQsRUFIRjs7SUFKZ0I7O3lCQVNsQixlQUFBLEdBQWlCLFNBQUMsU0FBRDtNQUNmLElBQUcsU0FBQSxLQUFhLENBQWhCO2VBQ0Usa0JBREY7T0FBQSxNQUFBO2VBR0UsaURBQUEsU0FBQSxFQUhGOztJQURlOzt5QkFNakIsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxpQkFBTSw2QkFBWSx5QkFBVSxpQkFBTTtNQUM3QyxJQUFDLENBQUEsY0FBRCxHQUFrQjtNQUNsQixJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsT0FBQSxHQUFVLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQjthQUNWLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBQyxNQUFEO1FBQ1gsTUFBTSxDQUFDLHVCQUFQLENBQStCLENBQUMsSUFBQSxHQUFPLENBQVIsRUFBVyxNQUFYLENBQS9CO1FBQ0EsTUFBTSxDQUFDLHNCQUFQLENBQThCLENBQzVCLENBQUMsSUFBQSxHQUFPLENBQVIsRUFBVyxNQUFYLENBRDRCLEVBQ1IsQ0FBQyxJQUFBLEdBQU8sQ0FBUixFQUFXLE1BQUEsR0FBUyxJQUFJLENBQUMsTUFBekIsQ0FEUSxDQUE5QjtlQUVBLE1BQU0sQ0FBQyxzQkFBUCxDQUFBO01BSlcsQ0FBYjtJQUpTOzt5QkFVWCxTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7K0NBQU0sQ0FBRSxJQUFSLENBQUE7SUFEUzs7OztLQWhEWTtBQUp6QiIsInNvdXJjZXNDb250ZW50IjpbInskJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVXNhZ2VzVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChtYXRjaGVzKSAtPlxuICAgIHN1cGVyXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuICAgIEBhZGRDbGFzcygnc3ltYm9scy12aWV3JylcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc2V0TG9hZGluZygnTG9va2luZyBmb3IgdXNhZ2VzJylcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGRlc3Ryb3k6IC0+XG4gICAgQGNhbmNlbCgpXG4gICAgQHBhbmVsLmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe25hbWUsIG1vZHVsZU5hbWUsIGZpbGVOYW1lLCBsaW5lLCBjb2x1bW59KSAtPlxuICAgIFtfLCByZWxhdGl2ZVBhdGhdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVOYW1lKVxuICAgIHJldHVybiAkJCAtPlxuICAgICAgQGxpIGNsYXNzOiAndHdvLWxpbmVzJywgPT5cbiAgICAgICAgQGRpdiBcIiN7bmFtZX1cIiwgY2xhc3M6ICdwcmltYXJ5LWxpbmUnXG4gICAgICAgIEBkaXYgXCIje3JlbGF0aXZlUGF0aH0sIGxpbmUgI3tsaW5lfVwiLCBjbGFzczogJ3NlY29uZGFyeS1saW5lJ1xuXG4gIGdldEZpbHRlcktleTogLT4gJ2ZpbGVOYW1lJ1xuXG4gIHNjcm9sbFRvSXRlbVZpZXc6IC0+XG4gICAgc3VwZXJcbiAgICB7bmFtZSwgbW9kdWxlTmFtZSwgZmlsZU5hbWUsIGxpbmUsIGNvbHVtbn0gPSBAZ2V0U2VsZWN0ZWRJdGVtKClcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiBlZGl0b3IuZ2V0QnVmZmVyKCkuZmlsZS5wYXRoIGlzIGZpbGVOYW1lXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShbXG4gICAgICAgIFtsaW5lIC0gMSwgY29sdW1uXSwgW2xpbmUgLSAxLCBjb2x1bW4gKyBuYW1lLmxlbmd0aF1dKVxuICAgICAgZWRpdG9yLnNjcm9sbFRvQnVmZmVyUG9zaXRpb24oW2xpbmUgLSAxLCBjb2x1bW5dLCBjZW50ZXI6IHRydWUpXG5cbiAgZ2V0RW1wdHlNZXNzYWdlOiAoaXRlbUNvdW50KSAtPlxuICAgIGlmIGl0ZW1Db3VudCBpcyAwXG4gICAgICAnTm8gdXNhZ2VzIGZvdW5kJ1xuICAgIGVsc2VcbiAgICAgIHN1cGVyXG5cbiAgY29uZmlybWVkOiAoe25hbWUsIG1vZHVsZU5hbWUsIGZpbGVOYW1lLCBsaW5lLCBjb2x1bW59KSAtPlxuICAgIEBjYW5jZWxQb3NpdGlvbiA9IG51bGxcbiAgICBAY2FuY2VsKClcbiAgICBwcm9taXNlID0gYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlTmFtZSlcbiAgICBwcm9taXNlLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbbGluZSAtIDEsIGNvbHVtbl0pXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShbXG4gICAgICAgIFtsaW5lIC0gMSwgY29sdW1uXSwgW2xpbmUgLSAxLCBjb2x1bW4gKyBuYW1lLmxlbmd0aF1dKVxuICAgICAgZWRpdG9yLnNjcm9sbFRvQ3Vyc29yUG9zaXRpb24oKVxuXG4gIGNhbmNlbGxlZDogLT5cbiAgICBAcGFuZWw/LmhpZGUoKVxuIl19
