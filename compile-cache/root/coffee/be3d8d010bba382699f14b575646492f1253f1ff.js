(function() {
  var ProjectsListView, git, init, notifier;

  git = require('../git');

  ProjectsListView = require('../views/projects-list-view');

  notifier = require('../notifier');

  init = function(path) {
    return git.cmd(['init'], {
      cwd: path
    }).then(function(data) {
      notifier.addSuccess(data);
      return atom.project.setPaths(atom.project.getPaths());
    });
  };

  module.exports = function() {
    var currentFile, ref;
    currentFile = (ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0;
    if (!currentFile && atom.project.getPaths().length > 1) {
      return new ProjectsListView().result.then(function(path) {
        return init(path);
      });
    } else {
      return init(atom.project.getPaths()[0]);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1pbml0LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw2QkFBUjs7RUFDbkIsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUVYLElBQUEsR0FBTyxTQUFDLElBQUQ7V0FDTCxHQUFHLENBQUMsR0FBSixDQUFRLENBQUMsTUFBRCxDQUFSLEVBQWtCO01BQUEsR0FBQSxFQUFLLElBQUw7S0FBbEIsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7TUFDSixRQUFRLENBQUMsVUFBVCxDQUFvQixJQUFwQjthQUNBLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFzQixJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF0QjtJQUZJLENBRE47RUFESzs7RUFNUCxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBO0FBQ2YsUUFBQTtJQUFBLFdBQUEsNkRBQWtELENBQUUsT0FBdEMsQ0FBQTtJQUNkLElBQUcsQ0FBSSxXQUFKLElBQW9CLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBYixDQUFBLENBQXVCLENBQUMsTUFBeEIsR0FBaUMsQ0FBeEQ7YUFDTSxJQUFBLGdCQUFBLENBQUEsQ0FBa0IsQ0FBQyxNQUFNLENBQUMsSUFBMUIsQ0FBK0IsU0FBQyxJQUFEO2VBQVUsSUFBQSxDQUFLLElBQUw7TUFBVixDQUEvQixFQUROO0tBQUEsTUFBQTthQUdFLElBQUEsQ0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUF3QixDQUFBLENBQUEsQ0FBN0IsRUFIRjs7RUFGZTtBQVZqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblByb2plY3RzTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9wcm9qZWN0cy1saXN0LXZpZXcnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuXG5pbml0ID0gKHBhdGgpIC0+XG4gIGdpdC5jbWQoWydpbml0J10sIGN3ZDogcGF0aClcbiAgLnRoZW4gKGRhdGEpIC0+XG4gICAgbm90aWZpZXIuYWRkU3VjY2VzcyBkYXRhXG4gICAgYXRvbS5wcm9qZWN0LnNldFBhdGhzKGF0b20ucHJvamVjdC5nZXRQYXRocygpKVxuXG5tb2R1bGUuZXhwb3J0cyA9IC0+XG4gIGN1cnJlbnRGaWxlID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKClcbiAgaWYgbm90IGN1cnJlbnRGaWxlIGFuZCBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKS5sZW5ndGggPiAxXG4gICAgbmV3IFByb2plY3RzTGlzdFZpZXcoKS5yZXN1bHQudGhlbiAocGF0aCkgLT4gaW5pdChwYXRoKVxuICBlbHNlXG4gICAgaW5pdChhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVswXSlcbiJdfQ==
