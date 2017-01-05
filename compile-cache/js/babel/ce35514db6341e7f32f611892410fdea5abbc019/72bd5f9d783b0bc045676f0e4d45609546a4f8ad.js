"use babel";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var BeautifierError = (function (_Error) {
	_inherits(BeautifierError, _Error);

	function BeautifierError(message, behavior, error) {
		_classCallCheck(this, BeautifierError);

		_get(Object.getPrototypeOf(BeautifierError.prototype), "constructor", this).call(this, message);

		this.name = "BeautifyError";
		this.message = message;
		this.behavior = behavior;
		this.error = error;
	}

	_createClass(BeautifierError, [{
		key: "getName",
		value: function getName() {
			return this.name;
		}
	}, {
		key: "getMessage",
		value: function getMessage() {
			return this.message;
		}
	}, {
		key: "getBehavior",
		value: function getBehavior() {
			return this.behavior;
		}
	}, {
		key: "getError",
		value: function getError() {
			return this.error;
		}
	}, {
		key: "toString",
		value: function toString() {
			return this.name + ": " + this.message + "\n" + "Details: " + this.error + "\n" + "Next behavior: " + this.behavior;
		}
	}]);

	return BeautifierError;
})(Error);

exports["default"] = BeautifierError;
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS1mb3JtYXR0ZXItanNiZWF1dGlmeS9saWIvYmVhdXRpZmllci9lcnJvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7Ozs7Ozs7Ozs7O0lBRVMsZUFBZTtXQUFmLGVBQWU7O0FBQ3hCLFVBRFMsZUFBZSxDQUN2QixPQUFPLEVBQUUsUUFBUSxFQUFFLEtBQUssRUFBRTt3QkFEbEIsZUFBZTs7QUFFbEMsNkJBRm1CLGVBQWUsNkNBRTVCLE9BQU8sRUFBRTs7QUFFZixNQUFJLENBQUMsSUFBSSxHQUFHLGVBQWUsQ0FBQztBQUM1QixNQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztBQUN2QixNQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUN6QixNQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztFQUNuQjs7Y0FSbUIsZUFBZTs7U0FVNUIsbUJBQUc7QUFDVCxVQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7R0FDakI7OztTQUVTLHNCQUFHO0FBQ1osVUFBTyxJQUFJLENBQUMsT0FBTyxDQUFDO0dBQ3BCOzs7U0FFVSx1QkFBRztBQUNiLFVBQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztHQUNyQjs7O1NBRU8sb0JBQUc7QUFDVixVQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7R0FDbEI7OztTQUVPLG9CQUFHO0FBQ1YsVUFBTyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksR0FDMUMsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxHQUMvQixpQkFBaUIsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0dBQ3JDOzs7UUE5Qm1CLGVBQWU7R0FBUyxLQUFLOztxQkFBN0IsZUFBZSIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2F0b20tZm9ybWF0dGVyLWpzYmVhdXRpZnkvbGliL2JlYXV0aWZpZXIvZXJyb3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCZWF1dGlmaWVyRXJyb3IgZXh0ZW5kcyBFcnJvciB7XG5cdGNvbnN0cnVjdG9yKG1lc3NhZ2UsIGJlaGF2aW9yLCBlcnJvcikge1xuXHRcdHN1cGVyKG1lc3NhZ2UpO1xuXG5cdFx0dGhpcy5uYW1lID0gXCJCZWF1dGlmeUVycm9yXCI7XG5cdFx0dGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcblx0XHR0aGlzLmJlaGF2aW9yID0gYmVoYXZpb3I7XG5cdFx0dGhpcy5lcnJvciA9IGVycm9yO1xuXHR9XG5cblx0Z2V0TmFtZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5uYW1lO1xuXHR9XG5cblx0Z2V0TWVzc2FnZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5tZXNzYWdlO1xuXHR9XG5cblx0Z2V0QmVoYXZpb3IoKSB7XG5cdFx0cmV0dXJuIHRoaXMuYmVoYXZpb3I7XG5cdH1cblxuXHRnZXRFcnJvcigpIHtcblx0XHRyZXR1cm4gdGhpcy5lcnJvcjtcblx0fVxuXG5cdHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm5hbWUgKyBcIjogXCIgKyB0aGlzLm1lc3NhZ2UgKyBcIlxcblwiXG5cdFx0XHQrIFwiRGV0YWlsczogXCIgKyB0aGlzLmVycm9yICsgXCJcXG5cIlxuXHRcdFx0KyBcIk5leHQgYmVoYXZpb3I6IFwiICsgdGhpcy5iZWhhdmlvcjtcblx0fVxufVxuIl19