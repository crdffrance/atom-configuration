(function() {
  var SelectStageFiles, git;

  git = require('../git');

  SelectStageFiles = require('../views/select-stage-files-view-beta');

  module.exports = function(repo) {
    var stagedFiles, unstagedFiles;
    unstagedFiles = git.unstagedFiles(repo, {
      showUntracked: true
    });
    stagedFiles = git.stagedFiles(repo);
    return Promise.all([unstagedFiles, stagedFiles]).then(function(data) {
      return new SelectStageFiles(repo, data[0].concat(data[1]));
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFnZS1maWxlcy1iZXRhLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSx1Q0FBUjs7RUFFbkIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO0FBQ2YsUUFBQTtJQUFBLGFBQUEsR0FBZ0IsR0FBRyxDQUFDLGFBQUosQ0FBa0IsSUFBbEIsRUFBd0I7TUFBQSxhQUFBLEVBQWUsSUFBZjtLQUF4QjtJQUNoQixXQUFBLEdBQWMsR0FBRyxDQUFDLFdBQUosQ0FBZ0IsSUFBaEI7V0FDZCxPQUFPLENBQUMsR0FBUixDQUFZLENBQUMsYUFBRCxFQUFnQixXQUFoQixDQUFaLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQWMsSUFBQSxnQkFBQSxDQUFpQixJQUFqQixFQUF1QixJQUFLLENBQUEsQ0FBQSxDQUFFLENBQUMsTUFBUixDQUFlLElBQUssQ0FBQSxDQUFBLENBQXBCLENBQXZCO0lBQWQsQ0FETjtFQUhlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuU2VsZWN0U3RhZ2VGaWxlcyA9IHJlcXVpcmUgJy4uL3ZpZXdzL3NlbGVjdC1zdGFnZS1maWxlcy12aWV3LWJldGEnXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8pIC0+XG4gIHVuc3RhZ2VkRmlsZXMgPSBnaXQudW5zdGFnZWRGaWxlcyhyZXBvLCBzaG93VW50cmFja2VkOiB0cnVlKVxuICBzdGFnZWRGaWxlcyA9IGdpdC5zdGFnZWRGaWxlcyhyZXBvKVxuICBQcm9taXNlLmFsbChbdW5zdGFnZWRGaWxlcywgc3RhZ2VkRmlsZXNdKVxuICAudGhlbiAoZGF0YSkgLT4gbmV3IFNlbGVjdFN0YWdlRmlsZXMocmVwbywgZGF0YVswXS5jb25jYXQoZGF0YVsxXSkpXG4iXX0=
