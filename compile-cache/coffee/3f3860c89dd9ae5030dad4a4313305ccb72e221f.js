(function() {
  var LoadingView, TextEditorView, View, ref,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), View = ref.View, TextEditorView = ref.TextEditorView;

  module.exports = LoadingView = (function(superClass) {
    extend(LoadingView, superClass);

    function LoadingView() {
      this.show = bind(this.show, this);
      this.hide = bind(this.hide, this);
      return LoadingView.__super__.constructor.apply(this, arguments);
    }

    LoadingView.content = function() {
      return this.div({
        "class": 'atom-beautify message-panel'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'overlay from-top'
          }, function() {
            return _this.div({
              "class": "tool-panel panel-bottom"
            }, function() {
              return _this.div({
                "class": "inset-panel"
              }, function() {
                _this.div({
                  "class": "panel-heading"
                }, function() {
                  _this.div({
                    "class": 'btn-toolbar pull-right'
                  }, function() {
                    return _this.button({
                      "class": 'btn',
                      click: 'hide'
                    }, 'Hide');
                  });
                  return _this.span({
                    "class": 'text-primary',
                    outlet: 'title'
                  }, 'Atom Beautify');
                });
                return _this.div({
                  "class": "panel-body padded select-list text-center",
                  outlet: 'body'
                }, function() {
                  return _this.div(function() {
                    _this.span({
                      "class": 'text-center loading loading-spinner-large inline-block'
                    });
                    return _this.div({
                      "class": ''
                    }, 'Beautification in progress.');
                  });
                });
              });
            });
          });
        };
      })(this));
    };

    LoadingView.prototype.hide = function(event, element) {
      return this.detach();
    };

    LoadingView.prototype.show = function() {
      if (!this.hasParent()) {
        return atom.workspace.addTopPanel({
          item: this
        });
      }
    };

    return LoadingView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy92aWV3cy9sb2FkaW5nLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzQ0FBQTtJQUFBOzs7O0VBQUEsTUFBeUIsT0FBQSxDQUFRLHNCQUFSLENBQXpCLEVBQUMsZUFBRCxFQUFPOztFQUVQLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7OztJQUNKLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQ0U7UUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLDZCQUFQO09BREYsRUFDd0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNwQyxLQUFDLENBQUEsR0FBRCxDQUNFO1lBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxrQkFBUDtXQURGLEVBQzZCLFNBQUE7bUJBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUs7Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLHlCQUFQO2FBQUwsRUFBdUMsU0FBQTtxQkFDckMsS0FBQyxDQUFBLEdBQUQsQ0FBSztnQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLGFBQVA7ZUFBTCxFQUEyQixTQUFBO2dCQUN6QixLQUFDLENBQUEsR0FBRCxDQUFLO2tCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sZUFBUDtpQkFBTCxFQUE2QixTQUFBO2tCQUMzQixLQUFDLENBQUEsR0FBRCxDQUFLO29CQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sd0JBQVA7bUJBQUwsRUFBc0MsU0FBQTsyQkFDcEMsS0FBQyxDQUFBLE1BQUQsQ0FDRTtzQkFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLEtBQVA7c0JBQ0EsS0FBQSxFQUFPLE1BRFA7cUJBREYsRUFHRSxNQUhGO2tCQURvQyxDQUF0Qzt5QkFLQSxLQUFDLENBQUEsSUFBRCxDQUNFO29CQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sY0FBUDtvQkFDQSxNQUFBLEVBQVEsT0FEUjttQkFERixFQUdFLGVBSEY7Z0JBTjJCLENBQTdCO3VCQVVBLEtBQUMsQ0FBQSxHQUFELENBQ0U7a0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTywyQ0FBUDtrQkFDQSxNQUFBLEVBQVEsTUFEUjtpQkFERixFQUdFLFNBQUE7eUJBQ0UsS0FBQyxDQUFBLEdBQUQsQ0FBSyxTQUFBO29CQUNILEtBQUMsQ0FBQSxJQUFELENBQ0U7c0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyx3REFBUDtxQkFERjsyQkFFQSxLQUFDLENBQUEsR0FBRCxDQUNFO3NCQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sRUFBUDtxQkFERixFQUVFLDZCQUZGO2tCQUhHLENBQUw7Z0JBREYsQ0FIRjtjQVh5QixDQUEzQjtZQURxQyxDQUF2QztVQUR5QixDQUQ3QjtRQURvQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FEeEM7SUFEUTs7MEJBNEJWLElBQUEsR0FBTSxTQUFDLEtBQUQsRUFBUSxPQUFSO2FBQ0osSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQURJOzswQkFHTixJQUFBLEdBQU0sU0FBQTtNQUNKLElBQUcsQ0FBSSxJQUFDLENBQUMsU0FBRixDQUFBLENBQVA7ZUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQWYsQ0FBMkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUEzQixFQURGOztJQURJOzs7O0tBaENrQjtBQUgxQiIsInNvdXJjZXNDb250ZW50IjpbIntWaWV3LCBUZXh0RWRpdG9yVmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTG9hZGluZ1ZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXZcbiAgICAgIGNsYXNzOiAnYXRvbS1iZWF1dGlmeSBtZXNzYWdlLXBhbmVsJywgPT5cbiAgICAgICAgQGRpdlxuICAgICAgICAgIGNsYXNzOiAnb3ZlcmxheSBmcm9tLXRvcCcsID0+XG4gICAgICAgICAgICBAZGl2IGNsYXNzOiBcInRvb2wtcGFuZWwgcGFuZWwtYm90dG9tXCIsID0+XG4gICAgICAgICAgICAgIEBkaXYgY2xhc3M6IFwiaW5zZXQtcGFuZWxcIiwgPT5cbiAgICAgICAgICAgICAgICBAZGl2IGNsYXNzOiBcInBhbmVsLWhlYWRpbmdcIiwgPT5cbiAgICAgICAgICAgICAgICAgIEBkaXYgY2xhc3M6ICdidG4tdG9vbGJhciBwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICAgICAgICAgICAgQGJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnYnRuJ1xuICAgICAgICAgICAgICAgICAgICAgIGNsaWNrOiAnaGlkZSdcbiAgICAgICAgICAgICAgICAgICAgICAnSGlkZSdcbiAgICAgICAgICAgICAgICAgIEBzcGFuXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzOiAndGV4dC1wcmltYXJ5J1xuICAgICAgICAgICAgICAgICAgICBvdXRsZXQ6ICd0aXRsZSdcbiAgICAgICAgICAgICAgICAgICAgJ0F0b20gQmVhdXRpZnknXG4gICAgICAgICAgICAgICAgQGRpdlxuICAgICAgICAgICAgICAgICAgY2xhc3M6IFwicGFuZWwtYm9keSBwYWRkZWQgc2VsZWN0LWxpc3QgdGV4dC1jZW50ZXJcIlxuICAgICAgICAgICAgICAgICAgb3V0bGV0OiAnYm9keSdcbiAgICAgICAgICAgICAgICAgID0+XG4gICAgICAgICAgICAgICAgICAgIEBkaXYgPT5cbiAgICAgICAgICAgICAgICAgICAgICBAc3BhblxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICd0ZXh0LWNlbnRlciBsb2FkaW5nIGxvYWRpbmctc3Bpbm5lci1sYXJnZSBpbmxpbmUtYmxvY2snXG4gICAgICAgICAgICAgICAgICAgICAgQGRpdlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICcnXG4gICAgICAgICAgICAgICAgICAgICAgICAnQmVhdXRpZmljYXRpb24gaW4gcHJvZ3Jlc3MuJ1xuXG4gIGhpZGU6IChldmVudCwgZWxlbWVudCkgPT5cbiAgICBAZGV0YWNoKClcblxuICBzaG93OiA9PlxuICAgIGlmIG5vdCBALmhhc1BhcmVudCgpXG4gICAgICBhdG9tLndvcmtzcGFjZS5hZGRUb3BQYW5lbChpdGVtOiBAKVxuIl19
