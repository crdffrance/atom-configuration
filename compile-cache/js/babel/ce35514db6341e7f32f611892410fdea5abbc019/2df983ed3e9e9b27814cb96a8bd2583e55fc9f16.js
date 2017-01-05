Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _api = require("./api");

var _api2 = _interopRequireDefault(_api);

var _beautifier = require("./beautifier");

var _beautifier2 = _interopRequireDefault(_beautifier);

var _beautifierErrorJs = require("./beautifier/error.js");

var _beautifierErrorJs2 = _interopRequireDefault(_beautifierErrorJs);

"use babel";

var AtomPlugin = (function () {
	function AtomPlugin() {
		_classCallCheck(this, AtomPlugin);

		this.pluginName = "atom-formatter-jsbeautify";
		this.api = null;
		this.beautifier = null;
	}

	_createClass(AtomPlugin, [{
		key: "activate",
		value: function activate(state) {
			this.api = new _api2["default"](this.pluginName);
			this.beautifier = new _beautifier2["default"]();
		}
	}, {
		key: "provideFormatter",
		value: function provideFormatter() {
			var _this = this;

			return [{
				selector: [".source.js", ".source.js.jsx", ".source.json"],
				getNewText: function getNewText(data) {
					return _this.beautifier.js(_this.api.getCurrentProjectPath(), data).then(function (beautifiedData) {
						return beautifiedData;
					})["catch"](function (err) {
						var details = err;
						if (err instanceof _beautifierErrorJs2["default"]) details = err.toString();

						atom.notifications.addError(_this.pluginName, {
							detail: details,
							dismissable: true
						});

						return _this.beautifier.jsDefault(data);
					});
				}
			}, {
				selector: [".source.css", ".source.css.scss", ".source.css.less", ".source.sass"],
				getNewText: function getNewText(data) {
					return _this.beautifier.css(_this.api.getCurrentProjectPath(), data).then(function (beautifiedData) {
						return beautifiedData;
					})["catch"](function (err) {
						var details = err;
						if (err instanceof _beautifierErrorJs2["default"]) details = err.toString();

						atom.notifications.addError(_this.pluginName, {
							detail: details,
							dismissable: true
						});

						return _this.beautifier.cssDefault(data);
					});
				}
			}, {
				selector: [".text.html", ".text.xml"],
				getNewText: function getNewText(data) {
					return _this.beautifier.html(_this.api.getCurrentProjectPath(), data).then(function (beautifiedData) {
						return beautifiedData;
					})["catch"](function (err) {
						var details = err;
						if (err instanceof _beautifierErrorJs2["default"]) details = err.toString();

						atom.notifications.addError(_this.pluginName, {
							detail: details,
							dismissable: true
						});

						return _this.beautifier.htmlDefault(data);
					});
				}
			}];
		}
	}]);

	return AtomPlugin;
})();

exports["default"] = new AtomPlugin();
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS1mb3JtYXR0ZXItanNiZWF1dGlmeS9saWIvaW5pdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O21CQUVnQixPQUFPOzs7OzBCQUNBLGNBQWM7Ozs7aUNBQ1QsdUJBQXVCOzs7O0FBSm5ELFdBQVcsQ0FBQzs7SUFNTixVQUFVO0FBQ0osVUFETixVQUFVLEdBQ0Q7d0JBRFQsVUFBVTs7QUFFZCxNQUFJLENBQUMsVUFBVSxHQUFHLDJCQUEyQixDQUFDO0FBQzlDLE1BQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDO0FBQ2hCLE1BQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0VBQ3ZCOztjQUxJLFVBQVU7O1NBT1Asa0JBQUMsS0FBSyxFQUFFO0FBQ2YsT0FBSSxDQUFDLEdBQUcsR0FBRyxxQkFBUSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDcEMsT0FBSSxDQUFDLFVBQVUsR0FBRyw2QkFBZ0IsQ0FBQztHQUNuQzs7O1NBRWUsNEJBQUc7OztBQUNsQixVQUFPLENBQUM7QUFDUCxZQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDO0FBQzFELGNBQVUsRUFBRSxvQkFBQyxJQUFJLEVBQUs7QUFDcEIsWUFBTyxNQUFLLFVBQVUsQ0FBQyxFQUFFLENBQUMsTUFBSyxHQUFHLENBQUMscUJBQXFCLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxjQUFjLEVBQUk7QUFDeEYsYUFBTyxjQUFjLENBQUM7TUFDdEIsQ0FBQyxTQUFNLENBQUMsVUFBQSxHQUFHLEVBQUk7QUFDZixVQUFJLE9BQU8sR0FBRyxHQUFHLENBQUM7QUFDbEIsVUFBRyxHQUFHLDBDQUEyQixFQUNoQyxPQUFPLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDOztBQUUxQixVQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxNQUFLLFVBQVUsRUFBRTtBQUM1QyxhQUFNLEVBQUUsT0FBTztBQUNmLGtCQUFXLEVBQUUsSUFBSTtPQUNqQixDQUFDLENBQUM7O0FBRUgsYUFBTyxNQUFLLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7TUFDdkMsQ0FBQyxDQUFDO0tBQ0g7SUFDRixFQUFFO0FBQ0YsWUFBUSxFQUFFLENBQUMsYUFBYSxFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLGNBQWMsQ0FBQztBQUNqRixjQUFVLEVBQUUsb0JBQUMsSUFBSSxFQUFLO0FBQ3JCLFlBQU8sTUFBSyxVQUFVLENBQUMsR0FBRyxDQUFDLE1BQUssR0FBRyxDQUFDLHFCQUFxQixFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsY0FBYyxFQUFJO0FBQ3pGLGFBQU8sY0FBYyxDQUFDO01BQ3RCLENBQUMsU0FBTSxDQUFDLFVBQUEsR0FBRyxFQUFJO0FBQ2YsVUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFVBQUcsR0FBRywwQ0FBMkIsRUFDaEMsT0FBTyxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQzs7QUFFMUIsVUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsTUFBSyxVQUFVLEVBQUU7QUFDNUMsYUFBTSxFQUFFLE9BQU87QUFDZixrQkFBVyxFQUFFLElBQUk7T0FDakIsQ0FBQyxDQUFDOztBQUVILGFBQU8sTUFBSyxVQUFVLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO01BQ3hDLENBQUMsQ0FBQztLQUNIO0lBQ0QsRUFBRTtBQUNGLFlBQVEsRUFBRSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUM7QUFDckMsY0FBVSxFQUFFLG9CQUFDLElBQUksRUFBSztBQUNyQixZQUFPLE1BQUssVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFLLEdBQUcsQ0FBQyxxQkFBcUIsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLGNBQWMsRUFBSTtBQUMxRixhQUFPLGNBQWMsQ0FBQztNQUN0QixDQUFDLFNBQU0sQ0FBQyxVQUFBLEdBQUcsRUFBSTtBQUNmLFVBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQztBQUNsQixVQUFHLEdBQUcsMENBQTJCLEVBQ2hDLE9BQU8sR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRTFCLFVBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLE1BQUssVUFBVSxFQUFFO0FBQzVDLGFBQU0sRUFBRSxPQUFPO0FBQ2Ysa0JBQVcsRUFBRSxJQUFJO09BQ2pCLENBQUMsQ0FBQzs7QUFFSCxhQUFPLE1BQUssVUFBVSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztNQUN6QyxDQUFDLENBQUM7S0FDSDtJQUNELENBQUMsQ0FBQztHQUNIOzs7UUFwRUksVUFBVTs7O3FCQXVFRCxJQUFJLFVBQVUsRUFBRSIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2F0b20tZm9ybWF0dGVyLWpzYmVhdXRpZnkvbGliL2luaXQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgQXBpIGZyb20gXCIuL2FwaVwiO1xuaW1wb3J0IEJlYXV0aWZpZXIgZnJvbSBcIi4vYmVhdXRpZmllclwiO1xuaW1wb3J0IEJlYXV0aWZpZXJFcnJvciBmcm9tIFwiLi9iZWF1dGlmaWVyL2Vycm9yLmpzXCI7XG5cbmNsYXNzIEF0b21QbHVnaW4ge1xuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLnBsdWdpbk5hbWUgPSBcImF0b20tZm9ybWF0dGVyLWpzYmVhdXRpZnlcIjtcblx0XHR0aGlzLmFwaSA9IG51bGw7XG5cdFx0dGhpcy5iZWF1dGlmaWVyID0gbnVsbDtcblx0fVxuXG5cdGFjdGl2YXRlKHN0YXRlKSB7XG5cdFx0dGhpcy5hcGkgPSBuZXcgQXBpKHRoaXMucGx1Z2luTmFtZSk7XG5cdFx0dGhpcy5iZWF1dGlmaWVyID0gbmV3IEJlYXV0aWZpZXIoKTtcblx0fVxuXG5cdHByb3ZpZGVGb3JtYXR0ZXIoKSB7XG5cdFx0cmV0dXJuIFt7XG5cdFx0XHRzZWxlY3RvcjogW1wiLnNvdXJjZS5qc1wiLCBcIi5zb3VyY2UuanMuanN4XCIsIFwiLnNvdXJjZS5qc29uXCJdLFxuXHRcdFx0Z2V0TmV3VGV4dDogKGRhdGEpID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5iZWF1dGlmaWVyLmpzKHRoaXMuYXBpLmdldEN1cnJlbnRQcm9qZWN0UGF0aCgpLCBkYXRhKS50aGVuKGJlYXV0aWZpZWREYXRhID0+IHtcblx0XHRcdFx0XHRcdHJldHVybiBiZWF1dGlmaWVkRGF0YTtcblx0XHRcdFx0XHR9KS5jYXRjaChlcnIgPT4ge1xuXHRcdFx0XHRcdFx0bGV0IGRldGFpbHMgPSBlcnI7XG5cdFx0XHRcdFx0XHRpZihlcnIgaW5zdGFuY2VvZiBCZWF1dGlmaWVyRXJyb3IpXG5cdFx0XHRcdFx0XHRcdGRldGFpbHMgPSBlcnIudG9TdHJpbmcoKTtcblxuXHRcdFx0XHRcdFx0YXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRoaXMucGx1Z2luTmFtZSwge1xuXHRcdFx0XHRcdFx0XHRkZXRhaWw6IGRldGFpbHMsXG5cdFx0XHRcdFx0XHRcdGRpc21pc3NhYmxlOiB0cnVlXG5cdFx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMuYmVhdXRpZmllci5qc0RlZmF1bHQoZGF0YSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHR9LCB7XG5cdFx0XHRzZWxlY3RvcjogW1wiLnNvdXJjZS5jc3NcIiwgXCIuc291cmNlLmNzcy5zY3NzXCIsIFwiLnNvdXJjZS5jc3MubGVzc1wiLCBcIi5zb3VyY2Uuc2Fzc1wiXSxcblx0XHRcdGdldE5ld1RleHQ6IChkYXRhKSA9PiB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmJlYXV0aWZpZXIuY3NzKHRoaXMuYXBpLmdldEN1cnJlbnRQcm9qZWN0UGF0aCgpLCBkYXRhKS50aGVuKGJlYXV0aWZpZWREYXRhID0+IHtcblx0XHRcdFx0XHRyZXR1cm4gYmVhdXRpZmllZERhdGE7XG5cdFx0XHRcdH0pLmNhdGNoKGVyciA9PiB7XG5cdFx0XHRcdFx0bGV0IGRldGFpbHMgPSBlcnI7XG5cdFx0XHRcdFx0aWYoZXJyIGluc3RhbmNlb2YgQmVhdXRpZmllckVycm9yKVxuXHRcdFx0XHRcdFx0ZGV0YWlscyA9IGVyci50b1N0cmluZygpO1xuXG5cdFx0XHRcdFx0YXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHRoaXMucGx1Z2luTmFtZSwge1xuXHRcdFx0XHRcdFx0ZGV0YWlsOiBkZXRhaWxzLFxuXHRcdFx0XHRcdFx0ZGlzbWlzc2FibGU6IHRydWVcblx0XHRcdFx0XHR9KTtcblxuXHRcdFx0XHRcdHJldHVybiB0aGlzLmJlYXV0aWZpZXIuY3NzRGVmYXVsdChkYXRhKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fSwge1xuXHRcdFx0c2VsZWN0b3I6IFtcIi50ZXh0Lmh0bWxcIiwgXCIudGV4dC54bWxcIl0sXG5cdFx0XHRnZXROZXdUZXh0OiAoZGF0YSkgPT4ge1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5iZWF1dGlmaWVyLmh0bWwodGhpcy5hcGkuZ2V0Q3VycmVudFByb2plY3RQYXRoKCksIGRhdGEpLnRoZW4oYmVhdXRpZmllZERhdGEgPT4ge1xuXHRcdFx0XHRcdHJldHVybiBiZWF1dGlmaWVkRGF0YTtcblx0XHRcdFx0fSkuY2F0Y2goZXJyID0+IHtcblx0XHRcdFx0XHRsZXQgZGV0YWlscyA9IGVycjtcblx0XHRcdFx0XHRpZihlcnIgaW5zdGFuY2VvZiBCZWF1dGlmaWVyRXJyb3IpXG5cdFx0XHRcdFx0XHRkZXRhaWxzID0gZXJyLnRvU3RyaW5nKCk7XG5cblx0XHRcdFx0XHRhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IodGhpcy5wbHVnaW5OYW1lLCB7XG5cdFx0XHRcdFx0XHRkZXRhaWw6IGRldGFpbHMsXG5cdFx0XHRcdFx0XHRkaXNtaXNzYWJsZTogdHJ1ZVxuXHRcdFx0XHRcdH0pO1xuXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuYmVhdXRpZmllci5odG1sRGVmYXVsdChkYXRhKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cdFx0fV07XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IEF0b21QbHVnaW4oKTtcbiJdfQ==