Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/no-extraneous-dependencies, import/extensions

var _atom = require('atom');

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

var _path = require('path');

// Local variables
'use babel';var regex = /line (\d+) column (\d+) - (Warning|Error): (.+)/g;
var defaultExecutableArguments = ['-quiet', '-errors', '--tab-size', '1'];
// Settings
var grammarScopes = [];
var executablePath = undefined;
var configExecutableArguments = undefined;

exports['default'] = {
  activate: function activate() {
    require('atom-package-deps').install('linter-tidy');

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-tidy.executablePath', function (value) {
      executablePath = value;
    }));

    this.subscriptions.add(atom.config.observe('linter-tidy.executableArguments', function (value) {
      configExecutableArguments = value;
    }));

    // Add a listener to update the list of grammar scopes linted when the
    // config value changes.
    this.subscriptions.add(atom.config.observe('linter-tidy.grammarScopes', function (configScopes) {
      grammarScopes.splice(0, grammarScopes.length);
      grammarScopes.push.apply(grammarScopes, _toConsumableArray(configScopes));
    }));
  },

  deactivate: function deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    return {
      grammarScopes: grammarScopes,
      name: 'tidy',
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();

        var parameters = defaultExecutableArguments.concat(configExecutableArguments);

        var _atom$project$relativizePath = atom.project.relativizePath(filePath);

        var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 1);

        var projectPath = _atom$project$relativizePath2[0];

        var execOptions = {
          stream: 'stderr',
          stdin: fileText,
          cwd: projectPath !== null ? projectPath : (0, _path.dirname)(filePath),
          allowEmptyStderr: true
        };

        var output = yield helpers.exec(executablePath, parameters, execOptions);

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, don't update the messages
          return null;
        }

        var messages = [];
        var match = regex.exec(output);
        while (match !== null) {
          var line = Number.parseInt(match[1], 10) - 1;
          var col = Number.parseInt(match[2], 10) - 1;
          messages.push({
            type: match[3],
            text: match[4],
            filePath: filePath,
            range: helpers.rangeFromLineNumber(textEditor, line, col)
          });
          match = regex.exec(output);
        }
        return messages;
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvbGludGVyLXRpZHkvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7b0JBR29DLE1BQU07OzBCQUNqQixhQUFhOztJQUExQixPQUFPOztvQkFDSyxNQUFNOzs7QUFMOUIsV0FBVyxDQUFDLEFBUVosSUFBTSxLQUFLLEdBQUcsa0RBQWtELENBQUM7QUFDakUsSUFBTSwwQkFBMEIsR0FBRyxDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLEdBQUcsQ0FBQyxDQUFDOztBQUU1RSxJQUFNLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDekIsSUFBSSxjQUFjLFlBQUEsQ0FBQztBQUNuQixJQUFJLHlCQUF5QixZQUFBLENBQUM7O3FCQUVmO0FBQ2IsVUFBUSxFQUFBLG9CQUFHO0FBQ1QsV0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVwRCxRQUFJLENBQUMsYUFBYSxHQUFHLCtCQUF5QixDQUFDO0FBQy9DLFFBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUNwQixJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyw0QkFBNEIsRUFBRSxVQUFDLEtBQUssRUFBSztBQUMzRCxvQkFBYyxHQUFHLEtBQUssQ0FBQztLQUN4QixDQUFDLENBQ0gsQ0FBQzs7QUFFRixRQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FDcEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsaUNBQWlDLEVBQUUsVUFBQyxLQUFLLEVBQUs7QUFDaEUsK0JBQXlCLEdBQUcsS0FBSyxDQUFDO0tBQ25DLENBQUMsQ0FDSCxDQUFDOzs7O0FBSUYsUUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQ3BCLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLDJCQUEyQixFQUFFLFVBQUMsWUFBWSxFQUFLO0FBQ2pFLG1CQUFhLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUMsbUJBQWEsQ0FBQyxJQUFJLE1BQUEsQ0FBbEIsYUFBYSxxQkFBUyxZQUFZLEVBQUMsQ0FBQztLQUNyQyxDQUFDLENBQ0gsQ0FBQztHQUNIOztBQUVELFlBQVUsRUFBQSxzQkFBRztBQUNYLFFBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7R0FDOUI7O0FBRUQsZUFBYSxFQUFBLHlCQUFHO0FBQ2QsV0FBTztBQUNMLG1CQUFhLEVBQWIsYUFBYTtBQUNiLFVBQUksRUFBRSxNQUFNO0FBQ1osV0FBSyxFQUFFLE1BQU07QUFDYixlQUFTLEVBQUUsSUFBSTtBQUNmLFVBQUksb0JBQUUsV0FBTyxVQUFVLEVBQUs7QUFDMUIsWUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQ3RDLFlBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFdEMsWUFBTSxVQUFVLEdBQUcsMEJBQTBCLENBQUMsTUFBTSxDQUFDLHlCQUF5QixDQUFDLENBQUM7OzJDQUUxRCxJQUFJLENBQUMsT0FBTyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUM7Ozs7WUFBcEQsV0FBVzs7QUFDbEIsWUFBTSxXQUFXLEdBQUc7QUFDbEIsZ0JBQU0sRUFBRSxRQUFRO0FBQ2hCLGVBQUssRUFBRSxRQUFRO0FBQ2YsYUFBRyxFQUFFLFdBQVcsS0FBSyxJQUFJLEdBQUcsV0FBVyxHQUFHLG1CQUFRLFFBQVEsQ0FBQztBQUMzRCwwQkFBZ0IsRUFBRSxJQUFJO1NBQ3ZCLENBQUM7O0FBRUYsWUFBTSxNQUFNLEdBQUcsTUFBTSxPQUFPLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7O0FBRTNFLFlBQUksVUFBVSxDQUFDLE9BQU8sRUFBRSxLQUFLLFFBQVEsRUFBRTs7QUFFckMsaUJBQU8sSUFBSSxDQUFDO1NBQ2I7O0FBRUQsWUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFlBQUksS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDL0IsZUFBTyxLQUFLLEtBQUssSUFBSSxFQUFFO0FBQ3JCLGNBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMvQyxjQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDOUMsa0JBQVEsQ0FBQyxJQUFJLENBQUM7QUFDWixnQkFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDZCxnQkFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDZCxvQkFBUSxFQUFSLFFBQVE7QUFDUixpQkFBSyxFQUFFLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQztXQUMxRCxDQUFDLENBQUM7QUFDSCxlQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM1QjtBQUNELGVBQU8sUUFBUSxDQUFDO09BQ2pCLENBQUE7S0FDRixDQUFDO0dBQ0g7Q0FDRiIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2xpbnRlci10aWR5L2xpYi9tYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBpbXBvcnQvbm8tZXh0cmFuZW91cy1kZXBlbmRlbmNpZXMsIGltcG9ydC9leHRlbnNpb25zXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSAnYXRvbSc7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJ2F0b20tbGludGVyJztcbmltcG9ydCB7IGRpcm5hbWUgfSBmcm9tICdwYXRoJztcblxuLy8gTG9jYWwgdmFyaWFibGVzXG5jb25zdCByZWdleCA9IC9saW5lIChcXGQrKSBjb2x1bW4gKFxcZCspIC0gKFdhcm5pbmd8RXJyb3IpOiAoLispL2c7XG5jb25zdCBkZWZhdWx0RXhlY3V0YWJsZUFyZ3VtZW50cyA9IFsnLXF1aWV0JywgJy1lcnJvcnMnLCAnLS10YWItc2l6ZScsICcxJ107XG4vLyBTZXR0aW5nc1xuY29uc3QgZ3JhbW1hclNjb3BlcyA9IFtdO1xubGV0IGV4ZWN1dGFibGVQYXRoO1xubGV0IGNvbmZpZ0V4ZWN1dGFibGVBcmd1bWVudHM7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItdGlkeScpO1xuXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXRpZHkuZXhlY3V0YWJsZVBhdGgnLCAodmFsdWUpID0+IHtcbiAgICAgICAgZXhlY3V0YWJsZVBhdGggPSB2YWx1ZTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItdGlkeS5leGVjdXRhYmxlQXJndW1lbnRzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIGNvbmZpZ0V4ZWN1dGFibGVBcmd1bWVudHMgPSB2YWx1ZTtcbiAgICAgIH0pXG4gICAgKTtcblxuICAgIC8vIEFkZCBhIGxpc3RlbmVyIHRvIHVwZGF0ZSB0aGUgbGlzdCBvZiBncmFtbWFyIHNjb3BlcyBsaW50ZWQgd2hlbiB0aGVcbiAgICAvLyBjb25maWcgdmFsdWUgY2hhbmdlcy5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXRpZHkuZ3JhbW1hclNjb3BlcycsIChjb25maWdTY29wZXMpID0+IHtcbiAgICAgICAgZ3JhbW1hclNjb3Blcy5zcGxpY2UoMCwgZ3JhbW1hclNjb3Blcy5sZW5ndGgpO1xuICAgICAgICBncmFtbWFyU2NvcGVzLnB1c2goLi4uY29uZmlnU2NvcGVzKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfSxcblxuICBkZWFjdGl2YXRlKCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ3JhbW1hclNjb3BlcyxcbiAgICAgIG5hbWU6ICd0aWR5JyxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBmaWxlVGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBkZWZhdWx0RXhlY3V0YWJsZUFyZ3VtZW50cy5jb25jYXQoY29uZmlnRXhlY3V0YWJsZUFyZ3VtZW50cyk7XG5cbiAgICAgICAgY29uc3QgW3Byb2plY3RQYXRoXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aCk7XG4gICAgICAgIGNvbnN0IGV4ZWNPcHRpb25zID0ge1xuICAgICAgICAgIHN0cmVhbTogJ3N0ZGVycicsXG4gICAgICAgICAgc3RkaW46IGZpbGVUZXh0LFxuICAgICAgICAgIGN3ZDogcHJvamVjdFBhdGggIT09IG51bGwgPyBwcm9qZWN0UGF0aCA6IGRpcm5hbWUoZmlsZVBhdGgpLFxuICAgICAgICAgIGFsbG93RW1wdHlTdGRlcnI6IHRydWUsXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3Qgb3V0cHV0ID0gYXdhaXQgaGVscGVycy5leGVjKGV4ZWN1dGFibGVQYXRoLCBwYXJhbWV0ZXJzLCBleGVjT3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKHRleHRFZGl0b3IuZ2V0VGV4dCgpICE9PSBmaWxlVGV4dCkge1xuICAgICAgICAgIC8vIEVkaXRvciBjb250ZW50cyBoYXZlIGNoYW5nZWQsIGRvbid0IHVwZGF0ZSB0aGUgbWVzc2FnZXNcbiAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzID0gW107XG4gICAgICAgIGxldCBtYXRjaCA9IHJlZ2V4LmV4ZWMob3V0cHV0KTtcbiAgICAgICAgd2hpbGUgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgY29uc3QgbGluZSA9IE51bWJlci5wYXJzZUludChtYXRjaFsxXSwgMTApIC0gMTtcbiAgICAgICAgICBjb25zdCBjb2wgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDE7XG4gICAgICAgICAgbWVzc2FnZXMucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBtYXRjaFszXSxcbiAgICAgICAgICAgIHRleHQ6IG1hdGNoWzRdLFxuICAgICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgICByYW5nZTogaGVscGVycy5yYW5nZUZyb21MaW5lTnVtYmVyKHRleHRFZGl0b3IsIGxpbmUsIGNvbCksXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgbWF0Y2ggPSByZWdleC5leGVjKG91dHB1dCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1lc3NhZ2VzO1xuICAgICAgfSxcbiAgICB9O1xuICB9LFxufTtcbiJdfQ==