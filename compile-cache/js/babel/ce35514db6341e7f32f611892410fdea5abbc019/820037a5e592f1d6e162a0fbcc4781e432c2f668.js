Object.defineProperty(exports, "__esModule", {
    value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _atom = require("atom");

// eslint-disable-line import/no-unresolved

var _pythonIndent = require("./python-indent");

var _pythonIndent2 = _interopRequireDefault(_pythonIndent);

"use babel";

exports["default"] = {
    config: {
        hangingIndentTabs: {
            type: "number",
            "default": 1,
            description: "Number of tabs used for _hanging_ indents",
            "enum": [1, 2]
        }
    },
    activate: function activate() {
        _this.pythonIndent = new _pythonIndent2["default"]();
        _this.subscriptions = new _atom.CompositeDisposable();
        _this.subscriptions.add(atom.commands.add("atom-text-editor", { "editor:newline": function editorNewline() {
                return _this.pythonIndent.properlyIndent();
            } }));
    }
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvcHl0aG9uLWluZGVudC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7OztvQkFFb0MsTUFBTTs7Ozs0QkFDakIsaUJBQWlCOzs7O0FBSDFDLFdBQVcsQ0FBQzs7cUJBS0c7QUFDWCxVQUFNLEVBQUU7QUFDSix5QkFBaUIsRUFBRTtBQUNmLGdCQUFJLEVBQUUsUUFBUTtBQUNkLHVCQUFTLENBQUM7QUFDVix1QkFBVyxFQUFFLDJDQUEyQztBQUN4RCxvQkFBTSxDQUNGLENBQUMsRUFDRCxDQUFDLENBQ0o7U0FDSjtLQUNKO0FBQ0QsWUFBUSxFQUFFLG9CQUFNO0FBQ1osY0FBSyxZQUFZLEdBQUcsK0JBQWtCLENBQUM7QUFDdkMsY0FBSyxhQUFhLEdBQUcsK0JBQXlCLENBQUM7QUFDL0MsY0FBSyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGtCQUFrQixFQUN2RCxFQUFFLGdCQUFnQixFQUFFO3VCQUFNLE1BQUssWUFBWSxDQUFDLGNBQWMsRUFBRTthQUFBLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDeEU7Q0FDSiIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL3B5dGhvbi1pbmRlbnQvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBiYWJlbFwiO1xuXG5pbXBvcnQgeyBDb21wb3NpdGVEaXNwb3NhYmxlIH0gZnJvbSBcImF0b21cIjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBpbXBvcnQvbm8tdW5yZXNvbHZlZFxuaW1wb3J0IFB5dGhvbkluZGVudCBmcm9tIFwiLi9weXRob24taW5kZW50XCI7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgICBjb25maWc6IHtcbiAgICAgICAgaGFuZ2luZ0luZGVudFRhYnM6IHtcbiAgICAgICAgICAgIHR5cGU6IFwibnVtYmVyXCIsXG4gICAgICAgICAgICBkZWZhdWx0OiAxLFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwiTnVtYmVyIG9mIHRhYnMgdXNlZCBmb3IgX2hhbmdpbmdfIGluZGVudHNcIixcbiAgICAgICAgICAgIGVudW06IFtcbiAgICAgICAgICAgICAgICAxLFxuICAgICAgICAgICAgICAgIDIsXG4gICAgICAgICAgICBdLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgYWN0aXZhdGU6ICgpID0+IHtcbiAgICAgICAgdGhpcy5weXRob25JbmRlbnQgPSBuZXcgUHl0aG9uSW5kZW50KCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXRleHQtZWRpdG9yXCIsXG4gICAgICAgICAgICB7IFwiZWRpdG9yOm5ld2xpbmVcIjogKCkgPT4gdGhpcy5weXRob25JbmRlbnQucHJvcGVybHlJbmRlbnQoKSB9KSk7XG4gICAgfSxcbn07XG4iXX0=