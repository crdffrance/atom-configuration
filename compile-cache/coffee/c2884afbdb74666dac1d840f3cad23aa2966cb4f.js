(function() {
  var $, $$, GitInit, GitPaletteView, GitPlusCommands, SelectListView, _, fuzzyFilter, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  _ = require('underscore-plus');

  ref = require('atom-space-pen-views'), $ = ref.$, $$ = ref.$$, SelectListView = ref.SelectListView;

  GitPlusCommands = require('../git-plus-commands');

  GitInit = require('../models/git-init');

  fuzzyFilter = require('fuzzaldrin').filter;

  module.exports = GitPaletteView = (function(superClass) {
    extend(GitPaletteView, superClass);

    function GitPaletteView() {
      return GitPaletteView.__super__.constructor.apply(this, arguments);
    }

    GitPaletteView.prototype.initialize = function() {
      GitPaletteView.__super__.initialize.apply(this, arguments);
      this.addClass('git-palette');
      return this.toggle();
    };

    GitPaletteView.prototype.getFilterKey = function() {
      return 'description';
    };

    GitPaletteView.prototype.cancelled = function() {
      return this.hide();
    };

    GitPaletteView.prototype.toggle = function() {
      var ref1;
      if ((ref1 = this.panel) != null ? ref1.isVisible() : void 0) {
        return this.cancel();
      } else {
        return this.show();
      }
    };

    GitPaletteView.prototype.show = function() {
      if (this.panel == null) {
        this.panel = atom.workspace.addModalPanel({
          item: this
        });
      }
      this.storeFocusedElement();
      if (this.previouslyFocusedElement[0] && this.previouslyFocusedElement[0] !== document.body) {
        this.commandElement = this.previouslyFocusedElement;
      } else {
        this.commandElement = atom.views.getView(atom.workspace);
      }
      this.keyBindings = atom.keymaps.findKeyBindings({
        target: this.commandElement[0]
      });
      return GitPlusCommands().then((function(_this) {
        return function(commands) {
          commands = commands.map(function(c) {
            return {
              name: c[0],
              description: c[1],
              func: c[2]
            };
          });
          commands = _.sortBy(commands, 'name');
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this))["catch"]((function(_this) {
        return function(err) {
          var commands;
          (commands = []).push({
            name: 'git-plus:init',
            description: 'Init',
            func: function() {
              return GitInit();
            }
          });
          _this.setItems(commands);
          _this.panel.show();
          return _this.focusFilterEditor();
        };
      })(this));
    };

    GitPaletteView.prototype.populateList = function() {
      var filterQuery, filteredItems, i, item, itemView, j, options, ref1, ref2, ref3;
      if (this.items == null) {
        return;
      }
      filterQuery = this.getFilterQuery();
      if (filterQuery.length) {
        options = {
          key: this.getFilterKey()
        };
        filteredItems = fuzzyFilter(this.items, filterQuery, options);
      } else {
        filteredItems = this.items;
      }
      this.list.empty();
      if (filteredItems.length) {
        this.setError(null);
        for (i = j = 0, ref1 = Math.min(filteredItems.length, this.maxItems); 0 <= ref1 ? j < ref1 : j > ref1; i = 0 <= ref1 ? ++j : --j) {
          item = (ref2 = filteredItems[i].original) != null ? ref2 : filteredItems[i];
          itemView = $(this.viewForItem(item, (ref3 = filteredItems[i].string) != null ? ref3 : null));
          itemView.data('select-list-item', item);
          this.list.append(itemView);
        }
        return this.selectItemView(this.list.find('li:first'));
      } else {
        return this.setError(this.getEmptyMessage(this.items.length, filteredItems.length));
      }
    };

    GitPaletteView.prototype.hide = function() {
      var ref1;
      return (ref1 = this.panel) != null ? ref1.destroy() : void 0;
    };

    GitPaletteView.prototype.viewForItem = function(arg, matchedStr) {
      var description, name;
      name = arg.name, description = arg.description;
      return $$(function() {
        return this.li({
          "class": 'command',
          'data-command-name': name
        }, (function(_this) {
          return function() {
            if (matchedStr != null) {
              return _this.raw(matchedStr);
            } else {
              return _this.span(description);
            }
          };
        })(this));
      });
    };

    GitPaletteView.prototype.confirmed = function(arg) {
      var func;
      func = arg.func;
      this.cancel();
      return func();
    };

    return GitPaletteView;

  })(SelectListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvZ2l0LXBhbGV0dGUtdmlldy5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBLG9GQUFBO0lBQUE7OztFQUFBLENBQUEsR0FBSSxPQUFBLENBQVEsaUJBQVI7O0VBQ0osTUFBMEIsT0FBQSxDQUFRLHNCQUFSLENBQTFCLEVBQUMsU0FBRCxFQUFJLFdBQUosRUFBUTs7RUFDUixlQUFBLEdBQWtCLE9BQUEsQ0FBUSxzQkFBUjs7RUFDbEIsT0FBQSxHQUFVLE9BQUEsQ0FBUSxvQkFBUjs7RUFDVixXQUFBLEdBQWMsT0FBQSxDQUFRLFlBQVIsQ0FBcUIsQ0FBQzs7RUFDcEMsTUFBTSxDQUFDLE9BQVAsR0FDTTs7Ozs7Ozs2QkFFSixVQUFBLEdBQVksU0FBQTtNQUNWLGdEQUFBLFNBQUE7TUFDQSxJQUFDLENBQUEsUUFBRCxDQUFVLGFBQVY7YUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBO0lBSFU7OzZCQUtaLFlBQUEsR0FBYyxTQUFBO2FBQ1o7SUFEWTs7NkJBR2QsU0FBQSxHQUFXLFNBQUE7YUFBRyxJQUFDLENBQUEsSUFBRCxDQUFBO0lBQUg7OzZCQUVYLE1BQUEsR0FBUSxTQUFBO0FBQ04sVUFBQTtNQUFBLHNDQUFTLENBQUUsU0FBUixDQUFBLFVBQUg7ZUFDRSxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREY7T0FBQSxNQUFBO2VBR0UsSUFBQyxDQUFBLElBQUQsQ0FBQSxFQUhGOztJQURNOzs2QkFNUixJQUFBLEdBQU0sU0FBQTs7UUFDSixJQUFDLENBQUEsUUFBUyxJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWYsQ0FBNkI7VUFBQSxJQUFBLEVBQU0sSUFBTjtTQUE3Qjs7TUFFVixJQUFDLENBQUEsbUJBQUQsQ0FBQTtNQUVBLElBQUcsSUFBQyxDQUFBLHdCQUF5QixDQUFBLENBQUEsQ0FBMUIsSUFB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QUFhLENBQUMsTUFBOUMsQ0FBVixFQVZGOztJQVpZOzs2QkF3QmQsSUFBQSxHQUFNLFNBQUE7QUFDSixVQUFBOytDQUFNLENBQUUsT0FBUixDQUFBO0lBREk7OzZCQUdOLFdBQUEsR0FBYSxTQUFDLEdBQUQsRUFBc0IsVUFBdEI7QUFDWCxVQUFBO01BRGEsaUJBQU07YUFDbkIsRUFBQSxDQUFHLFNBQUE7ZUFDRCxJQUFDLENBQUEsRUFBRCxDQUFJO1VBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxTQUFQO1VBQWtCLG1CQUFBLEVBQXFCLElBQXZDO1NBQUosRUFBaUQsQ0FBQSxTQUFBLEtBQUE7aUJBQUEsU0FBQTtZQUMvQyxJQUFHLGtCQUFIO3FCQUFvQixLQUFDLENBQUEsR0FBRCxDQUFLLFVBQUwsRUFBcEI7YUFBQSxNQUFBO3FCQUEwQyxLQUFDLENBQUEsSUFBRCxDQUFNLFdBQU4sRUFBMUM7O1VBRCtDO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqRDtNQURDLENBQUg7SUFEVzs7NkJBS2IsU0FBQSxHQUFXLFNBQUMsR0FBRDtBQUNULFVBQUE7TUFEVyxPQUFEO01BQ1YsSUFBQyxDQUFBLE1BQUQsQ0FBQTthQUNBLElBQUEsQ0FBQTtJQUZTOzs7O0tBMUVnQjtBQU43QiIsInNvdXJjZXNDb250ZW50IjpbIl8gPSByZXF1aXJlICd1bmRlcnNjb3JlLXBsdXMnXG57JCwgJCQsIFNlbGVjdExpc3RWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuR2l0UGx1c0NvbW1hbmRzID0gcmVxdWlyZSAnLi4vZ2l0LXBsdXMtY29tbWFuZHMnXG5HaXRJbml0ID0gcmVxdWlyZSAnLi4vbW9kZWxzL2dpdC1pbml0J1xuZnV6enlGaWx0ZXIgPSByZXF1aXJlKCdmdXp6YWxkcmluJykuZmlsdGVyXG5tb2R1bGUuZXhwb3J0cyA9XG5jbGFzcyBHaXRQYWxldHRlVmlldyBleHRlbmRzIFNlbGVjdExpc3RWaWV3XG5cbiAgaW5pdGlhbGl6ZTogLT5cbiAgICBzdXBlclxuICAgIEBhZGRDbGFzcygnZ2l0LXBhbGV0dGUnKVxuICAgIEB0b2dnbGUoKVxuXG4gIGdldEZpbHRlcktleTogLT5cbiAgICAnZGVzY3JpcHRpb24nXG5cbiAgY2FuY2VsbGVkOiAtPiBAaGlkZSgpXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGlmIEBwYW5lbD8uaXNWaXNpYmxlKClcbiAgICAgIEBjYW5jZWwoKVxuICAgIGVsc2VcbiAgICAgIEBzaG93KClcblxuICBzaG93OiAtPlxuICAgIEBwYW5lbCA/PSBhdG9tLndvcmtzcGFjZS5hZGRNb2RhbFBhbmVsKGl0ZW06IHRoaXMpXG5cbiAgICBAc3RvcmVGb2N1c2VkRWxlbWVudCgpXG5cbiAgICBpZiBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50WzBdIGFuZCBAcHJldmlvdXNseUZvY3VzZWRFbGVtZW50WzBdIGlzbnQgZG9jdW1lbnQuYm9keVxuICAgICAgQGNvbW1hbmRFbGVtZW50ID0gQHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudFxuICAgIGVsc2VcbiAgICAgIEBjb21tYW5kRWxlbWVudCA9IGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSlcbiAgICBAa2V5QmluZGluZ3MgPSBhdG9tLmtleW1hcHMuZmluZEtleUJpbmRpbmdzKHRhcmdldDogQGNvbW1hbmRFbGVtZW50WzBdKVxuXG4gICAgR2l0UGx1c0NvbW1hbmRzKClcbiAgICAgIC50aGVuIChjb21tYW5kcykgPT5cbiAgICAgICAgY29tbWFuZHMgPSBjb21tYW5kcy5tYXAgKGMpIC0+IHsgbmFtZTogY1swXSwgZGVzY3JpcHRpb246IGNbMV0sIGZ1bmM6IGNbMl0gfVxuICAgICAgICBjb21tYW5kcyA9IF8uc29ydEJ5KGNvbW1hbmRzLCAnbmFtZScpXG4gICAgICAgIEBzZXRJdGVtcyhjb21tYW5kcylcbiAgICAgICAgQHBhbmVsLnNob3coKVxuICAgICAgICBAZm9jdXNGaWx0ZXJFZGl0b3IoKVxuICAgICAgLmNhdGNoIChlcnIpID0+XG4gICAgICAgIChjb21tYW5kcyA9IFtdKS5wdXNoIHsgbmFtZTogJ2dpdC1wbHVzOmluaXQnLCBkZXNjcmlwdGlvbjogJ0luaXQnLCBmdW5jOiAtPiBHaXRJbml0KCkgfVxuICAgICAgICBAc2V0SXRlbXMoY29tbWFuZHMpXG4gICAgICAgIEBwYW5lbC5zaG93KClcbiAgICAgICAgQGZvY3VzRmlsdGVyRWRpdG9yKClcblxuICBwb3B1bGF0ZUxpc3Q6IC0+XG4gICAgcmV0dXJuIHVubGVzcyBAaXRlbXM/XG5cbiAgICBmaWx0ZXJRdWVyeSA9IEBnZXRGaWx0ZXJRdWVyeSgpXG4gICAgaWYgZmlsdGVyUXVlcnkubGVuZ3RoXG4gICAgICBvcHRpb25zID1cbiAgICAgICAga2V5OiBAZ2V0RmlsdGVyS2V5KClcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBmdXp6eUZpbHRlcihAaXRlbXMsIGZpbHRlclF1ZXJ5LCBvcHRpb25zKVxuICAgIGVsc2VcbiAgICAgIGZpbHRlcmVkSXRlbXMgPSBAaXRlbXNcblxuICAgIEBsaXN0LmVtcHR5KClcbiAgICBpZiBmaWx0ZXJlZEl0ZW1zLmxlbmd0aFxuICAgICAgQHNldEVycm9yKG51bGwpXG4gICAgICBmb3IgaSBpbiBbMC4uLk1hdGgubWluKGZpbHRlcmVkSXRlbXMubGVuZ3RoLCBAbWF4SXRlbXMpXVxuICAgICAgICBpdGVtID0gZmlsdGVyZWRJdGVtc1tpXS5vcmlnaW5hbCA/IGZpbHRlcmVkSXRlbXNbaV1cbiAgICAgICAgaXRlbVZpZXcgPSAkKEB2aWV3Rm9ySXRlbShpdGVtLCBmaWx0ZXJlZEl0ZW1zW2ldLnN0cmluZyA/IG51bGwpKVxuICAgICAgICBpdGVtVmlldy5kYXRhKCdzZWxlY3QtbGlzdC1pdGVtJywgaXRlbSlcbiAgICAgICAgQGxpc3QuYXBwZW5kKGl0ZW1WaWV3KVxuXG4gICAgICBAc2VsZWN0SXRlbVZpZXcoQGxpc3QuZmluZCgnbGk6Zmlyc3QnKSlcbiAgICBlbHNlXG4gICAgICBAc2V0RXJyb3IoQGdldEVtcHR5TWVzc2FnZShAaXRlbXMubGVuZ3RoLCBmaWx0ZXJlZEl0ZW1zLmxlbmd0aCkpXG5cbiAgaGlkZTogLT5cbiAgICBAcGFuZWw/LmRlc3Ryb3koKVxuXG4gIHZpZXdGb3JJdGVtOiAoe25hbWUsIGRlc2NyaXB0aW9ufSwgbWF0Y2hlZFN0cikgLT5cbiAgICAkJCAtPlxuICAgICAgQGxpIGNsYXNzOiAnY29tbWFuZCcsICdkYXRhLWNvbW1hbmQtbmFtZSc6IG5hbWUsID0+XG4gICAgICAgIGlmIG1hdGNoZWRTdHI/IHRoZW4gQHJhdyhtYXRjaGVkU3RyKSBlbHNlIEBzcGFuIGRlc2NyaXB0aW9uXG5cbiAgY29uZmlybWVkOiAoe2Z1bmN9KSAtPlxuICAgIEBjYW5jZWwoKVxuICAgIGZ1bmMoKVxuIl19
