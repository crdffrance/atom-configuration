Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atom = require('atom');

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var RenameView = require('./atom-ternjs-rename-view');

var Rename = (function () {
  function Rename() {
    _classCallCheck(this, Rename);

    this.disposables = [];

    this.renameView = new RenameView();
    this.renameView.initialize(this);

    this.renamePanel = atom.workspace.addBottomPanel({

      item: this.renameView,
      priority: 0
    });

    this.renamePanel.hide();

    atom.views.getView(this.renamePanel).classList.add('atom-ternjs-rename-panel', 'panel-bottom');

    this.hideHandler = this.hide.bind(this);
    _atomTernjsEvents2['default'].on('rename-hide', this.hideHandler);

    this.registerCommands();
  }

  _createClass(Rename, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:rename', this.show.bind(this)));
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.renamePanel || !this.renamePanel.visible) {

        return;
      }

      this.renamePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      var codeEditor = atom.workspace.getActiveTextEditor();
      var currentNameRange = codeEditor.getLastCursor().getCurrentWordBufferRange({ includeNonWordCharacters: false });
      var currentName = codeEditor.getTextInBufferRange(currentNameRange);

      this.renameView.nameEditor.getModel().setText(currentName);
      this.renameView.nameEditor.getModel().selectAll();

      this.renamePanel.show();
      this.renameView.nameEditor.focus();
    }
  }, {
    key: 'updateAllAndRename',
    value: function updateAllAndRename(newName) {
      var _this = this;

      if (!_atomTernjsManager2['default'].client) {

        this.hide();

        return;
      }

      var idx = 0;
      var editors = atom.workspace.getTextEditors();

      for (var editor of editors) {

        if (!_atomTernjsManager2['default'].isValidEditor(editor) || atom.project.relativizePath(editor.getURI())[0] !== _atomTernjsManager2['default'].client.projectDir) {

          idx++;

          continue;
        }

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {

          if (++idx === editors.length) {

            var activeEditor = atom.workspace.getActiveTextEditor();
            var cursor = activeEditor.getLastCursor();

            if (!cursor) {

              return;
            }

            var position = cursor.getBufferPosition();

            _atomTernjsManager2['default'].client.rename(atom.project.relativizePath(activeEditor.getURI())[1], { line: position.row, ch: position.column }, newName).then(function (data) {

              if (!data) {

                return;
              }

              _this.rename(data);
            })['catch'](function (error) {

              atom.notifications.addError(error, {

                dismissable: false
              });
            });
          }
        });
      }
    }
  }, {
    key: 'rename',
    value: function rename(data) {

      var dir = _atomTernjsManager2['default'].server.projectDir;

      if (!dir) {

        return;
      }

      var translateColumnBy = data.changes[0].text.length - data.name.length;

      for (var change of data.changes) {

        change.file = change.file.replace(/^.\//, '');
        change.file = _path2['default'].resolve(atom.project.relativizePath(dir)[0], change.file);
      }

      var changes = (0, _underscorePlus.uniq)(data.changes, function (item) {

        return JSON.stringify(item);
      });

      var currentFile = false;
      var arr = [];
      var idx = 0;

      for (var change of changes) {

        if (currentFile !== change.file) {

          currentFile = change.file;
          idx = arr.push([]) - 1;
        }

        arr[idx].push(change);
      }

      for (var arrObj of arr) {

        this.openFilesAndRename(arrObj, translateColumnBy);
      }

      this.hide();
    }
  }, {
    key: 'openFilesAndRename',
    value: function openFilesAndRename(obj, translateColumnBy) {
      var _this2 = this;

      atom.workspace.open(obj[0].file).then(function (textEditor) {

        var currentColumnOffset = 0;
        var idx = 0;
        var buffer = textEditor.getBuffer();
        var checkpoint = buffer.createCheckpoint();

        for (var change of obj) {

          _this2.setTextInRange(buffer, change, currentColumnOffset, idx === obj.length - 1, textEditor);
          currentColumnOffset += translateColumnBy;

          idx++;
        }

        buffer.groupChangesSinceCheckpoint(checkpoint);
      });
    }
  }, {
    key: 'setTextInRange',
    value: function setTextInRange(buffer, change, offset, moveCursor, textEditor) {

      change.start += offset;
      change.end += offset;
      var position = buffer.positionForCharacterIndex(change.start);
      length = change.end - change.start;
      var end = position.translate(new _atom.Point(0, length));
      var range = new _atom.Range(position, end);
      buffer.setTextInRange(range, change.text);

      if (!moveCursor) {

        return;
      }

      var cursor = textEditor.getLastCursor();

      cursor && cursor.setBufferPosition(position);
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      this.renameView && this.renameView.destroy();
      this.renameView = null;

      this.renamePanel && this.renamePanel.destroy();
      this.renamePanel = null;
    }
  }]);

  return Rename;
})();

exports['default'] = new Rename();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlbmFtZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2dDQUlvQixzQkFBc0I7Ozs7aUNBQ3RCLHVCQUF1Qjs7OztvQkFJcEMsTUFBTTs7OEJBQ00saUJBQWlCOztvQkFDbkIsTUFBTTs7OztnQ0FJaEIsc0JBQXNCOztBQWY3QixXQUFXLENBQUM7O0FBRVosSUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7O0lBZWxELE1BQU07QUFFQyxXQUZQLE1BQU0sR0FFSTswQkFGVixNQUFNOztBQUlSLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV0QixRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7QUFDbkMsUUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWpDLFFBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7O0FBRS9DLFVBQUksRUFBRSxJQUFJLENBQUMsVUFBVTtBQUNyQixjQUFRLEVBQUUsQ0FBQztLQUNaLENBQUMsQ0FBQzs7QUFFSCxRQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUV4QixRQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQywwQkFBMEIsRUFBRSxjQUFjLENBQUMsQ0FBQzs7QUFFL0YsUUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN4QyxrQ0FBUSxFQUFFLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFNUMsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7R0FD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LElBQUksQ0FBQztLQUN6Qjs7O1NBcE5HLE1BQU07OztxQkF1TkcsSUFBSSxNQUFNLEVBQUUiLCJmaWxlIjoiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVuYW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IFJlbmFtZVZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXJlbmFtZS12aWV3Jyk7XG5cbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQge1xuICBQb2ludCxcbiAgUmFuZ2Vcbn0gZnJvbSAnYXRvbSc7XG5pbXBvcnQge3VuaXF9IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7XG4gIGRpc3Bvc2VBbGwsXG4gIGZvY3VzRWRpdG9yXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuY2xhc3MgUmVuYW1lIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgIHRoaXMucmVuYW1lVmlldyA9IG5ldyBSZW5hbWVWaWV3KCk7XG4gICAgdGhpcy5yZW5hbWVWaWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICB0aGlzLnJlbmFtZVBhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoe1xuXG4gICAgICBpdGVtOiB0aGlzLnJlbmFtZVZpZXcsXG4gICAgICBwcmlvcml0eTogMFxuICAgIH0pO1xuXG4gICAgdGhpcy5yZW5hbWVQYW5lbC5oaWRlKCk7XG5cbiAgICBhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5yZW5hbWVQYW5lbCkuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtcmVuYW1lLXBhbmVsJywgJ3BhbmVsLWJvdHRvbScpO1xuXG4gICAgdGhpcy5oaWRlSGFuZGxlciA9IHRoaXMuaGlkZS5iaW5kKHRoaXMpO1xuICAgIGVtaXR0ZXIub24oJ3JlbmFtZS1oaWRlJywgdGhpcy5oaWRlSGFuZGxlcik7XG5cbiAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZHMoKTtcbiAgfVxuXG4gIHJlZ2lzdGVyQ29tbWFuZHMoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6cmVuYW1lJywgdGhpcy5zaG93LmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIGhpZGUoKSB7XG5cbiAgICBpZiAoXG4gICAgICAhdGhpcy5yZW5hbWVQYW5lbCB8fFxuICAgICAgIXRoaXMucmVuYW1lUGFuZWwudmlzaWJsZVxuICAgICkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5yZW5hbWVQYW5lbC5oaWRlKCk7XG5cbiAgICBmb2N1c0VkaXRvcigpO1xuICB9XG5cbiAgc2hvdygpIHtcblxuICAgIGNvbnN0IGNvZGVFZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgY3VycmVudE5hbWVSYW5nZSA9IGNvZGVFZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldEN1cnJlbnRXb3JkQnVmZmVyUmFuZ2Uoe2luY2x1ZGVOb25Xb3JkQ2hhcmFjdGVyczogZmFsc2V9KTtcbiAgICBjb25zdCBjdXJyZW50TmFtZSA9IGNvZGVFZGl0b3IuZ2V0VGV4dEluQnVmZmVyUmFuZ2UoY3VycmVudE5hbWVSYW5nZSk7XG5cbiAgICB0aGlzLnJlbmFtZVZpZXcubmFtZUVkaXRvci5nZXRNb2RlbCgpLnNldFRleHQoY3VycmVudE5hbWUpO1xuICAgIHRoaXMucmVuYW1lVmlldy5uYW1lRWRpdG9yLmdldE1vZGVsKCkuc2VsZWN0QWxsKCk7XG5cbiAgICB0aGlzLnJlbmFtZVBhbmVsLnNob3coKTtcbiAgICB0aGlzLnJlbmFtZVZpZXcubmFtZUVkaXRvci5mb2N1cygpO1xuICB9XG5cbiAgdXBkYXRlQWxsQW5kUmVuYW1lKG5ld05hbWUpIHtcblxuICAgIGlmICghbWFuYWdlci5jbGllbnQpIHtcblxuICAgICAgdGhpcy5oaWRlKCk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaWR4ID0gMDtcbiAgICBjb25zdCBlZGl0b3JzID0gYXRvbS53b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKTtcblxuICAgIGZvciAoY29uc3QgZWRpdG9yIG9mIGVkaXRvcnMpIHtcblxuICAgICAgaWYgKFxuICAgICAgICAhbWFuYWdlci5pc1ZhbGlkRWRpdG9yKGVkaXRvcikgfHxcbiAgICAgICAgYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMF0gIT09IG1hbmFnZXIuY2xpZW50LnByb2plY3REaXJcbiAgICAgICkge1xuXG4gICAgICAgIGlkeCsrO1xuXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBtYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgaWYgKCsraWR4ID09PSBlZGl0b3JzLmxlbmd0aCkge1xuXG4gICAgICAgICAgY29uc3QgYWN0aXZlRWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgICAgICAgIGNvbnN0IGN1cnNvciA9IGFjdGl2ZUVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICAgICAgICBpZiAoIWN1cnNvcikge1xuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29uc3QgcG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKTtcblxuICAgICAgICAgIG1hbmFnZXIuY2xpZW50LnJlbmFtZShhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoYWN0aXZlRWRpdG9yLmdldFVSSSgpKVsxXSwge2xpbmU6IHBvc2l0aW9uLnJvdywgY2g6IHBvc2l0aW9uLmNvbHVtbn0sIG5ld05hbWUpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgICAgICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnJlbmFtZShkYXRhKTtcblxuICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoZXJyb3IsIHtcblxuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICByZW5hbWUoZGF0YSkge1xuXG4gICAgY29uc3QgZGlyID0gbWFuYWdlci5zZXJ2ZXIucHJvamVjdERpcjtcblxuICAgIGlmICghZGlyKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0cmFuc2xhdGVDb2x1bW5CeSA9IGRhdGEuY2hhbmdlc1swXS50ZXh0Lmxlbmd0aCAtIGRhdGEubmFtZS5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBjaGFuZ2Ugb2YgZGF0YS5jaGFuZ2VzKSB7XG5cbiAgICAgIGNoYW5nZS5maWxlID0gY2hhbmdlLmZpbGUucmVwbGFjZSgvXi5cXC8vLCAnJyk7XG4gICAgICBjaGFuZ2UuZmlsZSA9IHBhdGgucmVzb2x2ZShhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZGlyKVswXSwgY2hhbmdlLmZpbGUpO1xuICAgIH1cblxuICAgIGxldCBjaGFuZ2VzID0gdW5pcShkYXRhLmNoYW5nZXMsIChpdGVtKSA9PiB7XG5cbiAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShpdGVtKTtcbiAgICB9KTtcblxuICAgIGxldCBjdXJyZW50RmlsZSA9IGZhbHNlO1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICBsZXQgaWR4ID0gMDtcblxuICAgIGZvciAoY29uc3QgY2hhbmdlIG9mIGNoYW5nZXMpIHtcblxuICAgICAgaWYgKGN1cnJlbnRGaWxlICE9PSBjaGFuZ2UuZmlsZSkge1xuXG4gICAgICAgIGN1cnJlbnRGaWxlID0gY2hhbmdlLmZpbGU7XG4gICAgICAgIGlkeCA9IGFyci5wdXNoKFtdKSAtIDE7XG4gICAgICB9XG5cbiAgICAgIGFycltpZHhdLnB1c2goY2hhbmdlKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IGFyck9iaiBvZiBhcnIpIHtcblxuICAgICAgdGhpcy5vcGVuRmlsZXNBbmRSZW5hbWUoYXJyT2JqLCB0cmFuc2xhdGVDb2x1bW5CeSk7XG4gICAgfVxuXG4gICAgdGhpcy5oaWRlKCk7XG4gIH1cblxuICBvcGVuRmlsZXNBbmRSZW5hbWUob2JqLCB0cmFuc2xhdGVDb2x1bW5CeSkge1xuXG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihvYmpbMF0uZmlsZSkudGhlbigodGV4dEVkaXRvcikgPT4ge1xuXG4gICAgICBsZXQgY3VycmVudENvbHVtbk9mZnNldCA9IDA7XG4gICAgICBsZXQgaWR4ID0gMDtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IHRleHRFZGl0b3IuZ2V0QnVmZmVyKCk7XG4gICAgICBjb25zdCBjaGVja3BvaW50ID0gYnVmZmVyLmNyZWF0ZUNoZWNrcG9pbnQoKTtcblxuICAgICAgZm9yIChjb25zdCBjaGFuZ2Ugb2Ygb2JqKSB7XG5cbiAgICAgICAgdGhpcy5zZXRUZXh0SW5SYW5nZShidWZmZXIsIGNoYW5nZSwgY3VycmVudENvbHVtbk9mZnNldCwgaWR4ID09PSBvYmoubGVuZ3RoIC0gMSwgdGV4dEVkaXRvcik7XG4gICAgICAgIGN1cnJlbnRDb2x1bW5PZmZzZXQgKz0gdHJhbnNsYXRlQ29sdW1uQnk7XG5cbiAgICAgICAgaWR4Kys7XG4gICAgICB9XG5cbiAgICAgIGJ1ZmZlci5ncm91cENoYW5nZXNTaW5jZUNoZWNrcG9pbnQoY2hlY2twb2ludCk7XG4gICAgfSk7XG4gIH1cblxuICBzZXRUZXh0SW5SYW5nZShidWZmZXIsIGNoYW5nZSwgb2Zmc2V0LCBtb3ZlQ3Vyc29yLCB0ZXh0RWRpdG9yKSB7XG5cbiAgICBjaGFuZ2Uuc3RhcnQgKz0gb2Zmc2V0O1xuICAgIGNoYW5nZS5lbmQgKz0gb2Zmc2V0O1xuICAgIGNvbnN0IHBvc2l0aW9uID0gYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoY2hhbmdlLnN0YXJ0KTtcbiAgICBsZW5ndGggPSBjaGFuZ2UuZW5kIC0gY2hhbmdlLnN0YXJ0O1xuICAgIGNvbnN0IGVuZCA9IHBvc2l0aW9uLnRyYW5zbGF0ZShuZXcgUG9pbnQoMCwgbGVuZ3RoKSk7XG4gICAgY29uc3QgcmFuZ2UgPSBuZXcgUmFuZ2UocG9zaXRpb24sIGVuZCk7XG4gICAgYnVmZmVyLnNldFRleHRJblJhbmdlKHJhbmdlLCBjaGFuZ2UudGV4dCk7XG5cbiAgICBpZiAoIW1vdmVDdXJzb3IpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnNvciA9IHRleHRFZGl0b3IuZ2V0TGFzdEN1cnNvcigpO1xuXG4gICAgY3Vyc29yICYmIGN1cnNvci5zZXRCdWZmZXJQb3NpdGlvbihwb3NpdGlvbik7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgZGlzcG9zZUFsbCh0aGlzLmRpc3Bvc2FibGVzKTtcblxuICAgIHRoaXMucmVuYW1lVmlldyAmJiB0aGlzLnJlbmFtZVZpZXcuZGVzdHJveSgpO1xuICAgIHRoaXMucmVuYW1lVmlldyA9IG51bGw7XG5cbiAgICB0aGlzLnJlbmFtZVBhbmVsICYmIHRoaXMucmVuYW1lUGFuZWwuZGVzdHJveSgpO1xuICAgIHRoaXMucmVuYW1lUGFuZWwgPSBudWxsO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IG5ldyBSZW5hbWUoKTtcbiJdfQ==