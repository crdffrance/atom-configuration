(function() {
  var CompositeDisposable, Point, PythonTools, Range, path, ref, regexPatternIn,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  ref = require('atom'), Range = ref.Range, Point = ref.Point, CompositeDisposable = ref.CompositeDisposable;

  path = require('path');

  regexPatternIn = function(pattern, list) {
    var item, j, len;
    for (j = 0, len = list.length; j < len; j++) {
      item = list[j];
      if (pattern.test(item)) {
        return true;
      }
    }
    return false;
  };

  PythonTools = {
    config: {
      smartBlockSelection: {
        type: 'boolean',
        description: 'Do not select whitespace outside logical string blocks',
        "default": true
      },
      pythonPath: {
        type: 'string',
        "default": '',
        title: 'Path to python directory',
        description: ',\nOptional. Set it if default values are not working for you or you want to use specific\npython version. For example: `/usr/local/Cellar/python/2.7.3/bin` or `E:\\Python2.7`'
      }
    },
    subscriptions: null,
    _issueReportLink: "https://github.com/michaelaquilina/python-tools/issues/new",
    activate: function(state) {
      var env, j, len, p, path_env, paths, pythonPath;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar="source python"]', {
        'python-tools:show-usages': (function(_this) {
          return function() {
            return _this.jediToolsRequest('usages');
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar="source python"]', {
        'python-tools:goto-definition': (function(_this) {
          return function() {
            return _this.jediToolsRequest('gotoDef');
          };
        })(this)
      }));
      this.subscriptions.add(atom.commands.add('atom-text-editor[data-grammar="source python"]', {
        'python-tools:select-all-string': (function(_this) {
          return function() {
            return _this.selectAllString();
          };
        })(this)
      }));
      env = process.env;
      pythonPath = atom.config.get('python-tools.pythonPath');
      path_env = null;
      if (/^win/.test(process.platform)) {
        paths = ['C:\\Python2.7', 'C:\\Python3.4', 'C:\\Python34', 'C:\\Python3.5', 'C:\\Python35', 'C:\\Program Files (x86)\\Python 2.7', 'C:\\Program Files (x86)\\Python 3.4', 'C:\\Program Files (x86)\\Python 3.5', 'C:\\Program Files (x64)\\Python 2.7', 'C:\\Program Files (x64)\\Python 3.4', 'C:\\Program Files (x64)\\Python 3.5', 'C:\\Program Files\\Python 2.7', 'C:\\Program Files\\Python 3.4', 'C:\\Program Files\\Python 3.5'];
        path_env = env.Path || '';
      } else {
        paths = ['/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin'];
        path_env = env.PATH || '';
      }
      path_env = path_env.split(path.delimiter);
      path_env.unshift(pythonPath && indexOf.call(path_env, pythonPath) < 0 ? pythonPath : void 0);
      for (j = 0, len = paths.length; j < len; j++) {
        p = paths[j];
        if (indexOf.call(path_env, p) < 0) {
          path_env.push(p);
        }
      }
      env.PATH = path_env.join(path.delimiter);
      this.provider = require('child_process').spawn('python', [__dirname + '/tools.py'], {
        env: env
      });
      this.readline = require('readline').createInterface({
        input: this.provider.stdout,
        output: this.provider.stdin
      });
      this.provider.on('error', (function(_this) {
        return function(err) {
          if (err.code === 'ENOENT') {
            return atom.notifications.addWarning("python-tools was unable to find your machine's python executable.\n\nPlease try set the path in package settings and then restart atom.\n\nIf the issue persists please post an issue on\n" + _this._issueReportLink, {
              detail: err,
              dismissable: true
            });
          } else {
            return atom.notifications.addError("python-tools unexpected error.\n\nPlease consider posting an issue on\n" + _this._issueReportLink, {
              detail: err,
              dismissable: true
            });
          }
        };
      })(this));
      return this.provider.on('exit', (function(_this) {
        return function(code, signal) {
          if (signal !== 'SIGTERM') {
            return atom.notifications.addError("python-tools experienced an unexpected exit.\n\nPlease consider posting an issue on\n" + _this._issueReportLink, {
              detail: "exit with code " + code + ", signal " + signal,
              dismissable: true
            });
          }
        };
      })(this));
    },
    deactivate: function() {
      this.subscriptions.dispose();
      this.provider.kill();
      return this.readline.close();
    },
    selectAllString: function() {
      var block, bufferPosition, delim_index, delimiter, editor, end, end_index, i, j, line, ref1, ref2, scopeDescriptor, scopes, selections, start, start_index, trimmed;
      editor = atom.workspace.getActiveTextEditor();
      bufferPosition = editor.getCursorBufferPosition();
      line = editor.lineTextForBufferRow(bufferPosition.row);
      scopeDescriptor = editor.scopeDescriptorForBufferPosition(bufferPosition);
      scopes = scopeDescriptor.getScopesArray();
      block = false;
      if (regexPatternIn(/string.quoted.single.single-line.*/, scopes)) {
        delimiter = '\'';
      } else if (regexPatternIn(/string.quoted.double.single-line.*/, scopes)) {
        delimiter = '"';
      } else if (regexPatternIn(/string.quoted.double.block.*/, scopes)) {
        delimiter = '"""';
        block = true;
      } else if (regexPatternIn(/string.quoted.single.block.*/, scopes)) {
        delimiter = '\'\'\'';
        block = true;
      } else {
        return;
      }
      if (!block) {
        start = end = bufferPosition.column;
        while (line[start] !== delimiter) {
          start = start - 1;
          if (start < 0) {
            return;
          }
        }
        while (line[end] !== delimiter) {
          end = end + 1;
          if (end === line.length) {
            return;
          }
        }
        return editor.setSelectedBufferRange(new Range(new Point(bufferPosition.row, start + 1), new Point(bufferPosition.row, end)));
      } else {
        start = end = bufferPosition.row;
        start_index = end_index = -1;
        delim_index = line.indexOf(delimiter);
        if (delim_index !== -1) {
          scopes = editor.scopeDescriptorForBufferPosition(new Point(start, delim_index));
          scopes = scopes.getScopesArray();
          if (regexPatternIn(/punctuation.definition.string.begin.*/, scopes)) {
            start_index = line.indexOf(delimiter);
            while (end_index === -1) {
              end = end + 1;
              line = editor.lineTextForBufferRow(end);
              end_index = line.indexOf(delimiter);
            }
          } else if (regexPatternIn(/punctuation.definition.string.end.*/, scopes)) {
            end_index = line.indexOf(delimiter);
            while (start_index === -1) {
              start = start - 1;
              line = editor.lineTextForBufferRow(start);
              start_index = line.indexOf(delimiter);
            }
          }
        } else {
          while (end_index === -1) {
            end = end + 1;
            line = editor.lineTextForBufferRow(end);
            end_index = line.indexOf(delimiter);
          }
          while (start_index === -1) {
            start = start - 1;
            line = editor.lineTextForBufferRow(start);
            start_index = line.indexOf(delimiter);
          }
        }
        if (atom.config.get('python-tools.smartBlockSelection')) {
          selections = [new Range(new Point(start, start_index + delimiter.length), new Point(start, editor.lineTextForBufferRow(start).length))];
          for (i = j = ref1 = start + 1, ref2 = end; j < ref2; i = j += 1) {
            line = editor.lineTextForBufferRow(i);
            trimmed = line.replace(/^\s+/, "");
            selections.push(new Range(new Point(i, line.length - trimmed.length), new Point(i, line.length)));
          }
          line = editor.lineTextForBufferRow(end);
          trimmed = line.replace(/^\s+/, "");
          selections.push(new Range(new Point(end, line.length - trimmed.length), new Point(end, end_index)));
          return editor.setSelectedBufferRanges(selections.filter(function(range) {
            return !range.isEmpty();
          }));
        } else {
          return editor.setSelectedBufferRange(new Range(new Point(start, start_index + delimiter.length), new Point(end, end_index)));
        }
      }
    },
    handleJediToolsResponse: function(response) {
      var column, editor, first_def, item, j, len, line, options, ref1, selections;
      if ('error' in response) {
        console.error(response['error']);
        atom.notifications.addError(response['error']);
        return;
      }
      if (response['definitions'].length > 0) {
        editor = atom.workspace.getActiveTextEditor();
        if (response['type'] === 'usages') {
          path = editor.getPath();
          selections = [];
          ref1 = response['definitions'];
          for (j = 0, len = ref1.length; j < len; j++) {
            item = ref1[j];
            if (item['path'] === path) {
              selections.push(new Range(new Point(item['line'] - 1, item['col']), new Point(item['line'] - 1, item['col'] + item['name'].length)));
            }
          }
          return editor.setSelectedBufferRanges(selections);
        } else if (response['type'] === 'gotoDef') {
          first_def = response['definitions'][0];
          line = first_def['line'];
          column = first_def['col'];
          if (line !== null && column !== null) {
            options = {
              initialLine: line,
              initialColumn: column,
              searchAllPanes: true
            };
            return atom.workspace.open(first_def['path'], options).then(function(editor) {
              return editor.scrollToCursorPosition();
            });
          }
        } else {
          return atom.notifications.addError("python-tools error. " + this._issueReportLink, {
            detail: JSON.stringify(response),
            dismissable: true
          });
        }
      } else {
        return atom.notifications.addInfo("python-tools could not find any results!");
      }
    },
    jediToolsRequest: function(type) {
      var bufferPosition, editor, grammar, handleJediToolsResponse, payload, readline;
      editor = atom.workspace.getActiveTextEditor();
      grammar = editor.getGrammar();
      bufferPosition = editor.getCursorBufferPosition();
      payload = {
        type: type,
        path: editor.getPath(),
        source: editor.getText(),
        line: bufferPosition.row,
        col: bufferPosition.column,
        project_paths: atom.project.getPaths()
      };
      handleJediToolsResponse = this.handleJediToolsResponse;
      readline = this.readline;
      return new Promise(function(resolve, reject) {
        var response;
        return response = readline.question((JSON.stringify(payload)) + "\n", function(response) {
          handleJediToolsResponse(JSON.parse(response));
          return resolve();
        });
      });
    }
  };

  module.exports = PythonTools;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9weXRob24tdG9vbHMvbGliL3B5dGhvbi10b29scy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlFQUFBO0lBQUE7O0VBQUEsTUFBc0MsT0FBQSxDQUFRLE1BQVIsQ0FBdEMsRUFBQyxpQkFBRCxFQUFRLGlCQUFSLEVBQWU7O0VBQ2YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUdQLGNBQUEsR0FBaUIsU0FBQyxPQUFELEVBQVUsSUFBVjtBQUNmLFFBQUE7QUFBQSxTQUFBLHNDQUFBOztNQUNFLElBQUcsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQUg7QUFDRSxlQUFPLEtBRFQ7O0FBREY7QUFHQSxXQUFPO0VBSlE7O0VBT2pCLFdBQUEsR0FBYztJQUNaLE1BQUEsRUFBUTtNQUNOLG1CQUFBLEVBQXFCO1FBQ25CLElBQUEsRUFBTSxTQURhO1FBRW5CLFdBQUEsRUFBYSx3REFGTTtRQUduQixDQUFBLE9BQUEsQ0FBQSxFQUFTLElBSFU7T0FEZjtNQU1OLFVBQUEsRUFBWTtRQUNWLElBQUEsRUFBTSxRQURJO1FBRVYsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUZDO1FBR1YsS0FBQSxFQUFPLDBCQUhHO1FBSVYsV0FBQSxFQUFhLGlMQUpIO09BTk47S0FESTtJQWtCWixhQUFBLEVBQWUsSUFsQkg7SUFvQlosZ0JBQUEsRUFBa0IsNERBcEJOO0lBc0JaLFFBQUEsRUFBVSxTQUFDLEtBQUQ7QUFFUixVQUFBO01BQUEsSUFBSSxDQUFDLGFBQUwsR0FBcUIsSUFBSTtNQUN6QixJQUFJLENBQUMsYUFBYSxDQUFDLEdBQW5CLENBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQ0UsZ0RBREYsRUFFRTtRQUFDLDBCQUFBLEVBQTRCLENBQUEsU0FBQSxLQUFBO2lCQUFBLFNBQUE7bUJBQU0sS0FBSSxDQUFDLGdCQUFM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QUFDLEdBSmI7UUFLUixHQUFBLEVBQUssY0FBYyxDQUFDLE1BTFo7UUFNUixhQUFBLEVBQWUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLENBQUEsQ0FOUDs7TUFVVix1QkFBQSxHQUEwQixJQUFJLENBQUM7TUFDL0IsUUFBQSxHQUFXLElBQUksQ0FBQztBQUVoQixhQUFXLElBQUEsT0FBQSxDQUFRLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDakIsWUFBQTtlQUFBLFFBQUEsR0FBVyxRQUFRLENBQUMsUUFBVCxDQUFvQixDQUFDLElBQUksQ0FBQyxTQUFMLENBQWUsT0FBZixDQUFELENBQUEsR0FBeUIsSUFBN0MsRUFBa0QsU0FBQyxRQUFEO1VBQzNELHVCQUFBLENBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsUUFBWCxDQUF4QjtpQkFDQSxPQUFBLENBQUE7UUFGMkQsQ0FBbEQ7TUFETSxDQUFSO0lBbkJLLENBOVJOOzs7RUF5VGQsTUFBTSxDQUFDLE9BQVAsR0FBaUI7QUFwVWpCIiwic291cmNlc0NvbnRlbnQiOlsie1JhbmdlLCBQb2ludCwgQ29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlKCdhdG9tJyk7XG5wYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5cbnJlZ2V4UGF0dGVybkluID0gKHBhdHRlcm4sIGxpc3QpIC0+XG4gIGZvciBpdGVtIGluIGxpc3RcbiAgICBpZiBwYXR0ZXJuLnRlc3QoaXRlbSlcbiAgICAgIHJldHVybiB0cnVlXG4gIHJldHVybiBmYWxzZVxuXG5cblB5dGhvblRvb2xzID0ge1xuICBjb25maWc6IHtcbiAgICBzbWFydEJsb2NrU2VsZWN0aW9uOiB7XG4gICAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgICBkZXNjcmlwdGlvbjogJ0RvIG5vdCBzZWxlY3Qgd2hpdGVzcGFjZSBvdXRzaWRlIGxvZ2ljYWwgc3RyaW5nIGJsb2NrcycsXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgfSxcbiAgICBweXRob25QYXRoOiB7XG4gICAgICB0eXBlOiAnc3RyaW5nJyxcbiAgICAgIGRlZmF1bHQ6ICcnLFxuICAgICAgdGl0bGU6ICdQYXRoIHRvIHB5dGhvbiBkaXJlY3RvcnknLFxuICAgICAgZGVzY3JpcHRpb246ICcnJyxcbiAgICAgIE9wdGlvbmFsLiBTZXQgaXQgaWYgZGVmYXVsdCB2YWx1ZXMgYXJlIG5vdCB3b3JraW5nIGZvciB5b3Ugb3IgeW91IHdhbnQgdG8gdXNlIHNwZWNpZmljXG4gICAgICBweXRob24gdmVyc2lvbi4gRm9yIGV4YW1wbGU6IGAvdXNyL2xvY2FsL0NlbGxhci9weXRob24vMi43LjMvYmluYCBvciBgRTpcXFxcUHl0aG9uMi43YFxuICAgICAgJycnXG4gICAgfVxuICB9XG5cbiAgc3Vic2NyaXB0aW9uczogbnVsbFxuXG4gIF9pc3N1ZVJlcG9ydExpbms6IFwiaHR0cHM6Ly9naXRodWIuY29tL21pY2hhZWxhcXVpbGluYS9weXRob24tdG9vbHMvaXNzdWVzL25ld1wiXG5cbiAgYWN0aXZhdGU6IChzdGF0ZSkgLT5cbiAgICAjIEV2ZW50cyBzdWJzY3JpYmVkIHRvIGluIGF0b20ncyBzeXN0ZW0gY2FuIGJlIGVhc2lseSBjbGVhbmVkIHVwIHdpdGggYSBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoXG4gICAgICAgICdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcj1cInNvdXJjZSBweXRob25cIl0nLFxuICAgICAgICB7J3B5dGhvbi10b29sczpzaG93LXVzYWdlcyc6ICgpID0+IHRoaXMuamVkaVRvb2xzUmVxdWVzdCgndXNhZ2VzJyl9XG4gICAgICApXG4gICAgKVxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5hZGQoXG4gICAgICBhdG9tLmNvbW1hbmRzLmFkZChcbiAgICAgICAgJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyPVwic291cmNlIHB5dGhvblwiXScsXG4gICAgICAgIHsncHl0aG9uLXRvb2xzOmdvdG8tZGVmaW5pdGlvbic6ICgpID0+IHRoaXMuamVkaVRvb2xzUmVxdWVzdCgnZ290b0RlZicpfVxuICAgICAgKVxuICAgIClcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQoXG4gICAgICAgICdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcj1cInNvdXJjZSBweXRob25cIl0nLFxuICAgICAgICB7J3B5dGhvbi10b29sczpzZWxlY3QtYWxsLXN0cmluZyc6ICgpID0+IHRoaXMuc2VsZWN0QWxsU3RyaW5nKCl9XG4gICAgICApXG4gICAgKVxuXG4gICAgZW52ID0gcHJvY2Vzcy5lbnZcbiAgICBweXRob25QYXRoID0gYXRvbS5jb25maWcuZ2V0KCdweXRob24tdG9vbHMucHl0aG9uUGF0aCcpXG4gICAgcGF0aF9lbnYgPSBudWxsXG5cbiAgICBpZiAvXndpbi8udGVzdChwcm9jZXNzLnBsYXRmb3JtKVxuICAgICAgcGF0aHMgPSBbXG4gICAgICAgICdDOlxcXFxQeXRob24yLjcnLFxuICAgICAgICAnQzpcXFxcUHl0aG9uMy40JyxcbiAgICAgICAgJ0M6XFxcXFB5dGhvbjM0JyxcbiAgICAgICAgJ0M6XFxcXFB5dGhvbjMuNScsXG4gICAgICAgICdDOlxcXFxQeXRob24zNScsXG4gICAgICAgICdDOlxcXFxQcm9ncmFtIEZpbGVzICh4ODYpXFxcXFB5dGhvbiAyLjcnLFxuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxQeXRob24gMy40JyxcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg4NilcXFxcUHl0aG9uIDMuNScsXG4gICAgICAgICdDOlxcXFxQcm9ncmFtIEZpbGVzICh4NjQpXFxcXFB5dGhvbiAyLjcnLFxuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDY0KVxcXFxQeXRob24gMy40JyxcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg2NClcXFxcUHl0aG9uIDMuNScsXG4gICAgICAgICdDOlxcXFxQcm9ncmFtIEZpbGVzXFxcXFB5dGhvbiAyLjcnLFxuICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFxQeXRob24gMy40JyxcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXNcXFxcUHl0aG9uIDMuNSdcbiAgICAgIF1cbiAgICAgIHBhdGhfZW52ID0gKGVudi5QYXRoIG9yICcnKVxuICAgIGVsc2VcbiAgICAgIHBhdGhzID0gWycvdXNyL2xvY2FsL2JpbicsICcvdXNyL2JpbicsICcvYmluJywgJy91c3Ivc2JpbicsICcvc2JpbiddXG4gICAgICBwYXRoX2VudiA9IChlbnYuUEFUSCBvciAnJylcblxuICAgIHBhdGhfZW52ID0gcGF0aF9lbnYuc3BsaXQocGF0aC5kZWxpbWl0ZXIpXG4gICAgcGF0aF9lbnYudW5zaGlmdChweXRob25QYXRoIGlmIHB5dGhvblBhdGggYW5kIHB5dGhvblBhdGggbm90IGluIHBhdGhfZW52KVxuICAgIGZvciBwIGluIHBhdGhzXG4gICAgICBpZiBwIG5vdCBpbiBwYXRoX2VudlxuICAgICAgICBwYXRoX2Vudi5wdXNoKHApXG4gICAgZW52LlBBVEggPSBwYXRoX2Vudi5qb2luKHBhdGguZGVsaW1pdGVyKVxuXG4gICAgdGhpcy5wcm92aWRlciA9IHJlcXVpcmUoJ2NoaWxkX3Byb2Nlc3MnKS5zcGF3bihcbiAgICAgICdweXRob24nLCBbX19kaXJuYW1lICsgJy90b29scy5weSddLCBlbnY6IGVudlxuICAgIClcblxuICAgIHRoaXMucmVhZGxpbmUgPSByZXF1aXJlKCdyZWFkbGluZScpLmNyZWF0ZUludGVyZmFjZSh7XG4gICAgICBpbnB1dDogdGhpcy5wcm92aWRlci5zdGRvdXQsXG4gICAgICBvdXRwdXQ6IHRoaXMucHJvdmlkZXIuc3RkaW5cbiAgICB9KVxuXG4gICAgdGhpcy5wcm92aWRlci5vbignZXJyb3InLCAoZXJyKSA9PlxuICAgICAgaWYgZXJyLmNvZGUgPT0gJ0VOT0VOVCdcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJcIlwiXG4gICAgICAgICAgcHl0aG9uLXRvb2xzIHdhcyB1bmFibGUgdG8gZmluZCB5b3VyIG1hY2hpbmUncyBweXRob24gZXhlY3V0YWJsZS5cblxuICAgICAgICAgIFBsZWFzZSB0cnkgc2V0IHRoZSBwYXRoIGluIHBhY2thZ2Ugc2V0dGluZ3MgYW5kIHRoZW4gcmVzdGFydCBhdG9tLlxuXG4gICAgICAgICAgSWYgdGhlIGlzc3VlIHBlcnNpc3RzIHBsZWFzZSBwb3N0IGFuIGlzc3VlIG9uXG4gICAgICAgICAgI3t0aGlzLl9pc3N1ZVJlcG9ydExpbmt9XG4gICAgICAgICAgXCJcIlwiLCB7XG4gICAgICAgICAgICBkZXRhaWw6IGVycixcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgICBlbHNlXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcIlwiXCJcbiAgICAgICAgICBweXRob24tdG9vbHMgdW5leHBlY3RlZCBlcnJvci5cblxuICAgICAgICAgIFBsZWFzZSBjb25zaWRlciBwb3N0aW5nIGFuIGlzc3VlIG9uXG4gICAgICAgICAgI3t0aGlzLl9pc3N1ZVJlcG9ydExpbmt9XG4gICAgICAgICAgXCJcIlwiLCB7XG4gICAgICAgICAgICAgIGRldGFpbDogZXJyLFxuICAgICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZVxuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgKVxuICAgIHRoaXMucHJvdmlkZXIub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxuICAgICAgaWYgc2lnbmFsICE9ICdTSUdURVJNJ1xuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgICAgXCJcIlwiXG4gICAgICAgICAgcHl0aG9uLXRvb2xzIGV4cGVyaWVuY2VkIGFuIHVuZXhwZWN0ZWQgZXhpdC5cblxuICAgICAgICAgIFBsZWFzZSBjb25zaWRlciBwb3N0aW5nIGFuIGlzc3VlIG9uXG4gICAgICAgICAgI3t0aGlzLl9pc3N1ZVJlcG9ydExpbmt9XG4gICAgICAgICAgXCJcIlwiLCB7XG4gICAgICAgICAgICBkZXRhaWw6IFwiZXhpdCB3aXRoIGNvZGUgI3tjb2RlfSwgc2lnbmFsICN7c2lnbmFsfVwiLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICApXG5cbiAgZGVhY3RpdmF0ZTogKCkgLT5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXG4gICAgdGhpcy5wcm92aWRlci5raWxsKClcbiAgICB0aGlzLnJlYWRsaW5lLmNsb3NlKClcblxuICBzZWxlY3RBbGxTdHJpbmc6ICgpIC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIGxpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coYnVmZmVyUG9zaXRpb24ucm93KVxuXG4gICAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKGJ1ZmZlclBvc2l0aW9uKVxuICAgIHNjb3BlcyA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG5cbiAgICBibG9jayA9IGZhbHNlXG4gICAgaWYgcmVnZXhQYXR0ZXJuSW4oL3N0cmluZy5xdW90ZWQuc2luZ2xlLnNpbmdsZS1saW5lLiovLCBzY29wZXMpXG4gICAgICBkZWxpbWl0ZXIgPSAnXFwnJ1xuICAgIGVsc2UgaWYgcmVnZXhQYXR0ZXJuSW4oL3N0cmluZy5xdW90ZWQuZG91YmxlLnNpbmdsZS1saW5lLiovLCBzY29wZXMpXG4gICAgICBkZWxpbWl0ZXIgPSAnXCInXG4gICAgZWxzZSBpZiByZWdleFBhdHRlcm5Jbigvc3RyaW5nLnF1b3RlZC5kb3VibGUuYmxvY2suKi8sIHNjb3BlcylcbiAgICAgIGRlbGltaXRlciA9ICdcIlwiXCInXG4gICAgICBibG9jayA9IHRydWVcbiAgICBlbHNlIGlmIHJlZ2V4UGF0dGVybkluKC9zdHJpbmcucXVvdGVkLnNpbmdsZS5ibG9jay4qLywgc2NvcGVzKVxuICAgICAgZGVsaW1pdGVyID0gJ1xcJ1xcJ1xcJydcbiAgICAgIGJsb2NrID0gdHJ1ZVxuICAgIGVsc2VcbiAgICAgIHJldHVyblxuXG4gICAgaWYgbm90IGJsb2NrXG4gICAgICBzdGFydCA9IGVuZCA9IGJ1ZmZlclBvc2l0aW9uLmNvbHVtblxuXG4gICAgICB3aGlsZSBsaW5lW3N0YXJ0XSAhPSBkZWxpbWl0ZXJcbiAgICAgICAgc3RhcnQgPSBzdGFydCAtIDFcbiAgICAgICAgaWYgc3RhcnQgPCAwXG4gICAgICAgICAgcmV0dXJuXG5cbiAgICAgIHdoaWxlIGxpbmVbZW5kXSAhPSBkZWxpbWl0ZXJcbiAgICAgICAgZW5kID0gZW5kICsgMVxuICAgICAgICBpZiBlbmQgPT0gbGluZS5sZW5ndGhcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgZWRpdG9yLnNldFNlbGVjdGVkQnVmZmVyUmFuZ2UobmV3IFJhbmdlKFxuICAgICAgICBuZXcgUG9pbnQoYnVmZmVyUG9zaXRpb24ucm93LCBzdGFydCArIDEpLFxuICAgICAgICBuZXcgUG9pbnQoYnVmZmVyUG9zaXRpb24ucm93LCBlbmQpLFxuICAgICAgKSlcbiAgICBlbHNlXG4gICAgICBzdGFydCA9IGVuZCA9IGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgc3RhcnRfaW5kZXggPSBlbmRfaW5kZXggPSAtMVxuXG4gICAgICAjIERldGVjdCBpZiB3ZSBhcmUgYXQgdGhlIGJvdW5kYXJpZXMgb2YgdGhlIGJsb2NrIHN0cmluZ1xuICAgICAgZGVsaW1faW5kZXggPSBsaW5lLmluZGV4T2YoZGVsaW1pdGVyKVxuXG4gICAgICBpZiBkZWxpbV9pbmRleCAhPSAtMVxuICAgICAgICBzY29wZXMgPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24obmV3IFBvaW50KHN0YXJ0LCBkZWxpbV9pbmRleCkpXG4gICAgICAgIHNjb3BlcyA9IHNjb3Blcy5nZXRTY29wZXNBcnJheSgpXG5cbiAgICAgICAgIyBXZSBhcmUgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYmxvY2tcbiAgICAgICAgaWYgcmVnZXhQYXR0ZXJuSW4oL3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLiovLCBzY29wZXMpXG4gICAgICAgICAgc3RhcnRfaW5kZXggPSBsaW5lLmluZGV4T2YoZGVsaW1pdGVyKVxuICAgICAgICAgIHdoaWxlIGVuZF9pbmRleCA9PSAtMVxuICAgICAgICAgICAgZW5kID0gZW5kICsgMVxuICAgICAgICAgICAgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhlbmQpXG4gICAgICAgICAgICBlbmRfaW5kZXggPSBsaW5lLmluZGV4T2YoZGVsaW1pdGVyKVxuXG4gICAgICAgICMgV2UgYXJlIHRoZSBlbmQgb2YgdGhlIGJsb2NrXG4gICAgICAgIGVsc2UgaWYgcmVnZXhQYXR0ZXJuSW4oL3B1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC4qLywgc2NvcGVzKVxuICAgICAgICAgIGVuZF9pbmRleCA9IGxpbmUuaW5kZXhPZihkZWxpbWl0ZXIpXG4gICAgICAgICAgd2hpbGUgc3RhcnRfaW5kZXggPT0gLTFcbiAgICAgICAgICAgIHN0YXJ0ID0gc3RhcnQgLSAxXG4gICAgICAgICAgICBsaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHN0YXJ0KVxuICAgICAgICAgICAgc3RhcnRfaW5kZXggPSBsaW5lLmluZGV4T2YoZGVsaW1pdGVyKVxuXG4gICAgICBlbHNlXG4gICAgICAgICMgV2UgYXJlIG5laXRoZXIgYXQgdGhlIGJlZ2lubmluZyBvciB0aGUgZW5kIG9mIHRoZSBibG9ja1xuICAgICAgICB3aGlsZSBlbmRfaW5kZXggPT0gLTFcbiAgICAgICAgICBlbmQgPSBlbmQgKyAxXG4gICAgICAgICAgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhlbmQpXG4gICAgICAgICAgZW5kX2luZGV4ID0gbGluZS5pbmRleE9mKGRlbGltaXRlcilcbiAgICAgICAgd2hpbGUgc3RhcnRfaW5kZXggPT0gLTFcbiAgICAgICAgICBzdGFydCA9IHN0YXJ0IC0gMVxuICAgICAgICAgIGxpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coc3RhcnQpXG4gICAgICAgICAgc3RhcnRfaW5kZXggPSBsaW5lLmluZGV4T2YoZGVsaW1pdGVyKVxuXG4gICAgICBpZiBhdG9tLmNvbmZpZy5nZXQoJ3B5dGhvbi10b29scy5zbWFydEJsb2NrU2VsZWN0aW9uJylcbiAgICAgICAgIyBTbWFydCBibG9jayBzZWxlY3Rpb25zXG4gICAgICAgIHNlbGVjdGlvbnMgPSBbbmV3IFJhbmdlKFxuICAgICAgICAgIG5ldyBQb2ludChzdGFydCwgc3RhcnRfaW5kZXggKyBkZWxpbWl0ZXIubGVuZ3RoKSxcbiAgICAgICAgICBuZXcgUG9pbnQoc3RhcnQsIGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhzdGFydCkubGVuZ3RoKSxcbiAgICAgICAgKV1cblxuICAgICAgICBmb3IgaSBpbiBbc3RhcnQgKyAxIC4uLiBlbmRdIGJ5IDFcbiAgICAgICAgICBsaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGkpXG4gICAgICAgICAgdHJpbW1lZCA9IGxpbmUucmVwbGFjZSgvXlxccysvLCBcIlwiKSAgIyBsZWZ0IHRyaW1cbiAgICAgICAgICBzZWxlY3Rpb25zLnB1c2gobmV3IFJhbmdlKFxuICAgICAgICAgICAgbmV3IFBvaW50KGksIGxpbmUubGVuZ3RoIC0gdHJpbW1lZC5sZW5ndGgpLFxuICAgICAgICAgICAgbmV3IFBvaW50KGksIGxpbmUubGVuZ3RoKSxcbiAgICAgICAgICApKVxuXG4gICAgICAgIGxpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coZW5kKVxuICAgICAgICB0cmltbWVkID0gbGluZS5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpICAjIGxlZnQgdHJpbVxuXG4gICAgICAgIHNlbGVjdGlvbnMucHVzaChuZXcgUmFuZ2UoXG4gICAgICAgICAgbmV3IFBvaW50KGVuZCwgbGluZS5sZW5ndGggLSB0cmltbWVkLmxlbmd0aCksXG4gICAgICAgICAgbmV3IFBvaW50KGVuZCwgZW5kX2luZGV4KSxcbiAgICAgICAgKSlcblxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoc2VsZWN0aW9ucy5maWx0ZXIgKHJhbmdlKSAtPiBub3QgcmFuZ2UuaXNFbXB0eSgpKVxuICAgICAgZWxzZVxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShuZXcgUmFuZ2UoXG4gICAgICAgICAgbmV3IFBvaW50KHN0YXJ0LCBzdGFydF9pbmRleCArIGRlbGltaXRlci5sZW5ndGgpLFxuICAgICAgICAgIG5ldyBQb2ludChlbmQsIGVuZF9pbmRleCksXG4gICAgICAgICkpXG5cbiAgaGFuZGxlSmVkaVRvb2xzUmVzcG9uc2U6IChyZXNwb25zZSkgLT5cbiAgICBpZiAnZXJyb3InIG9mIHJlc3BvbnNlXG4gICAgICBjb25zb2xlLmVycm9yKHJlc3BvbnNlWydlcnJvciddKVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKHJlc3BvbnNlWydlcnJvciddKVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiByZXNwb25zZVsnZGVmaW5pdGlvbnMnXS5sZW5ndGggPiAwXG4gICAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgICAgaWYgcmVzcG9uc2VbJ3R5cGUnXSA9PSAndXNhZ2VzJ1xuICAgICAgICBwYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuICAgICAgICBzZWxlY3Rpb25zID0gW11cbiAgICAgICAgZm9yIGl0ZW0gaW4gcmVzcG9uc2VbJ2RlZmluaXRpb25zJ11cbiAgICAgICAgICBpZiBpdGVtWydwYXRoJ10gPT0gcGF0aFxuICAgICAgICAgICAgc2VsZWN0aW9ucy5wdXNoKG5ldyBSYW5nZShcbiAgICAgICAgICAgICAgbmV3IFBvaW50KGl0ZW1bJ2xpbmUnXSAtIDEsIGl0ZW1bJ2NvbCddKSxcbiAgICAgICAgICAgICAgbmV3IFBvaW50KGl0ZW1bJ2xpbmUnXSAtIDEsIGl0ZW1bJ2NvbCddICsgaXRlbVsnbmFtZSddLmxlbmd0aCksICAjIFVzZSBzdHJpbmcgbGVuZ3RoXG4gICAgICAgICAgICApKVxuXG4gICAgICAgIGVkaXRvci5zZXRTZWxlY3RlZEJ1ZmZlclJhbmdlcyhzZWxlY3Rpb25zKVxuXG4gICAgICBlbHNlIGlmIHJlc3BvbnNlWyd0eXBlJ10gPT0gJ2dvdG9EZWYnXG4gICAgICAgIGZpcnN0X2RlZiA9IHJlc3BvbnNlWydkZWZpbml0aW9ucyddWzBdXG5cbiAgICAgICAgbGluZSA9IGZpcnN0X2RlZlsnbGluZSddXG4gICAgICAgIGNvbHVtbiA9IGZpcnN0X2RlZlsnY29sJ11cblxuICAgICAgICBpZiBsaW5lICE9IG51bGwgYW5kIGNvbHVtbiAhPSBudWxsXG4gICAgICAgICAgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGluaXRpYWxMaW5lOiBsaW5lLFxuICAgICAgICAgICAgaW5pdGlhbENvbHVtbjogY29sdW1uLFxuICAgICAgICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWVcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKGZpcnN0X2RlZlsncGF0aCddLCBvcHRpb25zKS50aGVuKChlZGl0b3IpIC0+XG4gICAgICAgICAgICBlZGl0b3Iuc2Nyb2xsVG9DdXJzb3JQb3NpdGlvbigpXG4gICAgICAgICAgKVxuICAgICAgZWxzZVxuICAgICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgICAgXCJweXRob24tdG9vbHMgZXJyb3IuICN7dGhpcy5faXNzdWVSZXBvcnRMaW5rfVwiLCB7XG4gICAgICAgICAgICBkZXRhaWw6IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSxcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgZWxzZVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oXCJweXRob24tdG9vbHMgY291bGQgbm90IGZpbmQgYW55IHJlc3VsdHMhXCIpXG5cbiAgamVkaVRvb2xzUmVxdWVzdDogKHR5cGUpIC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKClcblxuICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcblxuICAgIHBheWxvYWQgPSB7XG4gICAgICB0eXBlOiB0eXBlLFxuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKSxcbiAgICAgIHNvdXJjZTogZWRpdG9yLmdldFRleHQoKSxcbiAgICAgIGxpbmU6IGJ1ZmZlclBvc2l0aW9uLnJvdyxcbiAgICAgIGNvbDogYnVmZmVyUG9zaXRpb24uY29sdW1uLFxuICAgICAgcHJvamVjdF9wYXRoczogYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICB9XG5cbiAgICAjIFRoaXMgaXMgbmVlZGVkIGZvciB0aGUgcHJvbWlzZSB0byB3b3JrIGNvcnJlY3RseVxuICAgIGhhbmRsZUplZGlUb29sc1Jlc3BvbnNlID0gdGhpcy5oYW5kbGVKZWRpVG9vbHNSZXNwb25zZVxuICAgIHJlYWRsaW5lID0gdGhpcy5yZWFkbGluZVxuXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICByZXNwb25zZSA9IHJlYWRsaW5lLnF1ZXN0aW9uKFwiI3tKU09OLnN0cmluZ2lmeShwYXlsb2FkKX1cXG5cIiwgKHJlc3BvbnNlKSAtPlxuICAgICAgICBoYW5kbGVKZWRpVG9vbHNSZXNwb25zZShKU09OLnBhcnNlKHJlc3BvbnNlKSlcbiAgICAgICAgcmVzb2x2ZSgpXG4gICAgICApXG4gICAgKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFB5dGhvblRvb2xzXG4iXX0=
