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
        description: 'Optional. Set it if default values are not working for you or you want to use specific\npython version. For example: `/usr/local/Cellar/python/2.7.3/bin` or `E:\\Python2.7`'
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
        paths = ['C:\\Python2.7', 'C:\\Python27', 'C:\\Python3.4', 'C:\\Python34', 'C:\\Python3.5', 'C:\\Python35', 'C:\\Program Files (x86)\\Python 2.7', 'C:\\Program Files (x86)\\Python 3.4', 'C:\\Program Files (x86)\\Python 3.5', 'C:\\Program Files (x64)\\Python 2.7', 'C:\\Program Files (x64)\\Python 3.4', 'C:\\Program Files (x64)\\Python 3.5', 'C:\\Program Files\\Python 2.7', 'C:\\Program Files\\Python 3.4', 'C:\\Program Files\\Python 3.5'];
        path_env = env.Path || '';
      } else {
        paths = ['/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin'];
        path_env = env.PATH || '';
      }
      path_env = path_env.split(path.delimiter);
      if (pythonPath && indexOf.call(path_env, pythonPath) < 0) {
        path_env.unshift(pythonPath);
      }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9weXRob24tdG9vbHMvbGliL3B5dGhvbi10b29scy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLHlFQUFBO0lBQUE7O0VBQUEsTUFBc0MsT0FBQSxDQUFRLE1BQVIsQ0FBdEMsRUFBQyxpQkFBRCxFQUFRLGlCQUFSLEVBQWU7O0VBQ2YsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUdQLGNBQUEsR0FBaUIsU0FBQyxPQUFELEVBQVUsSUFBVjtBQUNmLFFBQUE7QUFBQSxTQUFBLHNDQUFBOztNQUNFLElBQUcsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFiLENBQUg7QUFDRSxlQUFPLEtBRFQ7O0FBREY7QUFHQSxXQUFPO0VBSlE7O0VBT2pCLFdBQUEsR0FDRTtJQUFBLE1BQUEsRUFDRTtNQUFBLG1CQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLFdBQUEsRUFBYSx3REFEYjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFGVDtPQURGO01BSUEsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFFBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEVBRFQ7UUFFQSxLQUFBLEVBQU8sMEJBRlA7UUFHQSxXQUFBLEVBQWEsOEtBSGI7T0FMRjtLQURGO0lBY0EsYUFBQSxFQUFlLElBZGY7SUFnQkEsZ0JBQUEsRUFBa0IsNERBaEJsQjtJQWtCQSxRQUFBLEVBQVUsU0FBQyxLQUFEO0FBRVIsVUFBQTtNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUk7TUFDckIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQ0UsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdEQUFsQixFQUNBO1FBQUEsMEJBQUEsRUFBNEIsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTttQkFBRyxLQUFDLENBQUEsZ0JBQUQsQ0FB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LEdBSHJCO1FBSUEsR0FBQSxFQUFLLGNBQWMsQ0FBQyxNQUpwQjtRQUtBLGFBQUEsRUFBZSxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQWIsQ0FBQSxDQUxmOztNQVFGLHVCQUFBLEdBQTBCLElBQUMsQ0FBQTtNQUMzQixRQUFBLEdBQVcsSUFBQyxDQUFBO0FBRVosYUFBVyxJQUFBLE9BQUEsQ0FBUSxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2pCLFlBQUE7ZUFBQSxRQUFBLEdBQVcsUUFBUSxDQUFDLFFBQVQsQ0FBb0IsQ0FBQyxJQUFJLENBQUMsU0FBTCxDQUFlLE9BQWYsQ0FBRCxDQUFBLEdBQXlCLElBQTdDLEVBQWtELFNBQUMsUUFBRDtVQUMzRCx1QkFBQSxDQUF3QixJQUFJLENBQUMsS0FBTCxDQUFXLFFBQVgsQ0FBeEI7aUJBQ0EsT0FBQSxDQUFBO1FBRjJELENBQWxEO01BRE0sQ0FBUjtJQWxCSyxDQS9RbEI7OztFQXVTRixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQW5UakIiLCJzb3VyY2VzQ29udGVudCI6WyJ7UmFuZ2UsIFBvaW50LCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG5wYXRoID0gcmVxdWlyZSAncGF0aCdcblxuXG5yZWdleFBhdHRlcm5JbiA9IChwYXR0ZXJuLCBsaXN0KSAtPlxuICBmb3IgaXRlbSBpbiBsaXN0XG4gICAgaWYgcGF0dGVybi50ZXN0IGl0ZW1cbiAgICAgIHJldHVybiB0cnVlXG4gIHJldHVybiBmYWxzZVxuXG5cblB5dGhvblRvb2xzID1cbiAgY29uZmlnOlxuICAgIHNtYXJ0QmxvY2tTZWxlY3Rpb246XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlc2NyaXB0aW9uOiAnRG8gbm90IHNlbGVjdCB3aGl0ZXNwYWNlIG91dHNpZGUgbG9naWNhbCBzdHJpbmcgYmxvY2tzJ1xuICAgICAgZGVmYXVsdDogdHJ1ZVxuICAgIHB5dGhvblBhdGg6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogJydcbiAgICAgIHRpdGxlOiAnUGF0aCB0byBweXRob24gZGlyZWN0b3J5J1xuICAgICAgZGVzY3JpcHRpb246ICcnJ1xuICAgICAgT3B0aW9uYWwuIFNldCBpdCBpZiBkZWZhdWx0IHZhbHVlcyBhcmUgbm90IHdvcmtpbmcgZm9yIHlvdSBvciB5b3Ugd2FudCB0byB1c2Ugc3BlY2lmaWNcbiAgICAgIHB5dGhvbiB2ZXJzaW9uLiBGb3IgZXhhbXBsZTogYC91c3IvbG9jYWwvQ2VsbGFyL3B5dGhvbi8yLjcuMy9iaW5gIG9yIGBFOlxcXFxQeXRob24yLjdgXG4gICAgICAnJydcblxuICBzdWJzY3JpcHRpb25zOiBudWxsXG5cbiAgX2lzc3VlUmVwb3J0TGluazogXCJodHRwczovL2dpdGh1Yi5jb20vbWljaGFlbGFxdWlsaW5hL3B5dGhvbi10b29scy9pc3N1ZXMvbmV3XCJcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgICMgRXZlbnRzIHN1YnNjcmliZWQgdG8gaW4gYXRvbSdzIHN5c3RlbSBjYW4gYmUgZWFzaWx5IGNsZWFuZWQgdXAgd2l0aCBhIENvbXBvc2l0ZURpc3Bvc2FibGVcbiAgICBAc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQHN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3JbZGF0YS1ncmFtbWFyPVwic291cmNlIHB5dGhvblwiXScsXG4gICAgICAncHl0aG9uLXRvb2xzOnNob3ctdXNhZ2VzJzogPT4gQGplZGlUb29sc1JlcXVlc3QoJ3VzYWdlcycpXG4gICAgKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcj1cInNvdXJjZSBweXRob25cIl0nLFxuICAgICAgJ3B5dGhvbi10b29sczpnb3RvLWRlZmluaXRpb24nOiA9PiBAamVkaVRvb2xzUmVxdWVzdCgnZ290b0RlZicpXG4gICAgKVxuICAgIEBzdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29tbWFuZHMuYWRkICdhdG9tLXRleHQtZWRpdG9yW2RhdGEtZ3JhbW1hcj1cInNvdXJjZSBweXRob25cIl0nLFxuICAgICAgJ3B5dGhvbi10b29sczpzZWxlY3QtYWxsLXN0cmluZyc6ID0+IEBzZWxlY3RBbGxTdHJpbmcoKVxuICAgIClcblxuICAgIGVudiA9IHByb2Nlc3MuZW52XG4gICAgcHl0aG9uUGF0aCA9IGF0b20uY29uZmlnLmdldCgncHl0aG9uLXRvb2xzLnB5dGhvblBhdGgnKVxuICAgIHBhdGhfZW52ID0gbnVsbFxuXG4gICAgaWYgL153aW4vLnRlc3QgcHJvY2Vzcy5wbGF0Zm9ybVxuICAgICAgcGF0aHMgPSBbJ0M6XFxcXFB5dGhvbjIuNycsXG4gICAgICAgICAgICAgICAnQzpcXFxcUHl0aG9uMjcnLFxuICAgICAgICAgICAgICAgJ0M6XFxcXFB5dGhvbjMuNCcsXG4gICAgICAgICAgICAgICAnQzpcXFxcUHl0aG9uMzQnLFxuICAgICAgICAgICAgICAgJ0M6XFxcXFB5dGhvbjMuNScsXG4gICAgICAgICAgICAgICAnQzpcXFxcUHl0aG9uMzUnLFxuICAgICAgICAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg4NilcXFxcUHl0aG9uIDIuNycsXG4gICAgICAgICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDg2KVxcXFxQeXRob24gMy40JyxcbiAgICAgICAgICAgICAgICdDOlxcXFxQcm9ncmFtIEZpbGVzICh4ODYpXFxcXFB5dGhvbiAzLjUnLFxuICAgICAgICAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg2NClcXFxcUHl0aG9uIDIuNycsXG4gICAgICAgICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlcyAoeDY0KVxcXFxQeXRob24gMy40JyxcbiAgICAgICAgICAgICAgICdDOlxcXFxQcm9ncmFtIEZpbGVzICh4NjQpXFxcXFB5dGhvbiAzLjUnLFxuICAgICAgICAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXNcXFxcUHl0aG9uIDIuNycsXG4gICAgICAgICAgICAgICAnQzpcXFxcUHJvZ3JhbSBGaWxlc1xcXFxQeXRob24gMy40JyxcbiAgICAgICAgICAgICAgICdDOlxcXFxQcm9ncmFtIEZpbGVzXFxcXFB5dGhvbiAzLjUnXVxuICAgICAgcGF0aF9lbnYgPSAoZW52LlBhdGggb3IgJycpXG4gICAgZWxzZVxuICAgICAgcGF0aHMgPSBbJy91c3IvbG9jYWwvYmluJywgJy91c3IvYmluJywgJy9iaW4nLCAnL3Vzci9zYmluJywgJy9zYmluJ11cbiAgICAgIHBhdGhfZW52ID0gKGVudi5QQVRIIG9yICcnKVxuXG4gICAgcGF0aF9lbnYgPSBwYXRoX2Vudi5zcGxpdChwYXRoLmRlbGltaXRlcilcbiAgICBwYXRoX2Vudi51bnNoaWZ0IHB5dGhvblBhdGggaWYgcHl0aG9uUGF0aCBhbmQgcHl0aG9uUGF0aCBub3QgaW4gcGF0aF9lbnZcbiAgICBmb3IgcCBpbiBwYXRoc1xuICAgICAgaWYgcCBub3QgaW4gcGF0aF9lbnZcbiAgICAgICAgcGF0aF9lbnYucHVzaCBwXG4gICAgZW52LlBBVEggPSBwYXRoX2Vudi5qb2luIHBhdGguZGVsaW1pdGVyXG5cbiAgICBAcHJvdmlkZXIgPSByZXF1aXJlKCdjaGlsZF9wcm9jZXNzJykuc3Bhd24oXG4gICAgICAncHl0aG9uJywgW19fZGlybmFtZSArICcvdG9vbHMucHknXSwgZW52OiBlbnZcbiAgICApXG5cbiAgICBAcmVhZGxpbmUgPSByZXF1aXJlKCdyZWFkbGluZScpLmNyZWF0ZUludGVyZmFjZShcbiAgICAgIGlucHV0OiBAcHJvdmlkZXIuc3Rkb3V0XG4gICAgICBvdXRwdXQ6IEBwcm92aWRlci5zdGRpblxuICAgIClcblxuICAgIEBwcm92aWRlci5vbiAnZXJyb3InLCAoZXJyKSA9PlxuICAgICAgaWYgZXJyLmNvZGUgPT0gJ0VOT0VOVCdcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJcIlwiXG4gICAgICAgICAgcHl0aG9uLXRvb2xzIHdhcyB1bmFibGUgdG8gZmluZCB5b3VyIG1hY2hpbmUncyBweXRob24gZXhlY3V0YWJsZS5cblxuICAgICAgICAgIFBsZWFzZSB0cnkgc2V0IHRoZSBwYXRoIGluIHBhY2thZ2Ugc2V0dGluZ3MgYW5kIHRoZW4gcmVzdGFydCBhdG9tLlxuXG4gICAgICAgICAgSWYgdGhlIGlzc3VlIHBlcnNpc3RzIHBsZWFzZSBwb3N0IGFuIGlzc3VlIG9uXG4gICAgICAgICAgI3tAX2lzc3VlUmVwb3J0TGlua31cbiAgICAgICAgICBcIlwiXCIsIHtcbiAgICAgICAgICAgIGRldGFpbDogZXJyLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICB9XG4gICAgICAgIClcbiAgICAgIGVsc2VcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFwiXCJcIlxuICAgICAgICAgIHB5dGhvbi10b29scyB1bmV4cGVjdGVkIGVycm9yLlxuXG4gICAgICAgICAgUGxlYXNlIGNvbnNpZGVyIHBvc3RpbmcgYW4gaXNzdWUgb25cbiAgICAgICAgICAje0BfaXNzdWVSZXBvcnRMaW5rfVxuICAgICAgICAgIFwiXCJcIiwge1xuICAgICAgICAgICAgICBkZXRhaWw6IGVycixcbiAgICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIEBwcm92aWRlci5vbiAnZXhpdCcsIChjb2RlLCBzaWduYWwpID0+XG4gICAgICBpZiBzaWduYWwgIT0gJ1NJR1RFUk0nXG4gICAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgICBcIlwiXCJcbiAgICAgICAgICBweXRob24tdG9vbHMgZXhwZXJpZW5jZWQgYW4gdW5leHBlY3RlZCBleGl0LlxuXG4gICAgICAgICAgUGxlYXNlIGNvbnNpZGVyIHBvc3RpbmcgYW4gaXNzdWUgb25cbiAgICAgICAgICAje0BfaXNzdWVSZXBvcnRMaW5rfVxuICAgICAgICAgIFwiXCJcIiwge1xuICAgICAgICAgICAgZGV0YWlsOiBcImV4aXQgd2l0aCBjb2RlICN7Y29kZX0sIHNpZ25hbCAje3NpZ25hbH1cIixcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICApXG5cbiAgZGVhY3RpdmF0ZTogLT5cbiAgICBAc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcbiAgICBAcHJvdmlkZXIua2lsbCgpXG4gICAgQHJlYWRsaW5lLmNsb3NlKClcblxuICBzZWxlY3RBbGxTdHJpbmc6IC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgYnVmZmVyUG9zaXRpb24gPSBlZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxuICAgIGxpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coYnVmZmVyUG9zaXRpb24ucm93KVxuXG4gICAgc2NvcGVEZXNjcmlwdG9yID0gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKGJ1ZmZlclBvc2l0aW9uKVxuICAgIHNjb3BlcyA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZXNBcnJheSgpXG5cbiAgICBibG9jayA9IGZhbHNlXG4gICAgaWYgcmVnZXhQYXR0ZXJuSW4oL3N0cmluZy5xdW90ZWQuc2luZ2xlLnNpbmdsZS1saW5lLiovLCBzY29wZXMpXG4gICAgICBkZWxpbWl0ZXIgPSAnXFwnJ1xuICAgIGVsc2UgaWYgcmVnZXhQYXR0ZXJuSW4oL3N0cmluZy5xdW90ZWQuZG91YmxlLnNpbmdsZS1saW5lLiovLCBzY29wZXMpXG4gICAgICBkZWxpbWl0ZXIgPSAnXCInXG4gICAgZWxzZSBpZiByZWdleFBhdHRlcm5Jbigvc3RyaW5nLnF1b3RlZC5kb3VibGUuYmxvY2suKi8sc2NvcGVzKVxuICAgICAgZGVsaW1pdGVyID0gJ1wiXCJcIidcbiAgICAgIGJsb2NrID0gdHJ1ZVxuICAgIGVsc2UgaWYgcmVnZXhQYXR0ZXJuSW4oL3N0cmluZy5xdW90ZWQuc2luZ2xlLmJsb2NrLiovLCBzY29wZXMpXG4gICAgICBkZWxpbWl0ZXIgPSAnXFwnXFwnXFwnJ1xuICAgICAgYmxvY2sgPSB0cnVlXG4gICAgZWxzZVxuICAgICAgcmV0dXJuXG5cbiAgICBpZiBub3QgYmxvY2tcbiAgICAgIHN0YXJ0ID0gZW5kID0gYnVmZmVyUG9zaXRpb24uY29sdW1uXG5cbiAgICAgIHdoaWxlIGxpbmVbc3RhcnRdICE9IGRlbGltaXRlclxuICAgICAgICBzdGFydCA9IHN0YXJ0IC0gMVxuICAgICAgICBpZiBzdGFydCA8IDBcbiAgICAgICAgICByZXR1cm5cblxuICAgICAgd2hpbGUgbGluZVtlbmRdICE9IGRlbGltaXRlclxuICAgICAgICBlbmQgPSBlbmQgKyAxXG4gICAgICAgIGlmIGVuZCA9PSBsaW5lLmxlbmd0aFxuICAgICAgICAgIHJldHVyblxuXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShuZXcgUmFuZ2UoXG4gICAgICAgIG5ldyBQb2ludChidWZmZXJQb3NpdGlvbi5yb3csIHN0YXJ0ICsgMSksXG4gICAgICAgIG5ldyBQb2ludChidWZmZXJQb3NpdGlvbi5yb3csIGVuZCksXG4gICAgICApKVxuICAgIGVsc2VcbiAgICAgIHN0YXJ0ID0gZW5kID0gYnVmZmVyUG9zaXRpb24ucm93XG4gICAgICBzdGFydF9pbmRleCA9IGVuZF9pbmRleCA9IC0xXG5cbiAgICAgICMgRGV0ZWN0IGlmIHdlIGFyZSBhdCB0aGUgYm91bmRhcmllcyBvZiB0aGUgYmxvY2sgc3RyaW5nXG4gICAgICBkZWxpbV9pbmRleCA9IGxpbmUuaW5kZXhPZihkZWxpbWl0ZXIpXG5cbiAgICAgIGlmIGRlbGltX2luZGV4ICE9IC0xXG4gICAgICAgIHNjb3BlcyA9IGVkaXRvci5zY29wZURlc2NyaXB0b3JGb3JCdWZmZXJQb3NpdGlvbihuZXcgUG9pbnQoc3RhcnQsIGRlbGltX2luZGV4KSlcbiAgICAgICAgc2NvcGVzID0gc2NvcGVzLmdldFNjb3Blc0FycmF5KClcblxuICAgICAgICAjIFdlIGFyZSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBibG9ja1xuICAgICAgICBpZiByZWdleFBhdHRlcm5JbigvcHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4uKi8sIHNjb3BlcylcbiAgICAgICAgICBzdGFydF9pbmRleCA9IGxpbmUuaW5kZXhPZihkZWxpbWl0ZXIpXG4gICAgICAgICAgd2hpbGUgZW5kX2luZGV4ID09IC0xXG4gICAgICAgICAgICBlbmQgPSBlbmQgKyAxXG4gICAgICAgICAgICBsaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGVuZClcbiAgICAgICAgICAgIGVuZF9pbmRleCA9IGxpbmUuaW5kZXhPZihkZWxpbWl0ZXIpXG5cbiAgICAgICAgIyBXZSBhcmUgdGhlIGVuZCBvZiB0aGUgYmxvY2tcbiAgICAgICAgZWxzZSBpZiByZWdleFBhdHRlcm5JbigvcHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuZW5kLiovLCBzY29wZXMpXG4gICAgICAgICAgZW5kX2luZGV4ID0gbGluZS5pbmRleE9mKGRlbGltaXRlcilcbiAgICAgICAgICB3aGlsZSBzdGFydF9pbmRleCA9PSAtMVxuICAgICAgICAgICAgc3RhcnQgPSBzdGFydCAtIDFcbiAgICAgICAgICAgIGxpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coc3RhcnQpXG4gICAgICAgICAgICBzdGFydF9pbmRleCA9IGxpbmUuaW5kZXhPZihkZWxpbWl0ZXIpXG5cbiAgICAgIGVsc2VcbiAgICAgICAgIyBXZSBhcmUgbmVpdGhlciBhdCB0aGUgYmVnaW5uaW5nIG9yIHRoZSBlbmQgb2YgdGhlIGJsb2NrXG4gICAgICAgIHdoaWxlIGVuZF9pbmRleCA9PSAtMVxuICAgICAgICAgIGVuZCA9IGVuZCArIDFcbiAgICAgICAgICBsaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGVuZClcbiAgICAgICAgICBlbmRfaW5kZXggPSBsaW5lLmluZGV4T2YoZGVsaW1pdGVyKVxuICAgICAgICB3aGlsZSBzdGFydF9pbmRleCA9PSAtMVxuICAgICAgICAgIHN0YXJ0ID0gc3RhcnQgLSAxXG4gICAgICAgICAgbGluZSA9IGVkaXRvci5saW5lVGV4dEZvckJ1ZmZlclJvdyhzdGFydClcbiAgICAgICAgICBzdGFydF9pbmRleCA9IGxpbmUuaW5kZXhPZihkZWxpbWl0ZXIpXG5cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgncHl0aG9uLXRvb2xzLnNtYXJ0QmxvY2tTZWxlY3Rpb24nKVxuICAgICAgICAjIFNtYXJ0IGJsb2NrIHNlbGVjdGlvbnNcbiAgICAgICAgc2VsZWN0aW9ucyA9IFtuZXcgUmFuZ2UoXG4gICAgICAgICAgbmV3IFBvaW50KHN0YXJ0LCBzdGFydF9pbmRleCArIGRlbGltaXRlci5sZW5ndGgpLFxuICAgICAgICAgIG5ldyBQb2ludChzdGFydCwgZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KHN0YXJ0KS5sZW5ndGgpLFxuICAgICAgICApXVxuXG4gICAgICAgIGZvciBpIGluIFtzdGFydCArIDEgLi4uIGVuZF0gYnkgMVxuICAgICAgICAgIGxpbmUgPSBlZGl0b3IubGluZVRleHRGb3JCdWZmZXJSb3coaSlcbiAgICAgICAgICB0cmltbWVkID0gbGluZS5yZXBsYWNlKC9eXFxzKy8sIFwiXCIpICAjIGxlZnQgdHJpbVxuICAgICAgICAgIHNlbGVjdGlvbnMucHVzaCBuZXcgUmFuZ2UoXG4gICAgICAgICAgICBuZXcgUG9pbnQoaSwgbGluZS5sZW5ndGggLSB0cmltbWVkLmxlbmd0aCksXG4gICAgICAgICAgICBuZXcgUG9pbnQoaSwgbGluZS5sZW5ndGgpLFxuICAgICAgICAgIClcblxuICAgICAgICBsaW5lID0gZWRpdG9yLmxpbmVUZXh0Rm9yQnVmZmVyUm93KGVuZClcbiAgICAgICAgdHJpbW1lZCA9IGxpbmUucmVwbGFjZSgvXlxccysvLCBcIlwiKSAgIyBsZWZ0IHRyaW1cblxuICAgICAgICBzZWxlY3Rpb25zLnB1c2ggbmV3IFJhbmdlKFxuICAgICAgICAgIG5ldyBQb2ludChlbmQsIGxpbmUubGVuZ3RoIC0gdHJpbW1lZC5sZW5ndGgpLFxuICAgICAgICAgIG5ldyBQb2ludChlbmQsIGVuZF9pbmRleCksXG4gICAgICAgIClcblxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoc2VsZWN0aW9ucy5maWx0ZXIgKHJhbmdlKSAtPiBub3QgcmFuZ2UuaXNFbXB0eSgpKVxuICAgICAgZWxzZVxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShuZXcgUmFuZ2UoXG4gICAgICAgICAgbmV3IFBvaW50KHN0YXJ0LCBzdGFydF9pbmRleCArIGRlbGltaXRlci5sZW5ndGgpLFxuICAgICAgICAgIG5ldyBQb2ludChlbmQsIGVuZF9pbmRleCksXG4gICAgICAgICkpXG5cbiAgaGFuZGxlSmVkaVRvb2xzUmVzcG9uc2U6IChyZXNwb25zZSkgLT5cbiAgICBpZiAnZXJyb3InIG9mIHJlc3BvbnNlXG4gICAgICBjb25zb2xlLmVycm9yIHJlc3BvbnNlWydlcnJvciddXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IocmVzcG9uc2VbJ2Vycm9yJ10pXG4gICAgICByZXR1cm5cblxuICAgIGlmIHJlc3BvbnNlWydkZWZpbml0aW9ucyddLmxlbmd0aCA+IDBcbiAgICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgICBpZiByZXNwb25zZVsndHlwZSddID09ICd1c2FnZXMnXG4gICAgICAgIHBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG4gICAgICAgIHNlbGVjdGlvbnMgPSBbXVxuICAgICAgICBmb3IgaXRlbSBpbiByZXNwb25zZVsnZGVmaW5pdGlvbnMnXVxuICAgICAgICAgIGlmIGl0ZW1bJ3BhdGgnXSA9PSBwYXRoXG4gICAgICAgICAgICBzZWxlY3Rpb25zLnB1c2ggbmV3IFJhbmdlKFxuICAgICAgICAgICAgICBuZXcgUG9pbnQoaXRlbVsnbGluZSddIC0gMSwgaXRlbVsnY29sJ10pLFxuICAgICAgICAgICAgICBuZXcgUG9pbnQoaXRlbVsnbGluZSddIC0gMSwgaXRlbVsnY29sJ10gKyBpdGVtWyduYW1lJ10ubGVuZ3RoKSwgICMgVXNlIHN0cmluZyBsZW5ndGhcbiAgICAgICAgICAgIClcblxuICAgICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZXMoc2VsZWN0aW9ucylcblxuICAgICAgZWxzZSBpZiByZXNwb25zZVsndHlwZSddID09ICdnb3RvRGVmJ1xuICAgICAgICBmaXJzdF9kZWYgPSByZXNwb25zZVsnZGVmaW5pdGlvbnMnXVswXVxuXG4gICAgICAgIGxpbmUgPSBmaXJzdF9kZWZbJ2xpbmUnXVxuICAgICAgICBjb2x1bW4gPSBmaXJzdF9kZWZbJ2NvbCddXG5cbiAgICAgICAgaWYgbGluZSAhPSBudWxsIGFuZCBjb2x1bW4gIT0gbnVsbFxuICAgICAgICAgIG9wdGlvbnMgPVxuICAgICAgICAgICAgaW5pdGlhbExpbmU6IGxpbmVcbiAgICAgICAgICAgIGluaXRpYWxDb2x1bW46IGNvbHVtblxuICAgICAgICAgICAgc2VhcmNoQWxsUGFuZXM6IHRydWVcblxuICAgICAgICAgIGF0b20ud29ya3NwYWNlLm9wZW4oZmlyc3RfZGVmWydwYXRoJ10sIG9wdGlvbnMpLnRoZW4gKGVkaXRvcikgLT5cbiAgICAgICAgICAgIGVkaXRvci5zY3JvbGxUb0N1cnNvclBvc2l0aW9uKClcbiAgICAgIGVsc2VcbiAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICAgIFwicHl0aG9uLXRvb2xzIGVycm9yLiAje0BfaXNzdWVSZXBvcnRMaW5rfVwiLCB7XG4gICAgICAgICAgICBkZXRhaWw6IEpTT04uc3RyaW5naWZ5KHJlc3BvbnNlKSxcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlXG4gICAgICAgICAgfVxuICAgICAgICApXG4gICAgZWxzZVxuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oXCJweXRob24tdG9vbHMgY291bGQgbm90IGZpbmQgYW55IHJlc3VsdHMhXCIpXG5cbiAgamVkaVRvb2xzUmVxdWVzdDogKHR5cGUpIC0+XG4gICAgZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG4gICAgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKClcblxuICAgIGJ1ZmZlclBvc2l0aW9uID0gZWRpdG9yLmdldEN1cnNvckJ1ZmZlclBvc2l0aW9uKClcblxuICAgIHBheWxvYWQgPVxuICAgICAgdHlwZTogdHlwZVxuICAgICAgcGF0aDogZWRpdG9yLmdldFBhdGgoKVxuICAgICAgc291cmNlOiBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgICBsaW5lOiBidWZmZXJQb3NpdGlvbi5yb3dcbiAgICAgIGNvbDogYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgICBwcm9qZWN0X3BhdGhzOiBhdG9tLnByb2plY3QuZ2V0UGF0aHMoKVxuXG4gICAgIyBUaGlzIGlzIG5lZWRlZCBmb3IgdGhlIHByb21pc2UgdG8gd29yayBjb3JyZWN0bHlcbiAgICBoYW5kbGVKZWRpVG9vbHNSZXNwb25zZSA9IEBoYW5kbGVKZWRpVG9vbHNSZXNwb25zZVxuICAgIHJlYWRsaW5lID0gQHJlYWRsaW5lXG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UgKHJlc29sdmUsIHJlamVjdCkgLT5cbiAgICAgIHJlc3BvbnNlID0gcmVhZGxpbmUucXVlc3Rpb24gXCIje0pTT04uc3RyaW5naWZ5KHBheWxvYWQpfVxcblwiLCAocmVzcG9uc2UpIC0+XG4gICAgICAgIGhhbmRsZUplZGlUb29sc1Jlc3BvbnNlKEpTT04ucGFyc2UocmVzcG9uc2UpKVxuICAgICAgICByZXNvbHZlKClcblxuXG5tb2R1bGUuZXhwb3J0cyA9IFB5dGhvblRvb2xzXG4iXX0=
