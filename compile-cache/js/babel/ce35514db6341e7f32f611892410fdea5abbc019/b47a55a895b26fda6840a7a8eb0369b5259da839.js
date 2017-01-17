Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _underscorePlus = require('underscore-plus');

var _atomTernjsEvents = require('./atom-ternjs-events');

var _atomTernjsEvents2 = _interopRequireDefault(_atomTernjsEvents);

var _atomTernjsDocumentation = require('./atom-ternjs-documentation');

var _atomTernjsDocumentation2 = _interopRequireDefault(_atomTernjsDocumentation);

var _atomTernjsReference = require('./atom-ternjs-reference');

var _atomTernjsReference2 = _interopRequireDefault(_atomTernjsReference);

var _atomTernjsPackageConfig = require('./atom-ternjs-package-config');

var _atomTernjsPackageConfig2 = _interopRequireDefault(_atomTernjsPackageConfig);

var _atomTernjsType = require('./atom-ternjs-type');

var _atomTernjsType2 = _interopRequireDefault(_atomTernjsType);

var _atomTernjsConfig = require('./atom-ternjs-config');

var _atomTernjsConfig2 = _interopRequireDefault(_atomTernjsConfig);

var _atomTernjsHelper = require('./atom-ternjs-helper');

var _atomTernjsProvider = require('./atom-ternjs-provider');

var _atomTernjsProvider2 = _interopRequireDefault(_atomTernjsProvider);

var _atomTernjsRename = require('./atom-ternjs-rename');

var _atomTernjsRename2 = _interopRequireDefault(_atomTernjsRename);

'use babel';

var Server = require('./atom-ternjs-server');
var Client = require('./atom-ternjs-client');

var Manager = (function () {
  function Manager() {
    _classCallCheck(this, Manager);

    this.initCalled = false;
    this.initialised = false;

    this.disposables = [];
    this.grammars = ['JavaScript', 'Babel ES6 JavaScript'];

    this.clients = [];
    this.client = undefined;
    this.servers = [];
    this.server = undefined;

    this.editors = [];
  }

  _createClass(Manager, [{
    key: 'init',
    value: function init() {
      var _this = this;

      _atomTernjsPackageConfig2['default'].registerEvents();
      this.initServers();

      this.disposables.push(atom.project.onDidChangePaths(function (paths) {

        _this.destroyServer(paths);
        _this.checkPaths(paths);
        _this.setActiveServerAndClient();
      }));

      this.initCalled = true;
    }
  }, {
    key: 'activate',
    value: function activate() {

      this.initialised = true;
      this.registerEvents();
      this.registerCommands();
    }
  }, {
    key: 'destroy',
    value: function destroy() {

      (0, _atomTernjsHelper.disposeAll)(this.disposables);

      for (var server of this.servers) {

        server.destroy();
        server = undefined;
      }
      this.servers = [];
      this.clients = [];

      this.server = undefined;
      this.client = undefined;

      _atomTernjsDocumentation2['default'] && _atomTernjsDocumentation2['default'].destroy();
      _atomTernjsReference2['default'] && _atomTernjsReference2['default'].destroy();
      _atomTernjsType2['default'] && _atomTernjsType2['default'].destroy();
      _atomTernjsPackageConfig2['default'] && _atomTernjsPackageConfig2['default'].destroy();
      _atomTernjsRename2['default'] && _atomTernjsRename2['default'].destroy();
      _atomTernjsConfig2['default'] && _atomTernjsConfig2['default'].destroy();
      _atomTernjsProvider2['default'] && _atomTernjsProvider2['default'].destroy();

      this.initialised = false;
      this.initCalled = false;
    }
  }, {
    key: 'initServers',
    value: function initServers() {
      var _this2 = this;

      var projectDirectories = atom.project.getDirectories();

      projectDirectories.forEach(function (projectDirectory) {

        var directory = atom.project.relativizePath(projectDirectory.path)[0];

        if ((0, _atomTernjsHelper.isDirectory)(directory)) {

          _this2.startServer(directory);
        }
      });
    }
  }, {
    key: 'startServer',
    value: function startServer(dir) {

      if (this.getServerForProject(dir)) {

        return;
      }

      var client = this.getClientForProject(dir);

      if (!client) {

        var clientIdx = this.clients.push(new Client(dir)) - 1;
        client = this.clients[clientIdx];
      }

      this.servers.push(new Server(dir, client));

      if (this.servers.length === this.clients.length) {

        if (!this.initialised) {

          this.activate();
        }

        this.setActiveServerAndClient(dir);
      }
    }
  }, {
    key: 'setActiveServerAndClient',
    value: function setActiveServerAndClient(URI) {

      if (!URI) {

        var activePane = atom.workspace.getActivePaneItem();

        if (activePane && activePane.getURI) {

          URI = activePane.getURI();
        } else {

          this.server = undefined;
          this.client = undefined;

          return;
        }
      }

      var dir = atom.project.relativizePath(URI)[0];
      var server = this.getServerForProject(dir);
      var client = this.getClientForProject(dir);

      if (server && client) {

        this.server = server;
        _atomTernjsConfig2['default'].gatherData();
        this.client = client;
      } else {

        this.server = undefined;
        _atomTernjsConfig2['default'].clear();
        this.client = undefined;
      }
    }
  }, {
    key: 'checkPaths',
    value: function checkPaths(paths) {

      for (var path of paths) {

        var dir = atom.project.relativizePath(path)[0];

        if ((0, _atomTernjsHelper.isDirectory)(dir)) {

          this.startServer(dir);
        }
      }
    }
  }, {
    key: 'destroyServer',
    value: function destroyServer(paths) {

      if (this.servers.length === 0) {

        return;
      }

      var serverIdx = undefined;

      for (var i = 0; i < this.servers.length; i++) {

        if (paths.indexOf(this.servers[i].projectDir) === -1) {

          serverIdx = i;
          break;
        }
      }

      if (serverIdx === undefined) {

        return;
      }

      var server = this.servers[serverIdx];
      var client = this.getClientForProject(server.projectDir);
      client = undefined;

      server.destroy();
      server = undefined;

      this.servers.splice(serverIdx, 1);
    }
  }, {
    key: 'getServerForProject',
    value: function getServerForProject(projectDir) {

      for (var server of this.servers) {

        if (server.projectDir === projectDir) {

          return server;
        }
      }

      return false;
    }
  }, {
    key: 'getClientForProject',
    value: function getClientForProject(projectDir) {

      for (var client of this.clients) {

        if (client.projectDir === projectDir) {

          return client;
        }
      }

      return false;
    }
  }, {
    key: 'getEditor',
    value: function getEditor(editor) {

      for (var _editor of this.editors) {

        if (_editor.id === editor.id) {

          return _editor;
        }
      }
    }
  }, {
    key: 'isValidEditor',
    value: function isValidEditor(editor) {

      if (!editor || !editor.getGrammar || editor.mini) {

        return;
      }

      if (!editor.getGrammar()) {

        return;
      }

      if (this.grammars.indexOf(editor.getGrammar().name) === -1) {

        return false;
      }

      return true;
    }
  }, {
    key: 'onDidChangeCursorPosition',
    value: function onDidChangeCursorPosition(editor, e) {

      if (_atomTernjsPackageConfig2['default'].options.inlineFnCompletion) {

        _atomTernjsType2['default'].queryType(editor, e.cursor);
      }
    }
  }, {
    key: 'registerEvents',
    value: function registerEvents() {
      var _this3 = this;

      this.disposables.push(atom.workspace.observeTextEditors(function (editor) {

        if (!_this3.isValidEditor(editor)) {

          return;
        }

        // Register valid editor
        _this3.editors.push({

          id: editor.id,
          diffs: []
        });

        if (!_this3.initCalled) {

          _this3.init();
        }

        var editorView = atom.views.getView(editor);

        if (editorView) {

          _this3.disposables.push(editorView.addEventListener('click', function (e) {

            if (!e[_atomTernjsHelper.accessKey] || editor.getSelectedText() !== '') {

              return;
            }

            if (_this3.client) {

              _this3.client.definition();
            }
          }));
        }

        var scrollView = undefined;

        if (!editorView.shadowRoot) {

          scrollView = editorView.querySelector('.scroll-view');
        } else {

          scrollView = editorView.shadowRoot.querySelector('.scroll-view');
        }

        if (scrollView) {

          _this3.disposables.push(scrollView.addEventListener('mousemove', function (e) {

            if (!e[_atomTernjsHelper.accessKey]) {

              return;
            }

            if (e.target.classList.contains('line')) {

              return;
            }

            e.target.classList.add('atom-ternjs-hover');
          }));

          _this3.disposables.push(scrollView.addEventListener('mouseout', function (e) {

            e.target.classList.remove('atom-ternjs-hover');
          }));
        }

        _this3.disposables.push(editor.onDidChangeCursorPosition(function (e) {

          _atomTernjsEvents2['default'].emit('type-destroy-overlay');
          _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        }));

        _this3.disposables.push(editor.onDidChangeCursorPosition((0, _underscorePlus.debounce)(_this3.onDidChangeCursorPosition.bind(_this3, editor), 300)));

        _this3.disposables.push(editor.getBuffer().onDidSave(function (e) {

          if (_this3.client) {

            _this3.client.update(editor);
          }
        }));

        _this3.disposables.push(editor.getBuffer().onDidChange(function (e) {

          _this3.getEditor(editor).diffs.push(e);
        }));
      }));

      this.disposables.push(atom.workspace.onDidChangeActivePaneItem(function (item) {

        _atomTernjsEvents2['default'].emit('config-clear');
        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('rename-hide');

        if (!_this3.isValidEditor(item)) {

          _atomTernjsEvents2['default'].emit('reference-hide');
        } else {

          _this3.setActiveServerAndClient(item.getURI());
        }
      }));
    }
  }, {
    key: 'registerCommands',
    value: function registerCommands() {
      var _this4 = this;

      this.disposables.push(atom.commands.add('atom-text-editor', 'core:cancel', function (e) {

        _atomTernjsEvents2['default'].emit('config-clear');
        _atomTernjsEvents2['default'].emit('type-destroy-overlay');
        _atomTernjsEvents2['default'].emit('documentation-destroy-overlay');
        _atomTernjsEvents2['default'].emit('reference-hide');
        _atomTernjsEvents2['default'].emit('rename-hide');
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:listFiles', function (e) {

        if (_this4.client) {

          _this4.client.files().then(function (data) {

            console.dir(data);
          });
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:flush', function (e) {

        if (_this4.server) {

          _this4.server.flush();
        }
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:markerCheckpointBack', function (e) {

        (0, _atomTernjsHelper.markerCheckpointBack)();
      }));

      this.disposables.push(atom.commands.add('atom-text-editor', 'atom-ternjs:definition', function (e) {

        if (_this4.client) {

          _this4.client.definition();
        }
      }));

      this.disposables.push(atom.commands.add('atom-workspace', 'atom-ternjs:restart', function (e) {

        _this4.restartServer();
      }));
    }
  }, {
    key: 'restartServer',
    value: function restartServer() {

      if (!this.server) {

        return;
      }

      var dir = this.server.projectDir;
      var serverIdx = undefined;

      for (var i = 0; i < this.servers.length; i++) {

        if (dir === this.servers[i].projectDir) {

          serverIdx = i;
          break;
        }
      }

      if (this.server) {

        this.server.destroy();
      }

      this.server = undefined;
      this.servers.splice(serverIdx, 1);
      this.startServer(dir);
    }
  }]);

  return Manager;
})();

exports['default'] = new Manager();
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2F0b20tdGVybmpzLW1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs4QkFLdUIsaUJBQWlCOztnQ0FDcEIsc0JBQXNCOzs7O3VDQUNoQiw2QkFBNkI7Ozs7bUNBQ2pDLHlCQUF5Qjs7Ozt1Q0FDckIsOEJBQThCOzs7OzhCQUN2QyxvQkFBb0I7Ozs7Z0NBQ2xCLHNCQUFzQjs7OztnQ0FNbEMsc0JBQXNCOztrQ0FDUix3QkFBd0I7Ozs7Z0NBQzFCLHNCQUFzQjs7OztBQW5CekMsV0FBVyxDQUFDOztBQUVaLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQy9DLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDOztJQWtCekMsT0FBTztBQUVBLFdBRlAsT0FBTyxHQUVHOzBCQUZWLE9BQU87O0FBSVQsUUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7QUFDeEIsUUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7O0FBRXpCLFFBQUksQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0FBQ3RCLFFBQUksQ0FBQyxRQUFRLEdBQUcsQ0FDZCxZQUFZLEVBQ1osc0JBQXNCLENBQ3ZCLENBQUM7O0FBRUYsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7QUFDeEIsUUFBSSxDQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxDQUFDLE1BQU0sR0FBRyxTQUFTLENBQUM7O0FBRXhCLFFBQUksQ0FBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO0dBQ25COztlQW5CRyxPQUFPOztXQXFCUCxnQkFBRzs7O0FBRUwsMkNBQWMsY0FBYyxFQUFFLENBQUM7QUFDL0IsVUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDOztBQUVuQixVQUFJ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Q0FBQyxDQUFDOztBQUVKLFVBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLHFCQUFxQixFQUFFLFVBQUMsQ0FBQyxFQUFLOztBQUV0RixlQUFLLGFBQWEsRUFBRSxDQUFDO09BQ3RCLENBQUMsQ0FBQyxDQUFDO0tBQ0w7OztXQUVZLHlCQUFHOztBQUVkLFVBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFOztBQUVoQixlQUFPO09BQ1I7O0FBRUQsVUFBSSxHQUFHLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUM7QUFDakMsVUFBSSxTQUFTLFlBQUEsQ0FBQzs7QUFFZCxXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7O0FBRTVDLFlBQUksR0FBRyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxFQUFFOztBQUV0QyxtQkFBUyxHQUFHLENBQUMsQ0FBQztBQUNkLGdCQUFNO1NBQ1A7T0FDRjs7QUFFRCxVQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7O0FBRWYsWUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztPQUN2Qjs7QUFFRCxVQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztBQUN4QixVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbEMsVUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUN2Qjs7O1NBcmNHLE9BQU87OztxQkF3Y0UsSUFBSSxPQUFPLEVBQUUiLCJmaWxlIjoiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9saWIvYXRvbS10ZXJuanMtbWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5jb25zdCBTZXJ2ZXIgPSByZXF1aXJlKCcuL2F0b20tdGVybmpzLXNlcnZlcicpO1xuY29uc3QgQ2xpZW50ID0gcmVxdWlyZSgnLi9hdG9tLXRlcm5qcy1jbGllbnQnKTtcblxuaW1wb3J0IHtkZWJvdW5jZX0gZnJvbSAndW5kZXJzY29yZS1wbHVzJztcbmltcG9ydCBlbWl0dGVyIGZyb20gJy4vYXRvbS10ZXJuanMtZXZlbnRzJztcbmltcG9ydCBkb2N1bWVudGF0aW9uIGZyb20gJy4vYXRvbS10ZXJuanMtZG9jdW1lbnRhdGlvbic7XG5pbXBvcnQgcmVmZXJlbmNlIGZyb20gJy4vYXRvbS10ZXJuanMtcmVmZXJlbmNlJztcbmltcG9ydCBwYWNrYWdlQ29uZmlnIGZyb20gJy4vYXRvbS10ZXJuanMtcGFja2FnZS1jb25maWcnO1xuaW1wb3J0IHR5cGUgZnJvbSAnLi9hdG9tLXRlcm5qcy10eXBlJztcbmltcG9ydCBjb25maWcgZnJvbSAnLi9hdG9tLXRlcm5qcy1jb25maWcnO1xuaW1wb3J0IHtcbiAgYWNjZXNzS2V5LFxuICBpc0RpcmVjdG9yeSxcbiAgbWFya2VyQ2hlY2twb2ludEJhY2ssXG4gIGRpc3Bvc2VBbGxcbn0gZnJvbSAnLi9hdG9tLXRlcm5qcy1oZWxwZXInO1xuaW1wb3J0IHByb3ZpZGVyIGZyb20gJy4vYXRvbS10ZXJuanMtcHJvdmlkZXInO1xuaW1wb3J0IHJlbmFtZSBmcm9tICcuL2F0b20tdGVybmpzLXJlbmFtZSc7XG5cbmNsYXNzIE1hbmFnZXIge1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuXG4gICAgdGhpcy5pbml0Q2FsbGVkID0gZmFsc2U7XG4gICAgdGhpcy5pbml0aWFsaXNlZCA9IGZhbHNlO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcyA9IFtdO1xuICAgIHRoaXMuZ3JhbW1hcnMgPSBbXG4gICAgICAnSmF2YVNjcmlwdCcsXG4gICAgICAnQmFiZWwgRVM2IEphdmFTY3JpcHQnXG4gICAgXTtcblxuICAgIHRoaXMuY2xpZW50cyA9IFtdO1xuICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2VydmVycyA9IFtdO1xuICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuXG4gICAgdGhpcy5lZGl0b3JzID0gW107XG4gIH1cblxuICBpbml0KCkge1xuXG4gICAgcGFja2FnZUNvbmZpZy5yZWdpc3RlckV2ZW50cygpO1xuICAgIHRoaXMuaW5pdFNlcnZlcnMoKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLnByb2plY3Qub25EaWRDaGFuZ2VQYXRocygocGF0aHMpID0+IHtcblxuICAgICAgdGhpcy5kZXN0cm95U2VydmVyKHBhdGhzKTtcbiAgICAgIHRoaXMuY2hlY2tQYXRocyhwYXRocyk7XG4gICAgICB0aGlzLnNldEFjdGl2ZVNlcnZlckFuZENsaWVudCgpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuaW5pdENhbGxlZCA9IHRydWU7XG4gIH1cblxuICBhY3RpdmF0ZSgpIHtcblxuICAgIHRoaXMuaW5pdGlhbGlzZWQgPSB0cnVlO1xuICAgIHRoaXMucmVnaXN0ZXJFdmVudHMoKTtcbiAgICB0aGlzLnJlZ2lzdGVyQ29tbWFuZHMoKTtcbiAgfVxuXG4gIGRlc3Ryb3koKSB7XG5cbiAgICBkaXNwb3NlQWxsKHRoaXMuZGlzcG9zYWJsZXMpO1xuXG4gICAgZm9yIChsZXQgc2VydmVyIG9mIHRoaXMuc2VydmVycykge1xuXG4gICAgICBzZXJ2ZXIuZGVzdHJveSgpO1xuICAgICAgc2VydmVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICB0aGlzLnNlcnZlcnMgPSBbXTtcbiAgICB0aGlzLmNsaWVudHMgPSBbXTtcblxuICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgZG9jdW1lbnRhdGlvbiAmJiBkb2N1bWVudGF0aW9uLmRlc3Ryb3koKTtcbiAgICByZWZlcmVuY2UgJiYgcmVmZXJlbmNlLmRlc3Ryb3koKTtcbiAgICB0eXBlICYmIHR5cGUuZGVzdHJveSgpO1xuICAgIHBhY2thZ2VDb25maWcgJiYgcGFja2FnZUNvbmZpZy5kZXN0cm95KCk7XG4gICAgcmVuYW1lICYmIHJlbmFtZS5kZXN0cm95KCk7XG4gICAgY29uZmlnICYmIGNvbmZpZy5kZXN0cm95KCk7XG4gICAgcHJvdmlkZXIgJiYgcHJvdmlkZXIuZGVzdHJveSgpO1xuXG4gICAgdGhpcy5pbml0aWFsaXNlZCA9IGZhbHNlO1xuICAgIHRoaXMuaW5pdENhbGxlZCA9IGZhbHNlO1xuICB9XG5cbiAgaW5pdFNlcnZlcnMoKSB7XG5cbiAgICBjb25zdCBwcm9qZWN0RGlyZWN0b3JpZXMgPSBhdG9tLnByb2plY3QuZ2V0RGlyZWN0b3JpZXMoKTtcblxuICAgIHByb2plY3REaXJlY3Rvcmllcy5mb3JFYWNoKChwcm9qZWN0RGlyZWN0b3J5KSA9PiB7XG5cbiAgICAgIGNvbnN0IGRpcmVjdG9yeSA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwcm9qZWN0RGlyZWN0b3J5LnBhdGgpWzBdO1xuXG4gICAgICBpZiAoaXNEaXJlY3RvcnkoZGlyZWN0b3J5KSkge1xuXG4gICAgICAgIHRoaXMuc3RhcnRTZXJ2ZXIoZGlyZWN0b3J5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHN0YXJ0U2VydmVyKGRpcikge1xuXG4gICAgaWYgKHRoaXMuZ2V0U2VydmVyRm9yUHJvamVjdChkaXIpKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY2xpZW50ID0gdGhpcy5nZXRDbGllbnRGb3JQcm9qZWN0KGRpcik7XG5cbiAgICBpZiAoIWNsaWVudCkge1xuXG4gICAgICBsZXQgY2xpZW50SWR4ID0gdGhpcy5jbGllbnRzLnB1c2gobmV3IENsaWVudChkaXIpKSAtIDE7XG4gICAgICBjbGllbnQgPSB0aGlzLmNsaWVudHNbY2xpZW50SWR4XTtcbiAgICB9XG5cbiAgICB0aGlzLnNlcnZlcnMucHVzaChuZXcgU2VydmVyKGRpciwgY2xpZW50KSk7XG5cbiAgICBpZiAodGhpcy5zZXJ2ZXJzLmxlbmd0aCA9PT0gdGhpcy5jbGllbnRzLmxlbmd0aCkge1xuXG4gICAgICBpZiAoIXRoaXMuaW5pdGlhbGlzZWQpIHtcblxuICAgICAgICB0aGlzLmFjdGl2YXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KGRpcik7XG4gICAgfVxuICB9XG5cbiAgc2V0QWN0aXZlU2VydmVyQW5kQ2xpZW50KFVSSSkge1xuXG4gICAgaWYgKCFVUkkpIHtcblxuICAgICAgbGV0IGFjdGl2ZVBhbmUgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVQYW5lSXRlbSgpO1xuXG4gICAgICBpZiAoYWN0aXZlUGFuZSAmJiBhY3RpdmVQYW5lLmdldFVSSSkge1xuXG4gICAgICAgIFVSSSA9IGFjdGl2ZVBhbmUuZ2V0VVJJKCk7XG5cbiAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgZGlyID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKFVSSSlbMF07XG4gICAgbGV0IHNlcnZlciA9IHRoaXMuZ2V0U2VydmVyRm9yUHJvamVjdChkaXIpO1xuICAgIGxldCBjbGllbnQgPSB0aGlzLmdldENsaWVudEZvclByb2plY3QoZGlyKTtcblxuICAgIGlmIChzZXJ2ZXIgJiYgY2xpZW50KSB7XG5cbiAgICAgIHRoaXMuc2VydmVyID0gc2VydmVyO1xuICAgICAgY29uZmlnLmdhdGhlckRhdGEoKTtcbiAgICAgIHRoaXMuY2xpZW50ID0gY2xpZW50O1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgdGhpcy5zZXJ2ZXIgPSB1bmRlZmluZWQ7XG4gICAgICBjb25maWcuY2xlYXIoKTtcbiAgICAgIHRoaXMuY2xpZW50ID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrUGF0aHMocGF0aHMpIHtcblxuICAgIGZvciAobGV0IHBhdGggb2YgcGF0aHMpIHtcblxuICAgICAgbGV0IGRpciA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChwYXRoKVswXTtcblxuICAgICAgaWYgKGlzRGlyZWN0b3J5KGRpcikpIHtcblxuICAgICAgICB0aGlzLnN0YXJ0U2VydmVyKGRpcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZGVzdHJveVNlcnZlcihwYXRocykge1xuXG4gICAgaWYgKHRoaXMuc2VydmVycy5sZW5ndGggPT09IDApIHtcblxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBzZXJ2ZXJJZHg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuc2VydmVycy5sZW5ndGg7IGkrKykge1xuXG4gICAgICBpZiAocGF0aHMuaW5kZXhPZih0aGlzLnNlcnZlcnNbaV0ucHJvamVjdERpcikgPT09IC0xKSB7XG5cbiAgICAgICAgc2VydmVySWR4ID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHNlcnZlcklkeCA9PT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgc2VydmVyID0gdGhpcy5zZXJ2ZXJzW3NlcnZlcklkeF07XG4gICAgbGV0IGNsaWVudCA9IHRoaXMuZ2V0Q2xpZW50Rm9yUHJvamVjdChzZXJ2ZXIucHJvamVjdERpcik7XG4gICAgY2xpZW50ID0gdW5kZWZpbmVkO1xuXG4gICAgc2VydmVyLmRlc3Ryb3koKTtcbiAgICBzZXJ2ZXIgPSB1bmRlZmluZWQ7XG5cbiAgICB0aGlzLnNlcnZlcnMuc3BsaWNlKHNlcnZlcklkeCwgMSk7XG4gIH1cblxuICBnZXRTZXJ2ZXJGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIGZvciAobGV0IHNlcnZlciBvZiB0aGlzLnNlcnZlcnMpIHtcblxuICAgICAgaWYgKHNlcnZlci5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKSB7XG5cbiAgICAgICAgcmV0dXJuIHNlcnZlcjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRDbGllbnRGb3JQcm9qZWN0KHByb2plY3REaXIpIHtcblxuICAgIGZvciAobGV0IGNsaWVudCBvZiB0aGlzLmNsaWVudHMpIHtcblxuICAgICAgaWYgKGNsaWVudC5wcm9qZWN0RGlyID09PSBwcm9qZWN0RGlyKSB7XG5cbiAgICAgICAgcmV0dXJuIGNsaWVudDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBnZXRFZGl0b3IoZWRpdG9yKSB7XG5cbiAgICBmb3IgKGxldCBfZWRpdG9yIG9mIHRoaXMuZWRpdG9ycykge1xuXG4gICAgICBpZiAoX2VkaXRvci5pZCA9PT0gZWRpdG9yLmlkKSB7XG5cbiAgICAgICAgcmV0dXJuIF9lZGl0b3I7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaXNWYWxpZEVkaXRvcihlZGl0b3IpIHtcblxuICAgIGlmICghZWRpdG9yIHx8ICFlZGl0b3IuZ2V0R3JhbW1hciB8fCBlZGl0b3IubWluaSkge1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFlZGl0b3IuZ2V0R3JhbW1hcigpKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5ncmFtbWFycy5pbmRleE9mKGVkaXRvci5nZXRHcmFtbWFyKCkubmFtZSkgPT09IC0xKSB7XG5cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZWRpdG9yLCBlKSB7XG5cbiAgICBpZiAocGFja2FnZUNvbmZpZy5vcHRpb25zLmlubGluZUZuQ29tcGxldGlvbikge1xuXG4gICAgICB0eXBlLnF1ZXJ5VHlwZShlZGl0b3IsIGUuY3Vyc29yKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3RlckV2ZW50cygpIHtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMoKGVkaXRvcikgPT4ge1xuXG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihlZGl0b3IpKSB7XG5cbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICAvLyBSZWdpc3RlciB2YWxpZCBlZGl0b3JcbiAgICAgIHRoaXMuZWRpdG9ycy5wdXNoKHtcblxuICAgICAgICBpZDogZWRpdG9yLmlkLFxuICAgICAgICBkaWZmczogW11cbiAgICAgIH0pO1xuXG4gICAgICBpZiAoIXRoaXMuaW5pdENhbGxlZCkge1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgfVxuXG4gICAgICBsZXQgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyhlZGl0b3IpO1xuXG4gICAgICBpZiAoZWRpdG9yVmlldykge1xuXG4gICAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3JWaWV3LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGUpID0+IHtcblxuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICFlW2FjY2Vzc0tleV0gfHxcbiAgICAgICAgICAgIGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKSAhPT0gJydcbiAgICAgICAgICApIHtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuXG4gICAgICAgICAgICB0aGlzLmNsaWVudC5kZWZpbml0aW9uKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBzY3JvbGxWaWV3O1xuXG4gICAgICBpZiAoIWVkaXRvclZpZXcuc2hhZG93Um9vdCkge1xuXG4gICAgICAgIHNjcm9sbFZpZXcgPSBlZGl0b3JWaWV3LnF1ZXJ5U2VsZWN0b3IoJy5zY3JvbGwtdmlldycpO1xuXG4gICAgICB9IGVsc2Uge1xuXG4gICAgICAgIHNjcm9sbFZpZXcgPSBlZGl0b3JWaWV3LnNoYWRvd1Jvb3QucXVlcnlTZWxlY3RvcignLnNjcm9sbC12aWV3Jyk7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY3JvbGxWaWV3KSB7XG5cbiAgICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKHNjcm9sbFZpZXcuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgKGUpID0+IHtcblxuICAgICAgICAgIGlmICghZVthY2Nlc3NLZXldKSB7XG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoZS50YXJnZXQuY2xhc3NMaXN0LmNvbnRhaW5zKCdsaW5lJykpIHtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGUudGFyZ2V0LmNsYXNzTGlzdC5hZGQoJ2F0b20tdGVybmpzLWhvdmVyJyk7XG4gICAgICAgIH0pKTtcblxuICAgICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goc2Nyb2xsVmlldy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIChlKSA9PiB7XG5cbiAgICAgICAgICBlLnRhcmdldC5jbGFzc0xpc3QucmVtb3ZlKCdhdG9tLXRlcm5qcy1ob3ZlcicpO1xuICAgICAgICB9KSk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbigoZSkgPT4ge1xuXG4gICAgICAgIGVtaXR0ZXIuZW1pdCgndHlwZS1kZXN0cm95LW92ZXJsYXknKTtcbiAgICAgICAgZW1pdHRlci5lbWl0KCdkb2N1bWVudGF0aW9uLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgfSkpO1xuXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oZGVib3VuY2UodGhpcy5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uLmJpbmQodGhpcywgZWRpdG9yKSwgMzAwKSkpO1xuXG4gICAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goZWRpdG9yLmdldEJ1ZmZlcigpLm9uRGlkU2F2ZSgoZSkgPT4ge1xuXG4gICAgICAgIGlmICh0aGlzLmNsaWVudCkge1xuXG4gICAgICAgICAgdGhpcy5jbGllbnQudXBkYXRlKGVkaXRvcik7XG4gICAgICAgIH1cbiAgICAgIH0pKTtcblxuICAgICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGVkaXRvci5nZXRCdWZmZXIoKS5vbkRpZENoYW5nZSgoZSkgPT4ge1xuXG4gICAgICAgIHRoaXMuZ2V0RWRpdG9yKGVkaXRvcikuZGlmZnMucHVzaChlKTtcbiAgICAgIH0pKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVQYW5lSXRlbSgoaXRlbSkgPT4ge1xuXG4gICAgICBlbWl0dGVyLmVtaXQoJ2NvbmZpZy1jbGVhcicpO1xuICAgICAgZW1pdHRlci5lbWl0KCd0eXBlLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdkb2N1bWVudGF0aW9uLWRlc3Ryb3ktb3ZlcmxheScpO1xuICAgICAgZW1pdHRlci5lbWl0KCdyZW5hbWUtaGlkZScpO1xuXG4gICAgICBpZiAoIXRoaXMuaXNWYWxpZEVkaXRvcihpdGVtKSkge1xuXG4gICAgICAgIGVtaXR0ZXIuZW1pdCgncmVmZXJlbmNlLWhpZGUnKTtcblxuICAgICAgfSBlbHNlIHtcblxuICAgICAgICB0aGlzLnNldEFjdGl2ZVNlcnZlckFuZENsaWVudChpdGVtLmdldFVSSSgpKTtcbiAgICAgIH1cbiAgICB9KSk7XG4gIH1cblxuICByZWdpc3RlckNvbW1hbmRzKCkge1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2NvcmU6Y2FuY2VsJywgKGUpID0+IHtcblxuICAgICAgZW1pdHRlci5lbWl0KCdjb25maWctY2xlYXInKTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgndHlwZS1kZXN0cm95LW92ZXJsYXknKTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgnZG9jdW1lbnRhdGlvbi1kZXN0cm95LW92ZXJsYXknKTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgncmVmZXJlbmNlLWhpZGUnKTtcbiAgICAgIGVtaXR0ZXIuZW1pdCgncmVuYW1lLWhpZGUnKTtcbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6bGlzdEZpbGVzJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQuZmlsZXMoKS50aGVuKChkYXRhKSA9PiB7XG5cbiAgICAgICAgICBjb25zb2xlLmRpcihkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSkpO1xuXG4gICAgdGhpcy5kaXNwb3NhYmxlcy5wdXNoKGF0b20uY29tbWFuZHMuYWRkKCdhdG9tLXRleHQtZWRpdG9yJywgJ2F0b20tdGVybmpzOmZsdXNoJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuc2VydmVyKSB7XG5cbiAgICAgICAgdGhpcy5zZXJ2ZXIuZmx1c2goKTtcbiAgICAgIH1cbiAgICB9KSk7XG5cbiAgICB0aGlzLmRpc3Bvc2FibGVzLnB1c2goYXRvbS5jb21tYW5kcy5hZGQoJ2F0b20tdGV4dC1lZGl0b3InLCAnYXRvbS10ZXJuanM6bWFya2VyQ2hlY2twb2ludEJhY2snLCAoZSkgPT4ge1xuXG4gICAgICBtYXJrZXJDaGVja3BvaW50QmFjaygpO1xuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS10ZXh0LWVkaXRvcicsICdhdG9tLXRlcm5qczpkZWZpbml0aW9uJywgKGUpID0+IHtcblxuICAgICAgaWYgKHRoaXMuY2xpZW50KSB7XG5cbiAgICAgICAgdGhpcy5jbGllbnQuZGVmaW5pdGlvbigpO1xuICAgICAgfVxuICAgIH0pKTtcblxuICAgIHRoaXMuZGlzcG9zYWJsZXMucHVzaChhdG9tLmNvbW1hbmRzLmFkZCgnYXRvbS13b3Jrc3BhY2UnLCAnYXRvbS10ZXJuanM6cmVzdGFydCcsIChlKSA9PiB7XG5cbiAgICAgIHRoaXMucmVzdGFydFNlcnZlcigpO1xuICAgIH0pKTtcbiAgfVxuXG4gIHJlc3RhcnRTZXJ2ZXIoKSB7XG5cbiAgICBpZiAoIXRoaXMuc2VydmVyKSB7XG5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZGlyID0gdGhpcy5zZXJ2ZXIucHJvamVjdERpcjtcbiAgICBsZXQgc2VydmVySWR4O1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnNlcnZlcnMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgaWYgKGRpciA9PT0gdGhpcy5zZXJ2ZXJzW2ldLnByb2plY3REaXIpIHtcblxuICAgICAgICBzZXJ2ZXJJZHggPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcy5zZXJ2ZXIpIHtcblxuICAgICAgdGhpcy5zZXJ2ZXIuZGVzdHJveSgpO1xuICAgIH1cblxuICAgIHRoaXMuc2VydmVyID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuc2VydmVycy5zcGxpY2Uoc2VydmVySWR4LCAxKTtcbiAgICB0aGlzLnN0YXJ0U2VydmVyKGRpcik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgbmV3IE1hbmFnZXIoKTtcbiJdfQ==