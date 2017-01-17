(function() {
  var git, notifier;

  git = require('../git');

  notifier = require('../notifier');

  module.exports = function(repo) {
    return git.cmd(['checkout', '-f'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      notifier.addSuccess("File changes checked out successfully!");
      return git.refresh(repo);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jaGVja291dC1hbGwtZmlsZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUVYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtXQUNmLEdBQUcsQ0FBQyxHQUFKLENBQVEsQ0FBQyxVQUFELEVBQWEsSUFBYixDQUFSLEVBQTRCO01BQUEsR0FBQSxFQUFLLElBQUksQ0FBQyxtQkFBTCxDQUFBLENBQUw7S0FBNUIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7TUFDSixRQUFRLENBQUMsVUFBVCxDQUFvQix3Q0FBcEI7YUFDQSxHQUFHLENBQUMsT0FBSixDQUFZLElBQVo7SUFGSSxDQUROO0VBRGU7QUFIakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBnaXQuY21kKFsnY2hlY2tvdXQnLCAnLWYnXSwgY3dkOiByZXBvLmdldFdvcmtpbmdEaXJlY3RvcnkoKSlcbiAgLnRoZW4gKGRhdGEpIC0+XG4gICAgbm90aWZpZXIuYWRkU3VjY2VzcyBcIkZpbGUgY2hhbmdlcyBjaGVja2VkIG91dCBzdWNjZXNzZnVsbHkhXCJcbiAgICBnaXQucmVmcmVzaCByZXBvXG4iXX0=
