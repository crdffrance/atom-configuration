
/*
 */

(function() {
  "use strict";
  var Beautifier, Gherkin, Lexer, logger,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  Lexer = require('gherkin').Lexer('en');

  logger = require('../logger')(__filename);

  module.exports = Gherkin = (function(superClass) {
    extend(Gherkin, superClass);

    function Gherkin() {
      return Gherkin.__super__.constructor.apply(this, arguments);
    }

    Gherkin.prototype.name = "Gherkin formatter";

    Gherkin.prototype.link = "https://github.com/Glavin001/atom-beautify/blob/master/src/beautifiers/gherkin.coffee";

    Gherkin.prototype.options = {
      gherkin: true
    };

    Gherkin.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var i, len, lexer, line, loggerLevel, recorder, ref;
        recorder = {
          lines: [],
          tags: [],
          comments: [],
          last_obj: null,
          indent_to: function(indent_level) {
            if (indent_level == null) {
              indent_level = 0;
            }
            return options.indent_char.repeat(options.indent_size * indent_level);
          },
          write_blank: function() {
            return this.lines.push('');
          },
          write_indented: function(content, indent) {
            var i, len, line, ref, results;
            if (indent == null) {
              indent = 0;
            }
            ref = content.trim().split("\n");
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              line = ref[i];
              results.push(this.lines.push("" + (this.indent_to(indent)) + (line.trim())));
            }
            return results;
          },
          write_comments: function(indent) {
            var comment, i, len, ref, results;
            if (indent == null) {
              indent = 0;
            }
            ref = this.comments.splice(0, this.comments.length);
            results = [];
            for (i = 0, len = ref.length; i < len; i++) {
              comment = ref[i];
              results.push(this.write_indented(comment, indent));
            }
            return results;
          },
          write_tags: function(indent) {
            if (indent == null) {
              indent = 0;
            }
            if (this.tags.length > 0) {
              return this.write_indented(this.tags.splice(0, this.tags.length).join(' '), indent);
            }
          },
          comment: function(value, line) {
            logger.verbose({
              token: 'comment',
              value: value.trim(),
              line: line
            });
            return this.comments.push(value);
          },
          tag: function(value, line) {
            logger.verbose({
              token: 'tag',
              value: value,
              line: line
            });
            return this.tags.push(value);
          },
          feature: function(keyword, name, description, line) {
            logger.verbose({
              token: 'feature',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_comments(0);
            this.write_tags(0);
            this.write_indented(keyword + ": " + name, '');
            if (description) {
              return this.write_indented(description, 1);
            }
          },
          background: function(keyword, name, description, line) {
            logger.verbose({
              token: 'background',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_indented(keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario: function(keyword, name, description, line) {
            logger.verbose({
              token: 'scenario',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented(keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          scenario_outline: function(keyword, name, description, line) {
            logger.verbose({
              token: 'outline',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(1);
            this.write_tags(1);
            this.write_indented(keyword + ": " + name, 1);
            if (description) {
              return this.write_indented(description, 2);
            }
          },
          examples: function(keyword, name, description, line) {
            logger.verbose({
              token: 'examples',
              keyword: keyword,
              name: name,
              description: description,
              line: line
            });
            this.write_blank();
            this.write_comments(2);
            this.write_tags(2);
            this.write_indented(keyword + ": " + name, 2);
            if (description) {
              return this.write_indented(description, 3);
            }
          },
          step: function(keyword, name, line) {
            logger.verbose({
              token: 'step',
              keyword: keyword,
              name: name,
              line: line
            });
            this.write_comments(2);
            return this.write_indented("" + keyword + name, 2);
          },
          doc_string: function(content_type, string, line) {
            var three_quotes;
            logger.verbose({
              token: 'doc_string',
              content_type: content_type,
              string: string,
              line: line
            });
            three_quotes = '"""';
            this.write_comments(2);
            return this.write_indented("" + three_quotes + content_type + "\n" + string + "\n" + three_quotes, 3);
          },
          row: function(cells, line) {
            logger.verbose({
              token: 'row',
              cells: cells,
              line: line
            });
            this.write_comments(3);
            return this.write_indented("| " + (cells.join(' | ')) + " |", 3);
          },
          eof: function() {
            logger.verbose({
              token: 'eof'
            });
            return this.write_comments(2);
          }
        };
        lexer = new Lexer(recorder);
        lexer.scan(text);
        loggerLevel = typeof atom !== "undefined" && atom !== null ? atom.config.get('atom-beautify.general.loggerLevel') : void 0;
        if (loggerLevel === 'verbose') {
          ref = recorder.lines;
          for (i = 0, len = ref.length; i < len; i++) {
            line = ref[i];
            logger.verbose("> " + line);
          }
        }
        return resolve(recorder.lines.join("\n"));
      });
    };

    return Gherkin;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9naGVya2luLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7OztBQUFBO0VBR0E7QUFIQSxNQUFBLGtDQUFBO0lBQUE7OztFQUlBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFDYixLQUFBLEdBQVEsT0FBQSxDQUFRLFNBQVIsQ0FBa0IsQ0FBQyxLQUFuQixDQUF5QixJQUF6Qjs7RUFDUixNQUFBLEdBQVMsT0FBQSxDQUFRLFdBQVIsQ0FBQSxDQUFxQixVQUFyQjs7RUFFVCxNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztzQkFDckIsSUFBQSxHQUFNOztzQkFDTixJQUFBLEdBQU07O3NCQUVOLE9BQUEsR0FBUztNQUNQLE9BQUEsRUFBUyxJQURGOzs7c0JBSVQsUUFBQSxHQUFVLFNBQUMsSUFBRCxFQUFPLFFBQVAsRUFBaUIsT0FBakI7QUFDUixhQUFXLElBQUEsSUFBQyxDQUFBLE9BQUQsQ0FBUyxTQUFDLE9BQUQsRUFBVSxNQUFWO0FBQ2xCLFlBQUE7UUFBQSxRQUFBLEdBQVc7VUFDVCxLQUFBLEVBQU8sRUFERTtVQUVULElBQUEsRUFBTSxFQUZHO1VBR1QsUUFBQSxFQUFVLEVBSEQ7VUFLVCxRQUFBLEVBQVUsSUFMRDtVQU9ULFNBQUEsRUFBVyxTQUFDLFlBQUQ7O2NBQUMsZUFBZTs7QUFDekIsbUJBQU8sT0FBTyxDQUFDLFdBQVcsQ0FBQyxNQUFwQixDQUEyQixPQUFPLENBQUMsV0FBUixHQUFzQixZQUFqRDtVQURFLENBUEY7VUFVVCxXQUFBLEVBQWEsU0FBQTttQkFDWCxJQUFDLENBQUEsS0FBSyxDQUFDLElBQVAsQ0FBWSxFQUFaO1VBRFcsQ0FWSjtVQWFULGNBQUEsRUFBZ0IsU0FBQyxPQUFELEVBQVUsTUFBVjtBQUNkLGdCQUFBOztjQUR3QixTQUFTOztBQUNqQztB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QyxZQUE5RCxFQUE4RSxDQUE5RTtVQUxVLENBbEZIO1VBeUZULEdBQUEsRUFBSyxTQUFDLEtBQUQsRUFBUSxJQUFSO1lBQ0gsTUFBTSxDQUFDLE9BQVAsQ0FBZTtjQUFDLEtBQUEsRUFBTyxLQUFSO2NBQWUsS0FBQSxFQUFPLEtBQXRCO2NBQTZCLElBQUEsRUFBTSxJQUFuQzthQUFmO1lBSUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsQ0FBaEI7bUJBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsSUFBQSxHQUFJLENBQUMsS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFYLENBQUQsQ0FBSixHQUF1QixJQUF2QyxFQUE0QyxDQUE1QztVQU5HLENBekZJO1VBaUdULEdBQUEsRUFBSyxTQUFBO1lBQ0gsTUFBTSxDQUFDLE9BQVAsQ0FBZTtjQUFDLEtBQUEsRUFBTyxLQUFSO2FBQWY7bUJBRUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsQ0FBaEI7VUFIRyxDQWpHSTs7UUF1R1gsS0FBQSxHQUFZLElBQUEsS0FBQSxDQUFNLFFBQU47UUFDWixLQUFLLENBQUMsSUFBTixDQUFXLElBQVg7UUFFQSxXQUFBLGtEQUFjLElBQUksQ0FBRSxNQUFNLENBQUMsR0FBYixDQUFpQixtQ0FBakI7UUFDZCxJQUFHLFdBQUEsS0FBZSxTQUFsQjtBQUNFO0FBQUEsZUFBQSxxQ0FBQTs7WUFDRSxNQUFNLENBQUMsT0FBUCxDQUFlLElBQUEsR0FBSyxJQUFwQjtBQURGLFdBREY7O2VBSUEsT0FBQSxDQUFRLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBZixDQUFvQixJQUFwQixDQUFSO01BaEhrQixDQUFUO0lBREg7Ozs7S0FSMkI7QUFSdkMiLCJzb3VyY2VzQ29udGVudCI6WyIjIyNcbiMjI1xuXG5cInVzZSBzdHJpY3RcIlxuQmVhdXRpZmllciA9IHJlcXVpcmUoJy4vYmVhdXRpZmllcicpXG5MZXhlciA9IHJlcXVpcmUoJ2doZXJraW4nKS5MZXhlcignZW4nKVxubG9nZ2VyID0gcmVxdWlyZSgnLi4vbG9nZ2VyJykoX19maWxlbmFtZSlcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBHaGVya2luIGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkdoZXJraW4gZm9ybWF0dGVyXCJcbiAgbGluazogXCJodHRwczovL2dpdGh1Yi5jb20vR2xhdmluMDAxL2F0b20tYmVhdXRpZnkvYmxvYi9tYXN0ZXIvc3JjL2JlYXV0aWZpZXJzL2doZXJraW4uY29mZmVlXCJcblxuICBvcHRpb25zOiB7XG4gICAgZ2hlcmtpbjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICByZWNvcmRlciA9IHtcbiAgICAgICAgbGluZXM6IFtdXG4gICAgICAgIHRhZ3M6IFtdXG4gICAgICAgIGNvbW1lbnRzOiBbXVxuXG4gICAgICAgIGxhc3Rfb2JqOiBudWxsXG5cbiAgICAgICAgaW5kZW50X3RvOiAoaW5kZW50X2xldmVsID0gMCkgLT5cbiAgICAgICAgICByZXR1cm4gb3B0aW9ucy5pbmRlbnRfY2hhci5yZXBlYXQob3B0aW9ucy5pbmRlbnRfc2l6ZSAqIGluZGVudF9sZXZlbClcblxuICAgICAgICB3cml0ZV9ibGFuazogKCkgLT5cbiAgICAgICAgICBAbGluZXMucHVzaCgnJylcblxuICAgICAgICB3cml0ZV9pbmRlbnRlZDogKGNvbnRlbnQsIGluZGVudCA9IDApIC0+XG4gICAgICAgICAgZm9yIGxpbmUgaW4gY29udGVudC50cmltKCkuc3BsaXQoXCJcXG5cIilcbiAgICAgICAgICAgIEBsaW5lcy5wdXNoKFwiI3tAaW5kZW50X3RvKGluZGVudCl9I3tsaW5lLnRyaW0oKX1cIilcblxuICAgICAgICB3cml0ZV9jb21tZW50czogKGluZGVudCA9IDApIC0+XG4gICAgICAgICAgZm9yIGNvbW1lbnQgaW4gQGNvbW1lbnRzLnNwbGljZSgwLCBAY29tbWVudHMubGVuZ3RoKVxuICAgICAgICAgICAgQHdyaXRlX2luZGVudGVkKGNvbW1lbnQsIGluZGVudClcblxuICAgICAgICB3cml0ZV90YWdzOiAoaW5kZW50ID0gMCkgLT5cbiAgICAgICAgICBpZiBAdGFncy5sZW5ndGggPiAwXG4gICAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoQHRhZ3Muc3BsaWNlKDAsIEB0YWdzLmxlbmd0aCkuam9pbignICcpLCBpbmRlbnQpXG5cbiAgICAgICAgY29tbWVudDogKHZhbHVlLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ2NvbW1lbnQnLCB2YWx1ZTogdmFsdWUudHJpbSgpLCBsaW5lOiBsaW5lfSlcbiAgICAgICAgICBAY29tbWVudHMucHVzaCh2YWx1ZSlcblxuICAgICAgICB0YWc6ICh2YWx1ZSwgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICd0YWcnLCB2YWx1ZTogdmFsdWUsIGxpbmU6IGxpbmV9KVxuICAgICAgICAgIEB0YWdzLnB1c2godmFsdWUpXG5cbiAgICAgICAgZmVhdHVyZTogKGtleXdvcmQsIG5hbWUsIGRlc2NyaXB0aW9uLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ2ZlYXR1cmUnLCBrZXl3b3JkOiBrZXl3b3JkLCBuYW1lOiBuYW1lLCBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb24sIGxpbmU6IGxpbmV9KVxuXG4gICAgICAgICAgQHdyaXRlX2NvbW1lbnRzKDApXG4gICAgICAgICAgQHdyaXRlX3RhZ3MoMClcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoXCIje2tleXdvcmR9OiAje25hbWV9XCIsICcnKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChkZXNjcmlwdGlvbiwgMSkgaWYgZGVzY3JpcHRpb25cblxuICAgICAgICBiYWNrZ3JvdW5kOiAoa2V5d29yZCwgbmFtZSwgZGVzY3JpcHRpb24sIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAnYmFja2dyb3VuZCcsIGtleXdvcmQ6IGtleXdvcmQsIG5hbWU6IG5hbWUsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiwgbGluZTogbGluZX0pXG5cbiAgICAgICAgICBAd3JpdGVfYmxhbmsoKVxuICAgICAgICAgIEB3cml0ZV9jb21tZW50cygxKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChcIiN7a2V5d29yZH06ICN7bmFtZX1cIiwgMSlcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoZGVzY3JpcHRpb24sIDIpIGlmIGRlc2NyaXB0aW9uXG5cbiAgICAgICAgc2NlbmFyaW86IChrZXl3b3JkLCBuYW1lLCBkZXNjcmlwdGlvbiwgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdzY2VuYXJpbycsIGtleXdvcmQ6IGtleXdvcmQsIG5hbWU6IG5hbWUsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiwgbGluZTogbGluZX0pXG5cbiAgICAgICAgICBAd3JpdGVfYmxhbmsoKVxuICAgICAgICAgIEB3cml0ZV9jb21tZW50cygxKVxuICAgICAgICAgIEB3cml0ZV90YWdzKDEpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKFwiI3trZXl3b3JkfTogI3tuYW1lfVwiLCAxKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChkZXNjcmlwdGlvbiwgMikgaWYgZGVzY3JpcHRpb25cblxuICAgICAgICBzY2VuYXJpb19vdXRsaW5lOiAoa2V5d29yZCwgbmFtZSwgZGVzY3JpcHRpb24sIGxpbmUpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAnb3V0bGluZScsIGtleXdvcmQ6IGtleXdvcmQsIG5hbWU6IG5hbWUsIGRlc2NyaXB0aW9uOiBkZXNjcmlwdGlvbiwgbGluZTogbGluZX0pXG5cbiAgICAgICAgICBAd3JpdGVfYmxhbmsoKVxuICAgICAgICAgIEB3cml0ZV9jb21tZW50cygxKVxuICAgICAgICAgIEB3cml0ZV90YWdzKDEpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKFwiI3trZXl3b3JkfTogI3tuYW1lfVwiLCAxKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChkZXNjcmlwdGlvbiwgMikgaWYgZGVzY3JpcHRpb25cblxuICAgICAgICBleGFtcGxlczogKGtleXdvcmQsIG5hbWUsIGRlc2NyaXB0aW9uLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ2V4YW1wbGVzJywga2V5d29yZDoga2V5d29yZCwgbmFtZTogbmFtZSwgZGVzY3JpcHRpb246IGRlc2NyaXB0aW9uLCBsaW5lOiBsaW5lfSlcblxuICAgICAgICAgIEB3cml0ZV9ibGFuaygpXG4gICAgICAgICAgQHdyaXRlX2NvbW1lbnRzKDIpXG4gICAgICAgICAgQHdyaXRlX3RhZ3MoMilcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoXCIje2tleXdvcmR9OiAje25hbWV9XCIsIDIpXG4gICAgICAgICAgQHdyaXRlX2luZGVudGVkKGRlc2NyaXB0aW9uLCAzKSBpZiBkZXNjcmlwdGlvblxuXG4gICAgICAgIHN0ZXA6IChrZXl3b3JkLCBuYW1lLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ3N0ZXAnLCBrZXl3b3JkOiBrZXl3b3JkLCBuYW1lOiBuYW1lLCBsaW5lOiBsaW5lfSlcblxuICAgICAgICAgIEB3cml0ZV9jb21tZW50cygyKVxuICAgICAgICAgIEB3cml0ZV9pbmRlbnRlZChcIiN7a2V5d29yZH0je25hbWV9XCIsIDIpXG5cbiAgICAgICAgZG9jX3N0cmluZzogKGNvbnRlbnRfdHlwZSwgc3RyaW5nLCBsaW5lKSAtPlxuICAgICAgICAgIGxvZ2dlci52ZXJib3NlKHt0b2tlbjogJ2RvY19zdHJpbmcnLCBjb250ZW50X3R5cGU6IGNvbnRlbnRfdHlwZSwgc3RyaW5nOiBzdHJpbmcsIGxpbmU6IGxpbmV9KVxuICAgICAgICAgIHRocmVlX3F1b3RlcyA9ICdcIlwiXCInXG5cbiAgICAgICAgICBAd3JpdGVfY29tbWVudHMoMilcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoXCIje3RocmVlX3F1b3Rlc30je2NvbnRlbnRfdHlwZX1cXG4je3N0cmluZ31cXG4je3RocmVlX3F1b3Rlc31cIiwgMylcblxuICAgICAgICByb3c6IChjZWxscywgbGluZSkgLT5cbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSh7dG9rZW46ICdyb3cnLCBjZWxsczogY2VsbHMsIGxpbmU6IGxpbmV9KVxuXG4gICAgICAgICAgIyBUT0RPOiBuZWVkIHRvIGNvbGxlY3Qgcm93cyBzbyB0aGF0IHdlIGNhbiBhbGlnbiB0aGUgdmVydGljYWwgcGlwZXMgdG8gdGhlIHdpZGVzdCBjb2x1bW5zXG4gICAgICAgICAgIyBTZWUgR2hlcmtpbjo6Rm9ybWF0dGVyOjpQcmV0dHlGb3JtYXR0ZXIjdGFibGUocm93cylcbiAgICAgICAgICBAd3JpdGVfY29tbWVudHMoMylcbiAgICAgICAgICBAd3JpdGVfaW5kZW50ZWQoXCJ8ICN7Y2VsbHMuam9pbignIHwgJyl9IHxcIiwgMylcblxuICAgICAgICBlb2Y6ICgpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2Uoe3Rva2VuOiAnZW9mJ30pXG4gICAgICAgICAgIyBJZiB0aGVyZSB3ZXJlIGFueSBjb21tZW50cyBsZWZ0LCB0cmVhdCB0aGVtIGFzIHN0ZXAgY29tbWVudHMuXG4gICAgICAgICAgQHdyaXRlX2NvbW1lbnRzKDIpXG4gICAgICB9XG5cbiAgICAgIGxleGVyID0gbmV3IExleGVyKHJlY29yZGVyKVxuICAgICAgbGV4ZXIuc2Nhbih0ZXh0KVxuXG4gICAgICBsb2dnZXJMZXZlbCA9IGF0b20/LmNvbmZpZy5nZXQoJ2F0b20tYmVhdXRpZnkuZ2VuZXJhbC5sb2dnZXJMZXZlbCcpXG4gICAgICBpZiBsb2dnZXJMZXZlbCBpcyAndmVyYm9zZSdcbiAgICAgICAgZm9yIGxpbmUgaW4gcmVjb3JkZXIubGluZXNcbiAgICAgICAgICBsb2dnZXIudmVyYm9zZShcIj4gI3tsaW5lfVwiKVxuXG4gICAgICByZXNvbHZlIHJlY29yZGVyLmxpbmVzLmpvaW4oXCJcXG5cIilcbiAgICApXG4iXX0=
