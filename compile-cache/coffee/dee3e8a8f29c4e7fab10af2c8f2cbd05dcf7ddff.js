(function() {
  var $, BufferedProcess, CompositeDisposable, Os, Path, TagCreateView, TextEditorView, View, fs, git, notifier, ref, ref1,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Os = require('os');

  Path = require('path');

  fs = require('fs-plus');

  ref = require('atom'), BufferedProcess = ref.BufferedProcess, CompositeDisposable = ref.CompositeDisposable;

  ref1 = require('atom-space-pen-views'), $ = ref1.$, TextEditorView = ref1.TextEditorView, View = ref1.View;

  notifier = require('../notifier');

  git = require('../git');

  module.exports = TagCreateView = (function(superClass) {
    extend(TagCreateView, superClass);

    function TagCreateView() {
      return TagCreateView.__super__.constructor.apply(this, arguments);
    }

    TagCreateView.content = function() {
      return this.div((function(_this) {
        return function() {
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagName', new TextEditorView({
              mini: true,
              placeholderText: 'Tag'
            }));
          });
          _this.div({
            "class": 'block'
          }, function() {
            return _this.subview('tagMessage', new TextEditorView({
              mini: true,
              placeholderText: 'Annotation message'
            }));
          });
          return _this.div({
            "class": 'block'
          }, function() {
            _this.span({
              "class": 'pull-left'
            }, function() {
              return _this.button({
                "class": 'btn btn-success inline-block-tight gp-confirm-button',
                click: 'createTag'
              }, 'Create Tag');
            });
            return _this.span({
              "class": 'pull-right'
            }, function() {
              return _this.button({
                "class": 'btn btn-error inline-block-tight gp-cancel-button',
                click: 'destroy'
              }, 'Cancel');
            });
          });
        };
      })(this));
    };

    TagCreateView.prototype.initialize = function(repo) {
      this.repo = repo;
      this.disposables = new CompositeDisposable;
      this.currentPane = atom.workspace.getActivePane();
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.panel.show();
      this.tagName.focus();
      this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this)
      }));
      return this.disposables.add(atom.commands.add('atom-text-editor', {
        'core:confirm': (function(_this) {
          return function() {
            return _this.createTag();
          };
        })(this)
      }));
    };

    TagCreateView.prototype.createTag = function() {
      var tag;
      tag = {
        name: this.tagName.getModel().getText(),
        message: this.tagMessage.getModel().getText()
      };
      git.cmd(['tag', '-a', tag.name, '-m', tag.message], {
        cwd: this.repo.getWorkingDirectory()
      }).then(function(success) {
        if (success) {
          return notifier.addSuccess("Tag '" + tag.name + "' has been created successfully!");
        }
      })["catch"](function(msg) {
        return notifier.addError(msg);
      });
      return this.destroy();
    };

    TagCreateView.prototype.destroy = function() {
      var ref2;
      if ((ref2 = this.panel) != null) {
        ref2.destroy();
      }
      this.disposables.dispose();
      return this.currentPane.activate();
    };

    return TagCreateView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvdGFnLWNyZWF0ZS12aWV3LmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUEsb0hBQUE7SUFBQTs7O0VBQUEsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSOztFQUNMLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUjs7RUFDUCxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVI7O0VBRUwsTUFBeUMsT0FBQSxDQUFRLE1BQVIsQ0FBekMsRUFBQyxxQ0FBRCxFQUFrQjs7RUFDbEIsT0FBNEIsT0FBQSxDQUFRLHNCQUFSLENBQTVCLEVBQUMsVUFBRCxFQUFJLG9DQUFKLEVBQW9COztFQUNwQixRQUFBLEdBQVcsT0FBQSxDQUFRLGFBQVI7O0VBQ1gsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUVOLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7SUFDSixhQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtVQUNILEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBO21CQUNuQixLQUFDLENBQUEsT0FBRCxDQUFTLFNBQVQsRUFBd0IsSUFBQSxjQUFBLENBQWU7Y0FBQSxJQUFBLEVBQU0sSUFBTjtjQUFZLGVBQUEsRUFBaUIsS0FBN0I7YUFBZixDQUF4QjtVQURtQixDQUFyQjtVQUVBLEtBQUMsQ0FBQSxHQUFELENBQUs7WUFBQSxDQUFBLEtBQUEsQ0FBQSxFQUFPLE9BQVA7V0FBTCxFQUFxQixTQUFBO21CQUNuQixLQUFDLENBQUEsT0FBRCxDQUFTLFlBQVQsRUFBMkIsSUFBQSxjQUFBLENBQWU7Y0FBQSxJQUFBLEVBQU0sSUFBTjtjQUFZLGVBQUEsRUFB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QVNYLE9BQUEsR0FBUyxTQUFBO0FBQ1AsVUFBQTs7WUFBTSxDQUFFLE9BQVIsQ0FBQTs7TUFDQSxJQUFDLENBQUEsV0FBVyxDQUFDLE9BQWIsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFXLENBQUMsUUFBYixDQUFBO0lBSE87Ozs7S0EvQmlCO0FBVjVCIiwic291cmNlc0NvbnRlbnQiOlsiT3MgPSByZXF1aXJlICdvcydcblBhdGggPSByZXF1aXJlICdwYXRoJ1xuZnMgPSByZXF1aXJlICdmcy1wbHVzJ1xuXG57QnVmZmVyZWRQcm9jZXNzLCBDb21wb3NpdGVEaXNwb3NhYmxlfSA9IHJlcXVpcmUgJ2F0b20nXG57JCwgVGV4dEVkaXRvclZpZXcsIFZpZXd9ID0gcmVxdWlyZSAnYXRvbS1zcGFjZS1wZW4tdmlld3MnXG5ub3RpZmllciA9IHJlcXVpcmUgJy4uL25vdGlmaWVyJ1xuZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuXG5tb2R1bGUuZXhwb3J0cz1cbmNsYXNzIFRhZ0NyZWF0ZVZpZXcgZXh0ZW5kcyBWaWV3XG4gIEBjb250ZW50OiAtPlxuICAgIEBkaXYgPT5cbiAgICAgIEBkaXYgY2xhc3M6ICdibG9jaycsID0+XG4gICAgICAgIEBzdWJ2aWV3ICd0YWdOYW1lJywgbmV3IFRleHRFZGl0b3JWaWV3KG1pbmk6IHRydWUsIHBsYWNlaG9sZGVyVGV4dDogJ1RhZycpXG4gICAgICBAZGl2IGNsYXNzOiAnYmxvY2snLCA9PlxuICAgICAgICBAc3VidmlldyAndGFnTWVzc2FnZScsIG5ldyBUZXh0RWRpdG9yVmlldyhtaW5pOiB0cnVlLCBwbGFjZWhvbGRlclRleHQ6ICdBbm5vdGF0aW9uIG1lc3NhZ2UnKVxuICAgICAgQGRpdiBjbGFzczogJ2Jsb2NrJywgPT5cbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLWxlZnQnLCA9PlxuICAgICAgICAgIEBidXR0b24gY2xhc3M6ICdidG4gYnRuLXN1Y2Nlc3MgaW5saW5lLWJsb2NrLXRpZ2h0IGdwLWNvbmZpcm0tYnV0dG9uJywgY2xpY2s6ICdjcmVhdGVUYWcnLCAnQ3JlYXRlIFRhZydcbiAgICAgICAgQHNwYW4gY2xhc3M6ICdwdWxsLXJpZ2h0JywgPT5cbiAgICAgICAgICBAYnV0dG9uIGNsYXNzOiAnYnRuIGJ0bi1lcnJvciBpbmxpbmUtYmxvY2stdGlnaHQgZ3AtY2FuY2VsLWJ1dHRvbicsIGNsaWNrOiAnZGVzdHJveScsICdDYW5jZWwnXG5cbiAgaW5pdGlhbGl6ZTogKEByZXBvKSAtPlxuICAgIEBkaXNwb3NhYmxlcyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlXG4gICAgQGN1cnJlbnRQYW5lID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlUGFuZSgpXG4gICAgQHBhbmVsID89IGF0b20ud29ya3NwYWNlLmFkZE1vZGFsUGFuZWwoaXRlbTogdGhpcylcbiAgICBAcGFuZWwuc2hvdygpXG4gICAgQHRhZ05hbWUuZm9jdXMoKVxuICAgIEBkaXNwb3NhYmxlcy5hZGQgYXRvbS5jb21tYW5kcy5hZGQgJ2F0b20tdGV4dC1lZGl0b3InLCAnY29yZTpjYW5jZWwnOiA9PiBAZGVzdHJveSgpXG4gICAgQGRpc3Bvc2FibGVzLmFkZCBhdG9tLmNvbW1hbmRzLmFkZCAnYXRvbS10ZXh0LWVkaXRvcicsICdjb3JlOmNvbmZpcm0nOiA9PiBAY3JlYXRlVGFnKClcblxuICBjcmVhdGVUYWc6IC0+XG4gICAgdGFnID0gbmFtZTogQHRhZ05hbWUuZ2V0TW9kZWwoKS5nZXRUZXh0KCksIG1lc3NhZ2U6IEB0YWdNZXNzYWdlLmdldE1vZGVsKCkuZ2V0VGV4dCgpXG4gICAgZ2l0LmNtZChbJ3RhZycsICctYScsIHRhZy5uYW1lLCAnLW0nLCB0YWcubWVzc2FnZV0sIGN3ZDogQHJlcG8uZ2V0V29ya2luZ0RpcmVjdG9yeSgpKVxuICAgIC50aGVuIChzdWNjZXNzKSAtPlxuICAgICAgbm90aWZpZXIuYWRkU3VjY2VzcyhcIlRhZyAnI3t0YWcubmFtZX0nIGhhcyBiZWVuIGNyZWF0ZWQgc3VjY2Vzc2Z1bGx5IVwiKSBpZiBzdWNjZXNzXG4gICAgLmNhdGNoIChtc2cpIC0+XG4gICAgICBub3RpZmllci5hZGRFcnJvciBtc2dcbiAgICBAZGVzdHJveSgpXG5cbiAgZGVzdHJveTogLT5cbiAgICBAcGFuZWw/LmRlc3Ryb3koKVxuICAgIEBkaXNwb3NhYmxlcy5kaXNwb3NlKClcbiAgICBAY3VycmVudFBhbmUuYWN0aXZhdGUoKVxuIl19
