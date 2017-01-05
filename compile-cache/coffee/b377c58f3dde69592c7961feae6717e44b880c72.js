(function() {
  var BufferedProcess, CompositeDisposable, DefinitionsView, Disposable, InterpreterLookup, OverrideView, RenameView, Selector, UsagesView, _, filter, log, ref, selectorsMatchScopeChain;

  ref = require('atom'), Disposable = ref.Disposable, CompositeDisposable = ref.CompositeDisposable, BufferedProcess = ref.BufferedProcess;

  selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;

  Selector = require('selector-kit').Selector;

  DefinitionsView = require('./definitions-view');

  UsagesView = require('./usages-view');

  OverrideView = require('./override-view');

  RenameView = require('./rename-view');

  InterpreterLookup = require('./interpreters-lookup');

  log = require('./log');

  _ = require('underscore');

  filter = void 0;

  module.exports = {
    selector: '.source.python',
    disableForSelector: '.source.python .comment, .source.python .string',
    inclusionPriority: 2,
    suggestionPriority: atom.config.get('autocomplete-python.suggestionPriority'),
    excludeLowerPriority: false,
    cacheSize: 10,
    _addEventListener: function(editor, eventName, handler) {
      var disposable, editorView;
      editorView = atom.views.getView(editor);
      editorView.addEventListener(eventName, handler);
      disposable = new Disposable(function() {
        log.debug('Unsubscribing from event listener ', eventName, handler);
        return editorView.removeEventListener(eventName, handler);
      });
      return disposable;
    },
    _noExecutableError: function(error) {
      if (this.providerNoExecutable) {
        return;
      }
      log.warning('No python executable found', error);
      atom.notifications.addWarning('autocomplete-python unable to find python binary.', {
        detail: "Please set path to python executable manually in package\nsettings and restart your editor. Be sure to migrate on new settings\nif everything worked on previous version.\nDetailed error message: " + error + "\n\nCurrent config: " + (atom.config.get('autocomplete-python.pythonPaths')),
        dismissable: true
      });
      return this.providerNoExecutable = true;
    },
    _spawnDaemon: function() {
      var interpreter, ref1;
      interpreter = InterpreterLookup.getInterpreter();
      log.debug('Using interpreter', interpreter);
      this.provider = new BufferedProcess({
        command: interpreter || 'python',
        args: [__dirname + '/completion.py'],
        stdout: (function(_this) {
          return function(data) {
            return _this._deserialize(data);
          };
        })(this),
        stderr: (function(_this) {
          return function(data) {
            var ref1, requestId, resolve, results1;
            if (data.indexOf('is not recognized as an internal or external') > -1) {
              return _this._noExecutableError(data);
            }
            log.debug("autocomplete-python traceback output: " + data);
            if (data.indexOf('jedi') > -1) {
              if (atom.config.get('autocomplete-python.outputProviderErrors')) {
                atom.notifications.addWarning('Looks like this error originated from Jedi. Please do not\nreport such issues in autocomplete-python issue tracker. Report\nthem directly to Jedi. Turn off `outputProviderErrors` setting\nto hide such errors in future. Traceback output:', {
                  detail: "" + data,
                  dismissable: true
                });
              }
            } else {
              atom.notifications.addError('autocomplete-python traceback output:', {
                detail: "" + data,
                dismissable: true
              });
            }
            log.debug("Forcing to resolve " + (Object.keys(_this.requests).length) + " promises");
            ref1 = _this.requests;
            results1 = [];
            for (requestId in ref1) {
              resolve = ref1[requestId];
              if (typeof resolve === 'function') {
                resolve([]);
              }
              results1.push(delete _this.requests[requestId]);
            }
            return results1;
          };
        })(this),
        exit: (function(_this) {
          return function(code) {
            return log.warning('Process exit with', code, _this.provider);
          };
        })(this)
      });
      this.provider.onWillThrowError((function(_this) {
        return function(arg) {
          var error, handle;
          error = arg.error, handle = arg.handle;
          if (error.code === 'ENOENT' && error.syscall.indexOf('spawn') === 0) {
            _this._noExecutableError(error);
            _this.dispose();
            return handle();
          } else {
            throw error;
          }
        };
      })(this));
      if ((ref1 = this.provider.process) != null) {
        ref1.stdin.on('error', function(err) {
          return log.debug('stdin', err);
        });
      }
      return setTimeout((function(_this) {
        return function() {
          log.debug('Killing python process after timeout...');
          if (_this.provider && _this.provider.process) {
            return _this.provider.kill();
          }
        };
      })(this), 60 * 10 * 1000);
    },
    constructor: function() {
      var err, selector;
      this.requests = {};
      this.responses = {};
      this.provider = null;
      this.disposables = new CompositeDisposable;
      this.subscriptions = {};
      this.definitionsView = null;
      this.usagesView = null;
      this.renameView = null;
      this.snippetsManager = null;
      log.debug("Init autocomplete-python with priority " + this.suggestionPriority);
      try {
        this.triggerCompletionRegex = RegExp(atom.config.get('autocomplete-python.triggerCompletionRegex'));
      } catch (error1) {
        err = error1;
        atom.notifications.addWarning('autocomplete-python invalid regexp to trigger autocompletions.\nFalling back to default value.', {
          detail: "Original exception: " + err,
          dismissable: true
        });
        atom.config.set('autocomplete-python.triggerCompletionRegex', '([\.\ ]|[a-zA-Z_][a-zA-Z0-9_]*)');
        this.triggerCompletionRegex = /([\.\ ]|[a-zA-Z_][a-zA-Z0-9_]*)/;
      }
      selector = 'atom-text-editor[data-grammar~=python]';
      atom.commands.add(selector, 'autocomplete-python:go-to-definition', (function(_this) {
        return function() {
          return _this.goToDefinition();
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python:complete-arguments', (function(_this) {
        return function() {
          var editor;
          editor = atom.workspace.getActiveTextEditor();
          return _this._completeArguments(editor, editor.getCursorBufferPosition(), true);
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python:show-usages', (function(_this) {
        return function() {
          var bufferPosition, editor;
          editor = atom.workspace.getActiveTextEditor();
          bufferPosition = editor.getCursorBufferPosition();
          if (_this.usagesView) {
            _this.usagesView.destroy();
          }
          _this.usagesView = new UsagesView();
          return _this.getUsages(editor, bufferPosition).then(function(usages) {
            return _this.usagesView.setItems(usages);
          });
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python:override-method', (function(_this) {
        return function() {
          var bufferPosition, editor;
          editor = atom.workspace.getActiveTextEditor();
          bufferPosition = editor.getCursorBufferPosition();
          if (_this.overrideView) {
            _this.overrideView.destroy();
          }
          _this.overrideView = new OverrideView();
          return _this.getMethods(editor, bufferPosition).then(function(arg) {
            var bufferPosition, indent, methods;
            methods = arg.methods, indent = arg.indent, bufferPosition = arg.bufferPosition;
            _this.overrideView.indent = indent;
            _this.overrideView.bufferPosition = bufferPosition;
            return _this.overrideView.setItems(methods);
          });
        };
      })(this));
      atom.commands.add(selector, 'autocomplete-python:rename', (function(_this) {
        return function() {
          var bufferPosition, editor;
          editor = atom.workspace.getActiveTextEditor();
          bufferPosition = editor.getCursorBufferPosition();
          return _this.getUsages(editor, bufferPosition).then(function(usages) {
            if (_this.renameView) {
              _this.renameView.destroy();
            }
            if (usages.length > 0) {
              _this.renameView = new RenameView(usages);
              return _this.renameView.onInput(function(newName) {
                var _relative, fileName, project, ref1, ref2, results1;
                ref1 = _.groupBy(usages, 'fileName');
                results1 = [];
                for (fileName in ref1) {
                  usages = ref1[fileName];
                  ref2 = atom.project.relativizePath(fileName), project = ref2[0], _relative = ref2[1];
                  if (project) {
                    results1.push(_this._updateUsagesInFile(fileName, usages, newName));
                  } else {
                    results1.push(log.debug('Ignoring file outside of project', fileName));
                  }
                }
                return results1;
              });
            } else {
              if (_this.usagesView) {
                _this.usagesView.destroy();
              }
              _this.usagesView = new UsagesView();
              return _this.usagesView.setItems(usages);
            }
          });
        };
      })(this));
      atom.workspace.observeTextEditors((function(_this) {
        return function(editor) {
          _this._handleGrammarChangeEvent(editor, editor.getGrammar());
          return editor.onDidChangeGrammar(function(grammar) {
            return _this._handleGrammarChangeEvent(editor, grammar);
          });
        };
      })(this));
      return atom.config.onDidChange('autocomplete-plus.enableAutoActivation', (function(_this) {
        return function() {
          return atom.workspace.observeTextEditors(function(editor) {
            return _this._handleGrammarChangeEvent(editor, editor.getGrammar());
          });
        };
      })(this));
    },
    _updateUsagesInFile: function(fileName, usages, newName) {
      var columnOffset;
      columnOffset = {};
      return atom.workspace.open(fileName, {
        activateItem: false
      }).then(function(editor) {
        var buffer, column, i, len, line, name, usage;
        buffer = editor.getBuffer();
        for (i = 0, len = usages.length; i < len; i++) {
          usage = usages[i];
          name = usage.name, line = usage.line, column = usage.column;
          if (columnOffset[line] == null) {
            columnOffset[line] = 0;
          }
          log.debug('Replacing', usage, 'with', newName, 'in', editor.id);
          log.debug('Offset for line', line, 'is', columnOffset[line]);
          buffer.setTextInRange([[line - 1, column + columnOffset[line]], [line - 1, column + name.length + columnOffset[line]]], newName);
          columnOffset[line] += newName.length - name.length;
        }
        return buffer.save();
      });
    },
    _showSignatureOverlay: function(event) {
      var cursor, disableForSelector, editor, getTooltip, i, len, marker, ref1, scopeChain, scopeDescriptor, wordBufferRange;
      if (this.markers) {
        ref1 = this.markers;
        for (i = 0, len = ref1.length; i < len; i++) {
          marker = ref1[i];
          log.debug('destroying old marker', marker);
          marker.destroy();
        }
      } else {
        this.markers = [];
      }
      selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;
      Selector = require('selector-kit').Selector;
      cursor = event.cursor;
      editor = event.cursor.editor;
      wordBufferRange = cursor.getCurrentWordBufferRange();
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(event.newBufferPosition);
      scopeChain = scopeDescriptor.getScopeChain();
      disableForSelector = this.disableForSelector + ", .source.python .numeric, .source.python .integer, .source.python .decimal, .source.python .punctuation, .source.python .keyword, .source.python .storage, .source.python .variable.parameter, .source.python .entity.name";
      disableForSelector = Selector.create(disableForSelector);
      if (selectorsMatchScopeChain(disableForSelector, scopeChain)) {
        log.debug('do nothing for this selector');
        return;
      }
      marker = editor.markBufferRange(wordBufferRange, {
        persistent: false,
        invalidate: 'never'
      });
      this.markers.push(marker);
      getTooltip = (function(_this) {
        return function(editor, bufferPosition) {
          var payload;
          payload = {
            id: _this._generateRequestId('tooltip', editor, bufferPosition),
            lookup: 'tooltip',
            path: editor.getPath(),
            source: editor.getText(),
            line: bufferPosition.row,
            column: bufferPosition.column,
            config: _this._generateRequestConfig()
          };
          _this._sendRequest(_this._serialize(payload));
          return new Promise(function(resolve) {
            return _this.requests[payload.id] = resolve;
          });
        };
      })(this);
      return getTooltip(editor, event.newBufferPosition).then((function(_this) {
        return function(results) {
          var column, decoration, description, fileName, line, ref2, text, type, view;
          if (results.length > 0) {
            ref2 = results[0], text = ref2.text, fileName = ref2.fileName, line = ref2.line, column = ref2.column, type = ref2.type, description = ref2.description;
            description = description.trim();
            if (!description) {
              return;
            }
            view = document.createElement('autocomplete-python-suggestion');
            view.appendChild(document.createTextNode(description));
            decoration = editor.decorateMarker(marker, {
              type: 'overlay',
              item: view,
              position: 'head'
            });
            return log.debug('decorated marker', marker);
          }
        };
      })(this));
    },
    _handleGrammarChangeEvent: function(editor, grammar) {
      var disposable, eventId, eventName;
      eventName = 'keyup';
      eventId = editor.id + "." + eventName;
      if (grammar.scopeName === 'source.python') {
        if (atom.config.get('autocomplete-python.showTooltips') === true) {
          editor.onDidChangeCursorPosition((function(_this) {
            return function(event) {
              return _this._showSignatureOverlay(event);
            };
          })(this));
        }
        if (!atom.config.get('autocomplete-plus.enableAutoActivation')) {
          log.debug('Ignoring keyup events due to autocomplete-plus settings.');
          return;
        }
        disposable = this._addEventListener(editor, eventName, (function(_this) {
          return function(e) {
            var bracketIdentifiers;
            bracketIdentifiers = {
              'U+0028': 'qwerty',
              'U+0038': 'german',
              'U+0035': 'azerty',
              'U+0039': 'other'
            };
            if (e.keyIdentifier in bracketIdentifiers) {
              log.debug('Trying to complete arguments on keyup event', e);
              return _this._completeArguments(editor, editor.getCursorBufferPosition());
            }
          };
        })(this));
        this.disposables.add(disposable);
        this.subscriptions[eventId] = disposable;
        return log.debug('Subscribed on event', eventId);
      } else {
        if (eventId in this.subscriptions) {
          this.subscriptions[eventId].dispose();
          return log.debug('Unsubscribed from event', eventId);
        }
      }
    },
    _serialize: function(request) {
      log.debug('Serializing request to be sent to Jedi', request);
      return JSON.stringify(request);
    },
    _sendRequest: function(data, respawned) {
      var process;
      log.debug('Pending requests:', Object.keys(this.requests).length, this.requests);
      if (Object.keys(this.requests).length > 10) {
        log.debug('Cleaning up request queue to avoid overflow, ignoring request');
        this.requests = {};
        if (this.provider && this.provider.process) {
          log.debug('Killing python process');
          this.provider.kill();
          return;
        }
      }
      if (this.provider && this.provider.process) {
        process = this.provider.process;
        if (process.exitCode === null && process.signalCode === null) {
          if (this.provider.process.pid) {
            return this.provider.process.stdin.write(data + '\n');
          } else {
            return log.debug('Attempt to communicate with terminated process', this.provider);
          }
        } else if (respawned) {
          atom.notifications.addWarning(["Failed to spawn daemon for autocomplete-python.", "Completions will not work anymore", "unless you restart your editor."].join(' '), {
            detail: ["exitCode: " + process.exitCode, "signalCode: " + process.signalCode].join('\n'),
            dismissable: true
          });
          return this.dispose();
        } else {
          this._spawnDaemon();
          this._sendRequest(data, {
            respawned: true
          });
          return log.debug('Re-spawning python process...');
        }
      } else {
        log.debug('Spawning python process...');
        this._spawnDaemon();
        return this._sendRequest(data);
      }
    },
    _deserialize: function(response) {
      var bufferPosition, cacheSizeDelta, e, editor, i, id, ids, j, len, len1, ref1, ref2, ref3, resolve, responseSource, results1;
      log.debug('Deserealizing response from Jedi', response);
      log.debug("Got " + (response.trim().split('\n').length) + " lines");
      ref1 = response.trim().split('\n');
      results1 = [];
      for (i = 0, len = ref1.length; i < len; i++) {
        responseSource = ref1[i];
        try {
          response = JSON.parse(responseSource);
        } catch (error1) {
          e = error1;
          throw new Error("Failed to parse JSON from \"" + responseSource + "\".\nOriginal exception: " + e);
        }
        if (response['arguments']) {
          editor = this.requests[response['id']];
          if (typeof editor === 'object') {
            bufferPosition = editor.getCursorBufferPosition();
            if (response['id'] === this._generateRequestId('arguments', editor, bufferPosition)) {
              if ((ref2 = this.snippetsManager) != null) {
                ref2.insertSnippet(response['arguments'], editor);
              }
            }
          }
        } else {
          resolve = this.requests[response['id']];
          if (typeof resolve === 'function') {
            resolve(response['results']);
          }
        }
        cacheSizeDelta = Object.keys(this.responses).length > this.cacheSize;
        if (cacheSizeDelta > 0) {
          ids = Object.keys(this.responses).sort((function(_this) {
            return function(a, b) {
              return _this.responses[a]['timestamp'] - _this.responses[b]['timestamp'];
            };
          })(this));
          ref3 = ids.slice(0, cacheSizeDelta);
          for (j = 0, len1 = ref3.length; j < len1; j++) {
            id = ref3[j];
            log.debug('Removing old item from cache with ID', id);
            delete this.responses[id];
          }
        }
        this.responses[response['id']] = {
          source: responseSource,
          timestamp: Date.now()
        };
        log.debug('Cached request with ID', response['id']);
        results1.push(delete this.requests[response['id']]);
      }
      return results1;
    },
    _generateRequestId: function(type, editor, bufferPosition, text) {
      if (!text) {
        text = editor.getText();
      }
      return require('crypto').createHash('md5').update([editor.getPath(), text, bufferPosition.row, bufferPosition.column, type].join()).digest('hex');
    },
    _generateRequestConfig: function() {
      var args, extraPaths;
      extraPaths = InterpreterLookup.applySubstitutions(atom.config.get('autocomplete-python.extraPaths').split(';'));
      args = {
        'extraPaths': extraPaths,
        'useSnippets': atom.config.get('autocomplete-python.useSnippets'),
        'caseInsensitiveCompletion': atom.config.get('autocomplete-python.caseInsensitiveCompletion'),
        'showDescriptions': atom.config.get('autocomplete-python.showDescriptions'),
        'fuzzyMatcher': atom.config.get('autocomplete-python.fuzzyMatcher')
      };
      return args;
    },
    setSnippetsManager: function(snippetsManager) {
      this.snippetsManager = snippetsManager;
    },
    _completeArguments: function(editor, bufferPosition, force) {
      var disableForSelector, line, lines, payload, prefix, scopeChain, scopeDescriptor, suffix, useSnippets;
      useSnippets = atom.config.get('autocomplete-python.useSnippets');
      if (!force && useSnippets === 'none') {
        atom.commands.dispatch(document.querySelector('atom-text-editor'), 'autocomplete-plus:activate');
        return;
      }
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(bufferPosition);
      scopeChain = scopeDescriptor.getScopeChain();
      disableForSelector = Selector.create(this.disableForSelector);
      if (selectorsMatchScopeChain(disableForSelector, scopeChain)) {
        log.debug('Ignoring argument completion inside of', scopeChain);
        return;
      }
      lines = editor.getBuffer().getLines();
      line = lines[bufferPosition.row];
      prefix = line.slice(bufferPosition.column - 1, bufferPosition.column);
      if (prefix !== '(') {
        log.debug('Ignoring argument completion with prefix', prefix);
        return;
      }
      suffix = line.slice(bufferPosition.column, line.length);
      if (!/^(\)(?:$|\s)|\s|$)/.test(suffix)) {
        log.debug('Ignoring argument completion with suffix', suffix);
        return;
      }
      payload = {
        id: this._generateRequestId('arguments', editor, bufferPosition),
        lookup: 'arguments',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function() {
          return _this.requests[payload.id] = editor;
        };
      })(this));
    },
    _fuzzyFilter: function(candidates, query) {
      if (candidates.length !== 0 && (query !== ' ' && query !== '.' && query !== '(')) {
        if (filter == null) {
          filter = require('fuzzaldrin-plus').filter;
        }
        candidates = filter(candidates, query, {
          key: 'text'
        });
      }
      return candidates;
    },
    getSuggestions: function(arg) {
      var bufferPosition, editor, lastIdentifier, line, lines, matches, payload, prefix, requestId, scopeDescriptor;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      if (!this.triggerCompletionRegex.test(prefix)) {
        return [];
      }
      bufferPosition = {
        row: bufferPosition.row,
        column: bufferPosition.column
      };
      lines = editor.getBuffer().getLines();
      if (atom.config.get('autocomplete-python.fuzzyMatcher')) {
        line = lines[bufferPosition.row];
        lastIdentifier = /\.?[a-zA-Z_][a-zA-Z0-9_]*$/.exec(line.slice(0, bufferPosition.column));
        if (lastIdentifier) {
          bufferPosition.column = lastIdentifier.index + 1;
          lines[bufferPosition.row] = line.slice(0, bufferPosition.column);
        }
      }
      requestId = this._generateRequestId('completions', editor, bufferPosition, lines.join('\n'));
      if (requestId in this.responses) {
        log.debug('Using cached response with ID', requestId);
        matches = JSON.parse(this.responses[requestId]['source'])['results'];
        if (atom.config.get('autocomplete-python.fuzzyMatcher')) {
          return this._fuzzyFilter(matches, prefix);
        } else {
          return matches;
        }
      }
      payload = {
        id: requestId,
        prefix: prefix,
        lookup: 'completions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          if (atom.config.get('autocomplete-python.fuzzyMatcher')) {
            return _this.requests[payload.id] = function(matches) {
              return resolve(_this._fuzzyFilter(matches, prefix));
            };
          } else {
            return _this.requests[payload.id] = resolve;
          }
        };
      })(this));
    },
    getDefinitions: function(editor, bufferPosition) {
      var payload;
      payload = {
        id: this._generateRequestId('definitions', editor, bufferPosition),
        lookup: 'definitions',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.requests[payload.id] = resolve;
        };
      })(this));
    },
    getUsages: function(editor, bufferPosition) {
      var payload;
      payload = {
        id: this._generateRequestId('usages', editor, bufferPosition),
        lookup: 'usages',
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        column: bufferPosition.column,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.requests[payload.id] = resolve;
        };
      })(this));
    },
    getMethods: function(editor, bufferPosition) {
      var indent, lines, payload;
      indent = bufferPosition.column;
      lines = editor.getBuffer().getLines();
      lines.splice(bufferPosition.row + 1, 0, "  def __autocomplete_python(s):");
      lines.splice(bufferPosition.row + 2, 0, "    s.");
      payload = {
        id: this._generateRequestId('methods', editor, bufferPosition),
        lookup: 'methods',
        path: editor.getPath(),
        source: lines.join('\n'),
        line: bufferPosition.row + 2,
        column: 6,
        config: this._generateRequestConfig()
      };
      this._sendRequest(this._serialize(payload));
      return new Promise((function(_this) {
        return function(resolve) {
          return _this.requests[payload.id] = function(methods) {
            return resolve({
              methods: methods,
              indent: indent,
              bufferPosition: bufferPosition
            });
          };
        };
      })(this));
    },
    goToDefinition: function(editor, bufferPosition) {
      if (!editor) {
        editor = atom.workspace.getActiveTextEditor();
      }
      if (!bufferPosition) {
        bufferPosition = editor.getCursorBufferPosition();
      }
      if (this.definitionsView) {
        this.definitionsView.destroy();
      }
      this.definitionsView = new DefinitionsView();
      return this.getDefinitions(editor, bufferPosition).then((function(_this) {
        return function(results) {
          _this.definitionsView.setItems(results);
          if (results.length === 1) {
            return _this.definitionsView.confirmed(results[0]);
          }
        };
      })(this));
    },
    dispose: function() {
      this.disposables.dispose();
      if (this.provider) {
        return this.provider.kill();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9wcm92aWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLE1BQXFELE9BQUEsQ0FBUSxNQUFSLENBQXJELEVBQUMsMkJBQUQsRUFBYSw2Q0FBYixFQUFrQzs7RUFDakMsMkJBQTRCLE9BQUEsQ0FBUSxpQkFBUjs7RUFDNUIsV0FBWSxPQUFBLENBQVEsY0FBUjs7RUFDYixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxvQkFBUjs7RUFDbEIsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUNiLFlBQUEsR0FBZSxPQUFBLENBQVEsaUJBQVI7O0VBQ2YsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSOztFQUNiLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUjs7RUFDcEIsR0FBQSxHQUFNLE9BQUEsQ0FBUSxPQUFSOztFQUNOLENBQUEsR0FBSSxPQUFBLENBQVEsWUFBUjs7RUFDSixNQUFBLEdBQVM7O0VBRVQsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLFFBQUEsRUFBVSxnQkFBVjtJQUNBLGtCQUFBLEVBQW9CLGlEQURwQjtJQUVBLGlCQUFBLEVBQW1CLENBRm5CO0lBR0Esa0JBQUEsRUFBb0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixDQUhwQjtJQUlBLG9CQUFBLEVBQXNCLEtBSnRCO0lBS0EsU0FBQSxFQUFXLEVBTFg7SUFPQSxpQkFBQSxFQUFtQixTQUFDLE1BQUQsRUFBUyxTQUFULEVBQW9CLE9BQXBCO0FBQ2pCLFVBQUE7TUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFYLENBQW1CLE1BQW5CO01BQ2IsVUFBVSxDQUFDLGdCQUFYLENBQTRCLFNBQTVCLEVBQXVDLE9BQXZDO01BQ0EsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBVyxTQUFBO1FBQzFCLEdBQUcsQ0FBQyxLQUFKLENBQVUsb0NBQVYsRUFBZ0QsU0FBaEQsRUFBMkQsT0FBM0Q7ZUFDQSxVQUFVLENBQUMsbUJBQVgsQ0FBK0IsU0FBL0IsRUFBMEMsT0FBMUM7TUFGMEIsQ0FBWDtBQUdqQixhQUFPO0lBTlUsQ0FQbkI7SUFlQSxrQkFBQSxFQUFvQixTQUFDLEtBQUQ7TUFDbEIsSUFBRyxJQUFDLENBQUEsb0JBQUo7QUFDRSxlQURGOztNQUVBLEdBQUcsQ0FBQyxPQUFKLENBQVksNEJBQVosRUFBMEMsS0FBMUM7TUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQ0UsbURBREYsRUFDdUQ7UUFDckQsTUFBQSxFQUFRLHFNQUFBLEdBR2tCLEtBSGxCLEdBR3dCLHNCQUh4QixHQUtTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUFELENBTm9DO1FBT3JELFdBQUEsRUFBYSxJQVB3QztPQUR2RDthQVNBLElBQUMsQ0FBQSxvQkFBRCxHQUF3QjtJQWJOLENBZnBCO0lBOEJBLFlBQUEsRUFBYyxTQUFBO0FBQ1osVUFBQTtNQUFBLFdBQUEsR0FBYyxpQkFBaUIsQ0FBQyxjQUFsQixDQUFBO01BQ2QsR0FBRyxDQUFDLEtBQUosQ0FBVSxtQkFBVixFQUErQixXQUEvQjtNQUNBLElBQUMsQ0FBQSxRQUFELEdBQWdCLElBQUEsZUFBQSxDQUNkO1FBQUEsT0FBQSxFQUFTLFdBQUEsSUFBZSxRQUF4QjtRQUNBLElBQUEsRUFBTSxDQUFDLFNBQUEsR0FBWSxnQkFBYixDQUROO1FBRUEsTUFBQSxFQUFRLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUMsSUFBRDttQkFDTixLQUFDLENBQUEsWUFBRCxDQUFjLElBQWQ7VUFETTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FGUjtRQUlBLE1BQUEsRUFBUSxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFDLElBQUQ7QUFDTixnQkFBQTtZQUFBLElBQUcsSUFBSSxDQUFDLE9BQUwsQ0FBYSw4Q0FBYixDQUFBLEdBQStELENBQUMsQ0FBbkU7QUFDRSxxQkFBTyxLQUFDLENBQUEsa0JBQUQsQ0FBb0IsSUFBcEIsRUFEVDs7WUFFQSxHQUFHLENBQUMsS0FBSixDQUFVLHdDQUFBLEdBQXlDLElBQW5EO1lBQ0EsSUFBRyxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQWIsQ0FBQSxHQUF1QixDQUFDLENBQTNCO2NBQ0UsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsMENBQWhCLENBQUg7Z0JBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFuQixDQUNFLDhPQURGLEVBSXVEO2tCQUNyRCxNQUFBLEVBQVEsRUFBQSxHQUFHLElBRDBDO2tCQUVyRCxXQUFBLEVBQWEsSUFGd0M7aUJBSnZELEVBREY7ZUFERjthQUFBLE1BQUE7Y0FVRSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQW5CLENBQ0UsdUNBREYsRUFDMkM7Z0JBQ3ZDLE1BQUEsRUFBUSxFQUFBLEdBQUcsSUFENEI7Z0JBRXZDLFdBQUEsRUFBYSxJQUYwQjtlQUQzQyxFQVZGOztZQWVBLEdBQUcsQ0FBQyxLQUFKLENBQVUscUJBQUEsR0FBcUIsQ0FBQyxNQUFNLENBQUMsSUFBUCxDQUFZLEtBQUMsQ0FBQSxRQUFiLENBQXNCLENBQUMsTUFBeEIsQ0FBckIsR0FBb0QsV0FBOUQ7QUFDQTtBQUFBO2lCQUFBLGlCQUFBOztjQUNFLElBQUcsT0FBTyxPQUFQLEtBQWtCLFVBQXJCO2dCQUNFLE9BQUEsQ0FBUSxFQUFSLEVBREY7OzRCQUVBLE9BQU8sS0FBQyxDQUFBLFFBQVMsQ0FBQSxTQUFBO0FBSG5COztVQXBCTTtRQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FKUjtRQTZCQSxJQUFBLEVBQU0sQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxJQUFEO21CQUNKLEdBQUcsQ0FBQyxPQUFKLENBQVksbUJBQVosRUFBaUMsSUFBakMsRUFBdUMsS0FBQyxDQUFBLFFBQXhDO1VBREk7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBN0JOO09BRGM7TUFnQ2hCLElBQUMsQ0FBQSxRQUFRLENBQUMsZ0JBQVYsQ0FBMkIsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLEdBQUQ7QUFDekIsY0FBQTtVQUQyQixtQkFBTztVQUNsQyxJQUFHLEtBQUssQ0FBQyxJQUFOLEtBQWMsUUFBZCxJQUEyQixLQUFLLENBQUMsT0FBTyxDQUFDLE9BQWQsQ0FBc0IsT0FBdEIsQ0FBQSxLQUFrQyxDQUFoRTtZQUNFLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixLQUFwQjtZQUNBLEtBQUMsQ0FBQSxPQUFELENBQUE7bUJBQ0EsTUFBQSxDQUFBLEVBSEY7V0FBQSxNQUFBO0FBS0Usa0JBQU0sTUFMUjs7UUFEeUI7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTNCOztZQVFpQixDQUFFLEtBQUssQ0FBQyxFQUF6QixDQUE0QixPQUE1QixFQUFxQyxTQUFDLEdBQUQ7aUJBQ25DLEdBQUcsQ0FBQyxLQUFKLENBQVUsT0FBVixFQUFtQixHQUFuQjtRQURtQyxDQUFyQzs7YUFHQSxVQUFBLENBQVcsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO1VBQ1QsR0FBRyxDQUFDLEtBQUosQ0FBVSx5Q0FBVjtVQUNBLElBQUcsS0FBQyxDQUFBLFFBQUQsSUFBYyxLQUFDLENBQUEsUUFBUSxDQUFDLE9BQTNCO21CQUNFLEtBQUMsQ0FBQSxRQUFRLENBQUMsSUFBVixDQUFBLEVBREY7O1FBRlM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFJRSxFQUFBLEdBQUssRUFBTCxHQUFVLElBSlo7SUE5Q1ksQ0E5QmQ7SUFrRkEsV0FBQSxFQUFhLFNBQUE7QUFDWCxVQUFBO01BQUEsSUFBQyxDQUFBLFFBQUQsR0FBWTtNQUNaLElBQUMsQ0FBQSxTQUFELEdBQWE7TUFDYixJQUFDLENBQUEsUUFBRCxHQUFZO01BQ1osSUFBQyxDQUFBLFdBQUQsR0FBZSxJQUFJO01BQ25CLElBQUMsQ0FBQSxhQUFELEdBQWlCO01BQ2pCLElBQUMsQ0FBQSxlQUFELEdBQW1CO01BQ25CLElBQUMsQ0FBQSxVQUFELEdBQWM7TUFDZCxJQUFDLENBQUEsVUFBRCxHQUFjO01BQ2QsSUFBQyxDQUFBLGVBQUQsR0FBbUI7TUFFbkIsR0FBRyxDQUFDLEtBQUosQ0FBVSx5Q0FBQSxHQUEwQyxJQUFDLENBQUEsa0JBQXJEO0FBRUE7UUFDRSxJQUFDLENBQUEsc0JBQUQsR0FBMEIsTUFBQSxDQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUMvQiw0Q0FEK0IsQ0FBUCxFQUQ1QjtPQUFBLGNBQUE7UUFHTTtRQUNKLElBQUksQ0FBQyxhQUFhLENBQUMsVUFBbkIsQ0FDRSxnR0FERixFQUVxQztVQUNuQyxNQUFBLEVBQVEsc0JBQUEsR0FBdUIsR0FESTtVQUVuQyxXQUFBLEVBQWEsSUFGc0I7U0FGckM7UUFLQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNENBQWhCLEVBQ2dCLGlDQURoQjtRQUVBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixrQ0FYNUI7O01BYUEsUUFBQSxHQUFXO01BQ1gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLFFBQWxCLEVBQTRCLHNDQUE1QixFQUFvRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2xFLEtBQUMsQ0FBQSxjQUFELENBQUE7UUFEa0U7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBFO01BRUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLFFBQWxCLEVBQTRCLHdDQUE1QixFQUFzRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDcEUsY0FBQTtVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7aUJBQ1QsS0FBQyxDQUFBLGtCQUFELENBQW9CLE1BQXBCLEVBQTRCLE1BQU0sQ0FBQyx1QkFBUCxDQUFBLENBQTVCLEVBQThELElBQTlEO1FBRm9FO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF0RTtNQUlBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixRQUFsQixFQUE0QixpQ0FBNUIsRUFBK0QsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQzdELGNBQUE7VUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1VBQ1QsY0FBQSxHQUFpQixNQUFNLENBQUMsdUJBQVAsQ0FBQTtVQUNqQixJQUFHLEtBQUMsQ0FBQSxVQUFKO1lBQ0UsS0FBQyxDQUFBLFVBQVUsQ0FBQyxPQUFaLENBQUEsRUFERjs7VUFFQSxLQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FBQTtpQkFDbEIsS0FBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLEVBQW1CLGNBQW5CLENBQWtDLENBQUMsSUFBbkMsQ0FBd0MsU0FBQyxNQUFEO21CQUN0QyxLQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBcUIsTUFBckI7VUFEc0MsQ0FBeEM7UUFONkQ7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9EO01BU0EsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLFFBQWxCLEVBQTRCLHFDQUE1QixFQUFtRSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7QUFDakUsY0FBQTtVQUFBLE1BQUEsR0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFmLENBQUE7VUFDVCxjQUFBLEdBQWlCLE1BQU0sQ0FBQyx1QkFBUCxDQUFBO1VBQ2pCLElBQUcsS0FBQyxDQUFBLFlBQUo7WUFDRSxLQUFDLENBQUEsWUFBWSxDQUFDLE9BQWQsQ0FBQSxFQURGOztVQUVBLEtBQUMsQ0FBQSxZQUFELEdBQW9CLElBQUEsWUFBQSxDQUFBO2lCQUNwQixLQUFDLENBQUEsVUFBRCxDQUFZLE1BQVosRUFBb0IsY0FBcEIsQ0FBbUMsQ0FBQyxJQUFwQyxDQUF5QyxTQUFDLEdBQUQ7QUFDdkMsZ0JBQUE7WUFEeUMsdUJBQVMscUJBQVE7WUFDMUQsS0FBQyxDQUFBLFlBQVksQ0FBQyxNQUFkLEdBQXVCO1lBQ3ZCLEtBQUMsQ0FBQSxZQUFZLENBQUMsY0FBZCxHQUErQjttQkFDL0IsS0FBQyxDQUFBLFlBQVksQ0FBQyxRQUFkLENBQXVCLE9BQXZCO1VBSHVDLENBQXpDO1FBTmlFO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuRTtNQVdBLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixRQUFsQixFQUE0Qiw0QkFBNUIsRUFBMEQsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO0FBQ3hELGNBQUE7VUFBQSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxtQkFBZixDQUFBO1VBQ1QsY0FBQSxHQUFpQixNQUFNLENBQUMsdUJBQVAsQ0FBQTtpQkFDakIsS0FBQyxDQUFBLFNBQUQsQ0FBVyxNQUFYLEVBQW1CLGNBQW5CLENBQWtDLENBQUMsSUFBbkMsQ0FBd0MsU0FBQyxNQUFEO1lBQ3RDLElBQUcsS0FBQyxDQUFBLFVBQUo7Y0FDRSxLQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxFQURGOztZQUVBLElBQUcsTUFBTSxDQUFDLE1BQVAsR0FBZ0IsQ0FBbkI7Y0FDRSxLQUFDLENBQUEsVUFBRCxHQUFrQixJQUFBLFVBQUEsQ0FBVyxNQUFYO3FCQUNsQixLQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBb0IsU0FBQyxPQUFEO0FBQ2xCLG9CQUFBO0FBQUE7QUFBQTtxQkFBQSxnQkFBQTs7a0JBQ0UsT0FBdUIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxjQUFiLENBQTRCLFFBQTVCLENBQXZCLEVBQUMsaUJBQUQsRUFBVTtrQkFDVixJQUFHLE9BQUg7a0NBQ0UsS0FBQyxDQUFBLG1CQUFELENBQXFCLFFBQXJCLEVBQStCLE1BQS9CLEVBQXVDLE9BQXZDLEdBREY7bUJBQUEsTUFBQTtrQ0FHRSxHQUFHLENBQUMsS0FBSixDQUFVLGtDQUFWLEVBQThDLFFBQTlDLEdBSEY7O0FBRkY7O2NBRGtCLENBQXBCLEVBRkY7YUFBQSxNQUFBO2NBVUUsSUFBRyxLQUFDLENBQUEsVUFBSjtnQkFDRSxLQUFDLENBQUEsVUFBVSxDQUFDLE9BQVosQ0FBQSxFQURGOztjQUVBLEtBQUMsQ0FBQSxVQUFELEdBQWtCLElBQUEsVUFBQSxDQUFBO3FCQUNsQixLQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosQ0FBcUIsTUFBckIsRUFiRjs7VUFIc0MsQ0FBeEM7UUFId0Q7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFEO01BcUJBLElBQUksQ0FBQyxTQUFTLENBQUMsa0JBQWYsQ0FBa0MsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE1BQUQ7VUFDaEMsS0FBQyxDQUFBLHlCQUFELENBQTJCLE1BQTNCLEVBQW1DLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbkM7aUJBQ0EsTUFBTSxDQUFDLGtCQUFQLENBQTBCLFNBQUMsT0FBRDttQkFDeEIsS0FBQyxDQUFBLHlCQUFELENBQTJCLE1BQTNCLEVBQW1DLE9BQW5DO1VBRHdCLENBQTFCO1FBRmdDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQzthQUtBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3Qix3Q0FBeEIsRUFBa0UsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFBO2lCQUNoRSxJQUFJLENBQUMsU0FBUyxDQUFDLGtCQUFmLENBQWtDLFNBQUMsTUFBRDttQkFDaEMsS0FBQyxDQUFBLHlCQUFELENBQTJCLE1BQTNCLEVBQW1DLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbkM7VUFEZ0MsQ0FBbEM7UUFEZ0U7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWxFO0lBL0VXLENBbEZiO0lBcUtBLG1CQUFBLEVBQXFCLFNBQUMsUUFBRCxFQUFXLE1BQVgsRUFBbUIsT0FBbkI7QUFDbkIsVUFBQTtNQUFBLFlBQUEsR0FBZTthQUNmLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixRQUFwQixFQUE4QjtRQUFBLFlBQUEsRUFBYyxLQUFkO09BQTlCLENBQWtELENBQUMsSUFBbkQsQ0FBd0QsU0FBQyxNQUFEO0FBQ3RELFlBQUE7UUFBQSxNQUFBLEdBQVMsTUFBTSxDQUFDLFNBQVAsQ0FBQTtBQUNULGFBQUEsd0NBQUE7O1VBQ0csaUJBQUQsRUFBTyxpQkFBUCxFQUFhOztZQUNiLFlBQWEsQ0FBQSxJQUFBLElBQVM7O1VBQ3RCLEdBQUcsQ0FBQyxLQUFKLENBQVUsV0FBVixFQUF1QixLQUF2QixFQUE4QixNQUE5QixFQUFzQyxPQUF0QyxFQUErQyxJQUEvQyxFQUFxRCxNQUFNLENBQUMsRUFBNUQ7VUFDQSxHQUFHLENBQUMsS0FBSixDQUFVLGlCQUFWLEVBQTZCLElBQTdCLEVBQW1DLElBQW5DLEVBQXlDLFlBQWEsQ0FBQSxJQUFBLENBQXREO1VBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsQ0FDcEIsQ0FBQyxJQUFBLEdBQU8sQ0FBUixFQUFXLE1BQUEsR0FBUyxZQUFhLENBQUEsSUFBQSxDQUFqQyxDQURvQixFQUVwQixDQUFDLElBQUEsR0FBTyxDQUFSLEVBQVcsTUFBQSxHQUFTLElBQUksQ0FBQyxNQUFkLEdBQXVCLFlBQWEsQ0FBQSxJQUFBLENBQS9DLENBRm9CLENBQXRCLEVBR0ssT0FITDtVQUlBLFlBQWEsQ0FBQSxJQUFBLENBQWIsSUFBc0IsT0FBTyxDQUFDLE1BQVIsR0FBaUIsSUFBSSxDQUFDO0FBVDlDO2VBVUEsTUFBTSxDQUFDLElBQVAsQ0FBQTtNQVpzRCxDQUF4RDtJQUZtQixDQXJLckI7SUFzTEEscUJBQUEsRUFBdUIsU0FBQyxLQUFEO0FBQ3JCLFVBQUE7TUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFKO0FBQ0U7QUFBQSxhQUFBLHNDQUFBOztVQUNFLEdBQUcsQ0FBQyxLQUFKLENBQVUsdUJBQVYsRUFBbUMsTUFBbkM7VUFDQSxNQUFNLENBQUMsT0FBUCxDQUFBO0FBRkYsU0FERjtPQUFBLE1BQUE7UUFLRSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBTGI7O01BT0MsMkJBQTRCLE9BQUEsQ0FBUSxpQkFBUjtNQUM1QixXQUFZLE9BQUEsQ0FBUSxjQUFSO01BRWIsTUFBQSxHQUFTLEtBQUssQ0FBQztNQUNmLE1BQUEsR0FBUyxLQUFLLENBQUMsTUFBTSxDQUFDO01BQ3RCLGVBQUEsR0FBa0IsTUFBTSxDQUFDLHlCQUFQLENBQUE7TUFDbEIsZUFBQSxHQUFrQixNQUFNLENBQUMsZ0NBQVAsQ0FDaEIsS0FBSyxDQUFDLGlCQURVO01BRWxCLFVBQUEsR0FBYSxlQUFlLENBQUMsYUFBaEIsQ0FBQTtNQUViLGtCQUFBLEdBQXdCLElBQUMsQ0FBQSxrQkFBRixHQUFxQjtNQUM1QyxrQkFBQSxHQUFxQixRQUFRLENBQUMsTUFBVCxDQUFnQixrQkFBaEI7TUFFckIsSUFBRyx3QkFBQSxDQUF5QixrQkFBekIsRUFBNkMsVUFBN0MsQ0FBSDtRQUNFLEdBQUcsQ0FBQyxLQUFKLENBQVUsOEJBQVY7QUFDQSxlQUZGOztNQUlBLE1BQUEsR0FBUyxNQUFNLENBQUMsZUFBUCxDQUNQLGVBRE8sRUFFUDtRQUFDLFVBQUEsRUFBWSxLQUFiO1FBQW9CLFVBQUEsRUFBWSxPQUFoQztPQUZPO01BSVQsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsTUFBZDtNQUVBLFVBQUEsR0FBYSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsTUFBRCxFQUFTLGNBQVQ7QUFDWCxjQUFBO1VBQUEsT0FBQSxHQUNFO1lBQUEsRUFBQSxFQUFJLEtBQUMsQ0FBQSxrQkFBRCxDQUFvQixTQUFwQixFQUErQixNQUEvQixFQUF1QyxjQUF2QyxDQUFKO1lBQ0EsTUFBQSxFQUFRLFNBRFI7WUFFQSxJQUFBLEVBQU0sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUZOO1lBR0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FIUjtZQUlBLElBQUEsRUFBTSxjQUFjLENBQUMsR0FKckI7WUFLQSxNQUFBLEVBQVEsY0FBYyxDQUFDLE1BTHZCO1lBTUEsTUFBQSxFQUFRLEtBQUMsQ0FBQSxzQkFBRCxDQUFBLENBTlI7O1VBT0YsS0FBQyxDQUFBLFlBQUQsQ0FBYyxLQUFDLENBQUEsVUFBRCxDQUFZLE9BQVosQ0FBZDtBQUNBLGlCQUFXLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRDttQkFDakIsS0FBQyxDQUFBLFFBQVMsQ0FBQSxPQUFPLENBQUMsRUFBUixDQUFWLEdBQXdCO1VBRFAsQ0FBUjtRQVZBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTthQWFiLFVBQUEsQ0FBVyxNQUFYLEVBQW1CLEtBQUssQ0FBQyxpQkFBekIsQ0FBMkMsQ0FBQyxJQUE1QyxDQUFpRCxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtBQUMvQyxjQUFBO1VBQUEsSUFBRyxPQUFPLENBQUMsTUFBUixHQUFpQixDQUFwQjtZQUNFLE9BQW9ELE9BQVEsQ0FBQSxDQUFBLENBQTVELEVBQUMsZ0JBQUQsRUFBTyx3QkFBUCxFQUFpQixnQkFBakIsRUFBdUIsb0JBQXZCLEVBQStCLGdCQUEvQixFQUFxQztZQUVyQyxXQUFBLEdBQWMsV0FBVyxDQUFDLElBQVosQ0FBQTtZQUNkLElBQUcsQ0FBSSxXQUFQO0FBQ0UscUJBREY7O1lBRUEsSUFBQSxHQUFPLFFBQVEsQ0FBQyxhQUFULENBQXVCLGdDQUF2QjtZQUNQLElBQUksQ0FBQyxXQUFMLENBQWlCLFFBQVEsQ0FBQyxjQUFULENBQXdCLFdBQXhCLENBQWpCO1lBQ0EsVUFBQSxHQUFhLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE1BQXRCLEVBQThCO2NBQ3ZDLElBQUEsRUFBTSxTQURpQztjQUV2QyxJQUFBLEVBQU0sSUFGaUM7Y0FHdkMsUUFBQSxFQUFVLE1BSDZCO2FBQTlCO21CQUtiLEdBQUcsQ0FBQyxLQUFKLENBQVUsa0JBQVYsRUFBOEIsTUFBOUIsRUFiRjs7UUFEK0M7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWpEO0lBNUNxQixDQXRMdkI7SUFrUEEseUJBQUEsRUFBMkIsU0FBQyxNQUFELEVBQVMsT0FBVDtBQUN6QixVQUFBO01BQUEsU0FBQSxHQUFZO01BQ1osT0FBQSxHQUFhLE1BQU0sQ0FBQyxFQUFSLEdBQVcsR0FBWCxHQUFjO01BQzFCLElBQUcsT0FBTyxDQUFDLFNBQVIsS0FBcUIsZUFBeEI7UUFFRSxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEIsQ0FBQSxLQUF1RCxJQUExRDtVQUNFLE1BQU0sQ0FBQyx5QkFBUCxDQUFpQyxDQUFBLFNBQUEsS0FBQTttQkFBQSxTQUFDLEtBQUQ7cUJBQy9CLEtBQUMsQ0FBQSxxQkFBRCxDQUF1QixLQUF2QjtZQUQrQjtVQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBakMsRUFERjs7UUFJQSxJQUFHLENBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHdDQUFoQixDQUFQO1VBQ0UsR0FBRyxDQUFDLEtBQUosQ0FBVSwwREFBVjtBQUNBLGlCQUZGOztRQUdBLFVBQUEsR0FBYSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsTUFBbkIsRUFBMkIsU0FBM0IsRUFBc0MsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQyxDQUFEO0FBQ2pELGdCQUFBO1lBQUEsa0JBQUEsR0FDRTtjQUFBLFFBQUEsRUFBVSxRQUFWO2NBQ0EsUUFBQSxFQUFVLFFBRFY7Y0FFQSxRQUFBLEVBQVUsUUFGVjtjQUdBLFFBQUEsRUFBVSxPQUhWOztZQUlGLElBQUcsQ0FBQyxDQUFDLGFBQUYsSUFBbUIsa0JBQXRCO2NBQ0UsR0FBRyxDQUFDLEtBQUosQ0FBVSw2Q0FBVixFQUF5RCxDQUF6RDtxQkFDQSxLQUFDLENBQUEsa0JBQUQsQ0FBb0IsTUFBcEIsRUFBNEIsTUFBTSxDQUFDLHVCQUFQLENBQUEsQ0FBNUIsRUFGRjs7VUFOaUQ7UUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRDO1FBU2IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxHQUFiLENBQWlCLFVBQWpCO1FBQ0EsSUFBQyxDQUFBLGFBQWMsQ0FBQSxPQUFBLENBQWYsR0FBMEI7ZUFDMUIsR0FBRyxDQUFDLEtBQUosQ0FBVSxxQkFBVixFQUFpQyxPQUFqQyxFQXBCRjtPQUFBLE1BQUE7UUFzQkUsSUFBRyxPQUFBLElBQVcsSUFBQyxDQUFBLGFBQWY7VUFDRSxJQUFDLENBQUEsYUFBYyxDQUFBLE9BQUEsQ0FBUSxDQUFDLE9BQXhCLENBQUE7aUJBQ0EsR0FBRyxDQUFDLEtBQUosQ0FBVSx5QkFBVixFQUFxQyxPQUFyQyxFQUZGO1NBdEJGOztJQUh5QixDQWxQM0I7SUErUUEsVUFBQSxFQUFZLFNBQUMsT0FBRDtNQUNWLEdBQUcsQ0FBQyxLQUFKLENBQVUsd0NBQVYsRUFBb0QsT0FBcEQ7QUFDQSxhQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZjtJQUZHLENBL1FaO0lBbVJBLFlBQUEsRUFBYyxTQUFDLElBQUQsRUFBTyxTQUFQO0FBQ1osVUFBQTtNQUFBLEdBQUcsQ0FBQyxLQUFKLENBQVUsbUJBQVYsRUFBK0IsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFDLENBQUEsUUFBYixDQUFzQixDQUFDLE1BQXRELEVBQThELElBQUMsQ0FBQSxRQUEvRDtNQUNBLElBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFDLENBQUEsUUFBYixDQUFzQixDQUFDLE1BQXZCLEdBQWdDLEVBQW5DO1FBQ0UsR0FBRyxDQUFDLEtBQUosQ0FBVSwrREFBVjtRQUNBLElBQUMsQ0FBQSxRQUFELEdBQVk7UUFDWixJQUFHLElBQUMsQ0FBQSxRQUFELElBQWMsSUFBQyxDQUFBLFFBQVEsQ0FBQyxPQUEzQjtVQUNFLEdBQUcsQ0FBQyxLQUFKLENBQVUsd0JBQVY7VUFDQSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBQTtBQUNBLGlCQUhGO1NBSEY7O01BUUEsSUFBRyxJQUFDLENBQUEsUUFBRCxJQUFjLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBM0I7UUFDRSxPQUFBLEdBQVUsSUFBQyxDQUFBLFFBQVEsQ0FBQztRQUNwQixJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLElBQXBCLElBQTZCLE9BQU8sQ0FBQyxVQUFSLEtBQXNCLElBQXREO1VBQ0UsSUFBRyxJQUFDLENBQUEsUUFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFyQjtBQUNFLG1CQUFPLElBQUMsQ0FBQSxRQUFRLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxLQUF4QixDQUE4QixJQUFBLEdBQU8sSUFBckMsRUFEVDtXQUFBLE1BQUE7bUJBR0UsR0FBRyxDQUFDLEtBQUosQ0FBVSxnREFBVixFQUE0RCxJQUFDLENBQUEsUUFBN0QsRUFIRjtXQURGO1NBQUEsTUFLSyxJQUFHLFNBQUg7VUFDSCxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQ0UsQ0FBQyxpREFBRCxFQUNDLG1DQURELEVBRUMsaUNBRkQsQ0FFbUMsQ0FBQyxJQUZwQyxDQUV5QyxHQUZ6QyxDQURGLEVBR2lEO1lBQy9DLE1BQUEsRUFBUSxDQUFDLFlBQUEsR0FBYSxPQUFPLENBQUMsUUFBdEIsRUFDQyxjQUFBLEdBQWUsT0FBTyxDQUFDLFVBRHhCLENBQ3FDLENBQUMsSUFEdEMsQ0FDMkMsSUFEM0MsQ0FEdUM7WUFHL0MsV0FBQSxFQUFhLElBSGtDO1dBSGpEO2lCQU9BLElBQUMsQ0FBQSxPQUFELENBQUEsRUFSRztTQUFBLE1BQUE7VUFVSCxJQUFDLENBQUEsWUFBRCxDQUFBO1VBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkLEVBQW9CO1lBQUEsU0FBQSxFQUFXLElBQVg7V0FBcEI7aUJBQ0EsR0FBRyxDQUFDLEtBQUosQ0FBVSwrQkFBVixFQVpHO1NBUFA7T0FBQSxNQUFBO1FBcUJFLEdBQUcsQ0FBQyxLQUFKLENBQVUsNEJBQVY7UUFDQSxJQUFDLENBQUEsWUFBRCxDQUFBO2VBQ0EsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFkLEVBdkJGOztJQVZZLENBblJkO0lBc1RBLFlBQUEsRUFBYyxTQUFDLFFBQUQ7QUFDWixVQUFBO01BQUEsR0FBRyxDQUFDLEtBQUosQ0FBVSxrQ0FBVixFQUE4QyxRQUE5QztNQUNBLEdBQUcsQ0FBQyxLQUFKLENBQVUsTUFBQSxHQUFNLENBQUMsUUFBUSxDQUFDLElBQVQsQ0FBQSxDQUFlLENBQUMsS0FBaEIsQ0FBc0IsSUFBdEIsQ0FBMkIsQ0FBQyxNQUE3QixDQUFOLEdBQTBDLFFBQXBEO0FBQ0E7QUFBQTtXQUFBLHNDQUFBOztBQUNFO1VBQ0UsUUFBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsY0FBWCxFQURiO1NBQUEsY0FBQTtVQUVNO0FBQ0osZ0JBQVUsSUFBQSxLQUFBLENBQU0sOEJBQUEsR0FBaUMsY0FBakMsR0FBZ0QsMkJBQWhELEdBQ3lCLENBRC9CLEVBSFo7O1FBTUEsSUFBRyxRQUFTLENBQUEsV0FBQSxDQUFaO1VBQ0UsTUFBQSxHQUFTLElBQUMsQ0FBQSxRQUFTLENBQUEsUUFBUyxDQUFBLElBQUEsQ0FBVDtVQUNuQixJQUFHLE9BQU8sTUFBUCxLQUFpQixRQUFwQjtZQUNFLGNBQUEsR0FBaUIsTUFBTSxDQUFDLHVCQUFQLENBQUE7WUFFakIsSUFBRyxRQUFTLENBQUEsSUFBQSxDQUFULEtBQWtCLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixXQUFwQixFQUFpQyxNQUFqQyxFQUF5QyxjQUF6QyxDQUFyQjs7b0JBQ2tCLENBQUUsYUFBbEIsQ0FBZ0MsUUFBUyxDQUFBLFdBQUEsQ0FBekMsRUFBdUQsTUFBdkQ7ZUFERjthQUhGO1dBRkY7U0FBQSxNQUFBO1VBUUUsT0FBQSxHQUFVLElBQUMsQ0FBQSxRQUFTLENBQUEsUUFBUyxDQUFBLElBQUEsQ0FBVDtVQUNwQixJQUFHLE9BQU8sT0FBUCxLQUFrQixVQUFyQjtZQUNFLE9BQUEsQ0FBUSxRQUFTLENBQUEsU0FBQSxDQUFqQixFQURGO1dBVEY7O1FBV0EsY0FBQSxHQUFpQixNQUFNLENBQUMsSUFBUCxDQUFZLElBQUMsQ0FBQSxTQUFiLENBQXVCLENBQUMsTUFBeEIsR0FBaUMsSUFBQyxDQUFBO1FBQ25ELElBQUcsY0FBQSxHQUFpQixDQUFwQjtVQUNFLEdBQUEsR0FBTSxNQUFNLENBQUMsSUFBUCxDQUFZLElBQUMsQ0FBQSxTQUFiLENBQXVCLENBQUMsSUFBeEIsQ0FBNkIsQ0FBQSxTQUFBLEtBQUE7bUJBQUEsU0FBQyxDQUFELEVBQUksQ0FBSjtBQUNqQyxxQkFBTyxLQUFDLENBQUEsU0FBVSxDQUFBLENBQUEsQ0FBRyxDQUFBLFdBQUEsQ0FBZCxHQUE2QixLQUFDLENBQUEsU0FBVSxDQUFBLENBQUEsQ0FBRyxDQUFBLFdBQUE7WUFEakI7VUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdCO0FBRU47QUFBQSxlQUFBLHdDQUFBOztZQUNFLEdBQUcsQ0FBQyxLQUFKLENBQVUsc0NBQVYsRUFBa0QsRUFBbEQ7WUFDQSxPQUFPLElBQUMsQ0FBQSxTQUFVLENBQUEsRUFBQTtBQUZwQixXQUhGOztRQU1BLElBQUMsQ0FBQSxTQUFVLENBQUEsUUFBUyxDQUFBLElBQUEsQ0FBVCxDQUFYLEdBQ0U7VUFBQSxNQUFBLEVBQVEsY0FBUjtVQUNBLFNBQUEsRUFBVyxJQUFJLENBQUMsR0FBTCxDQUFBLENBRFg7O1FBRUYsR0FBRyxDQUFDLEtBQUosQ0FBVSx3QkFBVixFQUFvQyxRQUFTLENBQUEsSUFBQSxDQUE3QztzQkFDQSxPQUFPLElBQUMsQ0FBQSxRQUFTLENBQUEsUUFBUyxDQUFBLElBQUEsQ0FBVDtBQTdCbkI7O0lBSFksQ0F0VGQ7SUF3VkEsa0JBQUEsRUFBb0IsU0FBQyxJQUFELEVBQU8sTUFBUCxFQUFlLGNBQWYsRUFBK0IsSUFBL0I7TUFDbEIsSUFBRyxDQUFJLElBQVA7UUFDRSxJQUFBLEdBQU8sTUFBTSxDQUFDLE9BQVAsQ0FBQSxFQURUOztBQUVBLGFBQU8sT0FBQSxDQUFRLFFBQVIsQ0FBaUIsQ0FBQyxVQUFsQixDQUE2QixLQUE3QixDQUFtQyxDQUFDLE1BQXBDLENBQTJDLENBQ2hELE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FEZ0QsRUFDOUIsSUFEOEIsRUFDeEIsY0FBYyxDQUFDLEdBRFMsRUFFaEQsY0FBYyxDQUFDLE1BRmlDLEVBRXpCLElBRnlCLENBRXBCLENBQUMsSUFGbUIsQ0FBQSxDQUEzQyxDQUUrQixDQUFDLE1BRmhDLENBRXVDLEtBRnZDO0lBSFcsQ0F4VnBCO0lBK1ZBLHNCQUFBLEVBQXdCLFNBQUE7QUFDdEIsVUFBQTtNQUFBLFVBQUEsR0FBYSxpQkFBaUIsQ0FBQyxrQkFBbEIsQ0FDWCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsZ0NBQWhCLENBQWlELENBQUMsS0FBbEQsQ0FBd0QsR0FBeEQsQ0FEVztNQUViLElBQUEsR0FDRTtRQUFBLFlBQUEsRUFBYyxVQUFkO1FBQ0EsYUFBQSxFQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsQ0FEZjtRQUVBLDJCQUFBLEVBQTZCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUMzQiwrQ0FEMkIsQ0FGN0I7UUFJQSxrQkFBQSxFQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FDbEIsc0NBRGtCLENBSnBCO1FBTUEsY0FBQSxFQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBTmhCOztBQU9GLGFBQU87SUFYZSxDQS9WeEI7SUE0V0Esa0JBQUEsRUFBb0IsU0FBQyxlQUFEO01BQUMsSUFBQyxDQUFBLGtCQUFEO0lBQUQsQ0E1V3BCO0lBOFdBLGtCQUFBLEVBQW9CLFNBQUMsTUFBRCxFQUFTLGNBQVQsRUFBeUIsS0FBekI7QUFDbEIsVUFBQTtNQUFBLFdBQUEsR0FBYyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCO01BQ2QsSUFBRyxDQUFJLEtBQUosSUFBYyxXQUFBLEtBQWUsTUFBaEM7UUFDRSxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQWQsQ0FBdUIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsa0JBQXZCLENBQXZCLEVBQ3VCLDRCQUR2QjtBQUVBLGVBSEY7O01BSUEsZUFBQSxHQUFrQixNQUFNLENBQUMsZ0NBQVAsQ0FBd0MsY0FBeEM7TUFDbEIsVUFBQSxHQUFhLGVBQWUsQ0FBQyxhQUFoQixDQUFBO01BQ2Isa0JBQUEsR0FBcUIsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLGtCQUFqQjtNQUNyQixJQUFHLHdCQUFBLENBQXlCLGtCQUF6QixFQUE2QyxVQUE3QyxDQUFIO1FBQ0UsR0FBRyxDQUFDLEtBQUosQ0FBVSx3Q0FBVixFQUFvRCxVQUFwRDtBQUNBLGVBRkY7O01BS0EsS0FBQSxHQUFRLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxRQUFuQixDQUFBO01BQ1IsSUFBQSxHQUFPLEtBQU0sQ0FBQSxjQUFjLENBQUMsR0FBZjtNQUNiLE1BQUEsR0FBUyxJQUFJLENBQUMsS0FBTCxDQUFXLGNBQWMsQ0FBQyxNQUFmLEdBQXdCLENBQW5DLEVBQXNDLGNBQWMsQ0FBQyxNQUFyRDtNQUNULElBQUcsTUFBQSxLQUFZLEdBQWY7UUFDRSxHQUFHLENBQUMsS0FBSixDQUFVLDBDQUFWLEVBQXNELE1BQXREO0FBQ0EsZUFGRjs7TUFHQSxNQUFBLEdBQVMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxjQUFjLENBQUMsTUFBMUIsRUFBa0MsSUFBSSxDQUFDLE1BQXZDO01BQ1QsSUFBRyxDQUFJLG9CQUFvQixDQUFDLElBQXJCLENBQTBCLE1BQTFCLENBQVA7UUFDRSxHQUFHLENBQUMsS0FBSixDQUFVLDBDQUFWLEVBQXNELE1BQXREO0FBQ0EsZUFGRjs7TUFJQSxPQUFBLEdBQ0U7UUFBQSxFQUFBLEVBQUksSUFBQyxDQUFBLGtCQUFELENBQW9CLFdBQXBCLEVBQWlDLE1BQWpDLEVBQXlDLGNBQXpDLENBQUo7UUFDQSxNQUFBLEVBQVEsV0FEUjtRQUVBLElBQUEsRUFBTSxNQUFNLENBQUMsT0FBUCxDQUFBLENBRk47UUFHQSxNQUFBLEVBQVEsTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUhSO1FBSUEsSUFBQSxFQUFNLGNBQWMsQ0FBQyxHQUpyQjtRQUtBLE1BQUEsRUFBUSxjQUFjLENBQUMsTUFMdkI7UUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLHNCQUFELENBQUEsQ0FOUjs7TUFRRixJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixDQUFkO0FBQ0EsYUFBVyxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ2pCLEtBQUMsQ0FBQSxRQUFTLENBQUEsT0FBTyxDQUFDLEVBQVIsQ0FBVixHQUF3QjtRQURQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO0lBbkNPLENBOVdwQjtJQW9aQSxZQUFBLEVBQWMsU0FBQyxVQUFELEVBQWEsS0FBYjtNQUNaLElBQUcsVUFBVSxDQUFDLE1BQVgsS0FBdUIsQ0FBdkIsSUFBNkIsQ0FBQSxLQUFBLEtBQWMsR0FBZCxJQUFBLEtBQUEsS0FBbUIsR0FBbkIsSUFBQSxLQUFBLEtBQXdCLEdBQXhCLENBQWhDOztVQUNFLFNBQVUsT0FBQSxDQUFRLGlCQUFSLENBQTBCLENBQUM7O1FBQ3JDLFVBQUEsR0FBYSxNQUFBLENBQU8sVUFBUCxFQUFtQixLQUFuQixFQUEwQjtVQUFBLEdBQUEsRUFBSyxNQUFMO1NBQTFCLEVBRmY7O0FBR0EsYUFBTztJQUpLLENBcFpkO0lBMFpBLGNBQUEsRUFBZ0IsU0FBQyxHQUFEO0FBQ2QsVUFBQTtNQURnQixxQkFBUSxxQ0FBZ0IsdUNBQWlCO01BQ3pELElBQUcsQ0FBSSxJQUFDLENBQUEsc0JBQXNCLENBQUMsSUFBeEIsQ0FBNkIsTUFBN0IsQ0FBUDtBQUNFLGVBQU8sR0FEVDs7TUFFQSxjQUFBLEdBQ0U7UUFBQSxHQUFBLEVBQUssY0FBYyxDQUFDLEdBQXBCO1FBQ0EsTUFBQSxFQUFRLGNBQWMsQ0FBQyxNQUR2Qjs7TUFFRixLQUFBLEdBQVEsTUFBTSxDQUFDLFNBQVAsQ0FBQSxDQUFrQixDQUFDLFFBQW5CLENBQUE7TUFDUixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEIsQ0FBSDtRQUVFLElBQUEsR0FBTyxLQUFNLENBQUEsY0FBYyxDQUFDLEdBQWY7UUFDYixjQUFBLEdBQWlCLDRCQUE0QixDQUFDLElBQTdCLENBQ2YsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLEVBQWMsY0FBYyxDQUFDLE1BQTdCLENBRGU7UUFFakIsSUFBRyxjQUFIO1VBQ0UsY0FBYyxDQUFDLE1BQWYsR0FBd0IsY0FBYyxDQUFDLEtBQWYsR0FBdUI7VUFDL0MsS0FBTSxDQUFBLGNBQWMsQ0FBQyxHQUFmLENBQU4sR0FBNEIsSUFBSSxDQUFDLEtBQUwsQ0FBVyxDQUFYLEVBQWMsY0FBYyxDQUFDLE1BQTdCLEVBRjlCO1NBTEY7O01BUUEsU0FBQSxHQUFZLElBQUMsQ0FBQSxrQkFBRCxDQUNWLGFBRFUsRUFDSyxNQURMLEVBQ2EsY0FEYixFQUM2QixLQUFLLENBQUMsSUFBTixDQUFXLElBQVgsQ0FEN0I7TUFFWixJQUFHLFNBQUEsSUFBYSxJQUFDLENBQUEsU0FBakI7UUFDRSxHQUFHLENBQUMsS0FBSixDQUFVLCtCQUFWLEVBQTJDLFNBQTNDO1FBRUEsT0FBQSxHQUFVLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLFNBQVUsQ0FBQSxTQUFBLENBQVcsQ0FBQSxRQUFBLENBQWpDLENBQTRDLENBQUEsU0FBQTtRQUN0RCxJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixrQ0FBaEIsQ0FBSDtBQUNFLGlCQUFPLElBQUMsQ0FBQSxZQUFELENBQWMsT0FBZCxFQUF1QixNQUF2QixFQURUO1NBQUEsTUFBQTtBQUdFLGlCQUFPLFFBSFQ7U0FKRjs7TUFRQSxPQUFBLEdBQ0U7UUFBQSxFQUFBLEVBQUksU0FBSjtRQUNBLE1BQUEsRUFBUSxNQURSO1FBRUEsTUFBQSxFQUFRLGFBRlI7UUFHQSxJQUFBLEVBQU0sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUhOO1FBSUEsTUFBQSxFQUFRLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FKUjtRQUtBLElBQUEsRUFBTSxjQUFjLENBQUMsR0FMckI7UUFNQSxNQUFBLEVBQVEsY0FBYyxDQUFDLE1BTnZCO1FBT0EsTUFBQSxFQUFRLElBQUMsQ0FBQSxzQkFBRCxDQUFBLENBUFI7O01BU0YsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsVUFBRCxDQUFZLE9BQVosQ0FBZDtBQUNBLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7VUFDakIsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isa0NBQWhCLENBQUg7bUJBQ0UsS0FBQyxDQUFBLFFBQVMsQ0FBQSxPQUFPLENBQUMsRUFBUixDQUFWLEdBQXdCLFNBQUMsT0FBRDtxQkFDdEIsT0FBQSxDQUFRLEtBQUMsQ0FBQSxZQUFELENBQWMsT0FBZCxFQUF1QixNQUF2QixDQUFSO1lBRHNCLEVBRDFCO1dBQUEsTUFBQTttQkFJRSxLQUFDLENBQUEsUUFBUyxDQUFBLE9BQU8sQ0FBQyxFQUFSLENBQVYsR0FBd0IsUUFKMUI7O1FBRGlCO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO0lBcENHLENBMVpoQjtJQXFjQSxjQUFBLEVBQWdCLFNBQUMsTUFBRCxFQUFTLGNBQVQ7QUFDZCxVQUFBO01BQUEsT0FBQSxHQUNFO1FBQUEsRUFBQSxFQUFJLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixhQUFwQixFQUFtQyxNQUFuQyxFQUEyQyxjQUEzQyxDQUFKO1FBQ0EsTUFBQSxFQUFRLGFBRFI7UUFFQSxJQUFBLEVBQU0sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUZOO1FBR0EsTUFBQSxFQUFRLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FIUjtRQUlBLElBQUEsRUFBTSxjQUFjLENBQUMsR0FKckI7UUFLQSxNQUFBLEVBQVEsY0FBYyxDQUFDLE1BTHZCO1FBTUEsTUFBQSxFQUFRLElBQUMsQ0FBQSxzQkFBRCxDQUFBLENBTlI7O01BUUYsSUFBQyxDQUFBLFlBQUQsQ0FBYyxJQUFDLENBQUEsVUFBRCxDQUFZLE9BQVosQ0FBZDtBQUNBLGFBQVcsSUFBQSxPQUFBLENBQVEsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7aUJBQ2pCLEtBQUMsQ0FBQSxRQUFTLENBQUEsT0FBTyxDQUFDLEVBQVIsQ0FBVixHQUF3QjtRQURQO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFSO0lBWEcsQ0FyY2hCO0lBbWRBLFNBQUEsRUFBVyxTQUFDLE1BQUQsRUFBUyxjQUFUO0FBQ1QsVUFBQTtNQUFBLE9BQUEsR0FDRTtRQUFBLEVBQUEsRUFBSSxJQUFDLENBQUEsa0JBQUQsQ0FBb0IsUUFBcEIsRUFBOEIsTUFBOUIsRUFBc0MsY0FBdEMsQ0FBSjtRQUNBLE1BQUEsRUFBUSxRQURSO1FBRUEsSUFBQSxFQUFNLE1BQU0sQ0FBQyxPQUFQLENBQUEsQ0FGTjtRQUdBLE1BQUEsRUFBUSxNQUFNLENBQUMsT0FBUCxDQUFBLENBSFI7UUFJQSxJQUFBLEVBQU0sY0FBYyxDQUFDLEdBSnJCO1FBS0EsTUFBQSxFQUFRLGNBQWMsQ0FBQyxNQUx2QjtRQU1BLE1BQUEsRUFBUSxJQUFDLENBQUEsc0JBQUQsQ0FBQSxDQU5SOztNQVFGLElBQUMsQ0FBQSxZQUFELENBQWMsSUFBQyxDQUFBLFVBQUQsQ0FBWSxPQUFaLENBQWQ7QUFDQSxhQUFXLElBQUEsT0FBQSxDQUFRLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO2lCQUNqQixLQUFDLENBQUEsUUFBUyxDQUFBLE9BQU8sQ0FBQyxFQUFSLENBQVYsR0FBd0I7UUFEUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUjtJQVhGLENBbmRYO0lBaWVBLFVBQUEsRUFBWSxTQUFDLE1BQUQsRUFBUyxjQUFUO0FBQ1YsVUFBQTtNQUFBLE1BQUEsR0FBUyxjQUFjLENBQUM7TUFDeEIsS0FBQSxHQUFRLE1BQU0sQ0FBQyxTQUFQLENBQUEsQ0FBa0IsQ0FBQyxRQUFuQixDQUFBO01BQ1IsS0FBSyxDQUFDLE1BQU4sQ0FBYSxjQUFjLENBQUMsR0FBZixHQUFxQixDQUFsQyxFQUFxQyxDQUFyQyxFQUF3QyxpQ0FBeEM7TUFDQSxLQUFLLENBQUMsTUFBTixDQUFhLGNBQWMsQ0FBQyxHQUFmLEdBQXFCLENBQWxDLEVBQXFDLENBQXJDLEVBQXdDLFFBQXhDO01BQ0EsT0FBQSxHQUNFO1FBQUEsRUFBQSxFQUFJLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixTQUFwQixFQUErQixNQUEvQixFQUF1QyxjQUF2QyxDQUFKO1FBQ0EsTUFBQSxFQUFRLFNBRFI7UUFFQSxJQUFBLEVBQU0sTUFBTSxDQUFDLE9BQVAsQ0FBQSxDQUZOO1FBR0EsTUFBQSxFQUFRLEtBQUssQ0FBQyxJQUFOLENBQVcsSUFBWCxDQUhSO1FBSUEsSUFBQSxFQUFNLGNBQWMsQ0FBQyxHQUFmLEdBQXFCLENBSjNCO1FBS0EsTUFBQSxFQUFRLENBTFI7UUFNQSxNQUFBLEVBQVEsSUFBQyxDQUFBLHNCQUFELENBQUEsQ0FOUjs7TUFRRixJQUFDLENBQUEsWUFBRCxDQUFjLElBQUMsQ0FBQSxVQUFELENBQVksT0FBWixDQUFkO0FBQ0EsYUFBVyxJQUFBLE9BQUEsQ0FBUSxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtpQkFDakIsS0FBQyxDQUFBLFFBQVMsQ0FBQSxPQUFPLENBQUMsRUFBUixDQUFWLEdBQXdCLFNBQUMsT0FBRDttQkFDdEIsT0FBQSxDQUFRO2NBQUMsU0FBQSxPQUFEO2NBQVUsUUFBQSxNQUFWO2NBQWtCLGdCQUFBLGNBQWxCO2FBQVI7VUFEc0I7UUFEUDtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBUjtJQWZELENBamVaO0lBb2ZBLGNBQUEsRUFBZ0IsU0FBQyxNQUFELEVBQVMsY0FBVDtNQUNkLElBQUcsQ0FBSSxNQUFQO1FBQ0UsTUFBQSxHQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsbUJBQWYsQ0FBQSxFQURYOztNQUVBLElBQUcsQ0FBSSxjQUFQO1FBQ0UsY0FBQSxHQUFpQixNQUFNLENBQUMsdUJBQVAsQ0FBQSxFQURuQjs7TUFFQSxJQUFHLElBQUMsQ0FBQSxlQUFKO1FBQ0UsSUFBQyxDQUFBLGVBQWUsQ0FBQyxPQUFqQixDQUFBLEVBREY7O01BRUEsSUFBQyxDQUFBLGVBQUQsR0FBdUIsSUFBQSxlQUFBLENBQUE7YUFDdkIsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsTUFBaEIsRUFBd0IsY0FBeEIsQ0FBdUMsQ0FBQyxJQUF4QyxDQUE2QyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsT0FBRDtVQUMzQyxLQUFDLENBQUEsZUFBZSxDQUFDLFFBQWpCLENBQTBCLE9BQTFCO1VBQ0EsSUFBRyxPQUFPLENBQUMsTUFBUixLQUFrQixDQUFyQjttQkFDRSxLQUFDLENBQUEsZUFBZSxDQUFDLFNBQWpCLENBQTJCLE9BQVEsQ0FBQSxDQUFBLENBQW5DLEVBREY7O1FBRjJDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUE3QztJQVJjLENBcGZoQjtJQWlnQkEsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTtNQUNBLElBQUcsSUFBQyxDQUFBLFFBQUo7ZUFDRSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBQSxFQURGOztJQUZPLENBamdCVDs7QUFiRiIsInNvdXJjZXNDb250ZW50IjpbIntEaXNwb3NhYmxlLCBDb21wb3NpdGVEaXNwb3NhYmxlLCBCdWZmZXJlZFByb2Nlc3N9ID0gcmVxdWlyZSAnYXRvbSdcbntzZWxlY3RvcnNNYXRjaFNjb3BlQ2hhaW59ID0gcmVxdWlyZSAnLi9zY29wZS1oZWxwZXJzJ1xue1NlbGVjdG9yfSA9IHJlcXVpcmUgJ3NlbGVjdG9yLWtpdCdcbkRlZmluaXRpb25zVmlldyA9IHJlcXVpcmUgJy4vZGVmaW5pdGlvbnMtdmlldydcblVzYWdlc1ZpZXcgPSByZXF1aXJlICcuL3VzYWdlcy12aWV3J1xuT3ZlcnJpZGVWaWV3ID0gcmVxdWlyZSAnLi9vdmVycmlkZS12aWV3J1xuUmVuYW1lVmlldyA9IHJlcXVpcmUgJy4vcmVuYW1lLXZpZXcnXG5JbnRlcnByZXRlckxvb2t1cCA9IHJlcXVpcmUgJy4vaW50ZXJwcmV0ZXJzLWxvb2t1cCdcbmxvZyA9IHJlcXVpcmUgJy4vbG9nJ1xuXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG5maWx0ZXIgPSB1bmRlZmluZWRcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzZWxlY3RvcjogJy5zb3VyY2UucHl0aG9uJ1xuICBkaXNhYmxlRm9yU2VsZWN0b3I6ICcuc291cmNlLnB5dGhvbiAuY29tbWVudCwgLnNvdXJjZS5weXRob24gLnN0cmluZydcbiAgaW5jbHVzaW9uUHJpb3JpdHk6IDJcbiAgc3VnZ2VzdGlvblByaW9yaXR5OiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uc3VnZ2VzdGlvblByaW9yaXR5JylcbiAgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IGZhbHNlXG4gIGNhY2hlU2l6ZTogMTBcblxuICBfYWRkRXZlbnRMaXN0ZW5lcjogKGVkaXRvciwgZXZlbnROYW1lLCBoYW5kbGVyKSAtPlxuICAgIGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgZWRpdG9yXG4gICAgZWRpdG9yVmlldy5hZGRFdmVudExpc3RlbmVyIGV2ZW50TmFtZSwgaGFuZGxlclxuICAgIGRpc3Bvc2FibGUgPSBuZXcgRGlzcG9zYWJsZSAtPlxuICAgICAgbG9nLmRlYnVnICdVbnN1YnNjcmliaW5nIGZyb20gZXZlbnQgbGlzdGVuZXIgJywgZXZlbnROYW1lLCBoYW5kbGVyXG4gICAgICBlZGl0b3JWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIgZXZlbnROYW1lLCBoYW5kbGVyXG4gICAgcmV0dXJuIGRpc3Bvc2FibGVcblxuICBfbm9FeGVjdXRhYmxlRXJyb3I6IChlcnJvcikgLT5cbiAgICBpZiBAcHJvdmlkZXJOb0V4ZWN1dGFibGVcbiAgICAgIHJldHVyblxuICAgIGxvZy53YXJuaW5nICdObyBweXRob24gZXhlY3V0YWJsZSBmb3VuZCcsIGVycm9yXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAnYXV0b2NvbXBsZXRlLXB5dGhvbiB1bmFibGUgdG8gZmluZCBweXRob24gYmluYXJ5LicsIHtcbiAgICAgIGRldGFpbDogXCJcIlwiUGxlYXNlIHNldCBwYXRoIHRvIHB5dGhvbiBleGVjdXRhYmxlIG1hbnVhbGx5IGluIHBhY2thZ2VcbiAgICAgIHNldHRpbmdzIGFuZCByZXN0YXJ0IHlvdXIgZWRpdG9yLiBCZSBzdXJlIHRvIG1pZ3JhdGUgb24gbmV3IHNldHRpbmdzXG4gICAgICBpZiBldmVyeXRoaW5nIHdvcmtlZCBvbiBwcmV2aW91cyB2ZXJzaW9uLlxuICAgICAgRGV0YWlsZWQgZXJyb3IgbWVzc2FnZTogI3tlcnJvcn1cblxuICAgICAgQ3VycmVudCBjb25maWc6ICN7YXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnB5dGhvblBhdGhzJyl9XCJcIlwiXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gICAgQHByb3ZpZGVyTm9FeGVjdXRhYmxlID0gdHJ1ZVxuXG4gIF9zcGF3bkRhZW1vbjogLT5cbiAgICBpbnRlcnByZXRlciA9IEludGVycHJldGVyTG9va3VwLmdldEludGVycHJldGVyKClcbiAgICBsb2cuZGVidWcgJ1VzaW5nIGludGVycHJldGVyJywgaW50ZXJwcmV0ZXJcbiAgICBAcHJvdmlkZXIgPSBuZXcgQnVmZmVyZWRQcm9jZXNzXG4gICAgICBjb21tYW5kOiBpbnRlcnByZXRlciBvciAncHl0aG9uJ1xuICAgICAgYXJnczogW19fZGlybmFtZSArICcvY29tcGxldGlvbi5weSddXG4gICAgICBzdGRvdXQ6IChkYXRhKSA9PlxuICAgICAgICBAX2Rlc2VyaWFsaXplKGRhdGEpXG4gICAgICBzdGRlcnI6IChkYXRhKSA9PlxuICAgICAgICBpZiBkYXRhLmluZGV4T2YoJ2lzIG5vdCByZWNvZ25pemVkIGFzIGFuIGludGVybmFsIG9yIGV4dGVybmFsJykgPiAtMVxuICAgICAgICAgIHJldHVybiBAX25vRXhlY3V0YWJsZUVycm9yKGRhdGEpXG4gICAgICAgIGxvZy5kZWJ1ZyBcImF1dG9jb21wbGV0ZS1weXRob24gdHJhY2ViYWNrIG91dHB1dDogI3tkYXRhfVwiXG4gICAgICAgIGlmIGRhdGEuaW5kZXhPZignamVkaScpID4gLTFcbiAgICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24ub3V0cHV0UHJvdmlkZXJFcnJvcnMnKVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAgICAgICAgICcnJ0xvb2tzIGxpa2UgdGhpcyBlcnJvciBvcmlnaW5hdGVkIGZyb20gSmVkaS4gUGxlYXNlIGRvIG5vdFxuICAgICAgICAgICAgICByZXBvcnQgc3VjaCBpc3N1ZXMgaW4gYXV0b2NvbXBsZXRlLXB5dGhvbiBpc3N1ZSB0cmFja2VyLiBSZXBvcnRcbiAgICAgICAgICAgICAgdGhlbSBkaXJlY3RseSB0byBKZWRpLiBUdXJuIG9mZiBgb3V0cHV0UHJvdmlkZXJFcnJvcnNgIHNldHRpbmdcbiAgICAgICAgICAgICAgdG8gaGlkZSBzdWNoIGVycm9ycyBpbiBmdXR1cmUuIFRyYWNlYmFjayBvdXRwdXQ6JycnLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogXCIje2RhdGF9XCIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlfSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgICAgICdhdXRvY29tcGxldGUtcHl0aG9uIHRyYWNlYmFjayBvdXRwdXQ6Jywge1xuICAgICAgICAgICAgICBkZXRhaWw6IFwiI3tkYXRhfVwiLFxuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZX0pXG5cbiAgICAgICAgbG9nLmRlYnVnIFwiRm9yY2luZyB0byByZXNvbHZlICN7T2JqZWN0LmtleXMoQHJlcXVlc3RzKS5sZW5ndGh9IHByb21pc2VzXCJcbiAgICAgICAgZm9yIHJlcXVlc3RJZCwgcmVzb2x2ZSBvZiBAcmVxdWVzdHNcbiAgICAgICAgICBpZiB0eXBlb2YgcmVzb2x2ZSA9PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICByZXNvbHZlKFtdKVxuICAgICAgICAgIGRlbGV0ZSBAcmVxdWVzdHNbcmVxdWVzdElkXVxuXG4gICAgICBleGl0OiAoY29kZSkgPT5cbiAgICAgICAgbG9nLndhcm5pbmcgJ1Byb2Nlc3MgZXhpdCB3aXRoJywgY29kZSwgQHByb3ZpZGVyXG4gICAgQHByb3ZpZGVyLm9uV2lsbFRocm93RXJyb3IgKHtlcnJvciwgaGFuZGxlfSkgPT5cbiAgICAgIGlmIGVycm9yLmNvZGUgaXMgJ0VOT0VOVCcgYW5kIGVycm9yLnN5c2NhbGwuaW5kZXhPZignc3Bhd24nKSBpcyAwXG4gICAgICAgIEBfbm9FeGVjdXRhYmxlRXJyb3IoZXJyb3IpXG4gICAgICAgIEBkaXNwb3NlKClcbiAgICAgICAgaGFuZGxlKClcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgZXJyb3JcblxuICAgIEBwcm92aWRlci5wcm9jZXNzPy5zdGRpbi5vbiAnZXJyb3InLCAoZXJyKSAtPlxuICAgICAgbG9nLmRlYnVnICdzdGRpbicsIGVyclxuXG4gICAgc2V0VGltZW91dCA9PlxuICAgICAgbG9nLmRlYnVnICdLaWxsaW5nIHB5dGhvbiBwcm9jZXNzIGFmdGVyIHRpbWVvdXQuLi4nXG4gICAgICBpZiBAcHJvdmlkZXIgYW5kIEBwcm92aWRlci5wcm9jZXNzXG4gICAgICAgIEBwcm92aWRlci5raWxsKClcbiAgICAsIDYwICogMTAgKiAxMDAwXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHJlcXVlc3RzID0ge31cbiAgICBAcmVzcG9uc2VzID0ge31cbiAgICBAcHJvdmlkZXIgPSBudWxsXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IHt9XG4gICAgQGRlZmluaXRpb25zVmlldyA9IG51bGxcbiAgICBAdXNhZ2VzVmlldyA9IG51bGxcbiAgICBAcmVuYW1lVmlldyA9IG51bGxcbiAgICBAc25pcHBldHNNYW5hZ2VyID0gbnVsbFxuXG4gICAgbG9nLmRlYnVnIFwiSW5pdCBhdXRvY29tcGxldGUtcHl0aG9uIHdpdGggcHJpb3JpdHkgI3tAc3VnZ2VzdGlvblByaW9yaXR5fVwiXG5cbiAgICB0cnlcbiAgICAgIEB0cmlnZ2VyQ29tcGxldGlvblJlZ2V4ID0gUmVnRXhwIGF0b20uY29uZmlnLmdldChcbiAgICAgICAgJ2F1dG9jb21wbGV0ZS1weXRob24udHJpZ2dlckNvbXBsZXRpb25SZWdleCcpXG4gICAgY2F0Y2ggZXJyXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgJycnYXV0b2NvbXBsZXRlLXB5dGhvbiBpbnZhbGlkIHJlZ2V4cCB0byB0cmlnZ2VyIGF1dG9jb21wbGV0aW9ucy5cbiAgICAgICAgRmFsbGluZyBiYWNrIHRvIGRlZmF1bHQgdmFsdWUuJycnLCB7XG4gICAgICAgIGRldGFpbDogXCJPcmlnaW5hbCBleGNlcHRpb246ICN7ZXJyfVwiXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlfSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi50cmlnZ2VyQ29tcGxldGlvblJlZ2V4JyxcbiAgICAgICAgICAgICAgICAgICAgICAnKFtcXC5cXCBdfFthLXpBLVpfXVthLXpBLVowLTlfXSopJylcbiAgICAgIEB0cmlnZ2VyQ29tcGxldGlvblJlZ2V4ID0gLyhbXFwuXFwgXXxbYS16QS1aX11bYS16QS1aMC05X10qKS9cblxuICAgIHNlbGVjdG9yID0gJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1weXRob25dJ1xuICAgIGF0b20uY29tbWFuZHMuYWRkIHNlbGVjdG9yLCAnYXV0b2NvbXBsZXRlLXB5dGhvbjpnby10by1kZWZpbml0aW9uJywgPT5cbiAgICAgIEBnb1RvRGVmaW5pdGlvbigpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgc2VsZWN0b3IsICdhdXRvY29tcGxldGUtcHl0aG9uOmNvbXBsZXRlLWFyZ3VtZW50cycsID0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIEBfY29tcGxldGVBcmd1bWVudHMoZWRpdG9yLCBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSwgdHJ1ZSlcblxuICAgIGF0b20uY29tbWFuZHMuYWRkIHNlbGVjdG9yLCAnYXV0b2NvbXBsZXRlLXB5dGhvbjpzaG93LXVzYWdlcycsID0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIGlmIEB1c2FnZXNWaWV3XG4gICAgICAgIEB1c2FnZXNWaWV3LmRlc3Ryb3koKVxuICAgICAgQHVzYWdlc1ZpZXcgPSBuZXcgVXNhZ2VzVmlldygpXG4gICAgICBAZ2V0VXNhZ2VzKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pLnRoZW4gKHVzYWdlcykgPT5cbiAgICAgICAgQHVzYWdlc1ZpZXcuc2V0SXRlbXModXNhZ2VzKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgc2VsZWN0b3IsICdhdXRvY29tcGxldGUtcHl0aG9uOm92ZXJyaWRlLW1ldGhvZCcsID0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIGlmIEBvdmVycmlkZVZpZXdcbiAgICAgICAgQG92ZXJyaWRlVmlldy5kZXN0cm95KClcbiAgICAgIEBvdmVycmlkZVZpZXcgPSBuZXcgT3ZlcnJpZGVWaWV3KClcbiAgICAgIEBnZXRNZXRob2RzKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pLnRoZW4gKHttZXRob2RzLCBpbmRlbnQsIGJ1ZmZlclBvc2l0aW9ufSkgPT5cbiAgICAgICAgQG92ZXJyaWRlVmlldy5pbmRlbnQgPSBpbmRlbnRcbiAgICAgICAgQG92ZXJyaWRlVmlldy5idWZmZXJQb3NpdGlvbiA9IGJ1ZmZlclBvc2l0aW9uXG4gICAgICAgIEBvdmVycmlkZVZpZXcuc2V0SXRlbXMobWV0aG9kcylcblxuICAgIGF0b20uY29tbWFuZHMuYWRkIHNlbGVjdG9yLCAnYXV0b2NvbXBsZXRlLXB5dGhvbjpyZW5hbWUnLCA9PlxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBidWZmZXJQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgICBAZ2V0VXNhZ2VzKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pLnRoZW4gKHVzYWdlcykgPT5cbiAgICAgICAgaWYgQHJlbmFtZVZpZXdcbiAgICAgICAgICBAcmVuYW1lVmlldy5kZXN0cm95KClcbiAgICAgICAgaWYgdXNhZ2VzLmxlbmd0aCA+IDBcbiAgICAgICAgICBAcmVuYW1lVmlldyA9IG5ldyBSZW5hbWVWaWV3KHVzYWdlcylcbiAgICAgICAgICBAcmVuYW1lVmlldy5vbklucHV0IChuZXdOYW1lKSA9PlxuICAgICAgICAgICAgZm9yIGZpbGVOYW1lLCB1c2FnZXMgb2YgXy5ncm91cEJ5KHVzYWdlcywgJ2ZpbGVOYW1lJylcbiAgICAgICAgICAgICAgW3Byb2plY3QsIF9yZWxhdGl2ZV0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZU5hbWUpXG4gICAgICAgICAgICAgIGlmIHByb2plY3RcbiAgICAgICAgICAgICAgICBAX3VwZGF0ZVVzYWdlc0luRmlsZShmaWxlTmFtZSwgdXNhZ2VzLCBuZXdOYW1lKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnICdJZ25vcmluZyBmaWxlIG91dHNpZGUgb2YgcHJvamVjdCcsIGZpbGVOYW1lXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBAdXNhZ2VzVmlld1xuICAgICAgICAgICAgQHVzYWdlc1ZpZXcuZGVzdHJveSgpXG4gICAgICAgICAgQHVzYWdlc1ZpZXcgPSBuZXcgVXNhZ2VzVmlldygpXG4gICAgICAgICAgQHVzYWdlc1ZpZXcuc2V0SXRlbXModXNhZ2VzKVxuXG4gICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICBAX2hhbmRsZUdyYW1tYXJDaGFuZ2VFdmVudChlZGl0b3IsIGVkaXRvci5nZXRHcmFtbWFyKCkpXG4gICAgICBlZGl0b3Iub25EaWRDaGFuZ2VHcmFtbWFyIChncmFtbWFyKSA9PlxuICAgICAgICBAX2hhbmRsZUdyYW1tYXJDaGFuZ2VFdmVudChlZGl0b3IsIGdyYW1tYXIpXG5cbiAgICBhdG9tLmNvbmZpZy5vbkRpZENoYW5nZSAnYXV0b2NvbXBsZXRlLXBsdXMuZW5hYmxlQXV0b0FjdGl2YXRpb24nLCA9PlxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZVRleHRFZGl0b3JzIChlZGl0b3IpID0+XG4gICAgICAgIEBfaGFuZGxlR3JhbW1hckNoYW5nZUV2ZW50KGVkaXRvciwgZWRpdG9yLmdldEdyYW1tYXIoKSlcblxuICBfdXBkYXRlVXNhZ2VzSW5GaWxlOiAoZmlsZU5hbWUsIHVzYWdlcywgbmV3TmFtZSkgLT5cbiAgICBjb2x1bW5PZmZzZXQgPSB7fVxuICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlsZU5hbWUsIGFjdGl2YXRlSXRlbTogZmFsc2UpLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgZm9yIHVzYWdlIGluIHVzYWdlc1xuICAgICAgICB7bmFtZSwgbGluZSwgY29sdW1ufSA9IHVzYWdlXG4gICAgICAgIGNvbHVtbk9mZnNldFtsaW5lXSA/PSAwXG4gICAgICAgIGxvZy5kZWJ1ZyAnUmVwbGFjaW5nJywgdXNhZ2UsICd3aXRoJywgbmV3TmFtZSwgJ2luJywgZWRpdG9yLmlkXG4gICAgICAgIGxvZy5kZWJ1ZyAnT2Zmc2V0IGZvciBsaW5lJywgbGluZSwgJ2lzJywgY29sdW1uT2Zmc2V0W2xpbmVdXG4gICAgICAgIGJ1ZmZlci5zZXRUZXh0SW5SYW5nZShbXG4gICAgICAgICAgW2xpbmUgLSAxLCBjb2x1bW4gKyBjb2x1bW5PZmZzZXRbbGluZV1dLFxuICAgICAgICAgIFtsaW5lIC0gMSwgY29sdW1uICsgbmFtZS5sZW5ndGggKyBjb2x1bW5PZmZzZXRbbGluZV1dLFxuICAgICAgICAgIF0sIG5ld05hbWUpXG4gICAgICAgIGNvbHVtbk9mZnNldFtsaW5lXSArPSBuZXdOYW1lLmxlbmd0aCAtIG5hbWUubGVuZ3RoXG4gICAgICBidWZmZXIuc2F2ZSgpXG5cblxuICBfc2hvd1NpZ25hdHVyZU92ZXJsYXk6IChldmVudCkgLT5cbiAgICBpZiBAbWFya2Vyc1xuICAgICAgZm9yIG1hcmtlciBpbiBAbWFya2Vyc1xuICAgICAgICBsb2cuZGVidWcgJ2Rlc3Ryb3lpbmcgb2xkIG1hcmtlcicsIG1hcmtlclxuICAgICAgICBtYXJrZXIuZGVzdHJveSgpXG4gICAgZWxzZVxuICAgICAgQG1hcmtlcnMgPSBbXVxuXG4gICAge3NlbGVjdG9yc01hdGNoU2NvcGVDaGFpbn0gPSByZXF1aXJlICcuL3Njb3BlLWhlbHBlcnMnXG4gICAge1NlbGVjdG9yfSA9IHJlcXVpcmUgJ3NlbGVjdG9yLWtpdCdcblxuICAgIGN1cnNvciA9IGV2ZW50LmN1cnNvclxuICAgIGVkaXRvciA9IGV2ZW50LmN1cnNvci5lZGl0b3JcbiAgICB3b3JkQnVmZmVyUmFuZ2UgPSBjdXJzb3IuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZSgpXG4gICAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFxuICAgICAgZXZlbnQubmV3QnVmZmVyUG9zaXRpb24pXG4gICAgc2NvcGVDaGFpbiA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZUNoYWluKClcblxuICAgIGRpc2FibGVGb3JTZWxlY3RvciA9IFwiI3tAZGlzYWJsZUZvclNlbGVjdG9yfSwgLnNvdXJjZS5weXRob24gLm51bWVyaWMsIC5zb3VyY2UucHl0aG9uIC5pbnRlZ2VyLCAuc291cmNlLnB5dGhvbiAuZGVjaW1hbCwgLnNvdXJjZS5weXRob24gLnB1bmN0dWF0aW9uLCAuc291cmNlLnB5dGhvbiAua2V5d29yZCwgLnNvdXJjZS5weXRob24gLnN0b3JhZ2UsIC5zb3VyY2UucHl0aG9uIC52YXJpYWJsZS5wYXJhbWV0ZXIsIC5zb3VyY2UucHl0aG9uIC5lbnRpdHkubmFtZVwiXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yID0gU2VsZWN0b3IuY3JlYXRlKGRpc2FibGVGb3JTZWxlY3RvcilcblxuICAgIGlmIHNlbGVjdG9yc01hdGNoU2NvcGVDaGFpbihkaXNhYmxlRm9yU2VsZWN0b3IsIHNjb3BlQ2hhaW4pXG4gICAgICBsb2cuZGVidWcgJ2RvIG5vdGhpbmcgZm9yIHRoaXMgc2VsZWN0b3InXG4gICAgICByZXR1cm5cblxuICAgIG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoXG4gICAgICB3b3JkQnVmZmVyUmFuZ2UsXG4gICAgICB7cGVyc2lzdGVudDogZmFsc2UsIGludmFsaWRhdGU6ICduZXZlcid9KVxuXG4gICAgQG1hcmtlcnMucHVzaChtYXJrZXIpXG5cbiAgICBnZXRUb29sdGlwID0gKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pID0+XG4gICAgICBwYXlsb2FkID1cbiAgICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ3Rvb2x0aXAnLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgICBsb29rdXA6ICd0b29sdGlwJ1xuICAgICAgICBwYXRoOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgIHNvdXJjZTogZWRpdG9yLmdldFRleHQoKVxuICAgICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICAgICAgY29uZmlnOiBAX2dlbmVyYXRlUmVxdWVzdENvbmZpZygpXG4gICAgICBAX3NlbmRSZXF1ZXN0KEBfc2VyaWFsaXplKHBheWxvYWQpKVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgICBAcmVxdWVzdHNbcGF5bG9hZC5pZF0gPSByZXNvbHZlXG5cbiAgICBnZXRUb29sdGlwKGVkaXRvciwgZXZlbnQubmV3QnVmZmVyUG9zaXRpb24pLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBpZiByZXN1bHRzLmxlbmd0aCA+IDBcbiAgICAgICAge3RleHQsIGZpbGVOYW1lLCBsaW5lLCBjb2x1bW4sIHR5cGUsIGRlc2NyaXB0aW9ufSA9IHJlc3VsdHNbMF1cblxuICAgICAgICBkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLnRyaW0oKVxuICAgICAgICBpZiBub3QgZGVzY3JpcHRpb25cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1dG9jb21wbGV0ZS1weXRob24tc3VnZ2VzdGlvbicpXG4gICAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGVzY3JpcHRpb24pKVxuICAgICAgICBkZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICAgICAgaXRlbTogdmlldyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnaGVhZCdcbiAgICAgICAgfSlcbiAgICAgICAgbG9nLmRlYnVnKCdkZWNvcmF0ZWQgbWFya2VyJywgbWFya2VyKVxuXG4gIF9oYW5kbGVHcmFtbWFyQ2hhbmdlRXZlbnQ6IChlZGl0b3IsIGdyYW1tYXIpIC0+XG4gICAgZXZlbnROYW1lID0gJ2tleXVwJ1xuICAgIGV2ZW50SWQgPSBcIiN7ZWRpdG9yLmlkfS4je2V2ZW50TmFtZX1cIlxuICAgIGlmIGdyYW1tYXIuc2NvcGVOYW1lID09ICdzb3VyY2UucHl0aG9uJ1xuXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uc2hvd1Rvb2x0aXBzJykgaXMgdHJ1ZVxuICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiAoZXZlbnQpID0+XG4gICAgICAgICAgQF9zaG93U2lnbmF0dXJlT3ZlcmxheShldmVudClcblxuICAgICAgaWYgbm90IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBsdXMuZW5hYmxlQXV0b0FjdGl2YXRpb24nKVxuICAgICAgICBsb2cuZGVidWcgJ0lnbm9yaW5nIGtleXVwIGV2ZW50cyBkdWUgdG8gYXV0b2NvbXBsZXRlLXBsdXMgc2V0dGluZ3MuJ1xuICAgICAgICByZXR1cm5cbiAgICAgIGRpc3Bvc2FibGUgPSBAX2FkZEV2ZW50TGlzdGVuZXIgZWRpdG9yLCBldmVudE5hbWUsIChlKSA9PlxuICAgICAgICBicmFja2V0SWRlbnRpZmllcnMgPVxuICAgICAgICAgICdVKzAwMjgnOiAncXdlcnR5J1xuICAgICAgICAgICdVKzAwMzgnOiAnZ2VybWFuJ1xuICAgICAgICAgICdVKzAwMzUnOiAnYXplcnR5J1xuICAgICAgICAgICdVKzAwMzknOiAnb3RoZXInXG4gICAgICAgIGlmIGUua2V5SWRlbnRpZmllciBvZiBicmFja2V0SWRlbnRpZmllcnNcbiAgICAgICAgICBsb2cuZGVidWcgJ1RyeWluZyB0byBjb21wbGV0ZSBhcmd1bWVudHMgb24ga2V5dXAgZXZlbnQnLCBlXG4gICAgICAgICAgQF9jb21wbGV0ZUFyZ3VtZW50cyhlZGl0b3IsIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKVxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBkaXNwb3NhYmxlXG4gICAgICBAc3Vic2NyaXB0aW9uc1tldmVudElkXSA9IGRpc3Bvc2FibGVcbiAgICAgIGxvZy5kZWJ1ZyAnU3Vic2NyaWJlZCBvbiBldmVudCcsIGV2ZW50SWRcbiAgICBlbHNlXG4gICAgICBpZiBldmVudElkIG9mIEBzdWJzY3JpcHRpb25zXG4gICAgICAgIEBzdWJzY3JpcHRpb25zW2V2ZW50SWRdLmRpc3Bvc2UoKVxuICAgICAgICBsb2cuZGVidWcgJ1Vuc3Vic2NyaWJlZCBmcm9tIGV2ZW50JywgZXZlbnRJZFxuXG4gIF9zZXJpYWxpemU6IChyZXF1ZXN0KSAtPlxuICAgIGxvZy5kZWJ1ZyAnU2VyaWFsaXppbmcgcmVxdWVzdCB0byBiZSBzZW50IHRvIEplZGknLCByZXF1ZXN0XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpXG5cbiAgX3NlbmRSZXF1ZXN0OiAoZGF0YSwgcmVzcGF3bmVkKSAtPlxuICAgIGxvZy5kZWJ1ZyAnUGVuZGluZyByZXF1ZXN0czonLCBPYmplY3Qua2V5cyhAcmVxdWVzdHMpLmxlbmd0aCwgQHJlcXVlc3RzXG4gICAgaWYgT2JqZWN0LmtleXMoQHJlcXVlc3RzKS5sZW5ndGggPiAxMFxuICAgICAgbG9nLmRlYnVnICdDbGVhbmluZyB1cCByZXF1ZXN0IHF1ZXVlIHRvIGF2b2lkIG92ZXJmbG93LCBpZ25vcmluZyByZXF1ZXN0J1xuICAgICAgQHJlcXVlc3RzID0ge31cbiAgICAgIGlmIEBwcm92aWRlciBhbmQgQHByb3ZpZGVyLnByb2Nlc3NcbiAgICAgICAgbG9nLmRlYnVnICdLaWxsaW5nIHB5dGhvbiBwcm9jZXNzJ1xuICAgICAgICBAcHJvdmlkZXIua2lsbCgpXG4gICAgICAgIHJldHVyblxuXG4gICAgaWYgQHByb3ZpZGVyIGFuZCBAcHJvdmlkZXIucHJvY2Vzc1xuICAgICAgcHJvY2VzcyA9IEBwcm92aWRlci5wcm9jZXNzXG4gICAgICBpZiBwcm9jZXNzLmV4aXRDb2RlID09IG51bGwgYW5kIHByb2Nlc3Muc2lnbmFsQ29kZSA9PSBudWxsXG4gICAgICAgIGlmIEBwcm92aWRlci5wcm9jZXNzLnBpZFxuICAgICAgICAgIHJldHVybiBAcHJvdmlkZXIucHJvY2Vzcy5zdGRpbi53cml0ZShkYXRhICsgJ1xcbicpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsb2cuZGVidWcgJ0F0dGVtcHQgdG8gY29tbXVuaWNhdGUgd2l0aCB0ZXJtaW5hdGVkIHByb2Nlc3MnLCBAcHJvdmlkZXJcbiAgICAgIGVsc2UgaWYgcmVzcGF3bmVkXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICAgIFtcIkZhaWxlZCB0byBzcGF3biBkYWVtb24gZm9yIGF1dG9jb21wbGV0ZS1weXRob24uXCJcbiAgICAgICAgICAgXCJDb21wbGV0aW9ucyB3aWxsIG5vdCB3b3JrIGFueW1vcmVcIlxuICAgICAgICAgICBcInVubGVzcyB5b3UgcmVzdGFydCB5b3VyIGVkaXRvci5cIl0uam9pbignICcpLCB7XG4gICAgICAgICAgZGV0YWlsOiBbXCJleGl0Q29kZTogI3twcm9jZXNzLmV4aXRDb2RlfVwiXG4gICAgICAgICAgICAgICAgICAgXCJzaWduYWxDb2RlOiAje3Byb2Nlc3Muc2lnbmFsQ29kZX1cIl0uam9pbignXFxuJyksXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWV9KVxuICAgICAgICBAZGlzcG9zZSgpXG4gICAgICBlbHNlXG4gICAgICAgIEBfc3Bhd25EYWVtb24oKVxuICAgICAgICBAX3NlbmRSZXF1ZXN0KGRhdGEsIHJlc3Bhd25lZDogdHJ1ZSlcbiAgICAgICAgbG9nLmRlYnVnICdSZS1zcGF3bmluZyBweXRob24gcHJvY2Vzcy4uLidcbiAgICBlbHNlXG4gICAgICBsb2cuZGVidWcgJ1NwYXduaW5nIHB5dGhvbiBwcm9jZXNzLi4uJ1xuICAgICAgQF9zcGF3bkRhZW1vbigpXG4gICAgICBAX3NlbmRSZXF1ZXN0KGRhdGEpXG5cbiAgX2Rlc2VyaWFsaXplOiAocmVzcG9uc2UpIC0+XG4gICAgbG9nLmRlYnVnICdEZXNlcmVhbGl6aW5nIHJlc3BvbnNlIGZyb20gSmVkaScsIHJlc3BvbnNlXG4gICAgbG9nLmRlYnVnIFwiR290ICN7cmVzcG9uc2UudHJpbSgpLnNwbGl0KCdcXG4nKS5sZW5ndGh9IGxpbmVzXCJcbiAgICBmb3IgcmVzcG9uc2VTb3VyY2UgaW4gcmVzcG9uc2UudHJpbSgpLnNwbGl0KCdcXG4nKVxuICAgICAgdHJ5XG4gICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZVNvdXJjZSlcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXCJcIkZhaWxlZCB0byBwYXJzZSBKU09OIGZyb20gXFxcIiN7cmVzcG9uc2VTb3VyY2V9XFxcIi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yaWdpbmFsIGV4Y2VwdGlvbjogI3tlfVwiXCJcIilcblxuICAgICAgaWYgcmVzcG9uc2VbJ2FyZ3VtZW50cyddXG4gICAgICAgIGVkaXRvciA9IEByZXF1ZXN0c1tyZXNwb25zZVsnaWQnXV1cbiAgICAgICAgaWYgdHlwZW9mIGVkaXRvciA9PSAnb2JqZWN0J1xuICAgICAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgICAgICAjIENvbXBhcmUgcmVzcG9uc2UgSUQgd2l0aCBjdXJyZW50IHN0YXRlIHRvIGF2b2lkIHN0YWxlIGNvbXBsZXRpb25zXG4gICAgICAgICAgaWYgcmVzcG9uc2VbJ2lkJ10gPT0gQF9nZW5lcmF0ZVJlcXVlc3RJZCgnYXJndW1lbnRzJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgICAgICAgIEBzbmlwcGV0c01hbmFnZXI/Lmluc2VydFNuaXBwZXQocmVzcG9uc2VbJ2FyZ3VtZW50cyddLCBlZGl0b3IpXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUgPSBAcmVxdWVzdHNbcmVzcG9uc2VbJ2lkJ11dXG4gICAgICAgIGlmIHR5cGVvZiByZXNvbHZlID09ICdmdW5jdGlvbidcbiAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlWydyZXN1bHRzJ10pXG4gICAgICBjYWNoZVNpemVEZWx0YSA9IE9iamVjdC5rZXlzKEByZXNwb25zZXMpLmxlbmd0aCA+IEBjYWNoZVNpemVcbiAgICAgIGlmIGNhY2hlU2l6ZURlbHRhID4gMFxuICAgICAgICBpZHMgPSBPYmplY3Qua2V5cyhAcmVzcG9uc2VzKS5zb3J0IChhLCBiKSA9PlxuICAgICAgICAgIHJldHVybiBAcmVzcG9uc2VzW2FdWyd0aW1lc3RhbXAnXSAtIEByZXNwb25zZXNbYl1bJ3RpbWVzdGFtcCddXG4gICAgICAgIGZvciBpZCBpbiBpZHMuc2xpY2UoMCwgY2FjaGVTaXplRGVsdGEpXG4gICAgICAgICAgbG9nLmRlYnVnICdSZW1vdmluZyBvbGQgaXRlbSBmcm9tIGNhY2hlIHdpdGggSUQnLCBpZFxuICAgICAgICAgIGRlbGV0ZSBAcmVzcG9uc2VzW2lkXVxuICAgICAgQHJlc3BvbnNlc1tyZXNwb25zZVsnaWQnXV0gPVxuICAgICAgICBzb3VyY2U6IHJlc3BvbnNlU291cmNlXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICAgICAgbG9nLmRlYnVnICdDYWNoZWQgcmVxdWVzdCB3aXRoIElEJywgcmVzcG9uc2VbJ2lkJ11cbiAgICAgIGRlbGV0ZSBAcmVxdWVzdHNbcmVzcG9uc2VbJ2lkJ11dXG5cbiAgX2dlbmVyYXRlUmVxdWVzdElkOiAodHlwZSwgZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgdGV4dCkgLT5cbiAgICBpZiBub3QgdGV4dFxuICAgICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICByZXR1cm4gcmVxdWlyZSgnY3J5cHRvJykuY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKFtcbiAgICAgIGVkaXRvci5nZXRQYXRoKCksIHRleHQsIGJ1ZmZlclBvc2l0aW9uLnJvdyxcbiAgICAgIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiwgdHlwZV0uam9pbigpKS5kaWdlc3QoJ2hleCcpXG5cbiAgX2dlbmVyYXRlUmVxdWVzdENvbmZpZzogLT5cbiAgICBleHRyYVBhdGhzID0gSW50ZXJwcmV0ZXJMb29rdXAuYXBwbHlTdWJzdGl0dXRpb25zKFxuICAgICAgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLmV4dHJhUGF0aHMnKS5zcGxpdCgnOycpKVxuICAgIGFyZ3MgPVxuICAgICAgJ2V4dHJhUGF0aHMnOiBleHRyYVBhdGhzXG4gICAgICAndXNlU25pcHBldHMnOiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24udXNlU25pcHBldHMnKVxuICAgICAgJ2Nhc2VJbnNlbnNpdGl2ZUNvbXBsZXRpb24nOiBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAgICdhdXRvY29tcGxldGUtcHl0aG9uLmNhc2VJbnNlbnNpdGl2ZUNvbXBsZXRpb24nKVxuICAgICAgJ3Nob3dEZXNjcmlwdGlvbnMnOiBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAgICdhdXRvY29tcGxldGUtcHl0aG9uLnNob3dEZXNjcmlwdGlvbnMnKVxuICAgICAgJ2Z1enp5TWF0Y2hlcic6IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5mdXp6eU1hdGNoZXInKVxuICAgIHJldHVybiBhcmdzXG5cbiAgc2V0U25pcHBldHNNYW5hZ2VyOiAoQHNuaXBwZXRzTWFuYWdlcikgLT5cblxuICBfY29tcGxldGVBcmd1bWVudHM6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBmb3JjZSkgLT5cbiAgICB1c2VTbmlwcGV0cyA9IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi51c2VTbmlwcGV0cycpXG4gICAgaWYgbm90IGZvcmNlIGFuZCB1c2VTbmlwcGV0cyA9PSAnbm9uZSdcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvcicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXV0b2NvbXBsZXRlLXBsdXM6YWN0aXZhdGUnKVxuICAgICAgcmV0dXJuXG4gICAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKGJ1ZmZlclBvc2l0aW9uKVxuICAgIHNjb3BlQ2hhaW4gPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVDaGFpbigpXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yID0gU2VsZWN0b3IuY3JlYXRlKEBkaXNhYmxlRm9yU2VsZWN0b3IpXG4gICAgaWYgc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWluKGRpc2FibGVGb3JTZWxlY3Rvciwgc2NvcGVDaGFpbilcbiAgICAgIGxvZy5kZWJ1ZyAnSWdub3JpbmcgYXJndW1lbnQgY29tcGxldGlvbiBpbnNpZGUgb2YnLCBzY29wZUNoYWluXG4gICAgICByZXR1cm5cblxuICAgICMgd2UgZG9uJ3Qgd2FudCB0byBjb21wbGV0ZSBhcmd1bWVudHMgaW5zaWRlIG9mIGV4aXN0aW5nIGNvZGVcbiAgICBsaW5lcyA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRMaW5lcygpXG4gICAgbGluZSA9IGxpbmVzW2J1ZmZlclBvc2l0aW9uLnJvd11cbiAgICBwcmVmaXggPSBsaW5lLnNsaWNlKGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiAtIDEsIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbilcbiAgICBpZiBwcmVmaXggaXNudCAnKCdcbiAgICAgIGxvZy5kZWJ1ZyAnSWdub3JpbmcgYXJndW1lbnQgY29tcGxldGlvbiB3aXRoIHByZWZpeCcsIHByZWZpeFxuICAgICAgcmV0dXJuXG4gICAgc3VmZml4ID0gbGluZS5zbGljZSBidWZmZXJQb3NpdGlvbi5jb2x1bW4sIGxpbmUubGVuZ3RoXG4gICAgaWYgbm90IC9eKFxcKSg/OiR8XFxzKXxcXHN8JCkvLnRlc3Qoc3VmZml4KVxuICAgICAgbG9nLmRlYnVnICdJZ25vcmluZyBhcmd1bWVudCBjb21wbGV0aW9uIHdpdGggc3VmZml4Jywgc3VmZml4XG4gICAgICByZXR1cm5cblxuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ2FyZ3VtZW50cycsIGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICBsb29rdXA6ICdhcmd1bWVudHMnXG4gICAgICBwYXRoOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBzb3VyY2U6IGVkaXRvci5nZXRUZXh0KClcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICAgIGNvbmZpZzogQF9nZW5lcmF0ZVJlcXVlc3RDb25maWcoKVxuXG4gICAgQF9zZW5kUmVxdWVzdChAX3NlcmlhbGl6ZShwYXlsb2FkKSlcbiAgICByZXR1cm4gbmV3IFByb21pc2UgPT5cbiAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IGVkaXRvclxuXG4gIF9mdXp6eUZpbHRlcjogKGNhbmRpZGF0ZXMsIHF1ZXJ5KSAtPlxuICAgIGlmIGNhbmRpZGF0ZXMubGVuZ3RoIGlzbnQgMCBhbmQgcXVlcnkgbm90IGluIFsnICcsICcuJywgJygnXVxuICAgICAgZmlsdGVyID89IHJlcXVpcmUoJ2Z1enphbGRyaW4tcGx1cycpLmZpbHRlclxuICAgICAgY2FuZGlkYXRlcyA9IGZpbHRlcihjYW5kaWRhdGVzLCBxdWVyeSwga2V5OiAndGV4dCcpXG4gICAgcmV0dXJuIGNhbmRpZGF0ZXNcblxuICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH0pIC0+XG4gICAgaWYgbm90IEB0cmlnZ2VyQ29tcGxldGlvblJlZ2V4LnRlc3QocHJlZml4KVxuICAgICAgcmV0dXJuIFtdXG4gICAgYnVmZmVyUG9zaXRpb24gPVxuICAgICAgcm93OiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgbGluZXMgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TGluZXMoKVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5mdXp6eU1hdGNoZXInKVxuICAgICAgIyB3ZSB3YW50IHRvIGRvIG91ciBvd24gZmlsdGVyaW5nLCBoaWRlIGFueSBleGlzdGluZyBzdWZmaXggZnJvbSBKZWRpXG4gICAgICBsaW5lID0gbGluZXNbYnVmZmVyUG9zaXRpb24ucm93XVxuICAgICAgbGFzdElkZW50aWZpZXIgPSAvXFwuP1thLXpBLVpfXVthLXpBLVowLTlfXSokLy5leGVjKFxuICAgICAgICBsaW5lLnNsaWNlIDAsIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbilcbiAgICAgIGlmIGxhc3RJZGVudGlmaWVyXG4gICAgICAgIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiA9IGxhc3RJZGVudGlmaWVyLmluZGV4ICsgMVxuICAgICAgICBsaW5lc1tidWZmZXJQb3NpdGlvbi5yb3ddID0gbGluZS5zbGljZSgwLCBidWZmZXJQb3NpdGlvbi5jb2x1bW4pXG4gICAgcmVxdWVzdElkID0gQF9nZW5lcmF0ZVJlcXVlc3RJZChcbiAgICAgICdjb21wbGV0aW9ucycsIGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIGxpbmVzLmpvaW4oJ1xcbicpKVxuICAgIGlmIHJlcXVlc3RJZCBvZiBAcmVzcG9uc2VzXG4gICAgICBsb2cuZGVidWcgJ1VzaW5nIGNhY2hlZCByZXNwb25zZSB3aXRoIElEJywgcmVxdWVzdElkXG4gICAgICAjIFdlIGhhdmUgdG8gcGFyc2UgSlNPTiBvbiBlYWNoIHJlcXVlc3QgaGVyZSB0byBwYXNzIG9ubHkgYSBjb3B5XG4gICAgICBtYXRjaGVzID0gSlNPTi5wYXJzZShAcmVzcG9uc2VzW3JlcXVlc3RJZF1bJ3NvdXJjZSddKVsncmVzdWx0cyddXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uZnV6enlNYXRjaGVyJylcbiAgICAgICAgcmV0dXJuIEBfZnV6enlGaWx0ZXIobWF0Y2hlcywgcHJlZml4KVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gbWF0Y2hlc1xuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IHJlcXVlc3RJZFxuICAgICAgcHJlZml4OiBwcmVmaXhcbiAgICAgIGxvb2t1cDogJ2NvbXBsZXRpb25zJ1xuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgc291cmNlOiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgICBjb25maWc6IEBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnKClcblxuICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLmZ1enp5TWF0Y2hlcicpXG4gICAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IChtYXRjaGVzKSA9PlxuICAgICAgICAgIHJlc29sdmUoQF9mdXp6eUZpbHRlcihtYXRjaGVzLCBwcmVmaXgpKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVxdWVzdHNbcGF5bG9hZC5pZF0gPSByZXNvbHZlXG5cbiAgZ2V0RGVmaW5pdGlvbnM6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ2RlZmluaXRpb25zJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIGxvb2t1cDogJ2RlZmluaXRpb25zJ1xuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgc291cmNlOiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgICBjb25maWc6IEBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnKClcblxuICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgQHJlcXVlc3RzW3BheWxvYWQuaWRdID0gcmVzb2x2ZVxuXG4gIGdldFVzYWdlczogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgcGF5bG9hZCA9XG4gICAgICBpZDogQF9nZW5lcmF0ZVJlcXVlc3RJZCgndXNhZ2VzJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIGxvb2t1cDogJ3VzYWdlcydcbiAgICAgIHBhdGg6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHNvdXJjZTogZWRpdG9yLmdldFRleHQoKVxuICAgICAgbGluZTogYnVmZmVyUG9zaXRpb24ucm93XG4gICAgICBjb2x1bW46IGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuICAgICAgY29uZmlnOiBAX2dlbmVyYXRlUmVxdWVzdENvbmZpZygpXG5cbiAgICBAX3NlbmRSZXF1ZXN0KEBfc2VyaWFsaXplKHBheWxvYWQpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IHJlc29sdmVcblxuICBnZXRNZXRob2RzOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICBpbmRlbnQgPSBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICBsaW5lcyA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRMaW5lcygpXG4gICAgbGluZXMuc3BsaWNlKGJ1ZmZlclBvc2l0aW9uLnJvdyArIDEsIDAsIFwiICBkZWYgX19hdXRvY29tcGxldGVfcHl0aG9uKHMpOlwiKVxuICAgIGxpbmVzLnNwbGljZShidWZmZXJQb3NpdGlvbi5yb3cgKyAyLCAwLCBcIiAgICBzLlwiKVxuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ21ldGhvZHMnLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgbG9va3VwOiAnbWV0aG9kcydcbiAgICAgIHBhdGg6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHNvdXJjZTogbGluZXMuam9pbignXFxuJylcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvdyArIDJcbiAgICAgIGNvbHVtbjogNlxuICAgICAgY29uZmlnOiBAX2dlbmVyYXRlUmVxdWVzdENvbmZpZygpXG5cbiAgICBAX3NlbmRSZXF1ZXN0KEBfc2VyaWFsaXplKHBheWxvYWQpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IChtZXRob2RzKSAtPlxuICAgICAgICByZXNvbHZlKHttZXRob2RzLCBpbmRlbnQsIGJ1ZmZlclBvc2l0aW9ufSlcblxuICBnb1RvRGVmaW5pdGlvbjogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgaWYgbm90IGVkaXRvclxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgbm90IGJ1ZmZlclBvc2l0aW9uXG4gICAgICBidWZmZXJQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgaWYgQGRlZmluaXRpb25zVmlld1xuICAgICAgQGRlZmluaXRpb25zVmlldy5kZXN0cm95KClcbiAgICBAZGVmaW5pdGlvbnNWaWV3ID0gbmV3IERlZmluaXRpb25zVmlldygpXG4gICAgQGdldERlZmluaXRpb25zKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAZGVmaW5pdGlvbnNWaWV3LnNldEl0ZW1zKHJlc3VsdHMpXG4gICAgICBpZiByZXN1bHRzLmxlbmd0aCA9PSAxXG4gICAgICAgIEBkZWZpbml0aW9uc1ZpZXcuY29uZmlybWVkKHJlc3VsdHNbMF0pXG5cbiAgZGlzcG9zZTogLT5cbiAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgaWYgQHByb3ZpZGVyXG4gICAgICBAcHJvdmlkZXIua2lsbCgpXG4iXX0=
