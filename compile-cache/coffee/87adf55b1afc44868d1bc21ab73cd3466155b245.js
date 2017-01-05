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
    if (atom.config.get('git-plus.general.openInPane')) {
      splitDirection = atom.config.get('git-plus.general.splitPane');
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
    if (atom.config.get('git-plus.diffs.includeStagedDiff')) {
      args.push('HEAD');
    }
    if (atom.config.get('git-plus.diffs.wordDiff')) {
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1kaWZmLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUMsc0JBQXVCLE9BQUEsQ0FBUSxNQUFSOztFQUN4QixFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEVBQUEsR0FBSyxPQUFBLENBQVEsU0FBUjs7RUFFTCxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSOztFQUVYLGFBQUEsR0FBZ0I7O0VBRWhCLFdBQUEsR0FBYyxJQUFJOztFQUVsQixRQUFBLEdBQVcsU0FBQyxRQUFEO0FBQ1QsUUFBQTtJQUFBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUFIO01BQ0UsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCO01BQ2pCLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBZixDQUFBLENBQStCLENBQUEsT0FBQSxHQUFRLGNBQVIsQ0FBL0IsQ0FBQSxFQUZGOztXQUdBLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQjtFQUpTOztFQU1YLFFBQUEsR0FBVyxTQUFDLElBQUQsRUFBTyxRQUFQO1dBQ0wsSUFBQSxPQUFBLENBQVEsU0FBQyxPQUFELEVBQVUsTUFBVjtNQUNWLG9CQUFHLElBQUksQ0FBRSxnQkFBTixLQUFnQixDQUFuQjtlQUNFLE1BQUEsQ0FBTyxhQUFQLEVBREY7T0FBQSxNQUFBO2VBR0UsRUFBRSxDQUFDLFNBQUgsQ0FBYSxRQUFiLEVBQXVCLElBQXZCLEVBQTZCO1VBQUEsSUFBQSxFQUFNLElBQU47U0FBN0IsRUFBeUMsU0FBQyxHQUFEO1VBQ3ZDLElBQUcsR0FBSDttQkFBWSxNQUFBLENBQU8sR0FBUCxFQUFaO1dBQUEsTUFBQTttQkFBNEIsT0FBQSxDQUFRLElBQVIsRUFBNUI7O1FBRHVDLENBQXpDLEVBSEY7O0lBRFUsQ0FBUjtFQURLOztFQVFYLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVA7QUFDZixRQUFBO3dCQURzQixNQUFpQixJQUFoQix5QkFBVTtJQUNqQyxZQUFBLEdBQWUsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsT0FBTCxDQUFBLENBQVYsRUFBMEIsb0JBQTFCOztNQUNmLE9BQVEsSUFBSSxDQUFDLFVBQUwsNkRBQW9ELENBQUUsT0FBdEMsQ0FBQSxVQUFoQjs7SUFDUixJQUFHLENBQUksSUFBUDtBQUNFLGFBQU8sUUFBUSxDQUFDLFFBQVQsQ0FBa0Isa0NBQWxCLEVBRFQ7O0lBRUEsSUFBQSxHQUFPLENBQUMsTUFBRCxFQUFTLGVBQVQ7SUFDUCxJQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBQXBCO01BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxNQUFWLEVBQUE7O0lBQ0EsSUFBMkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHlCQUFoQixDQUEzQjtNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsYUFBVixFQUFBOztJQUNBLElBQUEsQ0FBc0IsUUFBdEI7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBQTs7V0FDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFBVSxRQUFBLENBQVMsb0JBQUMsV0FBVyxFQUFaLENBQUEsR0FBa0IsSUFBM0IsRUFBaUMsWUFBakM7SUFBVixDQUROLENBRUEsQ0FBQyxJQUZELENBRU0sU0FBQTthQUFHLFFBQUEsQ0FBUyxZQUFUO0lBQUgsQ0FGTixDQUdBLENBQUMsSUFIRCxDQUdNLFNBQUMsVUFBRDthQUNKLFdBQVcsQ0FBQyxHQUFaLENBQWdCLFVBQVUsQ0FBQyxZQUFYLENBQXdCLFNBQUE7ZUFBRyxFQUFFLENBQUMsTUFBSCxDQUFVLFlBQVY7TUFBSCxDQUF4QixDQUFoQjtJQURJLENBSE4sQ0FLQSxFQUFDLEtBQUQsRUFMQSxDQUtPLFNBQUMsR0FBRDtNQUNMLElBQUcsR0FBQSxLQUFPLGFBQVY7ZUFDRSxRQUFRLENBQUMsT0FBVCxDQUFpQixHQUFqQixFQURGO09BQUEsTUFBQTtlQUdFLFFBQVEsQ0FBQyxRQUFULENBQWtCLEdBQWxCLEVBSEY7O0lBREssQ0FMUDtFQVRlO0FBMUJqQiIsInNvdXJjZXNDb250ZW50IjpbIntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5PcyA9IHJlcXVpcmUgJ29zJ1xuUGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5mcyA9IHJlcXVpcmUgJ2ZzLXBsdXMnXG5cbmdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbm5vdGlmaWVyID0gcmVxdWlyZSAnLi4vbm90aWZpZXInXG5cbm5vdGhpbmdUb1Nob3cgPSAnTm90aGluZyB0byBzaG93LidcblxuZGlzcG9zYWJsZXMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuXG5zaG93RmlsZSA9IChmaWxlUGF0aCkgLT5cbiAgaWYgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm9wZW5JblBhbmUnKVxuICAgIHNwbGl0RGlyZWN0aW9uID0gYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLnNwbGl0UGFuZScpXG4gICAgYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpW1wic3BsaXQje3NwbGl0RGlyZWN0aW9ufVwiXSgpXG4gIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZVBhdGgpXG5cbnByZXBGaWxlID0gKHRleHQsIGZpbGVQYXRoKSAtPlxuICBuZXcgUHJvbWlzZSAocmVzb2x2ZSwgcmVqZWN0KSAtPlxuICAgIGlmIHRleHQ/Lmxlbmd0aCBpcyAwXG4gICAgICByZWplY3Qgbm90aGluZ1RvU2hvd1xuICAgIGVsc2VcbiAgICAgIGZzLndyaXRlRmlsZSBmaWxlUGF0aCwgdGV4dCwgZmxhZzogJ3crJywgKGVycikgLT5cbiAgICAgICAgaWYgZXJyIHRoZW4gcmVqZWN0IGVyciBlbHNlIHJlc29sdmUgdHJ1ZVxuXG5tb2R1bGUuZXhwb3J0cyA9IChyZXBvLCB7ZGlmZlN0YXQsIGZpbGV9PXt9KSAtPlxuICBkaWZmRmlsZVBhdGggPSBQYXRoLmpvaW4ocmVwby5nZXRQYXRoKCksIFwiYXRvbV9naXRfcGx1cy5kaWZmXCIpXG4gIGZpbGUgPz0gcmVwby5yZWxhdGl2aXplKGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKT8uZ2V0UGF0aCgpKVxuICBpZiBub3QgZmlsZVxuICAgIHJldHVybiBub3RpZmllci5hZGRFcnJvciBcIk5vIG9wZW4gZmlsZS4gU2VsZWN0ICdEaWZmIEFsbCcuXCJcbiAgYXJncyA9IFsnZGlmZicsICctLWNvbG9yPW5ldmVyJ11cbiAgYXJncy5wdXNoICdIRUFEJyBpZiBhdG9tLmNvbmZpZy5nZXQgJ2dpdC1wbHVzLmRpZmZzLmluY2x1ZGVTdGFnZWREaWZmJ1xuICBhcmdzLnB1c2ggJy0td29yZC1kaWZmJyBpZiBhdG9tLmNvbmZpZy5nZXQgJ2dpdC1wbHVzLmRpZmZzLndvcmREaWZmJ1xuICBhcmdzLnB1c2ggZmlsZSB1bmxlc3MgZGlmZlN0YXRcbiAgZ2l0LmNtZChhcmdzLCBjd2Q6IHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAudGhlbiAoZGF0YSkgLT4gcHJlcEZpbGUoKGRpZmZTdGF0ID8gJycpICsgZGF0YSwgZGlmZkZpbGVQYXRoKVxuICAudGhlbiAtPiBzaG93RmlsZSBkaWZmRmlsZVBhdGhcbiAgLnRoZW4gKHRleHRFZGl0b3IpIC0+XG4gICAgZGlzcG9zYWJsZXMuYWRkIHRleHRFZGl0b3Iub25EaWREZXN0cm95IC0+IGZzLnVubGluayBkaWZmRmlsZVBhdGhcbiAgLmNhdGNoIChlcnIpIC0+XG4gICAgaWYgZXJyIGlzIG5vdGhpbmdUb1Nob3dcbiAgICAgIG5vdGlmaWVyLmFkZEluZm8gZXJyXG4gICAgZWxzZVxuICAgICAgbm90aWZpZXIuYWRkRXJyb3IgZXJyXG4iXX0=
