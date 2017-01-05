(function() {
  var RenameView, TextEditorView, View,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  View = require('space-pen').View;

  TextEditorView = require('atom-space-pen-views').TextEditorView;

  module.exports = RenameView = (function(superClass) {
    extend(RenameView, superClass);

    function RenameView() {
      return RenameView.__super__.constructor.apply(this, arguments);
    }

    RenameView.prototype.initialize = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: true
        });
      }
      return atom.commands.add(this.element, 'core:cancel', (function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this));
    };

    RenameView.prototype.destroy = function() {
      this.panel.hide();
      this.focusout();
      return this.panel.destroy();
    };

    RenameView.content = function(usages) {
      var n, name;
      n = usages.length;
      name = usages[0].name;
      return this.div((function(_this) {
        return function() {
          _this.div("Type new name to replace " + n + " occurences of " + name + " within project:");
          return _this.subview('miniEditor', new TextEditorView({
            mini: true,
            placeholderText: name
          }));
        };
      })(this));
    };

    RenameView.prototype.onInput = function(callback) {
      this.miniEditor.focus();
      return atom.commands.add(this.element, {
        'core:confirm': (function(_this) {
          return function() {
            callback(_this.miniEditor.getText());
            return _this.destroy();
          };
        })(this)
      });
    };

    return RenameView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9yZW5hbWUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLGdDQUFBO0lBQUE7OztFQUFDLE9BQVEsT0FBQSxDQUFRLFdBQVI7O0VBQ1IsaUJBQWtCLE9BQUEsQ0FBUSxzQkFBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozt5QkFDSixVQUFBLEdBQVksU0FBQTs7UUFDVixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtVQUFTLE9BQUEsRUFBUyxJQUFsQjtTQUE3Qjs7YUFDVixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsSUFBQyxDQUFBLE9BQW5CLEVBQTRCLGFBQTVCLEVBQTJDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFBO1FBQUg7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNDO0lBRlU7O3lCQUlaLE9BQUEsR0FBUyxTQUFBO01BQ1AsSUFBQyxDQUFBLEtBQUssQ0FBQyxJQUFQLENBQUE7TUFDQSxJQUFDLENBQUMsUUFBRixDQUFBO2FBQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxPQUFQLENBQUE7SUFITzs7SUFLVCxVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUMsTUFBRDtBQUNSLFVBQUE7TUFBQSxDQUFBLEdBQUksTUFBTSxDQUFDO01BQ1gsSUFBQSxHQUFPLE1BQU8sQ0FBQSxDQUFBLENBQUUsQ0FBQzthQUNqQixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNILEtBQUMsQ0FBQSxHQUFELENBQUssMkJBQUEsR0FBNEIsQ0FBNUIsR0FBOEIsaUJBQTlCLEdBQStDLElBQS9DLEdBQW9ELGtCQUF6RDtpQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFBLENBQ3pCO1lBQUEsSUFBQSxFQUFNLElBQU47WUFBWSxlQUFBLEVBQWlCLElBQTdCO1dBRHlCLENBQTNCO1FBRkc7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQUw7SUFIUTs7eUJBUVYsT0FBQSxHQUFTLFNBQUMsUUFBRDtNQUNQLElBQUMsQ0FBQSxVQUFVLENBQUMsS0FBWixDQUFBO2FBQ0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLElBQUMsQ0FBQSxPQUFuQixFQUE0QjtRQUFBLGNBQUEsRUFBZ0IsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUMxQyxRQUFBLENBQVMsS0FBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsQ0FBVDttQkFDQSxLQUFDLENBQUEsT0FBRCxDQUFBO1VBRjBDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFoQjtPQUE1QjtJQUZPOzs7O0tBbEJjO0FBSnpCIiwic291cmNlc0NvbnRlbnQiOlsie1ZpZXd9ID0gcmVxdWlyZSAnc3BhY2UtcGVuJ1xue1RleHRFZGl0b3JWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBSZW5hbWVWaWV3IGV4dGVuZHMgVmlld1xuICBpbml0aWFsaXplOiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IEAsIHZpc2libGU6IHRydWUpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQoQGVsZW1lbnQsICdjb3JlOmNhbmNlbCcsID0+IEBkZXN0cm95KCkpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAcGFuZWwuaGlkZSgpXG4gICAgQC5mb2N1c291dCgpXG4gICAgQHBhbmVsLmRlc3Ryb3koKVxuXG4gIEBjb250ZW50OiAodXNhZ2VzKSAtPlxuICAgIG4gPSB1c2FnZXMubGVuZ3RoXG4gICAgbmFtZSA9IHVzYWdlc1swXS5uYW1lXG4gICAgQGRpdiA9PlxuICAgICAgQGRpdiBcIlR5cGUgbmV3IG5hbWUgdG8gcmVwbGFjZSAje259IG9jY3VyZW5jZXMgb2YgI3tuYW1lfSB3aXRoaW4gcHJvamVjdDpcIlxuICAgICAgQHN1YnZpZXcgJ21pbmlFZGl0b3InLCBuZXcgVGV4dEVkaXRvclZpZXdcbiAgICAgICAgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBuYW1lXG5cbiAgb25JbnB1dDogKGNhbGxiYWNrKSAtPlxuICAgIEBtaW5pRWRpdG9yLmZvY3VzKClcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBAZWxlbWVudCwgJ2NvcmU6Y29uZmlybSc6ID0+XG4gICAgICBjYWxsYmFjayhAbWluaUVkaXRvci5nZXRUZXh0KCkpXG4gICAgICBAZGVzdHJveSgpXG4iXX0=
