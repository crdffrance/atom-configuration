(function() {
  var GitDiff, git;

  git = require('../git');

  GitDiff = require('./git-diff');

  module.exports = function(repo) {
    var args;
    args = ['diff', '--stat'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmLWFsbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixPQUFBLEdBQVUsT0FBQSxDQUFRLFlBQVI7O0VBRVYsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO0FBQ2YsUUFBQTtJQUFBLElBQUEsR0FBTyxDQUFDLE1BQUQsRUFBUyxRQUFUO0lBQ1AsSUFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUFwQjtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVixFQUFBOztXQUNBLEdBQUcsQ0FBQyxHQUFKLENBQVEsSUFBUixFQUFjO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBZCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDthQUFVLE9BQUEsQ0FBUSxJQUFSLEVBQWM7UUFBQSxRQUFBLEVBQVUsSUFBVjtRQUFnQixJQUFBLEVBQU0sR0FBdEI7T0FBZDtJQUFWLENBRE47RUFIZTtBQUhqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbkdpdERpZmYgPSByZXF1aXJlICcuL2dpdC1kaWZmJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBhcmdzID0gWydkaWZmJywgJy0tc3RhdCddXG4gIGFyZ3MucHVzaCAnSEVBRCcgaWYgYXRvbS5jb25maWcuZ2V0ICdnaXQtcGx1cy5pbmNsdWRlU3RhZ2VkRGlmZidcbiAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT4gR2l0RGlmZihyZXBvLCBkaWZmU3RhdDogZGF0YSwgZmlsZTogJy4nKVxuIl19
