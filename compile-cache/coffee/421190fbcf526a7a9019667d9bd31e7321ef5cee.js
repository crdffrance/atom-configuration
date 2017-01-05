(function() {
  var filesFromData, git;

  git = require('../git');

  filesFromData = function(statusData) {
    var files, i, len, line, lineMatch;
    files = [];
    for (i = 0, len = statusData.length; i < len; i++) {
      line = statusData[i];
      lineMatch = line.match(/^([ MARCU?!]{2})\s{1}(.*)/);
      if (lineMatch) {
        files.push(lineMatch[2]);
      }
    }
    return files;
  };

  module.exports = function(repo) {
    return git.status(repo).then(function(statusData) {
      var file, i, len, ref, results;
      ref = filesFromData(statusData);
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        file = ref[i];
        results.push(atom.workspace.open(file));
      }
      return results;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1vcGVuLWNoYW5nZWQtZmlsZXMuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBRU4sYUFBQSxHQUFnQixTQUFDLFVBQUQ7QUFDZCxRQUFBO0lBQUEsS0FBQSxHQUFRO0FBQ1IsU0FBQSw0Q0FBQTs7TUFDRSxTQUFBLEdBQVksSUFBSSxDQUFDLEtBQUwsQ0FBVywyQkFBWDtNQUNaLElBQTJCLFNBQTNCO1FBQUEsS0FBSyxDQUFDLElBQU4sQ0FBVyxTQUFVLENBQUEsQ0FBQSxDQUFyQixFQUFBOztBQUZGO1dBR0E7RUFMYzs7RUFPaEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFEO1dBQ2YsR0FBRyxDQUFDLE1BQUosQ0FBVyxJQUFYLENBQWdCLENBQUMsSUFBakIsQ0FBc0IsU0FBQyxVQUFEO0FBQ3BCLFVBQUE7QUFBQTtBQUFBO1dBQUEscUNBQUE7O3FCQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixJQUFwQjtBQURGOztJQURvQixDQUF0QjtFQURlO0FBVGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuXG5maWxlc0Zyb21EYXRhID0gKHN0YXR1c0RhdGEpIC0+XG4gIGZpbGVzID0gW11cbiAgZm9yIGxpbmUgaW4gc3RhdHVzRGF0YVxuICAgIGxpbmVNYXRjaCA9IGxpbmUubWF0Y2ggL14oWyBNQVJDVT8hXXsyfSlcXHN7MX0oLiopL1xuICAgIGZpbGVzLnB1c2ggbGluZU1hdGNoWzJdIGlmIGxpbmVNYXRjaFxuICBmaWxlc1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvKSAtPlxuICBnaXQuc3RhdHVzKHJlcG8pLnRoZW4gKHN0YXR1c0RhdGEpIC0+XG4gICAgZm9yIGZpbGUgaW4gZmlsZXNGcm9tRGF0YShzdGF0dXNEYXRhKVxuICAgICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlKVxuIl19
