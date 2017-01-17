var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

'use babel';

var TypeView = (function (_TernView) {
  _inherits(TypeView, _TernView);

  function TypeView() {
    _classCallCheck(this, TypeView);

    _get(Object.getPrototypeOf(TypeView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TypeView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.addEventListener('click', function () {

        _this.getModel().destroyOverlay();
      }, false);

      this.container = document.createElement('div');
      this.appendChild(this.container);
    }
  }, {
    key: 'setData',
    value: function setData(data) {

      if (_atomTernjsPackageConfig2['default'].options.inlineFnCompletionDocumentation) {

        this.container.innerHTML = data.doc ? data.type + '<br /><br />' + data.doc : '' + data.type;

        return;
      }

      this.container.innerHTML = data.type;
    }
  }]);

  return TypeView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-type', {

  prototype: TypeView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXR5cGUtdmlldy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzhCQUVxQixvQkFBb0I7Ozs7dUNBQ2YsOEJBQThCOzs7O0FBSHhELFdBQVcsQ0FBQzs7SUFLTixRQUFRO1lBQVIsUUFBUTs7V0FBUixRQUFROzBCQUFSLFFBQVE7OytCQUFSLFFBQVE7OztlQUFSLFFBQVE7O1dBRUcsMkJBQUc7OztBQUVoQixVQUFJLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFlBQU07O0FBRW5DLGNBQUssUUFBUSxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUM7T0FFbEMsRUFBRSxLQUFLLENBQUMsQ0FBQzs7QUFFVixVQUFJLENBQUMsU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDL0MsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7S0FDbEM7OztXQUVNLGlCQUFDLElBQUksRUFBRTs7QUFFWixVQUFJLHFDQUFjLE9BQU8sQ0FBQywrQkFBK0IsRUFBRTs7QUFFekQsWUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEdBQUcsR0FBTSxJQUFJLENBQUMsSUFBSSxvQkFBZSxJQUFJLENBQUMsR0FBRyxRQUFRLElBQUksQ0FBQyxJQUFJLEFBQUUsQ0FBQzs7QUFFN0YsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDdEM7OztTQXhCRyxRQUFROzs7QUEyQmQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGtCQUFrQixFQUFFOztBQUU1RCxXQUFTLEVBQUUsUUFBUSxDQUFDLFNBQVM7Q0FDOUIsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXR5cGUtdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgVGVyblZpZXcgZnJvbSAnLi9hdG9tLXRlcm5qcy12aWV3JztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuXG5jbGFzcyBUeXBlVmlldyBleHRlbmRzIFRlcm5WaWV3IHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG5cbiAgICB0aGlzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xuXG4gICAgICB0aGlzLmdldE1vZGVsKCkuZGVzdHJveU92ZXJsYXkoKTtcblxuICAgIH0sIGZhbHNlKTtcblxuICAgIHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gIH1cblxuICBzZXREYXRhKGRhdGEpIHtcblxuICAgIGlmIChwYWNrYWdlQ29uZmlnLm9wdGlvbnMuaW5saW5lRm5Db21wbGV0aW9uRG9jdW1lbnRhdGlvbikge1xuXG4gICAgICB0aGlzLmNvbnRhaW5lci5pbm5lckhUTUwgPSBkYXRhLmRvYyA/IGAke2RhdGEudHlwZX08YnIgLz48YnIgLz4ke2RhdGEuZG9jfWAgOiBgJHtkYXRhLnR5cGV9YDtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9IGRhdGEudHlwZTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50LnJlZ2lzdGVyRWxlbWVudCgnYXRvbS10ZXJuanMtdHlwZScsIHtcblxuICBwcm90b3R5cGU6IFR5cGVWaWV3LnByb3RvdHlwZVxufSk7XG4iXX0=