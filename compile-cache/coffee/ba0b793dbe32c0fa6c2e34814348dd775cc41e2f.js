(function() {
  var CompositeDisposable, Os, Path, disposables, fs, git, nothingToShow, notifier, prepFile, showFile;

  CompositeDisposable = require('atom').CompositeDisposable;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  git = require('../git');

  notifier = require('../notifier');

  nothingToShow = 'Nothing to show.';

  disposables = new CompositeDisposable;

  showFile = function(filePath) {
    var splitDirection;
    if (atom.config.get('git-plus.openInPane')) {
      splitDirection = atom.config.get('git-plus.splitPane');
      atom.workspace.getActivePane()["split" + splitDirection]();
    }
    return atom.workspace.open(filePath);
  };

  prepFile = function(text, filePath) {
    return new Promise(function(resolve, reject) {
      if ((text != null ? text.length : void 0) === 0) {
        return reject(nothingToShow);
      } else {
        return fs.writeFile(filePath, text, {
          flag: 'w+'
        }, function(err) {
          if (err) {
            return reject(err);
          } else {
            return resolve(true);
          }
        });
      }
    });
  };

  module.exports = function(repo, arg) {
    var args, diffFilePath, diffStat, file, ref, ref1;
    ref = arg != null ? arg : {}, diffStat = ref.diffStat, file = ref.file;
    diffFilePath = Path.join(repo.getPath(), "atom_git_plus.diff");
    if (file == null) {
      file = repo.relativize((ref1 = atom.workspace.getActiveTextEditor()) != null ? ref1.getPath() : void 0);
    }
    if (!file) {
      return notifier.addError("No open file. Select 'Diff All'.");
    }
    args = ['diff', '--color=never'];
    if (atom.config.get('git-plus.includeStagedDiff')) {
      args.push('HEAD');
    }
    if (atom.config.get('git-plus.wordDiff')) {
      args.push('--word-diff');
    }
    if (!diffStat) {
      args.push(file);
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return prepFile((diffStat != null ? diffStat : '') + data, diffFilePath);
    }).then(function() {
      return showFile(diffFilePath);
    }).then(function(textEditor) {
      return disposables.add(textEditor.onDidDestroy(function() {
        return fs.unlink(diffFilePath);
      }));
    })["catch"](function(err) {
      if (err === nothingToShow) {
        return notifier.addInfo(err);
      } else {
        return notifier.addError(err);
      }
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUVYLGFBQUEsR0FBZ0I7O0VBRWhCLFdBQUEsR0FBYyxJQUFJOztFQUVsQixRQUFBLEdBQVcsU0FBQyxRQUFEO0FBQ1QsUUFBQTtJQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUFIO01BQ0UsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isb0JBQWhCO01BQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQStCLENBQUEsT0FBQSxHQUFRLGNBQVIsQ0FBL0IsQ0FBQSxFQUZGOztXQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQjtFQUpTOztFQU1YLFFBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxRQUFQO1dBQ0wsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVjtNQUNWLG9CQUFHLElBQUksQ0FBRSxnQkFBTixLQUFnQixDQUFuQjtlQUNFLE1BQUEsQ0FBTyxhQUFQLEVBREY7T0FBQSxNQUFBO2VBR0UsRUFBRSxDQUFDLFNBQUgsQ0FBYSxRQUFiLEVBQXVCLElBQXZCLEVBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0IsRUFBeUMsU0FBQyxHQUFEO1VBQ3ZDLElBQUcsR0FBSDttQkFBWSxNQUFBLENBQU8sR0FBUCxFQUFaO1dBQUEsTUFBQTttQkFBNEIsT0FBQSxDQUFRLElBQVIsRUFBNUI7O1FBRHVDLENBQXpDLEVBSEY7O0lBRFUsQ0FBUjtFQURLOztFQVFYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO3dCQURzQixNQUFpQixJQUFoQix5QkFBVTtJQUNqQyxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQVYsRUFBMEIsb0JBQTFCOztNQUNmLE9BQVEsSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQjs7SUFDUixJQUFHLENBQUksSUFBUDtBQUNFLGFBQU8sUUFBUSxDQUFDLFFBQVQsQ0FBa0Isa0NBQWxCLEVBRFQ7O0lBRUEsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFTLGVBQVQ7SUFDUCxJQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBQXBCO01BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLEVBQUE7O0lBQ0EsSUFBMkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLG1CQUFoQixDQUEzQjtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsYUFBVixFQUFBOztJQUNBLElBQUEsQ0FBc0IsUUFBdEI7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBQTs7V0FDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFBVSxRQUFBLENBQVMsb0JBQUMsV0FBVyxFQUFaLENBQUEsR0FBa0IsSUFBM0IsRUFBaUMsWUFBakM7SUFBVixDQUROLENBRUEsQ0FBQyxJQUZELENBRU0sU0FBQTthQUFHLFFBQUEsQ0FBUyxZQUFUO0lBQUgsQ0FGTixDQUdBLENBQUMsSUFIRCxDQUdNLFNBQUMsVUFBRDthQUNKLFdBQVcsQ0FBQyxHQUFaLENBQWdCLFVBQVUsQ0FBQyxZQUFYLENBQXdCLFNBQUE7ZUFBRyxFQUFFLENBQUMsTUFBSCxDQUFVLFlBQVY7TUFBSCxDQUF4QixDQUFoQjtJQURJLENBSE4sQ0FLQSxFQUFDLEtBQUQsRUFMQSxDQUtPLFNBQUMsR0FBRDtNQUNMLElBQUcsR0FBQSxLQUFPLGFBQVY7ZUFDRSxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQURGO09BQUEsTUFBQTtlQUdFLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQWxCLEVBSEY7O0lBREssQ0FMUDtFQVRlO0FBMUJqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5PcyA9IHJlcXVpcmUgJ29zJ1xuUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5cbm5vdGhpbmdUb1Nob3cgPSAnTm90aGluZyB0byBzaG93LidcblxuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG5zaG93RmlsZSA9IChmaWxlUGF0aCkgLT5cbiAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5vcGVuSW5QYW5lJylcbiAgICBzcGxpdERpcmVjdGlvbiA9IGF0b20uY29uZmlnLmdldCgnZ2l0LXBsdXMuc3BsaXRQYW5lJylcbiAgICBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lKClbXCJzcGxpdCN7c3BsaXREaXJlY3Rpb259XCJdKClcbiAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlUGF0aClcblxucHJlcEZpbGUgPSAodGV4dCwgZmlsZVBhdGgpIC0+XG4gIG5ldyBQcm9taXNlIChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgaWYgdGV4dD8ubGVuZ3RoIGlzIDBcbiAgICAgIHJlamVjdCBub3RoaW5nVG9TaG93XG4gICAgZWxzZVxuICAgICAgZnMud3JpdGVGaWxlIGZpbGVQYXRoLCB0ZXh0LCBmbGFnOiAndysnLCAoZXJyKSAtPlxuICAgICAgICBpZiBlcnIgdGhlbiByZWplY3QgZXJyIGVsc2UgcmVzb2x2ZSB0cnVlXG5cbm1vZHVsZS5leHBvcnRzID0gKHJlcG8sIHtkaWZmU3RhdCwgZmlsZX09e30pIC0+XG4gIGRpZmZGaWxlUGF0aCA9IFBhdGguam9pbihyZXBvLmdldFBhdGgoKSwgXCJhdG9tX2dpdF9wbHVzLmRpZmZcIilcbiAgZmlsZSA/PSByZXBvLnJlbGF0aXZpemUoYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpPy5nZXRQYXRoKCkpXG4gIGlmIG5vdCBmaWxlXG4gICAgcmV0dXJuIG5vdGlmaWVyLmFkZEVycm9yIFwiTm8gb3BlbiBmaWxlLiBTZWxlY3QgJ0RpZmYgQWxsJy5cIlxuICBhcmdzID0gWydkaWZmJywgJy0tY29sb3I9bmV2ZXInXVxuICBhcmdzLnB1c2ggJ0hFQUQnIGlmIGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMuaW5jbHVkZVN0YWdlZERpZmYnXG4gIGFyZ3MucHVzaCAnLS13b3JkLWRpZmYnIGlmIGF0b20uY29uZmlnLmdldCAnZ2l0LXBsdXMud29yZERpZmYnXG4gIGFyZ3MucHVzaCBmaWxlIHVubGVzcyBkaWZmU3RhdFxuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPiBwcmVwRmlsZSgoZGlmZlN0YXQgPyAnJykgKyBkYXRhLCBkaWZmRmlsZVBhdGgpXG4gIC50aGVuIC0+IHNob3dGaWxlIGRpZmZGaWxlUGF0aFxuICAudGhlbiAodGV4dEVkaXRvcikgLT5cbiAgICBkaXNwb3NhYmxlcy5hZGQgdGV4dEVkaXRvci5vbkRpZERlc3Ryb3kgLT4gZnMudW5saW5rIGRpZmZGaWxlUGF0aFxuICAuY2F0Y2ggKGVycikgLT5cbiAgICBpZiBlcnIgaXMgbm90aGluZ1RvU2hvd1xuICAgICAgbm90aWZpZXIuYWRkSW5mbyBlcnJcbiAgICBlbHNlXG4gICAgICBub3RpZmllci5hZGRFcnJvciBlcnJcbiJdfQ==
