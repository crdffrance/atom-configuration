(function() {
  var log;

  log = require('./log');

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
      disposable = new this.Disposable(function() {
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
      var interpreter, ref;
      interpreter = this.InterpreterLookup.getInterpreter();
      log.debug('Using interpreter', interpreter);
      this.provider = new this.BufferedProcess({
        command: interpreter || 'python',
        args: [__dirname + '/completion.py'],
        stdout: (function(_this) {
          return function(data) {
            return _this._deserialize(data);
          };
        })(this),
        stderr: (function(_this) {
          return function(data) {
            var ref, requestId, resolve, results1;
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
            ref = _this.requests;
            results1 = [];
            for (requestId in ref) {
              resolve = ref[requestId];
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
      if ((ref = this.provider.process) != null) {
        ref.stdin.on('error', function(err) {
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
    load: function() {
      if (!this.constructed) {
        this.constructor();
      }
      return this;
    },
    constructor: function() {
      var err, ref, selector;
      ref = require('atom'), this.Disposable = ref.Disposable, this.CompositeDisposable = ref.CompositeDisposable, this.BufferedProcess = ref.BufferedProcess;
      this.selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;
      this.Selector = require('selector-kit').Selector;
      this.DefinitionsView = require('./definitions-view');
      this.UsagesView = require('./usages-view');
      this.OverrideView = require('./override-view');
      this.RenameView = require('./rename-view');
      this.InterpreterLookup = require('./interpreters-lookup');
      this._ = require('underscore');
      this.filter = require('fuzzaldrin-plus').filter;
      this.requests = {};
      this.responses = {};
      this.provider = null;
      this.disposables = new this.CompositeDisposable;
      this.subscriptions = {};
      this.definitionsView = null;
      this.usagesView = null;
      this.renameView = null;
      this.constructed = true;
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
          _this.usagesView = new _this.UsagesView();
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
          _this.overrideView = new _this.OverrideView();
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
              _this.renameView = new _this.RenameView(usages);
              return _this.renameView.onInput(function(newName) {
                var _relative, fileName, project, ref1, ref2, results1;
                ref1 = _this._.groupBy(usages, 'fileName');
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
              _this.usagesView = new _this.UsagesView();
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
      var cursor, disableForSelector, editor, getTooltip, i, len, marker, ref, scopeChain, scopeDescriptor, wordBufferRange;
      if (this.markers) {
        ref = this.markers;
        for (i = 0, len = ref.length; i < len; i++) {
          marker = ref[i];
          log.debug('destroying old marker', marker);
          marker.destroy();
        }
      } else {
        this.markers = [];
      }
      cursor = event.cursor;
      editor = event.cursor.editor;
      wordBufferRange = cursor.getCurrentWordBufferRange();
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(event.newBufferPosition);
      scopeChain = scopeDescriptor.getScopeChain();
      disableForSelector = this.disableForSelector + ", .source.python .numeric, .source.python .integer, .source.python .decimal, .source.python .punctuation, .source.python .keyword, .source.python .storage, .source.python .variable.parameter, .source.python .entity.name";
      disableForSelector = this.Selector.create(disableForSelector);
      if (this.selectorsMatchScopeChain(disableForSelector, scopeChain)) {
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
          var column, decoration, description, fileName, line, ref1, text, type, view;
          if (results.length > 0) {
            ref1 = results[0], text = ref1.text, fileName = ref1.fileName, line = ref1.line, column = ref1.column, type = ref1.type, description = ref1.description;
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
      var bufferPosition, cacheSizeDelta, e, editor, i, id, ids, j, len, len1, ref, ref1, ref2, resolve, responseSource, results1;
      log.debug('Deserealizing response from Jedi', response);
      log.debug("Got " + (response.trim().split('\n').length) + " lines");
      ref = response.trim().split('\n');
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        responseSource = ref[i];
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
              if ((ref1 = this.snippetsManager) != null) {
                ref1.insertSnippet(response['arguments'], editor);
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
          ref2 = ids.slice(0, cacheSizeDelta);
          for (j = 0, len1 = ref2.length; j < len1; j++) {
            id = ref2[j];
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
      extraPaths = this.InterpreterLookup.applySubstitutions(atom.config.get('autocomplete-python.extraPaths').split(';'));
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
      disableForSelector = this.Selector.create(this.disableForSelector);
      if (this.selectorsMatchScopeChain(disableForSelector, scopeChain)) {
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
        candidates = this.filter(candidates, query, {
          key: 'text'
        });
      }
      return candidates;
    },
    getSuggestions: function(arg) {
      var bufferPosition, editor, lastIdentifier, line, lines, matches, payload, prefix, requestId, scopeDescriptor;
      editor = arg.editor, bufferPosition = arg.bufferPosition, scopeDescriptor = arg.scopeDescriptor, prefix = arg.prefix;
      this.load();
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
      this.definitionsView = new this.DefinitionsView();
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
      if (this.disposables) {
        this.disposables.dispose();
      }
      if (this.provider) {
        return this.provider.kill();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9wcm92aWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFFTixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLGdCQUFWO0lBQ0Esa0JBQUEsRUFBb0IsaURBRHBCO0lBRUEsaUJBQUEsRUFBbUIsQ0FGbkI7SUFHQSxrQkFBQSxFQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLENBSHBCO0lBSUEsb0JBQUEsRUFBc0IsS0FKdEI7SUFLQSxTQUFBLEVBQVcsRUFMWDtJQU9BLGlCQUFBLEVBQW1CLFNBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsT0FBcEI7QUFDakIsVUFBQTtNQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7TUFDYixVQUFVLENBQUMsZ0JBQVgsQ0FBNEIsU0FBNUIsRUFBdUMsT0FBdkM7TUFDQSxVQUFBLEdBQWlCLElBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBWSxTQUFBO1FBQzNCLEdBQUcsQ0FBQyxLQUFKLENBQVUsb0NBQVYsRUFBZ0QsU0FBaEQsRUFBMkQsT0FBM0Q7ZUFDQSxVQUFVLENBQUMsbUJBQVgsQ0FBK0IsU0FBL0IsRUFBMEMsT0FBMUM7TUFGMkIsQ0FBWjtBQUdqQixhQUFPO0lBTlUsQ0FQbkI7SUFlQSxrQkFBQSxFQUFvQixTQUFDLEtBQUQ7TUFDbEIsSUFBRyxJQUFDLENBQUEsb0JBQUo7QUFDRSxlQURGOztNQUVBLEdBQUcsQ0FBQyxPQUFKLENBQVksNEJBQVosRUFBMEMsS0FBMUM7TUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQ0UsbURBREYsRUFDdUQ7UUFDckQsTUFBQSxFQUFRLHFN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QyxDQUFBLGVBQUQsQ0FBQTthQUN2QixJQUFDLENBQUEsY0FBRCxDQUFnQixNQUFoQixFQUF3QixjQUF4QixDQUF1QyxDQUFDLElBQXhDLENBQTZDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQyxPQUFEO1VBQzNDLEtBQUMsQ0FBQSxlQUFlLENBQUMsUUFBakIsQ0FBMEIsT0FBMUI7VUFDQSxJQUFHLE9BQU8sQ0FBQyxNQUFSLEtBQWtCLENBQXJCO21CQUNFLEtBQUMsQ0FBQSxlQUFlLENBQUMsU0FBakIsQ0FBMkIsT0FBUSxDQUFBLENBQUEsQ0FBbkMsRUFERjs7UUFGMkM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTdDO0lBUmMsQ0FsZ0JoQjtJQStnQkEsT0FBQSxFQUFTLFNBQUE7TUFDUCxJQUFHLElBQUMsQ0FBQSxXQUFKO1FBQ0UsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFERjs7TUFFQSxJQUFHLElBQUMsQ0FBQSxRQUFKO2VBQ0UsSUFBQyxDQUFBLFFBQVEsQ0FBQyxJQUFWLENBQUEsRUFERjs7SUFITyxDQS9nQlQ7O0FBSEYiLCJzb3VyY2VzQ29udGVudCI6WyJsb2cgPSByZXF1aXJlICcuL2xvZydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBzZWxlY3RvcjogJy5zb3VyY2UucHl0aG9uJ1xuICBkaXNhYmxlRm9yU2VsZWN0b3I6ICcuc291cmNlLnB5dGhvbiAuY29tbWVudCwgLnNvdXJjZS5weXRob24gLnN0cmluZydcbiAgaW5jbHVzaW9uUHJpb3JpdHk6IDJcbiAgc3VnZ2VzdGlvblByaW9yaXR5OiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uc3VnZ2VzdGlvblByaW9yaXR5JylcbiAgZXhjbHVkZUxvd2VyUHJpb3JpdHk6IGZhbHNlXG4gIGNhY2hlU2l6ZTogMTBcblxuICBfYWRkRXZlbnRMaXN0ZW5lcjogKGVkaXRvciwgZXZlbnROYW1lLCBoYW5kbGVyKSAtPlxuICAgIGVkaXRvclZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcgZWRpdG9yXG4gICAgZWRpdG9yVmlldy5hZGRFdmVudExpc3RlbmVyIGV2ZW50TmFtZSwgaGFuZGxlclxuICAgIGRpc3Bvc2FibGUgPSBuZXcgQERpc3Bvc2FibGUgLT5cbiAgICAgIGxvZy5kZWJ1ZyAnVW5zdWJzY3JpYmluZyBmcm9tIGV2ZW50IGxpc3RlbmVyICcsIGV2ZW50TmFtZSwgaGFuZGxlclxuICAgICAgZWRpdG9yVmlldy5yZW1vdmVFdmVudExpc3RlbmVyIGV2ZW50TmFtZSwgaGFuZGxlclxuICAgIHJldHVybiBkaXNwb3NhYmxlXG5cbiAgX25vRXhlY3V0YWJsZUVycm9yOiAoZXJyb3IpIC0+XG4gICAgaWYgQHByb3ZpZGVyTm9FeGVjdXRhYmxlXG4gICAgICByZXR1cm5cbiAgICBsb2cud2FybmluZyAnTm8gcHl0aG9uIGV4ZWN1dGFibGUgZm91bmQnLCBlcnJvclxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgJ2F1dG9jb21wbGV0ZS1weXRob24gdW5hYmxlIHRvIGZpbmQgcHl0aG9uIGJpbmFyeS4nLCB7XG4gICAgICBkZXRhaWw6IFwiXCJcIlBsZWFzZSBzZXQgcGF0aCB0byBweXRob24gZXhlY3V0YWJsZSBtYW51YWxseSBpbiBwYWNrYWdlXG4gICAgICBzZXR0aW5ncyBhbmQgcmVzdGFydCB5b3VyIGVkaXRvci4gQmUgc3VyZSB0byBtaWdyYXRlIG9uIG5ldyBzZXR0aW5nc1xuICAgICAgaWYgZXZlcnl0aGluZyB3b3JrZWQgb24gcHJldmlvdXMgdmVyc2lvbi5cbiAgICAgIERldGFpbGVkIGVycm9yIG1lc3NhZ2U6ICN7ZXJyb3J9XG5cbiAgICAgIEN1cnJlbnQgY29uZmlnOiAje2F0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5weXRob25QYXRocycpfVwiXCJcIlxuICAgICAgZGlzbWlzc2FibGU6IHRydWV9KVxuICAgIEBwcm92aWRlck5vRXhlY3V0YWJsZSA9IHRydWVcblxuICBfc3Bhd25EYWVtb246IC0+XG4gICAgaW50ZXJwcmV0ZXIgPSBASW50ZXJwcmV0ZXJMb29rdXAuZ2V0SW50ZXJwcmV0ZXIoKVxuICAgIGxvZy5kZWJ1ZyAnVXNpbmcgaW50ZXJwcmV0ZXInLCBpbnRlcnByZXRlclxuICAgIEBwcm92aWRlciA9IG5ldyBAQnVmZmVyZWRQcm9jZXNzXG4gICAgICBjb21tYW5kOiBpbnRlcnByZXRlciBvciAncHl0aG9uJ1xuICAgICAgYXJnczogW19fZGlybmFtZSArICcvY29tcGxldGlvbi5weSddXG4gICAgICBzdGRvdXQ6IChkYXRhKSA9PlxuICAgICAgICBAX2Rlc2VyaWFsaXplKGRhdGEpXG4gICAgICBzdGRlcnI6IChkYXRhKSA9PlxuICAgICAgICBpZiBkYXRhLmluZGV4T2YoJ2lzIG5vdCByZWNvZ25pemVkIGFzIGFuIGludGVybmFsIG9yIGV4dGVybmFsJykgPiAtMVxuICAgICAgICAgIHJldHVybiBAX25vRXhlY3V0YWJsZUVycm9yKGRhdGEpXG4gICAgICAgIGxvZy5kZWJ1ZyBcImF1dG9jb21wbGV0ZS1weXRob24gdHJhY2ViYWNrIG91dHB1dDogI3tkYXRhfVwiXG4gICAgICAgIGlmIGRhdGEuaW5kZXhPZignamVkaScpID4gLTFcbiAgICAgICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24ub3V0cHV0UHJvdmlkZXJFcnJvcnMnKVxuICAgICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAgICAgICAgICcnJ0xvb2tzIGxpa2UgdGhpcyBlcnJvciBvcmlnaW5hdGVkIGZyb20gSmVkaS4gUGxlYXNlIGRvIG5vdFxuICAgICAgICAgICAgICByZXBvcnQgc3VjaCBpc3N1ZXMgaW4gYXV0b2NvbXBsZXRlLXB5dGhvbiBpc3N1ZSB0cmFja2VyLiBSZXBvcnRcbiAgICAgICAgICAgICAgdGhlbSBkaXJlY3RseSB0byBKZWRpLiBUdXJuIG9mZiBgb3V0cHV0UHJvdmlkZXJFcnJvcnNgIHNldHRpbmdcbiAgICAgICAgICAgICAgdG8gaGlkZSBzdWNoIGVycm9ycyBpbiBmdXR1cmUuIFRyYWNlYmFjayBvdXRwdXQ6JycnLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogXCIje2RhdGF9XCIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlfSlcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgICAgICdhdXRvY29tcGxldGUtcHl0aG9uIHRyYWNlYmFjayBvdXRwdXQ6Jywge1xuICAgICAgICAgICAgICBkZXRhaWw6IFwiI3tkYXRhfVwiLFxuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZX0pXG5cbiAgICAgICAgbG9nLmRlYnVnIFwiRm9yY2luZyB0byByZXNvbHZlICN7T2JqZWN0LmtleXMoQHJlcXVlc3RzKS5sZW5ndGh9IHByb21pc2VzXCJcbiAgICAgICAgZm9yIHJlcXVlc3RJZCwgcmVzb2x2ZSBvZiBAcmVxdWVzdHNcbiAgICAgICAgICBpZiB0eXBlb2YgcmVzb2x2ZSA9PSAnZnVuY3Rpb24nXG4gICAgICAgICAgICByZXNvbHZlKFtdKVxuICAgICAgICAgIGRlbGV0ZSBAcmVxdWVzdHNbcmVxdWVzdElkXVxuXG4gICAgICBleGl0OiAoY29kZSkgPT5cbiAgICAgICAgbG9nLndhcm5pbmcgJ1Byb2Nlc3MgZXhpdCB3aXRoJywgY29kZSwgQHByb3ZpZGVyXG4gICAgQHByb3ZpZGVyLm9uV2lsbFRocm93RXJyb3IgKHtlcnJvciwgaGFuZGxlfSkgPT5cbiAgICAgIGlmIGVycm9yLmNvZGUgaXMgJ0VOT0VOVCcgYW5kIGVycm9yLnN5c2NhbGwuaW5kZXhPZignc3Bhd24nKSBpcyAwXG4gICAgICAgIEBfbm9FeGVjdXRhYmxlRXJyb3IoZXJyb3IpXG4gICAgICAgIEBkaXNwb3NlKClcbiAgICAgICAgaGFuZGxlKClcbiAgICAgIGVsc2VcbiAgICAgICAgdGhyb3cgZXJyb3JcblxuICAgIEBwcm92aWRlci5wcm9jZXNzPy5zdGRpbi5vbiAnZXJyb3InLCAoZXJyKSAtPlxuICAgICAgbG9nLmRlYnVnICdzdGRpbicsIGVyclxuXG4gICAgc2V0VGltZW91dCA9PlxuICAgICAgbG9nLmRlYnVnICdLaWxsaW5nIHB5dGhvbiBwcm9jZXNzIGFmdGVyIHRpbWVvdXQuLi4nXG4gICAgICBpZiBAcHJvdmlkZXIgYW5kIEBwcm92aWRlci5wcm9jZXNzXG4gICAgICAgIEBwcm92aWRlci5raWxsKClcbiAgICAsIDYwICogMTAgKiAxMDAwXG5cbiAgbG9hZDogLT5cbiAgICBpZiBub3QgQGNvbnN0cnVjdGVkXG4gICAgICBAY29uc3RydWN0b3IoKVxuICAgIHJldHVybiB0aGlzXG5cbiAgY29uc3RydWN0b3I6ICgpIC0+XG4gICAge0BEaXNwb3NhYmxlLCBAQ29tcG9zaXRlRGlzcG9zYWJsZSwgQEJ1ZmZlcmVkUHJvY2Vzc30gPSByZXF1aXJlICdhdG9tJ1xuICAgIHtAc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWlufSA9IHJlcXVpcmUgJy4vc2NvcGUtaGVscGVycydcbiAgICB7QFNlbGVjdG9yfSA9IHJlcXVpcmUgJ3NlbGVjdG9yLWtpdCdcbiAgICBARGVmaW5pdGlvbnNWaWV3ID0gcmVxdWlyZSAnLi9kZWZpbml0aW9ucy12aWV3J1xuICAgIEBVc2FnZXNWaWV3ID0gcmVxdWlyZSAnLi91c2FnZXMtdmlldydcbiAgICBAT3ZlcnJpZGVWaWV3ID0gcmVxdWlyZSAnLi9vdmVycmlkZS12aWV3J1xuICAgIEBSZW5hbWVWaWV3ID0gcmVxdWlyZSAnLi9yZW5hbWUtdmlldydcbiAgICBASW50ZXJwcmV0ZXJMb29rdXAgPSByZXF1aXJlICcuL2ludGVycHJldGVycy1sb29rdXAnXG4gICAgQF8gPSByZXF1aXJlICd1bmRlcnNjb3JlJ1xuICAgIEBmaWx0ZXIgPSByZXF1aXJlKCdmdXp6YWxkcmluLXBsdXMnKS5maWx0ZXJcblxuICAgIEByZXF1ZXN0cyA9IHt9XG4gICAgQHJlc3BvbnNlcyA9IHt9XG4gICAgQHByb3ZpZGVyID0gbnVsbFxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBAQ29tcG9zaXRlRGlzcG9zYWJsZVxuICAgIEBzdWJzY3JpcHRpb25zID0ge31cbiAgICBAZGVmaW5pdGlvbnNWaWV3ID0gbnVsbFxuICAgIEB1c2FnZXNWaWV3ID0gbnVsbFxuICAgIEByZW5hbWVWaWV3ID0gbnVsbFxuICAgIEBjb25zdHJ1Y3RlZCA9IHRydWVcbiAgICBAc25pcHBldHNNYW5hZ2VyID0gbnVsbFxuXG4gICAgbG9nLmRlYnVnIFwiSW5pdCBhdXRvY29tcGxldGUtcHl0aG9uIHdpdGggcHJpb3JpdHkgI3tAc3VnZ2VzdGlvblByaW9yaXR5fVwiXG5cbiAgICB0cnlcbiAgICAgIEB0cmlnZ2VyQ29tcGxldGlvblJlZ2V4ID0gUmVnRXhwIGF0b20uY29uZmlnLmdldChcbiAgICAgICAgJ2F1dG9jb21wbGV0ZS1weXRob24udHJpZ2dlckNvbXBsZXRpb25SZWdleCcpXG4gICAgY2F0Y2ggZXJyXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgJycnYXV0b2NvbXBsZXRlLXB5dGhvbiBpbnZhbGlkIHJlZ2V4cCB0byB0cmlnZ2VyIGF1dG9jb21wbGV0aW9ucy5cbiAgICAgICAgRmFsbGluZyBiYWNrIHRvIGRlZmF1bHQgdmFsdWUuJycnLCB7XG4gICAgICAgIGRldGFpbDogXCJPcmlnaW5hbCBleGNlcHRpb246ICN7ZXJyfVwiXG4gICAgICAgIGRpc21pc3NhYmxlOiB0cnVlfSlcbiAgICAgIGF0b20uY29uZmlnLnNldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi50cmlnZ2VyQ29tcGxldGlvblJlZ2V4JyxcbiAgICAgICAgICAgICAgICAgICAgICAnKFtcXC5cXCBdfFthLXpBLVpfXVthLXpBLVowLTlfXSopJylcbiAgICAgIEB0cmlnZ2VyQ29tcGxldGlvblJlZ2V4ID0gLyhbXFwuXFwgXXxbYS16QS1aX11bYS16QS1aMC05X10qKS9cblxuICAgIHNlbGVjdG9yID0gJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyfj1weXRob25dJ1xuICAgIGF0b20uY29tbWFuZHMuYWRkIHNlbGVjdG9yLCAnYXV0b2NvbXBsZXRlLXB5dGhvbjpnby10by1kZWZpbml0aW9uJywgPT5cbiAgICAgIEBnb1RvRGVmaW5pdGlvbigpXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgc2VsZWN0b3IsICdhdXRvY29tcGxldGUtcHl0aG9uOmNvbXBsZXRlLWFyZ3VtZW50cycsID0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIEBfY29tcGxldGVBcmd1bWVudHMoZWRpdG9yLCBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKSwgdHJ1ZSlcblxuICAgIGF0b20uY29tbWFuZHMuYWRkIHNlbGVjdG9yLCAnYXV0b2NvbXBsZXRlLXB5dGhvbjpzaG93LXVzYWdlcycsID0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIGlmIEB1c2FnZXNWaWV3XG4gICAgICAgIEB1c2FnZXNWaWV3LmRlc3Ryb3koKVxuICAgICAgQHVzYWdlc1ZpZXcgPSBuZXcgQFVzYWdlc1ZpZXcoKVxuICAgICAgQGdldFVzYWdlcyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKS50aGVuICh1c2FnZXMpID0+XG4gICAgICAgIEB1c2FnZXNWaWV3LnNldEl0ZW1zKHVzYWdlcylcblxuICAgIGF0b20uY29tbWFuZHMuYWRkIHNlbGVjdG9yLCAnYXV0b2NvbXBsZXRlLXB5dGhvbjpvdmVycmlkZS1tZXRob2QnLCA9PlxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgICBidWZmZXJQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgICBpZiBAb3ZlcnJpZGVWaWV3XG4gICAgICAgIEBvdmVycmlkZVZpZXcuZGVzdHJveSgpXG4gICAgICBAb3ZlcnJpZGVWaWV3ID0gbmV3IEBPdmVycmlkZVZpZXcoKVxuICAgICAgQGdldE1ldGhvZHMoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikudGhlbiAoe21ldGhvZHMsIGluZGVudCwgYnVmZmVyUG9zaXRpb259KSA9PlxuICAgICAgICBAb3ZlcnJpZGVWaWV3LmluZGVudCA9IGluZGVudFxuICAgICAgICBAb3ZlcnJpZGVWaWV3LmJ1ZmZlclBvc2l0aW9uID0gYnVmZmVyUG9zaXRpb25cbiAgICAgICAgQG92ZXJyaWRlVmlldy5zZXRJdGVtcyhtZXRob2RzKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgc2VsZWN0b3IsICdhdXRvY29tcGxldGUtcHl0aG9uOnJlbmFtZScsID0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIEBnZXRVc2FnZXMoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikudGhlbiAodXNhZ2VzKSA9PlxuICAgICAgICBpZiBAcmVuYW1lVmlld1xuICAgICAgICAgIEByZW5hbWVWaWV3LmRlc3Ryb3koKVxuICAgICAgICBpZiB1c2FnZXMubGVuZ3RoID4gMFxuICAgICAgICAgIEByZW5hbWVWaWV3ID0gbmV3IEBSZW5hbWVWaWV3KHVzYWdlcylcbiAgICAgICAgICBAcmVuYW1lVmlldy5vbklucHV0IChuZXdOYW1lKSA9PlxuICAgICAgICAgICAgZm9yIGZpbGVOYW1lLCB1c2FnZXMgb2YgQF8uZ3JvdXBCeSh1c2FnZXMsICdmaWxlTmFtZScpXG4gICAgICAgICAgICAgIFtwcm9qZWN0LCBfcmVsYXRpdmVdID0gYXRvbS5wcm9qZWN0LnJlbGF0aXZpemVQYXRoKGZpbGVOYW1lKVxuICAgICAgICAgICAgICBpZiBwcm9qZWN0XG4gICAgICAgICAgICAgICAgQF91cGRhdGVVc2FnZXNJbkZpbGUoZmlsZU5hbWUsIHVzYWdlcywgbmV3TmFtZSlcbiAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIGxvZy5kZWJ1ZyAnSWdub3JpbmcgZmlsZSBvdXRzaWRlIG9mIHByb2plY3QnLCBmaWxlTmFtZVxuICAgICAgICBlbHNlXG4gICAgICAgICAgaWYgQHVzYWdlc1ZpZXdcbiAgICAgICAgICAgIEB1c2FnZXNWaWV3LmRlc3Ryb3koKVxuICAgICAgICAgIEB1c2FnZXNWaWV3ID0gbmV3IEBVc2FnZXNWaWV3KClcbiAgICAgICAgICBAdXNhZ2VzVmlldy5zZXRJdGVtcyh1c2FnZXMpXG5cbiAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgIEBfaGFuZGxlR3JhbW1hckNoYW5nZUV2ZW50KGVkaXRvciwgZWRpdG9yLmdldEdyYW1tYXIoKSlcbiAgICAgIGVkaXRvci5vbkRpZENoYW5nZUdyYW1tYXIgKGdyYW1tYXIpID0+XG4gICAgICAgIEBfaGFuZGxlR3JhbW1hckNoYW5nZUV2ZW50KGVkaXRvciwgZ3JhbW1hcilcblxuICAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdhdXRvY29tcGxldGUtcGx1cy5lbmFibGVBdXRvQWN0aXZhdGlvbicsID0+XG4gICAgICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgPT5cbiAgICAgICAgQF9oYW5kbGVHcmFtbWFyQ2hhbmdlRXZlbnQoZWRpdG9yLCBlZGl0b3IuZ2V0R3JhbW1hcigpKVxuXG4gIF91cGRhdGVVc2FnZXNJbkZpbGU6IChmaWxlTmFtZSwgdXNhZ2VzLCBuZXdOYW1lKSAtPlxuICAgIGNvbHVtbk9mZnNldCA9IHt9XG4gICAgYXRvbS53b3Jrc3BhY2Uub3BlbihmaWxlTmFtZSwgYWN0aXZhdGVJdGVtOiBmYWxzZSkudGhlbiAoZWRpdG9yKSAtPlxuICAgICAgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gICAgICBmb3IgdXNhZ2UgaW4gdXNhZ2VzXG4gICAgICAgIHtuYW1lLCBsaW5lLCBjb2x1bW59ID0gdXNhZ2VcbiAgICAgICAgY29sdW1uT2Zmc2V0W2xpbmVdID89IDBcbiAgICAgICAgbG9nLmRlYnVnICdSZXBsYWNpbmcnLCB1c2FnZSwgJ3dpdGgnLCBuZXdOYW1lLCAnaW4nLCBlZGl0b3IuaWRcbiAgICAgICAgbG9nLmRlYnVnICdPZmZzZXQgZm9yIGxpbmUnLCBsaW5lLCAnaXMnLCBjb2x1bW5PZmZzZXRbbGluZV1cbiAgICAgICAgYnVmZmVyLnNldFRleHRJblJhbmdlKFtcbiAgICAgICAgICBbbGluZSAtIDEsIGNvbHVtbiArIGNvbHVtbk9mZnNldFtsaW5lXV0sXG4gICAgICAgICAgW2xpbmUgLSAxLCBjb2x1bW4gKyBuYW1lLmxlbmd0aCArIGNvbHVtbk9mZnNldFtsaW5lXV0sXG4gICAgICAgICAgXSwgbmV3TmFtZSlcbiAgICAgICAgY29sdW1uT2Zmc2V0W2xpbmVdICs9IG5ld05hbWUubGVuZ3RoIC0gbmFtZS5sZW5ndGhcbiAgICAgIGJ1ZmZlci5zYXZlKClcblxuXG4gIF9zaG93U2lnbmF0dXJlT3ZlcmxheTogKGV2ZW50KSAtPlxuICAgIGlmIEBtYXJrZXJzXG4gICAgICBmb3IgbWFya2VyIGluIEBtYXJrZXJzXG4gICAgICAgIGxvZy5kZWJ1ZyAnZGVzdHJveWluZyBvbGQgbWFya2VyJywgbWFya2VyXG4gICAgICAgIG1hcmtlci5kZXN0cm95KClcbiAgICBlbHNlXG4gICAgICBAbWFya2VycyA9IFtdXG5cbiAgICBjdXJzb3IgPSBldmVudC5jdXJzb3JcbiAgICBlZGl0b3IgPSBldmVudC5jdXJzb3IuZWRpdG9yXG4gICAgd29yZEJ1ZmZlclJhbmdlID0gY3Vyc29yLmdldEN1cnJlbnRXb3JkQnVmZmVyUmFuZ2UoKVxuICAgIHNjb3BlRGVzY3JpcHRvciA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihcbiAgICAgIGV2ZW50Lm5ld0J1ZmZlclBvc2l0aW9uKVxuICAgIHNjb3BlQ2hhaW4gPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVDaGFpbigpXG5cbiAgICBkaXNhYmxlRm9yU2VsZWN0b3IgPSBcIiN7QGRpc2FibGVGb3JTZWxlY3Rvcn0sIC5zb3VyY2UucHl0aG9uIC5udW1lcmljLCAuc291cmNlLnB5dGhvbiAuaW50ZWdlciwgLnNvdXJjZS5weXRob24gLmRlY2ltYWwsIC5zb3VyY2UucHl0aG9uIC5wdW5jdHVhdGlvbiwgLnNvdXJjZS5weXRob24gLmtleXdvcmQsIC5zb3VyY2UucHl0aG9uIC5zdG9yYWdlLCAuc291cmNlLnB5dGhvbiAudmFyaWFibGUucGFyYW1ldGVyLCAuc291cmNlLnB5dGhvbiAuZW50aXR5Lm5hbWVcIlxuICAgIGRpc2FibGVGb3JTZWxlY3RvciA9IEBTZWxlY3Rvci5jcmVhdGUoZGlzYWJsZUZvclNlbGVjdG9yKVxuXG4gICAgaWYgQHNlbGVjdG9yc01hdGNoU2NvcGVDaGFpbihkaXNhYmxlRm9yU2VsZWN0b3IsIHNjb3BlQ2hhaW4pXG4gICAgICBsb2cuZGVidWcgJ2RvIG5vdGhpbmcgZm9yIHRoaXMgc2VsZWN0b3InXG4gICAgICByZXR1cm5cblxuICAgIG1hcmtlciA9IGVkaXRvci5tYXJrQnVmZmVyUmFuZ2UoXG4gICAgICB3b3JkQnVmZmVyUmFuZ2UsXG4gICAgICB7cGVyc2lzdGVudDogZmFsc2UsIGludmFsaWRhdGU6ICduZXZlcid9KVxuXG4gICAgQG1hcmtlcnMucHVzaChtYXJrZXIpXG5cbiAgICBnZXRUb29sdGlwID0gKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pID0+XG4gICAgICBwYXlsb2FkID1cbiAgICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ3Rvb2x0aXAnLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgICBsb29rdXA6ICd0b29sdGlwJ1xuICAgICAgICBwYXRoOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgIHNvdXJjZTogZWRpdG9yLmdldFRleHQoKVxuICAgICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICAgICAgY29uZmlnOiBAX2dlbmVyYXRlUmVxdWVzdENvbmZpZygpXG4gICAgICBAX3NlbmRSZXF1ZXN0KEBfc2VyaWFsaXplKHBheWxvYWQpKVxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgICBAcmVxdWVzdHNbcGF5bG9hZC5pZF0gPSByZXNvbHZlXG5cbiAgICBnZXRUb29sdGlwKGVkaXRvciwgZXZlbnQubmV3QnVmZmVyUG9zaXRpb24pLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBpZiByZXN1bHRzLmxlbmd0aCA+IDBcbiAgICAgICAge3RleHQsIGZpbGVOYW1lLCBsaW5lLCBjb2x1bW4sIHR5cGUsIGRlc2NyaXB0aW9ufSA9IHJlc3VsdHNbMF1cblxuICAgICAgICBkZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uLnRyaW0oKVxuICAgICAgICBpZiBub3QgZGVzY3JpcHRpb25cbiAgICAgICAgICByZXR1cm5cbiAgICAgICAgdmlldyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2F1dG9jb21wbGV0ZS1weXRob24tc3VnZ2VzdGlvbicpXG4gICAgICAgIHZpZXcuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoZGVzY3JpcHRpb24pKVxuICAgICAgICBkZWNvcmF0aW9uID0gZWRpdG9yLmRlY29yYXRlTWFya2VyKG1hcmtlciwge1xuICAgICAgICAgICAgdHlwZTogJ292ZXJsYXknLFxuICAgICAgICAgICAgaXRlbTogdmlldyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnaGVhZCdcbiAgICAgICAgfSlcbiAgICAgICAgbG9nLmRlYnVnKCdkZWNvcmF0ZWQgbWFya2VyJywgbWFya2VyKVxuXG4gIF9oYW5kbGVHcmFtbWFyQ2hhbmdlRXZlbnQ6IChlZGl0b3IsIGdyYW1tYXIpIC0+XG4gICAgZXZlbnROYW1lID0gJ2tleXVwJ1xuICAgIGV2ZW50SWQgPSBcIiN7ZWRpdG9yLmlkfS4je2V2ZW50TmFtZX1cIlxuICAgIGlmIGdyYW1tYXIuc2NvcGVOYW1lID09ICdzb3VyY2UucHl0aG9uJ1xuXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uc2hvd1Rvb2x0aXBzJykgaXMgdHJ1ZVxuICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2VDdXJzb3JQb3NpdGlvbiAoZXZlbnQpID0+XG4gICAgICAgICAgQF9zaG93U2lnbmF0dXJlT3ZlcmxheShldmVudClcblxuICAgICAgaWYgbm90IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXBsdXMuZW5hYmxlQXV0b0FjdGl2YXRpb24nKVxuICAgICAgICBsb2cuZGVidWcgJ0lnbm9yaW5nIGtleXVwIGV2ZW50cyBkdWUgdG8gYXV0b2NvbXBsZXRlLXBsdXMgc2V0dGluZ3MuJ1xuICAgICAgICByZXR1cm5cbiAgICAgIGRpc3Bvc2FibGUgPSBAX2FkZEV2ZW50TGlzdGVuZXIgZWRpdG9yLCBldmVudE5hbWUsIChlKSA9PlxuICAgICAgICBicmFja2V0SWRlbnRpZmllcnMgPVxuICAgICAgICAgICdVKzAwMjgnOiAncXdlcnR5J1xuICAgICAgICAgICdVKzAwMzgnOiAnZ2VybWFuJ1xuICAgICAgICAgICdVKzAwMzUnOiAnYXplcnR5J1xuICAgICAgICAgICdVKzAwMzknOiAnb3RoZXInXG4gICAgICAgIGlmIGUua2V5SWRlbnRpZmllciBvZiBicmFja2V0SWRlbnRpZmllcnNcbiAgICAgICAgICBsb2cuZGVidWcgJ1RyeWluZyB0byBjb21wbGV0ZSBhcmd1bWVudHMgb24ga2V5dXAgZXZlbnQnLCBlXG4gICAgICAgICAgQF9jb21wbGV0ZUFyZ3VtZW50cyhlZGl0b3IsIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpKVxuICAgICAgQGRpc3Bvc2FibGVzLmFkZCBkaXNwb3NhYmxlXG4gICAgICBAc3Vic2NyaXB0aW9uc1tldmVudElkXSA9IGRpc3Bvc2FibGVcbiAgICAgIGxvZy5kZWJ1ZyAnU3Vic2NyaWJlZCBvbiBldmVudCcsIGV2ZW50SWRcbiAgICBlbHNlXG4gICAgICBpZiBldmVudElkIG9mIEBzdWJzY3JpcHRpb25zXG4gICAgICAgIEBzdWJzY3JpcHRpb25zW2V2ZW50SWRdLmRpc3Bvc2UoKVxuICAgICAgICBsb2cuZGVidWcgJ1Vuc3Vic2NyaWJlZCBmcm9tIGV2ZW50JywgZXZlbnRJZFxuXG4gIF9zZXJpYWxpemU6IChyZXF1ZXN0KSAtPlxuICAgIGxvZy5kZWJ1ZyAnU2VyaWFsaXppbmcgcmVxdWVzdCB0byBiZSBzZW50IHRvIEplZGknLCByZXF1ZXN0XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHJlcXVlc3QpXG5cbiAgX3NlbmRSZXF1ZXN0OiAoZGF0YSwgcmVzcGF3bmVkKSAtPlxuICAgIGxvZy5kZWJ1ZyAnUGVuZGluZyByZXF1ZXN0czonLCBPYmplY3Qua2V5cyhAcmVxdWVzdHMpLmxlbmd0aCwgQHJlcXVlc3RzXG4gICAgaWYgT2JqZWN0LmtleXMoQHJlcXVlc3RzKS5sZW5ndGggPiAxMFxuICAgICAgbG9nLmRlYnVnICdDbGVhbmluZyB1cCByZXF1ZXN0IHF1ZXVlIHRvIGF2b2lkIG92ZXJmbG93LCBpZ25vcmluZyByZXF1ZXN0J1xuICAgICAgQHJlcXVlc3RzID0ge31cbiAgICAgIGlmIEBwcm92aWRlciBhbmQgQHByb3ZpZGVyLnByb2Nlc3NcbiAgICAgICAgbG9nLmRlYnVnICdLaWxsaW5nIHB5dGhvbiBwcm9jZXNzJ1xuICAgICAgICBAcHJvdmlkZXIua2lsbCgpXG4gICAgICAgIHJldHVyblxuXG4gICAgaWYgQHByb3ZpZGVyIGFuZCBAcHJvdmlkZXIucHJvY2Vzc1xuICAgICAgcHJvY2VzcyA9IEBwcm92aWRlci5wcm9jZXNzXG4gICAgICBpZiBwcm9jZXNzLmV4aXRDb2RlID09IG51bGwgYW5kIHByb2Nlc3Muc2lnbmFsQ29kZSA9PSBudWxsXG4gICAgICAgIGlmIEBwcm92aWRlci5wcm9jZXNzLnBpZFxuICAgICAgICAgIHJldHVybiBAcHJvdmlkZXIucHJvY2Vzcy5zdGRpbi53cml0ZShkYXRhICsgJ1xcbicpXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBsb2cuZGVidWcgJ0F0dGVtcHQgdG8gY29tbXVuaWNhdGUgd2l0aCB0ZXJtaW5hdGVkIHByb2Nlc3MnLCBAcHJvdmlkZXJcbiAgICAgIGVsc2UgaWYgcmVzcGF3bmVkXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICAgIFtcIkZhaWxlZCB0byBzcGF3biBkYWVtb24gZm9yIGF1dG9jb21wbGV0ZS1weXRob24uXCJcbiAgICAgICAgICAgXCJDb21wbGV0aW9ucyB3aWxsIG5vdCB3b3JrIGFueW1vcmVcIlxuICAgICAgICAgICBcInVubGVzcyB5b3UgcmVzdGFydCB5b3VyIGVkaXRvci5cIl0uam9pbignICcpLCB7XG4gICAgICAgICAgZGV0YWlsOiBbXCJleGl0Q29kZTogI3twcm9jZXNzLmV4aXRDb2RlfVwiXG4gICAgICAgICAgICAgICAgICAgXCJzaWduYWxDb2RlOiAje3Byb2Nlc3Muc2lnbmFsQ29kZX1cIl0uam9pbignXFxuJyksXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWV9KVxuICAgICAgICBAZGlzcG9zZSgpXG4gICAgICBlbHNlXG4gICAgICAgIEBfc3Bhd25EYWVtb24oKVxuICAgICAgICBAX3NlbmRSZXF1ZXN0KGRhdGEsIHJlc3Bhd25lZDogdHJ1ZSlcbiAgICAgICAgbG9nLmRlYnVnICdSZS1zcGF3bmluZyBweXRob24gcHJvY2Vzcy4uLidcbiAgICBlbHNlXG4gICAgICBsb2cuZGVidWcgJ1NwYXduaW5nIHB5dGhvbiBwcm9jZXNzLi4uJ1xuICAgICAgQF9zcGF3bkRhZW1vbigpXG4gICAgICBAX3NlbmRSZXF1ZXN0KGRhdGEpXG5cbiAgX2Rlc2VyaWFsaXplOiAocmVzcG9uc2UpIC0+XG4gICAgbG9nLmRlYnVnICdEZXNlcmVhbGl6aW5nIHJlc3BvbnNlIGZyb20gSmVkaScsIHJlc3BvbnNlXG4gICAgbG9nLmRlYnVnIFwiR290ICN7cmVzcG9uc2UudHJpbSgpLnNwbGl0KCdcXG4nKS5sZW5ndGh9IGxpbmVzXCJcbiAgICBmb3IgcmVzcG9uc2VTb3VyY2UgaW4gcmVzcG9uc2UudHJpbSgpLnNwbGl0KCdcXG4nKVxuICAgICAgdHJ5XG4gICAgICAgIHJlc3BvbnNlID0gSlNPTi5wYXJzZShyZXNwb25zZVNvdXJjZSlcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiXCJcIkZhaWxlZCB0byBwYXJzZSBKU09OIGZyb20gXFxcIiN7cmVzcG9uc2VTb3VyY2V9XFxcIi5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgIE9yaWdpbmFsIGV4Y2VwdGlvbjogI3tlfVwiXCJcIilcblxuICAgICAgaWYgcmVzcG9uc2VbJ2FyZ3VtZW50cyddXG4gICAgICAgIGVkaXRvciA9IEByZXF1ZXN0c1tyZXNwb25zZVsnaWQnXV1cbiAgICAgICAgaWYgdHlwZW9mIGVkaXRvciA9PSAnb2JqZWN0J1xuICAgICAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgICAgICAjIENvbXBhcmUgcmVzcG9uc2UgSUQgd2l0aCBjdXJyZW50IHN0YXRlIHRvIGF2b2lkIHN0YWxlIGNvbXBsZXRpb25zXG4gICAgICAgICAgaWYgcmVzcG9uc2VbJ2lkJ10gPT0gQF9nZW5lcmF0ZVJlcXVlc3RJZCgnYXJndW1lbnRzJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgICAgICAgIEBzbmlwcGV0c01hbmFnZXI/Lmluc2VydFNuaXBwZXQocmVzcG9uc2VbJ2FyZ3VtZW50cyddLCBlZGl0b3IpXG4gICAgICBlbHNlXG4gICAgICAgIHJlc29sdmUgPSBAcmVxdWVzdHNbcmVzcG9uc2VbJ2lkJ11dXG4gICAgICAgIGlmIHR5cGVvZiByZXNvbHZlID09ICdmdW5jdGlvbidcbiAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlWydyZXN1bHRzJ10pXG4gICAgICBjYWNoZVNpemVEZWx0YSA9IE9iamVjdC5rZXlzKEByZXNwb25zZXMpLmxlbmd0aCA+IEBjYWNoZVNpemVcbiAgICAgIGlmIGNhY2hlU2l6ZURlbHRhID4gMFxuICAgICAgICBpZHMgPSBPYmplY3Qua2V5cyhAcmVzcG9uc2VzKS5zb3J0IChhLCBiKSA9PlxuICAgICAgICAgIHJldHVybiBAcmVzcG9uc2VzW2FdWyd0aW1lc3RhbXAnXSAtIEByZXNwb25zZXNbYl1bJ3RpbWVzdGFtcCddXG4gICAgICAgIGZvciBpZCBpbiBpZHMuc2xpY2UoMCwgY2FjaGVTaXplRGVsdGEpXG4gICAgICAgICAgbG9nLmRlYnVnICdSZW1vdmluZyBvbGQgaXRlbSBmcm9tIGNhY2hlIHdpdGggSUQnLCBpZFxuICAgICAgICAgIGRlbGV0ZSBAcmVzcG9uc2VzW2lkXVxuICAgICAgQHJlc3BvbnNlc1tyZXNwb25zZVsnaWQnXV0gPVxuICAgICAgICBzb3VyY2U6IHJlc3BvbnNlU291cmNlXG4gICAgICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICAgICAgbG9nLmRlYnVnICdDYWNoZWQgcmVxdWVzdCB3aXRoIElEJywgcmVzcG9uc2VbJ2lkJ11cbiAgICAgIGRlbGV0ZSBAcmVxdWVzdHNbcmVzcG9uc2VbJ2lkJ11dXG5cbiAgX2dlbmVyYXRlUmVxdWVzdElkOiAodHlwZSwgZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgdGV4dCkgLT5cbiAgICBpZiBub3QgdGV4dFxuICAgICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICByZXR1cm4gcmVxdWlyZSgnY3J5cHRvJykuY3JlYXRlSGFzaCgnbWQ1JykudXBkYXRlKFtcbiAgICAgIGVkaXRvci5nZXRQYXRoKCksIHRleHQsIGJ1ZmZlclBvc2l0aW9uLnJvdyxcbiAgICAgIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiwgdHlwZV0uam9pbigpKS5kaWdlc3QoJ2hleCcpXG5cbiAgX2dlbmVyYXRlUmVxdWVzdENvbmZpZzogLT5cbiAgICBleHRyYVBhdGhzID0gQEludGVycHJldGVyTG9va3VwLmFwcGx5U3Vic3RpdHV0aW9ucyhcbiAgICAgIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5leHRyYVBhdGhzJykuc3BsaXQoJzsnKSlcbiAgICBhcmdzID1cbiAgICAgICdleHRyYVBhdGhzJzogZXh0cmFQYXRoc1xuICAgICAgJ3VzZVNuaXBwZXRzJzogYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnVzZVNuaXBwZXRzJylcbiAgICAgICdjYXNlSW5zZW5zaXRpdmVDb21wbGV0aW9uJzogYXRvbS5jb25maWcuZ2V0KFxuICAgICAgICAnYXV0b2NvbXBsZXRlLXB5dGhvbi5jYXNlSW5zZW5zaXRpdmVDb21wbGV0aW9uJylcbiAgICAgICdzaG93RGVzY3JpcHRpb25zJzogYXRvbS5jb25maWcuZ2V0KFxuICAgICAgICAnYXV0b2NvbXBsZXRlLXB5dGhvbi5zaG93RGVzY3JpcHRpb25zJylcbiAgICAgICdmdXp6eU1hdGNoZXInOiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uZnV6enlNYXRjaGVyJylcbiAgICByZXR1cm4gYXJnc1xuXG4gIHNldFNuaXBwZXRzTWFuYWdlcjogKEBzbmlwcGV0c01hbmFnZXIpIC0+XG5cbiAgX2NvbXBsZXRlQXJndW1lbnRzOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgZm9yY2UpIC0+XG4gICAgdXNlU25pcHBldHMgPSBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24udXNlU25pcHBldHMnKVxuICAgIGlmIG5vdCBmb3JjZSBhbmQgdXNlU25pcHBldHMgPT0gJ25vbmUnXG4gICAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2F0b20tdGV4dC1lZGl0b3InKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2F1dG9jb21wbGV0ZS1wbHVzOmFjdGl2YXRlJylcbiAgICAgIHJldHVyblxuICAgIHNjb3BlRGVzY3JpcHRvciA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihidWZmZXJQb3NpdGlvbilcbiAgICBzY29wZUNoYWluID0gc2NvcGVEZXNjcmlwdG9yLmdldFNjb3BlQ2hhaW4oKVxuICAgIGRpc2FibGVGb3JTZWxlY3RvciA9IEBTZWxlY3Rvci5jcmVhdGUoQGRpc2FibGVGb3JTZWxlY3RvcilcbiAgICBpZiBAc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWluKGRpc2FibGVGb3JTZWxlY3Rvciwgc2NvcGVDaGFpbilcbiAgICAgIGxvZy5kZWJ1ZyAnSWdub3JpbmcgYXJndW1lbnQgY29tcGxldGlvbiBpbnNpZGUgb2YnLCBzY29wZUNoYWluXG4gICAgICByZXR1cm5cblxuICAgICMgd2UgZG9uJ3Qgd2FudCB0byBjb21wbGV0ZSBhcmd1bWVudHMgaW5zaWRlIG9mIGV4aXN0aW5nIGNvZGVcbiAgICBsaW5lcyA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRMaW5lcygpXG4gICAgbGluZSA9IGxpbmVzW2J1ZmZlclBvc2l0aW9uLnJvd11cbiAgICBwcmVmaXggPSBsaW5lLnNsaWNlKGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiAtIDEsIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbilcbiAgICBpZiBwcmVmaXggaXNudCAnKCdcbiAgICAgIGxvZy5kZWJ1ZyAnSWdub3JpbmcgYXJndW1lbnQgY29tcGxldGlvbiB3aXRoIHByZWZpeCcsIHByZWZpeFxuICAgICAgcmV0dXJuXG4gICAgc3VmZml4ID0gbGluZS5zbGljZSBidWZmZXJQb3NpdGlvbi5jb2x1bW4sIGxpbmUubGVuZ3RoXG4gICAgaWYgbm90IC9eKFxcKSg/OiR8XFxzKXxcXHN8JCkvLnRlc3Qoc3VmZml4KVxuICAgICAgbG9nLmRlYnVnICdJZ25vcmluZyBhcmd1bWVudCBjb21wbGV0aW9uIHdpdGggc3VmZml4Jywgc3VmZml4XG4gICAgICByZXR1cm5cblxuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ2FyZ3VtZW50cycsIGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICBsb29rdXA6ICdhcmd1bWVudHMnXG4gICAgICBwYXRoOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBzb3VyY2U6IGVkaXRvci5nZXRUZXh0KClcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICAgIGNvbmZpZzogQF9nZW5lcmF0ZVJlcXVlc3RDb25maWcoKVxuXG4gICAgQF9zZW5kUmVxdWVzdChAX3NlcmlhbGl6ZShwYXlsb2FkKSlcbiAgICByZXR1cm4gbmV3IFByb21pc2UgPT5cbiAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IGVkaXRvclxuXG4gIF9mdXp6eUZpbHRlcjogKGNhbmRpZGF0ZXMsIHF1ZXJ5KSAtPlxuICAgIGlmIGNhbmRpZGF0ZXMubGVuZ3RoIGlzbnQgMCBhbmQgcXVlcnkgbm90IGluIFsnICcsICcuJywgJygnXVxuICAgICAgY2FuZGlkYXRlcyA9IEBmaWx0ZXIoY2FuZGlkYXRlcywgcXVlcnksIGtleTogJ3RleHQnKVxuICAgIHJldHVybiBjYW5kaWRhdGVzXG5cbiAgZ2V0U3VnZ2VzdGlvbnM6ICh7ZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgc2NvcGVEZXNjcmlwdG9yLCBwcmVmaXh9KSAtPlxuICAgIEBsb2FkKClcbiAgICBpZiBub3QgQHRyaWdnZXJDb21wbGV0aW9uUmVnZXgudGVzdChwcmVmaXgpXG4gICAgICByZXR1cm4gW11cbiAgICBidWZmZXJQb3NpdGlvbiA9XG4gICAgICByb3c6IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICBsaW5lcyA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRMaW5lcygpXG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLmZ1enp5TWF0Y2hlcicpXG4gICAgICAjIHdlIHdhbnQgdG8gZG8gb3VyIG93biBmaWx0ZXJpbmcsIGhpZGUgYW55IGV4aXN0aW5nIHN1ZmZpeCBmcm9tIEplZGlcbiAgICAgIGxpbmUgPSBsaW5lc1tidWZmZXJQb3NpdGlvbi5yb3ddXG4gICAgICBsYXN0SWRlbnRpZmllciA9IC9cXC4/W2EtekEtWl9dW2EtekEtWjAtOV9dKiQvLmV4ZWMoXG4gICAgICAgIGxpbmUuc2xpY2UgMCwgYnVmZmVyUG9zaXRpb24uY29sdW1uKVxuICAgICAgaWYgbGFzdElkZW50aWZpZXJcbiAgICAgICAgYnVmZmVyUG9zaXRpb24uY29sdW1uID0gbGFzdElkZW50aWZpZXIuaW5kZXggKyAxXG4gICAgICAgIGxpbmVzW2J1ZmZlclBvc2l0aW9uLnJvd10gPSBsaW5lLnNsaWNlKDAsIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbilcbiAgICByZXF1ZXN0SWQgPSBAX2dlbmVyYXRlUmVxdWVzdElkKFxuICAgICAgJ2NvbXBsZXRpb25zJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbiwgbGluZXMuam9pbignXFxuJykpXG4gICAgaWYgcmVxdWVzdElkIG9mIEByZXNwb25zZXNcbiAgICAgIGxvZy5kZWJ1ZyAnVXNpbmcgY2FjaGVkIHJlc3BvbnNlIHdpdGggSUQnLCByZXF1ZXN0SWRcbiAgICAgICMgV2UgaGF2ZSB0byBwYXJzZSBKU09OIG9uIGVhY2ggcmVxdWVzdCBoZXJlIHRvIHBhc3Mgb25seSBhIGNvcHlcbiAgICAgIG1hdGNoZXMgPSBKU09OLnBhcnNlKEByZXNwb25zZXNbcmVxdWVzdElkXVsnc291cmNlJ10pWydyZXN1bHRzJ11cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5mdXp6eU1hdGNoZXInKVxuICAgICAgICByZXR1cm4gQF9mdXp6eUZpbHRlcihtYXRjaGVzLCBwcmVmaXgpXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBtYXRjaGVzXG4gICAgcGF5bG9hZCA9XG4gICAgICBpZDogcmVxdWVzdElkXG4gICAgICBwcmVmaXg6IHByZWZpeFxuICAgICAgbG9va3VwOiAnY29tcGxldGlvbnMnXG4gICAgICBwYXRoOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBzb3VyY2U6IGVkaXRvci5nZXRUZXh0KClcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICAgIGNvbmZpZzogQF9nZW5lcmF0ZVJlcXVlc3RDb25maWcoKVxuXG4gICAgQF9zZW5kUmVxdWVzdChAX3NlcmlhbGl6ZShwYXlsb2FkKSlcbiAgICByZXR1cm4gbmV3IFByb21pc2UgKHJlc29sdmUpID0+XG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uZnV6enlNYXRjaGVyJylcbiAgICAgICAgQHJlcXVlc3RzW3BheWxvYWQuaWRdID0gKG1hdGNoZXMpID0+XG4gICAgICAgICAgcmVzb2x2ZShAX2Z1enp5RmlsdGVyKG1hdGNoZXMsIHByZWZpeCkpXG4gICAgICBlbHNlXG4gICAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IHJlc29sdmVcblxuICBnZXREZWZpbml0aW9uczogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgcGF5bG9hZCA9XG4gICAgICBpZDogQF9nZW5lcmF0ZVJlcXVlc3RJZCgnZGVmaW5pdGlvbnMnLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgbG9va3VwOiAnZGVmaW5pdGlvbnMnXG4gICAgICBwYXRoOiBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICBzb3VyY2U6IGVkaXRvci5nZXRUZXh0KClcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgY29sdW1uOiBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICAgIGNvbmZpZzogQF9nZW5lcmF0ZVJlcXVlc3RDb25maWcoKVxuXG4gICAgQF9zZW5kUmVxdWVzdChAX3NlcmlhbGl6ZShwYXlsb2FkKSlcbiAgICByZXR1cm4gbmV3IFByb21pc2UgKHJlc29sdmUpID0+XG4gICAgICBAcmVxdWVzdHNbcGF5bG9hZC5pZF0gPSByZXNvbHZlXG5cbiAgZ2V0VXNhZ2VzOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICBwYXlsb2FkID1cbiAgICAgIGlkOiBAX2dlbmVyYXRlUmVxdWVzdElkKCd1c2FnZXMnLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgbG9va3VwOiAndXNhZ2VzJ1xuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgc291cmNlOiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgICBjb25maWc6IEBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnKClcblxuICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgQHJlcXVlc3RzW3BheWxvYWQuaWRdID0gcmVzb2x2ZVxuXG4gIGdldE1ldGhvZHM6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIGluZGVudCA9IGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuICAgIGxpbmVzID0gZWRpdG9yLmdldEJ1ZmZlcigpLmdldExpbmVzKClcbiAgICBsaW5lcy5zcGxpY2UoYnVmZmVyUG9zaXRpb24ucm93ICsgMSwgMCwgXCIgIGRlZiBfX2F1dG9jb21wbGV0ZV9weXRob24ocyk6XCIpXG4gICAgbGluZXMuc3BsaWNlKGJ1ZmZlclBvc2l0aW9uLnJvdyArIDIsIDAsIFwiICAgIHMuXCIpXG4gICAgcGF5bG9hZCA9XG4gICAgICBpZDogQF9nZW5lcmF0ZVJlcXVlc3RJZCgnbWV0aG9kcycsIGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICBsb29rdXA6ICdtZXRob2RzJ1xuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgc291cmNlOiBsaW5lcy5qb2luKCdcXG4nKVxuICAgICAgbGluZTogYnVmZmVyUG9zaXRpb24ucm93ICsgMlxuICAgICAgY29sdW1uOiA2XG4gICAgICBjb25maWc6IEBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnKClcblxuICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgQHJlcXVlc3RzW3BheWxvYWQuaWRdID0gKG1ldGhvZHMpIC0+XG4gICAgICAgIHJlc29sdmUoe21ldGhvZHMsIGluZGVudCwgYnVmZmVyUG9zaXRpb259KVxuXG4gIGdvVG9EZWZpbml0aW9uOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICBpZiBub3QgZWRpdG9yXG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICBpZiBub3QgYnVmZmVyUG9zaXRpb25cbiAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICBpZiBAZGVmaW5pdGlvbnNWaWV3XG4gICAgICBAZGVmaW5pdGlvbnNWaWV3LmRlc3Ryb3koKVxuICAgIEBkZWZpbml0aW9uc1ZpZXcgPSBuZXcgQERlZmluaXRpb25zVmlldygpXG4gICAgQGdldERlZmluaXRpb25zKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pLnRoZW4gKHJlc3VsdHMpID0+XG4gICAgICBAZGVmaW5pdGlvbnNWaWV3LnNldEl0ZW1zKHJlc3VsdHMpXG4gICAgICBpZiByZXN1bHRzLmxlbmd0aCA9PSAxXG4gICAgICAgIEBkZWZpbml0aW9uc1ZpZXcuY29uZmlybWVkKHJlc3VsdHNbMF0pXG5cbiAgZGlzcG9zZTogLT5cbiAgICBpZiBAZGlzcG9zYWJsZXNcbiAgICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBpZiBAcHJvdmlkZXJcbiAgICAgIEBwcm92aWRlci5raWxsKClcbiJdfQ==
