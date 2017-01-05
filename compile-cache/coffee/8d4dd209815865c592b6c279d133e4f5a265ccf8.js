(function() {
  var TagListView, git;

  git = require('../git');

  TagListView = require('../views/tag-list-view');

  module.exports = function(repo) {
    return git.cmd(['tag', '-ln'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new TagListView(repo, data);
    })["catch"](function() {
      return new TagListView(repo);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC10YWdzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLFdBQUEsR0FBYyxPQUFBLENBQVEsd0JBQVI7O0VBRWQsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO1dBQ2YsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLEtBQUQsRUFBUSxLQUFSLENBQVIsRUFBd0I7TUFBQSxHQUFBLEVBQUssSUFBSSxDQUFDLG1CQUFMLENBQUEsQ0FBTDtLQUF4QixDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDthQUFjLElBQUEsV0FBQSxDQUFZLElBQVosRUFBa0IsSUFBbEI7SUFBZCxDQUROLENBRUEsRUFBQyxLQUFELEVBRkEsQ0FFTyxTQUFBO2FBQU8sSUFBQSxXQUFBLENBQVksSUFBWjtJQUFQLENBRlA7RUFEZTtBQUhqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblRhZ0xpc3RWaWV3ID0gcmVxdWlyZSAnLi4vdmlld3MvdGFnLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbykgLT5cbiAgZ2l0LmNtZChbJ3RhZycsICctbG4nXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+IG5ldyBUYWdMaXN0VmlldyhyZXBvLCBkYXRhKVxuICAuY2F0Y2ggLT4gbmV3IFRhZ0xpc3RWaWV3KHJlcG8pXG4iXX0=
