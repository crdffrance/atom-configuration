Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var Client = (function () {
  function Client(projectDir) {
    _classCallCheck(this, Client);

    this.projectDir = projectDir;
  }

  _createClass(Client, [{
    key: 'completions',
    value: function completions(file, end) {

      return this.post('query', {

        query: {

          type: 'completions',
          file: file,
          end: end,
          types: true,
          includeKeywords: true,
          sort: _atomTernjsPackageConfig2['default'].options.sort,
          guess: _atomTernjsPackageConfig2['default'].options.guess,
          docs: _atomTernjsPackageConfig2['default'].options.documentation,
          urls: _atomTernjsPackageConfig2['default'].options.urls,
          origins: _atomTernjsPackageConfig2['default'].options.origins,
          lineCharPositions: true,
          caseInsensitive: _atomTernjsPackageConfig2['default'].options.caseInsensitive
        }
      });
    }
  }, {
    key: 'documentation',
    value: function documentation(file, end) {

      return this.post('query', {

        query: {

          type: 'documentation',
          file: file,
          end: end
        }
      });
    }
  }, {
    key: 'refs',
    value: function refs(file, end) {

      return this.post('query', {

        query: {

          type: 'refs',
          file: file,
          end: end
        }
      });
    }
  }, {
    key: 'updateFull',
    value: function updateFull(editor, editorMeta) {

      if (editorMeta) {

        editorMeta.diffs = [];
      }

      return this.post('query', { files: [{

          type: 'full',
          name: atom.project.relativizePath(editor.getURI())[1],
          text: editor.getText()
        }] });
    }
  }, {
    key: 'updatePart',
    value: function updatePart(editor, editorMeta, start, text) {

      if (editorMeta) {

        editorMeta.diffs = [];
      }

      return this.post('query', [{

        type: 'full',
        name: atom.project.relativizePath(editor.getURI())[1],
        offset: {

          line: start,
          ch: 0
        },
        text: editor.getText()
      }]);
    }
  }, {
    key: 'update',
    value: function update(editor) {
      var _this = this;

      var editorMeta = _atomTernjsManager2['default'].getEditor(editor);
      var file = atom.project.relativizePath(editor.getURI())[1].replace(/\\/g, '/');

      // check if this file is excluded via dontLoad
      if (_atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.dontLoad(file)) {

        return Promise.resolve({});
      }

      // check if the file is registered, else return
      return this.files().then(function (data) {

        if (data.files) {

          for (var i = 0; i < data.files.length; i++) {

            data.files[i] = data.files[i].replace(/\\/g, '/');
          }
        }

        var registered = data.files && data.files.indexOf(file) > -1;

        if (editorMeta && editorMeta.diffs.length === 0 && registered) {

          return Promise.resolve({});
        }

        if (registered) {

          // const buffer = editor.getBuffer();
          // if buffer.getMaxCharacterIndex() > 5000
          //   start = 0
          //   end = 0
          //   text = ''
          //   for diff in editorMeta.diffs
          //     start = Math.max(0, diff.oldRange.start.row - 50)
          //     end = Math.min(buffer.getLineCount(), diff.oldRange.end.row + 5)
          //     text = buffer.getTextInRange([[start, 0], [end, buffer.lineLengthForRow(end)]])
          //   promise = this.updatePart(editor, editorMeta, start, text)
          // else
          return _this.updateFull(editor, editorMeta);
        } else {

          return Promise.resolve({});
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'rename',
    value: function rename(file, end, newName) {

      return this.post('query', {

        query: {

          type: 'rename',
          file: file,
          end: end,
          newName: newName
        }
      });
    }
  }, {
    key: 'type',
    value: function type(editor, position) {

      var file = atom.project.relativizePath(editor.getURI())[1];
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'type',
          file: file,
          end: end,
          preferFunction: true
        }
      });
    }
  }, {
    key: 'definition',
    value: function definition() {

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();
      var file = atom.project.relativizePath(editor.getURI())[1];
      var end = {

        line: position.row,
        ch: position.column
      };

      return this.post('query', {

        query: {

          type: 'definition',
          file: file,
          end: end
        }

      }).then(function (data) {

        if (data && data.start) {

          (0, _atomTernjsHelper.setMarkerCheckpoint)();
          (0, _atomTernjsHelper.openFileAndGoTo)(data.start, data.file);
        }
      })['catch'](function (err) {

        console.error(err);
      });
    }
  }, {
    key: 'files',
    value: function files() {

      return this.post('query', {

        query: {

          type: 'files'
        }

      }).then(function (data) {

        return data;
      });
    }
  }, {
    key: 'post',
    value: function post(type, data) {

      var promise = _atomTernjsManager2['default'].server.request(type, data);

      return promise;
    }
  }]);

  return Client;
})();

exports['default'] = Client;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNsaWVudC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUVvQix1QkFBdUI7Ozs7dUNBQ2pCLDhCQUE4Qjs7OztnQ0FJakQsc0JBQXNCOztBQVA3QixXQUFXLENBQUM7O0lBU1MsTUFBTTtBQUVkLFdBRlEsTUFBTSxDQUViLFVBQVUsRUFBRTswQkFGTCxNQUFNOztBQUl2QixRQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztHQUM5Qjs7ZUFMa0IsTUFBTTs7V0FPZCxxQkFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFOztBQUVyQixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFOztBQUV4QixhQUFLLEVBQUU7O0FBRUwsY0FBSSxFQUFFLGFBQWE7QUFDbkIsY0FBSSxFQUFFLElBQUk7QUFDVixhQUFHLEVBQUUsR0FBRztBQUNSLGVBQUssRUFBRSxJQUFJO0FBQ1gseUJBQWUsRUFBRSxJQUFJO0FBQ3JCLGNBQUksRUFBRSxxQ0FBYyxPQUFPLENBQUMsSUFBSTtBQUNoQyxlQUFLLEVBQUUscUNBQWMsT0FBTyxDQUFDLEtBQUs7QUFDbEMsY0FBSSxFQUFFLHFDQUFjLE9BQU8sQ0FBQyxhQUFhO0FBQ3pDLGNBQUksRUFBRSxxQ0FBYyxPQUFPLENBQUMsSUFBSTtBQUNoQyxpQkFBTyxFQUFFLHFDQUFjLE9BQU8sQ0FBQyxPQUFPO0FBQ3RDLDJCQUFpQixFQUFFLElBQUk7QUFDdkIseUJBQWUsRUFBRSxxQ0FBYyxPQUFPLENBQUMsZUFBZTtTQUN2RDtPQUNGLENBQUMsQ0FBQztLQUNKOzs7V0FFWSx1QkFBQyxJQUFJLEVBQUUsR0FBRyxFQUFFOztBQUV2QixhQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFOztBQUV4QixhQUFLLEVBQUU7O0FBRUwsY0FBSSxFQUFFLGVBQWU7QUFDckIsY0FBSSxFQUFFLElBQUk7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RUFBRSxJQUFJLEVBQUU7O0FBRWYsVUFBTSxPQUFPLEdBQUcsK0JBQVEsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRW5ELGFBQU8sT0FBTyxDQUFDO0tBQ2hCOzs7U0FoUGtCLE1BQU07OztxQkFBTixNQUFNIiwiZmlsZSI6Ii9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNsaWVudC5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHBhY2thZ2VDb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZyc7XG5pbXBvcnQge1xuICBzZXRNYXJrZXJDaGVja3BvaW50LFxuICBvcGVuRmlsZUFuZEdvVG9cbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDbGllbnQge1xuXG4gIGNvbnN0cnVjdG9yKHByb2plY3REaXIpIHtcblxuICAgIHRoaXMucHJvamVjdERpciA9IHByb2plY3REaXI7XG4gIH1cblxuICBjb21wbGV0aW9ucyhmaWxlLCBlbmQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdjb21wbGV0aW9ucycsXG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGVuZDogZW5kLFxuICAgICAgICB0eXBlczogdHJ1ZSxcbiAgICAgICAgaW5jbHVkZUtleXdvcmRzOiB0cnVlLFxuICAgICAgICBzb3J0OiBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuc29ydCxcbiAgICAgICAgZ3Vlc3M6IHBhY2thZ2VDb25maWcub3B0aW9ucy5ndWVzcyxcbiAgICAgICAgZG9jczogcGFja2FnZUNvbmZpZy5vcHRpb25zLmRvY3VtZW50YXRpb24sXG4gICAgICAgIHVybHM6IHBhY2thZ2VDb25maWcub3B0aW9ucy51cmxzLFxuICAgICAgICBvcmlnaW5zOiBwYWNrYWdlQ29uZmlnLm9wdGlvbnMub3JpZ2lucyxcbiAgICAgICAgbGluZUNoYXJQb3NpdGlvbnM6IHRydWUsXG4gICAgICAgIGNhc2VJbnNlbnNpdGl2ZTogcGFja2FnZUNvbmZpZy5vcHRpb25zLmNhc2VJbnNlbnNpdGl2ZVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZG9jdW1lbnRhdGlvbihmaWxlLCBlbmQpIHtcblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5Jywge1xuXG4gICAgICBxdWVyeToge1xuXG4gICAgICAgIHR5cGU6ICdkb2N1bWVudGF0aW9uJyxcbiAgICAgICAgZmlsZTogZmlsZSxcbiAgICAgICAgZW5kOiBlbmRcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHJlZnMoZmlsZSwgZW5kKSB7XG5cbiAgICByZXR1cm4gdGhpcy5wb3N0KCdxdWVyeScsIHtcblxuICAgICAgcXVlcnk6IHtcblxuICAgICAgICB0eXBlOiAncmVmcycsXG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGVuZDogZW5kXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB1cGRhdGVGdWxsKGVkaXRvciwgZWRpdG9yTWV0YSkge1xuXG4gICAgaWYgKGVkaXRvck1ldGEpIHtcblxuICAgICAgZWRpdG9yTWV0YS5kaWZmcyA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5JywgeyBmaWxlczogW3tcblxuICAgICAgdHlwZTogJ2Z1bGwnLFxuICAgICAgbmFtZTogYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sXG4gICAgICB0ZXh0OiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgfV19KTtcbiAgfVxuXG4gIHVwZGF0ZVBhcnQoZWRpdG9yLCBlZGl0b3JNZXRhLCBzdGFydCwgdGV4dCkge1xuXG4gICAgaWYgKGVkaXRvck1ldGEpIHtcblxuICAgICAgZWRpdG9yTWV0YS5kaWZmcyA9IFtdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnBvc3QoJ3F1ZXJ5JywgW3tcblxuICAgICAgdHlwZTogJ2Z1bGwnLFxuICAgICAgbmFtZTogYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sXG4gICAgICBvZmZzZXQ6IHtcblxuICAgICAgICBsaW5lOiBzdGFydCxcbiAgICAgICAgY2g6IDBcbiAgICAgIH0sXG4gICAgICB0ZXh0OiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgfV0pO1xuICB9XG5cbiAgdXBkYXRlKGVkaXRvcikge1xuXG4gICAgY29uc3QgZWRpdG9yTWV0YSA9IG1hbmFnZXIuZ2V0RWRpdG9yKGVkaXRvcik7XG4gICAgY29uc3QgZmlsZSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcblxuICAgIC8vIGNoZWNrIGlmIHRoaXMgZmlsZSBpcyBleGNsdWRlZCB2aWEgZG9udExvYWRcbiAgICBpZiAoXG4gICAgICBtYW5hZ2VyLnNlcnZlciAmJlxuICAgICAgbWFuYWdlci5zZXJ2ZXIuZG9udExvYWQoZmlsZSlcbiAgICApIHtcblxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh7fSk7XG4gICAgfVxuXG4gICAgLy8gY2hlY2sgaWYgdGhlIGZpbGUgaXMgcmVnaXN0ZXJlZCwgZWxzZSByZXR1cm5cbiAgICByZXR1cm4gdGhpcy5maWxlcygpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgaWYgKGRhdGEuZmlsZXMpIHtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRhdGEuZmlsZXMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgIGRhdGEuZmlsZXNbaV0gPSBkYXRhLmZpbGVzW2ldLnJlcGxhY2UoL1xcXFwvZywgJy8nKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjb25zdCByZWdpc3RlcmVkID0gZGF0YS5maWxlcyAmJiBkYXRhLmZpbGVzLmluZGV4T2YoZmlsZSkgPiAtMTtcblxuICAgICAgaWYgKFxuICAgICAgICBlZGl0b3JNZXRhICYmXG4gICAgICAgIGVkaXRvck1ldGEuZGlmZnMubGVuZ3RoID09PSAwICYmXG4gICAgICAgIHJlZ2lzdGVyZWRcbiAgICAgICkge1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVnaXN0ZXJlZCkge1xuXG4gICAgICAgIC8vIGNvbnN0IGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKTtcbiAgICAgICAgLy8gaWYgYnVmZmVyLmdldE1heENoYXJhY3RlckluZGV4KCkgPiA1MDAwXG4gICAgICAgIC8vICAgc3RhcnQgPSAwXG4gICAgICAgIC8vICAgZW5kID0gMFxuICAgICAgICAvLyAgIHRleHQgPSAnJ1xuICAgICAgICAvLyAgIGZvciBkaWZmIGluIGVkaXRvck1ldGEuZGlmZnNcbiAgICAgICAgLy8gICAgIHN0YXJ0ID0gTWF0aC5tYXgoMCwgZGlmZi5vbGRSYW5nZS5zdGFydC5yb3cgLSA1MClcbiAgICAgICAgLy8gICAgIGVuZCA9IE1hdGgubWluKGJ1ZmZlci5nZXRMaW5lQ291bnQoKSwgZGlmZi5vbGRSYW5nZS5lbmQucm93ICsgNSlcbiAgICAgICAgLy8gICAgIHRleHQgPSBidWZmZXIuZ2V0VGV4dEluUmFuZ2UoW1tzdGFydCwgMF0sIFtlbmQsIGJ1ZmZlci5saW5lTGVuZ3RoRm9yUm93KGVuZCldXSlcbiAgICAgICAgLy8gICBwcm9taXNlID0gdGhpcy51cGRhdGVQYXJ0KGVkaXRvciwgZWRpdG9yTWV0YSwgc3RhcnQsIHRleHQpXG4gICAgICAgIC8vIGVsc2VcbiAgICAgICAgcmV0dXJuIHRoaXMudXBkYXRlRnVsbChlZGl0b3IsIGVkaXRvck1ldGEpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoe30pO1xuICAgICAgfVxuICAgIH0pLmNhdGNoKChlcnIpID0+IHtcblxuICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgIH0pO1xuICB9XG5cbiAgcmVuYW1lKGZpbGUsIGVuZCwgbmV3TmFtZSkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ3JlbmFtZScsXG4gICAgICAgIGZpbGU6IGZpbGUsXG4gICAgICAgIGVuZDogZW5kLFxuICAgICAgICBuZXdOYW1lOiBuZXdOYW1lXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICB0eXBlKGVkaXRvciwgcG9zaXRpb24pIHtcblxuICAgIGNvbnN0IGZpbGUgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXTtcbiAgICBjb25zdCBlbmQgPSB7XG5cbiAgICAgIGxpbmU6IHBvc2l0aW9uLnJvdyxcbiAgICAgIGNoOiBwb3NpdGlvbi5jb2x1bW5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ3R5cGUnLFxuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBlbmQ6IGVuZCxcbiAgICAgICAgcHJlZmVyRnVuY3Rpb246IHRydWVcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGRlZmluaXRpb24oKSB7XG5cbiAgICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcbiAgICBjb25zdCBwb3NpdGlvbiA9IGN1cnNvci5nZXRCdWZmZXJQb3NpdGlvbigpO1xuICAgIGNvbnN0IGZpbGUgPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXTtcbiAgICBjb25zdCBlbmQgPSB7XG5cbiAgICAgIGxpbmU6IHBvc2l0aW9uLnJvdyxcbiAgICAgIGNoOiBwb3NpdGlvbi5jb2x1bW5cbiAgICB9O1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2RlZmluaXRpb24nLFxuICAgICAgICBmaWxlOiBmaWxlLFxuICAgICAgICBlbmQ6IGVuZFxuICAgICAgfVxuXG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICBpZiAoZGF0YSAmJiBkYXRhLnN0YXJ0KSB7XG5cbiAgICAgICAgc2V0TWFya2VyQ2hlY2twb2ludCgpO1xuICAgICAgICBvcGVuRmlsZUFuZEdvVG8oZGF0YS5zdGFydCwgZGF0YS5maWxlKTtcbiAgICAgIH1cbiAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZpbGVzKCkge1xuXG4gICAgcmV0dXJuIHRoaXMucG9zdCgncXVlcnknLCB7XG5cbiAgICAgIHF1ZXJ5OiB7XG5cbiAgICAgICAgdHlwZTogJ2ZpbGVzJ1xuICAgICAgfVxuXG4gICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICByZXR1cm4gZGF0YTtcbiAgICB9KTtcbiAgfVxuXG4gIHBvc3QodHlwZSwgZGF0YSkge1xuXG4gICAgY29uc3QgcHJvbWlzZSA9IG1hbmFnZXIuc2VydmVyLnJlcXVlc3QodHlwZSwgZGF0YSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxufVxuIl19