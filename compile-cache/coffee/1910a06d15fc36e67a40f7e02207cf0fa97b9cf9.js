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

    ListView.prototype.initialize = function(repos) {
      this.repos = repos;
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
      return 'name';
    };

    ListView.prototype.setup = function() {
      this.repos = this.repos.map(function(r) {
        var path;
        path = r.getWorkingDirectory();
        return {
          name: path.substring(path.lastIndexOf('/') + 1),
          repo: r
        };
      });
      this.setItems(this.repos);
      return this.show();
    };

    ListView.prototype.show = function() {
      this.filterEditorView.getModel().placeholderText = 'Which repo?';
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
      var name;
      name = arg.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.confirmed = function(arg) {
      var repo;
      repo = arg.repo;
      this.resolve(repo);
      return this.cancel();
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVwby1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzQ0FBQTtJQUFBOzs7RUFBQSxNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUVOLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7Ozs7Ozs7dUJBQ0osVUFBQSxHQUFZLFNBQUMsS0FBRDtNQUFDLElBQUMsQ0FBQSxRQUFEO01BQ1gsMENBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQUE7YUFDZixJQUFDLENBQUEsTUFBRCxHQUFjLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFELEVBQVUsTUFBVjtVQUNwQixLQUFDLENBQUEsT0FBRCxHQUFXO1VBQ1gsS0FBQyxDQUFBLE1BQUQsR0FBVTtpQkFDVixLQUFDLENBQUEsS0FBRCxDQUFBO1FBSG9CO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO0lBSEo7O3VCQVFaLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7dUJBRWQsS0FBQSxHQUFPLFNBQUE7TUFDTCxJQUFDLENBQUEsS0FBRCxHQUFTLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXLFNBQUMsQ0FBRDtBQUNsQixZQUFBO1FBQUEsSUFBQSxHQUFPLENBQUMsQ0FBQyxtQkFBRixDQUFBO0FBQ1AsZUFBTztVQUNMLElBQUEsRUFBTSxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxXQUFMLENBQWlCLEdBQWpCLENBQUEsR0FBc0IsQ0FBckMsQ0FERDtVQUVMLElBQUEsRUFBTSxDQUZEOztNQUZXLENBQVg7TUFNVCxJQUFDLENBQUEsUUFBRCxDQUFVLElBQUMsQ0FBQSxLQUFYO2FBQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQVJLOzt1QkFVUCxJQUFBLEdBQU0sU0FBQTtNQUNKLElBQUMsQ0FBQSxnQkFBZ0IsQ0FBQyxRQUFsQixDQUFBLENBQTRCLENBQUMsZUFBN0IsR0FBK0M7O1FBQy9DLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO01BQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7YUFDQSxJQUFDLENBQUEsbUJBQUQsQ0FBQTtJQUxJOzt1QkFPTixJQUFBLEdBQU0sU0FBQTtBQUFHLFVBQUE7K0NBQU0sQ0FBRSxPQUFSLENBQUE7SUFBSDs7dUJBRU4sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7O3VCQUVYLFdBQUEsR0FBYSxTQUFDLEdBQUQ7QUFDWCxVQUFBO01BRGEsT0FBRDthQUNaLEVBQUEsQ0FBRyxTQUFBO2VBQUcsSUFBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKO01BQUgsQ0FBSDtJQURXOzt1QkFHYixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLE9BQUQ7TUFDVixJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQ7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBRlM7Ozs7S0FuQ1U7QUFKekIiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIGNsYXNzIExpc3RWaWV3IGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcbiAgICBpbml0aWFsaXplOiAoQHJlcG9zKSAtPlxuICAgICAgc3VwZXJcbiAgICAgIEBjdXJyZW50UGFuZSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmUoKVxuICAgICAgQHJlc3VsdCA9IG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgIEByZXNvbHZlID0gcmVzb2x2ZVxuICAgICAgICBAcmVqZWN0ID0gcmVqZWN0XG4gICAgICAgIEBzZXR1cCgpXG5cbiAgICBnZXRGaWx0ZXJLZXk6IC0+ICduYW1lJ1xuXG4gICAgc2V0dXA6IC0+XG4gICAgICBAcmVwb3MgPSBAcmVwb3MubWFwIChyKSAtPlxuICAgICAgICBwYXRoID0gci5nZXRXb3JraW5nRGlyZWN0b3J5KClcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiBwYXRoLnN1YnN0cmluZyhwYXRoLmxhc3RJbmRleE9mKCcvJykrMSlcbiAgICAgICAgICByZXBvOiByXG4gICAgICAgIH1cbiAgICAgIEBzZXRJdGVtcyBAcmVwb3NcbiAgICAgIEBzaG93KClcblxuICAgIHNob3c6IC0+XG4gICAgICBAZmlsdGVyRWRpdG9yVmlldy5nZXRNb2RlbCgpLnBsYWNlaG9sZGVyVGV4dCA9ICdXaGljaCByZXBvPydcbiAgICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgICBAcGFuZWwuc2hvdygpXG4gICAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuICAgICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gICAgaGlkZTogLT4gQHBhbmVsPy5kZXN0cm95KClcblxuICAgIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gICAgdmlld0Zvckl0ZW06ICh7bmFtZX0pIC0+XG4gICAgICAkJCAtPiBAbGkobmFtZSlcblxuICAgIGNvbmZpcm1lZDogKHtyZXBvfSkgLT5cbiAgICAgIEByZXNvbHZlIHJlcG9cbiAgICAgIEBjYW5jZWwoKVxuIl19
