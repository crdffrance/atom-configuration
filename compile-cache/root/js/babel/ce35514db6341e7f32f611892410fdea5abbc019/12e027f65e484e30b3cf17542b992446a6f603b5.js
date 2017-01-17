Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _jsBeautify = require("js-beautify");

var _jsBeautify2 = _interopRequireDefault(_jsBeautify);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _errorJs = require("./error.js");

var _errorJs2 = _interopRequireDefault(_errorJs);

"use babel";

var Beautifier = (function () {
	function Beautifier() {
		_classCallCheck(this, Beautifier);

		this.projectPath = null;
		this.config = null;
	}

	_createClass(Beautifier, [{
		key: "resetConfig",
		value: function resetConfig() {
			this.config = null;
		}
	}, {
		key: "getConfig",
		value: function getConfig(projectPath) {
			return new Promise(function (resolve, reject) {
				if (projectPath) {
					(function () {
						var filename = _path2["default"].resolve(projectPath, ".jsbeautifyrc");
						_fs2["default"].readFile(filename, "utf8", function (err, data) {
							if (err) reject(new _errorJs2["default"](".jsbeautifyrc not found", "Beautify with default configurations", err));

							try {
								resolve(JSON.parse(data));
							} catch (exception) {
								reject(new _errorJs2["default"]("An exception occurred when parsing json configuration file " + filename, "Beautify with default configurations", exception));
							}
						});
					})();
				} else reject(new _errorJs2["default"]("Wrong project path", "No beautification", "path is null"));
			});
		}
	}, {
		key: "checkConfig",
		value: function checkConfig(projectPath) {
			var _this = this;

			if (projectPath !== this.projectPath) {
				console.log("atom-formatter-jsbeautify", "Beautifier->exec()", "Project folder updated: Configurations are going to be reloaded.");
				this.projectPath = projectPath;
				return this.getConfig(projectPath);
			}
			console.log("atom-formatter-jsbeautify", "Beautifier->exec()", "Same project folder.");

			return new Promise(function (resolve, reject) {
				resolve(_this.config);
			});
		}
	}, {
		key: "js",
		value: function js(projectPath, data) {
			var _this2 = this;

			return this.checkConfig(projectPath).then(function (config) {
				if (_this2.config !== config) _this2.config = config;
				var beautifiedData = _jsBeautify2["default"].js(data, config);
				return new Promise(function (resolve, reject) {
					if (beautifiedData) resolve(beautifiedData);else reject(new _errorJs2["default"]("Empty Code or An error occurred", "Attempt to beautify with default configurations"));
				});
			});
		}
	}, {
		key: "css",
		value: function css(projectPath, data) {
			var _this3 = this;

			return this.checkConfig(projectPath).then(function (config) {
				if (_this3.config !== config) _this3.config = config;
				var beautifiedData = _jsBeautify2["default"].css(data, config);
				return new Promise(function (resolve, reject) {
					if (beautifiedData) resolve(beautifiedData);else reject(new _errorJs2["default"]("Empty Code or An error occurred", "Attempt to beautify with default configurations"));
				});
			});
		}
	}, {
		key: "html",
		value: function html(projectPath, data) {
			var _this4 = this;

			return this.checkConfig(projectPath).then(function (config) {
				if (_this4.config !== config) _this4.config = config;
				var beautifiedData = _jsBeautify2["default"].html(data, config);
				return new Promise(function (resolve, reject) {
					if (beautifiedData) resolve(beautifiedData);else reject(new _errorJs2["default"]("Empty Code or An error occurred", "Attempt to beautify with default configurations"));
				});
			});
		}
	}, {
		key: "jsDefault",
		value: function jsDefault(data) {
			this.resetConfig();
			return _jsBeautify2["default"].js(data);
		}
	}, {
		key: "cssDefault",
		value: function cssDefault(data) {
			this.resetConfig();
			return _jsBeautify2["default"].css(data);
		}
	}, {
		key: "htmlDefault",
		value: function htmlDefault(data) {
			this.resetConfig();
			return _jsBeautify2["default"].html(data);
		}
	}]);

	return Beautifier;
})();

exports["default"] = Beautifier;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS1mb3JtYXR0ZXItanNiZWF1dGlmeS9saWIvYmVhdXRpZmllci9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OzBCQUV1QixhQUFhOzs7O2tCQUNyQixJQUFJOzs7O29CQUNGLE1BQU07Ozs7dUJBQ0ssWUFBWTs7OztBQUx4QyxXQUFXLENBQUM7O0lBT1MsVUFBVTtBQUNuQixVQURTLFVBQVUsR0FDaEI7d0JBRE0sVUFBVTs7QUFFN0IsTUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsTUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7RUFDbkI7O2NBSm1CLFVBQVU7O1NBTW5CLHVCQUFHO0FBQ2IsT0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7R0FDbkI7OztTQUVRLG1CQUFDLFdBQVcsRUFBRTtBQUN0QixVQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU0sRUFBSztBQUN2QyxRQUFHLFdBQVcsRUFBRTs7QUFDZixVQUFJLFFBQVEsR0FBRyxrQkFBSyxPQUFPLENBQUMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO0FBQzFELHNCQUFHLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLFVBQUMsR0FBRyxFQUFFLElBQUksRUFBSztBQUM1QyxXQUFHLEdBQUcsRUFDTCxNQUFNLENBQUMseUJBQ04seUJBQXlCLEVBQ3pCLHNDQUFzQyxFQUN0QyxHQUFHLENBQ0gsQ0FBQyxDQUFDOztBQUVKLFdBQUk7QUFDSCxlQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQzFCLENBQUMsT0FBTSxTQUFTLEVBQUU7QUFDbEIsY0FBTSxDQUFDLHlCQUNOLDZEQUE2RCxHQUFHLFFBQVEsRUFDeEUsc0NBQXNDLEVBQ3RDLFNBQVMsQ0FDVCxDQUFDLENBQUM7UUFDSDtPQUNELENBQUMsQ0FBQzs7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O0FBQ25CLFVBQU8sd0JBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzNCOzs7U0FFUyxvQkFBQyxJQUFJLEVBQUU7QUFDaEIsT0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLFVBQU8sd0JBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzVCOzs7U0FFVSxxQkFBQyxJQUFJLEVBQUU7QUFDakIsT0FBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ25CLFVBQU8sd0JBQVcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzdCOzs7UUE3R21CLFVBQVU7OztxQkFBVixVQUFVIiwiZmlsZSI6Ii9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS1mb3JtYXR0ZXItanNiZWF1dGlmeS9saWIvYmVhdXRpZmllci9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIGJhYmVsXCI7XG5cbmltcG9ydCBKU0JlYXV0aWZ5IGZyb20gXCJqcy1iZWF1dGlmeVwiO1xuaW1wb3J0IGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBCZWF1dGlmaWVyRXJyb3IgZnJvbSBcIi4vZXJyb3IuanNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmVhdXRpZmllciB7XG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMucHJvamVjdFBhdGggPSBudWxsO1xuXHRcdHRoaXMuY29uZmlnID0gbnVsbDtcblx0fVxuXG5cdHJlc2V0Q29uZmlnKCkge1xuXHRcdHRoaXMuY29uZmlnID0gbnVsbDtcblx0fVxuXG5cdGdldENvbmZpZyhwcm9qZWN0UGF0aCkge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRpZihwcm9qZWN0UGF0aCkge1xuXHRcdFx0XHRsZXQgZmlsZW5hbWUgPSBwYXRoLnJlc29sdmUocHJvamVjdFBhdGgsIFwiLmpzYmVhdXRpZnlyY1wiKTtcblx0XHRcdFx0ZnMucmVhZEZpbGUoZmlsZW5hbWUsIFwidXRmOFwiLCAoZXJyLCBkYXRhKSA9PiB7XG5cdFx0XHRcdFx0aWYoZXJyKVxuXHRcdFx0XHRcdFx0cmVqZWN0KG5ldyBCZWF1dGlmaWVyRXJyb3IoXG5cdFx0XHRcdFx0XHRcdFwiLmpzYmVhdXRpZnlyYyBub3QgZm91bmRcIixcblx0XHRcdFx0XHRcdFx0XCJCZWF1dGlmeSB3aXRoIGRlZmF1bHQgY29uZmlndXJhdGlvbnNcIixcblx0XHRcdFx0XHRcdFx0ZXJyXG5cdFx0XHRcdFx0XHQpKTtcblxuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRyZXNvbHZlKEpTT04ucGFyc2UoZGF0YSkpO1xuXHRcdFx0XHRcdH0gY2F0Y2goZXhjZXB0aW9uKSB7XG5cdFx0XHRcdFx0XHRyZWplY3QobmV3IEJlYXV0aWZpZXJFcnJvcihcblx0XHRcdFx0XHRcdFx0XCJBbiBleGNlcHRpb24gb2NjdXJyZWQgd2hlbiBwYXJzaW5nIGpzb24gY29uZmlndXJhdGlvbiBmaWxlIFwiICsgZmlsZW5hbWUsXG5cdFx0XHRcdFx0XHRcdFwiQmVhdXRpZnkgd2l0aCBkZWZhdWx0IGNvbmZpZ3VyYXRpb25zXCIsXG5cdFx0XHRcdFx0XHRcdGV4Y2VwdGlvblxuXHRcdFx0XHRcdFx0KSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZVxuXHRcdFx0XHRyZWplY3QobmV3IEJlYXV0aWZpZXJFcnJvcihcblx0XHRcdFx0XHRcIldyb25nIHByb2plY3QgcGF0aFwiLFxuXHRcdFx0XHRcdFwiTm8gYmVhdXRpZmljYXRpb25cIixcblx0XHRcdFx0XHRcInBhdGggaXMgbnVsbFwiXG5cdFx0XHRcdCkpO1xuXHRcdH0pO1xuXHR9XG5cblx0Y2hlY2tDb25maWcocHJvamVjdFBhdGgpIHtcblx0XHRpZihwcm9qZWN0UGF0aCAhPT0gdGhpcy5wcm9qZWN0UGF0aCkge1xuXHRcdFx0Y29uc29sZS5sb2coXCJhdG9tLWZvcm1hdHRlci1qc2JlYXV0aWZ5XCIsIFwiQmVhdXRpZmllci0+ZXhlYygpXCIsIFwiUHJvamVjdCBmb2xkZXIgdXBkYXRlZDogQ29uZmlndXJhdGlvbnMgYXJlIGdvaW5nIHRvIGJlIHJlbG9hZGVkLlwiKTtcblx0XHRcdHRoaXMucHJvamVjdFBhdGggPSBwcm9qZWN0UGF0aDtcblx0XHRcdHJldHVybiB0aGlzLmdldENvbmZpZyhwcm9qZWN0UGF0aCk7XG5cdFx0fVxuXHRcdGNvbnNvbGUubG9nKFwiYXRvbS1mb3JtYXR0ZXItanNiZWF1dGlmeVwiLCBcIkJlYXV0aWZpZXItPmV4ZWMoKVwiLCBcIlNhbWUgcHJvamVjdCBmb2xkZXIuXCIpO1xuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHJlc29sdmUodGhpcy5jb25maWcpO1xuXHRcdH0pO1xuXHR9XG5cblx0anMocHJvamVjdFBhdGgsIGRhdGEpIHtcblx0XHRyZXR1cm4gdGhpcy5jaGVja0NvbmZpZyhwcm9qZWN0UGF0aCkudGhlbigoY29uZmlnKSA9PiB7XG5cdFx0XHRpZih0aGlzLmNvbmZpZyAhPT0gY29uZmlnKVxuXHRcdFx0XHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcblx0XHRcdGxldCBiZWF1dGlmaWVkRGF0YSA9IEpTQmVhdXRpZnkuanMoZGF0YSwgY29uZmlnKTtcblx0XHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRcdGlmKGJlYXV0aWZpZWREYXRhKVxuXHRcdFx0XHRcdHJlc29sdmUoYmVhdXRpZmllZERhdGEpO1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cmVqZWN0KG5ldyBCZWF1dGlmaWVyRXJyb3IoXCJFbXB0eSBDb2RlIG9yIEFuIGVycm9yIG9jY3VycmVkXCIsIFwiQXR0ZW1wdCB0byBiZWF1dGlmeSB3aXRoIGRlZmF1bHQgY29uZmlndXJhdGlvbnNcIikpO1xuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHRjc3MocHJvamVjdFBhdGgsIGRhdGEpIHtcblx0XHRyZXR1cm4gdGhpcy5jaGVja0NvbmZpZyhwcm9qZWN0UGF0aCkudGhlbigoY29uZmlnKSA9PiB7XG5cdFx0XHRpZih0aGlzLmNvbmZpZyAhPT0gY29uZmlnKVxuXHRcdFx0XHR0aGlzLmNvbmZpZyA9IGNvbmZpZztcblx0XHRcdGxldCBiZWF1dGlmaWVkRGF0YSA9IEpTQmVhdXRpZnkuY3NzKGRhdGEsIGNvbmZpZyk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRpZihiZWF1dGlmaWVkRGF0YSlcblx0XHRcdFx0XHRyZXNvbHZlKGJlYXV0aWZpZWREYXRhKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlamVjdChuZXcgQmVhdXRpZmllckVycm9yKFwiRW1wdHkgQ29kZSBvciBBbiBlcnJvciBvY2N1cnJlZFwiLCBcIkF0dGVtcHQgdG8gYmVhdXRpZnkgd2l0aCBkZWZhdWx0IGNvbmZpZ3VyYXRpb25zXCIpKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0aHRtbChwcm9qZWN0UGF0aCwgZGF0YSkge1xuXHRcdHJldHVybiB0aGlzLmNoZWNrQ29uZmlnKHByb2plY3RQYXRoKS50aGVuKChjb25maWcpID0+IHtcblx0XHRcdGlmKHRoaXMuY29uZmlnICE9PSBjb25maWcpXG5cdFx0XHRcdHRoaXMuY29uZmlnID0gY29uZmlnO1xuXHRcdFx0bGV0IGJlYXV0aWZpZWREYXRhID0gSlNCZWF1dGlmeS5odG1sKGRhdGEsIGNvbmZpZyk7XG5cdFx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0XHRpZihiZWF1dGlmaWVkRGF0YSlcblx0XHRcdFx0XHRyZXNvbHZlKGJlYXV0aWZpZWREYXRhKTtcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHJlamVjdChuZXcgQmVhdXRpZmllckVycm9yKFwiRW1wdHkgQ29kZSBvciBBbiBlcnJvciBvY2N1cnJlZFwiLCBcIkF0dGVtcHQgdG8gYmVhdXRpZnkgd2l0aCBkZWZhdWx0IGNvbmZpZ3VyYXRpb25zXCIpKTtcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0anNEZWZhdWx0KGRhdGEpIHtcblx0XHR0aGlzLnJlc2V0Q29uZmlnKCk7XG5cdFx0cmV0dXJuIEpTQmVhdXRpZnkuanMoZGF0YSk7XG5cdH1cblxuXHRjc3NEZWZhdWx0KGRhdGEpIHtcblx0XHR0aGlzLnJlc2V0Q29uZmlnKCk7XG5cdFx0cmV0dXJuIEpTQmVhdXRpZnkuY3NzKGRhdGEpO1xuXHR9XG5cblx0aHRtbERlZmF1bHQoZGF0YSkge1xuXHRcdHRoaXMucmVzZXRDb25maWcoKTtcblx0XHRyZXR1cm4gSlNCZWF1dGlmeS5odG1sKGRhdGEpO1xuXHR9XG59XG4iXX0=