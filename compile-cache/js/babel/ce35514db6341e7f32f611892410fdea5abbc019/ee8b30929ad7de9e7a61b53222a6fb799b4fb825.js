Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

'use babel';

var AtomTernjs = (function () {
  function AtomTernjs() {
    _classCallCheck(this, AtomTernjs);

    this.config = _config2['default'];
  }

  _createClass(AtomTernjs, [{
    key: 'activate',
    value: function activate() {

      _atomTernjsManager2['default'].init();
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {

      _atomTernjsManager2['default'].destroy();
    }
  }, {
    key: 'provide',
    value: function provide() {

      return _atomTernjsProvider2['default'];
    }
  }]);

  return AtomTernjs;
})();

exports['default'] = new AtomTernjs();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7c0JBRXlCLFVBQVU7Ozs7a0NBQ2Qsd0JBQXdCOzs7O2lDQUN6Qix1QkFBdUI7Ozs7QUFKM0MsV0FBVyxDQUFDOztJQU1OLFVBQVU7QUFFSCxXQUZQLFVBQVUsR0FFQTswQkFGVixVQUFVOztBQUlaLFFBQUksQ0FBQyxNQUFNLHNCQUFlLENBQUM7R0FDNUI7O2VBTEcsVUFBVTs7V0FPTixvQkFBRzs7QUFFVCxxQ0FBUSxJQUFJLEVBQUUsQ0FBQztLQUNoQjs7O1dBRVMsc0JBQUc7O0FBRVgscUNBQVEsT0FBTyxFQUFFLENBQUM7S0FDbkI7OztXQUVNLG1CQUFHOztBQUVSLDZDQUFnQjtLQUNqQjs7O1NBcEJHLFVBQVU7OztxQkF1QkQsSUFBSSxVQUFVLEVBQUUiLCJmaWxlIjoiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IGRlZmF1bENvbmZpZyBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgcHJvdmlkZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1wcm92aWRlcic7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuXG5jbGFzcyBBdG9tVGVybmpzIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuY29uZmlnID0gZGVmYXVsQ29uZmlnO1xuICB9XG5cbiAgYWN0aXZhdGUoKSB7XG5cbiAgICBtYW5hZ2VyLmluaXQoKTtcbiAgfVxuXG4gIGRlYWN0aXZhdGUoKSB7XG5cbiAgICBtYW5hZ2VyLmRlc3Ryb3koKTtcbiAgfVxuXG4gIHByb3ZpZGUoKSB7XG5cbiAgICByZXR1cm4gcHJvdmlkZXI7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEF0b21UZXJuanMoKTtcbiJdfQ==