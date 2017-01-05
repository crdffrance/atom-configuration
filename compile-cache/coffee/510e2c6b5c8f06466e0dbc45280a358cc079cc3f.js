(function() {
  var $, $$, CherryPickSelectCommits, SelectListMultipleView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = CherryPickSelectCommits = (function(superClass) {
    extend(CherryPickSelectCommits, superClass);

    function CherryPickSelectCommits() {
      return CherryPickSelectCommits.__super__.constructor.apply(this, arguments);
    }

    CherryPickSelectCommits.prototype.initialize = function(repo, data) {
      var item;
      this.repo = repo;
      CherryPickSelectCommits.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems((function() {
        var i, len, results;
        results = [];
        for (i = 0, len = data.length; i < len; i++) {
          item = data[i];
          item = item.split('\n');
          results.push({
            hash: item[0],
            author: item[1],
            time: item[2],
            subject: item[3]
          });
        }
        return results;
      })());
      return this.focusFilterEditor();
    };

    CherryPickSelectCommits.prototype.getFilterKey = function() {
      return 'hash';
    };

    CherryPickSelectCommits.prototype.addButtons = function() {
      var viewButton;
      viewButton = $$(function() {
        return this.div({
          "class": 'buttons'
        }, (function(_this) {
          return function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight btn-cancel-button'
              }, 'Cancel');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight btn-pick-button'
              }, 'Cherry-Pick!');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-pick-button')) {
            _this.complete();
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    CherryPickSelectCommits.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    CherryPickSelectCommits.prototype.cancelled = function() {
      return this.hide();
    };

    CherryPickSelectCommits.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    CherryPickSelectCommits.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight inline-block pull-right',
              style: 'font-family: monospace'
            }, function() {
              if (matchedStr != null) {
                return _this.raw(matchedStr);
              } else {
                return _this.span(item.hash);
              }
            });
            _this.div({
              "class": 'text-info'
            }, item.author + ", " + item.time);
            return _this.div({
              "class": 'text-warning'
            }, item.subject);
          };
        })(this));
      });
    };

    CherryPickSelectCommits.prototype.completed = function(items) {
      var commits;
      this.cancel();
      commits = items.map(function(item) {
        return item.hash;
      });
      return git.cmd(['cherry-pick'].concat(commits), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(msg) {
        return notifier.addSuccess(msg);
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
    };

    return CherryPickSelectCommits;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvY2hlcnJ5LXBpY2stc2VsZWN0LWNvbW1pdHMtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDBFQUFBO0lBQUE7OztFQUFBLE1BQVUsT0FBQSxDQUFRLHNCQUFSLENBQVYsRUFBQyxTQUFELEVBQUk7O0VBRUosR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxzQkFBQSxHQUF5QixPQUFBLENBQVEsNkJBQVI7O0VBRXpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7c0NBRUosVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLElBQVI7QUFDVixVQUFBO01BRFcsSUFBQyxDQUFBLE9BQUQ7TUFDWCx5REFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFEOztBQUNFO2FBQUEsc0NBQUE7O1VBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWDt1QkFDUDtZQUFDLElBQUEsRUFBTSxJQUFLLENBQUEsQ0FBQSxDQUFaO1lBQWdCLE1BQUEsRUFBUSxJQUFLLENBQUEsQ0FBQSxDQUE3QjtZQUFpQyxJQUFBLEVBQU0sSUFBSyxDQUFBLENBQUEsQ0FBNUM7WUFBZ0QsT0FBQSxFQUFTLElBQUssQ0FBQSxDQUFBLENBQTlEOztBQUZGOztVQURGO2FBS0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFSVTs7c0NBVVosWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOztzQ0FFZCxVQUFBLEdBQVksU0FBQTtBQUNWLFVBQUE7TUFBQSxVQUFBLEdBQWEsRUFBQSxDQUFHLFNBQUE7ZUFDZCxJQUFDLENBQUEsR0FBRCxDQUFLO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO1NBQUws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QVIsRUFBeUM7UUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7T0FBekMsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLEdBQUQ7ZUFBUyxRQUFRLENBQUMsVUFBVCxDQUFvQixHQUFwQjtNQUFULENBRE4sQ0FFQSxFQUFDLEtBQUQsRUFGQSxDQUVPLFNBQUMsR0FBRDtlQUFTLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQWxCO01BQVQsQ0FGUDtJQUhTOzs7O0tBN0N5QjtBQVB0QyIsInNvdXJjZXNDb250ZW50IjpbInskLCAkJH0gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblNlbGVjdExpc3RNdWx0aXBsZVZpZXcgPSByZXF1aXJlICcuL3NlbGVjdC1saXN0LW11bHRpcGxlLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIENoZXJyeVBpY2tTZWxlY3RDb21taXRzIGV4dGVuZHMgU2VsZWN0TGlzdE11bHRpcGxlVmlld1xuXG4gIGluaXRpYWxpemU6IChAcmVwbywgZGF0YSkgLT5cbiAgICBzdXBlclxuICAgIEBzaG93KClcbiAgICBAc2V0SXRlbXMoXG4gICAgICBmb3IgaXRlbSBpbiBkYXRhXG4gICAgICAgIGl0ZW0gPSBpdGVtLnNwbGl0KCdcXG4nKVxuICAgICAgICB7aGFzaDogaXRlbVswXSwgYXV0aG9yOiBpdGVtWzFdLCB0aW1lOiBpdGVtWzJdLCBzdWJqZWN0OiBpdGVtWzNdfVxuICAgIClcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGdldEZpbHRlcktleTogLT4gJ2hhc2gnXG5cbiAgYWRkQnV0dG9uczogLT5cbiAgICB2aWV3QnV0dG9uID0gJCQgLT5cbiAgICAgIEBkaXYgY2xhc3M6ICdidXR0b25zJywgPT5cbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLWxlZnQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLWVycm9yIGlubGluZS1ibG9jay10aWdodCBidG4tY2FuY2VsLWJ1dHRvbicsICdDYW5jZWwnXG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tc3VjY2VzcyBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLXBpY2stYnV0dG9uJywgJ0NoZXJyeS1QaWNrISdcbiAgICB2aWV3QnV0dG9uLmFwcGVuZFRvKHRoaXMpXG5cbiAgICBAb24gJ2NsaWNrJywgJ2J1dHRvbicsICh7dGFyZ2V0fSkgPT5cbiAgICAgIEBjb21wbGV0ZSgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLXBpY2stYnV0dG9uJylcbiAgICAgIEBjYW5jZWwoKSBpZiAkKHRhcmdldCkuaGFzQ2xhc3MoJ2J0bi1jYW5jZWwtYnV0dG9uJylcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG4gICAgQHBhbmVsLnNob3coKVxuXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06IChpdGVtLCBtYXRjaGVkU3RyKSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgPT5cbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtaGlnaGxpZ2h0IGlubGluZS1ibG9jayBwdWxsLXJpZ2h0Jywgc3R5bGU6ICdmb250LWZhbWlseTogbW9ub3NwYWNlJywgPT5cbiAgICAgICAgICBpZiBtYXRjaGVkU3RyPyB0aGVuIEByYXcobWF0Y2hlZFN0cikgZWxzZSBAc3BhbiBpdGVtLmhhc2hcbiAgICAgICAgQGRpdiBjbGFzczogJ3RleHQtaW5mbycsIFwiI3tpdGVtLmF1dGhvcn0sICN7aXRlbS50aW1lfVwiXG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LXdhcm5pbmcnLCBpdGVtLnN1YmplY3RcblxuICBjb21wbGV0ZWQ6IChpdGVtcykgLT5cbiAgICBAY2FuY2VsKClcbiAgICBjb21taXRzID0gaXRlbXMubWFwIChpdGVtKSAtPiBpdGVtLmhhc2hcbiAgICBnaXQuY21kKFsnY2hlcnJ5LXBpY2snXS5jb25jYXQoY29tbWl0cyksIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChtc2cpIC0+IG5vdGlmaWVyLmFkZFN1Y2Nlc3MgbXNnXG4gICAgLmNhdGNoIChtc2cpIC0+IG5vdGlmaWVyLmFkZEVycm9yIG1zZ1xuIl19
