(function() {
  var LogListView, LogViewURI, git;

  git = require('../git');

  LogListView = require('../views/log-list-view');

  LogViewURI = 'atom://git-plus:log';

  module.exports = function(repo, arg) {
    var currentFile, onlyCurrentFile, ref;
    onlyCurrentFile = (arg != null ? arg : {}).onlyCurrentFile;
    atom.workspace.addOpener(function(uri) {
      if (uri === LogViewURI) {
        return new LogListView;
      }
    });
    currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    return atom.workspace.open(LogViewURI).then(function(view) {
      if (onlyCurrentFile) {
        return view.currentFileLog(repo, currentFile);
      } else {
        return view.branchLog(repo);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1sb2cuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sV0FBQSxHQUFjLE9BQUEsQ0FBUSx3QkFBUjs7RUFDZCxVQUFBLEdBQWE7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNmLFFBQUE7SUFEdUIsaUNBQUQsTUFBa0I7SUFDeEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFmLENBQXlCLFNBQUMsR0FBRDtNQUN2QixJQUEwQixHQUFBLEtBQU8sVUFBakM7QUFBQSxlQUFPLElBQUksWUFBWDs7SUFEdUIsQ0FBekI7SUFHQSxXQUFBLEdBQWMsSUFBSSxDQUFDLFVBQUwsMkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQjtXQUNkLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixVQUFwQixDQUErQixDQUFDLElBQWhDLENBQXFDLFNBQUMsSUFBRDtNQUNuQyxJQUFHLGVBQUg7ZUFDRSxJQUFJLENBQUMsY0FBTCxDQUFvQixJQUFwQixFQUEwQixXQUExQixFQURGO09BQUEsTUFBQTtlQUdFLElBQUksQ0FBQyxTQUFMLENBQWUsSUFBZixFQUhGOztJQURtQyxDQUFyQztFQUxlO0FBSmpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuTG9nTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9sb2ctbGlzdC12aWV3J1xuTG9nVmlld1VSSSA9ICdhdG9tOi8vZ2l0LXBsdXM6bG9nJ1xuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7b25seUN1cnJlbnRGaWxlfT17fSkgLT5cbiAgYXRvbS53b3Jrc3BhY2UuYWRkT3BlbmVyICh1cmkpIC0+XG4gICAgcmV0dXJuIG5ldyBMb2dMaXN0VmlldyBpZiB1cmkgaXMgTG9nVmlld1VSSVxuXG4gIGN1cnJlbnRGaWxlID0gcmVwby5yZWxhdGl2aXplKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpKVxuICBhdG9tLndvcmtzcGFjZS5vcGVuKExvZ1ZpZXdVUkkpLnRoZW4gKHZpZXcpIC0+XG4gICAgaWYgb25seUN1cnJlbnRGaWxlXG4gICAgICB2aWV3LmN1cnJlbnRGaWxlTG9nKHJlcG8sIGN1cnJlbnRGaWxlKVxuICAgIGVsc2VcbiAgICAgIHZpZXcuYnJhbmNoTG9nIHJlcG9cbiJdfQ==
