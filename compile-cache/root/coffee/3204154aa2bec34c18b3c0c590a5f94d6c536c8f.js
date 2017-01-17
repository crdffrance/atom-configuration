(function() {
  var $$, ListView, SelectListView, git, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function() {
      ListView.__super__.initialize.apply(this, arguments);
      this.currentPane = atom.workspace.getActivePane();
      return this.result = new Promise((function(_this) {
        return function(resolve, reject) {
          _this.resolve = resolve;
          _this.reject = reject;
          return _this.setup();
        };
      })(this));
    };

    ListView.prototype.getFilterKey = function() {
      return 'path';
    };

    ListView.prototype.setup = function() {
      this.setItems(atom.project.getPaths().map(function(p) {
        return {
          path: p,
          relativized: p.substring(p.lastIndexOf('/') + 1)
        };
      }));
      return this.show();
    };

    ListView.prototype.show = function() {
      this.filterEditorView.getModel().placeholderText = 'Initialize new repo where?';
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.focusFilterEditor();
      return this.storeFocusedElement();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.viewForItem = function(arg) {
      var path, relativized;
      path = arg.path, relativized = arg.relativized;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, relativized);
            return _this.div({
              "class": 'text-info'
            }, path);
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(arg) {
      var path;
      path = arg.path;
      this.resolve(path);
      return this.cancel();
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcHJvamVjdHMtbGlzdC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsc0NBQUE7SUFBQTs7O0VBQUEsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUNMLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFFTixNQUFNLENBQUMsT0FBUCxHQUNROzs7Ozs7O3VCQUNKLFVBQUEsR0FBWSxTQUFBO01BQ1YsMENBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUE7YUFDZixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtVQUNwQixLQUFDLENBQUEsT0FBRCxHQUFXO1VBQ1gsS0FBQyxDQUFBLE1BQUQsR0FBVTtpQkFDVixLQUFDLENBQUEsS0FBRCxDQUFBO1FBSG9CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO0lBSEo7O3VCQVFaLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7dUJBRWQsS0FBQSxHQUFPLFNBQUE7TUFDTCxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXVCLENBQUMsR0FBeEIsQ0FBNEIsU0FBQyxDQUFEO0FBQ3BDLGVBQU87VUFDTCxJQUFBLEVBQU0sQ0FERDtVQUVMLFdBQUEsRUFBYSxDQUFDLENBQUMsU0FBRixDQUFZLENBQUMsQ0FBQyxXQUFGLENBQWMsR0FBZCxDQUFBLEdBQW1CLENBQS9CLENBRlI7O01BRDZCLENBQTVCLENBQVY7YUFLQSxJQUFDLENBQUEsSUFBRCxDQUFBO0lBTks7O3VCQVFQLElBQUEsR0FBTSxTQUFBO01BQ0osSUFBQyxDQUFBLGdCQUFnQixDQUFDLFFBQWxCLENBQUEsQ0FBNEIsQ0FBQyxlQUE3QixHQUErQzs7UUFDL0MsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBTEk7O3VCQU9OLElBQUEsR0FBTSxTQUFBO0FBQUcsVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQUFIOzt1QkFFTixTQUFBLEdBQVcsU0FBQTthQUNULElBQUMsQ0FBQSxJQUFELENBQUE7SUFEUzs7dUJBR1gsV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxpQkFBTTthQUNuQixFQUFBLENBQUcsU0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUksQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUNGLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGdCQUFQO2FBQUwsRUFBOEIsV0FBOUI7bUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDthQUFMLEVBQXlCLElBQXpCO1VBRkU7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUo7TUFEQyxDQUFIO0lBRFc7O3VCQU1iLFNBQUEsR0FBVyxTQUFDLEdBQUQ7QUFDVCxVQUFBO01BRFcsT0FBRDtNQUNWLElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVDthQUNBLElBQUMsQ0FBQSxNQUFELENBQUE7SUFGUzs7OztLQXJDVTtBQUp6QiIsInNvdXJjZXNDb250ZW50IjpbInskJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY2xhc3MgTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICAgIGluaXRpYWxpemU6IC0+XG4gICAgICBzdXBlclxuICAgICAgQGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgICBAcmVzdWx0ID0gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgPT5cbiAgICAgICAgQHJlc29sdmUgPSByZXNvbHZlXG4gICAgICAgIEByZWplY3QgPSByZWplY3RcbiAgICAgICAgQHNldHVwKClcblxuICAgIGdldEZpbHRlcktleTogLT4gJ3BhdGgnXG5cbiAgICBzZXR1cDogLT5cbiAgICAgIEBzZXRJdGVtcyBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5tYXAgKHApIC0+XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgcGF0aDogcFxuICAgICAgICAgIHJlbGF0aXZpemVkOiBwLnN1YnN0cmluZyhwLmxhc3RJbmRleE9mKCcvJykrMSlcbiAgICAgICAgfVxuICAgICAgQHNob3coKVxuXG4gICAgc2hvdzogLT5cbiAgICAgIEBmaWx0ZXJFZGl0b3JWaWV3LmdldE1vZGVsKCkucGxhY2Vob2xkZXJUZXh0ID0gJ0luaXRpYWxpemUgbmV3IHJlcG8gd2hlcmU/J1xuICAgICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICAgIEBwYW5lbC5zaG93KClcbiAgICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG4gICAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgICBoaWRlOiAtPiBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gICAgY2FuY2VsbGVkOiAtPlxuICAgICAgQGhpZGUoKVxuXG4gICAgdmlld0Zvckl0ZW06ICh7cGF0aCwgcmVsYXRpdml6ZWR9KSAtPlxuICAgICAgJCQgLT5cbiAgICAgICAgQGxpID0+XG4gICAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtaGlnaGxpZ2h0JywgcmVsYXRpdml6ZWRcbiAgICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC1pbmZvJywgcGF0aFxuXG4gICAgY29uZmlybWVkOiAoe3BhdGh9KSAtPlxuICAgICAgQHJlc29sdmUgcGF0aFxuICAgICAgQGNhbmNlbCgpXG4iXX0=
