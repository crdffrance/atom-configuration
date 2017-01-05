(function() {
  module.exports = {
    priority: 1,
    providerName: 'autocomplete-python',
    disableForSelector: '.source.python .comment, .source.python .string, .source.python .numeric, .source.python .integer, .source.python .decimal, .source.python .punctuation, .source.python .keyword, .source.python .storage, .source.python .variable.parameter, .source.python .entity.name',
    constructed: false,
    constructor: function() {
      this.provider = require('./provider');
      this.log = require('./log');
      this.selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;
      this.Selector = require('selector-kit').Selector;
      this.constructed = true;
      return this.log.debug('Loading python hyper-click provider...');
    },
    _getScopes: function(editor, range) {
      return editor.scopeDescriptorForBufferPosition(range).scopes;
    },
    getSuggestionForWord: function(editor, text, range) {
      var bufferPosition, callback, disableForSelector, scopeChain, scopeDescriptor;
      if (!this.constructed) {
        this.constructor();
      }
      if (text === '.' || text === ':') {
        return;
      }
      if (editor.getGrammar().scopeName.indexOf('source.python') > -1) {
        bufferPosition = range.start;
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(bufferPosition);
        scopeChain = scopeDescriptor.getScopeChain();
        disableForSelector = this.Selector.create(this.disableForSelector);
        if (this.selectorsMatchScopeChain(disableForSelector, scopeChain)) {
          return;
        }
        if (atom.config.get('autocomplete-python.outputDebug')) {
          this.log.debug(range.start, this._getScopes(editor, range.start));
          this.log.debug(range.end, this._getScopes(editor, range.end));
        }
        callback = (function(_this) {
          return function() {
            return _this.provider.goToDefinition(editor, bufferPosition);
          };
        })(this);
        return {
          range: range,
          callback: callback
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9oeXBlcmNsaWNrLXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsQ0FBVjtJQUNBLFlBQUEsRUFBYyxxQkFEZDtJQUVBLGtCQUFBLEVBQW9CLDRRQUZwQjtJQUdBLFdBQUEsRUFBYSxLQUhiO0lBS0EsV0FBQSxFQUFhLFNBQUE7TUFDWCxJQUFDLENBQUEsUUFBRCxHQUFZLE9BQUEsQ0FBUSxZQUFSO01BQ1osSUFBQyxDQUFBLEdBQUQsR0FBTyxPQUFBLENBQVEsT0FBUjtNQUNOLElBQUMsQ0FBQSwyQkFBNEIsT0FBQSxDQUFRLGlCQUFSLEVBQTVCO01BQ0QsSUFBQyxDQUFBLFdBQVksT0FBQSxDQUFRLGNBQVIsRUFBWjtNQUNGLElBQUMsQ0FBQSxXQUFELEdBQWU7YUFDZixJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBVyx3Q0FBWDtJQU5XLENBTGI7SUFhQSxVQUFBLEVBQVksU0FBQyxNQUFELEVBQVMsS0FBVDtBQUNWLGFBQU8sTUFBTSxDQUFDLGdDQUFQLENBQXdDLEtBQXhDLENBQThDLENBQUM7SUFENUMsQ0FiWjtJQWdCQSxvQkFBQSxFQUFzQixTQUFDLE1BQUQsRUFBUyxJQUFULEVBQWUsS0FBZjtBQUNwQixVQUFBO01BQUEsSUFBRyxDQUFJLElBQUMsQ0FBQSxXQUFSO1FBQ0UsSUFBQyxDQUFBLFdBQUQsQ0FBQSxFQURGOztNQUVBLElBQUcsSUFBQSxLQUFTLEdBQVQsSUFBQSxJQUFBLEtBQWMsR0FBakI7QUFDRSxlQURGOztNQUVBLElBQUcsTUFBTSxDQUFDLFVBQVAsQ0FBQSxDQUFtQixDQUFDLFNBQVMsQ0FBQyxPQUE5QixDQUFzQyxlQUF0QyxDQUFBLEdBQXlELENBQUMsQ0FBN0Q7UUFDRSxjQUFBLEdBQWlCLEtBQUssQ0FBQztRQUN2QixlQUFBLEdBQWtCLE1BQU0sQ0FBQyxnQ0FBUCxDQUNoQixjQURnQjtRQUVsQixVQUFBLEdBQWEsZUFBZSxDQUFDLGFBQWhCLENBQUE7UUFDYixrQkFBQSxHQUFxQixJQUFDLENBQUEsUUFBUSxDQUFDLE1BQVYsQ0FBaUIsSUFBQyxDQUFBLGtCQUFsQjtRQUNyQixJQUFHLElBQUMsQ0FBQSx3QkFBRCxDQUEwQixrQkFBMUIsRUFBOEMsVUFBOUMsQ0FBSDtBQUNFLGlCQURGOztRQUdBLElBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlDQUFoQixDQUFIO1VBQ0UsSUFBQyxDQUFBLEdBQUcsQ0FBQyxLQUFMLENBQVcsS0FBSyxDQUFDLEtBQWpCLEVBQXdCLElBQUMsQ0FBQSxVQUFELENBQVksTUFBWixFQUFvQixLQUFLLENBQUMsS0FBMUIsQ0FBeEI7VUFDQSxJQUFDLENBQUEsR0FBRyxDQUFDLEtBQUwsQ0FBVyxLQUFLLENBQUMsR0FBakIsRUFBc0IsSUFBQyxDQUFBLFVBQUQsQ0FBWSxNQUFaLEVBQW9CLEtBQUssQ0FBQyxHQUExQixDQUF0QixFQUZGOztRQUdBLFFBQUEsR0FBVyxDQUFBLFNBQUEsS0FBQTtpQkFBQSxTQUFBO21CQUNULEtBQUMsQ0FBQSxRQUFRLENBQUMsY0FBVixDQUF5QixNQUF6QixFQUFpQyxjQUFqQztVQURTO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQTtBQUVYLGVBQU87VUFBQyxPQUFBLEtBQUQ7VUFBUSxVQUFBLFFBQVI7VUFkVDs7SUFMb0IsQ0FoQnRCOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBwcmlvcml0eTogMVxuICBwcm92aWRlck5hbWU6ICdhdXRvY29tcGxldGUtcHl0aG9uJ1xuICBkaXNhYmxlRm9yU2VsZWN0b3I6ICcuc291cmNlLnB5dGhvbiAuY29tbWVudCwgLnNvdXJjZS5weXRob24gLnN0cmluZywgLnNvdXJjZS5weXRob24gLm51bWVyaWMsIC5zb3VyY2UucHl0aG9uIC5pbnRlZ2VyLCAuc291cmNlLnB5dGhvbiAuZGVjaW1hbCwgLnNvdXJjZS5weXRob24gLnB1bmN0dWF0aW9uLCAuc291cmNlLnB5dGhvbiAua2V5d29yZCwgLnNvdXJjZS5weXRob24gLnN0b3JhZ2UsIC5zb3VyY2UucHl0aG9uIC52YXJpYWJsZS5wYXJhbWV0ZXIsIC5zb3VyY2UucHl0aG9uIC5lbnRpdHkubmFtZSdcbiAgY29uc3RydWN0ZWQ6IGZhbHNlXG5cbiAgY29uc3RydWN0b3I6IC0+XG4gICAgQHByb3ZpZGVyID0gcmVxdWlyZSAnLi9wcm92aWRlcidcbiAgICBAbG9nID0gcmVxdWlyZSAnLi9sb2cnXG4gICAge0BzZWxlY3RvcnNNYXRjaFNjb3BlQ2hhaW59ID0gcmVxdWlyZSAnLi9zY29wZS1oZWxwZXJzJ1xuICAgIHtAU2VsZWN0b3J9ID0gcmVxdWlyZSAnc2VsZWN0b3Ita2l0J1xuICAgIEBjb25zdHJ1Y3RlZCA9IHRydWVcbiAgICBAbG9nLmRlYnVnICdMb2FkaW5nIHB5dGhvbiBoeXBlci1jbGljayBwcm92aWRlci4uLidcblxuICBfZ2V0U2NvcGVzOiAoZWRpdG9yLCByYW5nZSkgLT5cbiAgICByZXR1cm4gZWRpdG9yLnNjb3BlRGVzY3JpcHRvckZvckJ1ZmZlclBvc2l0aW9uKHJhbmdlKS5zY29wZXNcblxuICBnZXRTdWdnZXN0aW9uRm9yV29yZDogKGVkaXRvciwgdGV4dCwgcmFuZ2UpIC0+XG4gICAgaWYgbm90IEBjb25zdHJ1Y3RlZFxuICAgICAgQGNvbnN0cnVjdG9yKClcbiAgICBpZiB0ZXh0IGluIFsnLicsICc6J11cbiAgICAgIHJldHVyblxuICAgIGlmIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lLmluZGV4T2YoJ3NvdXJjZS5weXRob24nKSA+IC0xXG4gICAgICBidWZmZXJQb3NpdGlvbiA9IHJhbmdlLnN0YXJ0XG4gICAgICBzY29wZURlc2NyaXB0b3IgPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oXG4gICAgICAgIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgc2NvcGVDaGFpbiA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZUNoYWluKClcbiAgICAgIGRpc2FibGVGb3JTZWxlY3RvciA9IEBTZWxlY3Rvci5jcmVhdGUoQGRpc2FibGVGb3JTZWxlY3RvcilcbiAgICAgIGlmIEBzZWxlY3RvcnNNYXRjaFNjb3BlQ2hhaW4oZGlzYWJsZUZvclNlbGVjdG9yLCBzY29wZUNoYWluKVxuICAgICAgICByZXR1cm5cblxuICAgICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLm91dHB1dERlYnVnJylcbiAgICAgICAgQGxvZy5kZWJ1ZyByYW5nZS5zdGFydCwgQF9nZXRTY29wZXMoZWRpdG9yLCByYW5nZS5zdGFydClcbiAgICAgICAgQGxvZy5kZWJ1ZyByYW5nZS5lbmQsIEBfZ2V0U2NvcGVzKGVkaXRvciwgcmFuZ2UuZW5kKVxuICAgICAgY2FsbGJhY2sgPSA9PlxuICAgICAgICBAcHJvdmlkZXIuZ29Ub0RlZmluaXRpb24oZWRpdG9yLCBidWZmZXJQb3NpdGlvbilcbiAgICAgIHJldHVybiB7cmFuZ2UsIGNhbGxiYWNrfVxuIl19
