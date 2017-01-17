var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var RenameView = (function (_TernView) {
  _inherits(RenameView, _TernView);

  function RenameView() {
    _classCallCheck(this, RenameView);

    _get(Object.getPrototypeOf(RenameView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(RenameView, [{
    key: 'createdCallback',
    value: function createdCallback() {
      var _this = this;

      this.classList.add('atom-ternjs-rename');

      var container = document.createElement('div');
      var wrapper = document.createElement('div');

      var title = document.createElement('h1');
      title.innerHTML = 'Rename';

      var sub = document.createElement('h2');
      sub.innerHTML = 'Rename a variable in a scope-aware way. (experimental)';

      var buttonClose = document.createElement('button');
      buttonClose.innerHTML = 'Close';
      buttonClose.id = 'close';
      buttonClose.classList.add('btn');
      buttonClose.classList.add('atom-ternjs-rename-close');

      buttonClose.addEventListener('click', function (e) {

        _this.model.hide();
      });

      this.nameEditor = document.createElement('atom-text-editor');
      this.nameEditor.setAttribute('mini', true);
      this.nameEditor.addEventListener('core:confirm', this.rename.bind(this));

      var buttonRename = document.createElement('button');
      buttonRename.innerHTML = 'Rename';
      buttonRename.id = 'close';
      buttonRename.classList.add('btn');
      buttonRename.classList.add('mt');
      buttonRename.addEventListener('click', this.rename.bind(this));

      wrapper.appendChild(title);
      wrapper.appendChild(sub);
      wrapper.appendChild(this.nameEditor);
      wrapper.appendChild(buttonClose);
      wrapper.appendChild(buttonRename);
      container.appendChild(wrapper);

      this.appendChild(container);
    }
  }, {
    key: 'rename',
    value: function rename() {

      var text = this.nameEditor.getModel().getBuffer().getText();

      if (!text) {

        return;
      }

      this.model.updateAllAndRename(text);
    }
  }]);

  return RenameView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-rename', {

  prototype: RenameView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlbmFtZS12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OEJBRXFCLG9CQUFvQjs7OztBQUZ6QyxXQUFXLENBQUM7O0lBSU4sVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUVDLDJCQUFHOzs7QUFFaEIsVUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQzs7QUFFekMsVUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNoRCxVQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUU5QyxVQUFJLEtBQUssR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3pDLFdBQUssQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDOztBQUUzQixVQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ3ZDLFNBQUcsQ0FBQyxTQUFTLEdBQUcsd0RBQXdELENBQUM7O0FBRXpFLFVBQUksV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDbkQsaUJBQVcsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0FBQ2hDLGlCQUFXLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQztBQUN6QixpQkFBVyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDakMsaUJBQVcsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRXRELGlCQUFXLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxFQUFLOztBQUUzQyxjQUFLLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztPQUNuQixDQUFDLENBQUM7O0FBRUgsVUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDN0QsVUFBSSxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNDLFVBQUksQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRXpFLFVBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEQsa0JBQVksQ0FBQyxTQUFTLEdBQUcsUUFBUSxDQUFDO0FBQ2xDLGtCQUFZLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQztBQUMxQixrQkFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDbEMsa0JBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQ2pDLGtCQUFZLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7O0FBRS9ELGFBQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDM0IsYUFBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN6QixhQUFPLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNyQyxhQUFPLENBQUMsV0FBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2pDLGFBQU8sQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDbEMsZUFBUyxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQzs7QUFFL0IsVUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztLQUM3Qjs7O1dBRUssa0JBQUc7O0FBRVAsVUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzs7QUFFOUQsVUFBSSxDQUFDLElBQUksRUFBRTs7QUFFVCxlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNyQzs7O1NBekRHLFVBQVU7OztBQTREaEIsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLG9CQUFvQixFQUFFOztBQUU5RCxXQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVM7Q0FDaEMsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXJlbmFtZS12aWV3LmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmltcG9ydCBUZXJuVmlldyBmcm9tICcuL2F0b20tdGVybmpzLXZpZXcnO1xuXG5jbGFzcyBSZW5hbWVWaWV3IGV4dGVuZHMgVGVyblZpZXcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcblxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtcmVuYW1lJyk7XG5cbiAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBjb25zdCB3cmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgICBsZXQgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdoMScpO1xuICAgIHRpdGxlLmlubmVySFRNTCA9ICdSZW5hbWUnO1xuXG4gICAgbGV0IHN1YiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgc3ViLmlubmVySFRNTCA9ICdSZW5hbWUgYSB2YXJpYWJsZSBpbiBhIHNjb3BlLWF3YXJlIHdheS4gKGV4cGVyaW1lbnRhbCknO1xuXG4gICAgbGV0IGJ1dHRvbkNsb3NlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uQ2xvc2UuaW5uZXJIVE1MID0gJ0Nsb3NlJztcbiAgICBidXR0b25DbG9zZS5pZCA9ICdjbG9zZSc7XG4gICAgYnV0dG9uQ2xvc2UuY2xhc3NMaXN0LmFkZCgnYnRuJyk7XG4gICAgYnV0dG9uQ2xvc2UuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtcmVuYW1lLWNsb3NlJyk7XG5cbiAgICBidXR0b25DbG9zZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMubW9kZWwuaGlkZSgpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5uYW1lRWRpdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXRvbS10ZXh0LWVkaXRvcicpO1xuICAgIHRoaXMubmFtZUVkaXRvci5zZXRBdHRyaWJ1dGUoJ21pbmknLCB0cnVlKTtcbiAgICB0aGlzLm5hbWVFZGl0b3IuYWRkRXZlbnRMaXN0ZW5lcignY29yZTpjb25maXJtJywgdGhpcy5yZW5hbWUuYmluZCh0aGlzKSk7XG5cbiAgICBsZXQgYnV0dG9uUmVuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgYnV0dG9uUmVuYW1lLmlubmVySFRNTCA9ICdSZW5hbWUnO1xuICAgIGJ1dHRvblJlbmFtZS5pZCA9ICdjbG9zZSc7XG4gICAgYnV0dG9uUmVuYW1lLmNsYXNzTGlzdC5hZGQoJ2J0bicpO1xuICAgIGJ1dHRvblJlbmFtZS5jbGFzc0xpc3QuYWRkKCdtdCcpO1xuICAgIGJ1dHRvblJlbmFtZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMucmVuYW1lLmJpbmQodGhpcykpO1xuXG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZCh0aXRsZSk7XG4gICAgd3JhcHBlci5hcHBlbmRDaGlsZChzdWIpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5uYW1lRWRpdG9yKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGJ1dHRvbkNsb3NlKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGJ1dHRvblJlbmFtZSk7XG4gICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuXG4gICAgdGhpcy5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuICB9XG5cbiAgcmVuYW1lKCkge1xuXG4gICAgY29uc3QgdGV4dCA9IHRoaXMubmFtZUVkaXRvci5nZXRNb2RlbCgpLmdldEJ1ZmZlcigpLmdldFRleHQoKTtcblxuICAgIGlmICghdGV4dCkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5tb2RlbC51cGRhdGVBbGxBbmRSZW5hbWUodGV4dCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudC5yZWdpc3RlckVsZW1lbnQoJ2F0b20tdGVybmpzLXJlbmFtZScsIHtcblxuICBwcm90b3R5cGU6IFJlbmFtZVZpZXcucHJvdG90eXBlXG59KTtcbiJdfQ==