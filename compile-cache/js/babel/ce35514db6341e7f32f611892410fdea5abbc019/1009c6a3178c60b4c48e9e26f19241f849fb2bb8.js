Object.defineProperty(exports, '__esModule', {
  value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

exports.activate = activate;
exports.deactivate = deactivate;
exports.provideLinter = provideLinter;

/**
 * Note that this can't be loaded lazily as `atom` doesn't export it correctly
 * for that, however as this comes from app.asar it is pre-compiled and is
 * essentially "free" as there is no expensive compilation step.
 */

var _atom = require('atom');

'use babel';

var lazyReq = require('lazy-req')(require);

var _lazyReq = lazyReq('path')('basename', 'delimiter', 'dirname');

var basename = _lazyReq.basename;
var delimiter = _lazyReq.delimiter;
var dirname = _lazyReq.dirname;

var _lazyReq2 = lazyReq('atom-linter')('exec', 'parse', 'rangeFromLineNumber', 'tempFile');

var exec = _lazyReq2.exec;
var parse = _lazyReq2.parse;
var rangeFromLineNumber = _lazyReq2.rangeFromLineNumber;
var tempFile = _lazyReq2.tempFile;

var os = lazyReq('os');

// Some local variables
var subscriptions = undefined;
var errorWhitelist = [/^No config file found, using default configuration$/];
var lineRegex = '(?<line>\\d+),(?<col>\\d+),(?<type>\\w+),(\\w\\d+):(?<message>.*)\\r?(\\n|$)';

// Settings
var executable = undefined;
var rcFile = undefined;
var messageFormat = undefined;
var pythonPath = undefined;
var workingDirectory = undefined;

function activate() {
  require('atom-package-deps').install('linter-pylint');

  subscriptions = new _atom.CompositeDisposable();

  // FIXME: This should be executablePath, saved for a major version bump
  subscriptions.add(atom.config.observe('linter-pylint.executable', function (value) {
    executable = value;
  }));
  subscriptions.add(atom.config.observe('linter-pylint.rcFile', function (value) {
    rcFile = value;
  }));
  subscriptions.add(atom.config.observe('linter-pylint.messageFormat', function (value) {
    messageFormat = value;
  }));
  subscriptions.add(atom.config.observe('linter-pylint.pythonPath', function (value) {
    pythonPath = value;
  }));
  subscriptions.add(atom.config.observe('linter-pylint.workingDirectory', function (value) {
    workingDirectory = value.replace(delimiter, '');
  }));
}

function deactivate() {
  subscriptions.dispose();
}

function getProjectDir(filePath) {
  var atomProject = atom.project.relativizePath(filePath)[0];
  if (atomProject === null) {
    // Default project dirextory to file directory if path cannot be determined
    return dirname(filePath);
  }
  return atomProject;
}

function filterWhitelistedErrors(stderr) {
  // Split the input and remove blank lines
  var lines = stderr.split(os().EOL).filter(function (line) {
    return !!line;
  });
  var filteredLines = lines.filter(function (line) {
    return(
      // Only keep the line if it is not ignored
      !errorWhitelist.some(function (errorRegex) {
        return errorRegex.test(line);
      })
    );
  });
  return filteredLines.join(os().EOL);
}

function provideLinter() {
  return {
    name: 'Pylint',
    grammarScopes: ['source.python', 'source.python.django'],
    scope: 'file',
    lintOnFly: true,
    lint: function lint(editor) {
      var filePath = editor.getPath();
      var fileDir = dirname(filePath);
      var fileText = editor.getText();
      var projectDir = getProjectDir(filePath);
      var cwd = workingDirectory.replace(/%f/g, fileDir).replace(/%p/g, projectDir);
      var execPath = executable.replace(/%p/g, projectDir);
      var format = messageFormat;
      var patterns = {
        '%m': 'msg',
        '%i': 'msg_id',
        '%s': 'symbol'
      };
      Object.keys(patterns).forEach(function (pattern) {
        format = format.replace(new RegExp(pattern, 'g'), '{' + patterns[pattern] + '}');
      });
      var env = Object.create(process.env, {
        PYTHONPATH: {
          value: [process.env.PYTHONPATH, fileDir, projectDir, pythonPath.replace(/%f/g, fileDir).replace(/%p/g, projectDir)].filter(function (x) {
            return !!x;
          }).join(delimiter),
          enumerable: true
        },
        LANG: { value: 'en_US.UTF-8', enumerable: true }
      });

      var args = ['--msg-template=\'{line},{column},{category},{msg_id}:' + format + '\'', '--reports=n', '--output-format=text'];
      if (rcFile) {
        args.push('--rcfile=' + rcFile.replace(/%p/g, projectDir).replace(/%f/g, fileDir));
      }
      return tempFile(basename(filePath), fileText, function (tmpFileName) {
        args.push(tmpFileName);
        return exec(execPath, args, { env: env, cwd: cwd, stream: 'both' }).then(function (data) {
          if (editor.getText() !== fileText) {
            // Editor text was modified since the lint was triggered, tell Linter not to update
            return null;
          }
          var filteredErrors = filterWhitelistedErrors(data.stderr);
          if (filteredErrors) {
            throw new Error(filteredErrors);
          }
          return parse(data.stdout, lineRegex, { filePath: filePath }).filter(function (issue) {
            return issue.type !== 'info';
          }).map(function (issue) {
            var _issue$range = _slicedToArray(issue.range, 2);

            var _issue$range$0 = _slicedToArray(_issue$range[0], 2);

            var lineStart = _issue$range$0[0];
            var colStart = _issue$range$0[1];

            var _issue$range$1 = _slicedToArray(_issue$range[1], 2);

            var lineEnd = _issue$range$1[0];
            var colEnd = _issue$range$1[1];

            if (lineStart === lineEnd && (colStart <= colEnd || colEnd <= 0)) {
              Object.assign(issue, {
                range: rangeFromLineNumber(editor, lineStart, colStart)
              });
            }
            return issue;
          });
        });
      });
    }
  };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvbGludGVyLXB5bGludC9saWIvbWFpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O29CQU9vQyxNQUFNOztBQVAxQyxXQUFXLENBQUM7O0FBU1osSUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztlQUVKLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FDdEQsVUFBVSxFQUFFLFdBQVcsRUFBRSxTQUFTLENBQ25DOztJQUZPLFFBQVEsWUFBUixRQUFRO0lBQUUsU0FBUyxZQUFULFNBQVM7SUFBRSxPQUFPLFlBQVAsT0FBTzs7Z0JBR21CLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FDM0UsTUFBTSxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxVQUFVLENBQ25EOztJQUZPLElBQUksYUFBSixJQUFJO0lBQUUsS0FBSyxhQUFMLEtBQUs7SUFBRSxtQkFBbUIsYUFBbkIsbUJBQW1CO0lBQUUsUUFBUSxhQUFSLFFBQVE7O0FBR2xELElBQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQzs7O0FBR3pCLElBQUksYUFBYSxZQUFBLENBQUM7QUFDbEIsSUFBTSxjQUFjLEdBQUcsQ0FDckIscURBQXFELENBQ3RELENBQUM7QUFDRixJQUFNLFNBQVMsR0FBRyw4RUFBOEUsQ0FBQzs7O0FBR2pHLElBQUksVUFBVSxZQUFBLENBQUM7QUFDZixJQUFJLE1BQU0sWUFBQSxDQUFDO0FBQ1gsSUFBSSxhQUFhLFlBQUEsQ0FBQztBQUNsQixJQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsSUFBSSxnQkFBZ0IsWUFBQSxDQUFDOztBQUVkLFNBQVMsUUFBUSxHQUFHO0FBQ3pCLFNBQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQzs7QUFFdEQsZUFBYSxHQUFHLCtCQUF5QixDQUFDOzs7QUFHMUMsZUFB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O0FBQ25CLHFCQUFLLEVBQUUsbUJBQW1CLENBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLENBQUM7ZUFDeEQsQ0FBQyxDQUFDO2FBQ0o7QUFDRCxtQkFBTyxLQUFLLENBQUM7V0FDZCxDQUFDLENBQUM7U0FDTixDQUFDLENBQUM7T0FDSixDQUFDLENBQUM7S0FDSjtHQUNGLENBQUM7Q0FDSCIsImZpbGUiOiIvaG9tZS9qb2NlbHluLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1weWxpbnQvbGliL21haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuLyoqXG4gKiBOb3RlIHRoYXQgdGhpcyBjYW4ndCBiZSBsb2FkZWQgbGF6aWx5IGFzIGBhdG9tYCBkb2Vzbid0IGV4cG9ydCBpdCBjb3JyZWN0bHlcbiAqIGZvciB0aGF0LCBob3dldmVyIGFzIHRoaXMgY29tZXMgZnJvbSBhcHAuYXNhciBpdCBpcyBwcmUtY29tcGlsZWQgYW5kIGlzXG4gKiBlc3NlbnRpYWxseSBcImZyZWVcIiBhcyB0aGVyZSBpcyBubyBleHBlbnNpdmUgY29tcGlsYXRpb24gc3RlcC5cbiAqL1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuXG5jb25zdCBsYXp5UmVxID0gcmVxdWlyZSgnbGF6eS1yZXEnKShyZXF1aXJlKTtcblxuY29uc3QgeyBiYXNlbmFtZSwgZGVsaW1pdGVyLCBkaXJuYW1lIH0gPSBsYXp5UmVxKCdwYXRoJykoXG4gICdiYXNlbmFtZScsICdkZWxpbWl0ZXInLCAnZGlybmFtZSdcbik7XG5jb25zdCB7IGV4ZWMsIHBhcnNlLCByYW5nZUZyb21MaW5lTnVtYmVyLCB0ZW1wRmlsZSB9ID0gbGF6eVJlcSgnYXRvbS1saW50ZXInKShcbiAgJ2V4ZWMnLCAncGFyc2UnLCAncmFuZ2VGcm9tTGluZU51bWJlcicsICd0ZW1wRmlsZSdcbik7XG5jb25zdCBvcyA9IGxhenlSZXEoJ29zJyk7XG5cbi8vIFNvbWUgbG9jYWwgdmFyaWFibGVzXG5sZXQgc3Vic2NyaXB0aW9ucztcbmNvbnN0IGVycm9yV2hpdGVsaXN0ID0gW1xuICAvXk5vIGNvbmZpZyBmaWxlIGZvdW5kLCB1c2luZyBkZWZhdWx0IGNvbmZpZ3VyYXRpb24kLyxcbl07XG5jb25zdCBsaW5lUmVnZXggPSAnKD88bGluZT5cXFxcZCspLCg/PGNvbD5cXFxcZCspLCg/PHR5cGU+XFxcXHcrKSwoXFxcXHdcXFxcZCspOig/PG1lc3NhZ2U+LiopXFxcXHI/KFxcXFxufCQpJztcblxuLy8gU2V0dGluZ3NcbmxldCBleGVjdXRhYmxlO1xubGV0IHJjRmlsZTtcbmxldCBtZXNzYWdlRm9ybWF0O1xubGV0IHB5dGhvblBhdGg7XG5sZXQgd29ya2luZ0RpcmVjdG9yeTtcblxuZXhwb3J0IGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICByZXF1aXJlKCdhdG9tLXBhY2thZ2UtZGVwcycpLmluc3RhbGwoJ2xpbnRlci1weWxpbnQnKTtcblxuICBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcblxuICAvLyBGSVhNRTogVGhpcyBzaG91bGQgYmUgZXhlY3V0YWJsZVBhdGgsIHNhdmVkIGZvciBhIG1ham9yIHZlcnNpb24gYnVtcFxuICBzdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcHlsaW50LmV4ZWN1dGFibGUnLCAodmFsdWUpID0+IHtcbiAgICBleGVjdXRhYmxlID0gdmFsdWU7XG4gIH0pKTtcbiAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXB5bGludC5yY0ZpbGUnLCAodmFsdWUpID0+IHtcbiAgICByY0ZpbGUgPSB2YWx1ZTtcbiAgfSkpO1xuICBzdWJzY3JpcHRpb25zLmFkZChhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItcHlsaW50Lm1lc3NhZ2VGb3JtYXQnLCAodmFsdWUpID0+IHtcbiAgICBtZXNzYWdlRm9ybWF0ID0gdmFsdWU7XG4gIH0pKTtcbiAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLXB5bGludC5weXRob25QYXRoJywgKHZhbHVlKSA9PiB7XG4gICAgcHl0aG9uUGF0aCA9IHZhbHVlO1xuICB9KSk7XG4gIHN1YnNjcmlwdGlvbnMuYWRkKGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1weWxpbnQud29ya2luZ0RpcmVjdG9yeScsICh2YWx1ZSkgPT4ge1xuICAgIHdvcmtpbmdEaXJlY3RvcnkgPSB2YWx1ZS5yZXBsYWNlKGRlbGltaXRlciwgJycpO1xuICB9KSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZWFjdGl2YXRlKCkge1xuICBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKTtcbn1cblxuZnVuY3Rpb24gZ2V0UHJvamVjdERpcihmaWxlUGF0aCkge1xuICBjb25zdCBhdG9tUHJvamVjdCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF07XG4gIGlmIChhdG9tUHJvamVjdCA9PT0gbnVsbCkge1xuICAgIC8vIERlZmF1bHQgcHJvamVjdCBkaXJleHRvcnkgdG8gZmlsZSBkaXJlY3RvcnkgaWYgcGF0aCBjYW5ub3QgYmUgZGV0ZXJtaW5lZFxuICAgIHJldHVybiBkaXJuYW1lKGZpbGVQYXRoKTtcbiAgfVxuICByZXR1cm4gYXRvbVByb2plY3Q7XG59XG5cbmZ1bmN0aW9uIGZpbHRlcldoaXRlbGlzdGVkRXJyb3JzKHN0ZGVycikge1xuICAvLyBTcGxpdCB0aGUgaW5wdXQgYW5kIHJlbW92ZSBibGFuayBsaW5lc1xuICBjb25zdCBsaW5lcyA9IHN0ZGVyci5zcGxpdChvcygpLkVPTCkuZmlsdGVyKGxpbmUgPT4gISFsaW5lKTtcbiAgY29uc3QgZmlsdGVyZWRMaW5lcyA9IGxpbmVzLmZpbHRlcihsaW5lID0+XG4gICAgLy8gT25seSBrZWVwIHRoZSBsaW5lIGlmIGl0IGlzIG5vdCBpZ25vcmVkXG4gICAgIWVycm9yV2hpdGVsaXN0LnNvbWUoZXJyb3JSZWdleCA9PiBlcnJvclJlZ2V4LnRlc3QobGluZSkpXG4gICk7XG4gIHJldHVybiBmaWx0ZXJlZExpbmVzLmpvaW4ob3MoKS5FT0wpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvdmlkZUxpbnRlcigpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnUHlsaW50JyxcbiAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5weXRob24nLCAnc291cmNlLnB5dGhvbi5kamFuZ28nXSxcbiAgICBzY29wZTogJ2ZpbGUnLFxuICAgIGxpbnRPbkZseTogdHJ1ZSxcbiAgICBsaW50OiAoZWRpdG9yKSA9PiB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKCk7XG4gICAgICBjb25zdCBmaWxlRGlyID0gZGlybmFtZShmaWxlUGF0aCk7XG4gICAgICBjb25zdCBmaWxlVGV4dCA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgICBjb25zdCBwcm9qZWN0RGlyID0gZ2V0UHJvamVjdERpcihmaWxlUGF0aCk7XG4gICAgICBjb25zdCBjd2QgPSB3b3JraW5nRGlyZWN0b3J5LnJlcGxhY2UoLyVmL2csIGZpbGVEaXIpLnJlcGxhY2UoLyVwL2csIHByb2plY3REaXIpO1xuICAgICAgY29uc3QgZXhlY1BhdGggPSBleGVjdXRhYmxlLnJlcGxhY2UoLyVwL2csIHByb2plY3REaXIpO1xuICAgICAgbGV0IGZvcm1hdCA9IG1lc3NhZ2VGb3JtYXQ7XG4gICAgICBjb25zdCBwYXR0ZXJucyA9IHtcbiAgICAgICAgJyVtJzogJ21zZycsXG4gICAgICAgICclaSc6ICdtc2dfaWQnLFxuICAgICAgICAnJXMnOiAnc3ltYm9sJyxcbiAgICAgIH07XG4gICAgICBPYmplY3Qua2V5cyhwYXR0ZXJucykuZm9yRWFjaCgocGF0dGVybikgPT4ge1xuICAgICAgICBmb3JtYXQgPSBmb3JtYXQucmVwbGFjZShuZXcgUmVnRXhwKHBhdHRlcm4sICdnJyksIGB7JHtwYXR0ZXJuc1twYXR0ZXJuXX19YCk7XG4gICAgICB9KTtcbiAgICAgIGNvbnN0IGVudiA9IE9iamVjdC5jcmVhdGUocHJvY2Vzcy5lbnYsIHtcbiAgICAgICAgUFlUSE9OUEFUSDoge1xuICAgICAgICAgIHZhbHVlOiBbXG4gICAgICAgICAgICBwcm9jZXNzLmVudi5QWVRIT05QQVRILCBmaWxlRGlyLCBwcm9qZWN0RGlyLFxuICAgICAgICAgICAgcHl0aG9uUGF0aC5yZXBsYWNlKC8lZi9nLCBmaWxlRGlyKS5yZXBsYWNlKC8lcC9nLCBwcm9qZWN0RGlyKSxcbiAgICAgICAgICBdLmZpbHRlcih4ID0+ICEheCkuam9pbihkZWxpbWl0ZXIpLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIExBTkc6IHsgdmFsdWU6ICdlbl9VUy5VVEYtOCcsIGVudW1lcmFibGU6IHRydWUgfSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhcmdzID0gW1xuICAgICAgICBgLS1tc2ctdGVtcGxhdGU9J3tsaW5lfSx7Y29sdW1ufSx7Y2F0ZWdvcnl9LHttc2dfaWR9OiR7Zm9ybWF0fSdgLFxuICAgICAgICAnLS1yZXBvcnRzPW4nLFxuICAgICAgICAnLS1vdXRwdXQtZm9ybWF0PXRleHQnLFxuICAgICAgXTtcbiAgICAgIGlmIChyY0ZpbGUpIHtcbiAgICAgICAgYXJncy5wdXNoKGAtLXJjZmlsZT0ke3JjRmlsZS5yZXBsYWNlKC8lcC9nLCBwcm9qZWN0RGlyKS5yZXBsYWNlKC8lZi9nLCBmaWxlRGlyKX1gKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0ZW1wRmlsZShiYXNlbmFtZShmaWxlUGF0aCksIGZpbGVUZXh0LCAodG1wRmlsZU5hbWUpID0+IHtcbiAgICAgICAgYXJncy5wdXNoKHRtcEZpbGVOYW1lKTtcbiAgICAgICAgcmV0dXJuIGV4ZWMoZXhlY1BhdGgsIGFyZ3MsIHsgZW52LCBjd2QsIHN0cmVhbTogJ2JvdGgnIH0pLnRoZW4oKGRhdGEpID0+IHtcbiAgICAgICAgICBpZiAoZWRpdG9yLmdldFRleHQoKSAhPT0gZmlsZVRleHQpIHtcbiAgICAgICAgICAgIC8vIEVkaXRvciB0ZXh0IHdhcyBtb2RpZmllZCBzaW5jZSB0aGUgbGludCB3YXMgdHJpZ2dlcmVkLCB0ZWxsIExpbnRlciBub3QgdG8gdXBkYXRlXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3QgZmlsdGVyZWRFcnJvcnMgPSBmaWx0ZXJXaGl0ZWxpc3RlZEVycm9ycyhkYXRhLnN0ZGVycik7XG4gICAgICAgICAgaWYgKGZpbHRlcmVkRXJyb3JzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoZmlsdGVyZWRFcnJvcnMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcGFyc2UoZGF0YS5zdGRvdXQsIGxpbmVSZWdleCwgeyBmaWxlUGF0aCB9KVxuICAgICAgICAgICAgLmZpbHRlcihpc3N1ZSA9PiBpc3N1ZS50eXBlICE9PSAnaW5mbycpXG4gICAgICAgICAgICAubWFwKChpc3N1ZSkgPT4ge1xuICAgICAgICAgICAgICBjb25zdCBbW2xpbmVTdGFydCwgY29sU3RhcnRdLCBbbGluZUVuZCwgY29sRW5kXV0gPSBpc3N1ZS5yYW5nZTtcbiAgICAgICAgICAgICAgaWYgKGxpbmVTdGFydCA9PT0gbGluZUVuZCAmJiAoY29sU3RhcnQgPD0gY29sRW5kIHx8IGNvbEVuZCA8PSAwKSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5hc3NpZ24oaXNzdWUsIHtcbiAgICAgICAgICAgICAgICAgIHJhbmdlOiByYW5nZUZyb21MaW5lTnVtYmVyKGVkaXRvciwgbGluZVN0YXJ0LCBjb2xTdGFydCksXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIGlzc3VlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSxcbiAgfTtcbn1cbiJdfQ==