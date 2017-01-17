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

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atom = require('atom');

var _atomTernjsHelper = require('./atom-ternjs-helper');

'use babel';

var TypeView = require('./atom-ternjs-type-view');
var TOLERANCE = 20;

var Type = (function () {
  function Type() {
    _classCallCheck(this, Type);

    this.view = undefined;
    this.overlayDecoration = undefined;
    this.marker = undefined;

    this.view = new TypeView();
    this.view.initialize(this);

    atom.views.getView(atom.workspace).appendChild(this.view);

    this.destroyOverlayHandler = this.destroyOverlay.bind(this);

    _atomTernjsEvents2['default'].on('type-destroy-overlay', this.destroyOverlayHandler);
  }

  _createClass(Type, [{
    key: 'setPosition',
    value: function setPosition() {

      if (!this.marker) {

        var editor = atom.workspace.getActiveTextEditor();

        if (!editor) {

          return;
        }

        this.marker = editor.getLastCursor && editor.getLastCursor().getMarker();

        if (!this.marker) {

          return;
        }

        this.overlayDecoration = editor.decorateMarker(this.marker, {

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-type',
          position: 'tale',
          invalidate: 'touch'
        });
      } else {

        this.marker.setProperties({

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-type',
          position: 'tale',
          invalidate: 'touch'
        });
      }
    }
  }, {
    key: 'queryType',
    value: function queryType(editor, cursor) {
      var _this = this;

      if (!_atomTernjsPackageConfig2['default'].options.inlineFnCompletion || !cursor || cursor.destroyed || !_atomTernjsManager2['default'].client) {

        return;
      }

      var scopeDescriptor = cursor.getScopeDescriptor();

      if (scopeDescriptor.scopes.join().match(/comment/)) {

        this.destroyOverlay();

        return;
      }

      var rowStart = 0;
      var rangeBefore = false;
      var tmp = false;
      var may = 0;
      var may2 = 0;
      var skipCounter = 0;
      var skipCounter2 = 0;
      var paramPosition = 0;
      var position = cursor.getBufferPosition();
      var buffer = editor.getBuffer();

      if (position.row - TOLERANCE < 0) {

        rowStart = 0;
      } else {

        rowStart = position.row - TOLERANCE;
      }

      buffer.backwardsScanInRange(/\]|\[|\(|\)|\,|\{|\}/g, new _atom.Range([rowStart, 0], [position.row, position.column]), function (obj) {

        // return early if we are inside a string
        if (editor.scopeDescriptorForBufferPosition(obj.range.start).scopes.join().match(/string/)) {

          return;
        }

        if (obj.matchText === '}') {

          may++;
          return;
        }

        if (obj.matchText === ']') {

          if (!tmp) {

            skipCounter2++;
          }

          may2++;
          return;
        }

        if (obj.matchText === '{') {

          if (!may) {

            rangeBefore = false;
            obj.stop();

            return;
          }

          may--;
          return;
        }

        if (obj.matchText === '[') {

          if (skipCounter2) {

            skipCounter2--;
          }

          if (!may2) {

            rangeBefore = false;
            obj.stop();
            return;
          }

          may2--;
          return;
        }

        if (obj.matchText === ')' && !tmp) {

          skipCounter++;
          return;
        }

        if (obj.matchText === ',' && !skipCounter && !skipCounter2 && !may && !may2) {

          paramPosition++;
          return;
        }

        if (obj.matchText === ',') {

          return;
        }

        if (obj.matchText === '(' && skipCounter) {

          skipCounter--;
          return;
        }

        if (skipCounter || skipCounter2) {

          return;
        }

        if (obj.matchText === '(' && !tmp) {

          rangeBefore = obj.range;
          obj.stop();

          return;
        }

        tmp = obj.matchText;
      });

      if (!rangeBefore) {

        this.destroyOverlay();
        return;
      }

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {

        _atomTernjsManager2['default'].client.type(editor, rangeBefore.start).then(function (data) {

          if (!data || data.type === '?' || !data.exprName) {

            _this.destroyOverlay();

            return;
          }

          var type = (0, _atomTernjsHelper.prepareType)(data);
          var params = (0, _atomTernjsHelper.extractParams)(type);
          (0, _atomTernjsHelper.formatType)(data);

          if (params && params[paramPosition]) {

            var offsetFix = paramPosition > 0 ? ' ' : '';
            data.type = data.type.replace(params[paramPosition], offsetFix + '<span class="storage type">' + params[paramPosition] + '</span>');
          }

          if (data.doc && _atomTernjsPackageConfig2['default'].options.inlineFnCompletionDocumentation) {

            data.doc = data.doc && data.doc.replace(/(?:\r\n|\r|\n)/g, '<br />');
            data.doc = (0, _atomTernjsHelper.prepareInlineDocs)(data.doc);
          }

          _this.view.setData(data);

          _this.setPosition();
        });
      });
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      _atomTernjsEvents2['default'].off('destroy-type-overlay', this.destroyOverlayHandler);

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = null;
      }
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      this.marker = undefined;

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
        this.overlayDecoration = undefined;
      }
    }
  }]);

  return Type;
})();

exports['default'] = new Type();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXR5cGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FLb0IsdUJBQXVCOzs7O3VDQUNqQiw4QkFBOEI7Ozs7Z0NBQ3BDLHNCQUFzQjs7OztvQkFDdEIsTUFBTTs7Z0NBTW5CLHNCQUFzQjs7QUFkN0IsV0FBVyxDQUFDOztBQUVaLElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQ3BELElBQU0sU0FBUyxHQUFHLEVBQUUsQ0FBQzs7SUFhZixJQUFJO0FBRUcsV0FGUCxJQUFJLEdBRU07MEJBRlYsSUFBSTs7QUFJTixRQUFJLENBQUMsSUFBSSxHQUFHLFNBQVMsQ0FBQztBQUN0QixRQUFJLENBQUMsaUJBQWlCLEdBQUcsU0FBUyxDQUFDO0FBQ25DLFFBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDOztBQUV4QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDM0IsUUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTNCLFFBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUUxRCxRQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTVELGtDQUFRLEVBQUUsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztHQUNoRTs7ZUFoQkcsSUFBSTs7V0FrQkcsdUJBQUc7O0FBRVosVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7O0FBRWhCLFlBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsQ0FBQzs7QUFFcEQsWUFBSSxDQUFDLE1BQU0sRUFBRTs7QUFFWCxpQkFBTztTQUNSOztBQUVELFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLGFBQWEsSUFBSSxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRXpFLFlBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUVoQixpQkFBTztTQUNSOztBQUVELFlBQUksQ0FBQyxpQkFBaUIsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7O0FBRTFELGNBQUksRUFBRSxTQUFTO0FBQ2YsY0FBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ2YsbUJBQU8sa0JBQWtCO0FBQ3pCLGtCQUFRLEVBQUUsTUFBTTtBQUNoQixvQkFBVSxFQUFFLE9BQU87U0FDcEIsQ0FBQyxDQUFDO09BRUosTUFBTTs7QUFFTCxZQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQzs7QUFFeEIsY0FBSSxFQUFFLFNBQVM7QUFDZixjQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7QUFDZixtQkFBTyxrQkFBa0I7QUFDekIsa0JBQVEsRUFBRSxNQUFNO0FBQ2hCLG9CQUFVLEVBQUUsT0FBTztTQUNwQixDQUFDLENBQUM7T0FDSjtLQUNGOzs7V0FFUSxtQkFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFOzs7QUFFeEIsVUFDRSxDQUFDLHFDQUFjLE9BQU8sQ0FBQyxrQkFBa0IsSUFDekMsQ0FBQyxNQUFNLElBQ1AsTUFBTSxDQUFDLFNBQVMsSUFDaEIsQ0FBQywrQkFBUSxNQUFNLEVBQ2Y7O0FBRUEsZUFBTztPQUNSOztBQUVELFVBQU0sZUFBZSxHQUFHLE1BQU0sQ0FBQyxrQkFBa0IsRUFBRSxDQUFDOztBQUVwRCxVQUFJLGVBQWUsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxFQUFFOztBQUVsRCxZQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7O0FBRXRCLGVBQU87T0FDUjs7QUFFRCxVQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDakIsVUFBSSxXQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLFVBQUksR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNoQixVQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7QUFDWixVQUFJLElBQUksR0FBRyxDQUFDLENBQUM7QUFDYixVQUFJLFdBQVcsR0FBRyxDQUFDLENBQUM7QUFDcEIsVUFBSSxZQUFZLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLFVBQUksYUFBYSxHQUFHLENBQUMsQ0FBQztBQUN0QixVQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztBQUM1QyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7O0FBRWxDLFVBQUksUUFBUSxDQUFDLEdBQUcsR0FBRyxTQUFTLEdBQUcsQ0FBQyxFQUFFOztBQUVoQyxnQkFBUSxHQUFHLENBQUMsQ0FBQztPQUVkLE1BQU07O0FBRUwsZ0JBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQztPQUNyQzs7QUFFRCxZQUFNLENBQUMsb0JBQW9CLENBQUMsdUJBQXVCLEVBQUUsZ0JBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQUMsR0FBRyxFQUFLOzs7QUFHdkgsWUFBSSxNQUFNLENBQUMsZ0NBQWdDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFOztBQUUxRixpQkFBTztTQUNSOztBQUVELFlBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxHQUFHLEVBQUU7O0FBRXpCLGFBQUcsRUFBRSxDQUFDO0FBQ04saUJBQU87U0FDUjs7QUFFRCxZQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssR0FBRyxFQUFFOztBQUV6QixjQUFJLENBQUMsR0FBRyxFQUFFOztBQUVSLHdCQUFZLEVBQUUsQ0FBQztXQUNoQjs7QUFFRCxjQUFJLEVBQUUsQ0FBQztBQUNQLGlCQUFPO1NBQ1I7O0FBRUQsWUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLEdBQUcsRUFBRTs7QUFFekIsY0FBSSxDQUFDLEdBQUcsRUFBRTs7QUFFUix1QkFBVyxHQUFHLEtBQUssQ0FBQztBQUNwQixlQUFHLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRVgsbUJBQU87V0FDUjs7QUFFRCxhQUFHLEVBQUUsQ0FBQztBQUNOLGlCQUFPO1NBQ1I7O0FBRUQsWUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLEdBQUcsRUFBRTs7QUFFekIsY0FBSSxZQUFZLEVBQUU7O0FBRWhCLHdCQUFZLEVBQUUsQ0FBQztXQUNoQjs7QUFFRCxjQUFJLENBQUMsSUFBSSxFQUFFOztBQUVULHVCQUFXLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLGVBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNYLG1CQUFPO1dBQ1I7O0FBRUQsY0FBSSxFQUFFLENBQUM7QUFDUCxpQkFBTztTQUNSOztBQUVELFlBQUksR0FBRyxDQUFDLFNBQVMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUU7O0FBRWpDLHFCQUFXLEVBQUUsQ0FBQztBQUNkLGlCQUFPO1NBQ1I7O0FBRUQsWUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLFlBQVksSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksRUFBRTs7QUFFM0UsdUJBQWEsRUFBRSxDQUFDO0FBQ2hCLGlCQUFPO1NBQ1I7O0FBRUQsWUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLEdBQUcsRUFBRTs7QUFFekIsaUJBQU87U0FDUjs7QUFFRCxZQUFJLEdBQUcsQ0FBQyxTQUFTLEtBQUssR0FBRyxJQUFJLFdBQVcsRUFBRTs7QUFFeEMscUJBQVcsRUFBRSxDQUFDO0FBQ2QsaUJBQU87U0FDUjs7QUFFRCxZQUFJLFdBQVcsSUFBSSxZQUFZLEVBQUU7O0FBRS9CLGlCQUFPO1NBQ1I7O0FBRUQsWUFBSSxHQUFHLENBQUMsU0FBUyxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTs7QUFFakMscUJBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDO0FBQ3hCLGFBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFWCxpQkFBTztTQUNSOztBQUVELFdBQUcsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDO09BQ3JCLENBQUMsQ0FBQzs7QUFFSCxVQUFJLENBQUMsV0FBVyxFQUFFOztBQUVoQixZQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdEIsZUFBTztPQUNSOztBQUVELHFDQUFRLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLOztBQUUzQyx1Q0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUMsSUFBSSxFQUFLOztBQUU1RCxjQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTs7QUFFaEQsa0JBQUssY0FBYyxFQUFFLENBQUM7O0FBRXRCLG1CQUFPO1dBQ1I7O0FBRUQsY0FBTSxJQUFJLEdBQUcsbUNBQVksSUFBSSxDQUFDLENBQUM7QUFDL0IsY0FBTSxNQUFNLEdBQUcscUNBQWMsSUFBSSxDQUFDLENBQUM7QUFDbkMsNENBQVcsSUFBSSxDQUFDLENBQUM7O0FBRWpCLGNBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRTs7QUFFbkMsZ0JBQU0sU0FBUyxHQUFHLGFBQWEsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUMvQyxnQkFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUssU0FBUyxtQ0FBOEIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFVLENBQUM7V0FDaEk7O0FBRUQsY0FDRSxJQUFJLENBQUMsR0FBRyxJQUNSLHFDQUFjLE9BQU8sQ0FBQywrQkFBK0IsRUFDckQ7O0FBRUEsZ0JBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNyRSxnQkFBSSxDQUFDLEdBQUcsR0FBRyx5Q0FBa0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1dBQ3hDOztBQUVELGdCQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRXhCLGdCQUFLLFdBQVcsRUFBRSxDQUFDO1NBQ3BCLENBQUMsQ0FBQztPQUNKLENBQUMsQ0FBQztLQUNKOzs7V0FFTSxtQkFBRzs7QUFFUixvQ0FBUSxHQUFHLENBQUMsc0JBQXNCLEVBQUUsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUM7O0FBRWhFLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIsVUFBSSxJQUFJLENBQUMsSUFBSSxFQUFFOztBQUViLFlBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEIsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7T0FDbEI7S0FDRjs7O1dBRWEsMEJBQUc7O0FBRWYsVUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7O0FBRXhCLFVBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFOztBQUUxQixZQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDakMsWUFBSSxDQUFDLGlCQUFpQixHQUFHLFNBQVMsQ0FBQztPQUNwQztLQUNGOzs7U0FwUUcsSUFBSTs7O3FCQXVRSyxJQUFJLElBQUksRUFBRSIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy10eXBlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IFR5cGVWaWV3ID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy10eXBlLXZpZXcnKTtcbmNvbnN0IFRPTEVSQU5DRSA9IDIwO1xuXG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IHBhY2thZ2VDb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1wYWNrYWdlLWNvbmZpZyc7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQge1JhbmdlfSBmcm9tICdhdG9tJztcbmltcG9ydCB7XG4gIHByZXBhcmVUeXBlLFxuICBwcmVwYXJlSW5saW5lRG9jcyxcbiAgZXh0cmFjdFBhcmFtcyxcbiAgZm9ybWF0VHlwZVxufSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5cbmNsYXNzIFR5cGUge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy52aWV3ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5tYXJrZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnZpZXcgPSBuZXcgVHlwZVZpZXcoKTtcbiAgICB0aGlzLnZpZXcuaW5pdGlhbGl6ZSh0aGlzKTtcblxuICAgIGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSkuYXBwZW5kQ2hpbGQodGhpcy52aWV3KTtcblxuICAgIHRoaXMuZGVzdHJveU92ZXJsYXlIYW5kbGVyID0gdGhpcy5kZXN0cm95T3ZlcmxheS5iaW5kKHRoaXMpO1xuXG4gICAgZW1pdHRlci5vbigndHlwZS1kZXN0cm95LW92ZXJsYXknLCB0aGlzLmRlc3Ryb3lPdmVybGF5SGFuZGxlcik7XG4gIH1cblxuICBzZXRQb3NpdGlvbigpIHtcblxuICAgIGlmICghdGhpcy5tYXJrZXIpIHtcblxuICAgICAgY29uc3QgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpO1xuXG4gICAgICBpZiAoIWVkaXRvcikge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tYXJrZXIgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvciAmJiBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpLmdldE1hcmtlcigpO1xuXG4gICAgICBpZiAoIXRoaXMubWFya2VyKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKHRoaXMubWFya2VyLCB7XG5cbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtdHlwZScsXG4gICAgICAgIHBvc2l0aW9uOiAndGFsZScsXG4gICAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhpcy5tYXJrZXIuc2V0UHJvcGVydGllcyh7XG5cbiAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICBpdGVtOiB0aGlzLnZpZXcsXG4gICAgICAgIGNsYXNzOiAnYXRvbS10ZXJuanMtdHlwZScsXG4gICAgICAgIHBvc2l0aW9uOiAndGFsZScsXG4gICAgICAgIGludmFsaWRhdGU6ICd0b3VjaCdcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHF1ZXJ5VHlwZShlZGl0b3IsIGN1cnNvcikge1xuXG4gICAgaWYgKFxuICAgICAgIXBhY2thZ2VDb25maWcub3B0aW9ucy5pbmxpbmVGbkNvbXBsZXRpb24gfHxcbiAgICAgICFjdXJzb3IgfHxcbiAgICAgIGN1cnNvci5kZXN0cm95ZWQgfHxcbiAgICAgICFtYW5hZ2VyLmNsaWVudFxuICAgICkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2NvcGVEZXNjcmlwdG9yID0gY3Vyc29yLmdldFNjb3BlRGVzY3JpcHRvcigpO1xuXG4gICAgaWYgKHNjb3BlRGVzY3JpcHRvci5zY29wZXMuam9pbigpLm1hdGNoKC9jb21tZW50LykpIHtcblxuICAgICAgdGhpcy5kZXN0cm95T3ZlcmxheSgpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IHJvd1N0YXJ0ID0gMDtcbiAgICBsZXQgcmFuZ2VCZWZvcmUgPSBmYWxzZTtcbiAgICBsZXQgdG1wID0gZmFsc2U7XG4gICAgbGV0IG1heSA9IDA7XG4gICAgbGV0IG1heTIgPSAwO1xuICAgIGxldCBza2lwQ291bnRlciA9IDA7XG4gICAgbGV0IHNraXBDb3VudGVyMiA9IDA7XG4gICAgbGV0IHBhcmFtUG9zaXRpb24gPSAwO1xuICAgIGNvbnN0IHBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCk7XG4gICAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpO1xuXG4gICAgaWYgKHBvc2l0aW9uLnJvdyAtIFRPTEVSQU5DRSA8IDApIHtcblxuICAgICAgcm93U3RhcnQgPSAwO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgcm93U3RhcnQgPSBwb3NpdGlvbi5yb3cgLSBUT0xFUkFOQ0U7XG4gICAgfVxuXG4gICAgYnVmZmVyLmJhY2t3YXJkc1NjYW5JblJhbmdlKC9cXF18XFxbfFxcKHxcXCl8XFwsfFxce3xcXH0vZywgbmV3IFJhbmdlKFtyb3dTdGFydCwgMF0sIFtwb3NpdGlvbi5yb3csIHBvc2l0aW9uLmNvbHVtbl0pLCAob2JqKSA9PiB7XG5cbiAgICAgIC8vIHJldHVybiBlYXJseSBpZiB3ZSBhcmUgaW5zaWRlIGEgc3RyaW5nXG4gICAgICBpZiAoZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKG9iai5yYW5nZS5zdGFydCkuc2NvcGVzLmpvaW4oKS5tYXRjaCgvc3RyaW5nLykpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnfScpIHtcblxuICAgICAgICBtYXkrKztcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob2JqLm1hdGNoVGV4dCA9PT0gJ10nKSB7XG5cbiAgICAgICAgaWYgKCF0bXApIHtcblxuICAgICAgICAgIHNraXBDb3VudGVyMisrO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF5MisrO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAneycpIHtcblxuICAgICAgICBpZiAoIW1heSkge1xuXG4gICAgICAgICAgcmFuZ2VCZWZvcmUgPSBmYWxzZTtcbiAgICAgICAgICBvYmouc3RvcCgpO1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF5LS07XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICdbJykge1xuXG4gICAgICAgIGlmIChza2lwQ291bnRlcjIpIHtcblxuICAgICAgICAgIHNraXBDb3VudGVyMi0tO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFtYXkyKSB7XG5cbiAgICAgICAgICByYW5nZUJlZm9yZSA9IGZhbHNlO1xuICAgICAgICAgIG9iai5zdG9wKCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbWF5Mi0tO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnKScgJiYgIXRtcCkge1xuXG4gICAgICAgIHNraXBDb3VudGVyKys7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9iai5tYXRjaFRleHQgPT09ICcsJyAmJiAhc2tpcENvdW50ZXIgJiYgIXNraXBDb3VudGVyMiAmJiAhbWF5ICYmICFtYXkyKSB7XG5cbiAgICAgICAgcGFyYW1Qb3NpdGlvbisrO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnLCcpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnKCcgJiYgc2tpcENvdW50ZXIpIHtcblxuICAgICAgICBza2lwQ291bnRlci0tO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChza2lwQ291bnRlciB8fCBza2lwQ291bnRlcjIpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvYmoubWF0Y2hUZXh0ID09PSAnKCcgJiYgIXRtcCkge1xuXG4gICAgICAgIHJhbmdlQmVmb3JlID0gb2JqLnJhbmdlO1xuICAgICAgICBvYmouc3RvcCgpO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdG1wID0gb2JqLm1hdGNoVGV4dDtcbiAgICB9KTtcblxuICAgIGlmICghcmFuZ2VCZWZvcmUpIHtcblxuICAgICAgdGhpcy5kZXN0cm95T3ZlcmxheSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIG1hbmFnZXIuY2xpZW50LnVwZGF0ZShlZGl0b3IpLnRoZW4oKGRhdGEpID0+IHtcblxuICAgICAgbWFuYWdlci5jbGllbnQudHlwZShlZGl0b3IsIHJhbmdlQmVmb3JlLnN0YXJ0KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgaWYgKCFkYXRhIHx8IGRhdGEudHlwZSA9PT0gJz8nIHx8ICFkYXRhLmV4cHJOYW1lKSB7XG5cbiAgICAgICAgICB0aGlzLmRlc3Ryb3lPdmVybGF5KCk7XG5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0eXBlID0gcHJlcGFyZVR5cGUoZGF0YSk7XG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IGV4dHJhY3RQYXJhbXModHlwZSk7XG4gICAgICAgIGZvcm1hdFR5cGUoZGF0YSk7XG5cbiAgICAgICAgaWYgKHBhcmFtcyAmJiBwYXJhbXNbcGFyYW1Qb3NpdGlvbl0pIHtcblxuICAgICAgICAgIGNvbnN0IG9mZnNldEZpeCA9IHBhcmFtUG9zaXRpb24gPiAwID8gJyAnIDogJyc7XG4gICAgICAgICAgZGF0YS50eXBlID0gZGF0YS50eXBlLnJlcGxhY2UocGFyYW1zW3BhcmFtUG9zaXRpb25dLCBgJHtvZmZzZXRGaXh9PHNwYW4gY2xhc3M9XCJzdG9yYWdlIHR5cGVcIj4ke3BhcmFtc1twYXJhbVBvc2l0aW9uXX08L3NwYW4+YCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoXG4gICAgICAgICAgZGF0YS5kb2MgJiZcbiAgICAgICAgICBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uRG9jdW1lbnRhdGlvblxuICAgICAgICApIHtcblxuICAgICAgICAgIGRhdGEuZG9jID0gZGF0YS5kb2MgJiYgZGF0YS5kb2MucmVwbGFjZSgvKD86XFxyXFxufFxccnxcXG4pL2csICc8YnIgLz4nKTtcbiAgICAgICAgICBkYXRhLmRvYyA9IHByZXBhcmVJbmxpbmVEb2NzKGRhdGEuZG9jKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudmlldy5zZXREYXRhKGRhdGEpO1xuXG4gICAgICAgIHRoaXMuc2V0UG9zaXRpb24oKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIGVtaXR0ZXIub2ZmKCdkZXN0cm95LXR5cGUtb3ZlcmxheScsIHRoaXMuZGVzdHJveU92ZXJsYXlIYW5kbGVyKTtcblxuICAgIHRoaXMuZGVzdHJveU92ZXJsYXkoKTtcblxuICAgIGlmICh0aGlzLnZpZXcpIHtcblxuICAgICAgdGhpcy52aWV3LmRlc3Ryb3koKTtcbiAgICAgIHRoaXMudmlldyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveU92ZXJsYXkoKSB7XG5cbiAgICB0aGlzLm1hcmtlciA9IHVuZGVmaW5lZDtcblxuICAgIGlmICh0aGlzLm92ZXJsYXlEZWNvcmF0aW9uKSB7XG5cbiAgICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24uZGVzdHJveSgpO1xuICAgICAgdGhpcy5vdmVybGF5RGVjb3JhdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IFR5cGUoKTtcbiJdfQ==