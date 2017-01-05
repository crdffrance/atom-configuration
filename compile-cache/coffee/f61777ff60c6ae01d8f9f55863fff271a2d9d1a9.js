(function() {
  var GitRun, capitalize, customCommands, git, service;

  git = require('./git');

  GitRun = require('./models/git-run');

  capitalize = function(text) {
    return text.split(' ').map(function(word) {
      return word[0].toUpperCase() + word.substring(1);
    }).join(' ');
  };

  customCommands = [];

  service = {};

  if (atom.config.get('git-plus.experimental.customCommands')) {
    service.getCustomCommands = function() {
      return customCommands;
    };
    service.getRepo = git.getRepo;
    service.registerCommand = function(element, name, fn) {
      var displayName;
      atom.commands.add(element, name, fn);
      displayName = capitalize(name.split(':')[1].replace(/-/g, ' '));
      return customCommands.push([name, displayName, fn]);
    };
    service.run = GitRun;
  }

  module.exports = Object.freeze(service);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvc2VydmljZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFDTixNQUFBLEdBQVMsT0FBQSxDQUFRLGtCQUFSOztFQUVULFVBQUEsR0FBYSxTQUFDLElBQUQ7V0FBVSxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsQ0FBZSxDQUFDLEdBQWhCLENBQW9CLFNBQUMsSUFBRDthQUFVLElBQUssQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFSLENBQUEsQ0FBQSxHQUF3QixJQUFJLENBQUMsU0FBTCxDQUFlLENBQWY7SUFBbEMsQ0FBcEIsQ0FBd0UsQ0FBQyxJQUF6RSxDQUE4RSxHQUE5RTtFQUFWOztFQUViLGNBQUEsR0FBaUI7O0VBRWpCLE9BQUEsR0FBVTs7RUFFVixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQ0FBaEIsQ0FBSDtJQUNFLE9BQU8sQ0FBQyxpQkFBUixHQUE0QixTQUFBO2FBQUc7SUFBSDtJQUM1QixPQUFPLENBQUMsT0FBUixHQUFrQixHQUFHLENBQUM7SUFDdEIsT0FBTyxDQUFDLGVBQVIsR0FBMEIsU0FBQyxPQUFELEVBQVUsSUFBVixFQUFnQixFQUFoQjtBQUN4QixVQUFBO01BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLE9BQWxCLEVBQTJCLElBQTNCLEVBQWlDLEVBQWpDO01BQ0EsV0FBQSxHQUFjLFVBQUEsQ0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLEdBQVgsQ0FBZ0IsQ0FBQSxDQUFBLENBQUUsQ0FBQyxPQUFuQixDQUEyQixJQUEzQixFQUFpQyxHQUFqQyxDQUFYO2FBQ2QsY0FBYyxDQUFDLElBQWYsQ0FBb0IsQ0FBQyxJQUFELEVBQU8sV0FBUCxFQUFvQixFQUFwQixDQUFwQjtJQUh3QjtJQUkxQixPQUFPLENBQUMsR0FBUixHQUFjLE9BUGhCOzs7RUFTQSxNQUFNLENBQUMsT0FBUCxHQUFpQixNQUFNLENBQUMsTUFBUCxDQUFjLE9BQWQ7QUFsQmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi9naXQnXG5HaXRSdW4gPSByZXF1aXJlICcuL21vZGVscy9naXQtcnVuJ1xuXG5jYXBpdGFsaXplID0gKHRleHQpIC0+IHRleHQuc3BsaXQoJyAnKS5tYXAoKHdvcmQpIC0+IHdvcmRbMF0udG9VcHBlckNhc2UoKSArIHdvcmQuc3Vic3RyaW5nKDEpKS5qb2luKCcgJylcblxuY3VzdG9tQ29tbWFuZHMgPSBbXVxuXG5zZXJ2aWNlID0ge31cblxuaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5leHBlcmltZW50YWwuY3VzdG9tQ29tbWFuZHMnKVxuICBzZXJ2aWNlLmdldEN1c3RvbUNvbW1hbmRzID0gLT4gY3VzdG9tQ29tbWFuZHNcbiAgc2VydmljZS5nZXRSZXBvID0gZ2l0LmdldFJlcG9cbiAgc2VydmljZS5yZWdpc3RlckNvbW1hbmQgPSAoZWxlbWVudCwgbmFtZSwgZm4pIC0+XG4gICAgYXRvbS5jb21tYW5kcy5hZGQgZWxlbWVudCwgbmFtZSwgZm5cbiAgICBkaXNwbGF5TmFtZSA9IGNhcGl0YWxpemUobmFtZS5zcGxpdCgnOicpWzFdLnJlcGxhY2UoLy0vZywgJyAnKSlcbiAgICBjdXN0b21Db21tYW5kcy5wdXNoIFtuYW1lLCBkaXNwbGF5TmFtZSwgZm5dXG4gIHNlcnZpY2UucnVuID0gR2l0UnVuXG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmZyZWV6ZSBzZXJ2aWNlXG4iXX0=
