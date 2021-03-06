(function() {
  var GitDiff, git;

  git = require('../git');

  GitDiff = require('./git-diff');

  module.exports = function(repo) {
    var args;
    args = ['diff', '--no-color', '--stat'];
    if (atom.config.get('git-plus.diffs.includeStagedDiff')) {
      args.push('HEAD');
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return GitDiff(repo, {
        diffStat: data,
        file: '.'
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmLWFsbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO0FBQ2YsUUFBQTtJQUFBLElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxZQUFULEVBQXVCLFFBQXZCO0lBQ1AsSUFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGtDQUFoQixDQUFwQjtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFBOztXQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDthQUFVLE9BQUEsQ0FBUSxJQUFSLEVBQWM7UUFBQSxRQUFBLEVBQVUsSUFBVjtRQUFnQixJQUFBLEVBQU0sR0FBdEI7T0FBZDtJQUFWLENBRE47RUFIZTtBQUhqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbkdpdERpZmYgPSByZXF1aXJlICcuL2dpdC1kaWZmJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBhcmdzID0gWydkaWZmJywgJy0tbm8tY29sb3InLCAnLS1zdGF0J11cbiAgYXJncy5wdXNoICdIRUFEJyBpZiBhdG9tLmNvbmZpZy5nZXQgJ2dpdC1wbHVzLmRpZmZzLmluY2x1ZGVTdGFnZWREaWZmJ1xuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPiBHaXREaWZmKHJlcG8sIGRpZmZTdGF0OiBkYXRhLCBmaWxlOiAnLicpXG4iXX0=
