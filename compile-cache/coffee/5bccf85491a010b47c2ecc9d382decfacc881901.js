(function() {
  var $$, ListView, SelectListView, fs, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  fs = require('fs-plus');

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  notifier = require('../notifier');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.args = ['checkout'];

    ListView.prototype.initialize = function(repo, data) {
      this.repo = repo;
      this.data = data;
      ListView.__super__.initialize.apply(this, arguments);
      this.addClass('git-branch');
      this.show();
      this.parseData();
      return this.currentPane = atom.workspace.getActivePane();
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
                return _this.span('HEAD');
              }
            });
          };
        })(this));
      });
    };

    ListView.prototype.confirmed = function(arg) {
      var name;
      name = arg.name;
      this.checkout(name.match(/\*?(.*)/)[1]);
      return this.cancel();
    };

    ListView.prototype.checkout = function(branch) {
      return git.cmd(this.args.concat(branch), {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(message) {
          notifier.addSuccess(message);
          atom.workspace.observeTextEditors(function(editor) {
            var error, filepath, path;
            try {
              path = editor.getPath();
              console.log("Git-plus: editor.getPath() returned '" + path + "'");
              if (filepath = path != null ? typeof path.toString === "function" ? path.toString() : void 0 : void 0) {
                return fs.exists(filepath, function(exists) {
                  if (!exists) {
                    return editor.destroy();
                  }
                });
              }
            } catch (error1) {
              error = error1;
              notifier.addWarning("There was an error closing windows for non-existing files after the checkout. Please check the dev console.");
              return console.info("Git-plus: please take a screenshot of what has been printed in the console and add it to the issue on github at https://github.com/akonwi/git-plus/issues/139");
            }
          });
          git.refresh(_this.repo);
          return _this.currentPane.activate();
        };
      })(this))["catch"](function(err) {
        return notifier.addError(err);
      });
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvYnJhbmNoLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9EQUFBO0lBQUE7OztFQUFBLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFDTCxNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBQ0wsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFFWCxNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O3VCQUNKLElBQUEsR0FBTSxDQUFDLFVBQUQ7O3VCQUVOLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxJQUFSO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsT0FBRDtNQUNsQiwwQ0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLFFBQUQsQ0FBVSxZQUFWO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBO0lBTEw7O3VCQU9aLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaO01BQ1IsUUFBQSxHQUFXO0FBQ1gsV0FBQSx1Q0FBQTs7UUFDRSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCO1FBQ1AsSUFBTyxJQUFBLEtBQVEsRUFBZjtVQUNFLFFBQVEsQ0FBQyxJQUFULENBQWM7WUFBQyxJQUFBLEVBQU0sSUFBUDtXQUFkLEVBREY7O0FBRkY7TUFJQSxJQUFDLENBQUEsUUFBRCxDQUFVLFFBQVY7YUFDQSxJQUFD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IHJlcXVpcmUgJ2ZzLXBsdXMnXG57JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xubm90aWZpZXIgPSByZXF1aXJlICcuLi9ub3RpZmllcidcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICBhcmdzOiBbJ2NoZWNrb3V0J11cblxuICBpbml0aWFsaXplOiAoQHJlcG8sIEBkYXRhKSAtPlxuICAgIHN1cGVyXG4gICAgQGFkZENsYXNzKCdnaXQtYnJhbmNoJylcbiAgICBAc2hvdygpXG4gICAgQHBhcnNlRGF0YSgpXG4gICAgQGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG5cbiAgcGFyc2VEYXRhOiAtPlxuICAgIGl0ZW1zID0gQGRhdGEuc3BsaXQoXCJcXG5cIilcbiAgICBicmFuY2hlcyA9IFtdXG4gICAgZm9yIGl0ZW0gaW4gaXRlbXNcbiAgICAgIGl0ZW0gPSBpdGVtLnJlcGxhY2UoL1xccy9nLCAnJylcbiAgICAgIHVubGVzcyBpdGVtIGlzICcnXG4gICAgICAgIGJyYW5jaGVzLnB1c2gge25hbWU6IGl0ZW19XG4gICAgQHNldEl0ZW1zIGJyYW5jaGVzXG4gICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBnZXRGaWx0ZXJLZXk6IC0+ICduYW1lJ1xuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7bmFtZX0pIC0+XG4gICAgY3VycmVudCA9IGZhbHNlXG4gICAgaWYgbmFtZS5zdGFydHNXaXRoIFwiKlwiXG4gICAgICBuYW1lID0gbmFtZS5zbGljZSgxKVxuICAgICAgY3VycmVudCA9IHRydWVcbiAgICAkJCAtPlxuICAgICAgQGxpIG5hbWUsID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICBAc3BhbignSEVBRCcpIGlmIGN1cnJlbnRcblxuICBjb25maXJtZWQ6ICh7bmFtZX0pIC0+XG4gICAgQGNoZWNrb3V0IG5hbWUubWF0Y2goL1xcKj8oLiopLylbMV1cbiAgICBAY2FuY2VsKClcblxuICBjaGVja291dDogKGJyYW5jaCkgLT5cbiAgICBnaXQuY21kKEBhcmdzLmNvbmNhdChicmFuY2gpLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAudGhlbiAobWVzc2FnZSkgPT5cbiAgICAgIG5vdGlmaWVyLmFkZFN1Y2Nlc3MgbWVzc2FnZVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgIHRyeVxuICAgICAgICAgIHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgICAgY29uc29sZS5sb2cgXCJHaXQtcGx1czogZWRpdG9yLmdldFBhdGgoKSByZXR1cm5lZCAnI3twYXRofSdcIlxuICAgICAgICAgIGlmIGZpbGVwYXRoID0gcGF0aD8udG9TdHJpbmc/KClcbiAgICAgICAgICAgIGZzLmV4aXN0cyBmaWxlcGF0aCwgKGV4aXN0cykgPT5cbiAgICAgICAgICAgICAgZWRpdG9yLmRlc3Ryb3koKSBpZiBub3QgZXhpc3RzXG4gICAgICAgIGNhdGNoIGVycm9yXG4gICAgICAgICAgbm90aWZpZXIuYWRkV2FybmluZyBcIlRoZXJlIHdhcyBhbiBlcnJvciBjbG9zaW5nIHdpbmRvd3MgZm9yIG5vbi1leGlzdGluZyBmaWxlcyBhZnRlciB0aGUgY2hlY2tvdXQuIFBsZWFzZSBjaGVjayB0aGUgZGV2IGNvbnNvbGUuXCJcbiAgICAgICAgICBjb25zb2xlLmluZm8gXCJHaXQtcGx1czogcGxlYXNlIHRha2UgYSBzY3JlZW5zaG90IG9mIHdoYXQgaGFzIGJlZW4gcHJpbnRlZCBpbiB0aGUgY29uc29sZSBhbmQgYWRkIGl0IHRvIHRoZSBpc3N1ZSBvbiBnaXRodWIgYXQgaHR0cHM6Ly9naXRodWIuY29tL2Frb253aS9naXQtcGx1cy9pc3N1ZXMvMTM5XCJcbiAgICAgIGdpdC5yZWZyZXNoIEByZXBvXG4gICAgICBAY3VycmVudFBhbmUuYWN0aXZhdGUoKVxuICAgIC5jYXRjaCAoZXJyKSAtPlxuICAgICAgbm90aWZpZXIuYWRkRXJyb3IgZXJyXG4iXX0=
