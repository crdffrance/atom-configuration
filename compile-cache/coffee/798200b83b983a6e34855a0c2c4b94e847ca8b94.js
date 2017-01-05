(function() {
  var $$, ListView, OutputViewManager, PullBranchListView, SelectListView, _pull, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  _pull = require('../models/_pull');

  notifier = require('../notifier');

  OutputViewManager = require('../output-view-manager');

  PullBranchListView = require('./pull-branch-list-view');

  module.exports = ListView = (function(superClass) {
    extend(ListView, superClass);

    function ListView() {
      return ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function(repo, data1, arg1) {
      var ref1;
      this.repo = repo;
      this.data = data1;
      ref1 = arg1 != null ? arg1 : {}, this.mode = ref1.mode, this.tag = ref1.tag, this.extraArgs = ref1.extraArgs;
      ListView.__super__.initialize.apply(this, arguments);
      if (this.tag == null) {
        this.tag = '';
      }
      if (this.extraArgs == null) {
        this.extraArgs = [];
      }
      this.show();
      this.parseData();
      return this.result = new Promise((function(_this) {
        return function(resolve, reject) {
          _this.resolve = resolve;
          _this.reject = reject;
        };
      })(this));
    };

    ListView.prototype.parseData = function() {
      var items, remotes;
      items = this.data.split("\n");
      remotes = items.filter(function(item) {
        return item !== '';
      }).map(function(item) {
        return {
          name: item
        };
      });
      if (remotes.length === 1) {
        return this.confirmed(remotes[0]);
      } else {
        this.setItems(remotes);
        return this.focusFilterEditor();
      }
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

    ListView.prototype.viewForItem = function(arg1) {
      var name;
      name = arg1.name;
      return $$(function() {
        return this.li(name);
      });
    };

    ListView.prototype.pull = function(remoteName) {
      if (atom.config.get('git-plus.alwaysPullFromUpstream')) {
        return _pull(this.repo, {
          extraArgs: [this.extraArgs]
        });
      } else {
        return git.cmd(['branch', '--no-color', '-r'], {
          cwd: this.repo.getWorkingDirectory()
        }).then((function(_this) {
          return function(data) {
            return new PullBranchListView(_this.repo, data, remoteName, _this.extraArgs).result;
          };
        })(this));
      }
    };

    ListView.prototype.confirmed = function(arg1) {
      var name, pullBeforePush;
      name = arg1.name;
      if (this.mode === 'pull') {
        this.pull(name);
      } else if (this.mode === 'fetch-prune') {
        this.mode = 'fetch';
        this.execute(name, '--prune');
      } else if (this.mode === 'push') {
        pullBeforePush = atom.config.get('git-plus.pullBeforePush');
        if (pullBeforePush && atom.config.get('git-plus.pullRebase')) {
          this.extraArgs = '--rebase';
        }
        if (pullBeforePush) {
          this.pull(name).then((function(_this) {
            return function() {
              return _this.execute(name);
            };
          })(this));
        } else {
          this.execute(name);
        }
      } else if (this.mode === 'push -u') {
        this.pushAndSetUpstream(name);
      } else {
        this.execute(name);
      }
      return this.cancel();
    };

    ListView.prototype.execute = function(remote, extraArgs) {
      var args, message, startMessage, view;
      if (remote == null) {
        remote = '';
      }
      if (extraArgs == null) {
        extraArgs = '';
      }
      view = OutputViewManager.create();
      args = [this.mode];
      if (extraArgs.length > 0) {
        args.push(extraArgs);
      }
      args = args.concat([remote, this.tag]).filter(function(arg) {
        return arg !== '';
      });
      message = (this.mode[0].toUpperCase() + this.mode.substring(1)) + "ing...";
      startMessage = notifier.addInfo(message, {
        dismissable: true
      });
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(data) {
        if (data !== '') {
          view.setContent(data).finish();
        }
        return startMessage.dismiss();
      })["catch"]((function(_this) {
        return function(data) {
          if (data !== '') {
            view.setContent(data).finish();
          }
          return startMessage.dismiss();
        };
      })(this));
    };

    ListView.prototype.pushAndSetUpstream = function(remote) {
      var args, message, startMessage, view;
      if (remote == null) {
        remote = '';
      }
      view = OutputViewManager.create();
      args = ['push', '-u', remote, 'HEAD'].filter(function(arg) {
        return arg !== '';
      });
      message = "Pushing...";
      startMessage = notifier.addInfo(message, {
        dismissable: true
      });
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }, {
        color: true
      }).then(function(data) {
        if (data !== '') {
          view.setContent(data).finish();
        }
        return startMessage.dismiss();
      })["catch"]((function(_this) {
        return function(data) {
          if (data !== '') {
            view.setContent(data).finish();
          }
          return startMessage.dismiss();
        };
      })(this));
    };

    return ListView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVtb3RlLWxpc3Qtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLDhGQUFBO0lBQUE7OztFQUFBLE1BQXVCLE9BQUEsQ0FBUSxzQkFBUixDQUF2QixFQUFDLFdBQUQsRUFBSzs7RUFFTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sS0FBQSxHQUFRLE9BQUEsQ0FBUSxpQkFBUjs7RUFDUixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHdCQUFSOztFQUNwQixrQkFBQSxHQUFxQixPQUFBLENBQVEseUJBQVI7O0VBRXJCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7dUJBQ0osVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLEtBQVIsRUFBZSxJQUFmO0FBQ1YsVUFBQTtNQURXLElBQUMsQ0FBQSxPQUFEO01BQU8sSUFBQyxDQUFBLE9BQUQ7NEJBQU8sT0FBMEIsSUFBekIsSUFBQyxDQUFBLFlBQUEsTUFBTSxJQUFDLENBQUEsV0FBQSxLQUFLLElBQUMsQ0FBQSxpQkFBQTtNQUN4QywwQ0FBQSxTQUFBOztRQUNBLElBQUMsQ0FBQSxNQUFPOzs7UUFDUixJQUFDLENBQUEsWUFBYTs7TUFDZCxJQUFDLENBQUEsSUFBRCxDQUFBO01BQ0EsSUFBQyxDQUFBLFNBQUQsQ0FBQTthQUNBLElBQUMsQ0FBQSxNQUFELEdBQWMsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQsRUFBVyxNQUFYO1VBQUMsS0FBQyxDQUFBLFVBQUQ7VUFBVSxLQUFDLENBQUEsU0FBRDtRQUFYO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO0lBTko7O3VCQVFaLFNBQUEsR0FBVyxTQUFBO0FBQ1QsVUFBQTtNQUFBLEtBQUEsR0FBUSxJQUFDLENBQUEsSUFBSSxDQUFDLEtBQU4sQ0FBWSxJQUFaO01BQ1IsT0FBQSxHQUFVLEtBQUssQ0FBQyxNQUFOLENBQWEsU0FBQyxJQUFEO2VBQVUsSUFBQSxLQUFVO01BQXBCLENBQWIsQ0FBb0MsQ0FBQyxHQUFyQyxDQUF5QyxTQUFDLElBQUQ7ZUFBVTtVQUFFLElBQUEsRUFBTSxJQUFSOztNQUFWLENBQXpDO01BQ1YsSUFBRyxPQUFPLENBQUMsTUFBUixLQUFrQixDQUFyQjtlQUNFLElBQUMsQ0FBQSxTQUFELENBQVcsT0FBUSxDQUFBLENBQUEsQ0FBbkIsRUFERjtPQUFBLE1BQUE7UUFHRSxJQUFDLENBQUEsUUFBRCxDQUFVLE9BQVY7ZUFDQSxJQUFDLENBQUEsaUJBQUQsQ0FBQSxFQUpGOztJQUhTOzt1QkFTWCxZQUFBLEdBQWMsU0FBQTthQUFHO0lBQUg7O3VCQUVkLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBRUEsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFKSTs7dUJBTU4sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7O3VCQUVYLElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQURJOzt1QkFHTixXQUFBLEdBQWEsU0FBQyxJQUFEO0FBQ1gsVUFBQTtNQURhLE9BQUQ7YUFDWixFQUFBLENBQUcsU0FBQTtlQUNELElBQUMsQ0FBQSxFQUFELENBQUksSUFBSjtNQURDLENBQUg7SUFEVzs7dUJBSWIsSUFBQSxHQUFNLFNBQUMsVUFBRDtNQUNKLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUFIO2VBQ0UsS0FBQSxDQUFNLElBQUMsQ0FBQSxJQUFQLEVBQWE7VUFBQSxTQUFBLEVBQVcsQ0FBQyxJQUFDLENBQUEsU0FBRixDQUFYO1NBQWIsRUFERjtPQUFBLE1BQUE7ZUFHRSxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsUUFBRCxFQUFXLFlBQVgsRUFBeUIsSUFBekIsQ0FBUixFQUF3QztVQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtTQUF4QyxDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsSUFBRDttQkFDSixJQUFJLGtCQUFBLENBQW1CLEtBQUMsQ0FBQSxJQUFwQixFQUEwQixJQUExQixFQUFnQyxVQUFoQyxFQUE0QyxLQUFDLENBQUEsU0FBN0MsQ0FBdUQsQ0FBQztVQUR4RDtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETixFQUhGOztJQURJOzt1QkFRTixTQUFBLEdBQVcsU0FBQyxJQUFEO0FBQ1QsVUFBQTtNQURXLE9BQUQ7TUFDVixJQUFHLElBQUMsQ0FBQSxJQUFELEtBQVMsTUFBWjtRQUNFLElBQUMsQ0FBQSxJQUFELENBQU0sSUFBTixFQURGO09BQUEsTUFFSyxJQUFHLElBQUMsQ0FBQSxJQUFELEtBQVMsYUFBWjtRQUNILElBQUMsQ0FBQSxJQUFELEdBQVE7UUFDUixJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQsRUFBZSxTQUFmLEVBRkc7T0FBQSxNQUdBLElBQUcsSUFBQyxDQUFBLElBQUQsS0FBUyxNQUFaO1FBQ0gsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IseUJBQWhCO1FBQ2pCLElBQTJCLGNBQUEsSUFBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUE5QztVQUFBLElBQUMsQ0FBQSxTQUFELEdBQWEsV0FBYjs7UUFDQSxJQUFHLGNBQUg7VUFDRSxJQUFDLENBQUEsSUFBRCxDQUFNLElBQU4sQ0FBVyxDQUFDLElBQVosQ0FBaUIsQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQTtxQkFBRyxLQUFDLENBQUEsT0FBRCxDQUFTLElBQVQ7WUFBSDtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakIsRUFERjtTQUFBLE1BQUE7VUFHRSxJQUFDLENBQUEsT0FBRCxDQUFTLElBQVQsRUFIRjtTQUhHO09BQUEsTUFPQSxJQUFHLElBQUMsQ0FBQSxJQUFELEtBQVMsU0FBWjtRQUNILElBQUMsQ0FBQSxrQkFBRCxDQUFvQixJQUFwQixFQURHO09BQUEsTUFBQTtRQUdILElBQUMsQ0FBQSxPQUFELENBQVMsSUFBVCxFQUhHOzthQUlMLElBQUMsQ0FBQSxNQUFELENBQUE7SUFqQlM7O3VCQW1CWCxPQUFBLEdBQVMsU0FBQyxNQUFELEVBQVksU0FBWjtBQUNQLFVBQUE7O1FBRFEsU0FBTzs7O1FBQUksWUFBVTs7TUFDN0IsSUFBQSxHQUFPLGlCQUFpQixDQUFDLE1BQWxCLENBQUE7TUFDUCxJQUFBLEdBQU8sQ0FBQyxJQUFDLENBQUEsSUFBRjtNQUNQLElBQUcsU0FBUyxDQUFDLE1BQVYsR0FBbUIsQ0FBdEI7UUFDRSxJQUFJLENBQUMsSUFBTCxDQUFVLFNBQVYsRUFERjs7TUFFQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE1BQUwsQ0FBWSxDQUFDLE1BQUQsRUFBUyxJQUFDLENBQUEsR0FBVixDQUFaLENBQTJCLENBQUMsTUFBNUIsQ0FBbUMsU0FBQyxHQUFEO2VBQVMsR0FBQSxLQUFTO01BQWxCLENBQW5DO01BQ1AsT0FBQSxHQUFZLENBQUMsSUFBQyxDQUFBLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFULENBQUEsQ0FBQSxHQUF1QixJQUFDLENBQUEsSUFBSSxDQUFDLFNBQU4sQ0FBZ0IsQ0FBaEIsQ0FBeEIsQ0FBQSxHQUEyQztNQUN2RCxZQUFBLEdBQWUsUUFBUSxDQUFDLE9BQVQsQ0FBaUIsT0FBakIsRUFBMEI7UUFBQSxXQUFBLEVBQWEsSUFBYjtPQUExQjthQUNmLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO1FBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO09BQWQsRUFBZ0Q7UUFBQyxLQUFBLEVBQU8sSUFBUjtPQUFoRCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtRQUNKLElBQUcsSUFBQSxLQUFVLEVBQWI7VUFDRSxJQUFJLENBQUMsVUFBTCxDQUFnQixJQUFoQixDQUFxQixDQUFDLE1BQXRCLENBQUEsRUFERjs7ZUFFQSxZQUFZLENBQUMsT0FBYixDQUFBO01BSEksQ0FETixDQUtBLEVBQUMsS0FBRCxFQUxBLENBS08sQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLElBQUQ7VUFDTCxJQUFHLElBQUEsS0FBVSxFQUFiO1lBQ0UsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsQ0FBQyxNQUF0QixDQUFBLEVBREY7O2lCQUVBLFlBQVksQ0FBQyxPQUFiLENBQUE7UUFISztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FMUDtJQVJPOzt1QkFrQlQsa0JBQUEsR0FBb0IsU0FBQyxNQUFEO0FBQ2xCLFVBQUE7O1FBRG1CLFNBQU87O01BQzFCLElBQUEsR0FBTyxpQkFBaUIsQ0FBQyxNQUFsQixDQUFBO01BQ1AsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxNQUFmLEVBQXVCLE1BQXZCLENBQThCLENBQUMsTUFBL0IsQ0FBc0MsU0FBQyxHQUFEO2VBQVMsR0FBQSxLQUFTO01BQWxCLENBQXRDO01BQ1AsT0FBQSxHQUFVO01BQ1YsWUFBQSxHQUFlLFFBQVEsQ0FBQyxPQUFULENBQWlCLE9BQWpCLEVBQTBCO1FBQUEsV0FBQSxFQUFhLElBQWI7T0FBMUI7YUFDZixHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztRQUFBLEdBQUEsRUFBSyxJQUFDLENBQUEsSUFBSSxDQUFDLG1CQUFOLENBQUEsQ0FBTDtPQUFkLEVBQWdEO1FBQUMsS0FBQSxFQUFPLElBQVI7T0FBaEQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7UUFDSixJQUFHLElBQUEsS0FBVSxFQUFiO1VBQ0UsSUFBSSxDQUFDLFVBQUwsQ0FBZ0IsSUFBaEIsQ0FBcUIsQ0FBQyxNQUF0QixDQUFBLEVBREY7O2VBRUEsWUFBWSxDQUFDLE9BQWIsQ0FBQTtNQUhJLENBRE4sQ0FLQSxFQUFDLEtBQUQsRUFMQSxDQUtPLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ0wsSUFBRyxJQUFBLEtBQVUsRUFBYjtZQUNFLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQWhCLENBQXFCLENBQUMsTUFBdEIsQ0FBQSxFQURGOztpQkFFQSxZQUFZLENBQUMsT0FBYixDQUFBO1FBSEs7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBTFA7SUFMa0I7Ozs7S0FoRkM7QUFUdkIiLCJzb3VyY2VzQ29udGVudCI6WyJ7JCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5naXQgPSByZXF1aXJlICcuLi9naXQnXG5fcHVsbCA9IHJlcXVpcmUgJy4uL21vZGVscy9fcHVsbCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5PdXRwdXRWaWV3TWFuYWdlciA9IHJlcXVpcmUgJy4uL291dHB1dC12aWV3LW1hbmFnZXInXG5QdWxsQnJhbmNoTGlzdFZpZXcgPSByZXF1aXJlICcuL3B1bGwtYnJhbmNoLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgTGlzdFZpZXcgZXh0ZW5kcyBTZWxlY3RMaXN0Vmlld1xuICBpbml0aWFsaXplOiAoQHJlcG8sIEBkYXRhLCB7QG1vZGUsIEB0YWcsIEBleHRyYUFyZ3N9PXt9KSAtPlxuICAgIHN1cGVyXG4gICAgQHRhZyA/PSAnJ1xuICAgIEBleHRyYUFyZ3MgPz0gW11cbiAgICBAc2hvdygpXG4gICAgQHBhcnNlRGF0YSgpXG4gICAgQHJlc3VsdCA9IG5ldyBQcm9taXNlIChAcmVzb2x2ZSwgQHJlamVjdCkgPT5cblxuICBwYXJzZURhdGE6IC0+XG4gICAgaXRlbXMgPSBAZGF0YS5zcGxpdChcIlxcblwiKVxuICAgIHJlbW90ZXMgPSBpdGVtcy5maWx0ZXIoKGl0ZW0pIC0+IGl0ZW0gaXNudCAnJykubWFwIChpdGVtKSAtPiB7IG5hbWU6IGl0ZW0gfVxuICAgIGlmIHJlbW90ZXMubGVuZ3RoIGlzIDFcbiAgICAgIEBjb25maXJtZWQgcmVtb3Rlc1swXVxuICAgIGVsc2VcbiAgICAgIEBzZXRJdGVtcyByZW1vdGVzXG4gICAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuXG4gIGdldEZpbHRlcktleTogLT4gJ25hbWUnXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcblxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPlxuICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06ICh7bmFtZX0pIC0+XG4gICAgJCQgLT5cbiAgICAgIEBsaSBuYW1lXG5cbiAgcHVsbDogKHJlbW90ZU5hbWUpIC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5hbHdheXNQdWxsRnJvbVVwc3RyZWFtJylcbiAgICAgIF9wdWxsIEByZXBvLCBleHRyYUFyZ3M6IFtAZXh0cmFBcmdzXVxuICAgIGVsc2VcbiAgICAgIGdpdC5jbWQoWydicmFuY2gnLCAnLS1uby1jb2xvcicsICctciddLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgICAgIC50aGVuIChkYXRhKSA9PlxuICAgICAgICBuZXcgUHVsbEJyYW5jaExpc3RWaWV3KEByZXBvLCBkYXRhLCByZW1vdGVOYW1lLCBAZXh0cmFBcmdzKS5yZXN1bHRcblxuICBjb25maXJtZWQ6ICh7bmFtZX0pIC0+XG4gICAgaWYgQG1vZGUgaXMgJ3B1bGwnXG4gICAgICBAcHVsbCBuYW1lXG4gICAgZWxzZSBpZiBAbW9kZSBpcyAnZmV0Y2gtcHJ1bmUnXG4gICAgICBAbW9kZSA9ICdmZXRjaCdcbiAgICAgIEBleGVjdXRlIG5hbWUsICctLXBydW5lJ1xuICAgIGVsc2UgaWYgQG1vZGUgaXMgJ3B1c2gnXG4gICAgICBwdWxsQmVmb3JlUHVzaCA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucHVsbEJlZm9yZVB1c2gnKVxuICAgICAgQGV4dHJhQXJncyA9ICctLXJlYmFzZScgaWYgcHVsbEJlZm9yZVB1c2ggYW5kIGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMucHVsbFJlYmFzZScpXG4gICAgICBpZiBwdWxsQmVmb3JlUHVzaFxuICAgICAgICBAcHVsbChuYW1lKS50aGVuID0+IEBleGVjdXRlIG5hbWVcbiAgICAgIGVsc2VcbiAgICAgICAgQGV4ZWN1dGUgbmFtZVxuICAgIGVsc2UgaWYgQG1vZGUgaXMgJ3B1c2ggLXUnXG4gICAgICBAcHVzaEFuZFNldFVwc3RyZWFtIG5hbWVcbiAgICBlbHNlXG4gICAgICBAZXhlY3V0ZSBuYW1lXG4gICAgQGNhbmNlbCgpXG5cbiAgZXhlY3V0ZTogKHJlbW90ZT0nJywgZXh0cmFBcmdzPScnKSAtPlxuICAgIHZpZXcgPSBPdXRwdXRWaWV3TWFuYWdlci5jcmVhdGUoKVxuICAgIGFyZ3MgPSBbQG1vZGVdXG4gICAgaWYgZXh0cmFBcmdzLmxlbmd0aCA+IDBcbiAgICAgIGFyZ3MucHVzaCBleHRyYUFyZ3NcbiAgICBhcmdzID0gYXJncy5jb25jYXQoW3JlbW90ZSwgQHRhZ10pLmZpbHRlcigoYXJnKSAtPiBhcmcgaXNudCAnJylcbiAgICBtZXNzYWdlID0gXCIje0Btb2RlWzBdLnRvVXBwZXJDYXNlKCkrQG1vZGUuc3Vic3RyaW5nKDEpfWluZy4uLlwiXG4gICAgc3RhcnRNZXNzYWdlID0gbm90aWZpZXIuYWRkSW5mbyBtZXNzYWdlLCBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgIGdpdC5jbWQoYXJncywgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCksIHtjb2xvcjogdHJ1ZX0pXG4gICAgLnRoZW4gKGRhdGEpIC0+XG4gICAgICBpZiBkYXRhIGlzbnQgJydcbiAgICAgICAgdmlldy5zZXRDb250ZW50KGRhdGEpLmZpbmlzaCgpXG4gICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4gICAgLmNhdGNoIChkYXRhKSA9PlxuICAgICAgaWYgZGF0YSBpc250ICcnXG4gICAgICAgIHZpZXcuc2V0Q29udGVudChkYXRhKS5maW5pc2goKVxuICAgICAgc3RhcnRNZXNzYWdlLmRpc21pc3MoKVxuXG4gIHB1c2hBbmRTZXRVcHN0cmVhbTogKHJlbW90ZT0nJykgLT5cbiAgICB2aWV3ID0gT3V0cHV0Vmlld01hbmFnZXIuY3JlYXRlKClcbiAgICBhcmdzID0gWydwdXNoJywgJy11JywgcmVtb3RlLCAnSEVBRCddLmZpbHRlcigoYXJnKSAtPiBhcmcgaXNudCAnJylcbiAgICBtZXNzYWdlID0gXCJQdXNoaW5nLi4uXCJcbiAgICBzdGFydE1lc3NhZ2UgPSBub3RpZmllci5hZGRJbmZvIG1lc3NhZ2UsIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgZ2l0LmNtZChhcmdzLCBjd2Q6IEByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSwge2NvbG9yOiB0cnVlfSlcbiAgICAudGhlbiAoZGF0YSkgLT5cbiAgICAgIGlmIGRhdGEgaXNudCAnJ1xuICAgICAgICB2aWV3LnNldENvbnRlbnQoZGF0YSkuZmluaXNoKClcbiAgICAgIHN0YXJ0TWVzc2FnZS5kaXNtaXNzKClcbiAgICAuY2F0Y2ggKGRhdGEpID0+XG4gICAgICBpZiBkYXRhIGlzbnQgJydcbiAgICAgICAgdmlldy5zZXRDb250ZW50KGRhdGEpLmZpbmlzaCgpXG4gICAgICBzdGFydE1lc3NhZ2UuZGlzbWlzcygpXG4iXX0=
