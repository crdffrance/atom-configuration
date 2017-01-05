(function() {
  var $$, BufferedProcess, SelectListView, SelectStageHunkFile, SelectStageHunks, git, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BufferedProcess = require('atom').BufferedProcess;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  SelectStageHunks = require('./select-stage-hunks-view');

  git = require('../git');

  module.exports = SelectStageHunkFile = (function(superClass) {
    extend(SelectStageHunkFile, superClass);

    function SelectStageHunkFile() {
      return SelectStageHunkFile.__super__.constructor.apply(this, arguments);
    }

    SelectStageHunkFile.prototype.initialize = function(repo, items) {
      this.repo = repo;
      SelectStageHunkFile.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    SelectStageHunkFile.prototype.getFilterKey = function() {
      return 'path';
    };

    SelectStageHunkFile.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageHunkFile.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageHunkFile.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    SelectStageHunkFile.prototype.viewForItem = function(item) {
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
            return _this.span({
              "class": 'text-warning'
            }, item.path);
          };
        })(this));
      });
    };

    SelectStageHunkFile.prototype.confirmed = function(arg) {
      var path;
      path = arg.path;
      this.cancel();
      return git.diff(this.repo, path).then((function(_this) {
        return function(data) {
          return new SelectStageHunks(_this.repo, data);
        };
      })(this));
    };

    return SelectStageHunkFile;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc2VsZWN0LXN0YWdlLWh1bmstZmlsZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsb0ZBQUE7SUFBQTs7O0VBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSOztFQUNwQixNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBQ0wsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLDJCQUFSOztFQUNuQixHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBRU4sTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7OztrQ0FFSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsS0FBUjtNQUFDLElBQUMsQ0FBQSxPQUFEO01BQ1gscURBQUEsU0FBQTtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLEtBQVY7YUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQTtJQUpVOztrQ0FNWixZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7O2tDQUVkLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFISTs7a0NBS04sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7O2tDQUVYLElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQURJOztrQ0FHTixXQUFBLEdBQWEsU0FBQyxJQUFEO2FBQ1gsRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDRixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO2FBQUwsRUFBMEIsU0FBQTtxQkFDeEIsS0FBQyxDQUFBLElBQUQsQ0FBTTtnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHdCQUFQO2VBQU4sRUFBdUMsSUFBSSxDQUFDLElBQTVDO1lBRHdCLENBQTFCO21CQUVBLEtBQUMsQ0FBQSxJQUFELENBQU07Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGNBQVA7YUFBTixFQUE2QixJQUFJLENBQUMsSUFBbEM7VUFIRTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBSjtNQURDLENBQUg7SUFEVzs7a0NBT2IsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxPQUFEO01BQ1YsSUFBQyxDQUFBLE1BQUQsQ0FBQTthQUNBLEdBQUcsQ0FBQyxJQUFKLENBQVMsSUFBQyxDQUFBLElBQVYsRUFBZ0IsSUFBaEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsSUFBRDtpQkFBYyxJQUFBLGdCQUFBLENBQWlCLEtBQUMsQ0FBQSxJQUFsQixFQUF3QixJQUF4QjtRQUFkO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROO0lBRlM7Ozs7S0EzQnFCO0FBTmxDIiwic291cmNlc0NvbnRlbnQiOlsie0J1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xueyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblNlbGVjdFN0YWdlSHVua3MgPSByZXF1aXJlICcuL3NlbGVjdC1zdGFnZS1odW5rcy12aWV3J1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTZWxlY3RTdGFnZUh1bmtGaWxlIGV4dGVuZHMgU2VsZWN0TGlzdFZpZXdcblxuICBpbml0aWFsaXplOiAoQHJlcG8sIGl0ZW1zKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBzZXRJdGVtcyBpdGVtc1xuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgZ2V0RmlsdGVyS2V5OiAtPiAncGF0aCdcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPlxuICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06IChpdGVtKSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3B1bGwtcmlnaHQnLCA9PlxuICAgICAgICAgIEBzcGFuIGNsYXNzOiAnaW5saW5lLWJsb2NrIGhpZ2hsaWdodCcsIGl0ZW0ubW9kZVxuICAgICAgICBAc3BhbiBjbGFzczogJ3RleHQtd2FybmluZycsIGl0ZW0ucGF0aFxuXG4gIGNvbmZpcm1lZDogKHtwYXRofSkgLT5cbiAgICBAY2FuY2VsKClcbiAgICBnaXQuZGlmZihAcmVwbywgcGF0aClcbiAgICAudGhlbiAoZGF0YSkgPT4gbmV3IFNlbGVjdFN0YWdlSHVua3MoQHJlcG8sIGRhdGEpXG4iXX0=
