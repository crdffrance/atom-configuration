(function() {
  var $$, GitShow, RemoteListView, SelectListView, TagView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  GitShow = require('../models/git-show');

  notifier = require('../notifier');

  RemoteListView = require('../views/remote-list-view');

  module.exports = TagView = (function(superClass) {
    extend(TagView, superClass);

    function TagView() {
      return TagView.__super__.constructor.apply(this, arguments);
    }

    TagView.prototype.initialize = function(repo, tag1) {
      this.repo = repo;
      this.tag = tag1;
      TagView.__super__.initialize.apply(this, arguments);
      this.show();
      return this.parseData();
    };

    TagView.prototype.parseData = function() {
      var items;
      items = [];
      items.push({
        tag: this.tag,
        cmd: 'Show',
        description: 'git show'
      });
      items.push({
        tag: this.tag,
        cmd: 'Push',
        description: 'git push [remote]'
      });
      items.push({
        tag: this.tag,
        cmd: 'Checkout',
        description: 'git checkout'
      });
      items.push({
        tag: this.tag,
        cmd: 'Verify',
        description: 'git tag --verify'
      });
      items.push({
        tag: this.tag,
        cmd: 'Delete',
        description: 'git tag --delete'
      });
      this.setItems(items);
      return this.focusFilterEditor();
    };

    TagView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    TagView.prototype.cancelled = function() {
      return this.hide();
    };

    TagView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    TagView.prototype.viewForItem = function(arg) {
      var cmd, description, tag;
      tag = arg.tag, cmd = arg.cmd, description = arg.description;
      return $$(function() {
        return this.li((function(_this) {
          return function() {
            _this.div({
              "class": 'text-highlight'
            }, cmd);
            return _this.div({
              "class": 'text-warning'
            }, description + " " + tag);
          };
        })(this));
      });
    };

    TagView.prototype.getFilterKey = function() {
      return 'cmd';
    };

    TagView.prototype.confirmed = function(arg) {
      var args, cmd, tag;
      tag = arg.tag, cmd = arg.cmd;
      this.cancel();
      switch (cmd) {
        case 'Show':
          GitShow(this.repo, tag);
          break;
        case 'Push':
          git.cmd(['remote'], {
            cwd: this.repo.getWorkingDirectory()
          }).then((function(_this) {
            return function(data) {
              return new RemoteListView(_this.repo, data, {
                mode: 'push',
                tag: _this.tag
              });
            };
          })(this));
          break;
        case 'Checkout':
          args = ['checkout', tag];
          break;
        case 'Verify':
          args = ['tag', '--verify', tag];
          break;
        case 'Delete':
          args = ['tag', '--delete', tag];
      }
      if (args != null) {
        return git.cmd(args, {
          cwd: this.repo.getWorkingDirectory()
        }).then(function(data) {
          return notifier.addSuccess(data);
        })["catch"](function(msg) {
          return notifier.addWarning(msg);
        });
      }
    };

    return TagView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvdGFnLXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx3RUFBQTtJQUFBOzs7RUFBQSxNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBRUwsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLE9BQUEsR0FBVSxPQUFBLENBQVEsb0JBQVI7O0VBQ1YsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixNQUFNLENBQUMsT0FBUCxHQUNNOzs7Ozs7O3NCQUNKLFVBQUEsR0FBWSxTQUFDLElBQUQsRUFBUSxJQUFSO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFBTyxJQUFDLENBQUEsTUFBRDtNQUNsQix5Q0FBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxTQUFELENBQUE7SUFIVTs7c0JBS1osU0FBQSxHQUFXLFNBQUE7QUFDVCxVQUFBO01BQUEsS0FBQSxHQUFRO01BQ1IsS0FBSyxDQUFDLElBQU4sQ0FBVztRQUFDLEdBQUEsRUFBSyxJQUFDLENBQUEsR0FBUDtRQUFZLEdBQUEsRUFBSyxNQUFqQjtRQUF5QixXQUFBLEVBQWEsVUFBdEM7T0FBWDtNQUNBLEtBQUssQ0FBQyxJQUFOLENBQVc7UUFBQyxHQUFBLEVBQUssSUFBQyxDQUFBLEdBQVA7UUFBWSxHQUFBLEVBQUssTUFBakI7UUFBeUIsV0FBQSxFQUFhLG1CQUF0QztPQUFYO01BQ0EsS0FBSyxDQUFDLElBQU4sQ0FBVztRQUFDLEdBQUEsRUFBSyxJQUFDLENBQUEsR0FBUDtRQUFZLEdBQUEsRUFBSyxVQUFqQjtRQUE2QixXQUFBLEVBQWEsY0FBMUM7T0FBWDtNQUNBLEtBQUssQ0FBQyxJQUFO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LEdBQXBCO1FBQVQsQ0FGUCxFQURGOztJQWZTOzs7O0tBbENTO0FBUnRCIiwic291cmNlc0NvbnRlbnQiOlsieyQkLCBTZWxlY3RMaXN0Vmlld30gPSByZXF1aXJlICdhdG9tLXNwYWNlLXBlbi12aWV3cydcblxuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuR2l0U2hvdyA9IHJlcXVpcmUgJy4uL21vZGVscy9naXQtc2hvdydcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5SZW1vdGVMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3JlbW90ZS1saXN0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFRhZ1ZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICBpbml0aWFsaXplOiAoQHJlcG8sIEB0YWcpIC0+XG4gICAgc3VwZXJcbiAgICBAc2hvdygpXG4gICAgQHBhcnNlRGF0YSgpXG5cbiAgcGFyc2VEYXRhOiAtPlxuICAgIGl0ZW1zID0gW11cbiAgICBpdGVtcy5wdXNoIHt0YWc6IEB0YWcsIGNtZDogJ1Nob3cnLCBkZXNjcmlwdGlvbjogJ2dpdCBzaG93J31cbiAgICBpdGVtcy5wdXNoIHt0YWc6IEB0YWcsIGNtZDogJ1B1c2gnLCBkZXNjcmlwdGlvbjogJ2dpdCBwdXNoIFtyZW1vdGVdJ31cbiAgICBpdGVtcy5wdXNoIHt0YWc6IEB0YWcsIGNtZDogJ0NoZWNrb3V0JywgZGVzY3JpcHRpb246ICdnaXQgY2hlY2tvdXQnfVxuICAgIGl0ZW1zLnB1c2gge3RhZzogQHRhZywgY21kOiAnVmVyaWZ5JywgZGVzY3JpcHRpb246ICdnaXQgdGFnIC0tdmVyaWZ5J31cbiAgICBpdGVtcy5wdXNoIHt0YWc6IEB0YWcsIGNtZDogJ0RlbGV0ZScsIGRlc2NyaXB0aW9uOiAnZ2l0IHRhZyAtLWRlbGV0ZSd9XG5cbiAgICBAc2V0SXRlbXMgaXRlbXNcbiAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIHNob3c6IC0+XG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHN0b3JlRm9jdXNlZEVsZW1lbnQoKVxuXG4gIGNhbmNlbGxlZDogLT4gQGhpZGUoKVxuXG4gIGhpZGU6IC0+IEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7dGFnLCBjbWQsIGRlc2NyaXB0aW9ufSkgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpID0+XG4gICAgICAgIEBkaXYgY2xhc3M6ICd0ZXh0LWhpZ2hsaWdodCcsIGNtZFxuICAgICAgICBAZGl2IGNsYXNzOiAndGV4dC13YXJuaW5nJywgXCIje2Rlc2NyaXB0aW9ufSAje3RhZ31cIlxuXG4gIGdldEZpbHRlcktleTogLT4gJ2NtZCdcblxuICBjb25maXJtZWQ6ICh7dGFnLCBjbWR9KSAtPlxuICAgIEBjYW5jZWwoKVxuICAgIHN3aXRjaCBjbWRcbiAgICAgIHdoZW4gJ1Nob3cnXG4gICAgICAgIEdpdFNob3coQHJlcG8sIHRhZylcbiAgICAgIHdoZW4gJ1B1c2gnXG4gICAgICAgIGdpdC5jbWQoWydyZW1vdGUnXSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAgIC50aGVuIChkYXRhKSA9PiBuZXcgUmVtb3RlTGlzdFZpZXcoQHJlcG8sIGRhdGEsIG1vZGU6ICdwdXNoJywgdGFnOiBAdGFnKVxuICAgICAgd2hlbiAnQ2hlY2tvdXQnXG4gICAgICAgIGFyZ3MgPSBbJ2NoZWNrb3V0JywgdGFnXVxuICAgICAgd2hlbiAnVmVyaWZ5J1xuICAgICAgICBhcmdzID0gWyd0YWcnLCAnLS12ZXJpZnknLCB0YWddXG4gICAgICB3aGVuICdEZWxldGUnXG4gICAgICAgIGFyZ3MgPSBbJ3RhZycsICctLWRlbGV0ZScsIHRhZ11cblxuICAgIGlmIGFyZ3M/XG4gICAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgICAgLnRoZW4gKGRhdGEpIC0+IG5vdGlmaWVyLmFkZFN1Y2Nlc3MgZGF0YVxuICAgICAgLmNhdGNoIChtc2cpIC0+IG5vdGlmaWVyLmFkZFdhcm5pbmcgbXNnXG4iXX0=
