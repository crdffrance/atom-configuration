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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9wcm92aWRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFFTixNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsUUFBQSxFQUFVLGdCQUFWO0lBQ0Esa0JBQUEsRUFBb0IsaURBRHBCO0lBRUEsaUJBQUEsRUFBbUIsQ0FGbkI7SUFHQSxrQkFBQSxFQUFvQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0NBQWhCLENBSHBCO0lBSUEsb0JBQUEsRUFBc0IsS0FKdEI7SUFLQSxTQUFBLEVBQVcsRUFMWDtJQU9BLGlCQUFBLEVBQW1CLFNBQUMsTUFBRCxFQUFTLFNBQVQsRUFBb0IsT0FBcEI7QUFDakIsVUFBQTtNQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7TUFDYixVQUFVLENBQUMsZ0JBQVgsQ0FBNEIsU0FBNUIsRUFBdUMsT0FBdkM7TUFDQSxVQUFBLEdBQWlCLElBQUEsSUFBQyxDQUFBLFVBQUQsQ0FBWSxTQUFBO1FBQzNCLEdBQUcsQ0FBQyxLQUFKLENBQVUsb0NBQVYsRUFBZ0QsU0FBaEQsRUFBMkQsT0FBM0Q7ZUFDQSxVQUFVLENBQUMsbUJBQVgsQ0FBK0IsU0FBL0IsRUFBMEMsT0FBMUM7TUFGMkIsQ0FBWjtBQUdqQixhQUFPO0lBTlUsQ0FQbkI7SUFlQSxrQkFBQSxFQUFvQixTQUFDLEtBQUQ7TUFDbEIsSUFBRyxJQUFDLENBQUEsb0JBQUo7QUFDRSxlQURGOztNQUVBLEdBQUcsQ0FBQyxPQUFKLENBQVksNEJBQVosRUFBMEMsS0FBMUM7TUFDQSxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQW5CLENBQ0UsbURBREYsRUFDdUQ7UUFDckQsTUFBQSxFQUFRLHFN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QUMsQ0FBQSxjQUFELENBQWdCLE1BQWhCLEVBQXdCLGNBQXhCLENBQXVDLENBQUMsSUFBeEMsQ0FBNkMsQ0FBQSxTQUFBLEtBQUE7ZUFBQSxTQUFDLE9BQUQ7VUFDM0MsS0FBQyxDQUFBLGVBQWUsQ0FBQyxRQUFqQixDQUEwQixPQUExQjtVQUNBLElBQUcsT0FBTyxDQUFDLE1BQVIsS0FBa0IsQ0FBckI7bUJBQ0UsS0FBQyxDQUFBLGVBQWUsQ0FBQyxTQUFqQixDQUEyQixPQUFRLENBQUEsQ0FBQSxDQUFuQyxFQURGOztRQUYyQztNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0M7SUFSYyxDQWpnQmhCO0lBOGdCQSxPQUFBLEVBQVMsU0FBQTtNQUNQLElBQUcsSUFBQyxDQUFBLFdBQUo7UUFDRSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQSxFQURGOztNQUVBLElBQUcsSUFBQyxDQUFBLFFBQUo7ZUFDRSxJQUFDLENBQUEsUUFBUSxDQUFDLElBQVYsQ0FBQSxFQURGOztJQUhPLENBOWdCVDs7QUFIRiIsInNvdXJjZXNDb250ZW50IjpbImxvZyA9IHJlcXVpcmUgJy4vbG9nJ1xuXG5tb2R1bGUuZXhwb3J0cyA9XG4gIHNlbGVjdG9yOiAnLnNvdXJjZS5weXRob24nXG4gIGRpc2FibGVGb3JTZWxlY3RvcjogJy5zb3VyY2UucHl0aG9uIC5jb21tZW50LCAuc291cmNlLnB5dGhvbiAuc3RyaW5nJ1xuICBpbmNsdXNpb25Qcmlvcml0eTogMlxuICBzdWdnZXN0aW9uUHJpb3JpdHk6IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5zdWdnZXN0aW9uUHJpb3JpdHknKVxuICBleGNsdWRlTG93ZXJQcmlvcml0eTogZmFsc2VcbiAgY2FjaGVTaXplOiAxMFxuXG4gIF9hZGRFdmVudExpc3RlbmVyOiAoZWRpdG9yLCBldmVudE5hbWUsIGhhbmRsZXIpIC0+XG4gICAgZWRpdG9yVmlldyA9IGF0b20udmlld3MuZ2V0VmlldyBlZGl0b3JcbiAgICBlZGl0b3JWaWV3LmFkZEV2ZW50TGlzdGVuZXIgZXZlbnROYW1lLCBoYW5kbGVyXG4gICAgZGlzcG9zYWJsZSA9IG5ldyBARGlzcG9zYWJsZSAtPlxuICAgICAgbG9nLmRlYnVnICdVbnN1YnNjcmliaW5nIGZyb20gZXZlbnQgbGlzdGVuZXIgJywgZXZlbnROYW1lLCBoYW5kbGVyXG4gICAgICBlZGl0b3JWaWV3LnJlbW92ZUV2ZW50TGlzdGVuZXIgZXZlbnROYW1lLCBoYW5kbGVyXG4gICAgcmV0dXJuIGRpc3Bvc2FibGVcblxuICBfbm9FeGVjdXRhYmxlRXJyb3I6IChlcnJvcikgLT5cbiAgICBpZiBAcHJvdmlkZXJOb0V4ZWN1dGFibGVcbiAgICAgIHJldHVyblxuICAgIGxvZy53YXJuaW5nICdObyBweXRob24gZXhlY3V0YWJsZSBmb3VuZCcsIGVycm9yXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAnYXV0b2NvbXBsZXRlLXB5dGhvbiB1bmFibGUgdG8gZmluZCBweXRob24gYmluYXJ5LicsIHtcbiAgICAgIGRldGFpbDogXCJcIlwiUGxlYXNlIHNldCBwYXRoIHRvIHB5dGhvbiBleGVjdXRhYmxlIG1hbnVhbGx5IGluIHBhY2thZ2VcbiAgICAgIHNldHRpbmdzIGFuZCByZXN0YXJ0IHlvdXIgZWRpdG9yLiBCZSBzdXJlIHRvIG1pZ3JhdGUgb24gbmV3IHNldHRpbmdzXG4gICAgICBpZiBldmVyeXRoaW5nIHdvcmtlZCBvbiBwcmV2aW91cyB2ZXJzaW9uLlxuICAgICAgRGV0YWlsZWQgZXJyb3IgbWVzc2FnZTogI3tlcnJvcn1cblxuICAgICAgQ3VycmVudCBjb25maWc6ICN7YXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnB5dGhvblBhdGhzJyl9XCJcIlwiXG4gICAgICBkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gICAgQHByb3ZpZGVyTm9FeGVjdXRhYmxlID0gdHJ1ZVxuXG4gIF9zcGF3bkRhZW1vbjogLT5cbiAgICBpbnRlcnByZXRlciA9IEBJbnRlcnByZXRlckxvb2t1cC5nZXRJbnRlcnByZXRlcigpXG4gICAgbG9nLmRlYnVnICdVc2luZyBpbnRlcnByZXRlcicsIGludGVycHJldGVyXG4gICAgQHByb3ZpZGVyID0gbmV3IEBCdWZmZXJlZFByb2Nlc3NcbiAgICAgIGNvbW1hbmQ6IGludGVycHJldGVyIG9yICdweXRob24nXG4gICAgICBhcmdzOiBbX19kaXJuYW1lICsgJy9jb21wbGV0aW9uLnB5J11cbiAgICAgIHN0ZG91dDogKGRhdGEpID0+XG4gICAgICAgIEBfZGVzZXJpYWxpemUoZGF0YSlcbiAgICAgIHN0ZGVycjogKGRhdGEpID0+XG4gICAgICAgIGlmIGRhdGEuaW5kZXhPZignaXMgbm90IHJlY29nbml6ZWQgYXMgYW4gaW50ZXJuYWwgb3IgZXh0ZXJuYWwnKSA+IC0xXG4gICAgICAgICAgcmV0dXJuIEBfbm9FeGVjdXRhYmxlRXJyb3IoZGF0YSlcbiAgICAgICAgbG9nLmRlYnVnIFwiYXV0b2NvbXBsZXRlLXB5dGhvbiB0cmFjZWJhY2sgb3V0cHV0OiAje2RhdGF9XCJcbiAgICAgICAgaWYgZGF0YS5pbmRleE9mKCdqZWRpJykgPiAtMVxuICAgICAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5vdXRwdXRQcm92aWRlckVycm9ycycpXG4gICAgICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkV2FybmluZyhcbiAgICAgICAgICAgICAgJycnTG9va3MgbGlrZSB0aGlzIGVycm9yIG9yaWdpbmF0ZWQgZnJvbSBKZWRpLiBQbGVhc2UgZG8gbm90XG4gICAgICAgICAgICAgIHJlcG9ydCBzdWNoIGlzc3VlcyBpbiBhdXRvY29tcGxldGUtcHl0aG9uIGlzc3VlIHRyYWNrZXIuIFJlcG9ydFxuICAgICAgICAgICAgICB0aGVtIGRpcmVjdGx5IHRvIEplZGkuIFR1cm4gb2ZmIGBvdXRwdXRQcm92aWRlckVycm9yc2Agc2V0dGluZ1xuICAgICAgICAgICAgICB0byBoaWRlIHN1Y2ggZXJyb3JzIGluIGZ1dHVyZS4gVHJhY2ViYWNrIG91dHB1dDonJycsIHtcbiAgICAgICAgICAgICAgZGV0YWlsOiBcIiN7ZGF0YX1cIixcbiAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWV9KVxuICAgICAgICBlbHNlXG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICAgICAgJ2F1dG9jb21wbGV0ZS1weXRob24gdHJhY2ViYWNrIG91dHB1dDonLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogXCIje2RhdGF9XCIsXG4gICAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlfSlcblxuICAgICAgICBsb2cuZGVidWcgXCJGb3JjaW5nIHRvIHJlc29sdmUgI3tPYmplY3Qua2V5cyhAcmVxdWVzdHMpLmxlbmd0aH0gcHJvbWlzZXNcIlxuICAgICAgICBmb3IgcmVxdWVzdElkLCByZXNvbHZlIG9mIEByZXF1ZXN0c1xuICAgICAgICAgIGlmIHR5cGVvZiByZXNvbHZlID09ICdmdW5jdGlvbidcbiAgICAgICAgICAgIHJlc29sdmUoW10pXG4gICAgICAgICAgZGVsZXRlIEByZXF1ZXN0c1tyZXF1ZXN0SWRdXG5cbiAgICAgIGV4aXQ6IChjb2RlKSA9PlxuICAgICAgICBsb2cud2FybmluZyAnUHJvY2VzcyBleGl0IHdpdGgnLCBjb2RlLCBAcHJvdmlkZXJcbiAgICBAcHJvdmlkZXIub25XaWxsVGhyb3dFcnJvciAoe2Vycm9yLCBoYW5kbGV9KSA9PlxuICAgICAgaWYgZXJyb3IuY29kZSBpcyAnRU5PRU5UJyBhbmQgZXJyb3Iuc3lzY2FsbC5pbmRleE9mKCdzcGF3bicpIGlzIDBcbiAgICAgICAgQF9ub0V4ZWN1dGFibGVFcnJvcihlcnJvcilcbiAgICAgICAgQGRpc3Bvc2UoKVxuICAgICAgICBoYW5kbGUoKVxuICAgICAgZWxzZVxuICAgICAgICB0aHJvdyBlcnJvclxuXG4gICAgQHByb3ZpZGVyLnByb2Nlc3M/LnN0ZGluLm9uICdlcnJvcicsIChlcnIpIC0+XG4gICAgICBsb2cuZGVidWcgJ3N0ZGluJywgZXJyXG5cbiAgICBzZXRUaW1lb3V0ID0+XG4gICAgICBsb2cuZGVidWcgJ0tpbGxpbmcgcHl0aG9uIHByb2Nlc3MgYWZ0ZXIgdGltZW91dC4uLidcbiAgICAgIGlmIEBwcm92aWRlciBhbmQgQHByb3ZpZGVyLnByb2Nlc3NcbiAgICAgICAgQHByb3ZpZGVyLmtpbGwoKVxuICAgICwgNjAgKiAxMCAqIDEwMDBcblxuICBsb2FkOiAtPlxuICAgIGlmIG5vdCBAY29uc3RydWN0ZWRcbiAgICAgIEBjb25zdHJ1Y3RvcigpXG4gICAgcmV0dXJuIHRoaXNcblxuICBjb25zdHJ1Y3RvcjogKCkgLT5cbiAgICB7QERpc3Bvc2FibGUsIEBDb21wb3NpdGVEaXNwb3NhYmxlLCBAQnVmZmVyZWRQcm9jZXNzfSA9IHJlcXVpcmUgJ2F0b20nXG4gICAge0BzZWxlY3RvcnNNYXRjaFNjb3BlQ2hhaW59ID0gcmVxdWlyZSAnLi9zY29wZS1oZWxwZXJzJ1xuICAgIHtAU2VsZWN0b3J9ID0gcmVxdWlyZSAnc2VsZWN0b3Ita2l0J1xuICAgIEBEZWZpbml0aW9uc1ZpZXcgPSByZXF1aXJlICcuL2RlZmluaXRpb25zLXZpZXcnXG4gICAgQFVzYWdlc1ZpZXcgPSByZXF1aXJlICcuL3VzYWdlcy12aWV3J1xuICAgIEBPdmVycmlkZVZpZXcgPSByZXF1aXJlICcuL292ZXJyaWRlLXZpZXcnXG4gICAgQFJlbmFtZVZpZXcgPSByZXF1aXJlICcuL3JlbmFtZS12aWV3J1xuICAgIEBJbnRlcnByZXRlckxvb2t1cCA9IHJlcXVpcmUgJy4vaW50ZXJwcmV0ZXJzLWxvb2t1cCdcbiAgICBAXyA9IHJlcXVpcmUgJ3VuZGVyc2NvcmUnXG4gICAgQGZpbHRlciA9IHJlcXVpcmUoJ2Z1enphbGRyaW4tcGx1cycpLmZpbHRlclxuXG4gICAgQHJlcXVlc3RzID0ge31cbiAgICBAcmVzcG9uc2VzID0ge31cbiAgICBAcHJvdmlkZXIgPSBudWxsXG4gICAgQGRpc3Bvc2FibGVzID0gbmV3IEBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMgPSB7fVxuICAgIEBkZWZpbml0aW9uc1ZpZXcgPSBudWxsXG4gICAgQHVzYWdlc1ZpZXcgPSBudWxsXG4gICAgQHJlbmFtZVZpZXcgPSBudWxsXG4gICAgQGNvbnN0cnVjdGVkID0gdHJ1ZVxuICAgIEBzbmlwcGV0c01hbmFnZXIgPSBudWxsXG5cbiAgICBsb2cuZGVidWcgXCJJbml0IGF1dG9jb21wbGV0ZS1weXRob24gd2l0aCBwcmlvcml0eSAje0BzdWdnZXN0aW9uUHJpb3JpdHl9XCJcblxuICAgIHRyeVxuICAgICAgQHRyaWdnZXJDb21wbGV0aW9uUmVnZXggPSBSZWdFeHAgYXRvbS5jb25maWcuZ2V0KFxuICAgICAgICAnYXV0b2NvbXBsZXRlLXB5dGhvbi50cmlnZ2VyQ29tcGxldGlvblJlZ2V4JylcbiAgICBjYXRjaCBlcnJcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRXYXJuaW5nKFxuICAgICAgICAnJydhdXRvY29tcGxldGUtcHl0aG9uIGludmFsaWQgcmVnZXhwIHRvIHRyaWdnZXIgYXV0b2NvbXBsZXRpb25zLlxuICAgICAgICBGYWxsaW5nIGJhY2sgdG8gZGVmYXVsdCB2YWx1ZS4nJycsIHtcbiAgICAgICAgZGV0YWlsOiBcIk9yaWdpbmFsIGV4Y2VwdGlvbjogI3tlcnJ9XCJcbiAgICAgICAgZGlzbWlzc2FibGU6IHRydWV9KVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLnRyaWdnZXJDb21wbGV0aW9uUmVnZXgnLFxuICAgICAgICAgICAgICAgICAgICAgICcoW1xcLlxcIF18W2EtekEtWl9dW2EtekEtWjAtOV9dKiknKVxuICAgICAgQHRyaWdnZXJDb21wbGV0aW9uUmVnZXggPSAvKFtcXC5cXCBdfFthLXpBLVpfXVthLXpBLVowLTlfXSopL1xuXG4gICAgc2VsZWN0b3IgPSAnYXRvbS10ZXh0LWVkaXRvcltkYXRhLWdyYW1tYXJ+PXB5dGhvbl0nXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgc2VsZWN0b3IsICdhdXRvY29tcGxldGUtcHl0aG9uOmdvLXRvLWRlZmluaXRpb24nLCA9PlxuICAgICAgQGdvVG9EZWZpbml0aW9uKClcbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBzZWxlY3RvciwgJ2F1dG9jb21wbGV0ZS1weXRob246Y29tcGxldGUtYXJndW1lbnRzJywgPT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgQF9jb21wbGV0ZUFyZ3VtZW50cyhlZGl0b3IsIGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpLCB0cnVlKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgc2VsZWN0b3IsICdhdXRvY29tcGxldGUtcHl0aG9uOnNob3ctdXNhZ2VzJywgPT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgYnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgICAgaWYgQHVzYWdlc1ZpZXdcbiAgICAgICAgQHVzYWdlc1ZpZXcuZGVzdHJveSgpXG4gICAgICBAdXNhZ2VzVmlldyA9IG5ldyBAVXNhZ2VzVmlldygpXG4gICAgICBAZ2V0VXNhZ2VzKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pLnRoZW4gKHVzYWdlcykgPT5cbiAgICAgICAgQHVzYWdlc1ZpZXcuc2V0SXRlbXModXNhZ2VzKVxuXG4gICAgYXRvbS5jb21tYW5kcy5hZGQgc2VsZWN0b3IsICdhdXRvY29tcGxldGUtcHl0aG9uOm92ZXJyaWRlLW1ldGhvZCcsID0+XG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcbiAgICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcbiAgICAgIGlmIEBvdmVycmlkZVZpZXdcbiAgICAgICAgQG92ZXJyaWRlVmlldy5kZXN0cm95KClcbiAgICAgIEBvdmVycmlkZVZpZXcgPSBuZXcgQE92ZXJyaWRlVmlldygpXG4gICAgICBAZ2V0TWV0aG9kcyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKS50aGVuICh7bWV0aG9kcywgaW5kZW50LCBidWZmZXJQb3NpdGlvbn0pID0+XG4gICAgICAgIEBvdmVycmlkZVZpZXcuaW5kZW50ID0gaW5kZW50XG4gICAgICAgIEBvdmVycmlkZVZpZXcuYnVmZmVyUG9zaXRpb24gPSBidWZmZXJQb3NpdGlvblxuICAgICAgICBAb3ZlcnJpZGVWaWV3LnNldEl0ZW1zKG1ldGhvZHMpXG5cbiAgICBhdG9tLmNvbW1hbmRzLmFkZCBzZWxlY3RvciwgJ2F1dG9jb21wbGV0ZS1weXRob246cmVuYW1lJywgPT5cbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgICAgYnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgICAgQGdldFVzYWdlcyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKS50aGVuICh1c2FnZXMpID0+XG4gICAgICAgIGlmIEByZW5hbWVWaWV3XG4gICAgICAgICAgQHJlbmFtZVZpZXcuZGVzdHJveSgpXG4gICAgICAgIGlmIHVzYWdlcy5sZW5ndGggPiAwXG4gICAgICAgICAgQHJlbmFtZVZpZXcgPSBuZXcgQFJlbmFtZVZpZXcodXNhZ2VzKVxuICAgICAgICAgIEByZW5hbWVWaWV3Lm9uSW5wdXQgKG5ld05hbWUpID0+XG4gICAgICAgICAgICBmb3IgZmlsZU5hbWUsIHVzYWdlcyBvZiBAXy5ncm91cEJ5KHVzYWdlcywgJ2ZpbGVOYW1lJylcbiAgICAgICAgICAgICAgW3Byb2plY3QsIF9yZWxhdGl2ZV0gPSBhdG9tLnByb2plY3QucmVsYXRpdml6ZVBhdGgoZmlsZU5hbWUpXG4gICAgICAgICAgICAgIGlmIHByb2plY3RcbiAgICAgICAgICAgICAgICBAX3VwZGF0ZVVzYWdlc0luRmlsZShmaWxlTmFtZSwgdXNhZ2VzLCBuZXdOYW1lKVxuICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAgbG9nLmRlYnVnICdJZ25vcmluZyBmaWxlIG91dHNpZGUgb2YgcHJvamVjdCcsIGZpbGVOYW1lXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBpZiBAdXNhZ2VzVmlld1xuICAgICAgICAgICAgQHVzYWdlc1ZpZXcuZGVzdHJveSgpXG4gICAgICAgICAgQHVzYWdlc1ZpZXcgPSBuZXcgQFVzYWdlc1ZpZXcoKVxuICAgICAgICAgIEB1c2FnZXNWaWV3LnNldEl0ZW1zKHVzYWdlcylcblxuICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgQF9oYW5kbGVHcmFtbWFyQ2hhbmdlRXZlbnQoZWRpdG9yLCBlZGl0b3IuZ2V0R3JhbW1hcigpKVxuICAgICAgZWRpdG9yLm9uRGlkQ2hhbmdlR3JhbW1hciAoZ3JhbW1hcikgPT5cbiAgICAgICAgQF9oYW5kbGVHcmFtbWFyQ2hhbmdlRXZlbnQoZWRpdG9yLCBncmFtbWFyKVxuXG4gICAgYXRvbS5jb25maWcub25EaWRDaGFuZ2UgJ2F1dG9jb21wbGV0ZS1wbHVzLmVuYWJsZUF1dG9BY3RpdmF0aW9uJywgPT5cbiAgICAgIGF0b20ud29ya3NwYWNlLm9ic2VydmVUZXh0RWRpdG9ycyAoZWRpdG9yKSA9PlxuICAgICAgICBAX2hhbmRsZUdyYW1tYXJDaGFuZ2VFdmVudChlZGl0b3IsIGVkaXRvci5nZXRHcmFtbWFyKCkpXG5cbiAgX3VwZGF0ZVVzYWdlc0luRmlsZTogKGZpbGVOYW1lLCB1c2FnZXMsIG5ld05hbWUpIC0+XG4gICAgY29sdW1uT2Zmc2V0ID0ge31cbiAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpbGVOYW1lLCBhY3RpdmF0ZUl0ZW06IGZhbHNlKS50aGVuIChlZGl0b3IpIC0+XG4gICAgICBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgICAgIGZvciB1c2FnZSBpbiB1c2FnZXNcbiAgICAgICAge25hbWUsIGxpbmUsIGNvbHVtbn0gPSB1c2FnZVxuICAgICAgICBjb2x1bW5PZmZzZXRbbGluZV0gPz0gMFxuICAgICAgICBsb2cuZGVidWcgJ1JlcGxhY2luZycsIHVzYWdlLCAnd2l0aCcsIG5ld05hbWUsICdpbicsIGVkaXRvci5pZFxuICAgICAgICBsb2cuZGVidWcgJ09mZnNldCBmb3IgbGluZScsIGxpbmUsICdpcycsIGNvbHVtbk9mZnNldFtsaW5lXVxuICAgICAgICBidWZmZXIuc2V0VGV4dEluUmFuZ2UoW1xuICAgICAgICAgIFtsaW5lIC0gMSwgY29sdW1uICsgY29sdW1uT2Zmc2V0W2xpbmVdXSxcbiAgICAgICAgICBbbGluZSAtIDEsIGNvbHVtbiArIG5hbWUubGVuZ3RoICsgY29sdW1uT2Zmc2V0W2xpbmVdXSxcbiAgICAgICAgICBdLCBuZXdOYW1lKVxuICAgICAgICBjb2x1bW5PZmZzZXRbbGluZV0gKz0gbmV3TmFtZS5sZW5ndGggLSBuYW1lLmxlbmd0aFxuICAgICAgYnVmZmVyLnNhdmUoKVxuXG5cbiAgX3Nob3dTaWduYXR1cmVPdmVybGF5OiAoZXZlbnQpIC0+XG4gICAgaWYgQG1hcmtlcnNcbiAgICAgIGZvciBtYXJrZXIgaW4gQG1hcmtlcnNcbiAgICAgICAgbG9nLmRlYnVnICdkZXN0cm95aW5nIG9sZCBtYXJrZXInLCBtYXJrZXJcbiAgICAgICAgbWFya2VyLmRlc3Ryb3koKVxuICAgIGVsc2VcbiAgICAgIEBtYXJrZXJzID0gW11cblxuICAgIGN1cnNvciA9IGV2ZW50LmN1cnNvclxuICAgIGVkaXRvciA9IGV2ZW50LmN1cnNvci5lZGl0b3JcbiAgICB3b3JkQnVmZmVyUmFuZ2UgPSBjdXJzb3IuZ2V0Q3VycmVudFdvcmRCdWZmZXJSYW5nZSgpXG4gICAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKFxuICAgICAgZXZlbnQubmV3QnVmZmVyUG9zaXRpb24pXG4gICAgc2NvcGVDaGFpbiA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZUNoYWluKClcblxuICAgIGRpc2FibGVGb3JTZWxlY3RvciA9IFwiI3tAZGlzYWJsZUZvclNlbGVjdG9yfSwgLnNvdXJjZS5weXRob24gLm51bWVyaWMsIC5zb3VyY2UucHl0aG9uIC5pbnRlZ2VyLCAuc291cmNlLnB5dGhvbiAuZGVjaW1hbCwgLnNvdXJjZS5weXRob24gLnB1bmN0dWF0aW9uLCAuc291cmNlLnB5dGhvbiAua2V5d29yZCwgLnNvdXJjZS5weXRob24gLnN0b3JhZ2UsIC5zb3VyY2UucHl0aG9uIC52YXJpYWJsZS5wYXJhbWV0ZXIsIC5zb3VyY2UucHl0aG9uIC5lbnRpdHkubmFtZVwiXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yID0gQFNlbGVjdG9yLmNyZWF0ZShkaXNhYmxlRm9yU2VsZWN0b3IpXG5cbiAgICBpZiBAc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWluKGRpc2FibGVGb3JTZWxlY3Rvciwgc2NvcGVDaGFpbilcbiAgICAgIGxvZy5kZWJ1ZyAnZG8gbm90aGluZyBmb3IgdGhpcyBzZWxlY3RvcidcbiAgICAgIHJldHVyblxuXG4gICAgbWFya2VyID0gZWRpdG9yLm1hcmtCdWZmZXJSYW5nZShcbiAgICAgIHdvcmRCdWZmZXJSYW5nZSxcbiAgICAgIHtwZXJzaXN0ZW50OiBmYWxzZSwgaW52YWxpZGF0ZTogJ25ldmVyJ30pXG5cbiAgICBAbWFya2Vycy5wdXNoKG1hcmtlcilcblxuICAgIGdldFRvb2x0aXAgPSAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgPT5cbiAgICAgIHBheWxvYWQgPVxuICAgICAgICBpZDogQF9nZW5lcmF0ZVJlcXVlc3RJZCgndG9vbHRpcCcsIGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICAgIGxvb2t1cDogJ3Rvb2x0aXAnXG4gICAgICAgIHBhdGg6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgICAgc291cmNlOiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgICBjb2x1bW46IGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuICAgICAgICBjb25maWc6IEBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnKClcbiAgICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UgKHJlc29sdmUpID0+XG4gICAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IHJlc29sdmVcblxuICAgIGdldFRvb2x0aXAoZWRpdG9yLCBldmVudC5uZXdCdWZmZXJQb3NpdGlvbikudGhlbiAocmVzdWx0cykgPT5cbiAgICAgIGlmIHJlc3VsdHMubGVuZ3RoID4gMFxuICAgICAgICB7dGV4dCwgZmlsZU5hbWUsIGxpbmUsIGNvbHVtbiwgdHlwZSwgZGVzY3JpcHRpb259ID0gcmVzdWx0c1swXVxuXG4gICAgICAgIGRlc2NyaXB0aW9uID0gZGVzY3JpcHRpb24udHJpbSgpXG4gICAgICAgIGlmIG5vdCBkZXNjcmlwdGlvblxuICAgICAgICAgIHJldHVyblxuICAgICAgICB2aWV3ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXV0b2NvbXBsZXRlLXB5dGhvbi1zdWdnZXN0aW9uJylcbiAgICAgICAgdmlldy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShkZXNjcmlwdGlvbikpXG4gICAgICAgIGRlY29yYXRpb24gPSBlZGl0b3IuZGVjb3JhdGVNYXJrZXIobWFya2VyLCB7XG4gICAgICAgICAgICB0eXBlOiAnb3ZlcmxheScsXG4gICAgICAgICAgICBpdGVtOiB2aWV3LFxuICAgICAgICAgICAgcG9zaXRpb246ICdoZWFkJ1xuICAgICAgICB9KVxuICAgICAgICBsb2cuZGVidWcoJ2RlY29yYXRlZCBtYXJrZXInLCBtYXJrZXIpXG5cbiAgX2hhbmRsZUdyYW1tYXJDaGFuZ2VFdmVudDogKGVkaXRvciwgZ3JhbW1hcikgLT5cbiAgICBldmVudE5hbWUgPSAna2V5dXAnXG4gICAgZXZlbnRJZCA9IFwiI3tlZGl0b3IuaWR9LiN7ZXZlbnROYW1lfVwiXG4gICAgaWYgZ3JhbW1hci5zY29wZU5hbWUgPT0gJ3NvdXJjZS5weXRob24nXG5cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5zaG93VG9vbHRpcHMnKSBpcyB0cnVlXG4gICAgICAgIGVkaXRvci5vbkRpZENoYW5nZUN1cnNvclBvc2l0aW9uIChldmVudCkgPT5cbiAgICAgICAgICBAX3Nob3dTaWduYXR1cmVPdmVybGF5KGV2ZW50KVxuXG4gICAgICBpZiBub3QgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcGx1cy5lbmFibGVBdXRvQWN0aXZhdGlvbicpXG4gICAgICAgIGxvZy5kZWJ1ZyAnSWdub3Jpbmcga2V5dXAgZXZlbnRzIGR1ZSB0byBhdXRvY29tcGxldGUtcGx1cyBzZXR0aW5ncy4nXG4gICAgICAgIHJldHVyblxuICAgICAgZGlzcG9zYWJsZSA9IEBfYWRkRXZlbnRMaXN0ZW5lciBlZGl0b3IsIGV2ZW50TmFtZSwgKGUpID0+XG4gICAgICAgIGJyYWNrZXRJZGVudGlmaWVycyA9XG4gICAgICAgICAgJ1UrMDAyOCc6ICdxd2VydHknXG4gICAgICAgICAgJ1UrMDAzOCc6ICdnZXJtYW4nXG4gICAgICAgICAgJ1UrMDAzNSc6ICdhemVydHknXG4gICAgICAgICAgJ1UrMDAzOSc6ICdvdGhlcidcbiAgICAgICAgaWYgZS5rZXlJZGVudGlmaWVyIG9mIGJyYWNrZXRJZGVudGlmaWVyc1xuICAgICAgICAgIGxvZy5kZWJ1ZyAnVHJ5aW5nIHRvIGNvbXBsZXRlIGFyZ3VtZW50cyBvbiBrZXl1cCBldmVudCcsIGVcbiAgICAgICAgICBAX2NvbXBsZXRlQXJndW1lbnRzKGVkaXRvciwgZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKCkpXG4gICAgICBAZGlzcG9zYWJsZXMuYWRkIGRpc3Bvc2FibGVcbiAgICAgIEBzdWJzY3JpcHRpb25zW2V2ZW50SWRdID0gZGlzcG9zYWJsZVxuICAgICAgbG9nLmRlYnVnICdTdWJzY3JpYmVkIG9uIGV2ZW50JywgZXZlbnRJZFxuICAgIGVsc2VcbiAgICAgIGlmIGV2ZW50SWQgb2YgQHN1YnNjcmlwdGlvbnNcbiAgICAgICAgQHN1YnNjcmlwdGlvbnNbZXZlbnRJZF0uZGlzcG9zZSgpXG4gICAgICAgIGxvZy5kZWJ1ZyAnVW5zdWJzY3JpYmVkIGZyb20gZXZlbnQnLCBldmVudElkXG5cbiAgX3NlcmlhbGl6ZTogKHJlcXVlc3QpIC0+XG4gICAgbG9nLmRlYnVnICdTZXJpYWxpemluZyByZXF1ZXN0IHRvIGJlIHNlbnQgdG8gSmVkaScsIHJlcXVlc3RcbiAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkocmVxdWVzdClcblxuICBfc2VuZFJlcXVlc3Q6IChkYXRhLCByZXNwYXduZWQpIC0+XG4gICAgbG9nLmRlYnVnICdQZW5kaW5nIHJlcXVlc3RzOicsIE9iamVjdC5rZXlzKEByZXF1ZXN0cykubGVuZ3RoLCBAcmVxdWVzdHNcbiAgICBpZiBPYmplY3Qua2V5cyhAcmVxdWVzdHMpLmxlbmd0aCA+IDEwXG4gICAgICBsb2cuZGVidWcgJ0NsZWFuaW5nIHVwIHJlcXVlc3QgcXVldWUgdG8gYXZvaWQgb3ZlcmZsb3csIGlnbm9yaW5nIHJlcXVlc3QnXG4gICAgICBAcmVxdWVzdHMgPSB7fVxuICAgICAgaWYgQHByb3ZpZGVyIGFuZCBAcHJvdmlkZXIucHJvY2Vzc1xuICAgICAgICBsb2cuZGVidWcgJ0tpbGxpbmcgcHl0aG9uIHByb2Nlc3MnXG4gICAgICAgIEBwcm92aWRlci5raWxsKClcbiAgICAgICAgcmV0dXJuXG5cbiAgICBpZiBAcHJvdmlkZXIgYW5kIEBwcm92aWRlci5wcm9jZXNzXG4gICAgICBwcm9jZXNzID0gQHByb3ZpZGVyLnByb2Nlc3NcbiAgICAgIGlmIHByb2Nlc3MuZXhpdENvZGUgPT0gbnVsbCBhbmQgcHJvY2Vzcy5zaWduYWxDb2RlID09IG51bGxcbiAgICAgICAgaWYgQHByb3ZpZGVyLnByb2Nlc3MucGlkXG4gICAgICAgICAgcmV0dXJuIEBwcm92aWRlci5wcm9jZXNzLnN0ZGluLndyaXRlKGRhdGEgKyAnXFxuJylcbiAgICAgICAgZWxzZVxuICAgICAgICAgIGxvZy5kZWJ1ZyAnQXR0ZW1wdCB0byBjb21tdW5pY2F0ZSB3aXRoIHRlcm1pbmF0ZWQgcHJvY2VzcycsIEBwcm92aWRlclxuICAgICAgZWxzZSBpZiByZXNwYXduZWRcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXG4gICAgICAgICAgW1wiRmFpbGVkIHRvIHNwYXduIGRhZW1vbiBmb3IgYXV0b2NvbXBsZXRlLXB5dGhvbi5cIlxuICAgICAgICAgICBcIkNvbXBsZXRpb25zIHdpbGwgbm90IHdvcmsgYW55bW9yZVwiXG4gICAgICAgICAgIFwidW5sZXNzIHlvdSByZXN0YXJ0IHlvdXIgZWRpdG9yLlwiXS5qb2luKCcgJyksIHtcbiAgICAgICAgICBkZXRhaWw6IFtcImV4aXRDb2RlOiAje3Byb2Nlc3MuZXhpdENvZGV9XCJcbiAgICAgICAgICAgICAgICAgICBcInNpZ25hbENvZGU6ICN7cHJvY2Vzcy5zaWduYWxDb2RlfVwiXS5qb2luKCdcXG4nKSxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZX0pXG4gICAgICAgIEBkaXNwb3NlKClcbiAgICAgIGVsc2VcbiAgICAgICAgQF9zcGF3bkRhZW1vbigpXG4gICAgICAgIEBfc2VuZFJlcXVlc3QoZGF0YSwgcmVzcGF3bmVkOiB0cnVlKVxuICAgICAgICBsb2cuZGVidWcgJ1JlLXNwYXduaW5nIHB5dGhvbiBwcm9jZXNzLi4uJ1xuICAgIGVsc2VcbiAgICAgIGxvZy5kZWJ1ZyAnU3Bhd25pbmcgcHl0aG9uIHByb2Nlc3MuLi4nXG4gICAgICBAX3NwYXduRGFlbW9uKClcbiAgICAgIEBfc2VuZFJlcXVlc3QoZGF0YSlcblxuICBfZGVzZXJpYWxpemU6IChyZXNwb25zZSkgLT5cbiAgICBsb2cuZGVidWcgJ0Rlc2VyZWFsaXppbmcgcmVzcG9uc2UgZnJvbSBKZWRpJywgcmVzcG9uc2VcbiAgICBsb2cuZGVidWcgXCJHb3QgI3tyZXNwb25zZS50cmltKCkuc3BsaXQoJ1xcbicpLmxlbmd0aH0gbGluZXNcIlxuICAgIGZvciByZXNwb25zZVNvdXJjZSBpbiByZXNwb25zZS50cmltKCkuc3BsaXQoJ1xcbicpXG4gICAgICB0cnlcbiAgICAgICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlU291cmNlKVxuICAgICAgY2F0Y2ggZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJcIlwiRmFpbGVkIHRvIHBhcnNlIEpTT04gZnJvbSBcXFwiI3tyZXNwb25zZVNvdXJjZX1cXFwiLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgT3JpZ2luYWwgZXhjZXB0aW9uOiAje2V9XCJcIlwiKVxuXG4gICAgICBpZiByZXNwb25zZVsnYXJndW1lbnRzJ11cbiAgICAgICAgZWRpdG9yID0gQHJlcXVlc3RzW3Jlc3BvbnNlWydpZCddXVxuICAgICAgICBpZiB0eXBlb2YgZWRpdG9yID09ICdvYmplY3QnXG4gICAgICAgICAgYnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgICAgICAgICMgQ29tcGFyZSByZXNwb25zZSBJRCB3aXRoIGN1cnJlbnQgc3RhdGUgdG8gYXZvaWQgc3RhbGUgY29tcGxldGlvbnNcbiAgICAgICAgICBpZiByZXNwb25zZVsnaWQnXSA9PSBAX2dlbmVyYXRlUmVxdWVzdElkKCdhcmd1bWVudHMnLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgICAgICAgQHNuaXBwZXRzTWFuYWdlcj8uaW5zZXJ0U25pcHBldChyZXNwb25zZVsnYXJndW1lbnRzJ10sIGVkaXRvcilcbiAgICAgIGVsc2VcbiAgICAgICAgcmVzb2x2ZSA9IEByZXF1ZXN0c1tyZXNwb25zZVsnaWQnXV1cbiAgICAgICAgaWYgdHlwZW9mIHJlc29sdmUgPT0gJ2Z1bmN0aW9uJ1xuICAgICAgICAgIHJlc29sdmUocmVzcG9uc2VbJ3Jlc3VsdHMnXSlcbiAgICAgIGNhY2hlU2l6ZURlbHRhID0gT2JqZWN0LmtleXMoQHJlc3BvbnNlcykubGVuZ3RoID4gQGNhY2hlU2l6ZVxuICAgICAgaWYgY2FjaGVTaXplRGVsdGEgPiAwXG4gICAgICAgIGlkcyA9IE9iamVjdC5rZXlzKEByZXNwb25zZXMpLnNvcnQgKGEsIGIpID0+XG4gICAgICAgICAgcmV0dXJuIEByZXNwb25zZXNbYV1bJ3RpbWVzdGFtcCddIC0gQHJlc3BvbnNlc1tiXVsndGltZXN0YW1wJ11cbiAgICAgICAgZm9yIGlkIGluIGlkcy5zbGljZSgwLCBjYWNoZVNpemVEZWx0YSlcbiAgICAgICAgICBsb2cuZGVidWcgJ1JlbW92aW5nIG9sZCBpdGVtIGZyb20gY2FjaGUgd2l0aCBJRCcsIGlkXG4gICAgICAgICAgZGVsZXRlIEByZXNwb25zZXNbaWRdXG4gICAgICBAcmVzcG9uc2VzW3Jlc3BvbnNlWydpZCddXSA9XG4gICAgICAgIHNvdXJjZTogcmVzcG9uc2VTb3VyY2VcbiAgICAgICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXG4gICAgICBsb2cuZGVidWcgJ0NhY2hlZCByZXF1ZXN0IHdpdGggSUQnLCByZXNwb25zZVsnaWQnXVxuICAgICAgZGVsZXRlIEByZXF1ZXN0c1tyZXNwb25zZVsnaWQnXV1cblxuICBfZ2VuZXJhdGVSZXF1ZXN0SWQ6ICh0eXBlLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCB0ZXh0KSAtPlxuICAgIGlmIG5vdCB0ZXh0XG4gICAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKVxuICAgIHJldHVybiByZXF1aXJlKCdjcnlwdG8nKS5jcmVhdGVIYXNoKCdtZDUnKS51cGRhdGUoW1xuICAgICAgZWRpdG9yLmdldFBhdGgoKSwgdGV4dCwgYnVmZmVyUG9zaXRpb24ucm93LFxuICAgICAgYnVmZmVyUG9zaXRpb24uY29sdW1uLCB0eXBlXS5qb2luKCkpLmRpZ2VzdCgnaGV4JylcblxuICBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnOiAtPlxuICAgIGV4dHJhUGF0aHMgPSBASW50ZXJwcmV0ZXJMb29rdXAuYXBwbHlTdWJzdGl0dXRpb25zKFxuICAgICAgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLmV4dHJhUGF0aHMnKS5zcGxpdCgnOycpKVxuICAgIGFyZ3MgPVxuICAgICAgJ2V4dHJhUGF0aHMnOiBleHRyYVBhdGhzXG4gICAgICAndXNlU25pcHBldHMnOiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24udXNlU25pcHBldHMnKVxuICAgICAgJ2Nhc2VJbnNlbnNpdGl2ZUNvbXBsZXRpb24nOiBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAgICdhdXRvY29tcGxldGUtcHl0aG9uLmNhc2VJbnNlbnNpdGl2ZUNvbXBsZXRpb24nKVxuICAgICAgJ3Nob3dEZXNjcmlwdGlvbnMnOiBhdG9tLmNvbmZpZy5nZXQoXG4gICAgICAgICdhdXRvY29tcGxldGUtcHl0aG9uLnNob3dEZXNjcmlwdGlvbnMnKVxuICAgICAgJ2Z1enp5TWF0Y2hlcic6IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5mdXp6eU1hdGNoZXInKVxuICAgIHJldHVybiBhcmdzXG5cbiAgc2V0U25pcHBldHNNYW5hZ2VyOiAoQHNuaXBwZXRzTWFuYWdlcikgLT5cblxuICBfY29tcGxldGVBcmd1bWVudHM6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBmb3JjZSkgLT5cbiAgICB1c2VTbmlwcGV0cyA9IGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi51c2VTbmlwcGV0cycpXG4gICAgaWYgbm90IGZvcmNlIGFuZCB1c2VTbmlwcGV0cyA9PSAnbm9uZSdcbiAgICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goZG9jdW1lbnQucXVlcnlTZWxlY3RvcignYXRvbS10ZXh0LWVkaXRvcicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYXV0b2NvbXBsZXRlLXBsdXM6YWN0aXZhdGUnKVxuICAgICAgcmV0dXJuXG4gICAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKGJ1ZmZlclBvc2l0aW9uKVxuICAgIHNjb3BlQ2hhaW4gPSBzY29wZURlc2NyaXB0b3IuZ2V0U2NvcGVDaGFpbigpXG4gICAgZGlzYWJsZUZvclNlbGVjdG9yID0gQFNlbGVjdG9yLmNyZWF0ZShAZGlzYWJsZUZvclNlbGVjdG9yKVxuICAgIGlmIEBzZWxlY3RvcnNNYXRjaFNjb3BlQ2hhaW4oZGlzYWJsZUZvclNlbGVjdG9yLCBzY29wZUNoYWluKVxuICAgICAgbG9nLmRlYnVnICdJZ25vcmluZyBhcmd1bWVudCBjb21wbGV0aW9uIGluc2lkZSBvZicsIHNjb3BlQ2hhaW5cbiAgICAgIHJldHVyblxuXG4gICAgIyB3ZSBkb24ndCB3YW50IHRvIGNvbXBsZXRlIGFyZ3VtZW50cyBpbnNpZGUgb2YgZXhpc3RpbmcgY29kZVxuICAgIGxpbmVzID0gZWRpdG9yLmdldEJ1ZmZlcigpLmdldExpbmVzKClcbiAgICBsaW5lID0gbGluZXNbYnVmZmVyUG9zaXRpb24ucm93XVxuICAgIHByZWZpeCA9IGxpbmUuc2xpY2UoYnVmZmVyUG9zaXRpb24uY29sdW1uIC0gMSwgYnVmZmVyUG9zaXRpb24uY29sdW1uKVxuICAgIGlmIHByZWZpeCBpc250ICcoJ1xuICAgICAgbG9nLmRlYnVnICdJZ25vcmluZyBhcmd1bWVudCBjb21wbGV0aW9uIHdpdGggcHJlZml4JywgcHJlZml4XG4gICAgICByZXR1cm5cbiAgICBzdWZmaXggPSBsaW5lLnNsaWNlIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiwgbGluZS5sZW5ndGhcbiAgICBpZiBub3QgL14oXFwpKD86JHxcXHMpfFxcc3wkKS8udGVzdChzdWZmaXgpXG4gICAgICBsb2cuZGVidWcgJ0lnbm9yaW5nIGFyZ3VtZW50IGNvbXBsZXRpb24gd2l0aCBzdWZmaXgnLCBzdWZmaXhcbiAgICAgIHJldHVyblxuXG4gICAgcGF5bG9hZCA9XG4gICAgICBpZDogQF9nZW5lcmF0ZVJlcXVlc3RJZCgnYXJndW1lbnRzJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIGxvb2t1cDogJ2FyZ3VtZW50cydcbiAgICAgIHBhdGg6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHNvdXJjZTogZWRpdG9yLmdldFRleHQoKVxuICAgICAgbGluZTogYnVmZmVyUG9zaXRpb24ucm93XG4gICAgICBjb2x1bW46IGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuICAgICAgY29uZmlnOiBAX2dlbmVyYXRlUmVxdWVzdENvbmZpZygpXG5cbiAgICBAX3NlbmRSZXF1ZXN0KEBfc2VyaWFsaXplKHBheWxvYWQpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSA9PlxuICAgICAgQHJlcXVlc3RzW3BheWxvYWQuaWRdID0gZWRpdG9yXG5cbiAgX2Z1enp5RmlsdGVyOiAoY2FuZGlkYXRlcywgcXVlcnkpIC0+XG4gICAgaWYgY2FuZGlkYXRlcy5sZW5ndGggaXNudCAwIGFuZCBxdWVyeSBub3QgaW4gWycgJywgJy4nLCAnKCddXG4gICAgICBjYW5kaWRhdGVzID0gQGZpbHRlcihjYW5kaWRhdGVzLCBxdWVyeSwga2V5OiAndGV4dCcpXG4gICAgcmV0dXJuIGNhbmRpZGF0ZXNcblxuICBnZXRTdWdnZXN0aW9uczogKHtlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uLCBzY29wZURlc2NyaXB0b3IsIHByZWZpeH0pIC0+XG4gICAgaWYgbm90IEB0cmlnZ2VyQ29tcGxldGlvblJlZ2V4LnRlc3QocHJlZml4KVxuICAgICAgcmV0dXJuIFtdXG4gICAgYnVmZmVyUG9zaXRpb24gPVxuICAgICAgcm93OiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgbGluZXMgPSBlZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TGluZXMoKVxuICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5mdXp6eU1hdGNoZXInKVxuICAgICAgIyB3ZSB3YW50IHRvIGRvIG91ciBvd24gZmlsdGVyaW5nLCBoaWRlIGFueSBleGlzdGluZyBzdWZmaXggZnJvbSBKZWRpXG4gICAgICBsaW5lID0gbGluZXNbYnVmZmVyUG9zaXRpb24ucm93XVxuICAgICAgbGFzdElkZW50aWZpZXIgPSAvXFwuP1thLXpBLVpfXVthLXpBLVowLTlfXSokLy5leGVjKFxuICAgICAgICBsaW5lLnNsaWNlIDAsIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbilcbiAgICAgIGlmIGxhc3RJZGVudGlmaWVyXG4gICAgICAgIGJ1ZmZlclBvc2l0aW9uLmNvbHVtbiA9IGxhc3RJZGVudGlmaWVyLmluZGV4ICsgMVxuICAgICAgICBsaW5lc1tidWZmZXJQb3NpdGlvbi5yb3ddID0gbGluZS5zbGljZSgwLCBidWZmZXJQb3NpdGlvbi5jb2x1bW4pXG4gICAgcmVxdWVzdElkID0gQF9nZW5lcmF0ZVJlcXVlc3RJZChcbiAgICAgICdjb21wbGV0aW9ucycsIGVkaXRvciwgYnVmZmVyUG9zaXRpb24sIGxpbmVzLmpvaW4oJ1xcbicpKVxuICAgIGlmIHJlcXVlc3RJZCBvZiBAcmVzcG9uc2VzXG4gICAgICBsb2cuZGVidWcgJ1VzaW5nIGNhY2hlZCByZXNwb25zZSB3aXRoIElEJywgcmVxdWVzdElkXG4gICAgICAjIFdlIGhhdmUgdG8gcGFyc2UgSlNPTiBvbiBlYWNoIHJlcXVlc3QgaGVyZSB0byBwYXNzIG9ubHkgYSBjb3B5XG4gICAgICBtYXRjaGVzID0gSlNPTi5wYXJzZShAcmVzcG9uc2VzW3JlcXVlc3RJZF1bJ3NvdXJjZSddKVsncmVzdWx0cyddXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24uZnV6enlNYXRjaGVyJylcbiAgICAgICAgcmV0dXJuIEBfZnV6enlGaWx0ZXIobWF0Y2hlcywgcHJlZml4KVxuICAgICAgZWxzZVxuICAgICAgICByZXR1cm4gbWF0Y2hlc1xuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IHJlcXVlc3RJZFxuICAgICAgcHJlZml4OiBwcmVmaXhcbiAgICAgIGxvb2t1cDogJ2NvbXBsZXRpb25zJ1xuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgc291cmNlOiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgICBjb25maWc6IEBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnKClcblxuICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLmZ1enp5TWF0Y2hlcicpXG4gICAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IChtYXRjaGVzKSA9PlxuICAgICAgICAgIHJlc29sdmUoQF9mdXp6eUZpbHRlcihtYXRjaGVzLCBwcmVmaXgpKVxuICAgICAgZWxzZVxuICAgICAgICBAcmVxdWVzdHNbcGF5bG9hZC5pZF0gPSByZXNvbHZlXG5cbiAgZ2V0RGVmaW5pdGlvbnM6IChlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKSAtPlxuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ2RlZmluaXRpb25zJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIGxvb2t1cDogJ2RlZmluaXRpb25zJ1xuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgc291cmNlOiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbHVtbjogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgICBjb25maWc6IEBfZ2VuZXJhdGVSZXF1ZXN0Q29uZmlnKClcblxuICAgIEBfc2VuZFJlcXVlc3QoQF9zZXJpYWxpemUocGF5bG9hZCkpXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlIChyZXNvbHZlKSA9PlxuICAgICAgQHJlcXVlc3RzW3BheWxvYWQuaWRdID0gcmVzb2x2ZVxuXG4gIGdldFVzYWdlczogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgcGF5bG9hZCA9XG4gICAgICBpZDogQF9nZW5lcmF0ZVJlcXVlc3RJZCgndXNhZ2VzJywgZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIGxvb2t1cDogJ3VzYWdlcydcbiAgICAgIHBhdGg6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHNvdXJjZTogZWRpdG9yLmdldFRleHQoKVxuICAgICAgbGluZTogYnVmZmVyUG9zaXRpb24ucm93XG4gICAgICBjb2x1bW46IGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuICAgICAgY29uZmlnOiBAX2dlbmVyYXRlUmVxdWVzdENvbmZpZygpXG5cbiAgICBAX3NlbmRSZXF1ZXN0KEBfc2VyaWFsaXplKHBheWxvYWQpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IHJlc29sdmVcblxuICBnZXRNZXRob2RzOiAoZWRpdG9yLCBidWZmZXJQb3NpdGlvbikgLT5cbiAgICBpbmRlbnQgPSBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICBsaW5lcyA9IGVkaXRvci5nZXRCdWZmZXIoKS5nZXRMaW5lcygpXG4gICAgbGluZXMuc3BsaWNlKGJ1ZmZlclBvc2l0aW9uLnJvdyArIDEsIDAsIFwiICBkZWYgX19hdXRvY29tcGxldGVfcHl0aG9uKHMpOlwiKVxuICAgIGxpbmVzLnNwbGljZShidWZmZXJQb3NpdGlvbi5yb3cgKyAyLCAwLCBcIiAgICBzLlwiKVxuICAgIHBheWxvYWQgPVxuICAgICAgaWQ6IEBfZ2VuZXJhdGVSZXF1ZXN0SWQoJ21ldGhvZHMnLCBlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgbG9va3VwOiAnbWV0aG9kcydcbiAgICAgIHBhdGg6IGVkaXRvci5nZXRQYXRoKClcbiAgICAgIHNvdXJjZTogbGluZXMuam9pbignXFxuJylcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvdyArIDJcbiAgICAgIGNvbHVtbjogNlxuICAgICAgY29uZmlnOiBAX2dlbmVyYXRlUmVxdWVzdENvbmZpZygpXG5cbiAgICBAX3NlbmRSZXF1ZXN0KEBfc2VyaWFsaXplKHBheWxvYWQpKVxuICAgIHJldHVybiBuZXcgUHJvbWlzZSAocmVzb2x2ZSkgPT5cbiAgICAgIEByZXF1ZXN0c1twYXlsb2FkLmlkXSA9IChtZXRob2RzKSAtPlxuICAgICAgICByZXNvbHZlKHttZXRob2RzLCBpbmRlbnQsIGJ1ZmZlclBvc2l0aW9ufSlcblxuICBnb1RvRGVmaW5pdGlvbjogKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pIC0+XG4gICAgaWYgbm90IGVkaXRvclxuICAgICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgaWYgbm90IGJ1ZmZlclBvc2l0aW9uXG4gICAgICBidWZmZXJQb3NpdGlvbiA9IGVkaXRvci5nZXRDdXJzb3JCdWZmZXJQb3NpdGlvbigpXG4gICAgaWYgQGRlZmluaXRpb25zVmlld1xuICAgICAgQGRlZmluaXRpb25zVmlldy5kZXN0cm95KClcbiAgICBAZGVmaW5pdGlvbnNWaWV3ID0gbmV3IEBEZWZpbml0aW9uc1ZpZXcoKVxuICAgIEBnZXREZWZpbml0aW9ucyhlZGl0b3IsIGJ1ZmZlclBvc2l0aW9uKS50aGVuIChyZXN1bHRzKSA9PlxuICAgICAgQGRlZmluaXRpb25zVmlldy5zZXRJdGVtcyhyZXN1bHRzKVxuICAgICAgaWYgcmVzdWx0cy5sZW5ndGggPT0gMVxuICAgICAgICBAZGVmaW5pdGlvbnNWaWV3LmNvbmZpcm1lZChyZXN1bHRzWzBdKVxuXG4gIGRpc3Bvc2U6IC0+XG4gICAgaWYgQGRpc3Bvc2FibGVzXG4gICAgICBAZGlzcG9zYWJsZXMuZGlzcG9zZSgpXG4gICAgaWYgQHByb3ZpZGVyXG4gICAgICBAcHJvdmlkZXIua2lsbCgpXG4iXX0=
