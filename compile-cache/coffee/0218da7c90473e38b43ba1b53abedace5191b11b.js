(function() {
  var $, CompositeDisposable, GitStashSave, InputView, TextEditorView, View, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  CompositeDisposable = require('atom').CompositeDisposable;

  ref = require('atom-space-pen-views'), $ = ref.$, TextEditorView = ref.TextEditorView, View = ref.View;

  GitStashSave = require('../models/git-stash-save');

  InputView = (function(superClass) {
    extend(InputView, superClass);

    function InputView() {
      return InputView.__super__.constructor.apply(this, arguments);
    }

    InputView.content = function() {
      return this.div((function(_this) {
        return function() {
          return _this.subview('commandEditor', new TextEditorView({
            mini: true,
            placeholderText: 'Stash message'
          }));
        };
      })(this));
    };

    InputView.prototype.initialize = function(repo) {
      var currentPane, disposables, panel;
      disposables = new CompositeDisposable;
      currentPane = atom.workspace.getActivePane();
      panel = atom.workspace.addModalPanel({
        item: this
      });
      panel.show();
      this.commandEditor.focus();
      disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function(e) {
            if (panel != null) {
              panel.destroy();
            }
            currentPane.activate();
            return disposables.dispose();
          };
        })(this)
      }));
      return disposables.add(atom.commands.add('atom-text-editor', 'core:confirm', (function(_this) {
        return function(e) {
          disposables.dispose();
          if (panel != null) {
            panel.destroy();
          }
          GitStashSave(repo, {
            message: _this.commandEditor.getText()
          });
          return currentPane.activate();
        };
      })(this)));
    };

    return InputView;

  })(View);

  module.exports = InputView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvc3Rhc2gtbWVzc2FnZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMEVBQUE7SUFBQTs7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixNQUE0QixPQUFBLENBQVEsc0JBQVIsQ0FBNUIsRUFBQyxTQUFELEVBQUksbUNBQUosRUFBb0I7O0VBRXBCLFlBQUEsR0FBZSxPQUFBLENBQVEsMEJBQVI7O0VBRVQ7Ozs7Ozs7SUFDSixTQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDSCxLQUFDLENBQUEsT0FBRCxDQUFTLGVBQVQsRUFBOEIsSUFBQSxjQUFBLENBQWU7WUFBQSxJQUFBLEVBQU0sSUFBTjtZQUFZLGVBQUEsRUFBaUIsZUFBN0I7V0FBZixDQUE5QjtRQURHO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFMO0lBRFE7O3dCQUlWLFVBQUEsR0FBWSxTQUFDLElBQUQ7QUFDVixVQUFBO01BQUEsV0FBQSxHQUFjLElBQUk7TUFDbEIsV0FBQSxHQUFjLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBO01BQ2QsS0FBQSxHQUFRLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtRQUFBLElBQUEsRUFBTSxJQUFOO09BQTdCO01BQ1IsS0FBSyxDQUFDLElBQU4sQ0FBQTtNQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsS0FBZixDQUFBO01BRUEsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQztRQUFBLGFBQUEsRUFBZSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLENBQUQ7O2NBQ25FLEtBQUssQ0FBRSxPQUFQLENBQUE7O1lBQ0EsV0FBVyxDQUFDLFFBQVosQ0FBQTttQkFDQSxXQUFXLENBQUMsT0FBWixDQUFBO1VBSG1FO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmO09BQXRDLENBQWhCO2FBS0EsV0FBVyxDQUFDLEdBQVosQ0FBZ0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGtCQUFsQixFQUFzQyxjQUF0QyxFQUFzRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsQ0FBRDtVQUNwRSxXQUFXLENBQUMsT0FBWixDQUFBOztZQUNBLEtBQUssQ0FBRSxPQUFQLENBQUE7O1VBQ0EsWUFBQSxDQUFhLElBQWIsRUFBbUI7WUFBQSxPQUFBLEVBQVMsS0FBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBVDtXQUFuQjtpQkFDQSxXQUFXLENBQUMsUUFBWixDQUFBO1FBSm9FO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0RCxDQUFoQjtJQVpVOzs7O0tBTFU7O0VBdUJ4QixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQTVCakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdhdG9tJ1xueyQsIFRleHRFZGl0b3JWaWV3LCBWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5HaXRTdGFzaFNhdmUgPSByZXF1aXJlICcuLi9tb2RlbHMvZ2l0LXN0YXNoLXNhdmUnXG5cbmNsYXNzIElucHV0VmlldyBleHRlbmRzIFZpZXdcbiAgQGNvbnRlbnQ6IC0+XG4gICAgQGRpdiA9PlxuICAgICAgQHN1YnZpZXcgJ2NvbW1hbmRFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXcobWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiAnU3Rhc2ggbWVzc2FnZScpXG5cbiAgaW5pdGlhbGl6ZTogKHJlcG8pIC0+XG4gICAgZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgcGFuZWwgPSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgcGFuZWwuc2hvdygpXG4gICAgQGNvbW1hbmRFZGl0b3IuZm9jdXMoKVxuXG4gICAgZGlzcG9zYWJsZXMuYWRkIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJzogKGUpID0+XG4gICAgICBwYW5lbD8uZGVzdHJveSgpXG4gICAgICBjdXJyZW50UGFuZS5hY3RpdmF0ZSgpXG4gICAgICBkaXNwb3NhYmxlcy5kaXNwb3NlKClcblxuICAgIGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNvbmZpcm0nLCAoZSkgPT5cbiAgICAgIGRpc3Bvc2FibGVzLmRpc3Bvc2UoKVxuICAgICAgcGFuZWw/LmRlc3Ryb3koKVxuICAgICAgR2l0U3Rhc2hTYXZlKHJlcG8sIG1lc3NhZ2U6IEBjb21tYW5kRWRpdG9yLmdldFRleHQoKSlcbiAgICAgIGN1cnJlbnRQYW5lLmFjdGl2YXRlKClcblxubW9kdWxlLmV4cG9ydHMgPSBJbnB1dFZpZXdcbiJdfQ==
