
/*
Global Logger
 */

(function() {
  module.exports = (function() {
    var Emitter, emitter, levels, stream, winston, writable;
    Emitter = require('event-kit').Emitter;
    emitter = new Emitter();
    winston = require('winston');
    stream = require('stream');
    writable = new stream.Writable();
    writable._write = function(chunk, encoding, next) {
      var msg;
      msg = chunk.toString();
      emitter.emit('logging', msg);
      return next();
    };
    levels = {
      silly: 0,
      input: 1,
      verbose: 2,
      prompt: 3,
      debug: 4,
      info: 5,
      data: 6,
      help: 7,
      warn: 8,
      error: 9
    };
    return function(label) {
      var i, len, logger, loggerMethods, method, transport, wlogger;
      transport = new winston.transports.File({
        label: label,
        level: 'debug',
        timestamp: true,
        stream: writable,
        json: false
      });
      wlogger = new winston.Logger({
        transports: [transport]
      });
      wlogger.on('logging', function(transport, level, msg, meta) {
        var d, levelNum, loggerLevel, loggerLevelNum, path, ref;
        loggerLevel = (ref = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify.general.loggerLevel') : void 0) != null ? ref : "warn";
        loggerLevelNum = levels[loggerLevel];
        levelNum = levels[level];
        if (loggerLevelNum <= levelNum) {
          path = require('path');
          label = "" + (path.dirname(transport.label).split(path.sep).reverse()[0]) + path.sep + (path.basename(transport.label));
          d = new Date();
          return console.log((d.toLocaleDateString()) + " " + (d.toLocaleTimeString()) + " - " + label + " [" + level + "]: " + msg, meta);
        }
      });
      loggerMethods = ['silly', 'debug', 'verbose', 'info', 'warn', 'error'];
      logger = {};
      for (i = 0, len = loggerMethods.length; i < len; i++) {
        method = loggerMethods[i];
        logger[method] = wlogger[method];
      }
      logger.onLogging = function(handler) {
        var subscription;
        subscription = emitter.on('logging', handler);
        return subscription;
      };
      return logger;
    };
  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sb2dnZXIuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztBQUFBO0VBR0EsTUFBTSxDQUFDLE9BQVAsR0FBb0IsQ0FBQSxTQUFBO0FBRWxCLFFBQUE7SUFBQyxVQUFXLE9BQUEsQ0FBUSxXQUFSO0lBQ1osT0FBQSxHQUFjLElBQUEsT0FBQSxDQUFBO0lBR2QsT0FBQSxHQUFVLE9BQUEsQ0FBUSxTQUFSO0lBQ1YsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSO0lBQ1QsUUFBQSxHQUFlLElBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBQTtJQUNmLFFBQVEsQ0FBQyxNQUFULEdBQWtCLFNBQUMsS0FBRCxFQUFRLFFBQVIsRUFBa0IsSUFBbEI7QUFDaEIsVUFBQTtNQUFBLEdBQUEsR0FBTSxLQUFLLENBQUMsUUFBTixDQUFBO01BRU4sT0FBTyxDQUFDLElBQVIsQ0FBYSxTQUFiLEVBQXdCLEdBQXhCO2FBQ0EsSUFBQSxDQUFBO0lBSmdCO0lBTWxCLE1BQUEsR0FBUztNQUNQLEtBQUEsRUFBTyxDQURBO01BRVAsS0FBQSxFQUFPLENBRkE7TUFHUCxPQUFBLEVBQVMsQ0FIRjtNQUlQLE1BQUEsRUFBUSxDQUpEO01BS1AsS0FBQSxFQUFPLENBTEE7TUFNUCxJQUFBLEVBQU0sQ0FOQztNQU9QLElBQUEsRUFBTSxDQVBDO01BUVAsSUFBQSxFQUFNLENBUkM7TUFTUCxJQUFBLEVBQU0sQ0FUQztNQVVQLEtBQUEsRUFBTyxDQVZBOztBQWFULFdBQU8sU0FBQyxLQUFEO0FBQ0wsVUFBQTtNQUFBLFNBQUEsR0FBZ0IsSUFBQyxPQUFPLENBQUMsVUFBVSxDQUFDLElBQXBCLENBQTBCO1FBQ3hDLEtBQUEsRUFBTyxLQURpQztRQUV4QyxLQUFBLEVBQU8sT0FGaUM7UUFHeEMsU0FBQSxFQUFXLElBSDZCO1FBTXhDLE1BQUEsRUFBUSxRQU5nQztRQU94QyxJQUFBLEVBQU0sS0FQa0M7T0FBMUI7TUFVaEIsT0FBQSxHQUFjLElBQUMsT0FBTyxDQUFDLE1BQVQsQ0FBaUI7UUFFN0IsVUFBQSxFQUFZLENBQ1YsU0FEVSxDQUZpQjtPQUFqQjtNQU1kLE9BQU8sQ0FBQyxFQUFSLENBQVcsU0FBWCxFQUFzQixTQUFDLFNBQUQsRUFBWSxLQUFaLEVBQW1CLEdBQW5CLEVBQXdCLElBQXhCO0FBQ3BCLFlBQUE7UUFBQSxXQUFBLHdJQUN5QztRQUV6QyxjQUFBLEdBQWlCLE1BQU8sQ0FBQSxXQUFBO1FBQ3hCLFFBQUEsR0FBVyxNQUFPLENBQUEsS0FBQTtRQUNsQixJQUFHLGNBQUEsSUFBa0IsUUFBckI7VUFDRSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVI7VUFDUCxLQUFBLEdBQVEsRUFBQSxHQUFFLENBQUMsSUFBSSxDQUFDLE9BQUwsQ0FBYSxTQUFTLENBQUMsS0FBdkIsQ0FDQyxDQUFDLEtBREYsQ0FDUSxJQUFJLENBQUMsR0FEYixDQUNpQixDQUFDLE9BRGxCLENBQUEsQ0FDNEIsQ0FBQSxDQUFBLENBRDdCLENBQUYsR0FFTSxJQUFJLENBQUMsR0FGWCxHQUVnQixDQUFDLElBQUksQ0FBQyxRQUFMLENBQWMsU0FBUyxDQUFDLEtBQXhCLENBQUQ7VUFDeEIsQ0FBQSxHQUFRLElBQUEsSUFBQSxDQUFBO2lCQUNSLE9BQU8sQ0FBQyxHQUFSLENBQWMsQ0FBQyxDQUFDLENBQUMsa0JBQUYsQ0FBQSxDQUFELENBQUEsR0FBd0IsR0FBeEIsR0FBMEIsQ0FBQyxDQUFDLENBQUMsa0JBQUYsQ0FBQSxDQUFELENBQTFCLEdBQWtELEtBQWxELEdBQXVELEtBQXZELEdBQTZELElBQTdELEdBQWlFLEtBQWpFLEdBQXVFLEtBQXZFLEdBQTRFLEdBQTFGLEVBQWlHLElBQWpHLEVBTkY7O01BTm9CLENBQXRCO01BZUEsYUFBQSxHQUFnQixDQUFDLE9BQUQsRUFBUyxPQUFULEVBQWlCLFNBQWpCLEVBQTJCLE1BQTNCLEVBQWtDLE1BQWxDLEVBQXlDLE9BQXpDO01BQ2hCLE1BQUEsR0FBUztBQUNULFdBQUEsK0NBQUE7O1FBQ0UsTUFBTyxDQUFBLE1BQUEsQ0FBUCxHQUFpQixPQUFRLENBQUEsTUFBQTtBQUQzQjtNQUdBLE1BQU0sQ0FBQyxTQUFQLEdBQW1CLFNBQUMsT0FBRDtBQUVqQixZQUFBO1FBQUEsWUFBQSxHQUFlLE9BQU8sQ0FBQyxFQUFSLENBQVcsU0FBWCxFQUFzQixPQUF0QjtBQUVmLGVBQU87TUFKVTtBQU1uQixhQUFPO0lBM0NGO0VBNUJXLENBQUEsQ0FBSCxDQUFBO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiIyMjXG5HbG9iYWwgTG9nZ2VyXG4jIyNcbm1vZHVsZS5leHBvcnRzID0gZG8gLT5cbiAgIyBDcmVhdGUgRXZlbnQgRW1pdHRlclxuICB7RW1pdHRlcn0gPSByZXF1aXJlICdldmVudC1raXQnXG4gIGVtaXR0ZXIgPSBuZXcgRW1pdHRlcigpXG4gICMgQ3JlYXRlIFRyYW5zcG9ydCB3aXRoIFdyaXRhYmxlIFN0cmVhbVxuICAjIFNlZSBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yMTU4MzgzMS8yNTc4MjA1XG4gIHdpbnN0b24gPSByZXF1aXJlKCd3aW5zdG9uJylcbiAgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJylcbiAgd3JpdGFibGUgPSBuZXcgc3RyZWFtLldyaXRhYmxlKClcbiAgd3JpdGFibGUuX3dyaXRlID0gKGNodW5rLCBlbmNvZGluZywgbmV4dCkgLT5cbiAgICBtc2cgPSBjaHVuay50b1N0cmluZygpXG4gICAgIyBjb25zb2xlLmxvZyhtc2cpXG4gICAgZW1pdHRlci5lbWl0KCdsb2dnaW5nJywgbXNnKVxuICAgIG5leHQoKVxuXG4gIGxldmVscyA9IHtcbiAgICBzaWxseTogMCxcbiAgICBpbnB1dDogMSxcbiAgICB2ZXJib3NlOiAyLFxuICAgIHByb21wdDogMyxcbiAgICBkZWJ1ZzogNCxcbiAgICBpbmZvOiA1LFxuICAgIGRhdGE6IDYsXG4gICAgaGVscDogNyxcbiAgICB3YXJuOiA4LFxuICAgIGVycm9yOiA5XG4gIH1cblxuICByZXR1cm4gKGxhYmVsKSAtPlxuICAgIHRyYW5zcG9ydCA9IG5ldyAod2luc3Rvbi50cmFuc3BvcnRzLkZpbGUpKHtcbiAgICAgIGxhYmVsOiBsYWJlbFxuICAgICAgbGV2ZWw6ICdkZWJ1ZydcbiAgICAgIHRpbWVzdGFtcDogdHJ1ZVxuICAgICAgIyBwcmV0dHlQcmludDogdHJ1ZVxuICAgICAgIyBjb2xvcml6ZTogdHJ1ZVxuICAgICAgc3RyZWFtOiB3cml0YWJsZVxuICAgICAganNvbjogZmFsc2VcbiAgICB9KVxuICAgICMgSW5pdGlhbGl6ZSBsb2dnZXJcbiAgICB3bG9nZ2VyID0gbmV3ICh3aW5zdG9uLkxvZ2dlcikoe1xuICAgICAgIyBDb25maWd1cmUgdHJhbnNwb3J0c1xuICAgICAgdHJhbnNwb3J0czogW1xuICAgICAgICB0cmFuc3BvcnRcbiAgICAgIF1cbiAgICB9KVxuICAgIHdsb2dnZXIub24oJ2xvZ2dpbmcnLCAodHJhbnNwb3J0LCBsZXZlbCwgbXNnLCBtZXRhKS0+XG4gICAgICBsb2dnZXJMZXZlbCA9IGF0b20/LmNvbmZpZy5nZXQoXFxcbiAgICAgICAgJ2F0b20tYmVhdXRpZnkuZ2VuZXJhbC5sb2dnZXJMZXZlbCcpID8gXCJ3YXJuXCJcbiAgICAgICMgY29uc29sZS5sb2coJ2xvZ2dpbmcnLCBsb2dnZXJMZXZlbCwgYXJndW1lbnRzKVxuICAgICAgbG9nZ2VyTGV2ZWxOdW0gPSBsZXZlbHNbbG9nZ2VyTGV2ZWxdXG4gICAgICBsZXZlbE51bSA9IGxldmVsc1tsZXZlbF1cbiAgICAgIGlmIGxvZ2dlckxldmVsTnVtIDw9IGxldmVsTnVtXG4gICAgICAgIHBhdGggPSByZXF1aXJlKCdwYXRoJylcbiAgICAgICAgbGFiZWwgPSBcIiN7cGF0aC5kaXJuYW1lKHRyYW5zcG9ydC5sYWJlbClcXFxuICAgICAgICAgICAgICAgICAgICAuc3BsaXQocGF0aC5zZXApLnJldmVyc2UoKVswXX1cXFxuICAgICAgICAgICAgICAgICAgICAje3BhdGguc2VwfSN7cGF0aC5iYXNlbmFtZSh0cmFuc3BvcnQubGFiZWwpfVwiXG4gICAgICAgIGQgPSBuZXcgRGF0ZSgpXG4gICAgICAgIGNvbnNvbGUubG9nKFwiI3tkLnRvTG9jYWxlRGF0ZVN0cmluZygpfSAje2QudG9Mb2NhbGVUaW1lU3RyaW5nKCl9IC0gI3tsYWJlbH0gWyN7bGV2ZWx9XTogI3ttc2d9XCIsIG1ldGEpXG4gICAgKVxuICAgICMgRXhwb3J0IGxvZ2dlciBtZXRob2RzXG4gICAgbG9nZ2VyTWV0aG9kcyA9IFsnc2lsbHknLCdkZWJ1ZycsJ3ZlcmJvc2UnLCdpbmZvJywnd2FybicsJ2Vycm9yJ11cbiAgICBsb2dnZXIgPSB7fVxuICAgIGZvciBtZXRob2QgaW4gbG9nZ2VyTWV0aG9kc1xuICAgICAgbG9nZ2VyW21ldGhvZF0gPSB3bG9nZ2VyW21ldGhvZF1cbiAgICAjIEFkZCBsb2dnZXIgbGlzdGVuZXJcbiAgICBsb2dnZXIub25Mb2dnaW5nID0gKGhhbmRsZXIpIC0+XG4gICAgICAjIGNvbnNvbGUubG9nKCdvbkxvZ2dpbmcnLCBoYW5kbGVyKVxuICAgICAgc3Vic2NyaXB0aW9uID0gZW1pdHRlci5vbignbG9nZ2luZycsIGhhbmRsZXIpXG4gICAgICAjIGNvbnNvbGUubG9nKCdlbWl0dGVyJywgZW1pdHRlci5oYW5kbGVyc0J5RXZlbnROYW1lLCBzdWJzY3JpcHRpb24pXG4gICAgICByZXR1cm4gc3Vic2NyaXB0aW9uXG4gICAgIyBSZXR1cm4gc2ltcGxpZmllZCBsb2dnZXJcbiAgICByZXR1cm4gbG9nZ2VyXG4iXX0=
