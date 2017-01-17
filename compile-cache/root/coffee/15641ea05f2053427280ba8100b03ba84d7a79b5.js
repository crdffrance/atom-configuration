(function() {
  var RemoveListView, git, gitRemove, notifier, prettify;

  git = require('../git');

  notifier = require('../notifier');

  RemoveListView = require('../views/remove-list-view');

  gitRemove = function(repo, arg) {
    var currentFile, cwd, ref, showSelector;
    showSelector = (arg != null ? arg : {}).showSelector;
    cwd = repo.getWorkingDirectory();
    currentFile = repo.relativize((ref = atom.workspace.getActiveTextEditor()) != null ? ref.getPath() : void 0);
    if ((currentFile != null) && !showSelector) {
      if (repo.isPathModified(currentFile) === false || window.confirm('Are you sure?')) {
        atom.workspace.getActivePaneItem().destroy();
        return git.cmd(['rm', '-f', '--ignore-unmatch', currentFile], {
          cwd: cwd
        }).then(function(data) {
          return notifier.addSuccess("Removed " + (prettify(data)));
        });
      }
    } else {
      return git.cmd(['rm', '-r', '-n', '--ignore-unmatch', '-f', '*'], {
        cwd: cwd
      }).then(function(data) {
        return new RemoveListView(repo, prettify(data));
      });
    }
  };

  prettify = function(data) {
    var file, i, j, len, results;
    data = data.match(/rm ('.*')/g);
    if (data) {
      results = [];
      for (i = j = 0, len = data.length; j < len; i = ++j) {
        file = data[i];
        results.push(data[i] = file.match(/rm '(.*)'/)[1]);
      }
      return results;
    } else {
      return data;
    }
  };

  module.exports = gitRemove;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1yZW1vdmUuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUNYLGNBQUEsR0FBaUIsT0FBQSxDQUFRLDJCQUFSOztFQUVqQixTQUFBLEdBQVksU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNWLFFBQUE7SUFEa0IsOEJBQUQsTUFBZTtJQUNoQyxHQUFBLEdBQU0sSUFBSSxDQUFDLG1CQUFMLENBQUE7SUFDTixXQUFBLEdBQWMsSUFBSSxDQUFDLFVBQUwsMkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQjtJQUNkLElBQUcscUJBQUEsSUFBaUIsQ0FBSSxZQUF4QjtNQUNFLElBQUcsSUFBSSxDQUFDLGNBQUwsQ0FBb0IsV0FBcEIsQ0FBQSxLQUFvQyxLQUFwQyxJQUE2QyxNQUFNLENBQUMsT0FBUCxDQUFlLGVBQWYsQ0FBaEQ7UUFDRSxJQUFJLENBQUMsU0FBUyxDQUFDLGlCQUFmLENBQUEsQ0FBa0MsQ0FBQyxPQUFuQyxDQUFBO2VBQ0EsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsa0JBQWIsRUFBaUMsV0FBakMsQ0FBUixFQUF1RDtVQUFDLEtBQUEsR0FBRDtTQUF2RCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtpQkFBVSxRQUFRLENBQUMsVUFBVCxDQUFvQixVQUFBLEdBQVUsQ0FBQyxRQUFBLENBQVMsSUFBVCxDQUFELENBQTlCO1FBQVYsQ0FETixFQUZGO09BREY7S0FBQSxNQUFBO2FBTUUsR0FBRyxDQUFDLEdBQUosQ0FBUSxDQUFDLElBQUQsRUFBTyxJQUFQLEVBQWEsSUFBYixFQUFtQixrQkFBbkIsRUFBdUMsSUFBdkMsRUFBNkMsR0FBN0MsQ0FBUixFQUEyRDtRQUFDLEtBQUEsR0FBRDtPQUEzRCxDQUNBLENBQUMsSUFERCxDQUNNLFNBQUMsSUFBRDtlQUFjLElBQUEsY0FBQSxDQUFlLElBQWYsRUFBcUIsUUFBQSxDQUFTLElBQVQsQ0FBckI7TUFBZCxDQUROLEVBTkY7O0VBSFU7O0VBWVosUUFBQSxHQUFXLFNBQUMsSUFBRDtBQUNULFFBQUE7SUFBQSxJQUFBLEdBQU8sSUFBSSxDQUFDLEtBQUwsQ0FBVyxZQUFYO0lBQ1AsSUFBRyxJQUFIO0FBQ0U7V0FBQSw4Q0FBQTs7cUJBQ0UsSUFBSyxDQUFBLENBQUEsQ0FBTCxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsV0FBWCxDQUF3QixDQUFBLENBQUE7QUFEcEM7cUJBREY7S0FBQSxNQUFBO2FBSUUsS0FKRjs7RUFGUzs7RUFRWCxNQUFNLENBQUMsT0FBUCxHQUFpQjtBQXhCakIiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuUmVtb3ZlTGlzdFZpZXcgPSByZXF1aXJlICcuLi92aWV3cy9yZW1vdmUtbGlzdC12aWV3J1xuXG5naXRSZW1vdmUgPSAocmVwbywge3Nob3dTZWxlY3Rvcn09e30pIC0+XG4gIGN3ZCA9IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpXG4gIGN1cnJlbnRGaWxlID0gcmVwby5yZWxhdGl2aXplKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpKVxuICBpZiBjdXJyZW50RmlsZT8gYW5kIG5vdCBzaG93U2VsZWN0b3JcbiAgICBpZiByZXBvLmlzUGF0aE1vZGlmaWVkKGN1cnJlbnRGaWxlKSBpcyBmYWxzZSBvciB3aW5kb3cuY29uZmlybSgnQXJlIHlvdSBzdXJlPycpXG4gICAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpLmRlc3Ryb3koKVxuICAgICAgZ2l0LmNtZChbJ3JtJywgJy1mJywgJy0taWdub3JlLXVubWF0Y2gnLCBjdXJyZW50RmlsZV0sIHtjd2R9KVxuICAgICAgLnRoZW4gKGRhdGEpIC0+IG5vdGlmaWVyLmFkZFN1Y2Nlc3MoXCJSZW1vdmVkICN7cHJldHRpZnkgZGF0YX1cIilcbiAgZWxzZVxuICAgIGdpdC5jbWQoWydybScsICctcicsICctbicsICctLWlnbm9yZS11bm1hdGNoJywgJy1mJywgJyonXSwge2N3ZH0pXG4gICAgLnRoZW4gKGRhdGEpIC0+IG5ldyBSZW1vdmVMaXN0VmlldyhyZXBvLCBwcmV0dGlmeShkYXRhKSlcblxucHJldHRpZnkgPSAoZGF0YSkgLT5cbiAgZGF0YSA9IGRhdGEubWF0Y2goL3JtICgnLionKS9nKVxuICBpZiBkYXRhXG4gICAgZm9yIGZpbGUsIGkgaW4gZGF0YVxuICAgICAgZGF0YVtpXSA9IGZpbGUubWF0Y2goL3JtICcoLiopJy8pWzFdXG4gIGVsc2VcbiAgICBkYXRhXG5cbm1vZHVsZS5leHBvcnRzID0gZ2l0UmVtb3ZlXG4iXX0=
