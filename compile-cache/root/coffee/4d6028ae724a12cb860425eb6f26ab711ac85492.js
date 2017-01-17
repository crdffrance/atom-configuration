(function() {
  var $$, DefinitionsView, SelectListView, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  path = require('path');

  module.exports = DefinitionsView = (function(superClass) {
    extend(DefinitionsView, superClass);

    function DefinitionsView() {
      return DefinitionsView.__super__.constructor.apply(this, arguments);
    }

    DefinitionsView.prototype.initialize = function(matches) {
      DefinitionsView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for definitions');
      return this.focusFilterEditor();
    };

    DefinitionsView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    DefinitionsView.prototype.viewForItem = function(arg) {
      var _, column, fileName, line, ref1, relativePath, text, type;
      text = arg.text, fileName = arg.fileName, line = arg.line, column = arg.column, type = arg.type;
      ref1 = atom.project.relativizePath(fileName), _ = ref1[0], relativePath = ref1[1];
      return $$(function() {
        return this.li({
          "class": 'two-lines'
        }, (function(_this) {
          return function() {
            _this.div(type + " " + text, {
              "class": 'primary-line'
            });
            return _this.div(relativePath + ", line " + (line + 1), {
              "class": 'secondary-line'
            });
          };
        })(this));
      });
    };

    DefinitionsView.prototype.getFilterKey = function() {
      return 'fileName';
    };

    DefinitionsView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No definition found';
      } else {
        return DefinitionsView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    DefinitionsView.prototype.confirmed = function(arg) {
      var column, fileName, line, promise;
      fileName = arg.fileName, line = arg.line, column = arg.column;
      this.cancelPosition = null;
      this.cancel();
      promise = atom.workspace.open(fileName);
      return promise.then(function(editor) {
        editor.setCursorBufferPosition([line, column]);
        return editor.scrollToCursorPosition();
      });
    };

    DefinitionsView.prototype.cancelled = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.hide() : void 0;
    };

    return DefinitionsView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9kZWZpbml0aW9ucy12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsOENBQUE7SUFBQTs7O0VBQUEsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OzhCQUNKLFVBQUEsR0FBWSxTQUFDLE9BQUQ7TUFDVixpREFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGNBQVY7O1FBQ0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLHlCQUFaO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFQVTs7OEJBU1osT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUE7SUFGTzs7OEJBSVQsV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxpQkFBTSx5QkFBVSxpQkFBTSxxQkFBUTtNQUMzQyxPQUFvQixJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWIsQ0FBNEIsUUFBNUIsQ0FBcEIsRUFBQyxXQUFELEVBQUk7QUFDSixhQUFPLEVBQUEsQ0FBRyxTQUFBO2VBQ1IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtTQUFKLEVBQXdCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDdEIsS0FBQyxDQUFBLEdBQUQsQ0FBUSxJQUFELEdBQU0sR0FBTixHQUFTLElBQWhCLEVBQXdCO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUFQO2FBQXhCO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQVEsWUFBRCxHQUFjLFNBQWQsR0FBc0IsQ0FBQyxJQUFBLEdBQU8sQ0FBUixDQUE3QixFQUEwQztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZ0JBQVA7YUFBMUM7VUFGc0I7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXhCO01BRFEsQ0FBSDtJQUZJOzs4QkFPYixZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7OzhCQUVkLGVBQUEsR0FBaUIsU0FBQyxTQUFEO01BQ2YsSUFBRyxTQUFBLEtBQWEsQ0FBaEI7ZUFDRSxzQkFERjtPQUFBLE1BQUE7ZUFHRSxzREFBQSxTQUFBLEVBSEY7O0lBRGU7OzhCQU1qQixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLHlCQUFVLGlCQUFNO01BQzNCLElBQUMsQ0FBQSxjQUFELEdBQWtCO01BQ2xCLElBQUMsQ0FBQSxNQUFELENBQUE7TUFDQSxPQUFBLEdBQVUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLFFBQXBCO2FBQ1YsT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFDLE1BQUQ7UUFDWCxNQUFNLENBQUMsdUJBQVAsQ0FBK0IsQ0FBQyxJQUFELEVBQU8sTUFBUCxDQUEvQjtlQUNBLE1BQU0sQ0FBQyxzQkFBUCxDQUFBO01BRlcsQ0FBYjtJQUpTOzs4QkFRWCxTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7K0NBQU0sQ0FBRSxJQUFSLENBQUE7SUFEUzs7OztLQXJDaUI7QUFKOUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIERlZmluaXRpb25zVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChtYXRjaGVzKSAtPlxuICAgIHN1cGVyXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuICAgIEBhZGRDbGFzcygnc3ltYm9scy12aWV3JylcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc2V0TG9hZGluZygnTG9va2luZyBmb3IgZGVmaW5pdGlvbnMnKVxuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAY2FuY2VsKClcbiAgICBAcGFuZWwuZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7dGV4dCwgZmlsZU5hbWUsIGxpbmUsIGNvbHVtbiwgdHlwZX0pIC0+XG4gICAgW18sIHJlbGF0aXZlUGF0aF0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZU5hbWUpXG4gICAgcmV0dXJuICQkIC0+XG4gICAgICBAbGkgY2xhc3M6ICd0d28tbGluZXMnLCA9PlxuICAgICAgICBAZGl2IFwiI3t0eXBlfSAje3RleHR9XCIsIGNsYXNzOiAncHJpbWFyeS1saW5lJ1xuICAgICAgICBAZGl2IFwiI3tyZWxhdGl2ZVBhdGh9LCBsaW5lICN7bGluZSArIDF9XCIsIGNsYXNzOiAnc2Vjb25kYXJ5LWxpbmUnXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAnZmlsZU5hbWUnXG5cbiAgZ2V0RW1wdHlNZXNzYWdlOiAoaXRlbUNvdW50KSAtPlxuICAgIGlmIGl0ZW1Db3VudCBpcyAwXG4gICAgICAnTm8gZGVmaW5pdGlvbiBmb3VuZCdcbiAgICBlbHNlXG4gICAgICBzdXBlclxuXG4gIGNvbmZpcm1lZDogKHtmaWxlTmFtZSwgbGluZSwgY29sdW1ufSkgLT5cbiAgICBAY2FuY2VsUG9zaXRpb24gPSBudWxsXG4gICAgQGNhbmNlbCgpXG4gICAgcHJvbWlzZSA9IGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZU5hbWUpXG4gICAgcHJvbWlzZS50aGVuIChlZGl0b3IpIC0+XG4gICAgICBlZGl0b3Iuc2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oW2xpbmUsIGNvbHVtbl0pXG4gICAgICBlZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpXG5cbiAgY2FuY2VsbGVkOiAtPlxuICAgIEBwYW5lbD8uaGlkZSgpXG4iXX0=
