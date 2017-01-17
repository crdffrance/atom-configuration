Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _atomTernjsManager = require('./atom-ternjs-manager');

var _atomTernjsManager2 = _interopRequireDefault(_atomTernjsManager);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _minimatch = require('minimatch');

var _minimatch2 = _interopRequireDefault(_minimatch);

var _nodeUuid = require('node-uuid');

var _nodeUuid2 = _interopRequireDefault(_nodeUuid);

var _resolveFrom = require('resolve-from');

var _resolveFrom2 = _interopRequireDefault(_resolveFrom);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

'use babel';

var Server = (function () {
  function Server(projectRoot, client) {
    _classCallCheck(this, Server);

    this.client = client;

    this.child = null;

    this.resolves = {};
    this.rejects = {};

    this.projectDir = projectRoot;
    this.distDir = _path2['default'].resolve(__dirname, '../node_modules/tern');

    this.defaultConfig = {

      libs: [],
      loadEagerly: false,
      plugins: {

        doc_comment: true
      },
      ecmaScript: true,
      ecmaVersion: 6,
      dependencyBudget: 20000
    };

    var homeDir = process.env.HOME || process.env.USERPROFILE;

    if (homeDir && _fs2['default'].existsSync(_path2['default'].resolve(homeDir, '.tern-config'))) {

      this.defaultConfig = this.readProjectFile(_path2['default'].resolve(homeDir, '.tern-config'));
    }

    this.projectFileName = '.tern-project';
    this.disableLoadingLocal = false;

    this.init();
  }

  _createClass(Server, [{
    key: 'init',
    value: function init() {
      var _this = this;

      if (!this.projectDir) {

        return;
      }

      this.config = this.readProjectFile(_path2['default'].resolve(this.projectDir, this.projectFileName));

      if (!this.config) {

        this.config = this.defaultConfig;
      }

      this.config.async = _atomTernjsPackageConfig2['default'].options.ternServerGetFileAsync;
      this.config.dependencyBudget = _atomTernjsPackageConfig2['default'].options.ternServerDependencyBudget;

      if (!this.config.plugins['doc_comment']) {

        this.config.plugins['doc_comment'] = true;
      }

      var defs = this.findDefs(this.projectDir, this.config);
      var plugins = this.loadPlugins(this.projectDir, this.config);
      var files = [];

      if (this.config.loadEagerly) {

        this.config.loadEagerly.forEach(function (pat) {

          _glob2['default'].sync(pat, { cwd: _this.projectDir }).forEach(function (file) {

            files.push(file);
          });
        });
      }

      this.child = _child_process2['default'].fork(_path2['default'].resolve(__dirname, './atom-ternjs-server-worker.js'));
      this.child.on('message', this.onWorkerMessage.bind(this));
      this.child.on('error', this.onError);
      this.child.on('disconnect', this.onDisconnect);
      this.child.send({

        type: 'init',
        dir: this.projectDir,
        config: this.config,
        defs: defs,
        plugins: plugins,
        files: files
      });
    }
  }, {
    key: 'onError',
    value: function onError(e) {

      atom.notifications.addError('Child process error: ' + e, {

        dismissable: true
      });
    }
  }, {
    key: 'onDisconnect',
    value: function onDisconnect(e) {

      console.warn(e);
    }
  }, {
    key: 'request',
    value: function request(type, data) {
      var _this2 = this;

      var requestID = _nodeUuid2['default'].v1();

      return new Promise(function (resolve, reject) {

        _this2.resolves[requestID] = resolve;
        _this2.rejects[requestID] = reject;

        _this2.child.send({

          type: type,
          id: requestID,
          data: data
        });
      });
    }
  }, {
    key: 'flush',
    value: function flush() {

      this.request('flush', {}).then(function () {

        atom.notifications.addInfo('All files fetched and analyzed.');
      });
    }
  }, {
    key: 'dontLoad',
    value: function dontLoad(file) {

      if (!this.config.dontLoad) {

        return;
      }

      return this.config.dontLoad.some(function (pat) {

        return (0, _minimatch2['default'])(file, pat);
      });
    }
  }, {
    key: 'onWorkerMessage',
    value: function onWorkerMessage(e) {

      if (e.error && e.error.isUncaughtException) {

        atom.notifications.addError('UncaughtException: ' + e.error.message + '. Restarting Server...', {

          dismissable: false
        });

        for (var key in this.rejects) {

          this.rejects[key]({});
        }

        this.resolves = {};
        this.rejects = {};

        _atomTernjsManager2['default'].restartServer();

        return;
      }

      var isError = e.error !== 'null' && e.error !== 'undefined';

      if (isError) {

        console.error(e);
      }

      if (!e.type && this.resolves[e.id]) {

        if (isError) {

          this.rejects[e.id](e.error);
        } else {

          this.resolves[e.id](e.data);
        }

        delete this.resolves[e.id];
        delete this.rejects[e.id];
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      if (!this.child) {

        return;
      }

      this.child.disconnect();
      this.child = undefined;
    }
  }, {
    key: 'readJSON',
    value: function readJSON(fileName) {

      if ((0, _atomTernjsHelper.fileExists)(fileName) !== undefined) {

        return false;
      }

      var file = _fs2['default'].readFileSync(fileName, 'utf8');

      try {

        return JSON.parse(file);
      } catch (e) {

        atom.notifications.addError('Bad JSON in ' + fileName + ': ' + e.message, {

          dismissable: true
        });
        this.destroy();
      }
    }
  }, {
    key: 'mergeObjects',
    value: function mergeObjects(base, value) {

      if (!base) {

        return value;
      }

      if (!value) {

        return base;
      }

      var result = {};

      for (var prop in base) {

        result[prop] = base[prop];
      }

      for (var prop in value) {

        result[prop] = value[prop];
      }

      return result;
    }
  }, {
    key: 'readProjectFile',
    value: function readProjectFile(fileName) {

      var data = this.readJSON(fileName);

      if (!data) {

        return false;
      }

      for (var option in this.defaultConfig) {

        if (!data.hasOwnProperty(option)) {

          data[option] = this.defaultConfig[option];
        } else if (option === 'plugins') {

          data[option] = this.mergeObjects(this.defaultConfig[option], data[option]);
        }
      }

      return data;
    }
  }, {
    key: 'findFile',
    value: function findFile(file, projectDir, fallbackDir) {

      var local = _path2['default'].resolve(projectDir, file);

      if (!this.disableLoadingLocal && _fs2['default'].existsSync(local)) {

        return local;
      }

      var shared = _path2['default'].resolve(fallbackDir, file);

      if (_fs2['default'].existsSync(shared)) {

        return shared;
      }
    }
  }, {
    key: 'findDefs',
    value: function findDefs(projectDir, config) {

      var defs = [];
      var src = config.libs.slice();

      if (config.ecmaScript && src.indexOf('ecmascript') === -1) {

        src.unshift('ecmascript');
      }

      for (var i = 0; i < src.length; ++i) {

        var file = src[i];

        if (!/\.json$/.test(file)) {

          file = file + '.json';
        }

        var found = this.findFile(file, projectDir, _path2['default'].resolve(this.distDir, 'defs')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + src[i]);

        if (!found) {

          try {

            found = require.resolve('tern-' + src[i]);
          } catch (e) {

            atom.notifications.addError('Failed to find library ' + src[i] + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        if (found) {

          defs.push(this.readJSON(found));
        }
      }

      return defs;
    }
  }, {
    key: 'loadPlugins',
    value: function loadPlugins(projectDir, config) {

      var plugins = config.plugins;
      var options = {};
      this.config.pluginImports = [];

      for (var plugin in plugins) {

        var val = plugins[plugin];

        if (!val) {

          continue;
        }

        var found = this.findFile(plugin + '.js', projectDir, _path2['default'].resolve(this.distDir, 'plugin')) || (0, _resolveFrom2['default'])(projectDir, 'tern-' + plugin);

        if (!found) {

          try {

            found = require.resolve('tern-' + plugin);
          } catch (e) {

            console.warn(e);
          }
        }

        if (!found) {

          try {

            found = require.resolve(this.projectDir + '/node_modules/tern-' + plugin);
          } catch (e) {

            atom.notifications.addError('Failed to find plugin ' + plugin + '\n', {

              dismissable: true
            });
            continue;
          }
        }

        this.config.pluginImports.push(found);
        options[_path2['default'].basename(plugin)] = val;
      }

      return options;
    }
  }]);

  return Server;
})();

exports['default'] = Server;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLXNlcnZlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O2lDQUVvQix1QkFBdUI7Ozs7Z0NBQ2xCLHNCQUFzQjs7a0JBQ2hDLElBQUk7Ozs7b0JBQ0YsTUFBTTs7OztvQkFDTixNQUFNOzs7OzZCQUNSLGVBQWU7Ozs7eUJBQ1IsV0FBVzs7Ozt3QkFDaEIsV0FBVzs7OzsyQkFDSixjQUFjOzs7O3VDQUNaLDhCQUE4Qjs7OztBQVh4RCxXQUFXLENBQUM7O0lBYVMsTUFBTTtBQUVkLFdBRlEsTUFBTSxDQUViLFdBQVcsRUFBRSxNQUFNLEVBQUU7MEJBRmQsTUFBTTs7QUFJdkIsUUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0FBRXJCLFFBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDOztBQUVsQixRQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztBQUNuQixRQUFJLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQzs7QUFFbEIsUUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFXLENBQUM7QUFDOUIsUUFBSSxDQUFDLE9BQU8sR0FBRyxrQkFBSyxPQUFPLENBQUMsU0FBUyxFQUFFLHNCQUFzQixDQUFDLENBQUM7O0FBRS9ELFFBQUksQ0FBQyxhQUFhLEdBQUc7O0FBRW5CLFVBQUksRUFBRSxFQUFFO0FBQ1IsaUJBQVcsRUFBRSxLQUFLO0FBQ2xCLGFBQU8sRUFBRTs7QUFFUCxtQkFBVyxFQUFFLElBQUk7T0FDbEI7QUFDRCxnQkFBVSxFQUFFLElBQUk7QUFDaEIsaUJBQVcsRUFBRSxDQUFDO0FBQ2Qsc0JBQWdCLEVBQUUsS0FBSztLQUN4QixDQUFDOztBQUVGLFFBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxJQUFJLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDOztBQUU1RCxRQUFJLE9BQU8sSUFBSSxn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OztBQUVWLGdCQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsNEJBQTBCLE1BQU0sU0FBTTs7QUFFL0QseUJBQVcsRUFBRSxJQUFJO2FBQ2xCLENBQUMsQ0FBQztBQUNILHFCQUFTO1dBQ1Y7U0FDRjs7QUFFRCxZQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdEMsZUFBTyxDQUFDLGtCQUFLLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLEdBQUcsQ0FBQztPQUN0Qzs7QUFFRCxhQUFPLE9BQU8sQ0FBQztLQUNoQjs7O1NBellrQixNQUFNOzs7cUJBQU4sTUFBTSIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL2xpYi9hdG9tLXRlcm5qcy1zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuaW1wb3J0IG1hbmFnZXIgZnJvbSAnLi9hdG9tLXRlcm5qcy1tYW5hZ2VyJztcbmltcG9ydCB7ZmlsZUV4aXN0c30gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IGZzIGZyb20gJ2ZzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGdsb2IgZnJvbSAnZ2xvYic7XG5pbXBvcnQgY3AgZnJvbSAnY2hpbGRfcHJvY2Vzcyc7XG5pbXBvcnQgbWluaW1hdGNoIGZyb20gJ21pbmltYXRjaCc7XG5pbXBvcnQgdXVpZCBmcm9tICdub2RlLXV1aWQnO1xuaW1wb3J0IHJlc29sdmVGcm9tIGZyb20gJ3Jlc29sdmUtZnJvbSc7XG5pbXBvcnQgcGFja2FnZUNvbmZpZyBmcm9tICcuL2F0b20tdGVybmpzLXBhY2thZ2UtY29uZmlnJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2VydmVyIHtcblxuICBjb25zdHJ1Y3Rvcihwcm9qZWN0Um9vdCwgY2xpZW50KSB7XG5cbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcblxuICAgIHRoaXMuY2hpbGQgPSBudWxsO1xuXG4gICAgdGhpcy5yZXNvbHZlcyA9IHt9O1xuICAgIHRoaXMucmVqZWN0cyA9IHt9O1xuXG4gICAgdGhpcy5wcm9qZWN0RGlyID0gcHJvamVjdFJvb3Q7XG4gICAgdGhpcy5kaXN0RGlyID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL25vZGVfbW9kdWxlcy90ZXJuJyk7XG5cbiAgICB0aGlzLmRlZmF1bHRDb25maWcgPSB7XG5cbiAgICAgIGxpYnM6IFtdLFxuICAgICAgbG9hZEVhZ2VybHk6IGZhbHNlLFxuICAgICAgcGx1Z2luczoge1xuXG4gICAgICAgIGRvY19jb21tZW50OiB0cnVlXG4gICAgICB9LFxuICAgICAgZWNtYVNjcmlwdDogdHJ1ZSxcbiAgICAgIGVjbWFWZXJzaW9uOiA2LFxuICAgICAgZGVwZW5kZW5jeUJ1ZGdldDogMjAwMDBcbiAgICB9O1xuXG4gICAgY29uc3QgaG9tZURpciA9IHByb2Nlc3MuZW52LkhPTUUgfHwgcHJvY2Vzcy5lbnYuVVNFUlBST0ZJTEU7XG5cbiAgICBpZiAoaG9tZURpciAmJiBmcy5leGlzdHNTeW5jKHBhdGgucmVzb2x2ZShob21lRGlyLCAnLnRlcm4tY29uZmlnJykpKSB7XG5cbiAgICAgIHRoaXMuZGVmYXVsdENvbmZpZyA9IHRoaXMucmVhZFByb2plY3RGaWxlKHBhdGgucmVzb2x2ZShob21lRGlyLCAnLnRlcm4tY29uZmlnJykpO1xuICAgIH1cblxuICAgIHRoaXMucHJvamVjdEZpbGVOYW1lID0gJy50ZXJuLXByb2plY3QnO1xuICAgIHRoaXMuZGlzYWJsZUxvYWRpbmdMb2NhbCA9IGZhbHNlO1xuXG4gICAgdGhpcy5pbml0KCk7XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgaWYgKCF0aGlzLnByb2plY3REaXIpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29uZmlnID0gdGhpcy5yZWFkUHJvamVjdEZpbGUocGF0aC5yZXNvbHZlKHRoaXMucHJvamVjdERpciwgdGhpcy5wcm9qZWN0RmlsZU5hbWUpKTtcblxuICAgIGlmICghdGhpcy5jb25maWcpIHtcblxuICAgICAgdGhpcy5jb25maWcgPSB0aGlzLmRlZmF1bHRDb25maWc7XG4gICAgfVxuXG4gICAgdGhpcy5jb25maWcuYXN5bmMgPSBwYWNrYWdlQ29uZmlnLm9wdGlvbnMudGVyblNlcnZlckdldEZpbGVBc3luYztcbiAgICB0aGlzLmNvbmZpZy5kZXBlbmRlbmN5QnVkZ2V0ID0gcGFja2FnZUNvbmZpZy5vcHRpb25zLnRlcm5TZXJ2ZXJEZXBlbmRlbmN5QnVkZ2V0O1xuXG4gICAgaWYgKCF0aGlzLmNvbmZpZy5wbHVnaW5zWydkb2NfY29tbWVudCddKSB7XG5cbiAgICAgIHRoaXMuY29uZmlnLnBsdWdpbnNbJ2RvY19jb21tZW50J10gPSB0cnVlO1xuICAgIH1cblxuICAgIGxldCBkZWZzID0gdGhpcy5maW5kRGVmcyh0aGlzLnByb2plY3REaXIsIHRoaXMuY29uZmlnKTtcbiAgICBsZXQgcGx1Z2lucyA9IHRoaXMubG9hZFBsdWdpbnModGhpcy5wcm9qZWN0RGlyLCB0aGlzLmNvbmZpZyk7XG4gICAgbGV0IGZpbGVzID0gW107XG5cbiAgICBpZiAodGhpcy5jb25maWcubG9hZEVhZ2VybHkpIHtcblxuICAgICAgdGhpcy5jb25maWcubG9hZEVhZ2VybHkuZm9yRWFjaCgocGF0KSA9PiB7XG5cbiAgICAgICAgZ2xvYi5zeW5jKHBhdCwgeyBjd2Q6IHRoaXMucHJvamVjdERpciB9KS5mb3JFYWNoKGZ1bmN0aW9uKGZpbGUpIHtcblxuICAgICAgICAgIGZpbGVzLnB1c2goZmlsZSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5jaGlsZCA9IGNwLmZvcmsocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vYXRvbS10ZXJuanMtc2VydmVyLXdvcmtlci5qcycpKTtcbiAgICB0aGlzLmNoaWxkLm9uKCdtZXNzYWdlJywgdGhpcy5vbldvcmtlck1lc3NhZ2UuYmluZCh0aGlzKSk7XG4gICAgdGhpcy5jaGlsZC5vbignZXJyb3InLCB0aGlzLm9uRXJyb3IpO1xuICAgIHRoaXMuY2hpbGQub24oJ2Rpc2Nvbm5lY3QnLCB0aGlzLm9uRGlzY29ubmVjdCk7XG4gICAgdGhpcy5jaGlsZC5zZW5kKHtcblxuICAgICAgdHlwZTogJ2luaXQnLFxuICAgICAgZGlyOiB0aGlzLnByb2plY3REaXIsXG4gICAgICBjb25maWc6IHRoaXMuY29uZmlnLFxuICAgICAgZGVmczogZGVmcyxcbiAgICAgIHBsdWdpbnM6IHBsdWdpbnMsXG4gICAgICBmaWxlczogZmlsZXNcbiAgICB9KTtcbiAgfVxuXG4gIG9uRXJyb3IoZSkge1xuXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBDaGlsZCBwcm9jZXNzIGVycm9yOiAke2V9YCwge1xuXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgIH0pO1xuICB9XG5cbiAgb25EaXNjb25uZWN0KGUpIHtcblxuICAgIGNvbnNvbGUud2FybihlKTtcbiAgfVxuXG4gIHJlcXVlc3QodHlwZSwgZGF0YSkge1xuXG4gICAgbGV0IHJlcXVlc3RJRCA9IHV1aWQudjEoKTtcblxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIHRoaXMucmVzb2x2ZXNbcmVxdWVzdElEXSA9IHJlc29sdmU7XG4gICAgICB0aGlzLnJlamVjdHNbcmVxdWVzdElEXSA9IHJlamVjdDtcblxuICAgICAgdGhpcy5jaGlsZC5zZW5kKHtcblxuICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICBpZDogcmVxdWVzdElELFxuICAgICAgICBkYXRhOiBkYXRhXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZsdXNoKCkge1xuXG4gICAgdGhpcy5yZXF1ZXN0KCdmbHVzaCcsIHt9KS50aGVuKCgpID0+IHtcblxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oJ0FsbCBmaWxlcyBmZXRjaGVkIGFuZCBhbmFseXplZC4nKTtcbiAgICB9KTtcbiAgfVxuXG4gIGRvbnRMb2FkKGZpbGUpIHtcblxuICAgIGlmICghdGhpcy5jb25maWcuZG9udExvYWQpIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLmNvbmZpZy5kb250TG9hZC5zb21lKChwYXQpID0+IHtcblxuICAgICAgcmV0dXJuIG1pbmltYXRjaChmaWxlLCBwYXQpO1xuICAgIH0pO1xuICB9XG5cbiAgb25Xb3JrZXJNZXNzYWdlKGUpIHtcblxuICAgIGlmIChlLmVycm9yICYmIGUuZXJyb3IuaXNVbmNhdWdodEV4Y2VwdGlvbikge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYFVuY2F1Z2h0RXhjZXB0aW9uOiAke2UuZXJyb3IubWVzc2FnZX0uIFJlc3RhcnRpbmcgU2VydmVyLi4uYCwge1xuXG4gICAgICAgIGRpc21pc3NhYmxlOiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMucmVqZWN0cykge1xuXG4gICAgICAgIHRoaXMucmVqZWN0c1trZXldKHt9KTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5yZXNvbHZlcyA9IHt9O1xuICAgICAgdGhpcy5yZWplY3RzID0ge307XG5cbiAgICAgIG1hbmFnZXIucmVzdGFydFNlcnZlcigpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaXNFcnJvciA9IGUuZXJyb3IgIT09ICdudWxsJyAmJiBlLmVycm9yICE9PSAndW5kZWZpbmVkJztcblxuICAgIGlmIChpc0Vycm9yKSB7XG5cbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgfVxuXG4gICAgaWYgKCFlLnR5cGUgJiYgdGhpcy5yZXNvbHZlc1tlLmlkXSkge1xuXG4gICAgICBpZiAoaXNFcnJvcikge1xuXG4gICAgICAgIHRoaXMucmVqZWN0c1tlLmlkXShlLmVycm9yKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLnJlc29sdmVzW2UuaWRdKGUuZGF0YSk7XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSB0aGlzLnJlc29sdmVzW2UuaWRdO1xuICAgICAgZGVsZXRlIHRoaXMucmVqZWN0c1tlLmlkXTtcbiAgICB9XG4gIH1cblxuICBkZXN0cm95KCkge1xuXG4gICAgaWYgKCF0aGlzLmNoaWxkKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNoaWxkLmRpc2Nvbm5lY3QoKTtcbiAgICB0aGlzLmNoaWxkID0gdW5kZWZpbmVkO1xuICB9XG5cbiAgcmVhZEpTT04oZmlsZU5hbWUpIHtcblxuICAgIGlmIChmaWxlRXhpc3RzKGZpbGVOYW1lKSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgZmlsZSA9IGZzLnJlYWRGaWxlU3luYyhmaWxlTmFtZSwgJ3V0ZjgnKTtcblxuICAgIHRyeSB7XG5cbiAgICAgIHJldHVybiBKU09OLnBhcnNlKGZpbGUpO1xuXG4gICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYEJhZCBKU09OIGluICR7ZmlsZU5hbWV9OiAke2UubWVzc2FnZX1gLCB7XG5cbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgIH0pO1xuICAgICAgdGhpcy5kZXN0cm95KCk7XG4gICAgfVxuICB9XG5cbiAgbWVyZ2VPYmplY3RzKGJhc2UsIHZhbHVlKSB7XG5cbiAgICBpZiAoIWJhc2UpIHtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cblxuICAgIGlmICghdmFsdWUpIHtcblxuICAgICAgcmV0dXJuIGJhc2U7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdCA9IHt9O1xuXG4gICAgZm9yIChjb25zdCBwcm9wIGluIGJhc2UpIHtcblxuICAgICAgcmVzdWx0W3Byb3BdID0gYmFzZVtwcm9wXTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHByb3AgaW4gdmFsdWUpIHtcblxuICAgICAgcmVzdWx0W3Byb3BdID0gdmFsdWVbcHJvcF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIHJlYWRQcm9qZWN0RmlsZShmaWxlTmFtZSkge1xuXG4gICAgbGV0IGRhdGEgPSB0aGlzLnJlYWRKU09OKGZpbGVOYW1lKTtcblxuICAgIGlmICghZGF0YSkge1xuXG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgZm9yICh2YXIgb3B0aW9uIGluIHRoaXMuZGVmYXVsdENvbmZpZykge1xuXG4gICAgICBpZiAoIWRhdGEuaGFzT3duUHJvcGVydHkob3B0aW9uKSkge1xuXG4gICAgICAgIGRhdGFbb3B0aW9uXSA9IHRoaXMuZGVmYXVsdENvbmZpZ1tvcHRpb25dO1xuXG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbiA9PT0gJ3BsdWdpbnMnKSB7XG5cbiAgICAgICAgZGF0YVtvcHRpb25dID0gdGhpcy5tZXJnZU9iamVjdHModGhpcy5kZWZhdWx0Q29uZmlnW29wdGlvbl0sIGRhdGFbb3B0aW9uXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cblxuICBmaW5kRmlsZShmaWxlLCBwcm9qZWN0RGlyLCBmYWxsYmFja0Rpcikge1xuXG4gICAgbGV0IGxvY2FsID0gcGF0aC5yZXNvbHZlKHByb2plY3REaXIsIGZpbGUpO1xuXG4gICAgaWYgKCF0aGlzLmRpc2FibGVMb2FkaW5nTG9jYWwgJiYgZnMuZXhpc3RzU3luYyhsb2NhbCkpIHtcblxuICAgICAgcmV0dXJuIGxvY2FsO1xuICAgIH1cblxuICAgIGxldCBzaGFyZWQgPSBwYXRoLnJlc29sdmUoZmFsbGJhY2tEaXIsIGZpbGUpO1xuXG4gICAgaWYgKGZzLmV4aXN0c1N5bmMoc2hhcmVkKSkge1xuXG4gICAgICByZXR1cm4gc2hhcmVkO1xuICAgIH1cbiAgfVxuXG4gIGZpbmREZWZzKHByb2plY3REaXIsIGNvbmZpZykge1xuXG4gICAgbGV0IGRlZnMgPSBbXTtcbiAgICBsZXQgc3JjID0gY29uZmlnLmxpYnMuc2xpY2UoKTtcblxuICAgIGlmIChjb25maWcuZWNtYVNjcmlwdCAmJiBzcmMuaW5kZXhPZignZWNtYXNjcmlwdCcpID09PSAtMSkge1xuXG4gICAgICBzcmMudW5zaGlmdCgnZWNtYXNjcmlwdCcpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc3JjLmxlbmd0aDsgKytpKSB7XG5cbiAgICAgIGxldCBmaWxlID0gc3JjW2ldO1xuXG4gICAgICBpZiAoIS9cXC5qc29uJC8udGVzdChmaWxlKSkge1xuXG4gICAgICAgIGZpbGUgPSBgJHtmaWxlfS5qc29uYDtcbiAgICAgIH1cblxuICAgICAgbGV0IGZvdW5kID1cbiAgICAgICAgdGhpcy5maW5kRmlsZShmaWxlLCBwcm9qZWN0RGlyLCBwYXRoLnJlc29sdmUodGhpcy5kaXN0RGlyLCAnZGVmcycpKSB8fFxuICAgICAgICByZXNvbHZlRnJvbShwcm9qZWN0RGlyLCBgdGVybi0ke3NyY1tpXX1gKVxuICAgICAgICA7XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYHRlcm4tJHtzcmNbaV19YCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKGBGYWlsZWQgdG8gZmluZCBsaWJyYXJ5ICR7c3JjW2ldfVxcbmAsIHtcblxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZm91bmQpIHtcblxuICAgICAgICBkZWZzLnB1c2godGhpcy5yZWFkSlNPTihmb3VuZCkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBkZWZzO1xuICB9XG5cbiAgbG9hZFBsdWdpbnMocHJvamVjdERpciwgY29uZmlnKSB7XG5cbiAgICBsZXQgcGx1Z2lucyA9IGNvbmZpZy5wbHVnaW5zO1xuICAgIGxldCBvcHRpb25zID0ge307XG4gICAgdGhpcy5jb25maWcucGx1Z2luSW1wb3J0cyA9IFtdO1xuXG4gICAgZm9yIChsZXQgcGx1Z2luIGluIHBsdWdpbnMpIHtcblxuICAgICAgbGV0IHZhbCA9IHBsdWdpbnNbcGx1Z2luXTtcblxuICAgICAgaWYgKCF2YWwpIHtcblxuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cblxuICAgICAgbGV0IGZvdW5kID1cbiAgICAgICAgdGhpcy5maW5kRmlsZShgJHtwbHVnaW59LmpzYCwgcHJvamVjdERpciwgcGF0aC5yZXNvbHZlKHRoaXMuZGlzdERpciwgJ3BsdWdpbicpKSB8fFxuICAgICAgICByZXNvbHZlRnJvbShwcm9qZWN0RGlyLCBgdGVybi0ke3BsdWdpbn1gKVxuICAgICAgICA7XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYHRlcm4tJHtwbHVnaW59YCk7XG5cbiAgICAgICAgfSBjYXRjaCAoZSkge1xuXG4gICAgICAgICAgY29uc29sZS53YXJuKGUpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmICghZm91bmQpIHtcblxuICAgICAgICB0cnkge1xuXG4gICAgICAgICAgZm91bmQgPSByZXF1aXJlLnJlc29sdmUoYCR7dGhpcy5wcm9qZWN0RGlyfS9ub2RlX21vZHVsZXMvdGVybi0ke3BsdWdpbn1gKTtcblxuICAgICAgICB9IGNhdGNoIChlKSB7XG5cbiAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoYEZhaWxlZCB0byBmaW5kIHBsdWdpbiAke3BsdWdpbn1cXG5gLCB7XG5cbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5jb25maWcucGx1Z2luSW1wb3J0cy5wdXNoKGZvdW5kKTtcbiAgICAgIG9wdGlvbnNbcGF0aC5iYXNlbmFtZShwbHVnaW4pXSA9IHZhbDtcbiAgICB9XG5cbiAgICByZXR1cm4gb3B0aW9ucztcbiAgfVxufVxuIl19