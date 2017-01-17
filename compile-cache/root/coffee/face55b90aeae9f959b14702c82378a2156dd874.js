(function() {
  var $, $$, EditorView, SelectListMultipleView, SelectStageFilesView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, EditorView = ref.EditorView;

  git = require('../git');

  notifier = require('../notifier');

  SelectListMultipleView = require('./select-list-multiple-view');

  module.exports = SelectStageFilesView = (function(superClass) {
    var prettify;

    extend(SelectStageFilesView, superClass);

    function SelectStageFilesView() {
      return SelectStageFilesView.__super__.constructor.apply(this, arguments);
    }

    SelectStageFilesView.prototype.initialize = function(repo, items) {
      this.repo = repo;
      SelectStageFilesView.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    SelectStageFilesView.prototype.addButtons = function() {
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
                "class": 'btn btn-success inline-block-tight btn-remove-button'
              }, 'Remove');
            });
          };
        })(this));
      });
      viewButton.appendTo(this);
      return this.on('click', 'button', (function(_this) {
        return function(arg) {
          var target;
          target = arg.target;
          if ($(target).hasClass('btn-remove-button')) {
            if (window.confirm('Are you sure?')) {
              _this.complete();
            }
          }
          if ($(target).hasClass('btn-cancel-button')) {
            return _this.cancel();
          }
        };
      })(this));
    };

    SelectStageFilesView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    SelectStageFilesView.prototype.cancelled = function() {
      return this.hide();
    };

    SelectStageFilesView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    SelectStageFilesView.prototype.viewForItem = function(item, matchedStr) {
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(item);
            }
          };
        })(this));
      });
    };

    SelectStageFilesView.prototype.completed = function(items) {
      var currentFile, editor, files, item, ref1;
      files = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = items.length; j < len; j++) {
          item = items[j];
          if (item !== '') {
            results.push(item);
          }
        }
        return results;
      })();
      this.cancel();
      currentFile = this.repo.relativize((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0);
      editor = atom.workspace.getActiveTextEditor();
      if (indexOf.call(files, currentFile) >= 0) {
        atom.views.getView(editor).remove();
      }
      return git.cmd(['rm', '-f'].concat(files), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(data) {
        return notifier.addSuccess("Removed " + (prettify(data)));
      });
    };

    prettify = function(data) {
      var file, i, j, len, results;
      data = data.match(/rm ('.*')/g);
      if ((data != null ? data.length : void 0) >= 1) {
        results = [];
        for (i = j = 0, len = data.length; j < len; i = ++j) {
          file = data[i];
          results.push(data[i] = ' ' + file.match(/rm '(.*)'/)[1]);
        }
        return results;
      }
    };

    return SelectStageFilesView;

  })(SelectListMultipleView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVtb3ZlLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG1GQUFBO0lBQUE7Ozs7RUFBQSxNQUFzQixPQUFBLENBQVEsc0JBQVIsQ0FBdEIsRUFBQyxTQUFELEVBQUksV0FBSixFQUFROztFQUVSLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsc0JBQUEsR0FBeUIsT0FBQSxDQUFRLDZCQUFSOztFQUV6QixNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosUUFBQTs7Ozs7Ozs7bUNBQUEsVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLEtBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUNYLHNEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxLQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFKVTs7bUNBTVosVUFBQSxHQUFZLFNBQUE7QUFDVixVQUFBO01BQUEsVUFBQSxHQUFhLEVBQUEsQ0FBRyxTQUFBO2VBQ2QsSUFBQyxDQUFBLEdBQUQsQ0FBSztVQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sU0FBUDtTQUFMLEVBQXVCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7WUFDckIsS0FBQyxDQUFBLElBQUQsQ0FBTTtjQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sV0FBUDthQUFOLEVBQTBCLFNBQUE7cUJBQ3hCLEtBQUMsQ0FBQSxNQUFELENBQVE7Z0JBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxvREFBUDtlQUFSLEVBQXFFLFFBQXJFO1lBRHdCLENBQTFCO21CQUVBLEtBQUMsQ0FBQSxJQUFELENBQU07Y0FBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLFlB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QUNFO2FBQUEsOENBQUE7O3VCQUNFLElBQUssQ0FBQSxDQUFBLENBQUwsR0FBVSxHQUFBLEdBQU0sSUFBSSxDQUFDLEtBQUwsQ0FBVyxXQUFYLENBQXdCLENBQUEsQ0FBQTtBQUQxQzt1QkFERjs7SUFGUzs7OztLQWhEc0I7QUFQbkMiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCwgJCQsIEVkaXRvclZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5TZWxlY3RMaXN0TXVsdGlwbGVWaWV3ID0gcmVxdWlyZSAnLi9zZWxlY3QtbGlzdC1tdWx0aXBsZS12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBTZWxlY3RTdGFnZUZpbGVzVmlldyBleHRlbmRzIFNlbGVjdExpc3RNdWx0aXBsZVZpZXdcblxuICBpbml0aWFsaXplOiAoQHJlcG8sIGl0ZW1zKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBzZXRJdGVtcyBpdGVtc1xuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgYWRkQnV0dG9uczogLT5cbiAgICB2aWV3QnV0dG9uID0gJCQgLT5cbiAgICAgIEBkaXYgY2xhc3M6ICdidXR0b25zJywgPT5cbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLWxlZnQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLWVycm9yIGlubGluZS1ibG9jay10aWdodCBidG4tY2FuY2VsLWJ1dHRvbicsICdDYW5jZWwnXG4gICAgICAgIEBzcGFuIGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgQGJ1dHRvbiBjbGFzczogJ2J0biBidG4tc3VjY2VzcyBpbmxpbmUtYmxvY2stdGlnaHQgYnRuLXJlbW92ZS1idXR0b24nLCAnUmVtb3ZlJ1xuICAgIHZpZXdCdXR0b24uYXBwZW5kVG8odGhpcylcblxuICAgIEBvbiAnY2xpY2snLCAnYnV0dG9uJywgKHt0YXJnZXR9KSA9PlxuICAgICAgaWYgJCh0YXJnZXQpLmhhc0NsYXNzKCdidG4tcmVtb3ZlLWJ1dHRvbicpXG4gICAgICAgIEBjb21wbGV0ZSgpIGlmIHdpbmRvdy5jb25maXJtICdBcmUgeW91IHN1cmU/J1xuICAgICAgQGNhbmNlbCgpIGlmICQodGFyZ2V0KS5oYXNDbGFzcygnYnRuLWNhbmNlbC1idXR0b24nKVxuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT5cbiAgICBAaGlkZSgpXG5cbiAgaGlkZTogLT5cbiAgICBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoaXRlbSwgbWF0Y2hlZFN0cikgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpID0+XG4gICAgICAgIGlmIG1hdGNoZWRTdHI/IHRoZW4gQHJhdyhtYXRjaGVkU3RyKSBlbHNlIEBzcGFuIGl0ZW1cblxuICBjb21wbGV0ZWQ6IChpdGVtcykgLT5cbiAgICBmaWxlcyA9IChpdGVtIGZvciBpdGVtIGluIGl0ZW1zIHdoZW4gaXRlbSBpc250ICcnKVxuICAgIEBjYW5jZWwoKVxuICAgIGN1cnJlbnRGaWxlID0gQHJlcG8ucmVsYXRpdml6ZSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk/LmdldFBhdGgoKVxuXG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcikucmVtb3ZlKCkgaWYgY3VycmVudEZpbGUgaW4gZmlsZXNcbiAgICBnaXQuY21kKFsncm0nLCAnLWYnXS5jb25jYXQoZmlsZXMpLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAoZGF0YSkgLT4gbm90aWZpZXIuYWRkU3VjY2VzcyBcIlJlbW92ZWQgI3twcmV0dGlmeSBkYXRhfVwiXG5cbiAgcHJldHRpZnkgPSAoZGF0YSkgLT5cbiAgICBkYXRhID0gZGF0YS5tYXRjaCgvcm0gKCcuKicpL2cpXG4gICAgaWYgZGF0YT8ubGVuZ3RoID49IDFcbiAgICAgIGZvciBmaWxlLCBpIGluIGRhdGFcbiAgICAgICAgZGF0YVtpXSA9ICcgJyArIGZpbGUubWF0Y2goL3JtICcoLiopJy8pWzFdXG4iXX0=
