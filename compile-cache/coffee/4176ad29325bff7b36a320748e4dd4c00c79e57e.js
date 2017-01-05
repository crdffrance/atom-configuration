(function() {
  "use strict";
  var $, Beautifiers, CompositeDisposable, LoadingView, Promise, _, async, beautifier, beautify, beautifyDirectory, beautifyFile, beautifyFilePath, debug, defaultLanguageOptions, dir, fs, getCursors, getScrollTop, getUnsupportedOptions, handleSaveEvent, loadingView, logger, path, pkg, plugin, setCursors, setScrollTop, showError, strip, yaml;

  pkg = require('../package.json');

  plugin = module.exports;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  _ = require("lodash");

  Beautifiers = require("./beautifiers");

  beautifier = new Beautifiers();

  defaultLanguageOptions = beautifier.options;

  logger = require('./logger')(__filename);

  Promise = require('bluebird');

  fs = null;

  path = require("path");

  strip = null;

  yaml = null;

  async = null;

  dir = null;

  LoadingView = null;

  loadingView = null;

  $ = null;

  getScrollTop = function(editor) {
    var view;
    view = atom.views.getView(editor);
    return view != null ? view.getScrollTop() : void 0;
  };

  setScrollTop = function(editor, value) {
    var view;
    view = atom.views.getView(editor);
    return view != null ? view.setScrollTop(value) : void 0;
  };

  getCursors = function(editor) {
    var bufferPosition, cursor, cursors, j, len, posArray;
    cursors = editor.getCursors();
    posArray = [];
    for (j = 0, len = cursors.length; j < len; j++) {
      cursor = cursors[j];
      bufferPosition = cursor.getBufferPosition();
      posArray.push([bufferPosition.row, bufferPosition.column]);
    }
    return posArray;
  };

  setCursors = function(editor, posArray) {
    var bufferPosition, i, j, len;
    for (i = j = 0, len = posArray.length; j < len; i = ++j) {
      bufferPosition = posArray[i];
      if (i === 0) {
        editor.setCursorBufferPosition(bufferPosition);
        continue;
      }
      editor.addCursorAtBufferPosition(bufferPosition);
    }
  };

  beautifier.on('beautify::start', function() {
    if (LoadingView == null) {
      LoadingView = require("./views/loading-view");
    }
    if (loadingView == null) {
      loadingView = new LoadingView();
    }
    return loadingView.show();
  });

  beautifier.on('beautify::end', function() {
    return loadingView != null ? loadingView.hide() : void 0;
  });

  showError = function(error) {
    var detail, ref, stack;
    if (!atom.config.get("atom-beautify.general.muteAllErrors")) {
      stack = error.stack;
      detail = error.description || error.message;
      return (ref = atom.notifications) != null ? ref.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0;
    }
  };

  beautify = function(arg) {
    var editor, onSave;
    editor = arg.editor, onSave = arg.onSave;
    return new Promise(function(resolve, reject) {
      var allOptions, beautifyCompleted, e, editedFilePath, forceEntireFile, grammarName, isSelection, oldText, text;
      plugin.checkUnsupportedOptions();
      if (path == null) {
        path = require("path");
      }
      forceEntireFile = onSave && atom.config.get("atom-beautify.general.beautifyEntireFileOnSave");
      beautifyCompleted = function(text) {
        var error, origScrollTop, posArray, selectedBufferRange;
        if (text == null) {

        } else if (text instanceof Error) {
          showError(text);
          return reject(text);
        } else if (typeof text === "string") {
          if (oldText !== text) {
            posArray = getCursors(editor);
            origScrollTop = getScrollTop(editor);
            if (!forceEntireFile && isSelection) {
              selectedBufferRange = editor.getSelectedBufferRange();
              editor.setTextInBufferRange(selectedBufferRange, text);
            } else {
              editor.setText(text);
            }
            setCursors(editor, posArray);
            setTimeout((function() {
              setScrollTop(editor, origScrollTop);
              return resolve(text);
            }), 0);
          }
        } else {
          error = new Error("Unsupported beautification result '" + text + "'.");
          showError(error);
          return reject(error);
        }
      };
      editor = editor != null ? editor : atom.workspace.getActiveTextEditor();
      if (editor == null) {
        return showError(new Error("Active Editor not found. ", "Please select a Text Editor first to beautify."));
      }
      isSelection = !!editor.getSelectedText();
      editedFilePath = editor.getPath();
      allOptions = beautifier.getOptionsForPath(editedFilePath, editor);
      text = void 0;
      if (!forceEntireFile && isSelection) {
        text = editor.getSelectedText();
      } else {
        text = editor.getText();
      }
      oldText = text;
      grammarName = editor.getGrammar().name;
      try {
        beautifier.beautify(text, allOptions, grammarName, editedFilePath, {
          onSave: onSave
        }).then(beautifyCompleted)["catch"](beautifyCompleted);
      } catch (error1) {
        e = error1;
        showError(e);
      }
    });
  };

  beautifyFilePath = function(filePath, callback) {
    var $el, cb;
    logger.verbose('beautifyFilePath', filePath);
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
    $el.addClass('beautifying');
    cb = function(err, result) {
      logger.verbose('Cleanup beautifyFilePath', err, result);
      $el = $(".icon-file-text[data-path=\"" + filePath + "\"]");
      $el.removeClass('beautifying');
      return callback(err, result);
    };
    if (fs == null) {
      fs = require("fs");
    }
    logger.verbose('readFile', filePath);
    return fs.readFile(filePath, function(err, data) {
      var allOptions, completionFun, e, grammar, grammarName, input;
      logger.verbose('readFile completed', err, filePath);
      if (err) {
        return cb(err);
      }
      input = data != null ? data.toString() : void 0;
      grammar = atom.grammars.selectGrammar(filePath, input);
      grammarName = grammar.name;
      allOptions = beautifier.getOptionsForPath(filePath);
      logger.verbose('beautifyFilePath allOptions', allOptions);
      completionFun = function(output) {
        logger.verbose('beautifyFilePath completionFun', output);
        if (output instanceof Error) {
          return cb(output, null);
        } else if (typeof output === "string") {
          if (output.trim() === '') {
            logger.verbose('beautifyFilePath, output was empty string!');
            return cb(null, output);
          }
          return fs.writeFile(filePath, output, function(err) {
            if (err) {
              return cb(err);
            }
            return cb(null, output);
          });
        } else {
          return cb(new Error("Unknown beautification result " + output + "."), output);
        }
      };
      try {
        logger.verbose('beautify', input, allOptions, grammarName, filePath);
        return beautifier.beautify(input, allOptions, grammarName, filePath).then(completionFun)["catch"](completionFun);
      } catch (error1) {
        e = error1;
        return cb(e);
      }
    });
  };

  beautifyFile = function(arg) {
    var filePath, target;
    target = arg.target;
    filePath = target.dataset.path;
    if (!filePath) {
      return;
    }
    beautifyFilePath(filePath, function(err, result) {
      if (err) {
        return showError(err);
      }
    });
  };

  beautifyDirectory = function(arg) {
    var $el, dirPath, target;
    target = arg.target;
    dirPath = target.dataset.path;
    if (!dirPath) {
      return;
    }
    if ((typeof atom !== "undefined" && atom !== null ? atom.confirm({
      message: "This will beautify all of the files found recursively in this directory, '" + dirPath + "'. Do you want to continue?",
      buttons: ['Yes, continue!', 'No, cancel!']
    }) : void 0) !== 0) {
      return;
    }
    if ($ == null) {
      $ = require("atom-space-pen-views").$;
    }
    $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
    $el.addClass('beautifying');
    if (dir == null) {
      dir = require("node-dir");
    }
    if (async == null) {
      async = require("async");
    }
    dir.files(dirPath, function(err, files) {
      if (err) {
        return showError(err);
      }
      return async.each(files, function(filePath, callback) {
        return beautifyFilePath(filePath, function() {
          return callback();
        });
      }, function(err) {
        $el = $(".icon-file-directory[data-path=\"" + dirPath + "\"]");
        return $el.removeClass('beautifying');
      });
    });
  };

  debug = function() {
    var addHeader, addInfo, allOptions, beautifiers, codeBlockSyntax, debugInfo, detail, editor, error, filePath, grammarName, headers, language, linkifyTitle, open, ref, ref1, selectedBeautifier, stack, text, tocEl;
    try {
      open = require("open");
      if (fs == null) {
        fs = require("fs");
      }
      plugin.checkUnsupportedOptions();
      editor = atom.workspace.getActiveTextEditor();
      linkifyTitle = function(title) {
        var p, sep;
        title = title.toLowerCase();
        p = title.split(/[\s,+#;,\/?:@&=+$]+/);
        sep = "-";
        return p.join(sep);
      };
      if (editor == null) {
        return confirm("Active Editor not found.\n" + "Please select a Text Editor first to beautify.");
      }
      if (!confirm('Are you ready to debug Atom Beautify?')) {
        return;
      }
      debugInfo = "";
      headers = [];
      tocEl = "<TABLEOFCONTENTS/>";
      addInfo = function(key, val) {
        if (key != null) {
          return debugInfo += "**" + key + "**: " + val + "\n\n";
        } else {
          return debugInfo += val + "\n\n";
        }
      };
      addHeader = function(level, title) {
        debugInfo += (Array(level + 1).join('#')) + " " + title + "\n\n";
        return headers.push({
          level: level,
          title: title
        });
      };
      addHeader(1, "Atom Beautify - Debugging information");
      debugInfo += "The following debugging information was " + ("generated by `Atom Beautify` on `" + (new Date()) + "`.") + "\n\n---\n\n" + tocEl + "\n\n---\n\n";
      addInfo('Platform', process.platform);
      addHeader(2, "Versions");
      addInfo('Atom Version', atom.appVersion);
      addInfo('Atom Beautify Version', pkg.version);
      addHeader(2, "Original file to be beautified");
      filePath = editor.getPath();
      addInfo('Original File Path', "`" + filePath + "`");
      grammarName = editor.getGrammar().name;
      addInfo('Original File Grammar', grammarName);
      language = beautifier.getLanguage(grammarName, filePath);
      addInfo('Original File Language', language != null ? language.name : void 0);
      addInfo('Language namespace', language != null ? language.namespace : void 0);
      beautifiers = beautifier.getBeautifiers(language.name);
      addInfo('Supported Beautifiers', _.map(beautifiers, 'name').join(', '));
      selectedBeautifier = beautifier.getBeautifierForLanguage(language);
      addInfo('Selected Beautifier', selectedBeautifier.name);
      text = editor.getText() || "";
      codeBlockSyntax = ((ref = language != null ? language.name : void 0) != null ? ref : grammarName).toLowerCase().split(' ')[0];
      addHeader(3, 'Original File Contents');
      addInfo(null, "\n```" + codeBlockSyntax + "\n" + text + "\n```");
      addHeader(3, 'Package Settings');
      addInfo(null, "The raw package settings options\n" + ("```json\n" + (JSON.stringify(atom.config.get('atom-beautify'), void 0, 4)) + "\n```"));
      addHeader(2, "Beautification options");
      allOptions = beautifier.getOptionsForPath(filePath, editor);
      return Promise.all(allOptions).then(function(allOptions) {
        var cb, configOptions, e, editorConfigOptions, editorOptions, finalOptions, homeOptions, logFilePathRegex, logs, preTransformedOptions, projectOptions, subscription;
        editorOptions = allOptions[0], configOptions = allOptions[1], homeOptions = allOptions[2], editorConfigOptions = allOptions[3];
        projectOptions = allOptions.slice(4);
        preTransformedOptions = beautifier.getOptionsForLanguage(allOptions, language);
        if (selectedBeautifier) {
          finalOptions = beautifier.transformOptions(selectedBeautifier, language.name, preTransformedOptions);
        }
        addInfo('Editor Options', "\n" + "Options from Atom Editor settings\n" + ("```json\n" + (JSON.stringify(editorOptions, void 0, 4)) + "\n```"));
        addInfo('Config Options', "\n" + "Options from Atom Beautify package settings\n" + ("```json\n" + (JSON.stringify(configOptions, void 0, 4)) + "\n```"));
        addInfo('Home Options', "\n" + ("Options from `" + (path.resolve(beautifier.getUserHome(), '.jsbeautifyrc')) + "`\n") + ("```json\n" + (JSON.stringify(homeOptions, void 0, 4)) + "\n```"));
        addInfo('EditorConfig Options', "\n" + "Options from [EditorConfig](http://editorconfig.org/) file\n" + ("```json\n" + (JSON.stringify(editorConfigOptions, void 0, 4)) + "\n```"));
        addInfo('Project Options', "\n" + ("Options from `.jsbeautifyrc` files starting from directory `" + (path.dirname(filePath)) + "` and going up to root\n") + ("```json\n" + (JSON.stringify(projectOptions, void 0, 4)) + "\n```"));
        addInfo('Pre-Transformed Options', "\n" + "Combined options before transforming them given a beautifier's specifications\n" + ("```json\n" + (JSON.stringify(preTransformedOptions, void 0, 4)) + "\n```"));
        if (selectedBeautifier) {
          addHeader(3, 'Final Options');
          addInfo(null, "Final combined and transformed options that are used\n" + ("```json\n" + (JSON.stringify(finalOptions, void 0, 4)) + "\n```"));
        }
        logs = "";
        logFilePathRegex = new RegExp('\\: \\[(.*)\\]');
        subscription = logger.onLogging(function(msg) {
          var sep;
          sep = path.sep;
          return logs += msg.replace(logFilePathRegex, function(a, b) {
            var i, p, s;
            s = b.split(sep);
            i = s.indexOf('atom-beautify');
            p = s.slice(i + 2).join(sep);
            return ': [' + p + ']';
          });
        });
        cb = function(result) {
          var JsDiff, bullet, diff, header, indent, indentNum, j, len, toc;
          subscription.dispose();
          addHeader(2, "Results");
          addInfo('Beautified File Contents', "\n```" + codeBlockSyntax + "\n" + result + "\n```");
          JsDiff = require('diff');
          if (typeof result === "string") {
            diff = JsDiff.createPatch(filePath || "", text || "", result || "", "original", "beautified");
            addInfo('Original vs. Beautified Diff', "\n```" + codeBlockSyntax + "\n" + diff + "\n```");
          }
          addHeader(3, "Logs");
          addInfo(null, "```\n" + logs + "\n```");
          toc = "## Table Of Contents\n";
          for (j = 0, len = headers.length; j < len; j++) {
            header = headers[j];

            /*
            - Heading 1
              - Heading 1.1
             */
            indent = "  ";
            bullet = "-";
            indentNum = header.level - 2;
            if (indentNum >= 0) {
              toc += "" + (Array(indentNum + 1).join(indent)) + bullet + " [" + header.title + "](\#" + (linkifyTitle(header.title)) + ")\n";
            }
          }
          debugInfo = debugInfo.replace(tocEl, toc);
          return atom.workspace.open().then(function(editor) {
            editor.setText(debugInfo);
            return confirm("Please login to GitHub and create a Gist named \"debug.md\" (Markdown file) with your debugging information.\nThen add a link to your Gist in your GitHub Issue.\nThank you!\n\nGist: https://gist.github.com/\nGitHub Issues: https://github.com/Glavin001/atom-beautify/issues");
          })["catch"](function(error) {
            return confirm("An error occurred when creating the Gist: " + error.message);
          });
        };
        try {
          return beautifier.beautify(text, allOptions, grammarName, filePath).then(cb)["catch"](cb);
        } catch (error1) {
          e = error1;
          return cb(e);
        }
      })["catch"](function(error) {
        var detail, ref1, stack;
        stack = error.stack;
        detail = error.description || error.message;
        return typeof atom !== "undefined" && atom !== null ? (ref1 = atom.notifications) != null ? ref1.addError(error.message, {
          stack: stack,
          detail: detail,
          dismissable: true
        }) : void 0 : void 0;
      });
    } catch (error1) {
      error = error1;
      stack = error.stack;
      detail = error.description || error.message;
      return typeof atom !== "undefined" && atom !== null ? (ref1 = atom.notifications) != null ? ref1.addError(error.message, {
        stack: stack,
        detail: detail,
        dismissable: true
      }) : void 0 : void 0;
    }
  };

  handleSaveEvent = function() {
    return atom.workspace.observeTextEditors(function(editor) {
      var beautifyOnSaveHandler, disposable, pendingPaths;
      pendingPaths = {};
      beautifyOnSaveHandler = function(arg) {
        var beautifyOnSave, buffer, fileExtension, filePath, grammar, key, language, languages;
        filePath = arg.path;
        logger.verbose('Should beautify on this save?');
        if (pendingPaths[filePath]) {
          logger.verbose("Editor with file path " + filePath + " already beautified!");
          return;
        }
        buffer = editor.getBuffer();
        if (path == null) {
          path = require('path');
        }
        grammar = editor.getGrammar().name;
        fileExtension = path.extname(filePath);
        fileExtension = fileExtension.substr(1);
        languages = beautifier.languages.getLanguages({
          grammar: grammar,
          extension: fileExtension
        });
        if (languages.length < 1) {
          return;
        }
        language = languages[0];
        key = "atom-beautify." + language.namespace + ".beautify_on_save";
        beautifyOnSave = atom.config.get(key);
        logger.verbose('save editor positions', key, beautifyOnSave);
        if (beautifyOnSave) {
          logger.verbose('Beautifying file', filePath);
          return beautify({
            editor: editor,
            onSave: true
          }).then(function() {
            logger.verbose('Done beautifying file', filePath);
            if (editor.isAlive() === true) {
              logger.verbose('Saving TextEditor...');
              pendingPaths[filePath] = true;
              editor.save();
              delete pendingPaths[filePath];
              return logger.verbose('Saved TextEditor.');
            }
          })["catch"](function(error) {
            return showError(error);
          });
        }
      };
      disposable = editor.onDidSave(function(arg) {
        var filePath;
        filePath = arg.path;
        return beautifyOnSaveHandler({
          path: filePath
        });
      });
      return plugin.subscriptions.add(disposable);
    });
  };

  getUnsupportedOptions = function() {
    var schema, settings, unsupportedOptions;
    settings = atom.config.get('atom-beautify');
    schema = atom.config.getSchema('atom-beautify');
    unsupportedOptions = _.filter(_.keys(settings), function(key) {
      return schema.properties[key] === void 0;
    });
    return unsupportedOptions;
  };

  plugin.checkUnsupportedOptions = function() {
    var unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    if (unsupportedOptions.length !== 0) {
      return atom.notifications.addWarning("Please run Atom command 'Atom-Beautify: Migrate Settings'.", {
        detail: "You can open the Atom command palette with `cmd-shift-p` (OSX) or `ctrl-shift-p` (Linux/Windows) in Atom. You have unsupported options: " + (unsupportedOptions.join(', ')),
        dismissable: true
      });
    }
  };

  plugin.migrateSettings = function() {
    var namespaces, rename, rex, unsupportedOptions;
    unsupportedOptions = getUnsupportedOptions();
    namespaces = beautifier.languages.namespaces;
    if (unsupportedOptions.length === 0) {
      return atom.notifications.addSuccess("No options to migrate.");
    } else {
      rex = new RegExp("(" + (namespaces.join('|')) + ")_(.*)");
      rename = _.toPairs(_.zipObject(unsupportedOptions, _.map(unsupportedOptions, function(key) {
        var m;
        m = key.match(rex);
        if (m === null) {
          return "general." + key;
        } else {
          return m[1] + "." + m[2];
        }
      })));
      _.each(rename, function(arg) {
        var key, newKey, val;
        key = arg[0], newKey = arg[1];
        val = atom.config.get("atom-beautify." + key);
        atom.config.set("atom-beautify." + newKey, val);
        return atom.config.set("atom-beautify." + key, void 0);
      });
      return atom.notifications.addSuccess("Successfully migrated options: " + (unsupportedOptions.join(', ')));
    }
  };

  plugin.config = _.merge(require('./config.coffee'), defaultLanguageOptions);

  plugin.activate = function() {
    this.subscriptions = new CompositeDisposable;
    this.subscriptions.add(handleSaveEvent());
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:beautify-editor", beautify));
    this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:help-debug-editor", debug));
    this.subscriptions.add(atom.commands.add(".tree-view .file .name", "atom-beautify:beautify-file", beautifyFile));
    this.subscriptions.add(atom.commands.add(".tree-view .directory .name", "atom-beautify:beautify-directory", beautifyDirectory));
    return this.subscriptions.add(atom.commands.add("atom-workspace", "atom-beautify:migrate-settings", plugin.migrateSettings));
  };

  plugin.deactivate = function() {
    return this.subscriptions.dispose();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQTtBQUFBLE1BQUE7O0VBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxpQkFBUjs7RUFHTixNQUFBLEdBQVMsTUFBTSxDQUFDOztFQUNmLHNCQUF1QixPQUFBLENBQVEsV0FBUjs7RUFDeEIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7RUFDZCxVQUFBLEdBQWlCLElBQUEsV0FBQSxDQUFBOztFQUNqQixzQkFBQSxHQUF5QixVQUFVLENBQUM7O0VBQ3BDLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFBLENBQW9CLFVBQXBCOztFQUNULE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFHVixFQUFBLEdBQUs7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEtBQUEsR0FBUTs7RUFDUixJQUFBLEdBQU87O0VBQ1AsS0FBQSxHQUFROztFQUNSLEdBQUEsR0FBTTs7RUFDTixXQUFBLEdBQWM7O0VBQ2QsV0FBQSxHQUFjOztFQUNkLENBQUEsR0FBSTs7RUFNSixZQUFBLEdBQWUsU0FBQyxNQUFEO0FBQ2IsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7MEJBQ1AsSUFBSSxDQUFFLFlBQU4sQ0FBQTtFQUZhOztFQUdmLFlBQUEsR0FBZSxTQUFDLE1BQUQsRUFBUyxLQUFUO0FBQ2IsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7MEJBQ1AsSUFBSSxDQUFFLFlBQU4sQ0FBbUIsS0FBbkI7RUFGYTs7RUFJZixVQUFBLEdBQWEsU0FBQyxNQUFEO0FBQ1gsUUFBQTtJ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QUFvQyxzQkFBcEM7O0VBQ2hCLE1BQU0sQ0FBQyxRQUFQLEdBQWtCLFNBQUE7SUFDaEIsSUFBQyxDQUFBLGFBQUQsR0FBaUIsSUFBSTtJQUNyQixJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsZUFBQSxDQUFBLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsK0JBQXBDLEVBQXFFLFFBQXJFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQixnQkFBbEIsRUFBb0MsaUNBQXBDLEVBQXVFLEtBQXZFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQix3QkFBbEIsRUFBNEMsNkJBQTVDLEVBQTJFLFlBQTNFLENBQW5CO0lBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBZCxDQUFrQiw2QkFBbEIsRUFBaUQsa0NBQWpELEVBQXFGLGlCQUFyRixDQUFuQjtXQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsZ0JBQWxCLEVBQW9DLGdDQUFwQyxFQUFzRSxNQUFNLENBQUMsZUFBN0UsQ0FBbkI7RUFQZ0I7O0VBU2xCLE1BQU0sQ0FBQyxVQUFQLEdBQW9CLFNBQUE7V0FDbEIsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUE7RUFEa0I7QUF0bUJwQiIsInNvdXJjZXNDb250ZW50IjpbIiMgZ2xvYmFsIGF0b21cblwidXNlIHN0cmljdFwiXG5wa2cgPSByZXF1aXJlKCcuLi9wYWNrYWdlLmpzb24nKVxuXG4jIERlcGVuZGVuY2llc1xucGx1Z2luID0gbW9kdWxlLmV4cG9ydHNcbntDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2V2ZW50LWtpdCdcbl8gPSByZXF1aXJlKFwibG9kYXNoXCIpXG5CZWF1dGlmaWVycyA9IHJlcXVpcmUoXCIuL2JlYXV0aWZpZXJzXCIpXG5iZWF1dGlmaWVyID0gbmV3IEJlYXV0aWZpZXJzKClcbmRlZmF1bHRMYW5ndWFnZU9wdGlvbnMgPSBiZWF1dGlmaWVyLm9wdGlvbnNcbmxvZ2dlciA9IHJlcXVpcmUoJy4vbG9nZ2VyJykoX19maWxlbmFtZSlcblByb21pc2UgPSByZXF1aXJlKCdibHVlYmlyZCcpXG5cbiMgTGF6eSBsb2FkZWQgZGVwZW5kZW5jaWVzXG5mcyA9IG51bGxcbnBhdGggPSByZXF1aXJlKFwicGF0aFwiKVxuc3RyaXAgPSBudWxsXG55YW1sID0gbnVsbFxuYXN5bmMgPSBudWxsXG5kaXIgPSBudWxsICMgTm9kZS1EaXJcbkxvYWRpbmdWaWV3ID0gbnVsbFxubG9hZGluZ1ZpZXcgPSBudWxsXG4kID0gbnVsbFxuXG4jIGZ1bmN0aW9uIGNsZWFuT3B0aW9ucyhkYXRhLCB0eXBlcykge1xuIyBub3B0LmNsZWFuKGRhdGEsIHR5cGVzKTtcbiMgcmV0dXJuIGRhdGE7XG4jIH1cbmdldFNjcm9sbFRvcCA9IChlZGl0b3IpIC0+XG4gIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICB2aWV3Py5nZXRTY3JvbGxUb3AoKVxuc2V0U2Nyb2xsVG9wID0gKGVkaXRvciwgdmFsdWUpIC0+XG4gIHZpZXcgPSBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKVxuICB2aWV3Py5zZXRTY3JvbGxUb3AgdmFsdWVcblxuZ2V0Q3Vyc29ycyA9IChlZGl0b3IpIC0+XG4gIGN1cnNvcnMgPSBlZGl0b3IuZ2V0Q3Vyc29ycygpXG4gIHBvc0FycmF5ID0gW11cbiAgZm9yIGN1cnNvciBpbiBjdXJzb3JzXG4gICAgYnVmZmVyUG9zaXRpb24gPSBjdXJzb3IuZ2V0QnVmZmVyUG9zaXRpb24oKVxuICAgIHBvc0FycmF5LnB1c2ggW1xuICAgICAgYnVmZmVyUG9zaXRpb24ucm93XG4gICAgICBidWZmZXJQb3NpdGlvbi5jb2x1bW5cbiAgICBdXG4gIHBvc0FycmF5XG5zZXRDdXJzb3JzID0gKGVkaXRvciwgcG9zQXJyYXkpIC0+XG5cbiAgIyBjb25zb2xlLmxvZyBcInNldEN1cnNvcnM6XG4gIGZvciBidWZmZXJQb3NpdGlvbiwgaSBpbiBwb3NBcnJheVxuICAgIGlmIGkgaXMgMFxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uIGJ1ZmZlclBvc2l0aW9uXG4gICAgICBjb250aW51ZVxuICAgIGVkaXRvci5hZGRDdXJzb3JBdEJ1ZmZlclBvc2l0aW9uIGJ1ZmZlclBvc2l0aW9uXG4gIHJldHVyblxuXG4jIFNob3cgYmVhdXRpZmljYXRpb24gcHJvZ3Jlc3MvbG9hZGluZyB2aWV3XG5iZWF1dGlmaWVyLm9uKCdiZWF1dGlmeTo6c3RhcnQnLCAtPlxuICBMb2FkaW5nVmlldyA/PSByZXF1aXJlIFwiLi92aWV3cy9sb2FkaW5nLXZpZXdcIlxuICBsb2FkaW5nVmlldyA/PSBuZXcgTG9hZGluZ1ZpZXcoKVxuICBsb2FkaW5nVmlldy5zaG93KClcbilcbmJlYXV0aWZpZXIub24oJ2JlYXV0aWZ5OjplbmQnLCAtPlxuICBsb2FkaW5nVmlldz8uaGlkZSgpXG4pXG4jIFNob3cgZXJyb3JcbnNob3dFcnJvciA9IChlcnJvcikgLT5cbiAgaWYgbm90IGF0b20uY29uZmlnLmdldChcImF0b20tYmVhdXRpZnkuZ2VuZXJhbC5tdXRlQWxsRXJyb3JzXCIpXG4gICAgIyBjb25zb2xlLmxvZyhlKVxuICAgIHN0YWNrID0gZXJyb3Iuc3RhY2tcbiAgICBkZXRhaWwgPSBlcnJvci5kZXNjcmlwdGlvbiBvciBlcnJvci5tZXNzYWdlXG4gICAgYXRvbS5ub3RpZmljYXRpb25zPy5hZGRFcnJvcihlcnJvci5tZXNzYWdlLCB7XG4gICAgICBzdGFjaywgZGV0YWlsLCBkaXNtaXNzYWJsZSA6IHRydWV9KVxuXG5iZWF1dGlmeSA9ICh7ZWRpdG9yLCBvblNhdmV9KSAtPlxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgLT5cblxuICAgIHBsdWdpbi5jaGVja1Vuc3VwcG9ydGVkT3B0aW9ucygpXG5cbiAgICAjIENvbnRpbnVlIGJlYXV0aWZ5aW5nXG4gICAgcGF0aCA/PSByZXF1aXJlKFwicGF0aFwiKVxuICAgIGZvcmNlRW50aXJlRmlsZSA9IG9uU2F2ZSBhbmQgYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1iZWF1dGlmeS5nZW5lcmFsLmJlYXV0aWZ5RW50aXJlRmlsZU9uU2F2ZVwiKVxuXG4gICAgIyBHZXQgdGhlIHBhdGggdG8gdGhlIGNvbmZpZyBmaWxlXG4gICAgIyBBbGwgb2YgdGhlIG9wdGlvbnNcbiAgICAjIExpc3RlZCBpbiBvcmRlciBmcm9tIGRlZmF1bHQgKGJhc2UpIHRvIHRoZSBvbmUgd2l0aCB0aGUgaGlnaGVzdCBwcmlvcml0eVxuICAgICMgTGVmdCA9IERlZmF1bHQsIFJpZ2h0ID0gV2lsbCBvdmVycmlkZSB0aGUgbGVmdC5cbiAgICAjIEF0b20gRWRpdG9yXG4gICAgI1xuICAgICMgVXNlcidzIEhvbWUgcGF0aFxuICAgICMgUHJvamVjdCBwYXRoXG4gICAgIyBBc3luY2hyb25vdXNseSBhbmQgY2FsbGJhY2stc3R5bGVcbiAgICBiZWF1dGlmeUNvbXBsZXRlZCA9ICh0ZXh0KSAtPlxuXG4gICAgICBpZiBub3QgdGV4dD9cbiAgICAgICAgIyBEbyBub3RoaW5nLCBpcyB1bmRlZmluZWRcbiAgICAgICAgIyBjb25zb2xlLmxvZyAnYmVhdXRpZnlDb21wbGV0ZWQnXG4gICAgICBlbHNlIGlmIHRleHQgaW5zdGFuY2VvZiBFcnJvclxuICAgICAgICBzaG93RXJyb3IodGV4dClcbiAgICAgICAgcmV0dXJuIHJlamVjdCh0ZXh0KVxuICAgICAgZWxzZSBpZiB0eXBlb2YgdGV4dCBpcyBcInN0cmluZ1wiXG4gICAgICAgIGlmIG9sZFRleHQgaXNudCB0ZXh0XG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwiUmVwbGFjaW5nIGN1cnJlbnQgZWRpdG9yJ3MgdGV4dCB3aXRoIG5ldyB0ZXh0XCJcbiAgICAgICAgICBwb3NBcnJheSA9IGdldEN1cnNvcnMoZWRpdG9yKVxuXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcInBvc0FycmF5OlxuICAgICAgICAgIG9yaWdTY3JvbGxUb3AgPSBnZXRTY3JvbGxUb3AoZWRpdG9yKVxuXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcIm9yaWdTY3JvbGxUb3A6XG4gICAgICAgICAgaWYgbm90IGZvcmNlRW50aXJlRmlsZSBhbmQgaXNTZWxlY3Rpb25cbiAgICAgICAgICAgIHNlbGVjdGVkQnVmZmVyUmFuZ2UgPSBlZGl0b3IuZ2V0U2VsZWN0ZWRCdWZmZXJSYW5nZSgpXG5cbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzZWxlY3RlZEJ1ZmZlclJhbmdlOlxuICAgICAgICAgICAgZWRpdG9yLnNldFRleHRJbkJ1ZmZlclJhbmdlIHNlbGVjdGVkQnVmZmVyUmFuZ2UsIHRleHRcbiAgICAgICAgICBlbHNlXG5cbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzZXRUZXh0XCJcbiAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0IHRleHRcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzZXRDdXJzb3JzXCJcbiAgICAgICAgICBzZXRDdXJzb3JzIGVkaXRvciwgcG9zQXJyYXlcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJEb25lIHNldEN1cnNvcnNcIlxuICAgICAgICAgICMgTGV0IHRoZSBzY3JvbGxUb3Agc2V0dGluZyBydW4gYWZ0ZXIgYWxsIHRoZSBzYXZlIHJlbGF0ZWQgc3R1ZmYgaXMgcnVuLFxuICAgICAgICAgICMgb3RoZXJ3aXNlIHNldFNjcm9sbFRvcCBpcyBub3Qgd29ya2luZywgcHJvYmFibHkgYmVjYXVzZSB0aGUgY3Vyc29yXG4gICAgICAgICAgIyBhZGRpdGlvbiBoYXBwZW5zIGFzeW5jaHJvbm91c2x5XG4gICAgICAgICAgc2V0VGltZW91dCAoIC0+XG5cbiAgICAgICAgICAgICMgY29uc29sZS5sb2cgXCJzZXRTY3JvbGxUb3BcIlxuICAgICAgICAgICAgc2V0U2Nyb2xsVG9wIGVkaXRvciwgb3JpZ1Njcm9sbFRvcFxuICAgICAgICAgICAgcmV0dXJuIHJlc29sdmUodGV4dClcbiAgICAgICAgICApLCAwXG4gICAgICBlbHNlXG4gICAgICAgIGVycm9yID0gbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgYmVhdXRpZmljYXRpb24gcmVzdWx0ICcje3RleHR9Jy5cIilcbiAgICAgICAgc2hvd0Vycm9yKGVycm9yKVxuICAgICAgICByZXR1cm4gcmVqZWN0KGVycm9yKVxuXG4gICAgICAjIGVsc2VcbiAgICAgICMgY29uc29sZS5sb2cgXCJBbHJlYWR5IEJlYXV0aWZ1bCFcIlxuICAgICAgcmV0dXJuXG5cbiAgICAjIGNvbnNvbGUubG9nICdCZWF1dGlmeSB0aW1lISdcbiAgICAjXG4gICAgIyBHZXQgY3VycmVudCBlZGl0b3JcbiAgICBlZGl0b3IgPSBlZGl0b3IgPyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuXG4gICAgIyBDaGVjayBpZiB0aGVyZSBpcyBhbiBhY3RpdmUgZWRpdG9yXG4gICAgaWYgbm90IGVkaXRvcj9cbiAgICAgIHJldHVybiBzaG93RXJyb3IoIG5ldyBFcnJvcihcIkFjdGl2ZSBFZGl0b3Igbm90IGZvdW5kLiBcIlxuICAgICAgICBcIlBsZWFzZSBzZWxlY3QgYSBUZXh0IEVkaXRvciBmaXJzdCB0byBiZWF1dGlmeS5cIikpXG4gICAgaXNTZWxlY3Rpb24gPSAhIWVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuXG5cbiAgICAjIEdldCBlZGl0b3IgcGF0aCBhbmQgY29uZmlndXJhdGlvbnMgZm9yIHBhdGhzXG4gICAgZWRpdGVkRmlsZVBhdGggPSBlZGl0b3IuZ2V0UGF0aCgpXG5cblxuICAgICMgR2V0IGFsbCBvcHRpb25zXG4gICAgYWxsT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0ZvclBhdGgoZWRpdGVkRmlsZVBhdGgsIGVkaXRvcilcblxuXG4gICAgIyBHZXQgY3VycmVudCBlZGl0b3IncyB0ZXh0XG4gICAgdGV4dCA9IHVuZGVmaW5lZFxuICAgIGlmIG5vdCBmb3JjZUVudGlyZUZpbGUgYW5kIGlzU2VsZWN0aW9uXG4gICAgICB0ZXh0ID0gZWRpdG9yLmdldFNlbGVjdGVkVGV4dCgpXG4gICAgZWxzZVxuICAgICAgdGV4dCA9IGVkaXRvci5nZXRUZXh0KClcbiAgICBvbGRUZXh0ID0gdGV4dFxuXG5cbiAgICAjIEdldCBHcmFtbWFyXG4gICAgZ3JhbW1hck5hbWUgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWVcblxuXG4gICAgIyBGaW5hbGx5LCBiZWF1dGlmeSFcbiAgICB0cnlcbiAgICAgIGJlYXV0aWZpZXIuYmVhdXRpZnkodGV4dCwgYWxsT3B0aW9ucywgZ3JhbW1hck5hbWUsIGVkaXRlZEZpbGVQYXRoLCBvblNhdmUgOiBvblNhdmUpXG4gICAgICAudGhlbihiZWF1dGlmeUNvbXBsZXRlZClcbiAgICAgIC5jYXRjaChiZWF1dGlmeUNvbXBsZXRlZClcbiAgICBjYXRjaCBlXG4gICAgICBzaG93RXJyb3IoZSlcbiAgICByZXR1cm5cbiAgKVxuXG5iZWF1dGlmeUZpbGVQYXRoID0gKGZpbGVQYXRoLCBjYWxsYmFjaykgLT5cbiAgbG9nZ2VyLnZlcmJvc2UoJ2JlYXV0aWZ5RmlsZVBhdGgnLCBmaWxlUGF0aClcblxuICAjIFNob3cgaW4gcHJvZ3Jlc3MgaW5kaWNhdGUgb24gZmlsZSdzIHRyZWUtdmlldyBlbnRyeVxuICAkID89IHJlcXVpcmUoXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiKS4kXG4gICRlbCA9ICQoXCIuaWNvbi1maWxlLXRleHRbZGF0YS1wYXRoPVxcXCIje2ZpbGVQYXRofVxcXCJdXCIpXG4gICRlbC5hZGRDbGFzcygnYmVhdXRpZnlpbmcnKVxuXG4gICMgQ2xlYW51cCBhbmQgcmV0dXJuIGNhbGxiYWNrIGZ1bmN0aW9uXG4gIGNiID0gKGVyciwgcmVzdWx0KSAtPlxuICAgIGxvZ2dlci52ZXJib3NlKCdDbGVhbnVwIGJlYXV0aWZ5RmlsZVBhdGgnLCBlcnIsIHJlc3VsdClcbiAgICAkZWwgPSAkKFwiLmljb24tZmlsZS10ZXh0W2RhdGEtcGF0aD1cXFwiI3tmaWxlUGF0aH1cXFwiXVwiKVxuICAgICRlbC5yZW1vdmVDbGFzcygnYmVhdXRpZnlpbmcnKVxuICAgIHJldHVybiBjYWxsYmFjayhlcnIsIHJlc3VsdClcblxuICAjIEdldCBjb250ZW50cyBvZiBmaWxlXG4gIGZzID89IHJlcXVpcmUgXCJmc1wiXG4gIGxvZ2dlci52ZXJib3NlKCdyZWFkRmlsZScsIGZpbGVQYXRoKVxuICBmcy5yZWFkRmlsZShmaWxlUGF0aCwgKGVyciwgZGF0YSkgLT5cbiAgICBsb2dnZXIudmVyYm9zZSgncmVhZEZpbGUgY29tcGxldGVkJywgZXJyLCBmaWxlUGF0aClcbiAgICByZXR1cm4gY2IoZXJyKSBpZiBlcnJcbiAgICBpbnB1dCA9IGRhdGE/LnRvU3RyaW5nKClcbiAgICBncmFtbWFyID0gYXRvbS5ncmFtbWFycy5zZWxlY3RHcmFtbWFyKGZpbGVQYXRoLCBpbnB1dClcbiAgICBncmFtbWFyTmFtZSA9IGdyYW1tYXIubmFtZVxuXG4gICAgIyBHZXQgdGhlIG9wdGlvbnNcbiAgICBhbGxPcHRpb25zID0gYmVhdXRpZmllci5nZXRPcHRpb25zRm9yUGF0aChmaWxlUGF0aClcbiAgICBsb2dnZXIudmVyYm9zZSgnYmVhdXRpZnlGaWxlUGF0aCBhbGxPcHRpb25zJywgYWxsT3B0aW9ucylcblxuICAgICMgQmVhdXRpZnkgRmlsZVxuICAgIGNvbXBsZXRpb25GdW4gPSAob3V0cHV0KSAtPlxuICAgICAgbG9nZ2VyLnZlcmJvc2UoJ2JlYXV0aWZ5RmlsZVBhdGggY29tcGxldGlvbkZ1bicsIG91dHB1dClcbiAgICAgIGlmIG91dHB1dCBpbnN0YW5jZW9mIEVycm9yXG4gICAgICAgIHJldHVybiBjYihvdXRwdXQsIG51bGwgKSAjIG91dHB1dCA9PSBFcnJvclxuICAgICAgZWxzZSBpZiB0eXBlb2Ygb3V0cHV0IGlzIFwic3RyaW5nXCJcbiAgICAgICAgIyBkbyBub3QgYWxsb3cgZW1wdHkgc3RyaW5nXG4gICAgICAgIGlmIG91dHB1dC50cmltKCkgaXMgJydcbiAgICAgICAgICBsb2dnZXIudmVyYm9zZSgnYmVhdXRpZnlGaWxlUGF0aCwgb3V0cHV0IHdhcyBlbXB0eSBzdHJpbmchJylcbiAgICAgICAgICByZXR1cm4gY2IobnVsbCwgb3V0cHV0KVxuICAgICAgICAjIHNhdmUgdG8gZmlsZVxuICAgICAgICBmcy53cml0ZUZpbGUoZmlsZVBhdGgsIG91dHB1dCwgKGVycikgLT5cbiAgICAgICAgICByZXR1cm4gY2IoZXJyKSBpZiBlcnJcbiAgICAgICAgICByZXR1cm4gY2IoIG51bGwgLCBvdXRwdXQpXG4gICAgICAgIClcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIGNiKCBuZXcgRXJyb3IoXCJVbmtub3duIGJlYXV0aWZpY2F0aW9uIHJlc3VsdCAje291dHB1dH0uXCIpLCBvdXRwdXQpXG4gICAgdHJ5XG4gICAgICBsb2dnZXIudmVyYm9zZSgnYmVhdXRpZnknLCBpbnB1dCwgYWxsT3B0aW9ucywgZ3JhbW1hck5hbWUsIGZpbGVQYXRoKVxuICAgICAgYmVhdXRpZmllci5iZWF1dGlmeShpbnB1dCwgYWxsT3B0aW9ucywgZ3JhbW1hck5hbWUsIGZpbGVQYXRoKVxuICAgICAgLnRoZW4oY29tcGxldGlvbkZ1bilcbiAgICAgIC5jYXRjaChjb21wbGV0aW9uRnVuKVxuICAgIGNhdGNoIGVcbiAgICAgIHJldHVybiBjYihlKVxuICAgIClcblxuYmVhdXRpZnlGaWxlID0gKHt0YXJnZXR9KSAtPlxuICBmaWxlUGF0aCA9IHRhcmdldC5kYXRhc2V0LnBhdGhcbiAgcmV0dXJuIHVubGVzcyBmaWxlUGF0aFxuICBiZWF1dGlmeUZpbGVQYXRoKGZpbGVQYXRoLCAoZXJyLCByZXN1bHQpIC0+XG4gICAgcmV0dXJuIHNob3dFcnJvcihlcnIpIGlmIGVyclxuICAgICMgY29uc29sZS5sb2coXCJCZWF1dGlmeSBGaWxlXG4gIClcbiAgcmV0dXJuXG5cbmJlYXV0aWZ5RGlyZWN0b3J5ID0gKHt0YXJnZXR9KSAtPlxuICBkaXJQYXRoID0gdGFyZ2V0LmRhdGFzZXQucGF0aFxuICByZXR1cm4gdW5sZXNzIGRpclBhdGhcblxuICByZXR1cm4gaWYgYXRvbT8uY29uZmlybShcbiAgICBtZXNzYWdlOiBcIlRoaXMgd2lsbCBiZWF1dGlmeSBhbGwgb2YgdGhlIGZpbGVzIGZvdW5kIFxcXG4gICAgICAgIHJlY3Vyc2l2ZWx5IGluIHRoaXMgZGlyZWN0b3J5LCAnI3tkaXJQYXRofScuIFxcXG4gICAgICAgIERvIHlvdSB3YW50IHRvIGNvbnRpbnVlP1wiLFxuICAgIGJ1dHRvbnM6IFsnWWVzLCBjb250aW51ZSEnLCdObywgY2FuY2VsISddKSBpc250IDBcblxuICAjIFNob3cgaW4gcHJvZ3Jlc3MgaW5kaWNhdGUgb24gZGlyZWN0b3J5J3MgdHJlZS12aWV3IGVudHJ5XG4gICQgPz0gcmVxdWlyZShcImF0b20tc3BhY2UtcGVuLXZpZXdzXCIpLiRcbiAgJGVsID0gJChcIi5pY29uLWZpbGUtZGlyZWN0b3J5W2RhdGEtcGF0aD1cXFwiI3tkaXJQYXRofVxcXCJdXCIpXG4gICRlbC5hZGRDbGFzcygnYmVhdXRpZnlpbmcnKVxuXG4gICMgUHJvY2VzcyBEaXJlY3RvcnlcbiAgZGlyID89IHJlcXVpcmUgXCJub2RlLWRpclwiXG4gIGFzeW5jID89IHJlcXVpcmUgXCJhc3luY1wiXG4gIGRpci5maWxlcyhkaXJQYXRoLCAoZXJyLCBmaWxlcykgLT5cbiAgICByZXR1cm4gc2hvd0Vycm9yKGVycikgaWYgZXJyXG5cbiAgICBhc3luYy5lYWNoKGZpbGVzLCAoZmlsZVBhdGgsIGNhbGxiYWNrKSAtPlxuICAgICAgIyBJZ25vcmUgZXJyb3JzXG4gICAgICBiZWF1dGlmeUZpbGVQYXRoKGZpbGVQYXRoLCAtPiBjYWxsYmFjaygpKVxuICAgICwgKGVycikgLT5cbiAgICAgICRlbCA9ICQoXCIuaWNvbi1maWxlLWRpcmVjdG9yeVtkYXRhLXBhdGg9XFxcIiN7ZGlyUGF0aH1cXFwiXVwiKVxuICAgICAgJGVsLnJlbW92ZUNsYXNzKCdiZWF1dGlmeWluZycpXG4gICAgICAjIGNvbnNvbGUubG9nKCdDb21wbGV0ZWQgYmVhdXRpZnlpbmcgZGlyZWN0b3J5IScsIGRpclBhdGgpXG4gICAgKVxuICApXG4gIHJldHVyblxuXG5kZWJ1ZyA9ICgpIC0+XG4gIHRyeVxuICAgIG9wZW4gPSByZXF1aXJlKFwib3BlblwiKVxuICAgIGZzID89IHJlcXVpcmUgXCJmc1wiXG5cbiAgICBwbHVnaW4uY2hlY2tVbnN1cHBvcnRlZE9wdGlvbnMoKVxuXG4gICAgIyBHZXQgY3VycmVudCBlZGl0b3JcbiAgICBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcblxuICAgIGxpbmtpZnlUaXRsZSA9ICh0aXRsZSkgLT5cbiAgICAgIHRpdGxlID0gdGl0bGUudG9Mb3dlckNhc2UoKVxuICAgICAgcCA9IHRpdGxlLnNwbGl0KC9bXFxzLCsjOyxcXC8/OkAmPSskXSsvKSAjIHNwbGl0IGludG8gcGFydHNcbiAgICAgIHNlcCA9IFwiLVwiXG4gICAgICBwLmpvaW4oc2VwKVxuXG4gICAgIyBDaGVjayBpZiB0aGVyZSBpcyBhbiBhY3RpdmUgZWRpdG9yXG4gICAgaWYgbm90IGVkaXRvcj9cbiAgICAgIHJldHVybiBjb25maXJtKFwiQWN0aXZlIEVkaXRvciBub3QgZm91bmQuXFxuXCIgK1xuICAgICAgXCJQbGVhc2Ugc2VsZWN0IGEgVGV4dCBFZGl0b3IgZmlyc3QgdG8gYmVhdXRpZnkuXCIpXG4gICAgcmV0dXJuIHVubGVzcyBjb25maXJtKCdBcmUgeW91IHJlYWR5IHRvIGRlYnVnIEF0b20gQmVhdXRpZnk/JylcbiAgICBkZWJ1Z0luZm8gPSBcIlwiXG4gICAgaGVhZGVycyA9IFtdXG4gICAgdG9jRWwgPSBcIjxUQUJMRU9GQ09OVEVOVFMvPlwiXG4gICAgYWRkSW5mbyA9IChrZXksIHZhbCkgLT5cbiAgICAgIGlmIGtleT9cbiAgICAgICAgZGVidWdJbmZvICs9IFwiKioje2tleX0qKjogI3t2YWx9XFxuXFxuXCJcbiAgICAgIGVsc2VcbiAgICAgICAgZGVidWdJbmZvICs9IFwiI3t2YWx9XFxuXFxuXCJcbiAgICBhZGRIZWFkZXIgPSAobGV2ZWwsIHRpdGxlKSAtPlxuICAgICAgZGVidWdJbmZvICs9IFwiI3tBcnJheShsZXZlbCsxKS5qb2luKCcjJyl9ICN7dGl0bGV9XFxuXFxuXCJcbiAgICAgIGhlYWRlcnMucHVzaCh7XG4gICAgICAgIGxldmVsLCB0aXRsZVxuICAgICAgICB9KVxuICAgIGFkZEhlYWRlcigxLCBcIkF0b20gQmVhdXRpZnkgLSBEZWJ1Z2dpbmcgaW5mb3JtYXRpb25cIilcbiAgICBkZWJ1Z0luZm8gKz0gXCJUaGUgZm9sbG93aW5nIGRlYnVnZ2luZyBpbmZvcm1hdGlvbiB3YXMgXCIgK1xuICAgIFwiZ2VuZXJhdGVkIGJ5IGBBdG9tIEJlYXV0aWZ5YCBvbiBgI3tuZXcgRGF0ZSgpfWAuXCIgK1xuICAgIFwiXFxuXFxuLS0tXFxuXFxuXCIgK1xuICAgIHRvY0VsICtcbiAgICBcIlxcblxcbi0tLVxcblxcblwiXG5cbiAgICAjIFBsYXRmb3JtXG4gICAgYWRkSW5mbygnUGxhdGZvcm0nLCBwcm9jZXNzLnBsYXRmb3JtKVxuICAgIGFkZEhlYWRlcigyLCBcIlZlcnNpb25zXCIpXG5cblxuICAgICMgQXRvbSBWZXJzaW9uXG4gICAgYWRkSW5mbygnQXRvbSBWZXJzaW9uJywgYXRvbS5hcHBWZXJzaW9uKVxuXG5cbiAgICAjIEF0b20gQmVhdXRpZnkgVmVyc2lvblxuICAgIGFkZEluZm8oJ0F0b20gQmVhdXRpZnkgVmVyc2lvbicsIHBrZy52ZXJzaW9uKVxuICAgIGFkZEhlYWRlcigyLCBcIk9yaWdpbmFsIGZpbGUgdG8gYmUgYmVhdXRpZmllZFwiKVxuXG5cbiAgICAjIE9yaWdpbmFsIGZpbGVcbiAgICAjXG4gICAgIyBHZXQgZWRpdG9yIHBhdGggYW5kIGNvbmZpZ3VyYXRpb25zIGZvciBwYXRoc1xuICAgIGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuXG4gICAgIyBQYXRoXG4gICAgYWRkSW5mbygnT3JpZ2luYWwgRmlsZSBQYXRoJywgXCJgI3tmaWxlUGF0aH1gXCIpXG5cbiAgICAjIEdldCBHcmFtbWFyXG4gICAgZ3JhbW1hck5hbWUgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWVcblxuICAgICMgR3JhbW1hclxuICAgIGFkZEluZm8oJ09yaWdpbmFsIEZpbGUgR3JhbW1hcicsIGdyYW1tYXJOYW1lKVxuXG4gICAgIyBMYW5ndWFnZVxuICAgIGxhbmd1YWdlID0gYmVhdXRpZmllci5nZXRMYW5ndWFnZShncmFtbWFyTmFtZSwgZmlsZVBhdGgpXG4gICAgYWRkSW5mbygnT3JpZ2luYWwgRmlsZSBMYW5ndWFnZScsIGxhbmd1YWdlPy5uYW1lKVxuICAgIGFkZEluZm8oJ0xhbmd1YWdlIG5hbWVzcGFjZScsIGxhbmd1YWdlPy5uYW1lc3BhY2UpXG5cbiAgICAjIEJlYXV0aWZpZXJcbiAgICBiZWF1dGlmaWVycyA9IGJlYXV0aWZpZXIuZ2V0QmVhdXRpZmllcnMobGFuZ3VhZ2UubmFtZSlcbiAgICBhZGRJbmZvKCdTdXBwb3J0ZWQgQmVhdXRpZmllcnMnLCBfLm1hcChiZWF1dGlmaWVycywgJ25hbWUnKS5qb2luKCcsICcpKVxuICAgIHNlbGVjdGVkQmVhdXRpZmllciA9IGJlYXV0aWZpZXIuZ2V0QmVhdXRpZmllckZvckxhbmd1YWdlKGxhbmd1YWdlKVxuICAgIGFkZEluZm8oJ1NlbGVjdGVkIEJlYXV0aWZpZXInLCBzZWxlY3RlZEJlYXV0aWZpZXIubmFtZSlcblxuICAgICMgR2V0IGN1cnJlbnQgZWRpdG9yJ3MgdGV4dFxuICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpIG9yIFwiXCJcblxuICAgICMgQ29udGVudHNcbiAgICBjb2RlQmxvY2tTeW50YXggPSAobGFuZ3VhZ2U/Lm5hbWUgPyBncmFtbWFyTmFtZSkudG9Mb3dlckNhc2UoKS5zcGxpdCgnICcpWzBdXG4gICAgYWRkSGVhZGVyKDMsICdPcmlnaW5hbCBGaWxlIENvbnRlbnRzJylcbiAgICBhZGRJbmZvKG51bGwsIFwiXFxuYGBgI3tjb2RlQmxvY2tTeW50YXh9XFxuI3t0ZXh0fVxcbmBgYFwiKVxuXG4gICAgYWRkSGVhZGVyKDMsICdQYWNrYWdlIFNldHRpbmdzJylcbiAgICBhZGRJbmZvKG51bGwsXG4gICAgICBcIlRoZSByYXcgcGFja2FnZSBzZXR0aW5ncyBvcHRpb25zXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShhdG9tLmNvbmZpZy5nZXQoJ2F0b20tYmVhdXRpZnknKSwgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcblxuICAgICMgQmVhdXRpZmljYXRpb24gT3B0aW9uc1xuICAgIGFkZEhlYWRlcigyLCBcIkJlYXV0aWZpY2F0aW9uIG9wdGlvbnNcIilcbiAgICAjIEdldCBhbGwgb3B0aW9uc1xuICAgIGFsbE9wdGlvbnMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JQYXRoKGZpbGVQYXRoLCBlZGl0b3IpXG4gICAgIyBSZXNvbHZlIG9wdGlvbnMgd2l0aCBwcm9taXNlc1xuICAgIFByb21pc2UuYWxsKGFsbE9wdGlvbnMpXG4gICAgLnRoZW4oKGFsbE9wdGlvbnMpIC0+XG4gICAgICAjIEV4dHJhY3Qgb3B0aW9uc1xuICAgICAgW1xuICAgICAgICAgIGVkaXRvck9wdGlvbnNcbiAgICAgICAgICBjb25maWdPcHRpb25zXG4gICAgICAgICAgaG9tZU9wdGlvbnNcbiAgICAgICAgICBlZGl0b3JDb25maWdPcHRpb25zXG4gICAgICBdID0gYWxsT3B0aW9uc1xuICAgICAgcHJvamVjdE9wdGlvbnMgPSBhbGxPcHRpb25zWzQuLl1cblxuICAgICAgcHJlVHJhbnNmb3JtZWRPcHRpb25zID0gYmVhdXRpZmllci5nZXRPcHRpb25zRm9yTGFuZ3VhZ2UoYWxsT3B0aW9ucywgbGFuZ3VhZ2UpXG5cbiAgICAgIGlmIHNlbGVjdGVkQmVhdXRpZmllclxuICAgICAgICBmaW5hbE9wdGlvbnMgPSBiZWF1dGlmaWVyLnRyYW5zZm9ybU9wdGlvbnMoc2VsZWN0ZWRCZWF1dGlmaWVyLCBsYW5ndWFnZS5uYW1lLCBwcmVUcmFuc2Zvcm1lZE9wdGlvbnMpXG5cbiAgICAgICMgU2hvdyBvcHRpb25zXG4gICAgICAjIGFkZEluZm8oJ0FsbCBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICAjIFwiQWxsIG9wdGlvbnMgZXh0cmFjdGVkIGZvciBmaWxlXFxuXCIgK1xuICAgICAgIyBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGFsbE9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdFZGl0b3IgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgXCJPcHRpb25zIGZyb20gQXRvbSBFZGl0b3Igc2V0dGluZ3NcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGVkaXRvck9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdDb25maWcgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgXCJPcHRpb25zIGZyb20gQXRvbSBCZWF1dGlmeSBwYWNrYWdlIHNldHRpbmdzXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShjb25maWdPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnSG9tZSBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBgI3twYXRoLnJlc29sdmUoYmVhdXRpZmllci5nZXRVc2VySG9tZSgpLCAnLmpzYmVhdXRpZnlyYycpfWBcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGhvbWVPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnRWRpdG9yQ29uZmlnIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIFtFZGl0b3JDb25maWddKGh0dHA6Ly9lZGl0b3Jjb25maWcub3JnLykgZmlsZVxcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoZWRpdG9yQ29uZmlnT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ1Byb2plY3QgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgXCJPcHRpb25zIGZyb20gYC5qc2JlYXV0aWZ5cmNgIGZpbGVzIHN0YXJ0aW5nIGZyb20gZGlyZWN0b3J5IGAje3BhdGguZGlybmFtZShmaWxlUGF0aCl9YCBhbmQgZ29pbmcgdXAgdG8gcm9vdFxcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkocHJvamVjdE9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdQcmUtVHJhbnNmb3JtZWQgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgXCJDb21iaW5lZCBvcHRpb25zIGJlZm9yZSB0cmFuc2Zvcm1pbmcgdGhlbSBnaXZlbiBhIGJlYXV0aWZpZXIncyBzcGVjaWZpY2F0aW9uc1xcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkocHJlVHJhbnNmb3JtZWRPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgaWYgc2VsZWN0ZWRCZWF1dGlmaWVyXG4gICAgICAgIGFkZEhlYWRlcigzLCAnRmluYWwgT3B0aW9ucycpXG4gICAgICAgIGFkZEluZm8obnVsbCxcbiAgICAgICAgICBcIkZpbmFsIGNvbWJpbmVkIGFuZCB0cmFuc2Zvcm1lZCBvcHRpb25zIHRoYXQgYXJlIHVzZWRcXG5cIiArXG4gICAgICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShmaW5hbE9wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG5cbiAgICAgICNcbiAgICAgIGxvZ3MgPSBcIlwiXG4gICAgICBsb2dGaWxlUGF0aFJlZ2V4ID0gbmV3IFJlZ0V4cCgnXFxcXDogXFxcXFsoLiopXFxcXF0nKVxuICAgICAgc3Vic2NyaXB0aW9uID0gbG9nZ2VyLm9uTG9nZ2luZygobXNnKSAtPlxuICAgICAgICAjIGNvbnNvbGUubG9nKCdsb2dnaW5nJywgbXNnKVxuICAgICAgICBzZXAgPSBwYXRoLnNlcFxuICAgICAgICBsb2dzICs9IG1zZy5yZXBsYWNlKGxvZ0ZpbGVQYXRoUmVnZXgsIChhLGIpIC0+XG4gICAgICAgICAgcyA9IGIuc3BsaXQoc2VwKVxuICAgICAgICAgIGkgPSBzLmluZGV4T2YoJ2F0b20tYmVhdXRpZnknKVxuICAgICAgICAgIHAgPSBzLnNsaWNlKGkrMikuam9pbihzZXApXG4gICAgICAgICAgIyBjb25zb2xlLmxvZygnbG9nZ2luZycsIGFyZ3VtZW50cywgcywgaSwgcClcbiAgICAgICAgICByZXR1cm4gJzogWycrcCsnXSdcbiAgICAgICAgKVxuICAgICAgKVxuICAgICAgY2IgPSAocmVzdWx0KSAtPlxuICAgICAgICBzdWJzY3JpcHRpb24uZGlzcG9zZSgpXG4gICAgICAgIGFkZEhlYWRlcigyLCBcIlJlc3VsdHNcIilcblxuICAgICAgICAjIExvZ3NcbiAgICAgICAgYWRkSW5mbygnQmVhdXRpZmllZCBGaWxlIENvbnRlbnRzJywgXCJcXG5gYGAje2NvZGVCbG9ja1N5bnRheH1cXG4je3Jlc3VsdH1cXG5gYGBcIilcbiAgICAgICAgIyBEaWZmXG4gICAgICAgIEpzRGlmZiA9IHJlcXVpcmUoJ2RpZmYnKVxuICAgICAgICBpZiB0eXBlb2YgcmVzdWx0IGlzIFwic3RyaW5nXCJcbiAgICAgICAgICBkaWZmID0gSnNEaWZmLmNyZWF0ZVBhdGNoKGZpbGVQYXRoIG9yIFwiXCIsIHRleHQgb3IgXCJcIiwgXFxcbiAgICAgICAgICAgIHJlc3VsdCBvciBcIlwiLCBcIm9yaWdpbmFsXCIsIFwiYmVhdXRpZmllZFwiKVxuICAgICAgICAgIGFkZEluZm8oJ09yaWdpbmFsIHZzLiBCZWF1dGlmaWVkIERpZmYnLCBcIlxcbmBgYCN7Y29kZUJsb2NrU3ludGF4fVxcbiN7ZGlmZn1cXG5gYGBcIilcblxuICAgICAgICBhZGRIZWFkZXIoMywgXCJMb2dzXCIpXG4gICAgICAgIGFkZEluZm8obnVsbCwgXCJgYGBcXG4je2xvZ3N9XFxuYGBgXCIpXG5cbiAgICAgICAgIyBCdWlsZCBUYWJsZSBvZiBDb250ZW50c1xuICAgICAgICB0b2MgPSBcIiMjIFRhYmxlIE9mIENvbnRlbnRzXFxuXCJcbiAgICAgICAgZm9yIGhlYWRlciBpbiBoZWFkZXJzXG4gICAgICAgICAgIyMjXG4gICAgICAgICAgLSBIZWFkaW5nIDFcbiAgICAgICAgICAgIC0gSGVhZGluZyAxLjFcbiAgICAgICAgICAjIyNcbiAgICAgICAgICBpbmRlbnQgPSBcIiAgXCIgIyAyIHNwYWNlc1xuICAgICAgICAgIGJ1bGxldCA9IFwiLVwiXG4gICAgICAgICAgaW5kZW50TnVtID0gaGVhZGVyLmxldmVsIC0gMlxuICAgICAgICAgIGlmIGluZGVudE51bSA+PSAwXG4gICAgICAgICAgICB0b2MgKz0gKFwiI3tBcnJheShpbmRlbnROdW0rMSkuam9pbihpbmRlbnQpfSN7YnVsbGV0fSBbI3toZWFkZXIudGl0bGV9XShcXCMje2xpbmtpZnlUaXRsZShoZWFkZXIudGl0bGUpfSlcXG5cIilcbiAgICAgICAgIyBSZXBsYWNlIFRBQkxFT0ZDT05URU5UU1xuICAgICAgICBkZWJ1Z0luZm8gPSBkZWJ1Z0luZm8ucmVwbGFjZSh0b2NFbCwgdG9jKVxuXG4gICAgICAgICMgU2F2ZSB0byBuZXcgVGV4dEVkaXRvclxuICAgICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKClcbiAgICAgICAgICAudGhlbigoZWRpdG9yKSAtPlxuICAgICAgICAgICAgZWRpdG9yLnNldFRleHQoZGVidWdJbmZvKVxuICAgICAgICAgICAgY29uZmlybShcIlwiXCJQbGVhc2UgbG9naW4gdG8gR2l0SHViIGFuZCBjcmVhdGUgYSBHaXN0IG5hbWVkIFxcXCJkZWJ1Zy5tZFxcXCIgKE1hcmtkb3duIGZpbGUpIHdpdGggeW91ciBkZWJ1Z2dpbmcgaW5mb3JtYXRpb24uXG4gICAgICAgICAgICBUaGVuIGFkZCBhIGxpbmsgdG8geW91ciBHaXN0IGluIHlvdXIgR2l0SHViIElzc3VlLlxuICAgICAgICAgICAgVGhhbmsgeW91IVxuXG4gICAgICAgICAgICBHaXN0OiBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9cbiAgICAgICAgICAgIEdpdEh1YiBJc3N1ZXM6IGh0dHBzOi8vZ2l0aHViLmNvbS9HbGF2aW4wMDEvYXRvbS1iZWF1dGlmeS9pc3N1ZXNcbiAgICAgICAgICAgIFwiXCJcIilcbiAgICAgICAgICApXG4gICAgICAgICAgLmNhdGNoKChlcnJvcikgLT5cbiAgICAgICAgICAgIGNvbmZpcm0oXCJBbiBlcnJvciBvY2N1cnJlZCB3aGVuIGNyZWF0aW5nIHRoZSBHaXN0OiBcIitlcnJvci5tZXNzYWdlKVxuICAgICAgICAgIClcbiAgICAgIHRyeVxuICAgICAgICBiZWF1dGlmaWVyLmJlYXV0aWZ5KHRleHQsIGFsbE9wdGlvbnMsIGdyYW1tYXJOYW1lLCBmaWxlUGF0aClcbiAgICAgICAgLnRoZW4oY2IpXG4gICAgICAgIC5jYXRjaChjYilcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgcmV0dXJuIGNiKGUpXG4gICAgKVxuICAgIC5jYXRjaCgoZXJyb3IpIC0+XG4gICAgICBzdGFjayA9IGVycm9yLnN0YWNrXG4gICAgICBkZXRhaWwgPSBlcnJvci5kZXNjcmlwdGlvbiBvciBlcnJvci5tZXNzYWdlXG4gICAgICBhdG9tPy5ub3RpZmljYXRpb25zPy5hZGRFcnJvcihlcnJvci5tZXNzYWdlLCB7XG4gICAgICAgIHN0YWNrLCBkZXRhaWwsIGRpc21pc3NhYmxlIDogdHJ1ZVxuICAgICAgfSlcbiAgICApXG4gIGNhdGNoIGVycm9yXG4gICAgc3RhY2sgPSBlcnJvci5zdGFja1xuICAgIGRldGFpbCA9IGVycm9yLmRlc2NyaXB0aW9uIG9yIGVycm9yLm1lc3NhZ2VcbiAgICBhdG9tPy5ub3RpZmljYXRpb25zPy5hZGRFcnJvcihlcnJvci5tZXNzYWdlLCB7XG4gICAgICBzdGFjaywgZGV0YWlsLCBkaXNtaXNzYWJsZSA6IHRydWVcbiAgICB9KVxuXG5oYW5kbGVTYXZlRXZlbnQgPSAtPlxuICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgLT5cbiAgICBwZW5kaW5nUGF0aHMgPSB7fVxuICAgIGJlYXV0aWZ5T25TYXZlSGFuZGxlciA9ICh7cGF0aDogZmlsZVBhdGh9KSAtPlxuICAgICAgbG9nZ2VyLnZlcmJvc2UoJ1Nob3VsZCBiZWF1dGlmeSBvbiB0aGlzIHNhdmU/JylcbiAgICAgIGlmIHBlbmRpbmdQYXRoc1tmaWxlUGF0aF1cbiAgICAgICAgbG9nZ2VyLnZlcmJvc2UoXCJFZGl0b3Igd2l0aCBmaWxlIHBhdGggI3tmaWxlUGF0aH0gYWxyZWFkeSBiZWF1dGlmaWVkIVwiKVxuICAgICAgICByZXR1cm5cbiAgICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgcGF0aCA/PSByZXF1aXJlKCdwYXRoJylcbiAgICAgICMgR2V0IEdyYW1tYXJcbiAgICAgIGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWVcbiAgICAgICMgR2V0IGZpbGUgZXh0ZW5zaW9uXG4gICAgICBmaWxlRXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGVQYXRoKVxuICAgICAgIyBSZW1vdmUgcHJlZml4IFwiLlwiIChwZXJpb2QpIGluIGZpbGVFeHRlbnNpb25cbiAgICAgIGZpbGVFeHRlbnNpb24gPSBmaWxlRXh0ZW5zaW9uLnN1YnN0cigxKVxuICAgICAgIyBHZXQgbGFuZ3VhZ2VcbiAgICAgIGxhbmd1YWdlcyA9IGJlYXV0aWZpZXIubGFuZ3VhZ2VzLmdldExhbmd1YWdlcyh7Z3JhbW1hciwgZXh0ZW5zaW9uOiBmaWxlRXh0ZW5zaW9ufSlcbiAgICAgIGlmIGxhbmd1YWdlcy5sZW5ndGggPCAxXG4gICAgICAgIHJldHVyblxuICAgICAgIyBUT0RPOiBzZWxlY3QgYXBwcm9wcmlhdGUgbGFuZ3VhZ2VcbiAgICAgIGxhbmd1YWdlID0gbGFuZ3VhZ2VzWzBdXG4gICAgICAjIEdldCBsYW5ndWFnZSBjb25maWdcbiAgICAgIGtleSA9IFwiYXRvbS1iZWF1dGlmeS4je2xhbmd1YWdlLm5hbWVzcGFjZX0uYmVhdXRpZnlfb25fc2F2ZVwiXG4gICAgICBiZWF1dGlmeU9uU2F2ZSA9IGF0b20uY29uZmlnLmdldChrZXkpXG4gICAgICBsb2dnZXIudmVyYm9zZSgnc2F2ZSBlZGl0b3IgcG9zaXRpb25zJywga2V5LCBiZWF1dGlmeU9uU2F2ZSlcbiAgICAgIGlmIGJlYXV0aWZ5T25TYXZlXG4gICAgICAgIGxvZ2dlci52ZXJib3NlKCdCZWF1dGlmeWluZyBmaWxlJywgZmlsZVBhdGgpXG4gICAgICAgIGJlYXV0aWZ5KHtlZGl0b3IsIG9uU2F2ZTogdHJ1ZX0pXG4gICAgICAgIC50aGVuKCgpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2UoJ0RvbmUgYmVhdXRpZnlpbmcgZmlsZScsIGZpbGVQYXRoKVxuICAgICAgICAgIGlmIGVkaXRvci5pc0FsaXZlKCkgaXMgdHJ1ZVxuICAgICAgICAgICAgbG9nZ2VyLnZlcmJvc2UoJ1NhdmluZyBUZXh0RWRpdG9yLi4uJylcbiAgICAgICAgICAgICMgU3RvcmUgdGhlIGZpbGVQYXRoIHRvIHByZXZlbnQgaW5maW5pdGUgbG9vcGluZ1xuICAgICAgICAgICAgIyBXaGVuIFdoaXRlc3BhY2UgcGFja2FnZSBoYXMgb3B0aW9uIFwiRW5zdXJlIFNpbmdsZSBUcmFpbGluZyBOZXdsaW5lXCIgZW5hYmxlZFxuICAgICAgICAgICAgIyBJdCB3aWxsIGFkZCBhIG5ld2xpbmUgYW5kIGtlZXAgdGhlIGZpbGUgZnJvbSBjb252ZXJnaW5nIG9uIGEgYmVhdXRpZmllZCBmb3JtXG4gICAgICAgICAgICAjIGFuZCBzYXZpbmcgd2l0aG91dCBlbWl0dGluZyBvbkRpZFNhdmUgZXZlbnQsIGJlY2F1c2UgdGhlcmUgd2VyZSBubyBjaGFuZ2VzLlxuICAgICAgICAgICAgcGVuZGluZ1BhdGhzW2ZpbGVQYXRoXSA9IHRydWVcbiAgICAgICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgICAgIGRlbGV0ZSBwZW5kaW5nUGF0aHNbZmlsZVBhdGhdXG4gICAgICAgICAgICBsb2dnZXIudmVyYm9zZSgnU2F2ZWQgVGV4dEVkaXRvci4nKVxuICAgICAgICApXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpIC0+XG4gICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlcnJvcilcbiAgICAgICAgKVxuICAgIGRpc3Bvc2FibGUgPSBlZGl0b3Iub25EaWRTYXZlKCh7cGF0aCA6IGZpbGVQYXRofSkgLT5cbiAgICAgICMgVE9ETzogSW1wbGVtZW50IGRlYm91bmNpbmdcbiAgICAgIGJlYXV0aWZ5T25TYXZlSGFuZGxlcih7cGF0aDogZmlsZVBhdGh9KVxuICAgIClcbiAgICBwbHVnaW4uc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zYWJsZVxuXG5nZXRVbnN1cHBvcnRlZE9wdGlvbnMgPSAtPlxuICBzZXR0aW5ncyA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1iZWF1dGlmeScpXG4gIHNjaGVtYSA9IGF0b20uY29uZmlnLmdldFNjaGVtYSgnYXRvbS1iZWF1dGlmeScpXG4gIHVuc3VwcG9ydGVkT3B0aW9ucyA9IF8uZmlsdGVyKF8ua2V5cyhzZXR0aW5ncyksIChrZXkpIC0+XG4gICAgIyByZXR1cm4gYXRvbS5jb25maWcuZ2V0U2NoZW1hKFwiYXRvbS1iZWF1dGlmeS4ke2tleX1cIikudHlwZVxuICAgICMgcmV0dXJuIHR5cGVvZiBzZXR0aW5nc1trZXldXG4gICAgc2NoZW1hLnByb3BlcnRpZXNba2V5XSBpcyB1bmRlZmluZWRcbiAgKVxuICByZXR1cm4gdW5zdXBwb3J0ZWRPcHRpb25zXG5cbnBsdWdpbi5jaGVja1Vuc3VwcG9ydGVkT3B0aW9ucyA9IC0+XG4gIHVuc3VwcG9ydGVkT3B0aW9ucyA9IGdldFVuc3VwcG9ydGVkT3B0aW9ucygpXG4gIGlmIHVuc3VwcG9ydGVkT3B0aW9ucy5sZW5ndGggaXNudCAwXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJQbGVhc2UgcnVuIEF0b20gY29tbWFuZCAnQXRvbS1CZWF1dGlmeTogTWlncmF0ZSBTZXR0aW5ncycuXCIsIHtcbiAgICAgIGRldGFpbCA6IFwiWW91IGNhbiBvcGVuIHRoZSBBdG9tIGNvbW1hbmQgcGFsZXR0ZSB3aXRoIGBjbWQtc2hpZnQtcGAgKE9TWCkgb3IgYGN0cmwtc2hpZnQtcGAgKExpbnV4L1dpbmRvd3MpIGluIEF0b20uIFlvdSBoYXZlIHVuc3VwcG9ydGVkIG9wdGlvbnM6ICN7dW5zdXBwb3J0ZWRPcHRpb25zLmpvaW4oJywgJyl9XCIsXG4gICAgICBkaXNtaXNzYWJsZSA6IHRydWVcbiAgICB9KVxuXG5wbHVnaW4ubWlncmF0ZVNldHRpbmdzID0gLT5cbiAgdW5zdXBwb3J0ZWRPcHRpb25zID0gZ2V0VW5zdXBwb3J0ZWRPcHRpb25zKClcbiAgbmFtZXNwYWNlcyA9IGJlYXV0aWZpZXIubGFuZ3VhZ2VzLm5hbWVzcGFjZXNcbiAgIyBjb25zb2xlLmxvZygnbWlncmF0ZS1zZXR0aW5ncycsIHNjaGVtYSwgbmFtZXNwYWNlcywgdW5zdXBwb3J0ZWRPcHRpb25zKVxuICBpZiB1bnN1cHBvcnRlZE9wdGlvbnMubGVuZ3RoIGlzIDBcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIk5vIG9wdGlvbnMgdG8gbWlncmF0ZS5cIilcbiAgZWxzZVxuICAgIHJleCA9IG5ldyBSZWdFeHAoXCIoI3tuYW1lc3BhY2VzLmpvaW4oJ3wnKX0pXyguKilcIilcbiAgICByZW5hbWUgPSBfLnRvUGFpcnMoXy56aXBPYmplY3QodW5zdXBwb3J0ZWRPcHRpb25zLCBfLm1hcCh1bnN1cHBvcnRlZE9wdGlvbnMsIChrZXkpIC0+XG4gICAgICBtID0ga2V5Lm1hdGNoKHJleClcbiAgICAgIGlmIG0gaXMgbnVsbFxuICAgICAgICAjIERpZCBub3QgbWF0Y2hcbiAgICAgICAgIyBQdXQgaW50byBnZW5lcmFsXG4gICAgICAgIHJldHVybiBcImdlbmVyYWwuI3trZXl9XCJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIFwiI3ttWzFdfS4je21bMl19XCJcbiAgICApKSlcbiAgICAjIGNvbnNvbGUubG9nKCdyZW5hbWUnLCByZW5hbWUpXG4gICAgIyBsb2dnZXIudmVyYm9zZSgncmVuYW1lJywgcmVuYW1lKVxuXG4gICAgIyBNb3ZlIGFsbCBvcHRpb24gdmFsdWVzIHRvIHJlbmFtZWQga2V5XG4gICAgXy5lYWNoKHJlbmFtZSwgKFtrZXksIG5ld0tleV0pIC0+XG4gICAgICAjIENvcHkgdG8gbmV3IGtleVxuICAgICAgdmFsID0gYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1iZWF1dGlmeS4je2tleX1cIilcbiAgICAgICMgY29uc29sZS5sb2coJ3JlbmFtZScsIGtleSwgbmV3S2V5LCB2YWwpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJhdG9tLWJlYXV0aWZ5LiN7bmV3S2V5fVwiLCB2YWwpXG4gICAgICAjIERlbGV0ZSBvbGQga2V5XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJhdG9tLWJlYXV0aWZ5LiN7a2V5fVwiLCB1bmRlZmluZWQpXG4gICAgKVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiU3VjY2Vzc2Z1bGx5IG1pZ3JhdGVkIG9wdGlvbnM6ICN7dW5zdXBwb3J0ZWRPcHRpb25zLmpvaW4oJywgJyl9XCIpXG5cbnBsdWdpbi5jb25maWcgPSBfLm1lcmdlKHJlcXVpcmUoJy4vY29uZmlnLmNvZmZlZScpLCBkZWZhdWx0TGFuZ3VhZ2VPcHRpb25zKVxucGx1Z2luLmFjdGl2YXRlID0gLT5cbiAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgaGFuZGxlU2F2ZUV2ZW50KClcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWVkaXRvclwiLCBiZWF1dGlmeVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tYmVhdXRpZnk6aGVscC1kZWJ1Zy1lZGl0b3JcIiwgZGVidWdcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiLnRyZWUtdmlldyAuZmlsZSAubmFtZVwiLCBcImF0b20tYmVhdXRpZnk6YmVhdXRpZnktZmlsZVwiLCBiZWF1dGlmeUZpbGVcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiLnRyZWUtdmlldyAuZGlyZWN0b3J5IC5uYW1lXCIsIFwiYXRvbS1iZWF1dGlmeTpiZWF1dGlmeS1kaXJlY3RvcnlcIiwgYmVhdXRpZnlEaXJlY3RvcnlcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJhdG9tLWJlYXV0aWZ5Om1pZ3JhdGUtc2V0dGluZ3NcIiwgcGx1Z2luLm1pZ3JhdGVTZXR0aW5nc1xuXG5wbHVnaW4uZGVhY3RpdmF0ZSA9IC0+XG4gIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuIl19
