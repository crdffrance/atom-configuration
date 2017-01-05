(function() {
  var $$, BufferedProcess, CherryPickSelectBranch, CherryPickSelectCommits, SelectListView, git, notifier, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  BufferedProcess = require('atom').BufferedProcess;

  ref = require('atom-space-pen-views'), $$ = ref.$$, SelectListView = ref.SelectListView;

  git = require('../git');

  notifier = require('../notifier');

  CherryPickSelectCommits = require('./cherry-pick-select-commits-view');

  module.exports = CherryPickSelectBranch = (function(superClass) {
    extend(CherryPickSelectBranch, superClass);

    function CherryPickSelectBranch() {
      return CherryPickSelectBranch.__super__.constructor.apply(this, arguments);
    }

    CherryPickSelectBranch.prototype.initialize = function(repo, items, currentHead) {
      this.repo = repo;
      this.currentHead = currentHead;
      CherryPickSelectBranch.__super__.initialize.apply(this, arguments);
      this.show();
      this.setItems(items);
      return this.focusFilterEditor();
    };

    CherryPickSelectBranch.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      return this.storeFocusedElement();
    };

    CherryPickSelectBranch.prototype.cancelled = function() {
      return this.hide();
    };

    CherryPickSelectBranch.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    CherryPickSelectBranch.prototype.viewForItem = function(item) {
      return $$(function() {
        return this.li(item);
      });
    };

    CherryPickSelectBranch.prototype.confirmed = function(item) {
      var args;
      this.cancel();
      args = ['log', '--cherry-pick', '-z', '--format=%H%n%an%n%ar%n%s', this.currentHead + "..." + item];
      return git.cmd(args, {
        cwd: this.repo.getWorkingDirectory()
      }).then((function(_this) {
        return function(save) {
          if (save.length > 0) {
            return new CherryPickSelectCommits(_this.repo, save.split('\0').slice(0, -1));
          } else {
            return notifier.addInfo("No commits available to cherry-pick.");
          }
        };
      })(this));
    };

    return CherryPickSelectBranch;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvY2hlcnJ5LXBpY2stc2VsZWN0LWJyYW5jaC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsd0dBQUE7SUFBQTs7O0VBQUMsa0JBQW1CLE9BQUEsQ0FBUSxNQUFSOztFQUNwQixNQUF1QixPQUFBLENBQVEsc0JBQVIsQ0FBdkIsRUFBQyxXQUFELEVBQUs7O0VBRUwsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCx1QkFBQSxHQUEwQixPQUFBLENBQVEsbUNBQVI7O0VBRTFCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7cUNBRUosVUFBQSxHQUFZLFNBQUMsSUFBRCxFQUFRLEtBQVIsRUFBZSxXQUFmO01BQUMsSUFBQyxDQUFBLE9BQUQ7TUFBYyxJQUFDLENBQUEsY0FBRDtNQUN6Qix3REFBQSxTQUFBO01BQ0EsSUFBQyxDQUFBLElBQUQsQ0FBQTtNQUNBLElBQUMsQ0FBQSxRQUFELENBQVUsS0FBVjthQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBO0lBSlU7O3FDQU1aLElBQUEsR0FBTSxTQUFBOztRQUNKLElBQUMsQ0FBQSxRQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUE2QjtVQUFBLElBQUEsRUFBTSxJQUFOO1NBQTdCOztNQUNWLElBQUMsQ0FBQSxLQUFLLENBQUMsSUFBUCxDQUFBO2FBRUEsSUFBQyxDQUFBLG1CQUFELENBQUE7SUFKSTs7cUNBTU4sU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7O3FDQUVYLElBQUEsR0FBTSxTQUFBO0FBQ0osVUFBQTsrQ0FBTSxDQUFFLE9BQVIsQ0FBQTtJQURJOztxQ0FHTixXQUFBLEdBQWEsU0FBQyxJQUFEO2FBQ1gsRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJLElBQUo7TUFEQyxDQUFIO0lBRFc7O3FDQUliLFNBQUEsR0FBVyxTQUFDLElBQUQ7QUFDVCxVQUFBO01BQUEsSUFBQyxDQUFBLE1BQUQsQ0FBQTtNQUNBLElBQUEsR0FBTyxDQUNMLEtBREssRUFFTCxlQUZLLEVBR0wsSUFISyxFQUlMLDJCQUpLLEVBS0YsSUFBQyxDQUFBLFdBQUYsR0FBYyxLQUFkLEdBQW1CLElBTGhCO2FBUVAsR0FBRyxDQUFDLEdBQUosQ0FBUSxJQUFSLEVBQWM7UUFBQSxHQUFBLEVBQUssSUFBQyxDQUFBLElBQUksQ0FBQyxtQkFBTixDQUFBLENBQUw7T0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxJQUFEO1VBQ0osSUFBRyxJQUFJLENBQUMsTUFBTCxHQUFjLENBQWpCO21CQUNNLElBQUEsdUJBQUEsQ0FBd0IsS0FBQyxDQUFBLElBQXpCLEVBQStCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBWCxDQUFpQixhQUFoRCxFQUROO1dBQUEsTUFBQTttQkFHRSxRQUFRLENBQUMsT0FBVCxDQUFpQixzQ0FBakIsRUFIRjs7UUFESTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FETjtJQVZTOzs7O0tBdkJ3QjtBQVJyQyIsInNvdXJjZXNDb250ZW50IjpbIntCdWZmZXJlZFByb2Nlc3N9ID0gcmVxdWlyZSAnYXRvbSdcbnskJCwgU2VsZWN0TGlzdFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5DaGVycnlQaWNrU2VsZWN0Q29tbWl0cyA9IHJlcXVpcmUgJy4vY2hlcnJ5LXBpY2stc2VsZWN0LWNvbW1pdHMtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuY2xhc3MgQ2hlcnJ5UGlja1NlbGVjdEJyYW5jaCBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvLCBpdGVtcywgQGN1cnJlbnRIZWFkKSAtPlxuICAgIHN1cGVyXG4gICAgQHNob3coKVxuICAgIEBzZXRJdGVtcyBpdGVtc1xuICAgIEBmb2N1c0ZpbHRlckVkaXRvcigpXG5cbiAgc2hvdzogLT5cbiAgICBAcGFuZWwgPz0gYXRvbS53b3Jrc3BhY2UuYWRkTW9kYWxQYW5lbChpdGVtOiB0aGlzKVxuICAgIEBwYW5lbC5zaG93KClcblxuICAgIEBzdG9yZUZvY3VzZWRFbGVtZW50KClcblxuICBjYW5jZWxsZWQ6IC0+IEBoaWRlKClcblxuICBoaWRlOiAtPlxuICAgIEBwYW5lbD8uZGVzdHJveSgpXG5cbiAgdmlld0Zvckl0ZW06IChpdGVtKSAtPlxuICAgICQkIC0+XG4gICAgICBAbGkgaXRlbVxuXG4gIGNvbmZpcm1lZDogKGl0ZW0pIC0+XG4gICAgQGNhbmNlbCgpXG4gICAgYXJncyA9IFtcbiAgICAgICdsb2cnXG4gICAgICAnLS1jaGVycnktcGljaydcbiAgICAgICcteidcbiAgICAgICctLWZvcm1hdD0lSCVuJWFuJW4lYXIlbiVzJ1xuICAgICAgXCIje0BjdXJyZW50SGVhZH0uLi4je2l0ZW19XCJcbiAgICBdXG5cbiAgICBnaXQuY21kKGFyZ3MsIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChzYXZlKSA9PlxuICAgICAgaWYgc2F2ZS5sZW5ndGggPiAwXG4gICAgICAgIG5ldyBDaGVycnlQaWNrU2VsZWN0Q29tbWl0cyhAcmVwbywgc2F2ZS5zcGxpdCgnXFwwJylbLi4uLTFdKVxuICAgICAgZWxzZVxuICAgICAgICBub3RpZmllci5hZGRJbmZvIFwiTm8gY29tbWl0cyBhdmFpbGFibGUgdG8gY2hlcnJ5LXBpY2suXCJcbiJdfQ==
