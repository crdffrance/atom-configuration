(function() {
  var StatusListView, git;

  git = require('../git');

  StatusListView = require('../views/status-list-view');

  module.exports = function(repo) {
    return git.status(repo).then(function(data) {
      return new StatusListView(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGF0dXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtXQUNmLEdBQUcsQ0FBQyxNQUFKLENBQVcsSUFBWCxDQUFnQixDQUFDLElBQWpCLENBQXNCLFNBQUMsSUFBRDthQUFjLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsSUFBckI7SUFBZCxDQUF0QjtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuU3RhdHVzTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9zdGF0dXMtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBnaXQuc3RhdHVzKHJlcG8pLnRoZW4gKGRhdGEpIC0+IG5ldyBTdGF0dXNMaXN0VmlldyhyZXBvLCBkYXRhKVxuIl19
