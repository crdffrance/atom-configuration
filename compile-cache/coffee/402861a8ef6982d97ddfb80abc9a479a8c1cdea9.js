(function() {
  var ListView, git;

  git = require('../git');

  ListView = require('../views/delete-branch-view');

  module.exports = function(repo) {
    return git.cmd(['branch', '-r'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new ListView(repo, data, {
        isRemote: true
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kZWxldGUtcmVtb3RlLWJyYW5jaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixRQUFBLEdBQVcsT0FBQSxDQUFRLDZCQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtXQUNmLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxRQUFELEVBQVcsSUFBWCxDQUFSLEVBQTBCO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBMUIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFBYyxJQUFBLFFBQUEsQ0FBUyxJQUFULEVBQWUsSUFBZixFQUFxQjtRQUFBLFFBQUEsRUFBVSxJQUFWO09BQXJCO0lBQWQsQ0FETjtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9kZWxldGUtYnJhbmNoLXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIGdpdC5jbWQoWydicmFuY2gnLCAnLXInXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+IG5ldyBMaXN0VmlldyhyZXBvLCBkYXRhLCBpc1JlbW90ZTogdHJ1ZSlcbiJdfQ==
