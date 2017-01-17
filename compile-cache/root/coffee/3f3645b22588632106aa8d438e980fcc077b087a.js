(function() {
  var SelectUnstageFiles, git;

  git = require('../git');

  SelectUnstageFiles = require('../views/select-unstage-files-view');

  module.exports = function(repo) {
    return git.stagedFiles(repo).then(function(data) {
      return new SelectUnstageFiles(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC11bnN0YWdlLWZpbGVzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGtCQUFBLEdBQXFCLE9BQUEsQ0FBUSxvQ0FBUjs7RUFFckIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO1dBQ2YsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEIsQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixTQUFDLElBQUQ7YUFBYyxJQUFBLGtCQUFBLENBQW1CLElBQW5CLEVBQXlCLElBQXpCO0lBQWQsQ0FBM0I7RUFEZTtBQUhqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblNlbGVjdFVuc3RhZ2VGaWxlcyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3NlbGVjdC11bnN0YWdlLWZpbGVzLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGdpdC5zdGFnZWRGaWxlcyhyZXBvKS50aGVuIChkYXRhKSAtPiBuZXcgU2VsZWN0VW5zdGFnZUZpbGVzKHJlcG8sIGRhdGEpXG4iXX0=
