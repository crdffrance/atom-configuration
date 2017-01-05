(function() {
  var $$, BufferedProcess, SelectListView, TagCreateView, TagListView, TagView, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BufferedProcess = require('atom').BufferedProcess;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  TagView = require('./tag-view');

  TagCreateView = require('./tag-create-view');

  module.exports = TagListView = (function(superClass) {
    extend(TagListView, superClass);

    function TagListView() {
      return TagListView.__super__.constructor.apply(this, arguments);
    }

    TagListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data != null ? data : '';
      TagListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagListView.prototype.parseData = function() {
      var item, items, tmp;
      if (this.data.length > 0) {
        this.data = this.data.split("\n").slice(0, -1);
        items = (function() {
          var i, len, ref1, results;
          ref1 = this.data.reverse();
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            item = ref1[i];
            if (!(item !== '')) {
              continue;
            }
            tmp = item.match(/([\w\d-_\/.]+)\s(.*)/);
            results.push({
              tag: tmp != null ? tmp[1] : void 0,
              annotation: tmp != null ? tmp[2] : void 0
            });
          }
          return results;
        }).call(this);
      } else {
        items = [];
      }
      items.push({
        tag: '+ Add Tag',
        annotation: 'Add a tag referencing the current commit.'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagListView.prototype.getFilterKey = function() {
      return 'tag';
    };

    TagListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagListView.prototype.cancelled = function() {
      return this.hide();
    };

    TagListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    TagListView.prototype.viewForItem = function(arg) {
      var annotation, tag;
      tag = arg.tag, annotation = arg.annotation;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, tag);
            return _this.div({
              "class": 'text-warning'
            }, annotation);
          };
        })(this));
      });
    };

    TagListView.prototype.confirmed = function(arg) {
      var tag;
      tag = arg.tag;
      this.cancel();
      if (tag === '+ Add Tag') {
        return new TagCreateView(this.repo);
      } else {
        return new TagView(this.repo, tag);
      }
    };

    return TagListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvdGFnLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDZFQUFBO0lBQUE7OztFQUFDLGtCQUFtQixPQUFBLENBQVEsTUFBUjs7RUFDcEIsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUVMLE9BQUEsR0FBVSxPQUFBLENBQVEsWUFBUjs7RUFDVixhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUjs7RUFFaEIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OzswQkFFSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsSUFBUjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLHNCQUFELE9BQU07TUFDeEIsNkNBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7YUFDQSxJQUFDLENBQUEsU0FBRCxDQUFBO0lBSFU7OzBCQUtaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLElBQUcsSUFBQyxDQUFBLElBQUksQ0FBQyxNQUFOLEdBQWUsQ0FBbEI7UUFDRSxJQUFDLENBQUEsSUFBRCxHQUFRLElBQUMsQ0FBQSxJQUFJLENBQUMsS0FBTixDQUFZLElBQVosQ0FBa0I7UUFDMUIsS0FBQTs7QUFDRTtBQUFBO2VBQUEsc0NBQUE7O2tCQUFpQyxJQUFBLEtBQVE7OztZQUN2QyxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxzQkFBWDt5QkFDTjtjQUFDLEdBQUEsZ0JBQUssR0FBSyxDQUFBLENBQUEsVUFBWDtjQUFlLFVBQUEsZ0JBQVksR0FBSyxDQUFBLENBQUEsVUFBaEM7O0FBRkY7O3NCQUhKO09BQUEsTUFBQTtRQVFFLEtBQUEsR0FBUSxHQVJWOztNQVVBLEtBQUssQ0FBQyxJQUFOLENBQVc7UUFBQyxHQUFBLEVBQUssV0FBTjtRQUFtQixVQUFBLEVBQVksMkNBQS9CO09BQVg7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVY7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQWJTOzswQkFlWCxZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7OzBCQUVkLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFISTs7MEJBS04sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7OzBCQUVYLElBQUEsR0FBTSxTQUFBO0FBQUcsVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQUFIOzswQkFFTixXQUFBLEdBQWEsU0FBQyxHQUFEO0FBQ1gsVUFBQTtNQURhLGVBQUs7YUFDbEIsRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDRixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxnQkFBUDthQUFMLEVBQThCLEdBQTlCO21CQUNBLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVA7YUFBTCxFQUE0QixVQUE1QjtVQUZFO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFKO01BREMsQ0FBSDtJQURXOzswQkFNYixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLE1BQUQ7TUFDVixJQUFDLENBQUEsTUFBRCxDQUFBO01BQ0EsSUFBRyxHQUFBLEtBQU8sV0FBVjtlQUNNLElBQUEsYUFBQSxDQUFjLElBQUMsQ0FBQSxJQUFmLEVBRE47T0FBQSxNQUFBO2VBR00sSUFBQSxPQUFBLENBQVEsSUFBQyxDQUFBLElBQVQsRUFBZSxHQUFmLEVBSE47O0lBRlM7Ozs7S0F2Q2E7QUFQMUIiLCJzb3VyY2VzQ29udGVudCI6WyJ7QnVmZmVyZWRQcm9jZXNzfSA9IHJlcXVpcmUgJ2F0b20nXG57JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5UYWdWaWV3ID0gcmVxdWlyZSAnLi90YWctdmlldydcblRhZ0NyZWF0ZVZpZXcgPSByZXF1aXJlICcuL3RhZy1jcmVhdGUtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgVGFnTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuXG4gIGluaXRpYWxpemU6IChAcmVwbywgQGRhdGE9JycpIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHBhcnNlRGF0YSgpXG5cbiAgcGFyc2VEYXRhOiAtPlxuICAgIGlmIEBkYXRhLmxlbmd0aCA+IDBcbiAgICAgIEBkYXRhID0gQGRhdGEuc3BsaXQoXCJcXG5cIilbLi4uLTFdXG4gICAgICBpdGVtcyA9IChcbiAgICAgICAgZm9yIGl0ZW0gaW4gQGRhdGEucmV2ZXJzZSgpIHdoZW4gaXRlbSAhPSAnJ1xuICAgICAgICAgIHRtcCA9IGl0ZW0ubWF0Y2ggLyhbXFx3XFxkLV8vLl0rKVxccyguKikvXG4gICAgICAgICAge3RhZzogdG1wP1sxXSwgYW5ub3RhdGlvbjogdG1wP1syXX1cbiAgICAgIClcbiAgICBlbHNlXG4gICAgICBpdGVtcyA9IFtdXG5cbiAgICBpdGVtcy5wdXNoIHt0YWc6ICcrIEFkZCBUYWcnLCBhbm5vdGF0aW9uOiAnQWRkIGEgdGFnIHJlZmVyZW5jaW5nIHRoZSBjdXJyZW50IGNvbW1pdC4nfVxuICAgIEBzZXRJdGVtcyBpdGVtc1xuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAndGFnJ1xuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7dGFnLCBhbm5vdGF0aW9ufSkgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LWhpZ2hsaWdodCcsIHRhZ1xuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC13YXJuaW5nJywgYW5ub3RhdGlvblxuXG4gIGNvbmZpcm1lZDogKHt0YWd9KSAtPlxuICAgIEBjYW5jZWwoKVxuICAgIGlmIHRhZyBpcyAnKyBBZGQgVGFnJ1xuICAgICAgbmV3IFRhZ0NyZWF0ZVZpZXcoQHJlcG8pXG4gICAgZWxzZVxuICAgICAgbmV3IFRhZ1ZpZXcoQHJlcG8sIHRhZylcbiJdfQ==
