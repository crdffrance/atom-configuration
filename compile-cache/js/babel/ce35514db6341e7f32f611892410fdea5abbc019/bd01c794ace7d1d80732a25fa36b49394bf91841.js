Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _underscorePlus = require('underscore-plus');

'use babel';

var ConfigView = require('./atom-ternjs-config-view');

var Config = (function () {
  function Config() {
    _classCallCheck(this, Config);

    this.disposables = [];

    this.config = undefined;
    this.projectConfig = undefined;
    this.editors = [];

    this.configClearHandler = this.clear.bind(this);
    _atomTernjsEvents2['default'].on('config-clear', this.configClearHandler);

    this.registerCommands();
  }

  _createClass(Config, [{
    key: 'registerCommands',
    value: function registerCommands() {

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:openConfig', this.show.bind(this)));
    }
  }, {
    key: 'getContent',
    value: function getContent(filePath, projectRoot) {

      var root = undefined;

      if (projectRoot) {

        root = _atomTernjsManager2['default'].server && _atomTernjsManager2['default'].server.projectDir;
      } else {

        root = '';
      }

      var content = (0, _atomTernjsHelper.getFileContent)(filePath, root);

      if (!content) {

        return;
      }

      try {

        content = JSON.parse(content);
      } catch (e) {

        atom.notifications.addInfo('Error parsing .tern-project. Please check if it is a valid JSON file.', {

          dismissable: true
        });
        return;
      }

      return content;
    }
  }, {
    key: 'prepareLibs',
    value: function prepareLibs(configDefault) {

      var libs = {};

      for (var index in configDefault.libs) {

        if (this.projectConfig.libs && this.projectConfig.libs.indexOf(configDefault.libs[index]) > -1) {

          libs[configDefault.libs[index]] = {

            _active: true
          };
        } else {

          libs[configDefault.libs[index]] = {

            _active: false
          };
        }
      }

      this.config.libs = libs;
    }
  }, {
    key: 'prepareEcma',
    value: function prepareEcma(configDefault) {

      var ecmaVersions = {};

      for (var lib of Object.keys(configDefault.ecmaVersions)) {

        ecmaVersions[lib] = configDefault.ecmaVersions[lib];
      }

      this.config.ecmaVersions = ecmaVersions;

      if (this.config.ecmaVersion) {

        for (var lib of Object.keys(this.config.ecmaVersions)) {

          if (lib === 'ecmaVersion' + this.config.ecmaVersion) {

            this.config.ecmaVersions[lib] = true;
          } else {

            this.config.ecmaVersions[lib] = false;
          }
        }
      }
    }
  }, {
    key: 'preparePlugins',
    value: function preparePlugins(availablePlugins) {

      if (!this.config.plugins) {

        this.config.plugins = {};
      }

      // check if there are unknown plugins in .tern-config
      for (var plugin of Object.keys(this.config.plugins)) {

        if (!availablePlugins[plugin]) {

          availablePlugins[plugin] = plugin;
        }
      }

      for (var plugin of Object.keys(availablePlugins)) {

        if (this.config.plugins[plugin]) {

          this.config.plugins[plugin] = this.mergeConfigObjects(availablePlugins[plugin], this.config.plugins[plugin]);
          this.config.plugins[plugin]._active = true;
        } else {

          this.config.plugins[plugin] = availablePlugins[plugin];
          this.config.plugins[plugin]._active = false;
        }
      }
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this = this;

      var close = this.configView.getClose();
      var cancel = this.configView.getCancel();

      close.addEventListener('click', function (e) {

        _this.updateConfig();
        _this.hide();
      });

      cancel.addEventListener('click', function (e) {

        _this.destroyEditors();
        _this.hide();
      });
    }
  }, {
    key: 'mergeConfigObjects',
    value: function mergeConfigObjects(obj1, obj2) {

      return (0, _underscorePlus.deepExtend)({}, obj1, obj2);
    }
  }, {
    key: 'hide',
    value: function hide() {

      if (!this.configPanel || !this.configPanel.visible) {

        return;
      }

      this.configPanel.hide();

      (0, _atomTernjsHelper.focusEditor)();
    }
  }, {
    key: 'clear',
    value: function clear() {

      this.hide();
      this.destroyEditors();
      this.config = undefined;
      this.projectConfig = undefined;

      if (!this.configView) {

        return;
      }

      this.configView.removeContent();
    }
  }, {
    key: 'gatherData',
    value: function gatherData() {

      var configDefault = this.getContent('../config/tern-config.json', false);
      var pluginsTern = this.getContent('../config/tern-plugins.json', false);

      if (!configDefault) {

        console.error('Could not load: tern-config.json');
        return;
      }

      this.projectConfig = this.getContent('/.tern-project', true);
      this.config = this.projectConfig || {};

      if (!this.projectConfig) {

        this.projectConfig = {};
        this.config = (0, _underscorePlus.clone)(configDefault);
      }

      this.prepareEcma(configDefault);
      this.prepareLibs(configDefault);
      this.preparePlugins(pluginsTern);

      if (!this.config.loadEagerly) {

        this.config.loadEagerly = [];
      }

      if (!this.config.dontLoad) {

        this.config.dontLoad = [];
      }

      return true;
    }
  }, {
    key: 'removeEditor',
    value: function removeEditor(editor) {

      if (!editor) {

        return;
      }

      var idx = this.editors.indexOf(editor);

      if (idx === -1) {

        return;
      }

      this.editors.splice(idx, 1);
    }
  }, {
    key: 'destroyEditors',
    value: function destroyEditors() {

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        buffer.destroy();
      }

      this.editors = [];
    }
  }, {
    key: 'updateConfig',
    value: function updateConfig() {

      this.config.loadEagerly = [];
      this.config.dontLoad = [];

      for (var editor of this.editors) {

        var buffer = editor.getModel().getBuffer();
        var text = buffer.getText().trim();

        if (text === '') {

          continue;
        }

        this.config[editor.__ternjs_section].push(text);
      }

      this.destroyEditors();

      var newConfig = this.buildNewConfig();
      var newConfigJSON = JSON.stringify(newConfig, null, 2);

      (0, _atomTernjsHelper.updateTernFile)(newConfigJSON, true);
    }
  }, {
    key: 'buildNewConfig',
    value: function buildNewConfig() {

      var newConfig = {};

      for (var key of Object.keys(this.config.ecmaVersions)) {

        if (this.config.ecmaVersions[key]) {

          newConfig.ecmaVersion = Number(key[key.length - 1]);
          break;
        }
      }

      if (!(0, _underscorePlus.isEmpty)(this.config.libs)) {

        newConfig.libs = [];

        for (var key of Object.keys(this.config.libs)) {

          if (this.config.libs[key]._active) {

            newConfig.libs.push(key);
          }
        }
      }

      if (this.config.loadEagerly.length !== 0) {

        newConfig.loadEagerly = this.config.loadEagerly;
      }

      if (this.config.dontLoad.length !== 0) {

        newConfig.dontLoad = this.config.dontLoad;
      }

      if (!(0, _underscorePlus.isEmpty)(this.config.plugins)) {

        newConfig.plugins = {};

        for (var key of Object.keys(this.config.plugins)) {

          if (this.config.plugins[key]._active) {

            delete this.config.plugins[key]._active;
            newConfig.plugins[key] = this.config.plugins[key];
          }
        }
      }

      return newConfig;
    }
  }, {
    key: 'initConfigView',
    value: function initConfigView() {

      this.configView = new ConfigView();
      this.configView.initialize(this);

      this.configPanel = atom.workspace.addRightPanel({

        item: this.configView,
        priority: 0
      });
      this.configPanel.hide();

      this.registerEvents();
    }
  }, {
    key: 'show',
    value: function show() {

      if (!this.configView) {

        this.initConfigView();
      }

      this.clear();

      if (!this.gatherData()) {

        return;
      }

      atom.views.getView(this.configPanel).classList.add('atom-ternjs-config-panel');

      this.configView.buildOptionsMarkup();
      this.configPanel.show();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      if (this.configView) {

        this.configView.destroy();
      }
      this.configView = undefined;

      if (this.configPanel) {

        this.configPanel.destroy();
      }
      this.configPanel = undefined;
    }
  }]);

  return Config;
})();

exports['default'] = new Config();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLWNvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUlvQix1QkFBdUI7Ozs7Z0NBQ3ZCLHNCQUFzQjs7OztnQ0FNbkMsc0JBQXNCOzs4QkFNdEIsaUJBQWlCOztBQWpCeEIsV0FBVyxDQUFDOztBQUVaLElBQU0sVUFBVSxHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDOztJQWlCbEQsTUFBTTtBQUVDLFdBRlAsTUFBTSxHQUVJOzBCQUZWLE1BQU07O0FBSVIsUUFBSSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7O0FBRXRCLFFBQUksQ0FBQyxNQUFNLEdBQUcsU0FBUyxDQUFDO0FBQ3hCLFFBQUksQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDO0FBQy9CLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUVsQixRQUFJLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDaEQsa0NBQVEsRUFBRSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsa0JBQWtCLENBQUMsQ0FBQzs7QUFFcEQsUUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7R0FDekI7O2VBZEcsTUFBTTs7V0FnQk0sNEJBQUc7O0FBRWpCLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHdCQUF3QixFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM1Rzs7O1dBRVMsb0JBQUMsUUFBUSxFQUFFLFdBQVcsRUFBRTs7QUFFaEMsVUFBSSxJQUFJLFlBQUEsQ0FBQzs7QUFFVCxVQUFJLFdBQVcsRUFBRTs7QUFFZixZQUFJLEdBQUcsK0JBQVEsTUFBTSxJQUFJLCtCQUFRLE1BQU0sQ0FBQyxVQUFVLENBQUM7T0FFcEQsTUFBTTs7QUFFTCxZQUFJLEdBQUcsRUFBRSxDQUFDO09BQ1g7O0FBRUQsVUFBSSxPQUFPLEdBQUcsc0NBQWUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDOztBQUU3QyxVQUFJLENBQUMsT0FBTyxFQUFFOztBQUVaLGVBQU87T0FDUjs7QUFFRCxVQUFJOztBQUVGLGVBQU8sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO09BRS9CLENBQUMsT0FBTyxDQUFDLEVBQUU7O0FBRVYsWUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsdUVBQXVFLEVBQUU7O0FBRWxHLHFCQUFXLEVBQUUsSUFBSTtTQUNsQixDQUFDLENBQUM7QUFDSCxlQUFPO09BQ1I7O0FBRUQsYUFBTyxPQUFPLENBQUM7S0FDaEI7OztXQUVVLHFCQUFDLGFBQWEsRUFBRTs7QUFFekIsVUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDOztBQUVkLFdBQUssSUFBTSxLQUFLLElBQUksYUFBYSxDQUFDLElBQUksRUFBRTs7QUFFdEMsWUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFOztBQUU5RixjQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHOztBQUVoQyxtQkFBTyxFQUFFLElBQUk7V0FDZCxDQUFDO1NBRUgsTUFBTTs7QUFFTCxjQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHOztBQUVoQyxtQkFBTyxFQUFFLEtBQUs7V0FDZixDQUFDO1NBQ0g7T0FDRjs7QUFFRCxVQUFJLENBQUMsTUFBTSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7S0FDekI7OztXQUVVLHFCQUFDLGFBQWEsRUFBRTs7QUFFekIsVUFBSSxZQUFZLEdBQUcsRUFBRSxDQUFDOztBQUV0QixXQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxFQUFFOztBQUV2RCxvQkFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7T0FDckQ7O0FBRUQsVUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDOztBQUV4QyxVQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFOztBQUUzQixhQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTs7QUFFckQsY0FBSSxHQUFHLEtBQUssYUFBYSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFOztBQUVuRCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDO1dBRXRDLE1BQU07O0FBRUwsZ0JBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQztXQUN2QztTQUNGO09BQ0Y7S0FDRjs7O1dBRWEsd0JBQUMsZ0JBQWdCLEVBQUU7O0FBRS9CLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRTs7QUFFeEIsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO09BQzFCOzs7QUFHRCxXQUFLLElBQU0sTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFckQsWUFBSSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFOztBQUU3QiwwQkFBZ0IsQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7U0FDbkM7T0FDRjs7QUFFRCxXQUFLLElBQU0sTUFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsRUFBRTs7QUFFbEQsWUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTs7QUFFL0IsY0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDN0csY0FBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztTQUU1QyxNQUFNOztBQUVMLGNBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3ZELGNBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7U0FDN0M7T0FDRjtLQUNGOzs7V0FFYSwwQkFBRzs7O0FBRWYsVUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUN2QyxVQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLFNBQVMsRUFBRSxDQUFDOztBQUV6QyxXQUFLLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLFVBQUMsQ0FBQyxFQUFLOztBQUVyQyxjQUFLLFlBQVksRUFBRSxDQUFDO0FBQ3BCLGNBQUssSUFBSSxFQUFFLENBQUM7T0FDYixDQUFDLENBQUM7O0FBRUgsWUFBTSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUMsRUFBSzs7QUFFdEMsY0FBSyxjQUFjLEVBQUUsQ0FBQztBQUN0QixjQUFLLElBQUksRUFBRSxDQUFDO09BQ2IsQ0FBQyxDQUFDO0tBQ0o7OztXQUVpQiw0QkFBQyxJQUFJLEVBQUUsSUFBSSxFQUFFOztBQUU3QixhQUFPLGdDQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDbkM7OztXQUVHLGdCQUFHOztBQUVMLFVBQ0UsQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUNqQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUN6Qjs7QUFFQSxlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7QUFFeEIsMENBQWEsQ0FBQztLQUNmOzs7V0FFSSxpQkFBRzs7QUFFTixVQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDWixVQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7QUFDdEIsVUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDeEIsVUFBSSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7O0FBRS9CLFVBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFOztBQUVwQixlQUFPO09BQ1I7O0FBRUQsVUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztLQUNqQzs7O1dBRVMsc0JBQUc7O0FBRVgsVUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyw0QkFBNEIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMzRSxVQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLDZCQUE2QixFQUFFLEtBQUssQ0FBQyxDQUFDOztBQUUxRSxVQUFJLENBQUMsYUFBYSxFQUFFOztBQUVsQixlQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7QUFDbEQsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUM3RCxVQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxhQUFhLElBQUksRUFBRSxDQUFDOztBQUV2QyxVQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTs7QUFFdkIsWUFBSSxDQUFDLGFBQWEsR0FBRyxFQUFFLENBQUM7QUFDeEIsWUFBSSxDQUFDLE1BQU0sR0FBRywyQkFBTSxhQUFhLENBQUMsQ0FBQztPQUNwQzs7QUFFRCxVQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBQ2hDLFVBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDaEMsVUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsQ0FBQzs7QUFFakMsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxFQUFFOztBQUU1QixZQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7T0FDOUI7O0FBRUQsVUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFOztBQUV6QixZQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxFQUFFLENBQUM7T0FDM0I7O0FBRUQsYUFBTyxJQUFJLENBQUM7S0FDYjs7O1dBRVcsc0JBQUMsTUFBTSxFQUFFOztBQUVuQixVQUFJLENBQUMsTUFBTSxFQUFFOztBQUVYLGVBQU87T0FDUjs7QUFFRCxVQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFdkMsVUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUU7O0FBRWQsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUM3Qjs7O1dBR2EsMEJBQUc7O0FBRWYsV0FBSyxJQUFJLE1BQU0sSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFOztBQUUvQixZQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDM0MsY0FBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO09BQ2xCOztBQUVELFVBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0tBQ25COzs7V0FFVyx3QkFBRzs7QUFFYixVQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7QUFDN0IsVUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDOztBQUUxQixXQUFLLElBQUksTUFBTSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7O0FBRS9CLFlBQUksTUFBTSxHQUFHLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUMzQyxZQUFJLElBQUksR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRW5DLFlBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTs7QUFFZixtQkFBUztTQUNWOztBQUVELFlBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQ2pEOztBQUVELFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7QUFFdEIsVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0FBQ3RDLFVBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQzs7QUFFdkQsNENBQWUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3JDOzs7V0FFYSwwQkFBRzs7QUFFZixVQUFJLFNBQVMsR0FBRyxFQUFFLENBQUM7O0FBRW5CLFdBQUssSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFOztBQUVyRCxZQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxFQUFFOztBQUVqQyxtQkFBUyxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxnQkFBTTtTQUNQO09BQ0Y7O0FBRUQsVUFBSSxDQUFDLDZCQUFRLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7O0FBRTlCLGlCQUFTLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQzs7QUFFcEIsYUFBSyxJQUFJLEdBQUcsSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUU7O0FBRTdDLGNBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxFQUFFOztBQUVqQyxxQkFBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7V0FDMUI7U0FDRjtPQUNGOztBQUVELFVBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTs7QUFFeEMsaUJBQVMsQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7T0FDakQ7O0FBRUQsVUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFOztBQUVyQyxpQkFBUyxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztPQUMzQzs7QUFFRCxVQUFJLENBQUMsNkJBQVEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFakMsaUJBQVMsQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDOztBQUV2QixhQUFLLElBQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsRUFBRTs7QUFFbEQsY0FBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUU7O0FBRXBDLG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUN4QyxxQkFBUyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztXQUNuRDtTQUNGO09BQ0Y7O0FBRUQsYUFBTyxTQUFTLENBQUM7S0FDbEI7OztXQUVhLDBCQUFHOztBQUVmLFVBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztBQUNuQyxVQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7QUFFakMsVUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsQ0FBQzs7QUFFOUMsWUFBSSxFQUFFLElBQUksQ0FBQyxVQUFVO0FBQ3JCLGdCQUFRLEVBQUUsQ0FBQztPQUNaLENBQUMsQ0FBQztBQUNILFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRXhCLFVBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztLQUN2Qjs7O1dBRUcsZ0JBQUc7O0FBRUwsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7O0FBRXBCLFlBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztPQUN2Qjs7QUFFRCxVQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7O0FBRWIsVUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsRUFBRTs7QUFFdEIsZUFBTztPQUNSOztBQUVELFVBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7O0FBRS9FLFVBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztBQUNyQyxVQUFJLENBQUMsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ3pCOzs7V0FFTSxtQkFBRzs7QUFFUix3Q0FBVyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7O0FBRTdCLFVBQUksSUFBSSxDQUFDLFVBQVUsRUFBRTs7QUFFbkIsWUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUMzQjtBQUNELFVBQUksQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDOztBQUU1QixVQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7O0FBRXBCLFlBQUksQ0FBQyxXQUFXLENBQUMsT0FBTyxFQUFFLENBQUM7T0FDNUI7QUFDRCxVQUFJLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQztLQUM5Qjs7O1NBcFlHLE1BQU07OztxQkF1WUcsSUFBSSxNQUFNLEVBQUUiLCJmaWxlIjoiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtY29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmNvbnN0IENvbmZpZ1ZpZXcgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLWNvbmZpZy12aWV3Jyk7XG5cbmltcG9ydCBtYW5hZ2VyIGZyb20gJy4vYXRvbS10ZXJuanMtbWFuYWdlcic7XG5pbXBvcnQgZW1pdHRlciBmcm9tICcuL2F0b20tdGVybmpzLWV2ZW50cyc7XG5pbXBvcnQge1xuICBnZXRGaWxlQ29udGVudCxcbiAgZm9jdXNFZGl0b3IsXG4gIHVwZGF0ZVRlcm5GaWxlLFxuICBkaXNwb3NlQWxsXG59IGZyb20gJy4vYXRvbS10ZXJuanMtaGVscGVyJztcblxuaW1wb3J0IHtcbiAgZGVlcEV4dGVuZCxcbiAgY2xvbmUsXG4gIGlzRW1wdHlcbn0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcblxuY2xhc3MgQ29uZmlnIHtcblxuICBjb25zdHJ1Y3RvcigpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMgPSBbXTtcblxuICAgIHRoaXMuY29uZmlnID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucHJvamVjdENvbmZpZyA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLmVkaXRvcnMgPSBbXTtcblxuICAgIHRoaXMuY29uZmlnQ2xlYXJIYW5kbGVyID0gdGhpcy5jbGVhci5iaW5kKHRoaXMpO1xuICAgIGVtaXR0ZXIub24oJ2NvbmZpZy1jbGVhcicsIHRoaXMuY29uZmlnQ2xlYXJIYW5kbGVyKTtcblxuICAgIHRoaXMucmVnaXN0ZXJDb21tYW5kcygpO1xuICB9XG5cbiAgcmVnaXN0ZXJDb21tYW5kcygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYXRvbS10ZXJuanM6b3BlbkNvbmZpZycsIHRoaXMuc2hvdy5iaW5kKHRoaXMpKSk7XG4gIH1cblxuICBnZXRDb250ZW50KGZpbGVQYXRoLCBwcm9qZWN0Um9vdCkge1xuXG4gICAgbGV0IHJvb3Q7XG5cbiAgICBpZiAocHJvamVjdFJvb3QpIHtcblxuICAgICAgcm9vdCA9IG1hbmFnZXIuc2VydmVyICYmIG1hbmFnZXIuc2VydmVyLnByb2plY3REaXI7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICByb290ID0gJyc7XG4gICAgfVxuXG4gICAgbGV0IGNvbnRlbnQgPSBnZXRGaWxlQ29udGVudChmaWxlUGF0aCwgcm9vdCk7XG5cbiAgICBpZiAoIWNvbnRlbnQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRyeSB7XG5cbiAgICAgIGNvbnRlbnQgPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbygnRXJyb3IgcGFyc2luZyAudGVybi1wcm9qZWN0LiBQbGVhc2UgY2hlY2sgaWYgaXQgaXMgYSB2YWxpZCBKU09OIGZpbGUuJywge1xuXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICB9KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuXG4gIHByZXBhcmVMaWJzKGNvbmZpZ0RlZmF1bHQpIHtcblxuICAgIGxldCBsaWJzID0ge307XG5cbiAgICBmb3IgKGNvbnN0IGluZGV4IGluIGNvbmZpZ0RlZmF1bHQubGlicykge1xuXG4gICAgICBpZiAodGhpcy5wcm9qZWN0Q29uZmlnLmxpYnMgJiYgdGhpcy5wcm9qZWN0Q29uZmlnLmxpYnMuaW5kZXhPZihjb25maWdEZWZhdWx0LmxpYnNbaW5kZXhdKSA+IC0xKSB7XG5cbiAgICAgICAgbGlic1tjb25maWdEZWZhdWx0LmxpYnNbaW5kZXhdXSA9IHtcblxuICAgICAgICAgIF9hY3RpdmU6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICBsaWJzW2NvbmZpZ0RlZmF1bHQubGlic1tpbmRleF1dID0ge1xuXG4gICAgICAgICAgX2FjdGl2ZTogZmFsc2VcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZy5saWJzID0gbGlicztcbiAgfVxuXG4gIHByZXBhcmVFY21hKGNvbmZpZ0RlZmF1bHQpIHtcblxuICAgIGxldCBlY21hVmVyc2lvbnMgPSB7fTtcblxuICAgIGZvciAobGV0IGxpYiBvZiBPYmplY3Qua2V5cyhjb25maWdEZWZhdWx0LmVjbWFWZXJzaW9ucykpIHtcblxuICAgICAgZWNtYVZlcnNpb25zW2xpYl0gPSBjb25maWdEZWZhdWx0LmVjbWFWZXJzaW9uc1tsaWJdO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnLmVjbWFWZXJzaW9ucyA9IGVjbWFWZXJzaW9ucztcblxuICAgIGlmICh0aGlzLmNvbmZpZy5lY21hVmVyc2lvbikge1xuXG4gICAgICBmb3IgKGxldCBsaWIgb2YgT2JqZWN0LmtleXModGhpcy5jb25maWcuZWNtYVZlcnNpb25zKSkge1xuXG4gICAgICAgIGlmIChsaWIgPT09ICdlY21hVmVyc2lvbicgKyB0aGlzLmNvbmZpZy5lY21hVmVyc2lvbikge1xuXG4gICAgICAgICAgdGhpcy5jb25maWcuZWNtYVZlcnNpb25zW2xpYl0gPSB0cnVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICB0aGlzLmNvbmZpZy5lY21hVmVyc2lvbnNbbGliXSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJlcGFyZVBsdWdpbnMoYXZhaWxhYmxlUGx1Z2lucykge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5wbHVnaW5zKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnMgPSB7fTtcbiAgICB9XG5cbiAgICAvLyBjaGVjayBpZiB0aGVyZSBhcmUgdW5rbm93biBwbHVnaW5zIGluIC50ZXJuLWNvbmZpZ1xuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLnBsdWdpbnMpKSB7XG5cbiAgICAgIGlmICghYXZhaWxhYmxlUGx1Z2luc1twbHVnaW5dKSB7XG5cbiAgICAgICAgYXZhaWxhYmxlUGx1Z2luc1twbHVnaW5dID0gcGx1Z2luO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAoY29uc3QgcGx1Z2luIG9mIE9iamVjdC5rZXlzKGF2YWlsYWJsZVBsdWdpbnMpKSB7XG5cbiAgICAgIGlmICh0aGlzLmNvbmZpZy5wbHVnaW5zW3BsdWdpbl0pIHtcblxuICAgICAgICB0aGlzLmNvbmZpZy5wbHVnaW5zW3BsdWdpbl0gPSB0aGlzLm1lcmdlQ29uZmlnT2JqZWN0cyhhdmFpbGFibGVQbHVnaW5zW3BsdWdpbl0sIHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXSk7XG4gICAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXS5fYWN0aXZlID0gdHJ1ZTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLmNvbmZpZy5wbHVnaW5zW3BsdWdpbl0gPSBhdmFpbGFibGVQbHVnaW5zW3BsdWdpbl07XG4gICAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbcGx1Z2luXS5fYWN0aXZlID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmVnaXN0ZXJFdmVudHMoKSB7XG5cbiAgICBsZXQgY2xvc2UgPSB0aGlzLmNvbmZpZ1ZpZXcuZ2V0Q2xvc2UoKTtcbiAgICBsZXQgY2FuY2VsID0gdGhpcy5jb25maWdWaWV3LmdldENhbmNlbCgpO1xuXG4gICAgY2xvc2UuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLnVwZGF0ZUNvbmZpZygpO1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfSk7XG5cbiAgICBjYW5jZWwuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuXG4gICAgICB0aGlzLmRlc3Ryb3lFZGl0b3JzKCk7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1lcmdlQ29uZmlnT2JqZWN0cyhvYmoxLCBvYmoyKSB7XG5cbiAgICByZXR1cm4gZGVlcEV4dGVuZCh7fSwgb2JqMSwgb2JqMik7XG4gIH1cblxuICBoaWRlKCkge1xuXG4gICAgaWYgKFxuICAgICAgIXRoaXMuY29uZmlnUGFuZWwgfHxcbiAgICAgICF0aGlzLmNvbmZpZ1BhbmVsLnZpc2libGVcbiAgICApIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnUGFuZWwuaGlkZSgpO1xuXG4gICAgZm9jdXNFZGl0b3IoKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuXG4gICAgdGhpcy5oaWRlKCk7XG4gICAgdGhpcy5kZXN0cm95RWRpdG9ycygpO1xuICAgIHRoaXMuY29uZmlnID0gdW5kZWZpbmVkO1xuICAgIHRoaXMucHJvamVjdENvbmZpZyA9IHVuZGVmaW5lZDtcblxuICAgIGlmICghdGhpcy5jb25maWdWaWV3KSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbmZpZ1ZpZXcucmVtb3ZlQ29udGVudCgpO1xuICB9XG5cbiAgZ2F0aGVyRGF0YSgpIHtcblxuICAgIGNvbnN0IGNvbmZpZ0RlZmF1bHQgPSB0aGlzLmdldENvbnRlbnQoJy4uL2NvbmZpZy90ZXJuLWNvbmZpZy5qc29uJywgZmFsc2UpO1xuICAgIGNvbnN0IHBsdWdpbnNUZXJuID0gdGhpcy5nZXRDb250ZW50KCcuLi9jb25maWcvdGVybi1wbHVnaW5zLmpzb24nLCBmYWxzZSk7XG5cbiAgICBpZiAoIWNvbmZpZ0RlZmF1bHQpIHtcblxuICAgICAgY29uc29sZS5lcnJvcignQ291bGQgbm90IGxvYWQ6IHRlcm4tY29uZmlnLmpzb24nKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnByb2plY3RDb25maWcgPSB0aGlzLmdldENvbnRlbnQoJy8udGVybi1wcm9qZWN0JywgdHJ1ZSk7XG4gICAgdGhpcy5jb25maWcgPSB0aGlzLnByb2plY3RDb25maWcgfHwge307XG5cbiAgICBpZiAoIXRoaXMucHJvamVjdENvbmZpZykge1xuXG4gICAgICB0aGlzLnByb2plY3RDb25maWcgPSB7fTtcbiAgICAgIHRoaXMuY29uZmlnID0gY2xvbmUoY29uZmlnRGVmYXVsdCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmVwYXJlRWNtYShjb25maWdEZWZhdWx0KTtcbiAgICB0aGlzLnByZXBhcmVMaWJzKGNvbmZpZ0RlZmF1bHQpO1xuICAgIHRoaXMucHJlcGFyZVBsdWdpbnMocGx1Z2luc1Rlcm4pO1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5sb2FkRWFnZXJseSkge1xuXG4gICAgICB0aGlzLmNvbmZpZy5sb2FkRWFnZXJseSA9IFtdO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5jb25maWcuZG9udExvYWQpIHtcblxuICAgICAgdGhpcy5jb25maWcuZG9udExvYWQgPSBbXTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHJlbW92ZUVkaXRvcihlZGl0b3IpIHtcblxuICAgIGlmICghZWRpdG9yKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgaWR4ID0gdGhpcy5lZGl0b3JzLmluZGV4T2YoZWRpdG9yKTtcblxuICAgIGlmIChpZHggPT09IC0xKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmVkaXRvcnMuc3BsaWNlKGlkeCwgMSk7XG4gIH1cblxuXG4gIGRlc3Ryb3lFZGl0b3JzKCkge1xuXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCk7XG4gICAgICBidWZmZXIuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuZWRpdG9ycyA9IFtdO1xuICB9XG5cbiAgdXBkYXRlQ29uZmlnKCkge1xuXG4gICAgdGhpcy5jb25maWcubG9hZEVhZ2VybHkgPSBbXTtcbiAgICB0aGlzLmNvbmZpZy5kb250TG9hZCA9IFtdO1xuXG4gICAgZm9yIChsZXQgZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBsZXQgYnVmZmVyID0gZWRpdG9yLmdldE1vZGVsKCkuZ2V0QnVmZmVyKCk7XG4gICAgICBsZXQgdGV4dCA9IGJ1ZmZlci5nZXRUZXh0KCkudHJpbSgpO1xuXG4gICAgICBpZiAodGV4dCA9PT0gJycpIHtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25maWdbZWRpdG9yLl9fdGVybmpzX3NlY3Rpb25dLnB1c2godGV4dCk7XG4gICAgfVxuXG4gICAgdGhpcy5kZXN0cm95RWRpdG9ycygpO1xuXG4gICAgbGV0IG5ld0NvbmZpZyA9IHRoaXMuYnVpbGROZXdDb25maWcoKTtcbiAgICBsZXQgbmV3Q29uZmlnSlNPTiA9IEpTT04uc3RyaW5naWZ5KG5ld0NvbmZpZywgbnVsbCwgMik7XG5cbiAgICB1cGRhdGVUZXJuRmlsZShuZXdDb25maWdKU09OLCB0cnVlKTtcbiAgfVxuXG4gIGJ1aWxkTmV3Q29uZmlnKCkge1xuXG4gICAgbGV0IG5ld0NvbmZpZyA9IHt9O1xuXG4gICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmVjbWFWZXJzaW9ucykpIHtcblxuICAgICAgaWYgKHRoaXMuY29uZmlnLmVjbWFWZXJzaW9uc1trZXldKSB7XG5cbiAgICAgICAgbmV3Q29uZmlnLmVjbWFWZXJzaW9uID0gTnVtYmVyKGtleVtrZXkubGVuZ3RoIC0gMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoIWlzRW1wdHkodGhpcy5jb25maWcubGlicykpIHtcblxuICAgICAgbmV3Q29uZmlnLmxpYnMgPSBbXTtcblxuICAgICAgZm9yIChsZXQga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLmxpYnMpKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLmxpYnNba2V5XS5fYWN0aXZlKSB7XG5cbiAgICAgICAgICBuZXdDb25maWcubGlicy5wdXNoKGtleSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9hZEVhZ2VybHkubGVuZ3RoICE9PSAwKSB7XG5cbiAgICAgIG5ld0NvbmZpZy5sb2FkRWFnZXJseSA9IHRoaXMuY29uZmlnLmxvYWRFYWdlcmx5O1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbmZpZy5kb250TG9hZC5sZW5ndGggIT09IDApIHtcblxuICAgICAgbmV3Q29uZmlnLmRvbnRMb2FkID0gdGhpcy5jb25maWcuZG9udExvYWQ7XG4gICAgfVxuXG4gICAgaWYgKCFpc0VtcHR5KHRoaXMuY29uZmlnLnBsdWdpbnMpKSB7XG5cbiAgICAgIG5ld0NvbmZpZy5wbHVnaW5zID0ge307XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHRoaXMuY29uZmlnLnBsdWdpbnMpKSB7XG5cbiAgICAgICAgaWYgKHRoaXMuY29uZmlnLnBsdWdpbnNba2V5XS5fYWN0aXZlKSB7XG5cbiAgICAgICAgICBkZWxldGUgdGhpcy5jb25maWcucGx1Z2luc1trZXldLl9hY3RpdmU7XG4gICAgICAgICAgbmV3Q29uZmlnLnBsdWdpbnNba2V5XSA9IHRoaXMuY29uZmlnLnBsdWdpbnNba2V5XTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBuZXdDb25maWc7XG4gIH1cblxuICBpbml0Q29uZmlnVmlldygpIHtcblxuICAgIHRoaXMuY29uZmlnVmlldyA9IG5ldyBDb25maWdWaWV3KCk7XG4gICAgdGhpcy5jb25maWdWaWV3LmluaXRpYWxpemUodGhpcyk7XG5cbiAgICB0aGlzLmNvbmZpZ1BhbmVsID0gYXRvbS53b3Jrc3BhY2UuYWRkUmlnaHRQYW5lbCh7XG5cbiAgICAgIGl0ZW06IHRoaXMuY29uZmlnVmlldyxcbiAgICAgIHByaW9yaXR5OiAwXG4gICAgfSk7XG4gICAgdGhpcy5jb25maWdQYW5lbC5oaWRlKCk7XG5cbiAgICB0aGlzLnJlZ2lzdGVyRXZlbnRzKCk7XG4gIH1cblxuICBzaG93KCkge1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZ1ZpZXcpIHtcblxuICAgICAgdGhpcy5pbml0Q29uZmlnVmlldygpO1xuICAgIH1cblxuICAgIHRoaXMuY2xlYXIoKTtcblxuICAgIGlmICghdGhpcy5nYXRoZXJEYXRhKCkpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGF0b20udmlld3MuZ2V0Vmlldyh0aGlzLmNvbmZpZ1BhbmVsKS5jbGFzc0xpc3QuYWRkKCdhdG9tLXRlcm5qcy1jb25maWctcGFuZWwnKTtcblxuICAgIHRoaXMuY29uZmlnVmlldy5idWlsZE9wdGlvbnNNYXJrdXAoKTtcbiAgICB0aGlzLmNvbmZpZ1BhbmVsLnNob3coKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnVmlldykge1xuXG4gICAgICB0aGlzLmNvbmZpZ1ZpZXcuZGVzdHJveSgpO1xuICAgIH1cbiAgICB0aGlzLmNvbmZpZ1ZpZXcgPSB1bmRlZmluZWQ7XG5cbiAgICBpZiAodGhpcy5jb25maWdQYW5lbCkge1xuXG4gICAgICB0aGlzLmNvbmZpZ1BhbmVsLmRlc3Ryb3koKTtcbiAgICB9XG4gICAgdGhpcy5jb25maWdQYW5lbCA9IHVuZGVmaW5lZDtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgQ29uZmlnKCk7XG4iXX0=