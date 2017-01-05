(function() {
  var SelectStageFiles, git;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view');

  module.exports = function(repo) {
    return git.unstagedFiles(repo, {
      showUntracked: true
    }).then(function(data) {
      return new SelectStageFiles(repo, data);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFnZS1maWxlcy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixnQkFBQSxHQUFtQixPQUFBLENBQVEsa0NBQVI7O0VBRW5CLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRDtXQUNmLEdBQUcsQ0FBQyxhQUFKLENBQWtCLElBQWxCLEVBQXdCO01BQUEsYUFBQSxFQUFlLElBQWY7S0FBeEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFBYyxJQUFBLGdCQUFBLENBQWlCLElBQWpCLEVBQXVCLElBQXZCO0lBQWQsQ0FETjtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuU2VsZWN0U3RhZ2VGaWxlcyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3NlbGVjdC1zdGFnZS1maWxlcy12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBnaXQudW5zdGFnZWRGaWxlcyhyZXBvLCBzaG93VW50cmFja2VkOiB0cnVlKVxuICAudGhlbiAoZGF0YSkgLT4gbmV3IFNlbGVjdFN0YWdlRmlsZXMocmVwbywgZGF0YSlcbiJdfQ==
