(function() {
  var $$, ListView, OutputViewManager, SelectListView, fs, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs-plus');

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      ListView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    ListView.prototype.parseData = function() {
      var branches, i, item, items, len;
      items = this.data.split("\n");
      branches = [];
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        item = item.replace(/\s/g, '');
        if (item !== '') {
          branches.push({
            name: item
          });
        }
      }
      this.setItems(branches);
      return this.focusFilterEditor();
    };

    ListView.prototype.getFilterKey = function() {
      return 'name';
    };

    ListView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    ListView.prototype.cancelled = function() {
      return this.hide();
    };

    ListView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    ListView.prototype.viewForItem = function(arg) {
      var current, name;
      name = arg.name;
      current = false;
      if (name.startsWith("*")) {
        name = name.slice(1);
        current = true;
      }
      return $$(function() {
        return this.li(name, (function(_this) {
          return function() {
            return _this.div({
              "class": 'pull-right'
            }, function() {
              if (current) {
                return _this.span('Current');
              }
            });
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(arg) {
      var name;
      name = arg.name;
      this.rebase(name.match(/\*?(.*)/)[1]);
      return this.cancel();
    };

    ListView.prototype.rebase = function(branch) {
      return git.cmd(['rebase', branch], {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(msg) {
          OutputViewManager.create().setContent(msg).finish();
          atom.workspace.getTextEditors().forEach(function(editor) {
            return fs.exists(editor.getPath(), function(exist) {
              if (!exist) {
                return editor.destroy();
              }
            });
          });
          return git.refresh(_this.repo);
        };
      })(this))["catch"]((function(_this) {
        return function(msg) {
          notifier.addError(msg);
          return git.refresh(_this.repo);
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmViYXNlLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHVFQUFBO0lBQUE7OztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxpQkFBQSxHQUFvQixPQUFBLENBQVEsd0JBQVI7O0VBRXBCLE1BQU0sQ0FBQyxPQUFQLEdBQ1E7Ozs7Ozs7dUJBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLElBQVI7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxPQUFEO01BQ2xCLDBDQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsSUFBRCxDQUFBO2FBQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTtJQUhVOzt1QkFLWixTQUFBLEdBQVcsU0FBQTtBQUNULFVBQUE7TUFBQSxLQUFBLEdBQVEsSUFBQyxDQUFBLElBQUksQ0FBQyxLQUFOLENBQVksSUFBWjtNQUNSLFFBQUEsR0FBVztBQUNYLFdBQUEsdUNBQUE7O1FBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBYixFQUFvQixFQUFwQjtRQUNQLElBQU8sSUFBQSxLQUFRLEVBQWY7VUFDRSxRQUFRLENBQUMsSUFBVCxDQUFjO1lBQUMsSUFBQSxFQUFNLElBQVA7V0FBZCxFQURGOztBQUZGO01BSUEsSUFBQyxDQUFBLFFBQUQsQ0FBVSxRQUFWO2FBQ0EsSUFBQyxDQUFBLGlCQUFELENBQUE7SUFSUzs7dUJBVVgsWUFBQSxHQUFjLFNBQUE7YUFBRztJQUFIOzt1QkFFZCxJQUFBLEdBQU0sU0FBQTs7UUFDSixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFDVixJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBQTthQUNBLElBQUMsQ0FBQSxtQkFBRCxDQUFBO0lBSEk7O3VCQUtOLFNBQUEsR0FBVyxTQUFBO2FBQUcsSUFBQyxDQUFBLElBQUQsQ0FBQTtJQUFIOzt1QkFFWCxJQUFBLEdBQU0sU0FBQTtBQUNKLFVBQUE7K0NBQU0sQ0FBRSxPQUFSLENBQUE7SUFESTs7dUJBR04sV0FBQSxHQUFhLFNBQUMsR0FBRDtBQUNYLFVBQUE7TUFEYSxPQUFEO01BQ1osT0FBQSxHQUFVO01BQ1YsSUFBRyxJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQUFIO1FBQ0UsSUFBQSxHQUFPLElBQUksQ0FBQyxLQUFMLENBQVcsQ0FBWDtRQUNQLE9BQUEsR0FBVSxLQUZaOzthQUdBLEVBQUEsQ0FBRyxTQUFBO2VBQ0QsSUFBQyxDQUFBLEVBQUQsQ0FBSSxJQUFKLEVBQVUsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFDUixLQUFDLENBQUEsR0FBRCxDQUFLO2NBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxZQUFQO2FBQUwsRUFBMEIsU0FBQTtjQUN4QixJQUFvQixPQUFwQjt1QkFBQSxLQUFDLENBQUEsSUFBRCxDQUFNLFNBQU4sRUFBQTs7WUFEd0IsQ0FBMUI7VUFEUTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBVjtNQURDLENBQUg7SUFMVzs7dUJBVWIsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxPQUFEO01BQ1YsSUFBQyxDQUFBLE1BQUQsQ0FBUSxJQUFJLENBQUMsS0FBTCxDQUFXLFNBQVgsQ0FBc0IsQ0FBQSxDQUFBLENBQTlCO2FBQ0EsSUFBQyxDQUFBLE1BQUQsQ0FBQTtJQUZTOzt1QkFJWCxNQUFBLEdBQVEsU0FBQyxNQUFEO2FBQ04sR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsRUFBVyxNQUFYLENBQVIsRUFBNEI7UUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7T0FBNUIsQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtVQUNKLGlCQUFpQixDQUFDLE1BQWxCLENBQUEsQ0FBMEIsQ0FBQyxVQUEzQixDQUFzQyxHQUF0QyxDQUEwQyxDQUFDLE1BQTNDLENBQUE7VUFDQSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWYsQ0FBQSxDQUErQixDQUFDLE9BQWhDLENBQXdDLFNBQUMsTUFBRDttQkFDdEMsRUFBRSxDQUFDLE1BQUgsQ0FBVSxNQUFNLENBQUMsT0FBUCxDQUFBLENBQVYsRUFBNEIsU0FBQyxLQUFEO2NBQVcsSUFBb0IsQ0FBSSxLQUF4Qjt1QkFBQSxNQUFNLENBQUMsT0FBUCxDQUFBLEVBQUE7O1lBQVgsQ0FBNUI7VUFEc0MsQ0FBeEM7aUJBRUEsR0FBRyxDQUFDLE9BQUosQ0FBWSxLQUFDLENBQUEsSUFBYjtRQUpJO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROLENBTUEsRUFBQyxLQUFELEVBTkEsQ0FNTyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsR0FBRDtVQUNMLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQWxCO2lCQUNBLEdBQUcsQ0FBQyxPQUFKLENBQVksS0FBQyxDQUFBLElBQWI7UUFGSztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FOUDtJQURNOzs7O0tBMUNhO0FBUHpCIiwic291cmNlc0NvbnRlbnQiOlsiZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xueyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5PdXRwdXRWaWV3TWFuYWdlciA9IHJlcXVpcmUgJy4uL291dHB1dC12aWV3LW1hbmFnZXInXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgY2xhc3MgTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICAgIGluaXRpYWxpemU6IChAcmVwbywgQGRhdGEpIC0+XG4gICAgICBzdXBlclxuICAgICAgQHNob3coKVxuICAgICAgQHBhcnNlRGF0YSgpXG5cbiAgICBwYXJzZURhdGE6IC0+XG4gICAgICBpdGVtcyA9IEBkYXRhLnNwbGl0KFwiXFxuXCIpXG4gICAgICBicmFuY2hlcyA9IFtdXG4gICAgICBmb3IgaXRlbSBpbiBpdGVtc1xuICAgICAgICBpdGVtID0gaXRlbS5yZXBsYWNlKC9cXHMvZywgJycpXG4gICAgICAgIHVubGVzcyBpdGVtIGlzICcnXG4gICAgICAgICAgYnJhbmNoZXMucHVzaCB7bmFtZTogaXRlbX1cbiAgICAgIEBzZXRJdGVtcyBicmFuY2hlc1xuICAgICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICAgIGdldEZpbHRlcktleTogLT4gJ25hbWUnXG5cbiAgICBzaG93OiAtPlxuICAgICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICAgIEBwYW5lbC5zaG93KClcbiAgICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICAgIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gICAgaGlkZTogLT5cbiAgICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgICB2aWV3Rm9ySXRlbTogKHtuYW1lfSkgLT5cbiAgICAgIGN1cnJlbnQgPSBmYWxzZVxuICAgICAgaWYgbmFtZS5zdGFydHNXaXRoIFwiKlwiXG4gICAgICAgIG5hbWUgPSBuYW1lLnNsaWNlKDEpXG4gICAgICAgIGN1cnJlbnQgPSB0cnVlXG4gICAgICAkJCAtPlxuICAgICAgICBAbGkgbmFtZSwgPT5cbiAgICAgICAgICBAZGl2IGNsYXNzOiAncHVsbC1yaWdodCcsID0+XG4gICAgICAgICAgICBAc3BhbignQ3VycmVudCcpIGlmIGN1cnJlbnRcblxuICAgIGNvbmZpcm1lZDogKHtuYW1lfSkgLT5cbiAgICAgIEByZWJhc2UgbmFtZS5tYXRjaCgvXFwqPyguKikvKVsxXVxuICAgICAgQGNhbmNlbCgpXG5cbiAgICByZWJhc2U6IChicmFuY2gpIC0+XG4gICAgICBnaXQuY21kKFsncmViYXNlJywgYnJhbmNoXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAobXNnKSA9PlxuICAgICAgICBPdXRwdXRWaWV3TWFuYWdlci5jcmVhdGUoKS5zZXRDb250ZW50KG1zZykuZmluaXNoKClcbiAgICAgICAgYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5mb3JFYWNoIChlZGl0b3IpIC0+XG4gICAgICAgICAgZnMuZXhpc3RzIGVkaXRvci5nZXRQYXRoKCksIChleGlzdCkgLT4gZWRpdG9yLmRlc3Ryb3koKSBpZiBub3QgZXhpc3RcbiAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiAgICAgIC5jYXRjaCAobXNnKSA9PlxuICAgICAgICBub3RpZmllci5hZGRFcnJvciBtc2dcbiAgICAgICAgZ2l0LnJlZnJlc2ggQHJlcG9cbiJdfQ==
