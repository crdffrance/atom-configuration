(function() {
  var BranchListView, DeleteBranchListView, git, notifier,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  git = require('../git');

  notifier = require('../notifier');

  BranchListView = require('./branch-list-view');

  module.exports = DeleteBranchListView = (function(superClass) {
    extend(DeleteBranchListView, superClass);

    function DeleteBranchListView() {
      return DeleteBranchListView.__super__.constructor.apply(this, arguments);
    }

    DeleteBranchListView.prototype.initialize = function(repo, data, arg) {
      this.repo = repo;
      this.data = data;
      this.isRemote = (arg != null ? arg : {}).isRemote;
      return DeleteBranchListView.__super__.initialize.apply(this, arguments);
    };

    DeleteBranchListView.prototype.confirmed = function(arg) {
      var branch, name, remote;
      name = arg.name;
      if (name.startsWith("*")) {
        name = name.slice(1);
      }
      if (!this.isRemote) {
        this["delete"](name);
      } else {
        branch = name.substring(name.indexOf('/') + 1);
        remote = name.substring(0, name.indexOf('/'));
        this["delete"](branch, remote);
      }
      return this.cancel();
    };

    DeleteBranchListView.prototype["delete"] = function(branch, remote) {
      var args;
      args = remote ? ['push', remote, '--delete'] : ['branch', '-D'];
      return git.cmd(args.concat(branch), {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(message) {
        return notifier.addSuccess(message);
      })["catch"](function(error) {
        return notifier.addError(error);
      });
    };

    return DeleteBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvZGVsZXRlLWJyYW5jaC12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsbURBQUE7SUFBQTs7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFFBQUEsR0FBVyxPQUFBLENBQVEsYUFBUjs7RUFDWCxjQUFBLEdBQWlCLE9BQUEsQ0FBUSxvQkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FFUTs7Ozs7OzttQ0FDSixVQUFBLEdBQVksU0FBQyxJQUFELEVBQVEsSUFBUixFQUFlLEdBQWY7TUFBQyxJQUFDLENBQUEsT0FBRDtNQUFPLElBQUMsQ0FBQSxPQUFEO01BQVEsSUFBQyxDQUFBLDBCQUFGLE1BQVksSUFBVjthQUFpQixzREFBQSxTQUFBO0lBQWxDOzttQ0FFWixTQUFBLEdBQVcsU0FBQyxHQUFEO0FBQ1QsVUFBQTtNQURXLE9BQUQ7TUFDVixJQUF3QixJQUFJLENBQUMsVUFBTCxDQUFnQixHQUFoQixDQUF4QjtRQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBTCxDQUFXLENBQVgsRUFBUDs7TUFDQSxJQUFBLENBQU8sSUFBQyxDQUFBLFFBQVI7UUFDRSxJQUFDLEVBQUEsTUFBQSxFQUFELENBQVEsSUFBUixFQURGO09BQUEsTUFBQTtRQUdFLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxPQUFMLENBQWEsR0FBYixDQUFBLEdBQW9CLENBQW5DO1FBQ1QsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFMLENBQWUsQ0FBZixFQUFrQixJQUFJLENBQUMsT0FBTCxDQUFhLEdBQWIsQ0FBbEI7UUFDVCxJQUFDLEVBQUEsTUFBQSxFQUFELENBQVEsTUFBUixFQUFnQixNQUFoQixFQUxGOzthQU1BLElBQUMsQ0FBQSxNQUFELENBQUE7SUFSUzs7b0NBVVgsUUFBQSxHQUFRLFNBQUMsTUFBRCxFQUFTLE1BQVQ7QUFDTixVQUFBO01BQUEsSUFBQSxHQUFVLE1BQUgsR0FBZSxDQUFDLE1BQUQsRUFBUyxNQUFULEVBQWlCLFVBQWpCLENBQWYsR0FBaUQsQ0FBQyxRQUFELEVBQVcsSUFBWDthQUN4RCxHQUFHLENBQUMsR0FBSixDQUFRLElBQUksQ0FBQyxNQUFMLENBQVksTUFBWixDQUFSLEVBQTZCO1FBQUEsR0FBQSxFQUFLLElBQUMsQ0FBQSxJQUFJLENBQUMsbUJBQU4sQ0FBQSxDQUFMO09BQTdCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxPQUFEO2VBQWEsUUFBUSxDQUFDLFVBQVQsQ0FBb0IsT0FBcEI7TUFBYixDQUROLENBRUEsRUFBQyxLQUFELEVBRkEsQ0FFTyxTQUFDLEtBQUQ7ZUFBVyxRQUFRLENBQUMsUUFBVCxDQUFrQixLQUFsQjtNQUFYLENBRlA7SUFGTTs7OztLQWJ5QjtBQU5yQyIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5CcmFuY2hMaXN0VmlldyA9IHJlcXVpcmUgJy4vYnJhbmNoLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPVxuICAjIEV4dGVuc2lvbiBvZiBCcmFuY2hMaXN0Vmlld1xuICBjbGFzcyBEZWxldGVCcmFuY2hMaXN0VmlldyBleHRlbmRzIEJyYW5jaExpc3RWaWV3XG4gICAgaW5pdGlhbGl6ZTogKEByZXBvLCBAZGF0YSwge0Bpc1JlbW90ZX09e30pIC0+IHN1cGVyXG5cbiAgICBjb25maXJtZWQ6ICh7bmFtZX0pIC0+XG4gICAgICBuYW1lID0gbmFtZS5zbGljZSgxKSBpZiBuYW1lLnN0YXJ0c1dpdGggXCIqXCJcbiAgICAgIHVubGVzcyBAaXNSZW1vdGVcbiAgICAgICAgQGRlbGV0ZSBuYW1lXG4gICAgICBlbHNlXG4gICAgICAgIGJyYW5jaCA9IG5hbWUuc3Vic3RyaW5nKG5hbWUuaW5kZXhPZignLycpICsgMSlcbiAgICAgICAgcmVtb3RlID0gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5pbmRleE9mKCcvJykpXG4gICAgICAgIEBkZWxldGUgYnJhbmNoLCByZW1vdGVcbiAgICAgIEBjYW5jZWwoKVxuXG4gICAgZGVsZXRlOiAoYnJhbmNoLCByZW1vdGUpIC0+XG4gICAgICBhcmdzID0gaWYgcmVtb3RlIHRoZW4gWydwdXNoJywgcmVtb3RlLCAnLS1kZWxldGUnXSBlbHNlIFsnYnJhbmNoJywgJy1EJ11cbiAgICAgIGdpdC5jbWQoYXJncy5jb25jYXQoYnJhbmNoKSwgY3dkOiBAcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gICAgICAudGhlbiAobWVzc2FnZSkgLT4gbm90aWZpZXIuYWRkU3VjY2VzcyBtZXNzYWdlXG4gICAgICAuY2F0Y2ggKGVycm9yKSAtPiBub3RpZmllci5hZGRFcnJvciBlcnJvclxuIl19
