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

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsHelper2 = require('././atom-ternjs-helper');

'use babel';

var DocumentationView = require('./atom-ternjs-documentation-view');

var Documentation = (function () {
  function Documentation() {
    _classCallCheck(this, Documentation);

    this.disposables = [];

    this.view = new DocumentationView();
    this.view.initialize(this);

    atom.views.getView(atom.workspace).appendChild(this.view);

    this.destroyDocumenationHandler = this.destroyOverlay.bind(this);
    _atomTernjsEvents2['default'].on('documentation-destroy-overlay', this.destroyDocumenationHandler);

    this.registerCommands();
  }

  _createClass(Documentation, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:documentation', this.request.bind(this)));
    }
  }, {
    key: 'request',
    value: function request() {
      var _this = this;

      var editor = atom.workspace.getActiveTextEditor();

      if (!editor) {

        return;
      }

      var cursor = editor.getLastCursor();
      var position = cursor.getBufferPosition();

      _atomTernjsManager2['default'].client.update(editor).then(function (data) {

        _atomTernjsManager2['default'].client.documentation(atom.project.relativizePath(editor.getURI())[1], {

          line: position.row,
          ch: position.column

        }).then(function (data) {

          if (!data) {

            return;
          }

          _this.view.setData({

            doc: (0, _atomTernjsHelper2.replaceTags)(data.doc),
            origin: data.origin,
            type: (0, _atomTernjsHelper2.formatType)(data),
            url: data.url || ''
          });

          _this.show();
        });
      });
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.marker) {

        var editor = atom.workspace.getActiveTextEditor();
        var cursor = editor.getLastCursor();

        if (!editor || !cursor) {

          return;
        }

        this.marker = cursor.getMarker();

        if (!this.marker) {

          return;
        }

        this.overlayDecoration = editor.decorateMarker(this.marker, {

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      } else {

        this.marker.setProperties({

          type: 'overlay',
          item: this.view,
          'class': 'atom-ternjs-documentation',
          position: 'tale',
          invalidate: 'touch'
        });
      }
    }
  }, {
    key: 'destroyOverlay',
    value: function destroyOverlay() {

      if (this.overlayDecoration) {

        this.overlayDecoration.destroy();
      }

      this.overlayDecoration = null;
      this.marker = null;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      this.destroyOverlay();

      if (this.view) {

        this.view.destroy();
        this.view = undefined;
      }
    }
  }]);

  return Documentation;
})();

exports['default'] = new Documentation();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztpQ0FJb0IsdUJBQXVCOzs7O2dDQUN2QixzQkFBc0I7Ozs7Z0NBQ2pCLHNCQUFzQjs7aUNBSXhDLHdCQUF3Qjs7QUFWL0IsV0FBVyxDQUFDOztBQUVaLElBQU0saUJBQWlCLEdBQUcsT0FBTyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7O0lBVWhFLGFBQWE7QUFFTixXQUZQLGFBQWEsR0FFSDswQkFGVixhQUFhOztBQUlmLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDOztBQUV0QixRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksaUJBQWlCLEVBQUUsQ0FBQztBQUNwQyxRQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFM0IsUUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRTFELFFBQUksQ0FBQywwQkFBMEIsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUNqRSxrQ0FBUSxFQUFFLENBQUMsK0JBQStCLEVBQUUsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRTdFLFFBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0dBQ3pCOztlQWZHLGFBQWE7O1dBaUJELDRCQUFHOztBQUVqQixVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSwyQkFBMkIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDcEg7OztXQUVNLG1C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QUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDcEIsWUFBSSxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7T0FDdkI7S0FDRjs7O1NBNUhHLGFBQWE7OztxQkErSEosSUFBSSxhQUFhLEVBQUUiLCJmaWxlIjoiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBEb2N1bWVudGF0aW9uVmlldyA9IHJlcXVpcmUoJy4vYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbi12aWV3Jyk7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQge2Rpc3Bvc2VBbGx9IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCB7XG4gIHJlcGxhY2VUYWdzLFxuICBmb3JtYXRUeXBlXG59IGZyb20gJy4vLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuXG5jbGFzcyBEb2N1bWVudGF0aW9uIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgIHRoaXMudmlldyA9IG5ldyBEb2N1bWVudGF0aW9uVmlldygpO1xuICAgIHRoaXMudmlldy5pbml0aWFsaXplKHRoaXMpO1xuXG4gICAgYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKS5hcHBlbmRDaGlsZCh0aGlzLnZpZXcpO1xuXG4gICAgdGhpcy5kZXN0cm95RG9jdW1lbmF0aW9uSGFuZGxlciA9IHRoaXMuZGVzdHJveU92ZXJsYXkuYmluZCh0aGlzKTtcbiAgICBlbWl0dGVyLm9uKCdkb2N1bWVudGF0aW9uLWRlc3Ryb3ktb3ZlcmxheScsIHRoaXMuZGVzdHJveURvY3VtZW5hdGlvbkhhbmRsZXIpO1xuXG4gICAgdGhpcy5yZWdpc3RlckNvbW1hbmRzKCk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOmRvY3VtZW50YXRpb24nLCB0aGlzLnJlcXVlc3QuYmluZCh0aGlzKSkpO1xuICB9XG5cbiAgcmVxdWVzdCgpIHtcblxuICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG5cbiAgICBpZiAoIWVkaXRvcikge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgbGV0IGN1cnNvciA9IGVkaXRvci5nZXRMYXN0Q3Vyc29yKCk7XG4gICAgbGV0IHBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKCk7XG5cbiAgICBtYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgIG1hbmFnZXIuY2xpZW50LmRvY3VtZW50YXRpb24oYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGVkaXRvci5nZXRVUkkoKSlbMV0sIHtcblxuICAgICAgICBsaW5lOiBwb3NpdGlvbi5yb3csXG4gICAgICAgIGNoOiBwb3NpdGlvbi5jb2x1bW5cblxuICAgICAgfSkudGhlbigoZGF0YSkgPT4ge1xuXG4gICAgICAgIGlmICghZGF0YSkge1xuXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy52aWV3LnNldERhdGEoe1xuXG4gICAgICAgICAgZG9jOiByZXBsYWNlVGFncyhkYXRhLmRvYyksXG4gICAgICAgICAgb3JpZ2luOiBkYXRhLm9yaWdpbixcbiAgICAgICAgICB0eXBlOiBmb3JtYXRUeXBlKGRhdGEpLFxuICAgICAgICAgIHVybDogZGF0YS51cmwgfHwgJydcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHNob3coKSB7XG5cbiAgICBpZiAoIXRoaXMubWFya2VyKSB7XG5cbiAgICAgIGxldCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCk7XG4gICAgICBsZXQgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcblxuICAgICAgaWYgKCFlZGl0b3IgfHwgIWN1cnNvcikge1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgdGhpcy5tYXJrZXIgPSBjdXJzb3IuZ2V0TWFya2VyKCk7XG5cbiAgICAgIGlmICghdGhpcy5tYXJrZXIpIHtcblxuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIHRoaXMub3ZlcmxheURlY29yYXRpb24gPSBlZGl0b3IuZGVjb3JhdGVNYXJrZXIodGhpcy5tYXJrZXIsIHtcblxuICAgICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICAgIGl0ZW06IHRoaXMudmlldyxcbiAgICAgICAgY2xhc3M6ICdhdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uJyxcbiAgICAgICAgcG9zaXRpb246ICd0YWxlJyxcbiAgICAgICAgaW52YWxpZGF0ZTogJ3RvdWNoJ1xuICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICB0aGlzLm1hcmtlci5zZXRQcm9wZXJ0aWVzKHtcblxuICAgICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICAgIGl0ZW06IHRoaXMudmlldyxcbiAgICAgICAgY2xhc3M6ICdhdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uJyxcbiAgICAgICAgcG9zaXRpb246ICd0YWxlJyxcbiAgICAgICAgaW52YWxpZGF0ZTogJ3RvdWNoJ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveU92ZXJsYXkoKSB7XG5cbiAgICBpZiAodGhpcy5vdmVybGF5RGVjb3JhdGlvbikge1xuXG4gICAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uLmRlc3Ryb3koKTtcbiAgICB9XG5cbiAgICB0aGlzLm92ZXJsYXlEZWNvcmF0aW9uID0gbnVsbDtcbiAgICB0aGlzLm1hcmtlciA9IG51bGw7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgZGlzcG9zZUFsbCh0aGlzLmRpc3Bvc2FibGVzKTtcblxuICAgIHRoaXMuZGVzdHJveU92ZXJsYXkoKTtcblxuICAgIGlmICh0aGlzLnZpZXcpIHtcblxuICAgICAgdGhpcy52aWV3LmRlc3Ryb3koKTtcbiAgICAgIHRoaXMudmlldyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IERvY3VtZW50YXRpb24oKTtcbiJdfQ==