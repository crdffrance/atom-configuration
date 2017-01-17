var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var ReferenceView = (function (_TernView) {
  _inherits(ReferenceView, _TernView);

  function ReferenceView() {
    _classCallCheck(this, ReferenceView);

    _get(Object.getPrototypeOf(ReferenceView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ReferenceView, [{
    key: 'createdCallback',
    value: function createdCallback() {

      var container = document.createElement('div');

      this.content = document.createElement('div');
      this.closeButton = document.createElement('button');

      this.classList.add('atom-ternjs-reference');
      this.closeButton.classList.add('btn', 'atom-ternjs-reference-close');
      this.closeButton.innerHTML = 'Close';

      container.appendChild(this.closeButton);
      container.appendChild(this.content);

      this.closeButton.addEventListener('click', function (e) {
        return _atomTernjsEvents2['default'].emit('reference-hide');
      });

      this.appendChild(container);
    }
  }, {
    key: 'clickHandle',
    value: function clickHandle(i) {

      this.getModel().goToReference(i);
    }
  }, {
    key: 'buildItems',
    value: function buildItems(data) {

      var headline = document.createElement('h2');
      var list = document.createElement('ul');
      var i = 0;

      this.content.innerHTML = '';
      headline.innerHTML = data.name + ' (' + data.type + ')';
      this.content.appendChild(headline);

      for (var item of data.refs) {

        var li = document.createElement('li');
        var lineText = (0, _atomTernjsHelper.replaceTags)(item.lineText);
        lineText = lineText.replace(data.name, '<strong>' + data.name + '</strong>');

        li.innerHTML = '\n        <h3>\n          <span>\n            <span class="darken">\n              (' + (item.position.row + 1) + ':' + item.position.column + '):\n            </span>\n            <span> ' + lineText + '</span>\n          </span>\n          <span class="darken"> (' + item.file + ')</span>\n          <div class="clear"></div>\n        </h3>\n      ';

        li.addEventListener('click', this.clickHandle.bind(this, i), false);
        list.appendChild(li);

        i++;
      }

      this.content.appendChild(list);
    }
  }]);

  return ReferenceView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-reference', {

  prototype: ReferenceView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlZmVyZW5jZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Z0NBRTBCLHNCQUFzQjs7Z0NBQzVCLHNCQUFzQjs7Ozs4QkFDckIsb0JBQW9COzs7O0FBSnpDLFdBQVcsQ0FBQzs7SUFNTixhQUFhO1lBQWIsYUFBYTs7V0FBYixhQUFhOzBCQUFiLGFBQWE7OytCQUFiLGFBQWE7OztlQUFiLGFBQWE7O1dBRUYsMkJBQUc7O0FBRWhCLFVBQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7O0FBRWhELFVBQUksQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QyxVQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7O0FBRXBELFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7QUFDNUMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3JFLFVBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxHQUFHLE9BQU8sQ0FBQzs7QUFFckMsZUFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDeEMsZUFBUyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRXBDLFVBQUksQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQztlQUFLLDhCQUFRLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQztPQUFBLENBQUMsQ0FBQzs7QUFFbEYsVUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM3Qjs7O1dBRVUscUJBQUMsQ0FBQyxFQUFFOztBQUViLFVBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEM7OztXQUVTLG9CQUFDLElBQUksRUFBRTs7QUFFZixVQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVDLFVBQUksSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDeEMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDOztBQUVWLFVBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQztBQUM1QixjQUFRLENBQUMsU0FBUyxHQUFNLElBQUksQ0FBQyxJQUFJLFVBQUssSUFBSSxDQUFDLElBQUksTUFBRyxDQUFDO0FBQ25ELFVBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVuQyxXQUFLLElBQU0sSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7O0FBRTVCLFlBQUksRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdEMsWUFBSSxRQUFRLEdBQUcsbUNBQVksSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLGdCQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxlQUFhLElBQUksQ0FBQyxJQUFJLGVBQVksQ0FBQzs7QUFFeEUsVUFBRSxDQUFDLFNBQVMsNkZBSUQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFBLFNBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLG9EQUV6QyxRQUFRLHFFQUVNLElBQUksQ0FBQyxJQUFJLHlFQUdyQyxDQUFDOztBQUVGLFVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxDQUFDO0FBQ3BFLFlBQUksQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7O0FBRXJCLFNBQUMsRUFBRSxDQUFDO09BQ0w7O0FBRUQsVUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDaEM7OztTQTlERyxhQUFhOzs7QUFpRW5CLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDLGVBQWUsQ0FBQyx1QkFBdUIsRUFBRTs7QUFFakUsV0FBUyxFQUFFLGFBQWEsQ0FBQyxTQUFTO0NBQ25DLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1yZWZlcmVuY2Utdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQge3JlcGxhY2VUYWdzfSBmcm9tICcuL2F0b20tdGVybmpzLWhlbHBlcic7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQgVGVyblZpZXcgZnJvbSAnLi9hdG9tLXRlcm5qcy12aWV3JztcblxuY2xhc3MgUmVmZXJlbmNlVmlldyBleHRlbmRzIFRlcm5WaWV3IHtcblxuICBjcmVhdGVkQ2FsbGJhY2soKSB7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAgIHRoaXMuY29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHRoaXMuY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcblxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtcmVmZXJlbmNlJyk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdidG4nLCAnYXRvbS10ZXJuanMtcmVmZXJlbmNlLWNsb3NlJyk7XG4gICAgdGhpcy5jbG9zZUJ1dHRvbi5pbm5lckhUTUwgPSAnQ2xvc2UnO1xuXG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuY2xvc2VCdXR0b24pO1xuICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRlbnQpO1xuXG4gICAgdGhpcy5jbG9zZUJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiBlbWl0dGVyLmVtaXQoJ3JlZmVyZW5jZS1oaWRlJykpO1xuXG4gICAgdGhpcy5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9XG5cbiAgY2xpY2tIYW5kbGUoaSkge1xuXG4gICAgdGhpcy5nZXRNb2RlbCgpLmdvVG9SZWZlcmVuY2UoaSk7XG4gIH1cblxuICBidWlsZEl0ZW1zKGRhdGEpIHtcblxuICAgIGxldCBoZWFkbGluZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgbGV0IGxpc3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICAgIGxldCBpID0gMDtcblxuICAgIHRoaXMuY29udGVudC5pbm5lckhUTUwgPSAnJztcbiAgICBoZWFkbGluZS5pbm5lckhUTUwgPSBgJHtkYXRhLm5hbWV9ICgke2RhdGEudHlwZX0pYDtcbiAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQoaGVhZGxpbmUpO1xuXG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGRhdGEucmVmcykge1xuXG4gICAgICBsZXQgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICAgICAgbGV0IGxpbmVUZXh0ID0gcmVwbGFjZVRhZ3MoaXRlbS5saW5lVGV4dCk7XG4gICAgICBsaW5lVGV4dCA9IGxpbmVUZXh0LnJlcGxhY2UoZGF0YS5uYW1lLCBgPHN0cm9uZz4ke2RhdGEubmFtZX08L3N0cm9uZz5gKTtcblxuICAgICAgbGkuaW5uZXJIVE1MID0gYFxuICAgICAgICA8aDM+XG4gICAgICAgICAgPHNwYW4+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImRhcmtlblwiPlxuICAgICAgICAgICAgICAoJHtpdGVtLnBvc2l0aW9uLnJvdyArIDF9OiR7aXRlbS5wb3NpdGlvbi5jb2x1bW59KTpcbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuPiAke2xpbmVUZXh0fTwvc3Bhbj5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJkYXJrZW5cIj4gKCR7aXRlbS5maWxlfSk8L3NwYW4+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNsZWFyXCI+PC9kaXY+XG4gICAgICAgIDwvaDM+XG4gICAgICBgO1xuXG4gICAgICBsaS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xpY2tIYW5kbGUuYmluZCh0aGlzLCBpKSwgZmFsc2UpO1xuICAgICAgbGlzdC5hcHBlbmRDaGlsZChsaSk7XG5cbiAgICAgIGkrKztcbiAgICB9XG5cbiAgICB0aGlzLmNvbnRlbnQuYXBwZW5kQ2hpbGQobGlzdCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2F0b20tdGVybmpzLXJlZmVyZW5jZScsIHtcblxuICBwcm90b3R5cGU6IFJlZmVyZW5jZVZpZXcucHJvdG90eXBlXG59KTtcbiJdfQ==