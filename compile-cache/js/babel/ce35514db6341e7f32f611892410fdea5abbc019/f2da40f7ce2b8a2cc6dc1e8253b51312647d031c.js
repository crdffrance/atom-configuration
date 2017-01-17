var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _configTernConfigDocs = require('../config/tern-config-docs');

var _configTernConfigDocs2 = _interopRequireDefault(_configTernConfigDocs);

var _configTernPluginsDefintionsJs = require('../config/tern-plugins-defintions.js');

var _configTernPluginsDefintionsJs2 = _interopRequireDefault(_configTernPluginsDefintionsJs);

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsView = require('./atom-ternjs-view');

var _atomTernjsView2 = _interopRequireDefault(_atomTernjsView);

'use babel';

var templateContainer = '\n\n  <div>\n    <div class="container">\n      <h1 class="title"></h1>\n      <div class="content"></div>\n      <button class="btn atom-ternjs-config-close">Save &amp; Restart Server</button>\n      <button class="btn atom-ternjs-config-close">Cancel</button>\n    </div>\n  </div>\n';

var ConfigView = (function (_TernView) {
  _inherits(ConfigView, _TernView);

  function ConfigView() {
    _classCallCheck(this, ConfigView);

    _get(Object.getPrototypeOf(ConfigView.prototype), 'constructor', this).apply(this, arguments);
  }

  _createClass(ConfigView, [{
    key: 'createdCallback',
    value: function createdCallback() {

      this.getModel();

      this.classList.add('atom-ternjs-config');
      this.innerHTML = templateContainer;

      this.containerElement = this.querySelector('.container');
      this.contentElement = this.querySelector('.content');
      this.titleElement = this.querySelector('.title');
      this.buttonClose = this.querySelector('.atom-ternjs-config-close:first-of-type');
      this.buttonCancel = this.querySelector('.atom-ternjs-config-close:last-of-type');
    }
  }, {
    key: 'buildOptionsMarkup',
    value: function buildOptionsMarkup() {

      var projectDir = '';
      var projectConfig = this.getModel().config;

      if (_atomTernjsManager2['default'].client) {

        projectDir = _atomTernjsManager2['default'].client.projectDir;
      }

      this.titleElement.innerHTML = projectDir;

      this.contentElement.appendChild(this.buildRadio('ecmaVersion'));
      this.contentElement.appendChild(this.buildlibs('libs', projectConfig.libs));
      this.contentElement.appendChild(this.buildStringArray(projectConfig.loadEagerly, 'loadEagerly'));
      this.contentElement.appendChild(this.buildStringArray(projectConfig.dontLoad, 'dontLoad'));
      this.contentElement.appendChild(this.buildPlugins('plugins', projectConfig.plugins));
    }
  }, {
    key: 'buildSection',
    value: function buildSection(sectionTitle) {

      var section = document.createElement('section');
      section.classList.add(sectionTitle);

      var header = document.createElement('h2');
      header.innerHTML = sectionTitle;

      section.appendChild(header);

      var docs = _configTernConfigDocs2['default'][sectionTitle].doc;

      if (docs) {

        var doc = document.createElement('p');
        doc.innerHTML = docs;

        section.appendChild(doc);
      }

      return section;
    }
  }, {
    key: 'buildRadio',
    value: function buildRadio(sectionTitle) {
      var _this = this;

      var section = this.buildSection(sectionTitle);

      for (var key of Object.keys(this.getModel().config.ecmaVersions)) {

        var inputWrapper = document.createElement('div');
        inputWrapper.classList.add('input-wrapper');

        var label = document.createElement('span');
        label.innerHTML = key;

        var radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'ecmaVersions';
        radio.checked = this.getModel().config.ecmaVersions[key];
        radio.__ternjs_key = key;

        radio.addEventListener('change', function (e) {

          for (var _key of Object.keys(_this.getModel().config.ecmaVersions)) {

            _this.getModel().config.ecmaVersions[_key] = false;
          }

          _this.getModel().config.ecmaVersions[e.target.__ternjs_key] = e.target.checked;
        }, false);

        inputWrapper.appendChild(label);
        inputWrapper.appendChild(radio);
        section.appendChild(inputWrapper);
      }

      return section;
    }
  }, {
    key: 'buildStringArray',
    value: function buildStringArray(obj, sectionTitle) {

      var section = this.buildSection(sectionTitle);

      for (var path of obj) {

        section.appendChild(this.createInputWrapper(path, sectionTitle));
      }

      if (obj.length === 0) {

        section.appendChild(this.createInputWrapper(null, sectionTitle));
      }

      return section;
    }
  }, {
    key: 'buildPlugins',
    value: function buildPlugins(sectionTitle, availablePlugins) {

      var section = this.buildSection(sectionTitle);

      for (var key of Object.keys(availablePlugins)) {

        var wrapper = document.createElement('p');
        wrapper.appendChild(this.buildBoolean(key, availablePlugins));
        var doc = document.createElement('span');
        doc.innerHTML = _configTernPluginsDefintionsJs2['default'][key] && _configTernPluginsDefintionsJs2['default'][key].doc;
        wrapper.appendChild(doc);
        section.appendChild(wrapper);
      }

      return section;
    }
  }, {
    key: 'buildlibs',
    value: function buildlibs(sectionTitle, availableLibs) {

      var section = this.buildSection(sectionTitle);

      for (var key of Object.keys(availableLibs)) {

        section.appendChild(this.buildBoolean(key, availableLibs));
      }

      return section;
    }
  }, {
    key: 'buildBoolean',
    value: function buildBoolean(option, options) {

      var inputWrapper = document.createElement('div');
      var label = document.createElement('span');
      var checkbox = document.createElement('input');

      inputWrapper.classList.add('input-wrapper');
      label.innerHTML = option;
      checkbox.type = 'checkbox';
      checkbox.checked = options[option]._active;
      checkbox.__ternjs_key = option;
      checkbox.addEventListener('change', function (e) {

        options[e.target.__ternjs_key]._active = e.target.checked;
      }, false);

      inputWrapper.appendChild(label);
      inputWrapper.appendChild(checkbox);

      return inputWrapper;
    }
  }, {
    key: 'createInputWrapper',
    value: function createInputWrapper(path, sectionTitle) {

      var inputWrapper = document.createElement('div');
      var editor = this.createTextEditor(path);

      inputWrapper.classList.add('input-wrapper');
      editor.__ternjs_section = sectionTitle;
      inputWrapper.appendChild(editor);
      inputWrapper.appendChild(this.createAdd(sectionTitle));
      inputWrapper.appendChild(this.createSub(editor));

      return inputWrapper;
    }
  }, {
    key: 'createSub',
    value: function createSub(editor) {
      var _this2 = this;

      var sub = document.createElement('span');
      sub.classList.add('sub');
      sub.classList.add('inline-block');
      sub.classList.add('status-removed');
      sub.classList.add('icon');
      sub.classList.add('icon-diff-removed');

      sub.addEventListener('click', function (e) {

        _this2.getModel().removeEditor(editor);
        var inputWrapper = e.target.closest('.input-wrapper');
        inputWrapper.parentNode.removeChild(inputWrapper);
      }, false);

      return sub;
    }
  }, {
    key: 'createAdd',
    value: function createAdd(sectionTitle) {
      var _this3 = this;

      var add = document.createElement('span');
      add.classList.add('add');
      add.classList.add('inline-block');
      add.classList.add('status-added');
      add.classList.add('icon');
      add.classList.add('icon-diff-added');
      add.addEventListener('click', function (e) {

        e.target.closest('section').appendChild(_this3.createInputWrapper(null, sectionTitle));
      }, false);

      return add;
    }
  }, {
    key: 'createTextEditor',
    value: function createTextEditor(path) {

      var item = document.createElement('atom-text-editor');
      item.setAttribute('mini', true);

      if (path) {

        item.getModel().getBuffer().setText(path);
      }

      this.getModel().editors.push(item);

      return item;
    }
  }, {
    key: 'removeContent',
    value: function removeContent() {

      this.contentElement.innerHTML = '';
    }
  }, {
    key: 'getClose',
    value: function getClose() {

      return this.buttonClose;
    }
  }, {
    key: 'getCancel',
    value: function getCancel() {

      return this.buttonCancel;
    }
  }]);

  return ConfigView;
})(_atomTernjsView2['default']);

module.exports = document.registerElement('atom-ternjs-config', {

  prototype: ConfigView.prototype
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNvbmZpZy12aWV3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7b0NBRTJCLDRCQUE0Qjs7Ozs2Q0FDekIsc0NBQXNDOzs7O2lDQUNoRCx1QkFBdUI7Ozs7OEJBQ3RCLG9CQUFvQjs7OztBQUx6QyxXQUFXLENBQUM7O0FBT1osSUFBTSxpQkFBaUIsa1NBVXRCLENBQUM7O0lBRUksVUFBVTtZQUFWLFVBQVU7O1dBQVYsVUFBVTswQkFBVixVQUFVOzsrQkFBVixVQUFVOzs7ZUFBVixVQUFVOztXQUVDLDJCQUFHOztBQUVoQixVQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7O0FBRWhCLFVBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7QUFDekMsVUFBSSxDQUFDLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQzs7QUFFbkMsVUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDekQsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ3JELFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNqRCxVQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMseUNBQXlDLENBQUMsQ0FBQztBQUNqRixVQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsd0NBQXdDLENBQUMsQ0FBQztLQUNsRjs7O1dBRWlCLDhCQUFHOztBQUVuQixVQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7QUFDcEIsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLE1BQU0sQ0FBQzs7QUFFN0MsVUFBSSwrQkFBUSxNQUFNLEVBQUU7O0FB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Q0FBQyxTQUFTO0NBQ2hDLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1jb25maWctdmlldy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5pbXBvcnQgdGVybkNvbmZpZ0RvY3MgZnJvbSAnLi4vY29uZmlnL3Rlcm4tY29uZmlnLWRvY3MnO1xuaW1wb3J0IHBsdWdpbkRlZmluaXRpb25zIGZyb20gJy4uL2NvbmZpZy90ZXJuLXBsdWdpbnMtZGVmaW50aW9ucy5qcyc7XG5pbXBvcnQgbWFuYWdlciBmcm9tICcuL2F0b20tdGVybmpzLW1hbmFnZXInO1xuaW1wb3J0IFRlcm5WaWV3IGZyb20gJy4vYXRvbS10ZXJuanMtdmlldyc7XG5cbmNvbnN0IHRlbXBsYXRlQ29udGFpbmVyID0gYFxuXG4gIDxkaXY+XG4gICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxuICAgICAgPGgxIGNsYXNzPVwidGl0bGVcIj48L2gxPlxuICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRcIj48L2Rpdj5cbiAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYXRvbS10ZXJuanMtY29uZmlnLWNsb3NlXCI+U2F2ZSAmYW1wOyBSZXN0YXJ0IFNlcnZlcjwvYnV0dG9uPlxuICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBhdG9tLXRlcm5qcy1jb25maWctY2xvc2VcIj5DYW5jZWw8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgPC9kaXY+XG5gO1xuXG5jbGFzcyBDb25maWdWaWV3IGV4dGVuZHMgVGVyblZpZXcge1xuXG4gIGNyZWF0ZWRDYWxsYmFjaygpIHtcblxuICAgIHRoaXMuZ2V0TW9kZWwoKTtcblxuICAgIHRoaXMuY2xhc3NMaXN0LmFkZCgnYXRvbS10ZXJuanMtY29uZmlnJyk7XG4gICAgdGhpcy5pbm5lckhUTUwgPSB0ZW1wbGF0ZUNvbnRhaW5lcjtcblxuICAgIHRoaXMuY29udGFpbmVyRWxlbWVudCA9IHRoaXMucXVlcnlTZWxlY3RvcignLmNvbnRhaW5lcicpO1xuICAgIHRoaXMuY29udGVudEVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5jb250ZW50Jyk7XG4gICAgdGhpcy50aXRsZUVsZW1lbnQgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy50aXRsZScpO1xuICAgIHRoaXMuYnV0dG9uQ2xvc2UgPSB0aGlzLnF1ZXJ5U2VsZWN0b3IoJy5hdG9tLXRlcm5qcy1jb25maWctY2xvc2U6Zmlyc3Qtb2YtdHlwZScpO1xuICAgIHRoaXMuYnV0dG9uQ2FuY2VsID0gdGhpcy5xdWVyeVNlbGVjdG9yKCcuYXRvbS10ZXJuanMtY29uZmlnLWNsb3NlOmxhc3Qtb2YtdHlwZScpO1xuICB9XG5cbiAgYnVpbGRPcHRpb25zTWFya3VwKCkge1xuXG4gICAgbGV0IHByb2plY3REaXIgPSAnJztcbiAgICBjb25zdCBwcm9qZWN0Q29uZmlnID0gdGhpcy5nZXRNb2RlbCgpLmNvbmZpZztcblxuICAgIGlmIChtYW5hZ2VyLmNsaWVudCkge1xuXG4gICAgICBwcm9qZWN0RGlyID0gbWFuYWdlci5jbGllbnQucHJvamVjdERpcjtcbiAgICB9XG5cbiAgICB0aGlzLnRpdGxlRWxlbWVudC5pbm5lckhUTUwgPSBwcm9qZWN0RGlyO1xuXG4gICAgdGhpcy5jb250ZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmJ1aWxkUmFkaW8oJ2VjbWFWZXJzaW9uJykpO1xuICAgIHRoaXMuY29udGVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5idWlsZGxpYnMoJ2xpYnMnLCBwcm9qZWN0Q29uZmlnLmxpYnMpKTtcbiAgICB0aGlzLmNvbnRlbnRFbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuYnVpbGRTdHJpbmdBcnJheShwcm9qZWN0Q29uZmlnLmxvYWRFYWdlcmx5LCAnbG9hZEVhZ2VybHknKSk7XG4gICAgdGhpcy5jb250ZW50RWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmJ1aWxkU3RyaW5nQXJyYXkocHJvamVjdENvbmZpZy5kb250TG9hZCwgJ2RvbnRMb2FkJykpO1xuICAgIHRoaXMuY29udGVudEVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5idWlsZFBsdWdpbnMoJ3BsdWdpbnMnLCBwcm9qZWN0Q29uZmlnLnBsdWdpbnMpKTtcbiAgfVxuXG4gIGJ1aWxkU2VjdGlvbihzZWN0aW9uVGl0bGUpIHtcblxuICAgIGxldCBzZWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VjdGlvbicpO1xuICAgIHNlY3Rpb24uY2xhc3NMaXN0LmFkZChzZWN0aW9uVGl0bGUpO1xuXG4gICAgbGV0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2gyJyk7XG4gICAgaGVhZGVyLmlubmVySFRNTCA9IHNlY3Rpb25UaXRsZTtcblxuICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQoaGVhZGVyKTtcblxuICAgIGNvbnN0IGRvY3MgPSB0ZXJuQ29uZmlnRG9jc1tzZWN0aW9uVGl0bGVdLmRvYztcblxuICAgIGlmIChkb2NzKSB7XG5cbiAgICAgIGxldCBkb2MgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgICBkb2MuaW5uZXJIVE1MID0gZG9jcztcblxuICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZChkb2MpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWN0aW9uO1xuICB9XG5cbiAgYnVpbGRSYWRpbyhzZWN0aW9uVGl0bGUpIHtcblxuICAgIGxldCBzZWN0aW9uID0gdGhpcy5idWlsZFNlY3Rpb24oc2VjdGlvblRpdGxlKTtcblxuICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuZ2V0TW9kZWwoKS5jb25maWcuZWNtYVZlcnNpb25zKSkge1xuXG4gICAgICBsZXQgaW5wdXRXcmFwcGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBpbnB1dFdyYXBwZXIuY2xhc3NMaXN0LmFkZCgnaW5wdXQtd3JhcHBlcicpO1xuXG4gICAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgICBsYWJlbC5pbm5lckhUTUwgPSBrZXk7XG5cbiAgICAgIGxldCByYWRpbyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICByYWRpby50eXBlID0gJ3JhZGlvJztcbiAgICAgIHJhZGlvLm5hbWUgPSAnZWNtYVZlcnNpb25zJztcbiAgICAgIHJhZGlvLmNoZWNrZWQgPSB0aGlzLmdldE1vZGVsKCkuY29uZmlnLmVjbWFWZXJzaW9uc1trZXldO1xuICAgICAgcmFkaW8uX190ZXJuanNfa2V5ID0ga2V5O1xuXG4gICAgICByYWRpby5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCAoZSkgPT4ge1xuXG4gICAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuZ2V0TW9kZWwoKS5jb25maWcuZWNtYVZlcnNpb25zKSkge1xuXG4gICAgICAgICAgdGhpcy5nZXRNb2RlbCgpLmNvbmZpZy5lY21hVmVyc2lvbnNba2V5XSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5nZXRNb2RlbCgpLmNvbmZpZy5lY21hVmVyc2lvbnNbZS50YXJnZXQuX190ZXJuanNfa2V5XSA9IGUudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICB9LCBmYWxzZSk7XG5cbiAgICAgIGlucHV0V3JhcHBlci5hcHBlbmRDaGlsZChsYWJlbCk7XG4gICAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQocmFkaW8pO1xuICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZChpbnB1dFdyYXBwZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWN0aW9uO1xuICB9XG5cbiAgYnVpbGRTdHJpbmdBcnJheShvYmosIHNlY3Rpb25UaXRsZSkge1xuXG4gICAgbGV0IHNlY3Rpb24gPSB0aGlzLmJ1aWxkU2VjdGlvbihzZWN0aW9uVGl0bGUpO1xuXG4gICAgZm9yIChjb25zdCBwYXRoIG9mIG9iaikge1xuXG4gICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlSW5wdXRXcmFwcGVyKHBhdGgsIHNlY3Rpb25UaXRsZSkpO1xuICAgIH1cblxuICAgIGlmIChvYmoubGVuZ3RoID09PSAwKSB7XG5cbiAgICAgIHNlY3Rpb24uYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVJbnB1dFdyYXBwZXIobnVsbCwgc2VjdGlvblRpdGxlKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlY3Rpb247XG4gIH1cblxuICBidWlsZFBsdWdpbnMoc2VjdGlvblRpdGxlLCBhdmFpbGFibGVQbHVnaW5zKSB7XG5cbiAgICBsZXQgc2VjdGlvbiA9IHRoaXMuYnVpbGRTZWN0aW9uKHNlY3Rpb25UaXRsZSk7XG5cbiAgICBmb3IgKGNvbnN0IGtleSBvZiBPYmplY3Qua2V5cyhhdmFpbGFibGVQbHVnaW5zKSkge1xuXG4gICAgICBsZXQgd3JhcHBlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5idWlsZEJvb2xlYW4oa2V5LCBhdmFpbGFibGVQbHVnaW5zKSk7XG4gICAgICBsZXQgZG9jID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgZG9jLmlubmVySFRNTCA9IHBsdWdpbkRlZmluaXRpb25zW2tleV0gJiYgcGx1Z2luRGVmaW5pdGlvbnNba2V5XS5kb2M7XG4gICAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGRvYyk7XG4gICAgICBzZWN0aW9uLmFwcGVuZENoaWxkKHdyYXBwZXIpO1xuICAgIH1cblxuICAgIHJldHVybiBzZWN0aW9uO1xuICB9XG5cbiAgYnVpbGRsaWJzKHNlY3Rpb25UaXRsZSwgYXZhaWxhYmxlTGlicykge1xuXG4gICAgbGV0IHNlY3Rpb24gPSB0aGlzLmJ1aWxkU2VjdGlvbihzZWN0aW9uVGl0bGUpO1xuXG4gICAgZm9yIChjb25zdCBrZXkgb2YgT2JqZWN0LmtleXMoYXZhaWxhYmxlTGlicykpIHtcblxuICAgICAgc2VjdGlvbi5hcHBlbmRDaGlsZCh0aGlzLmJ1aWxkQm9vbGVhbihrZXksIGF2YWlsYWJsZUxpYnMpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc2VjdGlvbjtcbiAgfVxuXG4gIGJ1aWxkQm9vbGVhbihvcHRpb24sIG9wdGlvbnMpIHtcblxuICAgIGxldCBpbnB1dFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsZXQgbGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgbGV0IGNoZWNrYm94ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcblxuICAgIGlucHV0V3JhcHBlci5jbGFzc0xpc3QuYWRkKCdpbnB1dC13cmFwcGVyJyk7XG4gICAgbGFiZWwuaW5uZXJIVE1MID0gb3B0aW9uO1xuICAgIGNoZWNrYm94LnR5cGUgPSAnY2hlY2tib3gnO1xuICAgIGNoZWNrYm94LmNoZWNrZWQgPSBvcHRpb25zW29wdGlvbl0uX2FjdGl2ZTtcbiAgICBjaGVja2JveC5fX3Rlcm5qc19rZXkgPSBvcHRpb247XG4gICAgY2hlY2tib3guYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgKGUpID0+IHtcblxuICAgICAgb3B0aW9uc1tlLnRhcmdldC5fX3Rlcm5qc19rZXldLl9hY3RpdmUgPSBlLnRhcmdldC5jaGVja2VkO1xuXG4gICAgfSwgZmFsc2UpO1xuXG4gICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKGxhYmVsKTtcbiAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQoY2hlY2tib3gpO1xuXG4gICAgcmV0dXJuIGlucHV0V3JhcHBlcjtcbiAgfVxuXG4gIGNyZWF0ZUlucHV0V3JhcHBlcihwYXRoLCBzZWN0aW9uVGl0bGUpIHtcblxuICAgIGxldCBpbnB1dFdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsZXQgZWRpdG9yID0gdGhpcy5jcmVhdGVUZXh0RWRpdG9yKHBhdGgpO1xuXG4gICAgaW5wdXRXcmFwcGVyLmNsYXNzTGlzdC5hZGQoJ2lucHV0LXdyYXBwZXInKTtcbiAgICBlZGl0b3IuX190ZXJuanNfc2VjdGlvbiA9IHNlY3Rpb25UaXRsZTtcbiAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQoZWRpdG9yKTtcbiAgICBpbnB1dFdyYXBwZXIuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVBZGQoc2VjdGlvblRpdGxlKSk7XG4gICAgaW5wdXRXcmFwcGVyLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlU3ViKGVkaXRvcikpO1xuXG4gICAgcmV0dXJuIGlucHV0V3JhcHBlcjtcbiAgfVxuXG4gIGNyZWF0ZVN1YihlZGl0b3IpIHtcblxuICAgIGxldCBzdWIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gICAgc3ViLmNsYXNzTGlzdC5hZGQoJ3N1YicpO1xuICAgIHN1Yi5jbGFzc0xpc3QuYWRkKCdpbmxpbmUtYmxvY2snKTtcbiAgICBzdWIuY2xhc3NMaXN0LmFkZCgnc3RhdHVzLXJlbW92ZWQnKTtcbiAgICBzdWIuY2xhc3NMaXN0LmFkZCgnaWNvbicpO1xuICAgIHN1Yi5jbGFzc0xpc3QuYWRkKCdpY29uLWRpZmYtcmVtb3ZlZCcpO1xuXG4gICAgc3ViLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgdGhpcy5nZXRNb2RlbCgpLnJlbW92ZUVkaXRvcihlZGl0b3IpO1xuICAgICAgY29uc3QgaW5wdXRXcmFwcGVyID0gZS50YXJnZXQuY2xvc2VzdCgnLmlucHV0LXdyYXBwZXInKTtcbiAgICAgIGlucHV0V3JhcHBlci5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGlucHV0V3JhcHBlcik7XG5cbiAgICB9LCBmYWxzZSk7XG5cbiAgICByZXR1cm4gc3ViO1xuICB9XG5cbiAgY3JlYXRlQWRkKHNlY3Rpb25UaXRsZSkge1xuXG4gICAgbGV0IGFkZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgICBhZGQuY2xhc3NMaXN0LmFkZCgnYWRkJyk7XG4gICAgYWRkLmNsYXNzTGlzdC5hZGQoJ2lubGluZS1ibG9jaycpO1xuICAgIGFkZC5jbGFzc0xpc3QuYWRkKCdzdGF0dXMtYWRkZWQnKTtcbiAgICBhZGQuY2xhc3NMaXN0LmFkZCgnaWNvbicpO1xuICAgIGFkZC5jbGFzc0xpc3QuYWRkKCdpY29uLWRpZmYtYWRkZWQnKTtcbiAgICBhZGQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICBlLnRhcmdldC5jbG9zZXN0KCdzZWN0aW9uJykuYXBwZW5kQ2hpbGQodGhpcy5jcmVhdGVJbnB1dFdyYXBwZXIobnVsbCwgc2VjdGlvblRpdGxlKSk7XG5cbiAgICB9LCBmYWxzZSk7XG5cbiAgICByZXR1cm4gYWRkO1xuICB9XG5cbiAgY3JlYXRlVGV4dEVkaXRvcihwYXRoKSB7XG5cbiAgICBsZXQgaXRlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F0b20tdGV4dC1lZGl0b3InKTtcbiAgICBpdGVtLnNldEF0dHJpYnV0ZSgnbWluaScsIHRydWUpO1xuXG4gICAgaWYgKHBhdGgpIHtcblxuICAgICAgaXRlbS5nZXRNb2RlbCgpLmdldEJ1ZmZlcigpLnNldFRleHQocGF0aCk7XG4gICAgfVxuXG4gICAgdGhpcy5nZXRNb2RlbCgpLmVkaXRvcnMucHVzaChpdGVtKTtcblxuICAgIHJldHVybiBpdGVtO1xuICB9XG5cbiAgcmVtb3ZlQ29udGVudCgpIHtcblxuICAgIHRoaXMuY29udGVudEVsZW1lbnQuaW5uZXJIVE1MID0gJyc7XG4gIH1cblxuICBnZXRDbG9zZSgpIHtcblxuICAgIHJldHVybiB0aGlzLmJ1dHRvbkNsb3NlO1xuICB9XG5cbiAgZ2V0Q2FuY2VsKCkge1xuXG4gICAgcmV0dXJuIHRoaXMuYnV0dG9uQ2FuY2VsO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQucmVnaXN0ZXJFbGVtZW50KCdhdG9tLXRlcm5qcy1jb25maWcnLCB7XG5cbiAgcHJvdG90eXBlOiBDb25maWdWaWV3LnByb3RvdHlwZVxufSk7XG4iXX0=