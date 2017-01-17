(function() {
  var $$, OverrideView, SelectListView, path, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  path = require('path');

  module.exports = OverrideView = (function(superClass) {
    extend(OverrideView, superClass);

    function OverrideView() {
      return OverrideView.__super__.constructor.apply(this, arguments);
    }

    OverrideView.prototype.initialize = function(matches) {
      OverrideView.__super__.initialize.apply(this, arguments);
      this.storeFocusedElement();
      this.addClass('symbols-view');
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.setLoading('Looking for methods');
      this.focusFilterEditor();
      this.indent = 0;
      return this.bufferPosition = null;
    };

    OverrideView.prototype.destroy = function() {
      this.cancel();
      return this.panel.destroy();
    };

    OverrideView.prototype.viewForItem = function(arg) {
      var _, column, fileName, line, moduleName, name, params, parent, ref1, relativePath;
      parent = arg.parent, name = arg.name, params = arg.params, moduleName = arg.moduleName, fileName = arg.fileName, line = arg.line, column = arg.column;
      if (!line) {
        return $$(function() {
          return this.li({
            "class": 'two-lines'
          }, (function(_this) {
            return function() {
              _this.div(parent + "." + name, {
                "class": 'primary-line'
              });
              return _this.div('builtin', {
                "class": 'secondary-line'
              });
            };
          })(this));
        });
      } else {
        ref1 = atom.project.relativizePath(fileName), _ = ref1[0], relativePath = ref1[1];
        return $$(function() {
          return this.li({
            "class": 'two-lines'
          }, (function(_this) {
            return function() {
              _this.div(parent + "." + name, {
                "class": 'primary-line'
              });
              return _this.div(relativePath + ", line " + line, {
                "class": 'secondary-line'
              });
            };
          })(this));
        });
      }
    };

    OverrideView.prototype.getFilterKey = function() {
      return 'name';
    };

    OverrideView.prototype.getEmptyMessage = function(itemCount) {
      if (itemCount === 0) {
        return 'No methods found';
      } else {
        return OverrideView.__super__.getEmptyMessage.apply(this, arguments);
      }
    };

    OverrideView.prototype.confirmed = function(arg) {
      var column, editor, instance, line, line1, line2, name, params, parent, superCall, tabLength, tabText, userIndent;
      parent = arg.parent, instance = arg.instance, name = arg.name, params = arg.params, line = arg.line, column = arg.column;
      this.cancelPosition = null;
      this.cancel();
      editor = atom.workspace.getActiveTextEditor();
      tabLength = editor.getTabLength();
      line1 = "def " + name + "(" + (['self'].concat(params).join(', ')) + "):";
      superCall = "super(" + instance + ", self)." + name + "(" + (params.join(', ')) + ")";
      if (name === '__init__') {
        line2 = "" + superCall;
      } else {
        line2 = "return " + superCall;
      }
      if (this.indent < 1) {
        tabText = editor.getTabText();
        editor.insertText("" + tabText + line1);
        editor.insertNewlineBelow();
        return editor.setTextInBufferRange([[this.bufferPosition.row + 1, 0], [this.bufferPosition.row + 1, tabLength * 2]], "" + tabText + tabText + line2);
      } else {
        userIndent = editor.getTextInRange([[this.bufferPosition.row, 0], [this.bufferPosition.row, this.bufferPosition.column]]);
        editor.insertText("" + line1);
        editor.insertNewlineBelow();
        return editor.setTextInBufferRange([[this.bufferPosition.row + 1, 0], [this.bufferPosition.row + 1, tabLength * 2]], "" + userIndent + userIndent + line2);
      }
    };

    OverrideView.prototype.cancelled = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.hide() : void 0;
    };

    return OverrideView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9vdmVycmlkZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsMkNBQUE7SUFBQTs7O0VBQUEsTUFBdUIsT0FBQSxDQUFRLHNCQUFSLENBQXZCLEVBQUMsV0FBRCxFQUFLOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFFUCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7OzJCQUNKLFVBQUEsR0FBWSxTQUFDLE9BQUQ7TUFDViw4Q0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLG1CQUFELENBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGNBQVY7O1FBQ0EsSUFBQyxDQUFBLFFBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFmLENBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0I7O01BQ1YsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFDLENBQUEsVUFBRCxDQUFZLHFCQUFaO01BQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7TUFDQSxJQUFDLENBQUEsTUFBRCxHQUFVO2FBQ1YsSUFBQyxDQUFBLGNBQUQsR0FBa0I7SUFUUjs7MkJBV1osT0FBQSxHQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsTUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUE7SUFGTzs7MkJBSVQsV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxxQkFBUSxpQkFBTSxxQkFBUSw2QkFBWSx5QkFBVSxpQkFBTTtNQUMvRCxJQUFHLENBQUksSUFBUDtBQUNFLGVBQU8sRUFBQSxDQUFHLFNBQUE7aUJBQ1IsSUFBQyxDQUFBLEVBQUQsQ0FBSTtZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDtXQUFKLEVBQXdCLENBQUEsU0FBQSxLQUFBO21CQUFBLFNBQUE7Y0FDdEIsS0FBQyxDQUFBLEdBQUQsQ0FBUSxNQUFELEdBQVEsR0FBUixHQUFXLElBQWxCLEVBQTBCO2dCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FBUDtlQUExQjtxQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLLFNBQUwsRUFBZ0I7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxnQkFBUDtlQUFoQjtZQUZzQjtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7UUFEUSxDQUFILEVBRFQ7T0FBQSxNQUFBO1FBTUUsT0FBb0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQXBCLEVBQUMsV0FBRCxFQUFJO0FBQ0osZUFBTyxFQUFBLENBQUcsU0FBQTtpQkFDUixJQUFDLENBQUEsRUFBRCxDQUFJO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxXQUFQO1dBQUosRUFBd0IsQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQTtjQUN0QixLQUFDLENBQUEsR0FBRCxDQUFRLE1BQUQsR0FBUSxHQUFSLEdBQVcsSUFBbEIsRUFBMEI7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxjQUFQO2VBQTFCO3FCQUNBLEtBQUMsQ0FBQSxHQUFELENBQVEsWUFBRCxHQUFjLFNBQWQsR0FBdUIsSUFBOUIsRUFBc0M7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxnQkFBUDtlQUF0QztZQUZzQjtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEI7UUFEUSxDQUFILEVBUFQ7O0lBRFc7OzJCQWFiLFlBQUEsR0FBYyxTQUFBO2FBQUc7SUFBSDs7MkJBRWQsZUFBQSxHQUFpQixTQUFDLFNBQUQ7TUFDZixJQUFHLFNBQUEsS0FBYSxDQUFoQjtlQUNFLG1CQURGO09BQUEsTUFBQTtlQUdFLG1EQUFBLFNBQUEsRUFIRjs7SUFEZTs7MkJBTWpCLFNBQUEsR0FBVyxTQUFDLEdBQUQ7QUFDVCxVQUFBO01BRFcscUJBQVEseUJBQVUsaUJBQU0scUJBQVEsaUJBQU07TUFDakQsSUFBQyxDQUFBLGNBQUQsR0FBa0I7TUFDbEIsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUNBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7TUFDVCxTQUFBLEdBQVksTUFBTSxDQUFDLFlBQVAsQ0FBQTtNQUVaLEtBQUEsR0FBUSxNQUFBLEdBQU8sSUFBUCxHQUFZLEdBQVosR0FBYyxDQUFDLENBQUMsTUFBRCxDQUFRLENBQUMsTUFBVCxDQUFnQixNQUFoQixDQUF1QixDQUFDLElBQXhCLENBQTZCLElBQTdCLENBQUQsQ0FBZCxHQUFrRDtNQUMxRCxTQUFBLEdBQVksUUFBQSxHQUFTLFFBQVQsR0FBa0IsVUFBbEIsR0FBNEIsSUFBNUIsR0FBaUMsR0FBakMsR0FBbUMsQ0FBQyxNQUFNLENBQUMsSUFBUCxDQUFZLElBQVosQ0FBRCxDQUFuQyxHQUFzRDtNQUNsRSxJQUFHLElBQUEsS0FBUyxVQUFaO1FBQ0UsS0FBQSxHQUFRLEVBQUEsR0FBRyxVQURiO09BQUEsTUFBQTtRQUdFLEtBQUEsR0FBUSxTQUFBLEdBQVUsVUFIcEI7O01BS0EsSUFBRyxJQUFDLENBQUEsTUFBRCxHQUFVLENBQWI7UUFDRSxPQUFBLEdBQVUsTUFBTSxDQUFDLFVBQVAsQ0FBQTtRQUNWLE1BQU0sQ0FBQyxVQUFQLENBQWtCLEVBQUEsR0FBRyxPQUFILEdBQWEsS0FBL0I7UUFDQSxNQUFNLENBQUMsa0JBQVAsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUN4QixDQUFDLElBQUMsQ0FBQSxjQUFjLENBQUMsR0FBaEIsR0FBc0IsQ0FBdkIsRUFBMEIsQ0FBMUIsQ0FEd0IsRUFFeEIsQ0FBQyxJQUFDLENBQUEsY0FBYyxDQUFDLEdBQWhCLEdBQXNCLENBQXZCLEVBQTBCLFNBQUEsR0FBWSxDQUF0QyxDQUZ3QixDQUE1QixFQUlFLEVBQUEsR0FBRyxPQUFILEdBQWEsT0FBYixHQUF1QixLQUp6QixFQUpGO09BQUEsTUFBQTtRQVdFLFVBQUEsR0FBYSxNQUFNLENBQUMsY0FBUCxDQUFzQixDQUNqQyxDQUFDLElBQUMsQ0FBQSxjQUFjLENBQUMsR0FBakIsRUFBc0IsQ0FBdEIsQ0FEaUMsRUFFakMsQ0FBQyxJQUFDLENBQUEsY0FBYyxDQUFDLEdBQWpCLEVBQXNCLElBQUMsQ0FBQSxjQUFjLENBQUMsTUFBdEMsQ0FGaUMsQ0FBdEI7UUFJYixNQUFNLENBQUMsVUFBUCxDQUFrQixFQUFBLEdBQUcsS0FBckI7UUFDQSxNQUFNLENBQUMsa0JBQVAsQ0FBQTtlQUNBLE1BQU0sQ0FBQyxvQkFBUCxDQUE0QixDQUN4QixDQUFDLElBQUMsQ0FBQSxjQUFjLENBQUMsR0FBaEIsR0FBc0IsQ0FBdkIsRUFBMEIsQ0FBMUIsQ0FEd0IsRUFFeEIsQ0FBQyxJQUFDLENBQUEsY0FBYyxDQUFDLEdBQWhCLEdBQXNCLENBQXZCLEVBQTBCLFNBQUEsR0FBWSxDQUF0QyxDQUZ3QixDQUE1QixFQUlFLEVBQUEsR0FBRyxVQUFILEdBQWdCLFVBQWhCLEdBQTZCLEtBSi9CLEVBakJGOztJQWJTOzsyQkFvQ1gsU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBOytDQUFNLENBQUUsSUFBUixDQUFBO0lBRFM7Ozs7S0F6RWM7QUFKM0IiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIE92ZXJyaWRlVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG4gIGluaXRpYWxpemU6IChtYXRjaGVzKSAtPlxuICAgIHN1cGVyXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuICAgIEBhZGRDbGFzcygnc3ltYm9scy12aWV3JylcbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcbiAgICBAc2V0TG9hZGluZygnTG9va2luZyBmb3IgbWV0aG9kcycpXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcbiAgICBAaW5kZW50ID0gMFxuICAgIEBidWZmZXJQb3NpdGlvbiA9IG51bGxcblxuICBkZXN0cm95OiAtPlxuICAgIEBjYW5jZWwoKVxuICAgIEBwYW5lbC5kZXN0cm95KClcblxuICB2aWV3Rm9ySXRlbTogKHtwYXJlbnQsIG5hbWUsIHBhcmFtcywgbW9kdWxlTmFtZSwgZmlsZU5hbWUsIGxpbmUsIGNvbHVtbn0pIC0+XG4gICAgaWYgbm90IGxpbmVcbiAgICAgIHJldHVybiAkJCAtPlxuICAgICAgICBAbGkgY2xhc3M6ICd0d28tbGluZXMnLCA9PlxuICAgICAgICAgIEBkaXYgXCIje3BhcmVudH0uI3tuYW1lfVwiLCBjbGFzczogJ3ByaW1hcnktbGluZSdcbiAgICAgICAgICBAZGl2ICdidWlsdGluJywgY2xhc3M6ICdzZWNvbmRhcnktbGluZSdcbiAgICBlbHNlXG4gICAgICBbXywgcmVsYXRpdmVQYXRoXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlTmFtZSlcbiAgICAgIHJldHVybiAkJCAtPlxuICAgICAgICBAbGkgY2xhc3M6ICd0d28tbGluZXMnLCA9PlxuICAgICAgICAgIEBkaXYgXCIje3BhcmVudH0uI3tuYW1lfVwiLCBjbGFzczogJ3ByaW1hcnktbGluZSdcbiAgICAgICAgICBAZGl2IFwiI3tyZWxhdGl2ZVBhdGh9LCBsaW5lICN7bGluZX1cIiwgY2xhc3M6ICdzZWNvbmRhcnktbGluZSdcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICduYW1lJ1xuXG4gIGdldEVtcHR5TWVzc2FnZTogKGl0ZW1Db3VudCkgLT5cbiAgICBpZiBpdGVtQ291bnQgaXMgMFxuICAgICAgJ05vIG1ldGhvZHMgZm91bmQnXG4gICAgZWxzZVxuICAgICAgc3VwZXJcblxuICBjb25maXJtZWQ6ICh7cGFyZW50LCBpbnN0YW5jZSwgbmFtZSwgcGFyYW1zLCBsaW5lLCBjb2x1bW59KSAtPlxuICAgIEBjYW5jZWxQb3NpdGlvbiA9IG51bGxcbiAgICBAY2FuY2VsKClcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICB0YWJMZW5ndGggPSBlZGl0b3IuZ2V0VGFiTGVuZ3RoKClcblxuICAgIGxpbmUxID0gXCJkZWYgI3tuYW1lfSgje1snc2VsZiddLmNvbmNhdChwYXJhbXMpLmpvaW4oJywgJyl9KTpcIlxuICAgIHN1cGVyQ2FsbCA9IFwic3VwZXIoI3tpbnN0YW5jZX0sIHNlbGYpLiN7bmFtZX0oI3twYXJhbXMuam9pbignLCAnKX0pXCJcbiAgICBpZiBuYW1lIGluIFsnX19pbml0X18nXVxuICAgICAgbGluZTIgPSBcIiN7c3VwZXJDYWxsfVwiXG4gICAgZWxzZVxuICAgICAgbGluZTIgPSBcInJldHVybiAje3N1cGVyQ2FsbH1cIlxuXG4gICAgaWYgQGluZGVudCA8IDFcbiAgICAgIHRhYlRleHQgPSBlZGl0b3IuZ2V0VGFiVGV4dCgpXG4gICAgICBlZGl0b3IuaW5zZXJ0VGV4dChcIiN7dGFiVGV4dH0je2xpbmUxfVwiKVxuICAgICAgZWRpdG9yLmluc2VydE5ld2xpbmVCZWxvdygpXG4gICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UgW1xuICAgICAgICAgIFtAYnVmZmVyUG9zaXRpb24ucm93ICsgMSwgMF0sXG4gICAgICAgICAgW0BidWZmZXJQb3NpdGlvbi5yb3cgKyAxLCB0YWJMZW5ndGggKiAyXVxuICAgICAgICBdLFxuICAgICAgICBcIiN7dGFiVGV4dH0je3RhYlRleHR9I3tsaW5lMn1cIlxuXG4gICAgZWxzZVxuICAgICAgdXNlckluZGVudCA9IGVkaXRvci5nZXRUZXh0SW5SYW5nZShbXG4gICAgICAgIFtAYnVmZmVyUG9zaXRpb24ucm93LCAwXSxcbiAgICAgICAgW0BidWZmZXJQb3NpdGlvbi5yb3csIEBidWZmZXJQb3NpdGlvbi5jb2x1bW5dXG4gICAgICBdKVxuICAgICAgZWRpdG9yLmluc2VydFRleHQoXCIje2xpbmUxfVwiKVxuICAgICAgZWRpdG9yLmluc2VydE5ld2xpbmVCZWxvdygpXG4gICAgICBlZGl0b3Iuc2V0VGV4dEluQnVmZmVyUmFuZ2UgW1xuICAgICAgICAgIFtAYnVmZmVyUG9zaXRpb24ucm93ICsgMSwgMF0sXG4gICAgICAgICAgW0BidWZmZXJQb3NpdGlvbi5yb3cgKyAxLCB0YWJMZW5ndGggKiAyXVxuICAgICAgICBdLFxuICAgICAgICBcIiN7dXNlckluZGVudH0je3VzZXJJbmRlbnR9I3tsaW5lMn1cIlxuXG4gIGNhbmNlbGxlZDogLT5cbiAgICBAcGFuZWw/LmhpZGUoKVxuIl19
