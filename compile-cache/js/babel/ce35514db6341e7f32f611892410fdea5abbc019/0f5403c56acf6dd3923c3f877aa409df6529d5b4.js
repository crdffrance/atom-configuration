'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TernView = (function (_HTMLElement) {
  _inherits(TernView, _HTMLElement);

  function TernView() {
    _classCallCheck(this, TernView);

    _get(Object.getPrototypeOf(TernView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(TernView, [{
    key: 'initialize',
    value: function initialize(model) {

      this.setModel(model);

      return this;
    }
  }, {
    key: 'getModel',
    value: function getModel() {

      return this.model;
    }
  }, {
    key: 'setModel',
    value: function setModel(model) {

      this.model = model;
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      this.remove();
    }
  }]);

  return TernView;
})(HTMLElement);

exports['default'] = TernView;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXZpZXcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7Ozs7Ozs7Ozs7OztJQUVTLFFBQVE7WUFBUixRQUFROztXQUFSLFFBQVE7MEJBQVIsUUFBUTs7K0JBQVIsUUFBUTs7O2VBQVIsUUFBUTs7V0FFakIsb0JBQUMsS0FBSyxFQUFFOztBQUVoQixVQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVyQixhQUFPLElBQUksQ0FBQztLQUNiOzs7V0FFTyxvQkFBRzs7QUFFVCxhQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDbkI7OztXQUVPLGtCQUFDLEtBQUssRUFBRTs7QUFFZCxVQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztLQUNwQjs7O1dBRU0sbUJBQUc7O0FBRVIsVUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ2Y7OztTQXRCa0IsUUFBUTtHQUFTLFdBQVc7O3FCQUE1QixRQUFRIiwiZmlsZSI6Ii9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXZpZXcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVyblZpZXcgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cbiAgaW5pdGlhbGl6ZShtb2RlbCkge1xuXG4gICAgdGhpcy5zZXRNb2RlbChtb2RlbCk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGdldE1vZGVsKCkge1xuXG4gICAgcmV0dXJuIHRoaXMubW9kZWw7XG4gIH1cblxuICBzZXRNb2RlbChtb2RlbCkge1xuXG4gICAgdGhpcy5tb2RlbCA9IG1vZGVsO1xuICB9XG5cbiAgZGVzdHJveSgpIHtcblxuICAgIHRoaXMucmVtb3ZlKCk7XG4gIH1cbn1cbiJdfQ==