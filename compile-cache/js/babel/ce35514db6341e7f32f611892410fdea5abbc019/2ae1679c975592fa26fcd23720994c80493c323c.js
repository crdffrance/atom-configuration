Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

'use babel';

var Function = require('loophole').Function;
var REGEXP_LINE = /(([\$\w]+[\w-]*)|([.:;'"[{( ]+))$/g;

var Provider = (function () {
  function Provider() {
    _classCallCheck(this, Provider);

    this.disposables = [];

    this.force = false;

    // automcomplete-plus
    this.selector = '.source.js';
    this.disableForSelector = '.source.js .comment';
    this.inclusionPriority = 1;
    this.suggestionPriority = _atomTernjsPackageConfig2['default'].options.snippetsFirst ? null : 2;
    this.excludeLowerPriority = _atomTernjsPackageConfig2['default'].options.excludeLowerPriorityProviders;

    this.line = undefined;
    this.lineMatchResult = undefined;
    this.tempPrefix = undefined;
    this.suggestionsArr = undefined;
    this.suggestion = undefined;
    this.suggestionClone = undefined;

    this.registerCommands();
  }

  _createClass(Provider, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:startCompletion', this.forceCompletion.bind(this)));
    }
  }, {
    key: 'isValidPrefix',
    value: function isValidPrefix(prefix, prefixLast) {

      if (prefixLast === undefined) {

        return false;
      }

      if (prefixLast === '\.') {

        return true;
      }

      if (prefixLast.match(/;|\s/)) {

        return false;
      }

      if (prefix.length > 1) {

        prefix = '_' + prefix;
      }

      try {

        new Function('var ' + prefix)();
      } catch (e) {

        return false;
      }

      return true;
    }
  }, {
    key: 'checkPrefix',
    value: function checkPrefix(prefix) {

      if (prefix.match(/(\(|\s|;|\.|\"|\')$/) || prefix.replace(/\s/g, '').length === 0) {

        return '';
      }

      return prefix;
    }
  }, {
    key: 'getPrefix',
    value: function getPrefix(editor, bufferPosition) {

      this.line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition]);
      this.lineMatchResult = this.line.match(REGEXP_LINE);

      if (this.lineMatchResult) {

        return this.lineMatchResult[0];
      }
    }
  }, {
    key: 'getSuggestions',
    value: function getSuggestions(_ref) {
      var _this = this;

      var editor = _ref.editor;
      var bufferPosition = _ref.bufferPosition;
      var scopeDescriptor = _ref.scopeDescriptor;
      var prefix = _ref.prefix;
      var activatedManually = _ref.activatedManually;

      return new Promise(function (resolve) {

        if (!_atomTernjsManager2['default'].client) {

          return resolve([]);
        }

        _this.tempPrefix = _this.getPrefix(editor, bufferPosition) || prefix;

        if (!_this.isValidPrefix(_this.tempPrefix, _this.tempPrefix[_this.tempPrefix.length - 1]) && !_this.force && !activatedManually) {

          return resolve([]);
        }

        prefix = _this.checkPrefix(_this.tempPrefix);

        _atomTernjsManager2['default'].client.update(editor).then(function (data) {

          if (!data) {

            return resolve([]);
          }

          _atomTernjsManager2['default'].client.completions(atom.project.relativizePath(editor.getURI())[1], {

            line: bufferPosition.row,
            ch: bufferPosition.column

          }).then(function (data) {

            if (!data) {

              return resolve([]);
            }

            if (!data.completions.length) {

              return resolve([]);
            }

            _this.suggestionsArr = [];

            var scopesPath = scopeDescriptor.getScopesArray();
            var isInFunDef = scopesPath.indexOf('meta.function.js') > -1;

            for (var obj of data.completions) {

              obj = (0, _atomTernjsHelper.formatTypeCompletion)(obj, data.isProperty, data.isObjectKey, isInFunDef);

              _this.suggestion = {

                text: obj.name,
                replacementPrefix: prefix,
                className: null,
                type: obj._typeSelf,
                leftLabel: obj.leftLabel,
                snippet: obj._snippet,
                displayText: obj._displayText,
                description: obj.doc || null,
                descriptionMoreURL: obj.url || null
              };

              if (_atomTernjsPackageConfig2['default'].options.useSnippetsAndFunction && obj._hasParams) {

                _this.suggestionClone = (0, _underscorePlus.clone)(_this.suggestion);
                _this.suggestionClone.type = 'snippet';

                if (obj._hasParams) {

                  _this.suggestion.snippet = obj.name + '(${0:})';
                } else {

                  _this.suggestion.snippet = obj.name + '()';
                }

                _this.suggestionsArr.push(_this.suggestion);
                _this.suggestionsArr.push(_this.suggestionClone);
              } else {

                _this.suggestionsArr.push(_this.suggestion);
              }
            }

            resolve(_this.suggestionsArr);
          })['catch'](function (err) {

            console.error(err);
            resolve([]);
          });
        });
      });
    }
  }, {
    key: 'forceCompletion',
    value: function forceCompletion() {

      this.force = true;
      atom.commands.dispatch(atom.views.getView(atom.workspace.getActiveTextEditor()), 'autocomplete-plus:activate');
      this.force = false;
    }
  }, {
    key: 'destroy',
    value: function destroy() {}
  }]);

  return Provider;
})();

exports['default'] = new Provider();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7aUNBS29CLHVCQUF1Qjs7Ozt1Q0FDakIsOEJBQThCOzs7O2dDQUdqRCxzQkFBc0I7OzhCQUd0QixpQkFBaUI7O0FBWnhCLFdBQVcsQ0FBQzs7QUFFWixJQUFNLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQzlDLElBQU0sV0FBVyxHQUFHLG9DQUFvQyxDQUFDOztJQVduRCxRQUFRO0FBRUQsV0FGUCxRQUFRLEdBRUU7MEJBRlYsUUFBUTs7QUFJVixRQUFJLENBQUMsV0FBVyxHQUFHLEVBQUUsQ0FBQzs7QUFFdEIsUUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7OztBQUduQixRQUFJLENBQUMsUUFBUSxHQUFHLFlBQVksQ0FBQztBQUM3QixRQUFJLENBQUMsa0JBQWtCLEdBQUcscUJBQXFCLENBQUM7QUFDaEQsUUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsQ0FBQztBQUMzQixRQUFJLENBQUMsa0JBQWtCLEdBQUcscUNBQWMsT0FBTyxDQUFDLGFBQWEsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ3pFLFFBQUksQ0FBQyxvQkFBb0IsR0FBRyxxQ0FBYyxPQUFPLENBQUMsNkJBQTZCLENBQUM7O0FBRWhGLFFBQUksQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzVCLFFBQUksQ0FBQyxjQUFjLEdBQUcsU0FBUyxDQUFDO0FBQ2hDLFFBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDO0FBQzVCLFFBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDOztBQUVqQyxRQUFJLENBQUMsZ0JBQWdC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QUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztBQUNsQixVQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBRSw0QkFBNEIsQ0FBQyxDQUFDO0FBQy9HLFVBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0tBQ3BCOzs7V0FFTSxtQkFBRyxFQUdUOzs7U0FwTUcsUUFBUTs7O3FCQXVNQyxJQUFJLFFBQVEsRUFBRSIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1wcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBGdW5jdGlvbiA9IHJlcXVpcmUoJ2xvb3Bob2xlJykuRnVuY3Rpb247XG5jb25zdCBSRUdFWFBfTElORSA9IC8oKFtcXCRcXHddK1tcXHctXSopfChbLjo7J1wiW3soIF0rKSkkL2c7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcbmltcG9ydCB7XG4gIGZvcm1hdFR5cGVDb21wbGV0aW9uXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcbmltcG9ydCB7XG4gIGNsb25lXG59IGZyb20gJ3VuZGVyc2NvcmUtcGx1cyc7XG5cbmNsYXNzIFByb3ZpZGVyIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgIHRoaXMuZm9yY2UgPSBmYWxzZTtcblxuICAgIC8vIGF1dG9tY29tcGxldGUtcGx1c1xuICAgIHRoaXMuc2VsZWN0b3IgPSAnLnNvdXJjZS5qcyc7XG4gICAgdGhpcy5kaXNhYmxlRm9yU2VsZWN0b3IgPSAnLnNvdXJjZS5qcyAuY29tbWVudCc7XG4gICAgdGhpcy5pbmNsdXNpb25Qcmlvcml0eSA9IDE7XG4gICAgdGhpcy5zdWdnZXN0aW9uUHJpb3JpdHkgPSBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuc25pcHBldHNGaXJzdCA/IG51bGwgOiAyO1xuICAgIHRoaXMuZXhjbHVkZUxvd2VyUHJpb3JpdHkgPSBwYWNrYWdlQ29uZmlnLm9wdGlvbnMuZXhjbHVkZUxvd2VyUHJpb3JpdHlQcm92aWRlcnM7XG5cbiAgICB0aGlzLmxpbmUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5saW5lTWF0Y2hSZXN1bHQgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy50ZW1wUHJlZml4ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5zdWdnZXN0aW9uID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc3VnZ2VzdGlvbkNsb25lID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5yZWdpc3RlckNvbW1hbmRzKCk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOnN0YXJ0Q29tcGxldGlvbicsIHRoaXMuZm9yY2VDb21wbGV0aW9uLmJpbmQodGhpcykpKTtcbiAgfVxuXG4gIGlzVmFsaWRQcmVmaXgocHJlZml4LCBwcmVmaXhMYXN0KSB7XG5cbiAgICBpZiAocHJlZml4TGFzdCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZiAocHJlZml4TGFzdCA9PT0gJ1xcLicpIHtcblxuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHByZWZpeExhc3QubWF0Y2goLzt8XFxzLykpIHtcblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmIChwcmVmaXgubGVuZ3RoID4gMSkge1xuXG4gICAgICBwcmVmaXggPSBgXyR7cHJlZml4fWA7XG4gICAgfVxuXG4gICAgdHJ5IHtcblxuICAgICAgKG5ldyBGdW5jdGlvbihgdmFyICR7cHJlZml4fWApKSgpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBjaGVja1ByZWZpeChwcmVmaXgpIHtcblxuICAgIGlmIChcbiAgICAgIHByZWZpeC5tYXRjaCgvKFxcKHxcXHN8O3xcXC58XFxcInxcXCcpJC8pIHx8XG4gICAgICBwcmVmaXgucmVwbGFjZSgvXFxzL2csICcnKS5sZW5ndGggPT09IDBcbiAgICApIHtcblxuICAgICAgcmV0dXJuICcnO1xuICAgIH1cblxuICAgIHJldHVybiBwcmVmaXg7XG4gIH1cblxuICBnZXRQcmVmaXgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikge1xuXG4gICAgdGhpcy5saW5lID0gZWRpdG9yLmdldFRleHRJblJhbmdlKFtbYnVmZmVyUG9zaXRpb24ucm93LCAwXSwgYnVmZmVyUG9zaXRpb25dKTtcbiAgICB0aGlzLmxpbmVNYXRjaFJlc3VsdCA9IHRoaXMubGluZS5tYXRjaChSRUdFWFBfTElORSk7XG5cbiAgICBpZiAodGhpcy5saW5lTWF0Y2hSZXN1bHQpIHtcblxuICAgICAgcmV0dXJuIHRoaXMubGluZU1hdGNoUmVzdWx0WzBdO1xuICAgIH1cbiAgfVxuXG4gIGdldFN1Z2dlc3Rpb25zKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeCwgYWN0aXZhdGVkTWFudWFsbHl9KSB7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUpID0+IHtcblxuICAgICAgaWYgKCFtYW5hZ2VyLmNsaWVudCkge1xuXG4gICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy50ZW1wUHJlZml4ID0gdGhpcy5nZXRQcmVmaXgoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgfHwgcHJlZml4O1xuXG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZFByZWZpeCh0aGlzLnRlbXBQcmVmaXgsIHRoaXMudGVtcFByZWZpeFt0aGlzLnRlbXBQcmVmaXgubGVuZ3RoIC0gMV0pICYmICF0aGlzLmZvcmNlICYmICFhY3RpdmF0ZWRNYW51YWxseSkge1xuXG4gICAgICAgIHJldHVybiByZXNvbHZlKFtdKTtcbiAgICAgIH1cblxuICAgICAgcHJlZml4ID0gdGhpcy5jaGVja1ByZWZpeCh0aGlzLnRlbXBQcmVmaXgpO1xuXG4gICAgICBtYW5hZ2VyLmNsaWVudC51cGRhdGUoZWRpdG9yKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgaWYgKCFkYXRhKSB7XG5cbiAgICAgICAgICByZXR1cm4gcmVzb2x2ZShbXSk7XG4gICAgICAgIH1cblxuICAgICAgICBtYW5hZ2VyLmNsaWVudC5jb21wbGV0aW9ucyhhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZWRpdG9yLmdldFVSSSgpKVsxXSwge1xuXG4gICAgICAgICAgbGluZTogYnVmZmVyUG9zaXRpb24ucm93LFxuICAgICAgICAgIGNoOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cblxuICAgICAgICB9KS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBpZiAoIWRhdGEpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZGF0YS5jb21wbGV0aW9ucy5sZW5ndGgpIHtcblxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUoW10pO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIgPSBbXTtcblxuICAgICAgICAgIGxldCBzY29wZXNQYXRoID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3Blc0FycmF5KCk7XG4gICAgICAgICAgbGV0IGlzSW5GdW5EZWYgPSBzY29wZXNQYXRoLmluZGV4T2YoJ21ldGEuZnVuY3Rpb24uanMnKSA+IC0xO1xuXG4gICAgICAgICAgZm9yIChsZXQgb2JqIG9mIGRhdGEuY29tcGxldGlvbnMpIHtcblxuICAgICAgICAgICAgb2JqID0gZm9ybWF0VHlwZUNvbXBsZXRpb24ob2JqLCBkYXRhLmlzUHJvcGVydHksIGRhdGEuaXNPYmplY3RLZXksIGlzSW5GdW5EZWYpO1xuXG4gICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb24gPSB7XG5cbiAgICAgICAgICAgICAgdGV4dDogb2JqLm5hbWUsXG4gICAgICAgICAgICAgIHJlcGxhY2VtZW50UHJlZml4OiBwcmVmaXgsXG4gICAgICAgICAgICAgIGNsYXNzTmFtZTogbnVsbCxcbiAgICAgICAgICAgICAgdHlwZTogb2JqLl90eXBlU2VsZixcbiAgICAgICAgICAgICAgbGVmdExhYmVsOiBvYmoubGVmdExhYmVsLFxuICAgICAgICAgICAgICBzbmlwcGV0OiBvYmouX3NuaXBwZXQsXG4gICAgICAgICAgICAgIGRpc3BsYXlUZXh0OiBvYmouX2Rpc3BsYXlUZXh0LFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbjogb2JqLmRvYyB8fCBudWxsLFxuICAgICAgICAgICAgICBkZXNjcmlwdGlvbk1vcmVVUkw6IG9iai51cmwgfHwgbnVsbFxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgaWYgKHBhY2thZ2VDb25maWcub3B0aW9ucy51c2VTbmlwcGV0c0FuZEZ1bmN0aW9uICYmIG9iai5faGFzUGFyYW1zKSB7XG5cbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uQ2xvbmUgPSBjbG9uZSh0aGlzLnN1Z2dlc3Rpb24pO1xuICAgICAgICAgICAgICB0aGlzLnN1Z2dlc3Rpb25DbG9uZS50eXBlID0gJ3NuaXBwZXQnO1xuXG4gICAgICAgICAgICAgIGlmIChvYmouX2hhc1BhcmFtcykge1xuXG4gICAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uLnNuaXBwZXQgPSBgJHtvYmoubmFtZX0oJFxcezA6XFx9KWA7XG5cbiAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbi5zbmlwcGV0ID0gYCR7b2JqLm5hbWV9KClgO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc0Fyci5wdXNoKHRoaXMuc3VnZ2VzdGlvbik7XG4gICAgICAgICAgICAgIHRoaXMuc3VnZ2VzdGlvbnNBcnIucHVzaCh0aGlzLnN1Z2dlc3Rpb25DbG9uZSk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgdGhpcy5zdWdnZXN0aW9uc0Fyci5wdXNoKHRoaXMuc3VnZ2VzdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmVzb2x2ZSh0aGlzLnN1Z2dlc3Rpb25zQXJyKTtcblxuICAgICAgICB9KS5jYXRjaCgoZXJyKSA9PiB7XG5cbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgICAgICAgcmVzb2x2ZShbXSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmb3JjZUNvbXBsZXRpb24oKSB7XG5cbiAgICB0aGlzLmZvcmNlID0gdHJ1ZTtcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpLCAnYXV0b2NvbXBsZXRlLXBsdXM6YWN0aXZhdGUnKTtcbiAgICB0aGlzLmZvcmNlID0gZmFsc2U7XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG5cbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgUHJvdmlkZXIoKTtcbiJdfQ==