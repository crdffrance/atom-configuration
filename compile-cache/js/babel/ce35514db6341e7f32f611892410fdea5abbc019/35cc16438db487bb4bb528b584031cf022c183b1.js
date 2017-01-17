var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var DocumentationView = (function (_TernView) {
  _inherits(DocumentationView, _TernView);

  function DocumentationView() {
    _classCallCheck(this, DocumentationView);

    _get(Object.getPrototypeOf(DocumentationView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(DocumentationView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.getModel();
      this.addEventListener('click', function () {

        _this.getModel().destroyOverlay();
      }, false);

      this.container = document.createElement('div');

      this.container.onmousewheel = function (e) {

        e.stopPropagation();
      };

      this.appendChild(this.container);
    }
  }, {
    key: 'setData',
    value: function setData(data) {

      this.container.innerHTML = '\n\n      <h3>' + data.type + '</h3>\n      <p>' + data.doc + '</p>\n      <a href="' + data.url + '">' + data.url + '</p>\n    ';
    }
  }]);

  return DocumentationView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-documentation', {

  prototype: DocumentationView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWRvY3VtZW50YXRpb24tdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzhCQUVxQixvQkFBb0I7Ozs7QUFGekMsV0FBVyxDQUFDOztJQUlOLGlCQUFpQjtZQUFqQixpQkFBaUI7O1dBQWpCLGlCQUFpQjswQkFBakIsaUJBQWlCOzsrQkFBakIsaUJBQWlCOzs7ZUFBakIsaUJBQWlCOztXQUVOLDJCQUFHOzs7QUFFaEIsVUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ2hCLFVBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsWUFBTTs7QUFFbkMsY0FBSyxRQUFRLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUVsQyxFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUVWLFVBQUksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7QUFFL0MsVUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLEdBQUcsVUFBQyxDQUFDLEVBQUs7O0FBRW5DLFNBQUMsQ0FBQyxlQUFlLEVBQUUsQ0FBQztPQUNyQixDQUFDOztBQUVGLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0tBQ2xDOzs7V0FFTSxpQkFBQyxJQUFJLEVBQUU7O0FBRVosVUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLHNCQUVoQixJQUFJLENBQUMsSUFBSSx3QkFDVixJQUFJLENBQUMsR0FBRyw2QkFDRixJQUFJLENBQUMsR0FBRyxVQUFLLElBQUksQ0FBQyxHQUFHLGVBQ2pDLENBQUM7S0FDSDs7O1NBN0JHLGlCQUFpQjs7O0FBZ0N2QixNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQyxlQUFlLENBQUMsMkJBQTJCLEVBQUU7O0FBRXJFLFdBQVMsRUFBRSxpQkFBaUIsQ0FBQyxTQUFTO0NBQ3ZDLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IFRlcm5WaWV3IGZyb20gJy4vYXRvbS10ZXJuanMtdmlldyc7XG5cbmNsYXNzIERvY3VtZW50YXRpb25WaWV3IGV4dGVuZHMgVGVyblZpZXcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcblxuICAgIHRoaXMuZ2V0TW9kZWwoKTtcbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG4gICAgICB0aGlzLmdldE1vZGVsKCkuZGVzdHJveU92ZXJsYXkoKTtcblxuICAgIH0sIGZhbHNlKTtcblxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICB0aGlzLmNvbnRhaW5lci5vbm1vdXNld2hlZWwgPSAoZSkgPT4ge1xuXG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH07XG5cbiAgICB0aGlzLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgfVxuXG4gIHNldERhdGEoZGF0YSkge1xuXG4gICAgdGhpcy5jb250YWluZXIuaW5uZXJIVE1MID0gYFxuXG4gICAgICA8aDM+JHtkYXRhLnR5cGV9PC9oMz5cbiAgICAgIDxwPiR7ZGF0YS5kb2N9PC9wPlxuICAgICAgPGEgaHJlZj1cIiR7ZGF0YS51cmx9XCI+JHtkYXRhLnVybH08L3A+XG4gICAgYDtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbicsIHtcblxuICBwcm90b3R5cGU6IERvY3VtZW50YXRpb25WaWV3LnByb3RvdHlwZVxufSk7XG4iXX0=