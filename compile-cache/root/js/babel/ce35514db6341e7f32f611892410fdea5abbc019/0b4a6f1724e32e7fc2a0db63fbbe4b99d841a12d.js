"use babel";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Api = (function () {
	function Api(pluginName) {
		_classCallCheck(this, Api);

		this.pluginName = pluginName;
	}

	_createClass(Api, [{
		key: "getCurrentFilePath",
		value: function getCurrentFilePath() {
			try {
				var activeItem = atom.workspace.getActivePaneItem();
				return activeItem.buffer.file.path;
			} catch (e) {
				console.log(this.pluginName, e);
				return null;
			}
		}
	}, {
		key: "getCurrentProjectPath",
		value: function getCurrentProjectPath() {
			try {
				var activeItem = atom.workspace.getActivePaneItem();

				var _atom$project$relativizePath = atom.project.relativizePath(activeItem.buffer.file.path);

				var _atom$project$relativizePath2 = _slicedToArray(_atom$project$relativizePath, 2);

				var projectPath = _atom$project$relativizePath2[0];
				var relativePath = _atom$project$relativizePath2[1];

				return projectPath;
			} catch (e) {
				console.log(this.pluginName, e);
				return null;
			}
		}
	}, {
		key: "getPluginPath",
		value: function getPluginPath() {
			return atom.packages.resolvePackagePath(this.pluginName);
		}
	}]);

	return Api;
})();

exports["default"] = Api;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS1mb3JtYXR0ZXItanNiZWF1dGlmeS9saWIvYXBpL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7Ozs7Ozs7O0lBRVMsR0FBRztBQUNaLFVBRFMsR0FBRyxDQUNYLFVBQVUsRUFBRTt3QkFESixHQUFHOztBQUV0QixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztFQUM3Qjs7Y0FIbUIsR0FBRzs7U0FLTCw4QkFBRztBQUNwQixPQUFJO0FBQ0gsUUFBSSxVQUFVLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0FBQ3BELFdBQU8sVUFBVSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQ25DLENBQUMsT0FBTSxDQUFDLEVBQUU7QUFDVixXQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDaEMsV0FBTyxJQUFJLENBQUM7SUFDWjtHQUNEOzs7U0FFb0IsaUNBQUc7QUFDdkIsT0FBSTtBQUNILFFBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsaUJBQWlCLEVBQUUsQ0FBQzs7dUNBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzs7OztRQUFyRixXQUFXO1FBQUUsWUFBWTs7QUFDOUIsV0FBTyxXQUFXLENBQUM7SUFDbkIsQ0FBQyxPQUFNLENBQUMsRUFBRTtBQUNWLFdBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUNoQyxXQUFPLElBQUksQ0FBQztJQUNaO0dBQ0Q7OztTQUVZLHlCQUFHO0FBQ2YsVUFBTyxJQUFJLENBQUMsUUFBUSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztHQUN6RDs7O1FBNUJtQixHQUFHOzs7cUJBQUgsR0FBRyIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2F0b20tZm9ybWF0dGVyLWpzYmVhdXRpZnkvbGliL2FwaS9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwaSB7XG5cdGNvbnN0cnVjdG9yKHBsdWdpbk5hbWUpIHtcblx0XHR0aGlzLnBsdWdpbk5hbWUgPSBwbHVnaW5OYW1lO1xuXHR9XG5cblx0Z2V0Q3VycmVudEZpbGVQYXRoKCkge1xuXHRcdHRyeSB7XG5cdFx0XHRsZXQgYWN0aXZlSXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCk7XG5cdFx0XHRyZXR1cm4gYWN0aXZlSXRlbS5idWZmZXIuZmlsZS5wYXRoO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0Y29uc29sZS5sb2codGhpcy5wbHVnaW5OYW1lLCBlKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxuXG5cdGdldEN1cnJlbnRQcm9qZWN0UGF0aCgpIHtcblx0XHR0cnkge1xuXHRcdFx0bGV0IGFjdGl2ZUl0ZW0gPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuXHRcdFx0bGV0IFtwcm9qZWN0UGF0aCwgcmVsYXRpdmVQYXRoXSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChhY3RpdmVJdGVtLmJ1ZmZlci5maWxlLnBhdGgpO1xuXHRcdFx0cmV0dXJuIHByb2plY3RQYXRoO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0Y29uc29sZS5sb2codGhpcy5wbHVnaW5OYW1lLCBlKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxuXG5cdGdldFBsdWdpblBhdGgoKSB7XG5cdFx0cmV0dXJuIGF0b20ucGFja2FnZXMucmVzb2x2ZVBhY2thZ2VQYXRoKHRoaXMucGx1Z2luTmFtZSk7XG5cdH1cbn1cbiJdfQ==