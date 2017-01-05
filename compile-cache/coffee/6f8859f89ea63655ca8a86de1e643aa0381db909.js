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
    var GitHubApi, addHeader, addInfo, allOptions, beautifiers, codeBlockSyntax, debugInfo, detail, editor, error, filePath, github, grammarName, headers, language, linkifyTitle, open, ref, ref1, selectedBeautifier, stack, text, tocEl;
    try {
      open = require("open");
      if (fs == null) {
        fs = require("fs");
      }
      GitHubApi = require("github");
      github = new GitHubApi();
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
      if (!confirm('Are you ready to debug Atom Beautify?\n\n' + 'Warning: This will create an anonymous Gist on GitHub (publically accessible and cannot be easily deleted) ' + 'containing the contents of your active Text Editor.\n' + 'Be sure to delete any private text from your active Text Editor before continuing ' + 'to ensure you are not sharing undesirable private information.')) {
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
          return github.gists.create({
            files: {
              "debug.md": {
                "content": debugInfo
              }
            },
            "public": true,
            description: "Atom-Beautify debugging information"
          }, function(err, res) {
            var body, gistUrl, issueTemplate;
            if (err) {
              return confirm("An error occurred when creating the Gist: " + err);
            } else {
              gistUrl = res.html_url;
              open(gistUrl);
              confirm(("Your Atom Beautify debugging information can be found in the public Gist:\n" + res.html_url + "\n\n") + 'Warning: Be sure to look over the debug info before you send it ' + 'to ensure you are not sharing undesirable private information.\n\n' + 'If you want to delete this anonymous Gist read\n' + 'https://help.github.com/articles/deleting-an-anonymous-gist/');
              if (!confirm("Would you like to create a new Issue on GitHub now?")) {
                return;
              }
              issueTemplate = fs.readFileSync(path.resolve(__dirname, "../ISSUE_TEMPLATE.md")).toString();
              body = issueTemplate.replace("<INSERT GIST HERE>", gistUrl);
              return open("https://github.com/Glavin001/atom-beautify/issues/new?body=" + (encodeURIComponent(body)));
            }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmeS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0E7RUFBQTtBQUFBLE1BQUE7O0VBQ0EsR0FBQSxHQUFNLE9BQUEsQ0FBUSxpQkFBUjs7RUFHTixNQUFBLEdBQVMsTUFBTSxDQUFDOztFQUNmLHNCQUF1QixPQUFBLENBQVEsV0FBUjs7RUFDeEIsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSOztFQUNKLFdBQUEsR0FBYyxPQUFBLENBQVEsZUFBUjs7RUFDZCxVQUFBLEdBQWlCLElBQUEsV0FBQSxDQUFBOztFQUNqQixzQkFBQSxHQUF5QixVQUFVLENBQUM7O0VBQ3BDLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUFBLENBQW9CLFVBQXBCOztFQUNULE9BQUEsR0FBVSxPQUFBLENBQVEsVUFBUjs7RUFHVixFQUFBLEdBQUs7O0VBQ0wsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSOztFQUNQLEtBQUEsR0FBUTs7RUFDUixJQUFBLEdBQU87O0VBQ1AsS0FBQSxHQUFROztFQUNSLEdBQUEsR0FBTTs7RUFDTixXQUFBLEdBQWM7O0VBQ2QsV0FBQSxHQUFjOztFQUNkLENBQUEsR0FBSTs7RUFNSixZQUFBLEdBQWUsU0FBQyxNQUFEO0FBQ2IsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7MEJBQ1AsSUFBSSxDQUFFLFlBQU4sQ0FBQTtFQUZhOztFQUdmLFlBQUEsR0FBZSxTQUFDLE1BQUQsRUFBUyxLQUFUO0FBQ2IsUUFBQTtJQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQVgsQ0FBbUIsTUFBbkI7MEJBQ1AsSUFBSSxDQUFFLFlBQU4sQ0FBbUIsS0FBbkI7RUFGYTs7RUFJZixVQUFBLEdBQWEsU0FBQyxNQUFEO0FBQ1gsUUFBQTtJ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LEVBQW9DLGlDQUFwQyxFQUF1RSxLQUF2RSxDQUFuQjtJQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0Isd0JBQWxCLEVBQTRDLDZCQUE1QyxFQUEyRSxZQUEzRSxDQUFuQjtJQUNBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFJLENBQUMsUUFBUSxDQUFDLEdBQWQsQ0FBa0IsNkJBQWxCLEVBQWlELGtDQUFqRCxFQUFxRixpQkFBckYsQ0FBbkI7V0FDQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQyxnQ0FBcEMsRUFBc0UsTUFBTSxDQUFDLGVBQTdFLENBQW5CO0VBUGdCOztFQVNsQixNQUFNLENBQUMsVUFBUCxHQUFvQixTQUFBO1dBQ2xCLElBQUMsQ0FBQSxhQUFhLENBQUMsT0FBZixDQUFBO0VBRGtCO0FBaG9CcEIiLCJzb3VyY2VzQ29udGVudCI6WyIjIGdsb2JhbCBhdG9tXG5cInVzZSBzdHJpY3RcIlxucGtnID0gcmVxdWlyZSgnLi4vcGFja2FnZS5qc29uJylcblxuIyBEZXBlbmRlbmNpZXNcbnBsdWdpbiA9IG1vZHVsZS5leHBvcnRzXG57Q29tcG9zaXRlRGlzcG9zYWJsZX0gPSByZXF1aXJlICdldmVudC1raXQnXG5fID0gcmVxdWlyZShcImxvZGFzaFwiKVxuQmVhdXRpZmllcnMgPSByZXF1aXJlKFwiLi9iZWF1dGlmaWVyc1wiKVxuYmVhdXRpZmllciA9IG5ldyBCZWF1dGlmaWVycygpXG5kZWZhdWx0TGFuZ3VhZ2VPcHRpb25zID0gYmVhdXRpZmllci5vcHRpb25zXG5sb2dnZXIgPSByZXF1aXJlKCcuL2xvZ2dlcicpKF9fZmlsZW5hbWUpXG5Qcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKVxuXG4jIExhenkgbG9hZGVkIGRlcGVuZGVuY2llc1xuZnMgPSBudWxsXG5wYXRoID0gcmVxdWlyZShcInBhdGhcIilcbnN0cmlwID0gbnVsbFxueWFtbCA9IG51bGxcbmFzeW5jID0gbnVsbFxuZGlyID0gbnVsbCAjIE5vZGUtRGlyXG5Mb2FkaW5nVmlldyA9IG51bGxcbmxvYWRpbmdWaWV3ID0gbnVsbFxuJCA9IG51bGxcblxuIyBmdW5jdGlvbiBjbGVhbk9wdGlvbnMoZGF0YSwgdHlwZXMpIHtcbiMgbm9wdC5jbGVhbihkYXRhLCB0eXBlcyk7XG4jIHJldHVybiBkYXRhO1xuIyB9XG5nZXRTY3JvbGxUb3AgPSAoZWRpdG9yKSAtPlxuICB2aWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgdmlldz8uZ2V0U2Nyb2xsVG9wKClcbnNldFNjcm9sbFRvcCA9IChlZGl0b3IsIHZhbHVlKSAtPlxuICB2aWV3ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcilcbiAgdmlldz8uc2V0U2Nyb2xsVG9wIHZhbHVlXG5cbmdldEN1cnNvcnMgPSAoZWRpdG9yKSAtPlxuICBjdXJzb3JzID0gZWRpdG9yLmdldEN1cnNvcnMoKVxuICBwb3NBcnJheSA9IFtdXG4gIGZvciBjdXJzb3IgaW4gY3Vyc29yc1xuICAgIGJ1ZmZlclBvc2l0aW9uID0gY3Vyc29yLmdldEJ1ZmZlclBvc2l0aW9uKClcbiAgICBwb3NBcnJheS5wdXNoIFtcbiAgICAgIGJ1ZmZlclBvc2l0aW9uLnJvd1xuICAgICAgYnVmZmVyUG9zaXRpb24uY29sdW1uXG4gICAgXVxuICBwb3NBcnJheVxuc2V0Q3Vyc29ycyA9IChlZGl0b3IsIHBvc0FycmF5KSAtPlxuXG4gICMgY29uc29sZS5sb2cgXCJzZXRDdXJzb3JzOlxuICBmb3IgYnVmZmVyUG9zaXRpb24sIGkgaW4gcG9zQXJyYXlcbiAgICBpZiBpIGlzIDBcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbiBidWZmZXJQb3NpdGlvblxuICAgICAgY29udGludWVcbiAgICBlZGl0b3IuYWRkQ3Vyc29yQXRCdWZmZXJQb3NpdGlvbiBidWZmZXJQb3NpdGlvblxuICByZXR1cm5cblxuIyBTaG93IGJlYXV0aWZpY2F0aW9uIHByb2dyZXNzL2xvYWRpbmcgdmlld1xuYmVhdXRpZmllci5vbignYmVhdXRpZnk6OnN0YXJ0JywgLT5cbiAgTG9hZGluZ1ZpZXcgPz0gcmVxdWlyZSBcIi4vdmlld3MvbG9hZGluZy12aWV3XCJcbiAgbG9hZGluZ1ZpZXcgPz0gbmV3IExvYWRpbmdWaWV3KClcbiAgbG9hZGluZ1ZpZXcuc2hvdygpXG4pXG5iZWF1dGlmaWVyLm9uKCdiZWF1dGlmeTo6ZW5kJywgLT5cbiAgbG9hZGluZ1ZpZXc/LmhpZGUoKVxuKVxuIyBTaG93IGVycm9yXG5zaG93RXJyb3IgPSAoZXJyb3IpIC0+XG4gIGlmIG5vdCBhdG9tLmNvbmZpZy5nZXQoXCJhdG9tLWJlYXV0aWZ5LmdlbmVyYWwubXV0ZUFsbEVycm9yc1wiKVxuICAgICMgY29uc29sZS5sb2coZSlcbiAgICBzdGFjayA9IGVycm9yLnN0YWNrXG4gICAgZGV0YWlsID0gZXJyb3IuZGVzY3JpcHRpb24gb3IgZXJyb3IubWVzc2FnZVxuICAgIGF0b20ubm90aWZpY2F0aW9ucz8uYWRkRXJyb3IoZXJyb3IubWVzc2FnZSwge1xuICAgICAgc3RhY2ssIGRldGFpbCwgZGlzbWlzc2FibGUgOiB0cnVlfSlcblxuYmVhdXRpZnkgPSAoe2VkaXRvciwgb25TYXZlfSkgLT5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG5cbiAgICBwbHVnaW4uY2hlY2tVbnN1cHBvcnRlZE9wdGlvbnMoKVxuXG4gICAgIyBDb250aW51ZSBiZWF1dGlmeWluZ1xuICAgIHBhdGggPz0gcmVxdWlyZShcInBhdGhcIilcbiAgICBmb3JjZUVudGlyZUZpbGUgPSBvblNhdmUgYW5kIGF0b20uY29uZmlnLmdldChcImF0b20tYmVhdXRpZnkuZ2VuZXJhbC5iZWF1dGlmeUVudGlyZUZpbGVPblNhdmVcIilcblxuICAgICMgR2V0IHRoZSBwYXRoIHRvIHRoZSBjb25maWcgZmlsZVxuICAgICMgQWxsIG9mIHRoZSBvcHRpb25zXG4gICAgIyBMaXN0ZWQgaW4gb3JkZXIgZnJvbSBkZWZhdWx0IChiYXNlKSB0byB0aGUgb25lIHdpdGggdGhlIGhpZ2hlc3QgcHJpb3JpdHlcbiAgICAjIExlZnQgPSBEZWZhdWx0LCBSaWdodCA9IFdpbGwgb3ZlcnJpZGUgdGhlIGxlZnQuXG4gICAgIyBBdG9tIEVkaXRvclxuICAgICNcbiAgICAjIFVzZXIncyBIb21lIHBhdGhcbiAgICAjIFByb2plY3QgcGF0aFxuICAgICMgQXN5bmNocm9ub3VzbHkgYW5kIGNhbGxiYWNrLXN0eWxlXG4gICAgYmVhdXRpZnlDb21wbGV0ZWQgPSAodGV4dCkgLT5cblxuICAgICAgaWYgbm90IHRleHQ/XG4gICAgICAgICMgRG8gbm90aGluZywgaXMgdW5kZWZpbmVkXG4gICAgICAgICMgY29uc29sZS5sb2cgJ2JlYXV0aWZ5Q29tcGxldGVkJ1xuICAgICAgZWxzZSBpZiB0ZXh0IGluc3RhbmNlb2YgRXJyb3JcbiAgICAgICAgc2hvd0Vycm9yKHRleHQpXG4gICAgICAgIHJldHVybiByZWplY3QodGV4dClcbiAgICAgIGVsc2UgaWYgdHlwZW9mIHRleHQgaXMgXCJzdHJpbmdcIlxuICAgICAgICBpZiBvbGRUZXh0IGlzbnQgdGV4dFxuXG4gICAgICAgICAgIyBjb25zb2xlLmxvZyBcIlJlcGxhY2luZyBjdXJyZW50IGVkaXRvcidzIHRleHQgd2l0aCBuZXcgdGV4dFwiXG4gICAgICAgICAgcG9zQXJyYXkgPSBnZXRDdXJzb3JzKGVkaXRvcilcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJwb3NBcnJheTpcbiAgICAgICAgICBvcmlnU2Nyb2xsVG9wID0gZ2V0U2Nyb2xsVG9wKGVkaXRvcilcblxuICAgICAgICAgICMgY29uc29sZS5sb2cgXCJvcmlnU2Nyb2xsVG9wOlxuICAgICAgICAgIGlmIG5vdCBmb3JjZUVudGlyZUZpbGUgYW5kIGlzU2VsZWN0aW9uXG4gICAgICAgICAgICBzZWxlY3RlZEJ1ZmZlclJhbmdlID0gZWRpdG9yLmdldFNlbGVjdGVkQnVmZmVyUmFuZ2UoKVxuXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2VsZWN0ZWRCdWZmZXJSYW5nZTpcbiAgICAgICAgICAgIGVkaXRvci5zZXRUZXh0SW5CdWZmZXJSYW5nZSBzZWxlY3RlZEJ1ZmZlclJhbmdlLCB0ZXh0XG4gICAgICAgICAgZWxzZVxuXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2V0VGV4dFwiXG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGV4dCB0ZXh0XG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2V0Q3Vyc29yc1wiXG4gICAgICAgICAgc2V0Q3Vyc29ycyBlZGl0b3IsIHBvc0FycmF5XG5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nIFwiRG9uZSBzZXRDdXJzb3JzXCJcbiAgICAgICAgICAjIExldCB0aGUgc2Nyb2xsVG9wIHNldHRpbmcgcnVuIGFmdGVyIGFsbCB0aGUgc2F2ZSByZWxhdGVkIHN0dWZmIGlzIHJ1bixcbiAgICAgICAgICAjIG90aGVyd2lzZSBzZXRTY3JvbGxUb3AgaXMgbm90IHdvcmtpbmcsIHByb2JhYmx5IGJlY2F1c2UgdGhlIGN1cnNvclxuICAgICAgICAgICMgYWRkaXRpb24gaGFwcGVucyBhc3luY2hyb25vdXNseVxuICAgICAgICAgIHNldFRpbWVvdXQgKCAtPlxuXG4gICAgICAgICAgICAjIGNvbnNvbGUubG9nIFwic2V0U2Nyb2xsVG9wXCJcbiAgICAgICAgICAgIHNldFNjcm9sbFRvcCBlZGl0b3IsIG9yaWdTY3JvbGxUb3BcbiAgICAgICAgICAgIHJldHVybiByZXNvbHZlKHRleHQpXG4gICAgICAgICAgKSwgMFxuICAgICAgZWxzZVxuICAgICAgICBlcnJvciA9IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGJlYXV0aWZpY2F0aW9uIHJlc3VsdCAnI3t0ZXh0fScuXCIpXG4gICAgICAgIHNob3dFcnJvcihlcnJvcilcbiAgICAgICAgcmV0dXJuIHJlamVjdChlcnJvcilcblxuICAgICAgIyBlbHNlXG4gICAgICAjIGNvbnNvbGUubG9nIFwiQWxyZWFkeSBCZWF1dGlmdWwhXCJcbiAgICAgIHJldHVyblxuXG4gICAgIyBjb25zb2xlLmxvZyAnQmVhdXRpZnkgdGltZSEnXG4gICAgI1xuICAgICMgR2V0IGN1cnJlbnQgZWRpdG9yXG4gICAgZWRpdG9yID0gZWRpdG9yID8gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpXG5cblxuICAgICMgQ2hlY2sgaWYgdGhlcmUgaXMgYW4gYWN0aXZlIGVkaXRvclxuICAgIGlmIG5vdCBlZGl0b3I/XG4gICAgICByZXR1cm4gc2hvd0Vycm9yKCBuZXcgRXJyb3IoXCJBY3RpdmUgRWRpdG9yIG5vdCBmb3VuZC4gXCJcbiAgICAgICAgXCJQbGVhc2Ugc2VsZWN0IGEgVGV4dCBFZGl0b3IgZmlyc3QgdG8gYmVhdXRpZnkuXCIpKVxuICAgIGlzU2VsZWN0aW9uID0gISFlZGl0b3IuZ2V0U2VsZWN0ZWRUZXh0KClcblxuXG4gICAgIyBHZXQgZWRpdG9yIHBhdGggYW5kIGNvbmZpZ3VyYXRpb25zIGZvciBwYXRoc1xuICAgIGVkaXRlZEZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKVxuXG5cbiAgICAjIEdldCBhbGwgb3B0aW9uc1xuICAgIGFsbE9wdGlvbnMgPSBiZWF1dGlmaWVyLmdldE9wdGlvbnNGb3JQYXRoKGVkaXRlZEZpbGVQYXRoLCBlZGl0b3IpXG5cblxuICAgICMgR2V0IGN1cnJlbnQgZWRpdG9yJ3MgdGV4dFxuICAgIHRleHQgPSB1bmRlZmluZWRcbiAgICBpZiBub3QgZm9yY2VFbnRpcmVGaWxlIGFuZCBpc1NlbGVjdGlvblxuICAgICAgdGV4dCA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICAgIGVsc2VcbiAgICAgIHRleHQgPSBlZGl0b3IuZ2V0VGV4dCgpXG4gICAgb2xkVGV4dCA9IHRleHRcblxuXG4gICAgIyBHZXQgR3JhbW1hclxuICAgIGdyYW1tYXJOYW1lID0gZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lXG5cblxuICAgICMgRmluYWxseSwgYmVhdXRpZnkhXG4gICAgdHJ5XG4gICAgICBiZWF1dGlmaWVyLmJlYXV0aWZ5KHRleHQsIGFsbE9wdGlvbnMsIGdyYW1tYXJOYW1lLCBlZGl0ZWRGaWxlUGF0aCwgb25TYXZlIDogb25TYXZlKVxuICAgICAgLnRoZW4oYmVhdXRpZnlDb21wbGV0ZWQpXG4gICAgICAuY2F0Y2goYmVhdXRpZnlDb21wbGV0ZWQpXG4gICAgY2F0Y2ggZVxuICAgICAgc2hvd0Vycm9yKGUpXG4gICAgcmV0dXJuXG4gIClcblxuYmVhdXRpZnlGaWxlUGF0aCA9IChmaWxlUGF0aCwgY2FsbGJhY2spIC0+XG4gIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoJywgZmlsZVBhdGgpXG5cbiAgIyBTaG93IGluIHByb2dyZXNzIGluZGljYXRlIG9uIGZpbGUncyB0cmVlLXZpZXcgZW50cnlcbiAgJCA/PSByZXF1aXJlKFwiYXRvbS1zcGFjZS1wZW4tdmlld3NcIikuJFxuICAkZWwgPSAkKFwiLmljb24tZmlsZS10ZXh0W2RhdGEtcGF0aD1cXFwiI3tmaWxlUGF0aH1cXFwiXVwiKVxuICAkZWwuYWRkQ2xhc3MoJ2JlYXV0aWZ5aW5nJylcblxuICAjIENsZWFudXAgYW5kIHJldHVybiBjYWxsYmFjayBmdW5jdGlvblxuICBjYiA9IChlcnIsIHJlc3VsdCkgLT5cbiAgICBsb2dnZXIudmVyYm9zZSgnQ2xlYW51cCBiZWF1dGlmeUZpbGVQYXRoJywgZXJyLCByZXN1bHQpXG4gICAgJGVsID0gJChcIi5pY29uLWZpbGUtdGV4dFtkYXRhLXBhdGg9XFxcIiN7ZmlsZVBhdGh9XFxcIl1cIilcbiAgICAkZWwucmVtb3ZlQ2xhc3MoJ2JlYXV0aWZ5aW5nJylcbiAgICByZXR1cm4gY2FsbGJhY2soZXJyLCByZXN1bHQpXG5cbiAgIyBHZXQgY29udGVudHMgb2YgZmlsZVxuICBmcyA/PSByZXF1aXJlIFwiZnNcIlxuICBsb2dnZXIudmVyYm9zZSgncmVhZEZpbGUnLCBmaWxlUGF0aClcbiAgZnMucmVhZEZpbGUoZmlsZVBhdGgsIChlcnIsIGRhdGEpIC0+XG4gICAgbG9nZ2VyLnZlcmJvc2UoJ3JlYWRGaWxlIGNvbXBsZXRlZCcsIGVyciwgZmlsZVBhdGgpXG4gICAgcmV0dXJuIGNiKGVycikgaWYgZXJyXG4gICAgaW5wdXQgPSBkYXRhPy50b1N0cmluZygpXG4gICAgZ3JhbW1hciA9IGF0b20uZ3JhbW1hcnMuc2VsZWN0R3JhbW1hcihmaWxlUGF0aCwgaW5wdXQpXG4gICAgZ3JhbW1hck5hbWUgPSBncmFtbWFyLm5hbWVcblxuICAgICMgR2V0IHRoZSBvcHRpb25zXG4gICAgYWxsT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0ZvclBhdGgoZmlsZVBhdGgpXG4gICAgbG9nZ2VyLnZlcmJvc2UoJ2JlYXV0aWZ5RmlsZVBhdGggYWxsT3B0aW9ucycsIGFsbE9wdGlvbnMpXG5cbiAgICAjIEJlYXV0aWZ5IEZpbGVcbiAgICBjb21wbGV0aW9uRnVuID0gKG91dHB1dCkgLT5cbiAgICAgIGxvZ2dlci52ZXJib3NlKCdiZWF1dGlmeUZpbGVQYXRoIGNvbXBsZXRpb25GdW4nLCBvdXRwdXQpXG4gICAgICBpZiBvdXRwdXQgaW5zdGFuY2VvZiBFcnJvclxuICAgICAgICByZXR1cm4gY2Iob3V0cHV0LCBudWxsICkgIyBvdXRwdXQgPT0gRXJyb3JcbiAgICAgIGVsc2UgaWYgdHlwZW9mIG91dHB1dCBpcyBcInN0cmluZ1wiXG4gICAgICAgICMgZG8gbm90IGFsbG93IGVtcHR5IHN0cmluZ1xuICAgICAgICBpZiBvdXRwdXQudHJpbSgpIGlzICcnXG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2UoJ2JlYXV0aWZ5RmlsZVBhdGgsIG91dHB1dCB3YXMgZW1wdHkgc3RyaW5nIScpXG4gICAgICAgICAgcmV0dXJuIGNiKG51bGwsIG91dHB1dClcbiAgICAgICAgIyBzYXZlIHRvIGZpbGVcbiAgICAgICAgZnMud3JpdGVGaWxlKGZpbGVQYXRoLCBvdXRwdXQsIChlcnIpIC0+XG4gICAgICAgICAgcmV0dXJuIGNiKGVycikgaWYgZXJyXG4gICAgICAgICAgcmV0dXJuIGNiKCBudWxsICwgb3V0cHV0KVxuICAgICAgICApXG4gICAgICBlbHNlXG4gICAgICAgIHJldHVybiBjYiggbmV3IEVycm9yKFwiVW5rbm93biBiZWF1dGlmaWNhdGlvbiByZXN1bHQgI3tvdXRwdXR9LlwiKSwgb3V0cHV0KVxuICAgIHRyeVxuICAgICAgbG9nZ2VyLnZlcmJvc2UoJ2JlYXV0aWZ5JywgaW5wdXQsIGFsbE9wdGlvbnMsIGdyYW1tYXJOYW1lLCBmaWxlUGF0aClcbiAgICAgIGJlYXV0aWZpZXIuYmVhdXRpZnkoaW5wdXQsIGFsbE9wdGlvbnMsIGdyYW1tYXJOYW1lLCBmaWxlUGF0aClcbiAgICAgIC50aGVuKGNvbXBsZXRpb25GdW4pXG4gICAgICAuY2F0Y2goY29tcGxldGlvbkZ1bilcbiAgICBjYXRjaCBlXG4gICAgICByZXR1cm4gY2IoZSlcbiAgICApXG5cbmJlYXV0aWZ5RmlsZSA9ICh7dGFyZ2V0fSkgLT5cbiAgZmlsZVBhdGggPSB0YXJnZXQuZGF0YXNldC5wYXRoXG4gIHJldHVybiB1bmxlc3MgZmlsZVBhdGhcbiAgYmVhdXRpZnlGaWxlUGF0aChmaWxlUGF0aCwgKGVyciwgcmVzdWx0KSAtPlxuICAgIHJldHVybiBzaG93RXJyb3IoZXJyKSBpZiBlcnJcbiAgICAjIGNvbnNvbGUubG9nKFwiQmVhdXRpZnkgRmlsZVxuICApXG4gIHJldHVyblxuXG5iZWF1dGlmeURpcmVjdG9yeSA9ICh7dGFyZ2V0fSkgLT5cbiAgZGlyUGF0aCA9IHRhcmdldC5kYXRhc2V0LnBhdGhcbiAgcmV0dXJuIHVubGVzcyBkaXJQYXRoXG5cbiAgcmV0dXJuIGlmIGF0b20/LmNvbmZpcm0oXG4gICAgbWVzc2FnZTogXCJUaGlzIHdpbGwgYmVhdXRpZnkgYWxsIG9mIHRoZSBmaWxlcyBmb3VuZCBcXFxuICAgICAgICByZWN1cnNpdmVseSBpbiB0aGlzIGRpcmVjdG9yeSwgJyN7ZGlyUGF0aH0nLiBcXFxuICAgICAgICBEbyB5b3Ugd2FudCB0byBjb250aW51ZT9cIixcbiAgICBidXR0b25zOiBbJ1llcywgY29udGludWUhJywnTm8sIGNhbmNlbCEnXSkgaXNudCAwXG5cbiAgIyBTaG93IGluIHByb2dyZXNzIGluZGljYXRlIG9uIGRpcmVjdG9yeSdzIHRyZWUtdmlldyBlbnRyeVxuICAkID89IHJlcXVpcmUoXCJhdG9tLXNwYWNlLXBlbi12aWV3c1wiKS4kXG4gICRlbCA9ICQoXCIuaWNvbi1maWxlLWRpcmVjdG9yeVtkYXRhLXBhdGg9XFxcIiN7ZGlyUGF0aH1cXFwiXVwiKVxuICAkZWwuYWRkQ2xhc3MoJ2JlYXV0aWZ5aW5nJylcblxuICAjIFByb2Nlc3MgRGlyZWN0b3J5XG4gIGRpciA/PSByZXF1aXJlIFwibm9kZS1kaXJcIlxuICBhc3luYyA/PSByZXF1aXJlIFwiYXN5bmNcIlxuICBkaXIuZmlsZXMoZGlyUGF0aCwgKGVyciwgZmlsZXMpIC0+XG4gICAgcmV0dXJuIHNob3dFcnJvcihlcnIpIGlmIGVyclxuXG4gICAgYXN5bmMuZWFjaChmaWxlcywgKGZpbGVQYXRoLCBjYWxsYmFjaykgLT5cbiAgICAgICMgSWdub3JlIGVycm9yc1xuICAgICAgYmVhdXRpZnlGaWxlUGF0aChmaWxlUGF0aCwgLT4gY2FsbGJhY2soKSlcbiAgICAsIChlcnIpIC0+XG4gICAgICAkZWwgPSAkKFwiLmljb24tZmlsZS1kaXJlY3RvcnlbZGF0YS1wYXRoPVxcXCIje2RpclBhdGh9XFxcIl1cIilcbiAgICAgICRlbC5yZW1vdmVDbGFzcygnYmVhdXRpZnlpbmcnKVxuICAgICAgIyBjb25zb2xlLmxvZygnQ29tcGxldGVkIGJlYXV0aWZ5aW5nIGRpcmVjdG9yeSEnLCBkaXJQYXRoKVxuICAgIClcbiAgKVxuICByZXR1cm5cblxuZGVidWcgPSAoKSAtPlxuICB0cnlcbiAgICBvcGVuID0gcmVxdWlyZShcIm9wZW5cIilcbiAgICBmcyA/PSByZXF1aXJlIFwiZnNcIlxuICAgIEdpdEh1YkFwaSA9IHJlcXVpcmUoXCJnaXRodWJcIilcbiAgICBnaXRodWIgPSBuZXcgR2l0SHViQXBpKClcblxuICAgIHBsdWdpbi5jaGVja1Vuc3VwcG9ydGVkT3B0aW9ucygpXG5cbiAgICAjIEdldCBjdXJyZW50IGVkaXRvclxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuXG4gICAgbGlua2lmeVRpdGxlID0gKHRpdGxlKSAtPlxuICAgICAgdGl0bGUgPSB0aXRsZS50b0xvd2VyQ2FzZSgpXG4gICAgICBwID0gdGl0bGUuc3BsaXQoL1tcXHMsKyM7LFxcLz86QCY9KyRdKy8pICMgc3BsaXQgaW50byBwYXJ0c1xuICAgICAgc2VwID0gXCItXCJcbiAgICAgIHAuam9pbihzZXApXG5cbiAgICAjIENoZWNrIGlmIHRoZXJlIGlzIGFuIGFjdGl2ZSBlZGl0b3JcbiAgICBpZiBub3QgZWRpdG9yP1xuICAgICAgcmV0dXJuIGNvbmZpcm0oXCJBY3RpdmUgRWRpdG9yIG5vdCBmb3VuZC5cXG5cIiArXG4gICAgICBcIlBsZWFzZSBzZWxlY3QgYSBUZXh0IEVkaXRvciBmaXJzdCB0byBiZWF1dGlmeS5cIilcbiAgICByZXR1cm4gdW5sZXNzIGNvbmZpcm0oJ0FyZSB5b3UgcmVhZHkgdG8gZGVidWcgQXRvbSBCZWF1dGlmeT9cXG5cXG4nK1xuICAgICdXYXJuaW5nOiBUaGlzIHdpbGwgY3JlYXRlIGFuIGFub255bW91cyBHaXN0IG9uIEdpdEh1YiAocHVibGljYWxseSBhY2Nlc3NpYmxlIGFuZCBjYW5ub3QgYmUgZWFzaWx5IGRlbGV0ZWQpICcrXG4gICAgJ2NvbnRhaW5pbmcgdGhlIGNvbnRlbnRzIG9mIHlvdXIgYWN0aXZlIFRleHQgRWRpdG9yLlxcbicrXG4gICAgJ0JlIHN1cmUgdG8gZGVsZXRlIGFueSBwcml2YXRlIHRleHQgZnJvbSB5b3VyIGFjdGl2ZSBUZXh0IEVkaXRvciBiZWZvcmUgY29udGludWluZyAnK1xuICAgICd0byBlbnN1cmUgeW91IGFyZSBub3Qgc2hhcmluZyB1bmRlc2lyYWJsZSBwcml2YXRlIGluZm9ybWF0aW9uLicpXG4gICAgZGVidWdJbmZvID0gXCJcIlxuICAgIGhlYWRlcnMgPSBbXVxuICAgIHRvY0VsID0gXCI8VEFCTEVPRkNPTlRFTlRTLz5cIlxuICAgIGFkZEluZm8gPSAoa2V5LCB2YWwpIC0+XG4gICAgICBpZiBrZXk/XG4gICAgICAgIGRlYnVnSW5mbyArPSBcIioqI3trZXl9Kio6ICN7dmFsfVxcblxcblwiXG4gICAgICBlbHNlXG4gICAgICAgIGRlYnVnSW5mbyArPSBcIiN7dmFsfVxcblxcblwiXG4gICAgYWRkSGVhZGVyID0gKGxldmVsLCB0aXRsZSkgLT5cbiAgICAgIGRlYnVnSW5mbyArPSBcIiN7QXJyYXkobGV2ZWwrMSkuam9pbignIycpfSAje3RpdGxlfVxcblxcblwiXG4gICAgICBoZWFkZXJzLnB1c2goe1xuICAgICAgICBsZXZlbCwgdGl0bGVcbiAgICAgICAgfSlcbiAgICBhZGRIZWFkZXIoMSwgXCJBdG9tIEJlYXV0aWZ5IC0gRGVidWdnaW5nIGluZm9ybWF0aW9uXCIpXG4gICAgZGVidWdJbmZvICs9IFwiVGhlIGZvbGxvd2luZyBkZWJ1Z2dpbmcgaW5mb3JtYXRpb24gd2FzIFwiICtcbiAgICBcImdlbmVyYXRlZCBieSBgQXRvbSBCZWF1dGlmeWAgb24gYCN7bmV3IERhdGUoKX1gLlwiICtcbiAgICBcIlxcblxcbi0tLVxcblxcblwiICtcbiAgICB0b2NFbCArXG4gICAgXCJcXG5cXG4tLS1cXG5cXG5cIlxuXG4gICAgIyBQbGF0Zm9ybVxuICAgIGFkZEluZm8oJ1BsYXRmb3JtJywgcHJvY2Vzcy5wbGF0Zm9ybSlcbiAgICBhZGRIZWFkZXIoMiwgXCJWZXJzaW9uc1wiKVxuXG5cbiAgICAjIEF0b20gVmVyc2lvblxuICAgIGFkZEluZm8oJ0F0b20gVmVyc2lvbicsIGF0b20uYXBwVmVyc2lvbilcblxuXG4gICAgIyBBdG9tIEJlYXV0aWZ5IFZlcnNpb25cbiAgICBhZGRJbmZvKCdBdG9tIEJlYXV0aWZ5IFZlcnNpb24nLCBwa2cudmVyc2lvbilcbiAgICBhZGRIZWFkZXIoMiwgXCJPcmlnaW5hbCBmaWxlIHRvIGJlIGJlYXV0aWZpZWRcIilcblxuXG4gICAgIyBPcmlnaW5hbCBmaWxlXG4gICAgI1xuICAgICMgR2V0IGVkaXRvciBwYXRoIGFuZCBjb25maWd1cmF0aW9ucyBmb3IgcGF0aHNcbiAgICBmaWxlUGF0aCA9IGVkaXRvci5nZXRQYXRoKClcblxuICAgICMgUGF0aFxuICAgIGFkZEluZm8oJ09yaWdpbmFsIEZpbGUgUGF0aCcsIFwiYCN7ZmlsZVBhdGh9YFwiKVxuXG4gICAgIyBHZXQgR3JhbW1hclxuICAgIGdyYW1tYXJOYW1lID0gZWRpdG9yLmdldEdyYW1tYXIoKS5uYW1lXG5cbiAgICAjIEdyYW1tYXJcbiAgICBhZGRJbmZvKCdPcmlnaW5hbCBGaWxlIEdyYW1tYXInLCBncmFtbWFyTmFtZSlcblxuICAgICMgTGFuZ3VhZ2VcbiAgICBsYW5ndWFnZSA9IGJlYXV0aWZpZXIuZ2V0TGFuZ3VhZ2UoZ3JhbW1hck5hbWUsIGZpbGVQYXRoKVxuICAgIGFkZEluZm8oJ09yaWdpbmFsIEZpbGUgTGFuZ3VhZ2UnLCBsYW5ndWFnZT8ubmFtZSlcbiAgICBhZGRJbmZvKCdMYW5ndWFnZSBuYW1lc3BhY2UnLCBsYW5ndWFnZT8ubmFtZXNwYWNlKVxuXG4gICAgIyBCZWF1dGlmaWVyXG4gICAgYmVhdXRpZmllcnMgPSBiZWF1dGlmaWVyLmdldEJlYXV0aWZpZXJzKGxhbmd1YWdlLm5hbWUpXG4gICAgYWRkSW5mbygnU3VwcG9ydGVkIEJlYXV0aWZpZXJzJywgXy5tYXAoYmVhdXRpZmllcnMsICduYW1lJykuam9pbignLCAnKSlcbiAgICBzZWxlY3RlZEJlYXV0aWZpZXIgPSBiZWF1dGlmaWVyLmdldEJlYXV0aWZpZXJGb3JMYW5ndWFnZShsYW5ndWFnZSlcbiAgICBhZGRJbmZvKCdTZWxlY3RlZCBCZWF1dGlmaWVyJywgc2VsZWN0ZWRCZWF1dGlmaWVyLm5hbWUpXG5cbiAgICAjIEdldCBjdXJyZW50IGVkaXRvcidzIHRleHRcbiAgICB0ZXh0ID0gZWRpdG9yLmdldFRleHQoKSBvciBcIlwiXG5cbiAgICAjIENvbnRlbnRzXG4gICAgY29kZUJsb2NrU3ludGF4ID0gKGxhbmd1YWdlPy5uYW1lID8gZ3JhbW1hck5hbWUpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJyAnKVswXVxuICAgIGFkZEhlYWRlcigzLCAnT3JpZ2luYWwgRmlsZSBDb250ZW50cycpXG4gICAgYWRkSW5mbyhudWxsLCBcIlxcbmBgYCN7Y29kZUJsb2NrU3ludGF4fVxcbiN7dGV4dH1cXG5gYGBcIilcblxuICAgIGFkZEhlYWRlcigzLCAnUGFja2FnZSBTZXR0aW5ncycpXG4gICAgYWRkSW5mbyhudWxsLFxuICAgICAgXCJUaGUgcmF3IHBhY2thZ2Ugc2V0dGluZ3Mgb3B0aW9uc1xcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoYXRvbS5jb25maWcuZ2V0KCdhdG9tLWJlYXV0aWZ5JyksIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG5cbiAgICAjIEJlYXV0aWZpY2F0aW9uIE9wdGlvbnNcbiAgICBhZGRIZWFkZXIoMiwgXCJCZWF1dGlmaWNhdGlvbiBvcHRpb25zXCIpXG4gICAgIyBHZXQgYWxsIG9wdGlvbnNcbiAgICBhbGxPcHRpb25zID0gYmVhdXRpZmllci5nZXRPcHRpb25zRm9yUGF0aChmaWxlUGF0aCwgZWRpdG9yKVxuICAgICMgUmVzb2x2ZSBvcHRpb25zIHdpdGggcHJvbWlzZXNcbiAgICBQcm9taXNlLmFsbChhbGxPcHRpb25zKVxuICAgIC50aGVuKChhbGxPcHRpb25zKSAtPlxuICAgICAgIyBFeHRyYWN0IG9wdGlvbnNcbiAgICAgIFtcbiAgICAgICAgICBlZGl0b3JPcHRpb25zXG4gICAgICAgICAgY29uZmlnT3B0aW9uc1xuICAgICAgICAgIGhvbWVPcHRpb25zXG4gICAgICAgICAgZWRpdG9yQ29uZmlnT3B0aW9uc1xuICAgICAgXSA9IGFsbE9wdGlvbnNcbiAgICAgIHByb2plY3RPcHRpb25zID0gYWxsT3B0aW9uc1s0Li5dXG5cbiAgICAgIHByZVRyYW5zZm9ybWVkT3B0aW9ucyA9IGJlYXV0aWZpZXIuZ2V0T3B0aW9uc0Zvckxhbmd1YWdlKGFsbE9wdGlvbnMsIGxhbmd1YWdlKVxuXG4gICAgICBpZiBzZWxlY3RlZEJlYXV0aWZpZXJcbiAgICAgICAgZmluYWxPcHRpb25zID0gYmVhdXRpZmllci50cmFuc2Zvcm1PcHRpb25zKHNlbGVjdGVkQmVhdXRpZmllciwgbGFuZ3VhZ2UubmFtZSwgcHJlVHJhbnNmb3JtZWRPcHRpb25zKVxuXG4gICAgICAjIFNob3cgb3B0aW9uc1xuICAgICAgIyBhZGRJbmZvKCdBbGwgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgIyBcIkFsbCBvcHRpb25zIGV4dHJhY3RlZCBmb3IgZmlsZVxcblwiICtcbiAgICAgICMgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShhbGxPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnRWRpdG9yIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIEF0b20gRWRpdG9yIHNldHRpbmdzXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShlZGl0b3JPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnQ29uZmlnIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIEF0b20gQmVhdXRpZnkgcGFja2FnZSBzZXR0aW5nc1xcblwiICtcbiAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoY29uZmlnT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0hvbWUgT3B0aW9ucycsIFwiXFxuXCIgK1xuICAgICAgXCJPcHRpb25zIGZyb20gYCN7cGF0aC5yZXNvbHZlKGJlYXV0aWZpZXIuZ2V0VXNlckhvbWUoKSwgJy5qc2JlYXV0aWZ5cmMnKX1gXFxuXCIgK1xuICAgICAgXCJgYGBqc29uXFxuI3tKU09OLnN0cmluZ2lmeShob21lT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGFkZEluZm8oJ0VkaXRvckNvbmZpZyBPcHRpb25zJywgXCJcXG5cIiArXG4gICAgICBcIk9wdGlvbnMgZnJvbSBbRWRpdG9yQ29uZmlnXShodHRwOi8vZWRpdG9yY29uZmlnLm9yZy8pIGZpbGVcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KGVkaXRvckNvbmZpZ09wdGlvbnMsIHVuZGVmaW5lZCwgNCl9XFxuYGBgXCIpXG4gICAgICBhZGRJbmZvKCdQcm9qZWN0IE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiT3B0aW9ucyBmcm9tIGAuanNiZWF1dGlmeXJjYCBmaWxlcyBzdGFydGluZyBmcm9tIGRpcmVjdG9yeSBgI3twYXRoLmRpcm5hbWUoZmlsZVBhdGgpfWAgYW5kIGdvaW5nIHVwIHRvIHJvb3RcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KHByb2plY3RPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuICAgICAgYWRkSW5mbygnUHJlLVRyYW5zZm9ybWVkIE9wdGlvbnMnLCBcIlxcblwiICtcbiAgICAgIFwiQ29tYmluZWQgb3B0aW9ucyBiZWZvcmUgdHJhbnNmb3JtaW5nIHRoZW0gZ2l2ZW4gYSBiZWF1dGlmaWVyJ3Mgc3BlY2lmaWNhdGlvbnNcXG5cIiArXG4gICAgICBcImBgYGpzb25cXG4je0pTT04uc3RyaW5naWZ5KHByZVRyYW5zZm9ybWVkT3B0aW9ucywgdW5kZWZpbmVkLCA0KX1cXG5gYGBcIilcbiAgICAgIGlmIHNlbGVjdGVkQmVhdXRpZmllclxuICAgICAgICBhZGRIZWFkZXIoMywgJ0ZpbmFsIE9wdGlvbnMnKVxuICAgICAgICBhZGRJbmZvKG51bGwsXG4gICAgICAgICAgXCJGaW5hbCBjb21iaW5lZCBhbmQgdHJhbnNmb3JtZWQgb3B0aW9ucyB0aGF0IGFyZSB1c2VkXFxuXCIgK1xuICAgICAgICAgIFwiYGBganNvblxcbiN7SlNPTi5zdHJpbmdpZnkoZmluYWxPcHRpb25zLCB1bmRlZmluZWQsIDQpfVxcbmBgYFwiKVxuXG4gICAgICAjXG4gICAgICBsb2dzID0gXCJcIlxuICAgICAgbG9nRmlsZVBhdGhSZWdleCA9IG5ldyBSZWdFeHAoJ1xcXFw6IFxcXFxbKC4qKVxcXFxdJylcbiAgICAgIHN1YnNjcmlwdGlvbiA9IGxvZ2dlci5vbkxvZ2dpbmcoKG1zZykgLT5cbiAgICAgICAgIyBjb25zb2xlLmxvZygnbG9nZ2luZycsIG1zZylcbiAgICAgICAgc2VwID0gcGF0aC5zZXBcbiAgICAgICAgbG9ncyArPSBtc2cucmVwbGFjZShsb2dGaWxlUGF0aFJlZ2V4LCAoYSxiKSAtPlxuICAgICAgICAgIHMgPSBiLnNwbGl0KHNlcClcbiAgICAgICAgICBpID0gcy5pbmRleE9mKCdhdG9tLWJlYXV0aWZ5JylcbiAgICAgICAgICBwID0gcy5zbGljZShpKzIpLmpvaW4oc2VwKVxuICAgICAgICAgICMgY29uc29sZS5sb2coJ2xvZ2dpbmcnLCBhcmd1bWVudHMsIHMsIGksIHApXG4gICAgICAgICAgcmV0dXJuICc6IFsnK3ArJ10nXG4gICAgICAgIClcbiAgICAgIClcbiAgICAgIGNiID0gKHJlc3VsdCkgLT5cbiAgICAgICAgc3Vic2NyaXB0aW9uLmRpc3Bvc2UoKVxuICAgICAgICBhZGRIZWFkZXIoMiwgXCJSZXN1bHRzXCIpXG5cbiAgICAgICAgIyBMb2dzXG4gICAgICAgIGFkZEluZm8oJ0JlYXV0aWZpZWQgRmlsZSBDb250ZW50cycsIFwiXFxuYGBgI3tjb2RlQmxvY2tTeW50YXh9XFxuI3tyZXN1bHR9XFxuYGBgXCIpXG4gICAgICAgICMgRGlmZlxuICAgICAgICBKc0RpZmYgPSByZXF1aXJlKCdkaWZmJylcbiAgICAgICAgaWYgdHlwZW9mIHJlc3VsdCBpcyBcInN0cmluZ1wiXG4gICAgICAgICAgZGlmZiA9IEpzRGlmZi5jcmVhdGVQYXRjaChmaWxlUGF0aCBvciBcIlwiLCB0ZXh0IG9yIFwiXCIsIFxcXG4gICAgICAgICAgICByZXN1bHQgb3IgXCJcIiwgXCJvcmlnaW5hbFwiLCBcImJlYXV0aWZpZWRcIilcbiAgICAgICAgICBhZGRJbmZvKCdPcmlnaW5hbCB2cy4gQmVhdXRpZmllZCBEaWZmJywgXCJcXG5gYGAje2NvZGVCbG9ja1N5bnRheH1cXG4je2RpZmZ9XFxuYGBgXCIpXG5cbiAgICAgICAgYWRkSGVhZGVyKDMsIFwiTG9nc1wiKVxuICAgICAgICBhZGRJbmZvKG51bGwsIFwiYGBgXFxuI3tsb2dzfVxcbmBgYFwiKVxuXG4gICAgICAgICMgQnVpbGQgVGFibGUgb2YgQ29udGVudHNcbiAgICAgICAgdG9jID0gXCIjIyBUYWJsZSBPZiBDb250ZW50c1xcblwiXG4gICAgICAgIGZvciBoZWFkZXIgaW4gaGVhZGVyc1xuICAgICAgICAgICMjI1xuICAgICAgICAgIC0gSGVhZGluZyAxXG4gICAgICAgICAgICAtIEhlYWRpbmcgMS4xXG4gICAgICAgICAgIyMjXG4gICAgICAgICAgaW5kZW50ID0gXCIgIFwiICMgMiBzcGFjZXNcbiAgICAgICAgICBidWxsZXQgPSBcIi1cIlxuICAgICAgICAgIGluZGVudE51bSA9IGhlYWRlci5sZXZlbCAtIDJcbiAgICAgICAgICBpZiBpbmRlbnROdW0gPj0gMFxuICAgICAgICAgICAgdG9jICs9IChcIiN7QXJyYXkoaW5kZW50TnVtKzEpLmpvaW4oaW5kZW50KX0je2J1bGxldH0gWyN7aGVhZGVyLnRpdGxlfV0oXFwjI3tsaW5raWZ5VGl0bGUoaGVhZGVyLnRpdGxlKX0pXFxuXCIpXG4gICAgICAgICMgUmVwbGFjZSBUQUJMRU9GQ09OVEVOVFNcbiAgICAgICAgZGVidWdJbmZvID0gZGVidWdJbmZvLnJlcGxhY2UodG9jRWwsIHRvYylcblxuICAgICAgICAjIFNhdmUgdG8gY2xpcGJvYXJkXG4gICAgICAgICMgYXRvbS5jbGlwYm9hcmQud3JpdGUoZGVidWdJbmZvKVxuICAgICAgICBnaXRodWIuZ2lzdHMuY3JlYXRlKHtcbiAgICAgICAgICBmaWxlczoge1xuICAgICAgICAgICAgXCJkZWJ1Zy5tZFwiOiB7XG4gICAgICAgICAgICAgIFwiY29udGVudFwiOiBkZWJ1Z0luZm9cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIHB1YmxpYzogdHJ1ZSxcbiAgICAgICAgICBkZXNjcmlwdGlvbjogXCJBdG9tLUJlYXV0aWZ5IGRlYnVnZ2luZyBpbmZvcm1hdGlvblwiXG4gICAgICAgIH0sIChlcnIsIHJlcykgLT5cbiAgICAgICAgICAjIGNvbnNvbGUubG9nKGVyciwgcmVzKVxuICAgICAgICAgIGlmIGVyclxuICAgICAgICAgICAgY29uZmlybShcIkFuIGVycm9yIG9jY3VycmVkIHdoZW4gY3JlYXRpbmcgdGhlIEdpc3Q6IFwiK2VycilcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBnaXN0VXJsID0gcmVzLmh0bWxfdXJsXG4gICAgICAgICAgICAjIENyZWF0ZSBHaXN0XG4gICAgICAgICAgICBvcGVuKGdpc3RVcmwpXG4gICAgICAgICAgICBjb25maXJtKFwiWW91ciBBdG9tIEJlYXV0aWZ5IGRlYnVnZ2luZyBpbmZvcm1hdGlvbiBjYW4gYmUgZm91bmQgaW4gdGhlIHB1YmxpYyBHaXN0OlxcbiN7cmVzLmh0bWxfdXJsfVxcblxcblwiICtcbiAgICAgICAgICAgICAgIyAnWW91IGNhbiBub3cgcGFzdGUgdGhpcyBpbnRvIGFuIElzc3VlIHlvdSBhcmUgcmVwb3J0aW5nIGhlcmVcXG4nICtcbiAgICAgICAgICAgICAgIyAnaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L2lzc3Vlcy9cXG5cXG4nICtcbiAgICAgICAgICAgICAgIyAnUGxlYXNlIGZvbGxvdyB0aGUgY29udHJpYnV0aW9uIGd1aWRlbGluZXMgZm91bmQgYXRcXG4nICtcbiAgICAgICAgICAgICAgIyAnaHR0cHM6Ly9naXRodWIuY29tL0dsYXZpbjAwMS9hdG9tLWJlYXV0aWZ5L2Jsb2IvbWFzdGVyL0NPTlRSSUJVVElORy5tZFxcblxcbicgK1xuICAgICAgICAgICAgICAnV2FybmluZzogQmUgc3VyZSB0byBsb29rIG92ZXIgdGhlIGRlYnVnIGluZm8gYmVmb3JlIHlvdSBzZW5kIGl0ICcrXG4gICAgICAgICAgICAgICd0byBlbnN1cmUgeW91IGFyZSBub3Qgc2hhcmluZyB1bmRlc2lyYWJsZSBwcml2YXRlIGluZm9ybWF0aW9uLlxcblxcbicrXG4gICAgICAgICAgICAgICdJZiB5b3Ugd2FudCB0byBkZWxldGUgdGhpcyBhbm9ueW1vdXMgR2lzdCByZWFkXFxuJytcbiAgICAgICAgICAgICAgJ2h0dHBzOi8vaGVscC5naXRodWIuY29tL2FydGljbGVzL2RlbGV0aW5nLWFuLWFub255bW91cy1naXN0LydcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgICMgQ3JlYXRlIEdpdEh1YiBJc3N1ZVxuICAgICAgICAgICAgcmV0dXJuIHVubGVzcyBjb25maXJtKFwiV291bGQgeW91IGxpa2UgdG8gY3JlYXRlIGEgbmV3IElzc3VlIG9uIEdpdEh1YiBub3c/XCIpXG4gICAgICAgICAgICBpc3N1ZVRlbXBsYXRlID0gZnMucmVhZEZpbGVTeW5jKHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi4vSVNTVUVfVEVNUExBVEUubWRcIikpLnRvU3RyaW5nKClcbiAgICAgICAgICAgIGJvZHkgPSBpc3N1ZVRlbXBsYXRlLnJlcGxhY2UoXCI8SU5TRVJUIEdJU1QgSEVSRT5cIiwgZ2lzdFVybCkjLnJlcGxhY2UoXCI8SU5TRVJUIENPREUgSEVSRT5cIiwgdGV4dClcbiAgICAgICAgICAgIG9wZW4oXCJodHRwczovL2dpdGh1Yi5jb20vR2xhdmluMDAxL2F0b20tYmVhdXRpZnkvaXNzdWVzL25ldz9ib2R5PSN7ZW5jb2RlVVJJQ29tcG9uZW50KGJvZHkpfVwiKVxuXG4gICAgICAgIClcbiAgICAgIHRyeVxuICAgICAgICBiZWF1dGlmaWVyLmJlYXV0aWZ5KHRleHQsIGFsbE9wdGlvbnMsIGdyYW1tYXJOYW1lLCBmaWxlUGF0aClcbiAgICAgICAgLnRoZW4oY2IpXG4gICAgICAgIC5jYXRjaChjYilcbiAgICAgIGNhdGNoIGVcbiAgICAgICAgcmV0dXJuIGNiKGUpXG4gICAgKVxuICAgIC5jYXRjaCgoZXJyb3IpIC0+XG4gICAgICBzdGFjayA9IGVycm9yLnN0YWNrXG4gICAgICBkZXRhaWwgPSBlcnJvci5kZXNjcmlwdGlvbiBvciBlcnJvci5tZXNzYWdlXG4gICAgICBhdG9tPy5ub3RpZmljYXRpb25zPy5hZGRFcnJvcihlcnJvci5tZXNzYWdlLCB7XG4gICAgICAgIHN0YWNrLCBkZXRhaWwsIGRpc21pc3NhYmxlIDogdHJ1ZVxuICAgICAgfSlcbiAgICApXG4gIGNhdGNoIGVycm9yXG4gICAgc3RhY2sgPSBlcnJvci5zdGFja1xuICAgIGRldGFpbCA9IGVycm9yLmRlc2NyaXB0aW9uIG9yIGVycm9yLm1lc3NhZ2VcbiAgICBhdG9tPy5ub3RpZmljYXRpb25zPy5hZGRFcnJvcihlcnJvci5tZXNzYWdlLCB7XG4gICAgICBzdGFjaywgZGV0YWlsLCBkaXNtaXNzYWJsZSA6IHRydWVcbiAgICB9KVxuXG5oYW5kbGVTYXZlRXZlbnQgPSAtPlxuICBhdG9tLndvcmtzcGFjZS5vYnNlcnZlVGV4dEVkaXRvcnMgKGVkaXRvcikgLT5cbiAgICBwZW5kaW5nUGF0aHMgPSB7fVxuICAgIGJlYXV0aWZ5T25TYXZlSGFuZGxlciA9ICh7cGF0aDogZmlsZVBhdGh9KSAtPlxuICAgICAgbG9nZ2VyLnZlcmJvc2UoJ1Nob3VsZCBiZWF1dGlmeSBvbiB0aGlzIHNhdmU/JylcbiAgICAgIGlmIHBlbmRpbmdQYXRoc1tmaWxlUGF0aF1cbiAgICAgICAgbG9nZ2VyLnZlcmJvc2UoXCJFZGl0b3Igd2l0aCBmaWxlIHBhdGggI3tmaWxlUGF0aH0gYWxyZWFkeSBiZWF1dGlmaWVkIVwiKVxuICAgICAgICByZXR1cm5cbiAgICAgIGJ1ZmZlciA9IGVkaXRvci5nZXRCdWZmZXIoKVxuICAgICAgcGF0aCA/PSByZXF1aXJlKCdwYXRoJylcbiAgICAgICMgR2V0IEdyYW1tYXJcbiAgICAgIGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLm5hbWVcbiAgICAgICMgR2V0IGZpbGUgZXh0ZW5zaW9uXG4gICAgICBmaWxlRXh0ZW5zaW9uID0gcGF0aC5leHRuYW1lKGZpbGVQYXRoKVxuICAgICAgIyBSZW1vdmUgcHJlZml4IFwiLlwiIChwZXJpb2QpIGluIGZpbGVFeHRlbnNpb25cbiAgICAgIGZpbGVFeHRlbnNpb24gPSBmaWxlRXh0ZW5zaW9uLnN1YnN0cigxKVxuICAgICAgIyBHZXQgbGFuZ3VhZ2VcbiAgICAgIGxhbmd1YWdlcyA9IGJlYXV0aWZpZXIubGFuZ3VhZ2VzLmdldExhbmd1YWdlcyh7Z3JhbW1hciwgZXh0ZW5zaW9uOiBmaWxlRXh0ZW5zaW9ufSlcbiAgICAgIGlmIGxhbmd1YWdlcy5sZW5ndGggPCAxXG4gICAgICAgIHJldHVyblxuICAgICAgIyBUT0RPOiBzZWxlY3QgYXBwcm9wcmlhdGUgbGFuZ3VhZ2VcbiAgICAgIGxhbmd1YWdlID0gbGFuZ3VhZ2VzWzBdXG4gICAgICAjIEdldCBsYW5ndWFnZSBjb25maWdcbiAgICAgIGtleSA9IFwiYXRvbS1iZWF1dGlmeS4je2xhbmd1YWdlLm5hbWVzcGFjZX0uYmVhdXRpZnlfb25fc2F2ZVwiXG4gICAgICBiZWF1dGlmeU9uU2F2ZSA9IGF0b20uY29uZmlnLmdldChrZXkpXG4gICAgICBsb2dnZXIudmVyYm9zZSgnc2F2ZSBlZGl0b3IgcG9zaXRpb25zJywga2V5LCBiZWF1dGlmeU9uU2F2ZSlcbiAgICAgIGlmIGJlYXV0aWZ5T25TYXZlXG4gICAgICAgIGxvZ2dlci52ZXJib3NlKCdCZWF1dGlmeWluZyBmaWxlJywgZmlsZVBhdGgpXG4gICAgICAgIGJlYXV0aWZ5KHtlZGl0b3IsIG9uU2F2ZTogdHJ1ZX0pXG4gICAgICAgIC50aGVuKCgpIC0+XG4gICAgICAgICAgbG9nZ2VyLnZlcmJvc2UoJ0RvbmUgYmVhdXRpZnlpbmcgZmlsZScsIGZpbGVQYXRoKVxuICAgICAgICAgIGlmIGVkaXRvci5pc0FsaXZlKCkgaXMgdHJ1ZVxuICAgICAgICAgICAgbG9nZ2VyLnZlcmJvc2UoJ1NhdmluZyBUZXh0RWRpdG9yLi4uJylcbiAgICAgICAgICAgICMgU3RvcmUgdGhlIGZpbGVQYXRoIHRvIHByZXZlbnQgaW5maW5pdGUgbG9vcGluZ1xuICAgICAgICAgICAgIyBXaGVuIFdoaXRlc3BhY2UgcGFja2FnZSBoYXMgb3B0aW9uIFwiRW5zdXJlIFNpbmdsZSBUcmFpbGluZyBOZXdsaW5lXCIgZW5hYmxlZFxuICAgICAgICAgICAgIyBJdCB3aWxsIGFkZCBhIG5ld2xpbmUgYW5kIGtlZXAgdGhlIGZpbGUgZnJvbSBjb252ZXJnaW5nIG9uIGEgYmVhdXRpZmllZCBmb3JtXG4gICAgICAgICAgICAjIGFuZCBzYXZpbmcgd2l0aG91dCBlbWl0dGluZyBvbkRpZFNhdmUgZXZlbnQsIGJlY2F1c2UgdGhlcmUgd2VyZSBubyBjaGFuZ2VzLlxuICAgICAgICAgICAgcGVuZGluZ1BhdGhzW2ZpbGVQYXRoXSA9IHRydWVcbiAgICAgICAgICAgIGVkaXRvci5zYXZlKClcbiAgICAgICAgICAgIGRlbGV0ZSBwZW5kaW5nUGF0aHNbZmlsZVBhdGhdXG4gICAgICAgICAgICBsb2dnZXIudmVyYm9zZSgnU2F2ZWQgVGV4dEVkaXRvci4nKVxuICAgICAgICApXG4gICAgICAgIC5jYXRjaCgoZXJyb3IpIC0+XG4gICAgICAgICAgcmV0dXJuIHNob3dFcnJvcihlcnJvcilcbiAgICAgICAgKVxuICAgIGRpc3Bvc2FibGUgPSBlZGl0b3Iub25EaWRTYXZlKCh7cGF0aCA6IGZpbGVQYXRofSkgLT5cbiAgICAgICMgVE9ETzogSW1wbGVtZW50IGRlYm91bmNpbmdcbiAgICAgIGJlYXV0aWZ5T25TYXZlSGFuZGxlcih7cGF0aDogZmlsZVBhdGh9KVxuICAgIClcbiAgICBwbHVnaW4uc3Vic2NyaXB0aW9ucy5hZGQgZGlzcG9zYWJsZVxuXG5nZXRVbnN1cHBvcnRlZE9wdGlvbnMgPSAtPlxuICBzZXR0aW5ncyA9IGF0b20uY29uZmlnLmdldCgnYXRvbS1iZWF1dGlmeScpXG4gIHNjaGVtYSA9IGF0b20uY29uZmlnLmdldFNjaGVtYSgnYXRvbS1iZWF1dGlmeScpXG4gIHVuc3VwcG9ydGVkT3B0aW9ucyA9IF8uZmlsdGVyKF8ua2V5cyhzZXR0aW5ncyksIChrZXkpIC0+XG4gICAgIyByZXR1cm4gYXRvbS5jb25maWcuZ2V0U2NoZW1hKFwiYXRvbS1iZWF1dGlmeS4ke2tleX1cIikudHlwZVxuICAgICMgcmV0dXJuIHR5cGVvZiBzZXR0aW5nc1trZXldXG4gICAgc2NoZW1hLnByb3BlcnRpZXNba2V5XSBpcyB1bmRlZmluZWRcbiAgKVxuICByZXR1cm4gdW5zdXBwb3J0ZWRPcHRpb25zXG5cbnBsdWdpbi5jaGVja1Vuc3VwcG9ydGVkT3B0aW9ucyA9IC0+XG4gIHVuc3VwcG9ydGVkT3B0aW9ucyA9IGdldFVuc3VwcG9ydGVkT3B0aW9ucygpXG4gIGlmIHVuc3VwcG9ydGVkT3B0aW9ucy5sZW5ndGggaXNudCAwXG4gICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFdhcm5pbmcoXCJQbGVhc2UgcnVuIEF0b20gY29tbWFuZCAnQXRvbS1CZWF1dGlmeTogTWlncmF0ZSBTZXR0aW5ncycuXCIsIHtcbiAgICAgIGRldGFpbCA6IFwiWW91IGNhbiBvcGVuIHRoZSBBdG9tIGNvbW1hbmQgcGFsZXR0ZSB3aXRoIGBjbWQtc2hpZnQtcGAgKE9TWCkgb3IgYGN0cmwtc2hpZnQtcGAgKExpbnV4L1dpbmRvd3MpIGluIEF0b20uIFlvdSBoYXZlIHVuc3VwcG9ydGVkIG9wdGlvbnM6ICN7dW5zdXBwb3J0ZWRPcHRpb25zLmpvaW4oJywgJyl9XCIsXG4gICAgICBkaXNtaXNzYWJsZSA6IHRydWVcbiAgICB9KVxuXG5wbHVnaW4ubWlncmF0ZVNldHRpbmdzID0gLT5cbiAgdW5zdXBwb3J0ZWRPcHRpb25zID0gZ2V0VW5zdXBwb3J0ZWRPcHRpb25zKClcbiAgbmFtZXNwYWNlcyA9IGJlYXV0aWZpZXIubGFuZ3VhZ2VzLm5hbWVzcGFjZXNcbiAgIyBjb25zb2xlLmxvZygnbWlncmF0ZS1zZXR0aW5ncycsIHNjaGVtYSwgbmFtZXNwYWNlcywgdW5zdXBwb3J0ZWRPcHRpb25zKVxuICBpZiB1bnN1cHBvcnRlZE9wdGlvbnMubGVuZ3RoIGlzIDBcbiAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIk5vIG9wdGlvbnMgdG8gbWlncmF0ZS5cIilcbiAgZWxzZVxuICAgIHJleCA9IG5ldyBSZWdFeHAoXCIoI3tuYW1lc3BhY2VzLmpvaW4oJ3wnKX0pXyguKilcIilcbiAgICByZW5hbWUgPSBfLnRvUGFpcnMoXy56aXBPYmplY3QodW5zdXBwb3J0ZWRPcHRpb25zLCBfLm1hcCh1bnN1cHBvcnRlZE9wdGlvbnMsIChrZXkpIC0+XG4gICAgICBtID0ga2V5Lm1hdGNoKHJleClcbiAgICAgIGlmIG0gaXMgbnVsbFxuICAgICAgICAjIERpZCBub3QgbWF0Y2hcbiAgICAgICAgIyBQdXQgaW50byBnZW5lcmFsXG4gICAgICAgIHJldHVybiBcImdlbmVyYWwuI3trZXl9XCJcbiAgICAgIGVsc2VcbiAgICAgICAgcmV0dXJuIFwiI3ttWzFdfS4je21bMl19XCJcbiAgICApKSlcbiAgICAjIGNvbnNvbGUubG9nKCdyZW5hbWUnLCByZW5hbWUpXG4gICAgIyBsb2dnZXIudmVyYm9zZSgncmVuYW1lJywgcmVuYW1lKVxuXG4gICAgIyBNb3ZlIGFsbCBvcHRpb24gdmFsdWVzIHRvIHJlbmFtZWQga2V5XG4gICAgXy5lYWNoKHJlbmFtZSwgKFtrZXksIG5ld0tleV0pIC0+XG4gICAgICAjIENvcHkgdG8gbmV3IGtleVxuICAgICAgdmFsID0gYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1iZWF1dGlmeS4je2tleX1cIilcbiAgICAgICMgY29uc29sZS5sb2coJ3JlbmFtZScsIGtleSwgbmV3S2V5LCB2YWwpXG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJhdG9tLWJlYXV0aWZ5LiN7bmV3S2V5fVwiLCB2YWwpXG4gICAgICAjIERlbGV0ZSBvbGQga2V5XG4gICAgICBhdG9tLmNvbmZpZy5zZXQoXCJhdG9tLWJlYXV0aWZ5LiN7a2V5fVwiLCB1bmRlZmluZWQpXG4gICAgKVxuICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiU3VjY2Vzc2Z1bGx5IG1pZ3JhdGVkIG9wdGlvbnM6ICN7dW5zdXBwb3J0ZWRPcHRpb25zLmpvaW4oJywgJyl9XCIpXG5cbnBsdWdpbi5jb25maWcgPSBfLm1lcmdlKHJlcXVpcmUoJy4vY29uZmlnLmNvZmZlZScpLCBkZWZhdWx0TGFuZ3VhZ2VPcHRpb25zKVxucGx1Z2luLmFjdGl2YXRlID0gLT5cbiAgQHN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgaGFuZGxlU2F2ZUV2ZW50KClcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJhdG9tLWJlYXV0aWZ5OmJlYXV0aWZ5LWVkaXRvclwiLCBiZWF1dGlmeVxuICBAc3Vic2NyaXB0aW9ucy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgXCJhdG9tLXdvcmtzcGFjZVwiLCBcImF0b20tYmVhdXRpZnk6aGVscC1kZWJ1Zy1lZGl0b3JcIiwgZGVidWdcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiLnRyZWUtdmlldyAuZmlsZSAubmFtZVwiLCBcImF0b20tYmVhdXRpZnk6YmVhdXRpZnktZmlsZVwiLCBiZWF1dGlmeUZpbGVcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiLnRyZWUtdmlldyAuZGlyZWN0b3J5IC5uYW1lXCIsIFwiYXRvbS1iZWF1dGlmeTpiZWF1dGlmeS1kaXJlY3RvcnlcIiwgYmVhdXRpZnlEaXJlY3RvcnlcbiAgQHN1YnNjcmlwdGlvbnMuYWRkIGF0b20uY29tbWFuZHMuYWRkIFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJhdG9tLWJlYXV0aWZ5Om1pZ3JhdGUtc2V0dGluZ3NcIiwgcGx1Z2luLm1pZ3JhdGVTZXR0aW5nc1xuXG5wbHVnaW4uZGVhY3RpdmF0ZSA9IC0+XG4gIEBzdWJzY3JpcHRpb25zLmRpc3Bvc2UoKVxuIl19
