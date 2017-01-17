(function() {
  var RemoteListView, git;

  git = require('../git');

  RemoteListView = require('../views/remote-list-view');

  module.exports = function(repo) {
    return git.cmd(['remote'], {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new RemoteListView(repo, data, {
        mode: 'fetch'
      });
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1mZXRjaC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixjQUFBLEdBQWlCLE9BQUEsQ0FBUSwyQkFBUjs7RUFFakIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO1dBQ2YsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLFFBQUQsQ0FBUixFQUFvQjtNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQXBCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQWMsSUFBQSxjQUFBLENBQWUsSUFBZixFQUFxQixJQUFyQixFQUEyQjtRQUFBLElBQUEsRUFBTSxPQUFOO09BQTNCO0lBQWQsQ0FETjtFQURlO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuUmVtb3RlTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9yZW1vdGUtbGlzdC12aWV3J1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBnaXQuY21kKFsncmVtb3RlJ10sIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPiBuZXcgUmVtb3RlTGlzdFZpZXcocmVwbywgZGF0YSwgbW9kZTogJ2ZldGNoJylcbiJdfQ==
