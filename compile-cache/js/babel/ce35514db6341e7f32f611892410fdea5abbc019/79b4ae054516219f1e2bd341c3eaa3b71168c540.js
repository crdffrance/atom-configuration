Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _underscorePlus = require('underscore-plus');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var ReferenceView = require('./atom-ternjs-reference-view');

var Reference = (function () {
  function Reference() {
    _classCallCheck(this, Reference);

    this.disposables = [];
    this.references = [];

    this.referenceView = new ReferenceView();
    this.referenceView.initialize(this);

    this.referencePanel = atom.workspace.addBottomPanel({

      item: this.referenceView,
      priority: 0
    });

    this.referencePanel.hide();

    atom.views.getView(this.referencePanel).classList.add('atom-ternjs-reference-panel', 'panel-bottom');

    this.hideHandler = this.hide.bind(this);
    _atomTernjsEvents2['default'].on('reference-hide', this.hideHandler);

    this.registerCommands();
  }

  _createClass(Reference, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:references', this.findReference.bind(this)));
    }
  }, {
    key: 'goToReference',
    value: function goToReference(idx) {

      var ref = this.references.refs[idx];

      (0, _atomTernjsHelper.openFileAndGoTo)(ref.start, ref.file);
    }
  }, {
    key: 'findReference',
    value: function findReference() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();
      var cursor = editor.getLastCursor();

      if (!_atomTernjsManager2['default'].client || !editor || !cursor) {

        return;
      }

      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {
        _atomTernjsManager2['default'].client.refs(atom.project.relativizePath(editor.getURI())[1], { line: position.row, ch: position.column }).then(function (data) {

          if (!data) {

            atom.notifications.addInfo('No references found.', { dismissable: false });

            return;
          }

          _this.references = data;

          for (var reference of data.refs) {

            reference.file = reference.file.replace(/^.\//, '');
            reference.file = _path2['default'].resolve(atom.project.relativizePath(_atomTernjsManager2['default'].server.projectDir)[0], reference.file);
          }

          data.refs = (0, _underscorePlus.uniq)(data.refs, function (item) {

            return JSON.stringify(item);
          });

          data = _this.gatherMeta(data);
          _this.referenceView.buildItems(data);
          _this.referencePanel.show();
        });
      });
    }
  }, {
    key: 'gatherMeta',
    value: function gatherMeta(data) {

      for (var item of data.refs) {

        var content = _fs2['default'].readFileSync(item.file, 'utf8');
        var buffer = new _atom.TextBuffer({ text: content });

        item.position = buffer.positionForCharacterIndex(item.start);
        item.lineText = buffer.lineForRow(item.position.row);

        buffer.destroy();
      }

      return data;
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.referencePanel || !this.referencePanel.visible) {

        return;
      }

      this.referencePanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'show',
    value: function show() {

      this.referencePanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.referenceView && this.referenceView.destroy();
      this.referenceView = null;

      this.referencePanel && this.referencePanel.destroy();
      this.referencePanel = null;
    }
  }]);

  return Reference;
})();

exports['default'] = new Reference();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlZmVyZW5jZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUlvQix1QkFBdUI7Ozs7Z0NBQ3ZCLHNCQUFzQjs7OztrQkFDM0IsSUFBSTs7Ozs4QkFDQSxpQkFBaUI7O29CQUNuQixNQUFNOzs7O29CQUNFLE1BQU07O2dDQUl4QixzQkFBc0I7O0FBYjdCLFdBQVcsQ0FBQzs7QUFFWixJQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsOEJBQThCLENBQUMsQ0FBQzs7SUFheEQsU0FBUztBQUVGLFdBRlAsU0FBUyxHQUVDOzBCQUZWLFNBQVM7O0FBSVgsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDdEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxhQUFhLEVBQUUsQ0FBQztBQUN6QyxRQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFcEMsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQzs7QUFFbEQsVUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhO0FBQ3hCLGNBQVEsRUFBRSxDQUFDO0tBQ1osQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRTNCLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDZCQUE2QixFQUFFLGNBQWMsQ0FBQyxDQUFDOztBQUVyRyxRQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3hDLGtDQUFRLEVBQUUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENB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LFlBQU0sTUFBTSxHQUFHLHFCQUFlLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7O0FBRWpELFlBQUksQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLHlCQUF5QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3RCxZQUFJLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7QUFFckQsY0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ2xCOztBQUVELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVHLGdCQUFHOztBQUVMLFVBQ0UsQ0FBQyxJQUFJLENBQUMsY0FBYyxJQUNwQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxFQUM1Qjs7QUFFQSxlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFM0IsMENBQWEsQ0FBQztLQUNmOzs7V0FFRyxnQkFBRzs7QUFFTCxVQUFJLENBQUMsY0FBYyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQzVCOzs7V0FFTSxtQkFBRzs7QUFFUixVQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbkQsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7O0FBRTFCLFVBQUksQ0FBQyxjQUFjLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNyRCxVQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztLQUM1Qjs7O1NBL0hHLFNBQVM7OztxQkFrSUEsSUFBSSxTQUFTLEVBQUUiLCJmaWxlIjoiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtcmVmZXJlbmNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IFJlZmVyZW5jZVZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXJlZmVyZW5jZS12aWV3Jyk7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHt1bmlxfSBmcm9tICd1bmRlcnNjb3JlLXBsdXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQge1RleHRCdWZmZXJ9IGZyb20gJ2F0b20nO1xuaW1wb3J0IHtcbiAgb3BlbkZpbGVBbmRHb1RvLFxuICBmb2N1c0VkaXRvclxufSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5cbmNsYXNzIFJlZmVyZW5jZSB7XG5cbiAgY29uc3RydWN0b3IoKSB7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzID0gW107XG4gICAgdGhpcy5yZWZlcmVuY2VzID0gW107XG5cbiAgICB0aGlzLnJlZmVyZW5jZVZpZXcgPSBuZXcgUmVmZXJlbmNlVmlldygpO1xuICAgIHRoaXMucmVmZXJlbmNlVmlldy5pbml0aWFsaXplKHRoaXMpO1xuXG4gICAgdGhpcy5yZWZlcmVuY2VQYW5lbCA9IGF0b20ud29ya3NwYWNlLmFkZEJvdHRvbVBhbmVsKHtcblxuICAgICAgaXRlbTogdGhpcy5yZWZlcmVuY2VWaWV3LFxuICAgICAgcHJpb3JpdHk6IDBcbiAgICB9KTtcblxuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwuaGlkZSgpO1xuXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KHRoaXMucmVmZXJlbmNlUGFuZWwpLmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLXJlZmVyZW5jZS1wYW5lbCcsICdwYW5lbC1ib3R0b20nKTtcblxuICAgIHRoaXMuaGlkZUhhbmRsZXIgPSB0aGlzLmhpZGUuYmluZCh0aGlzKTtcbiAgICBlbWl0dGVyLm9uKCdyZWZlcmVuY2UtaGlkZScsIHRoaXMuaGlkZUhhbmRsZXIpO1xuXG4gICAgdGhpcy5yZWdpc3RlckNvbW1hbmRzKCk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOnJlZmVyZW5jZXMnLCB0aGlzLmZpbmRSZWZlcmVuY2UuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgZ29Ub1JlZmVyZW5jZShpZHgpIHtcblxuICAgIGNvbnN0IHJlZiA9IHRoaXMucmVmZXJlbmNlcy5yZWZzW2lkeF07XG5cbiAgICBvcGVuRmlsZUFuZEdvVG8ocmVmLnN0YXJ0LCByZWYuZmlsZSk7XG4gIH1cblxuICBmaW5kUmVmZXJlbmNlKCkge1xuXG4gICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuICAgIGNvbnN0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG5cbiAgICBpZiAoXG4gICAgICAhbWFuYWdlci5jbGllbnQgfHxcbiAgICAgICFlZGl0b3IgfHxcbiAgICAgICFjdXJzb3JcbiAgICApIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCk7XG5cbiAgICBtYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKS50aGVuKChkYXRhKSA9PiB7XG4gICAgICBtYW5hZ2VyLmNsaWVudC5yZWZzKGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChlZGl0b3IuZ2V0VVJJKCkpWzFdLCB7bGluZTogcG9zaXRpb24ucm93LCBjaDogcG9zaXRpb24uY29sdW1ufSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ05vIHJlZmVyZW5jZXMgZm91bmQuJywgeyBkaXNtaXNzYWJsZTogZmFsc2UgfSk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlZmVyZW5jZXMgPSBkYXRhO1xuXG4gICAgICAgIGZvciAobGV0IHJlZmVyZW5jZSBvZiBkYXRhLnJlZnMpIHtcblxuICAgICAgICAgIHJlZmVyZW5jZS5maWxlID0gcmVmZXJlbmNlLmZpbGUucmVwbGFjZSgvXi5cXC8vLCAnJyk7XG4gICAgICAgICAgcmVmZXJlbmNlLmZpbGUgPSBwYXRoLnJlc29sdmUoYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKG1hbmFnZXIuc2VydmVyLnByb2plY3REaXIpWzBdLCByZWZlcmVuY2UuZmlsZSk7XG4gICAgICAgIH1cblxuICAgICAgICBkYXRhLnJlZnMgPSB1bmlxKGRhdGEucmVmcywgKGl0ZW0pID0+IHtcblxuICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShpdGVtKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGF0YSA9IHRoaXMuZ2F0aGVyTWV0YShkYXRhKTtcbiAgICAgICAgdGhpcy5yZWZlcmVuY2VWaWV3LmJ1aWxkSXRlbXMoZGF0YSk7XG4gICAgICAgIHRoaXMucmVmZXJlbmNlUGFuZWwuc2hvdygpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBnYXRoZXJNZXRhKGRhdGEpIHtcblxuICAgIGZvciAobGV0IGl0ZW0gb2YgZGF0YS5yZWZzKSB7XG5cbiAgICAgIGNvbnN0IGNvbnRlbnQgPSBmcy5yZWFkRmlsZVN5bmMoaXRlbS5maWxlLCAndXRmOCcpO1xuICAgICAgY29uc3QgYnVmZmVyID0gbmV3IFRleHRCdWZmZXIoeyB0ZXh0OiBjb250ZW50IH0pO1xuXG4gICAgICBpdGVtLnBvc2l0aW9uID0gYnVmZmVyLnBvc2l0aW9uRm9yQ2hhcmFjdGVySW5kZXgoaXRlbS5zdGFydCk7XG4gICAgICBpdGVtLmxpbmVUZXh0ID0gYnVmZmVyLmxpbmVGb3JSb3coaXRlbS5wb3NpdGlvbi5yb3cpO1xuXG4gICAgICBidWZmZXIuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRhO1xuICB9XG5cbiAgaGlkZSgpIHtcblxuICAgIGlmIChcbiAgICAgICF0aGlzLnJlZmVyZW5jZVBhbmVsIHx8XG4gICAgICAhdGhpcy5yZWZlcmVuY2VQYW5lbC52aXNpYmxlXG4gICAgKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnJlZmVyZW5jZVBhbmVsLmhpZGUoKTtcblxuICAgIGZvY3VzRWRpdG9yKCk7XG4gIH1cblxuICBzaG93KCkge1xuXG4gICAgdGhpcy5yZWZlcmVuY2VQYW5lbC5zaG93KCk7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgdGhpcy5yZWZlcmVuY2VWaWV3ICYmIHRoaXMucmVmZXJlbmNlVmlldy5kZXN0cm95KCk7XG4gICAgdGhpcy5yZWZlcmVuY2VWaWV3ID0gbnVsbDtcblxuICAgIHRoaXMucmVmZXJlbmNlUGFuZWwgJiYgdGhpcy5yZWZlcmVuY2VQYW5lbC5kZXN0cm95KCk7XG4gICAgdGhpcy5yZWZlcmVuY2VQYW5lbCA9IG51bGw7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFJlZmVyZW5jZSgpO1xuIl19