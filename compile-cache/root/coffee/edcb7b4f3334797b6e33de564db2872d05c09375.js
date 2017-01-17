(function() {
  var fs, log, os, path,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  fs = require('fs');

  os = require('os');

  path = require('path');

  log = require('./log');

  module.exports = {
    pythonExecutableRe: function() {
      if (/^win/.test(process.platform)) {
        return /^python(\d+(.\d+)?)?\.exe$/;
      } else {
        return /^python(\d+(.\d+)?)?$/;
      }
    },
    possibleGlobalPythonPaths: function() {
      if (/^win/.test(process.platform)) {
        return ['C:\\Python2.7', 'C:\\Python3.4', 'C:\\Python3.5', 'C:\\Program Files (x86)\\Python 2.7', 'C:\\Program Files (x86)\\Python 3.4', 'C:\\Program Files (x86)\\Python 3.5', 'C:\\Program Files (x64)\\Python 2.7', 'C:\\Program Files (x64)\\Python 3.4', 'C:\\Program Files (x64)\\Python 3.5', 'C:\\Program Files\\Python 2.7', 'C:\\Program Files\\Python 3.4', 'C:\\Program Files\\Python 3.5', (os.homedir()) + "\\AppData\\Local\\Programs\\Python\\Python35-32"];
      } else {
        return ['/usr/local/bin', '/usr/bin', '/bin', '/usr/sbin', '/sbin'];
      }
    },
    readDir: function(dirPath) {
      try {
        return fs.readdirSync(dirPath);
      } catch (error) {
        return [];
      }
    },
    isBinary: function(filePath) {
      try {
        fs.accessSync(filePath, fs.X_OK);
        return true;
      } catch (error) {
        return false;
      }
    },
    lookupInterpreters: function(dirPath) {
      var f, fileName, files, interpreters, j, len, matches, potentialInterpreter;
      interpreters = new Set();
      files = this.readDir(dirPath);
      matches = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = files.length; j < len; j++) {
          f = files[j];
          if (this.pythonExecutableRe().test(f)) {
            results.push(f);
          }
        }
        return results;
      }).call(this);
      for (j = 0, len = matches.length; j < len; j++) {
        fileName = matches[j];
        potentialInterpreter = path.join(dirPath, fileName);
        if (this.isBinary(potentialInterpreter)) {
          interpreters.add(potentialInterpreter);
        }
      }
      return interpreters;
    },
    applySubstitutions: function(paths) {
      var j, k, len, len1, modPaths, p, project, projectName, ref, ref1;
      modPaths = [];
      for (j = 0, len = paths.length; j < len; j++) {
        p = paths[j];
        ref = atom.project.getPaths();
        for (k = 0, len1 = ref.length; k < len1; k++) {
          project = ref[k];
          ref1 = project.split(path.sep), projectName = ref1[ref1.length - 1];
          p = p.replace(/\$PROJECT_NAME/i, projectName);
          p = p.replace(/\$PROJECT/i, project);
          if (indexOf.call(modPaths, p) < 0) {
            modPaths.push(p);
          }
        }
      }
      return modPaths;
    },
    getInterpreter: function() {
      var envPath, f, interpreters, j, k, len, len1, p, project, ref, ref1, userDefinedPythonPaths;
      userDefinedPythonPaths = this.applySubstitutions(atom.config.get('autocomplete-python.pythonPaths').split(';'));
      interpreters = new Set((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = userDefinedPythonPaths.length; j < len; j++) {
          p = userDefinedPythonPaths[j];
          if (this.isBinary(p)) {
            results.push(p);
          }
        }
        return results;
      }).call(this));
      if (interpreters.size > 0) {
        log.debug('User defined interpreters found', interpreters);
        return interpreters.keys().next().value;
      }
      log.debug('No user defined interpreter found, trying automatic lookup');
      interpreters = new Set();
      ref = atom.project.getPaths();
      for (j = 0, len = ref.length; j < len; j++) {
        project = ref[j];
        ref1 = this.readDir(project);
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          f = ref1[k];
          this.lookupInterpreters(path.join(project, f, 'bin')).forEach(function(i) {
            return interpreters.add(i);
          });
        }
      }
      log.debug('Project level interpreters found', interpreters);
      envPath = (process.env.PATH || '').split(path.delimiter);
      envPath = new Set(envPath.concat(this.possibleGlobalPythonPaths()));
      envPath.forEach((function(_this) {
        return function(potentialPath) {
          return _this.lookupInterpreters(potentialPath).forEach(function(i) {
            return interpreters.add(i);
          });
        };
      })(this));
      log.debug('Total automatically found interpreters', interpreters);
      if (interpreters.size > 0) {
        return interpreters.keys().next().value;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9pbnRlcnByZXRlcnMtbG9va3VwLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsaUJBQUE7SUFBQTs7RUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVI7O0VBQ0wsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxHQUFBLEdBQU0sT0FBQSxDQUFRLE9BQVI7O0VBRU4sTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLGtCQUFBLEVBQW9CLFNBQUE7TUFDbEIsSUFBRyxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQU8sQ0FBQyxRQUFwQixDQUFIO0FBQ0UsZUFBTyw2QkFEVDtPQUFBLE1BQUE7QUFHRSxlQUFPLHdCQUhUOztJQURrQixDQUFwQjtJQU1BLHlCQUFBLEVBQTJCLFNBQUE7TUFDekIsSUFBRyxNQUFNLENBQUMsSUFBUCxDQUFZLE9BQU8sQ0FBQyxRQUFwQixDQUFIO0FBQ0UsZUFBTyxDQUNMLGVBREssRUFFTCxlQUZLLEVBR0wsZUFISyxFQUlMLHFDQUpLLEVBS0wscUNBTEssRUFNTCxxQ0FOSyxFQU9MLHFDQVBLLEVBUUwscUNBUkssRUFTTCxxQ0FUSyxFQVVMLCtCQVZLLEVBV0wsK0JBWEssRUFZTCwrQkFaSyxFQWFILENBQUMsRUFBRSxDQUFDLE9BQUgsQ0FBQSxDQUFELENBQUEsR0FBYyxpREFiWCxFQURUO09BQUEsTUFBQTtBQWlCRSxlQUFPLENBQUMsZ0JBQUQsRUFBbUIsVUFBbkIsRUFBK0IsTUFBL0IsRUFBdUMsV0FBdkMsRUFBb0QsT0FBcEQsRUFqQlQ7O0lBRHlCLENBTjNCO0lBMEJBLE9BQUEsRUFBUyxTQUFDLE9BQUQ7QUFDUDtBQUNFLGVBQU8sRUFBRSxDQUFDLFdBQUgsQ0FBZSxPQUFmLEVBRFQ7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QUFmLENBQUo7TUFDZCxPQUFPLENBQUMsT0FBUixDQUFnQixDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUMsYUFBRDtpQkFDZCxLQUFDLENBQUEsa0JBQUQsQ0FBb0IsYUFBcEIsQ0FBa0MsQ0FBQyxPQUFuQyxDQUEyQyxTQUFDLENBQUQ7bUJBQ3pDLFlBQVksQ0FBQyxHQUFiLENBQWlCLENBQWpCO1VBRHlDLENBQTNDO1FBRGM7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhCO01BR0EsR0FBRyxDQUFDLEtBQUosQ0FBVSx3Q0FBVixFQUFvRCxZQUFwRDtNQUVBLElBQUcsWUFBWSxDQUFDLElBQWIsR0FBb0IsQ0FBdkI7QUFDRSxlQUFPLFlBQVksQ0FBQyxJQUFiLENBQUEsQ0FBbUIsQ0FBQyxJQUFwQixDQUFBLENBQTBCLENBQUMsTUFEcEM7O0lBdkJjLENBNURoQjs7QUFORiIsInNvdXJjZXNDb250ZW50IjpbImZzID0gcmVxdWlyZSAnZnMnXG5vcyA9IHJlcXVpcmUgJ29zJ1xucGF0aCA9IHJlcXVpcmUgJ3BhdGgnXG5sb2cgPSByZXF1aXJlICcuL2xvZydcblxubW9kdWxlLmV4cG9ydHMgPVxuICBweXRob25FeGVjdXRhYmxlUmU6IC0+XG4gICAgaWYgL153aW4vLnRlc3QgcHJvY2Vzcy5wbGF0Zm9ybVxuICAgICAgcmV0dXJuIC9ecHl0aG9uKFxcZCsoLlxcZCspPyk/XFwuZXhlJC9cbiAgICBlbHNlXG4gICAgICByZXR1cm4gL15weXRob24oXFxkKyguXFxkKyk/KT8kL1xuXG4gIHBvc3NpYmxlR2xvYmFsUHl0aG9uUGF0aHM6IC0+XG4gICAgaWYgL153aW4vLnRlc3QgcHJvY2Vzcy5wbGF0Zm9ybVxuICAgICAgcmV0dXJuIFtcbiAgICAgICAgJ0M6XFxcXFB5dGhvbjIuNydcbiAgICAgICAgJ0M6XFxcXFB5dGhvbjMuNCdcbiAgICAgICAgJ0M6XFxcXFB5dGhvbjMuNSdcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg4NilcXFxcUHl0aG9uIDIuNydcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg4NilcXFxcUHl0aG9uIDMuNCdcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg4NilcXFxcUHl0aG9uIDMuNSdcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg2NClcXFxcUHl0aG9uIDIuNydcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg2NClcXFxcUHl0aG9uIDMuNCdcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXMgKHg2NClcXFxcUHl0aG9uIDMuNSdcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXNcXFxcUHl0aG9uIDIuNydcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXNcXFxcUHl0aG9uIDMuNCdcbiAgICAgICAgJ0M6XFxcXFByb2dyYW0gRmlsZXNcXFxcUHl0aG9uIDMuNSdcbiAgICAgICAgXCIje29zLmhvbWVkaXIoKX1cXFxcQXBwRGF0YVxcXFxMb2NhbFxcXFxQcm9ncmFtc1xcXFxQeXRob25cXFxcUHl0aG9uMzUtMzJcIlxuICAgICAgXVxuICAgIGVsc2VcbiAgICAgIHJldHVybiBbJy91c3IvbG9jYWwvYmluJywgJy91c3IvYmluJywgJy9iaW4nLCAnL3Vzci9zYmluJywgJy9zYmluJ11cblxuICByZWFkRGlyOiAoZGlyUGF0aCkgLT5cbiAgICB0cnlcbiAgICAgIHJldHVybiBmcy5yZWFkZGlyU3luYyBkaXJQYXRoXG4gICAgY2F0Y2hcbiAgICAgIHJldHVybiBbXVxuXG4gIGlzQmluYXJ5OiAoZmlsZVBhdGgpIC0+XG4gICAgdHJ5XG4gICAgICBmcy5hY2Nlc3NTeW5jIGZpbGVQYXRoLCBmcy5YX09LXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGNhdGNoXG4gICAgICByZXR1cm4gZmFsc2VcblxuICBsb29rdXBJbnRlcnByZXRlcnM6IChkaXJQYXRoKSAtPlxuICAgIGludGVycHJldGVycyA9IG5ldyBTZXQoKVxuICAgIGZpbGVzID0gQHJlYWREaXIoZGlyUGF0aClcbiAgICBtYXRjaGVzID0gKGYgZm9yIGYgaW4gZmlsZXMgd2hlbiBAcHl0aG9uRXhlY3V0YWJsZVJlKCkudGVzdChmKSlcbiAgICBmb3IgZmlsZU5hbWUgaW4gbWF0Y2hlc1xuICAgICAgcG90ZW50aWFsSW50ZXJwcmV0ZXIgPSBwYXRoLmpvaW4oZGlyUGF0aCwgZmlsZU5hbWUpXG4gICAgICBpZiBAaXNCaW5hcnkocG90ZW50aWFsSW50ZXJwcmV0ZXIpXG4gICAgICAgIGludGVycHJldGVycy5hZGQocG90ZW50aWFsSW50ZXJwcmV0ZXIpXG4gICAgcmV0dXJuIGludGVycHJldGVyc1xuXG4gIGFwcGx5U3Vic3RpdHV0aW9uczogKHBhdGhzKSAtPlxuICAgIG1vZFBhdGhzID0gW11cbiAgICBmb3IgcCBpbiBwYXRoc1xuICAgICAgZm9yIHByb2plY3QgaW4gYXRvbS5wcm9qZWN0LmdldFBhdGhzKClcbiAgICAgICAgWy4uLiwgcHJvamVjdE5hbWVdID0gcHJvamVjdC5zcGxpdChwYXRoLnNlcClcbiAgICAgICAgcCA9IHAucmVwbGFjZSgvXFwkUFJPSkVDVF9OQU1FL2ksIHByb2plY3ROYW1lKVxuICAgICAgICBwID0gcC5yZXBsYWNlKC9cXCRQUk9KRUNUL2ksIHByb2plY3QpXG4gICAgICAgIGlmIHAgbm90IGluIG1vZFBhdGhzXG4gICAgICAgICAgbW9kUGF0aHMucHVzaCBwXG4gICAgcmV0dXJuIG1vZFBhdGhzXG5cbiAgZ2V0SW50ZXJwcmV0ZXI6IC0+XG4gICAgdXNlckRlZmluZWRQeXRob25QYXRocyA9IEBhcHBseVN1YnN0aXR1dGlvbnMoXG4gICAgICBhdG9tLmNvbmZpZy5nZXQoJ2F1dG9jb21wbGV0ZS1weXRob24ucHl0aG9uUGF0aHMnKS5zcGxpdCgnOycpKVxuICAgIGludGVycHJldGVycyA9IG5ldyBTZXQocCBmb3IgcCBpbiB1c2VyRGVmaW5lZFB5dGhvblBhdGhzIHdoZW4gQGlzQmluYXJ5KHApKVxuICAgIGlmIGludGVycHJldGVycy5zaXplID4gMFxuICAgICAgbG9nLmRlYnVnICdVc2VyIGRlZmluZWQgaW50ZXJwcmV0ZXJzIGZvdW5kJywgaW50ZXJwcmV0ZXJzXG4gICAgICByZXR1cm4gaW50ZXJwcmV0ZXJzLmtleXMoKS5uZXh0KCkudmFsdWVcblxuICAgIGxvZy5kZWJ1ZyAnTm8gdXNlciBkZWZpbmVkIGludGVycHJldGVyIGZvdW5kLCB0cnlpbmcgYXV0b21hdGljIGxvb2t1cCdcbiAgICBpbnRlcnByZXRlcnMgPSBuZXcgU2V0KClcblxuICAgIGZvciBwcm9qZWN0IGluIGF0b20ucHJvamVjdC5nZXRQYXRocygpXG4gICAgICBmb3IgZiBpbiBAcmVhZERpcihwcm9qZWN0KVxuICAgICAgICBAbG9va3VwSW50ZXJwcmV0ZXJzKHBhdGguam9pbihwcm9qZWN0LCBmLCAnYmluJykpLmZvckVhY2ggKGkpIC0+XG4gICAgICAgICAgaW50ZXJwcmV0ZXJzLmFkZChpKVxuICAgIGxvZy5kZWJ1ZyAnUHJvamVjdCBsZXZlbCBpbnRlcnByZXRlcnMgZm91bmQnLCBpbnRlcnByZXRlcnNcbiAgICBlbnZQYXRoID0gKHByb2Nlc3MuZW52LlBBVEggb3IgJycpLnNwbGl0IHBhdGguZGVsaW1pdGVyXG4gICAgZW52UGF0aCA9IG5ldyBTZXQoZW52UGF0aC5jb25jYXQoQHBvc3NpYmxlR2xvYmFsUHl0aG9uUGF0aHMoKSkpXG4gICAgZW52UGF0aC5mb3JFYWNoIChwb3RlbnRpYWxQYXRoKSA9PlxuICAgICAgQGxvb2t1cEludGVycHJldGVycyhwb3RlbnRpYWxQYXRoKS5mb3JFYWNoIChpKSAtPlxuICAgICAgICBpbnRlcnByZXRlcnMuYWRkKGkpXG4gICAgbG9nLmRlYnVnICdUb3RhbCBhdXRvbWF0aWNhbGx5IGZvdW5kIGludGVycHJldGVycycsIGludGVycHJldGVyc1xuXG4gICAgaWYgaW50ZXJwcmV0ZXJzLnNpemUgPiAwXG4gICAgICByZXR1cm4gaW50ZXJwcmV0ZXJzLmtleXMoKS5uZXh0KCkudmFsdWVcbiJdfQ==
