(function() {
  var Selector, log, provider, selectorsMatchScopeChain;

  provider = require('./provider');

  log = require('./log');

  selectorsMatchScopeChain = require('./scope-helpers').selectorsMatchScopeChain;

  Selector = require('selector-kit').Selector;

  module.exports = {
    priority: 1,
    providerName: 'autocomplete-python',
    disableForSelector: provider.disableForSelector + ", .source.python .numeric, .source.python .integer, .source.python .decimal, .source.python .punctuation, .source.python .keyword, .source.python .storage, .source.python .variable.parameter, .source.python .entity.name",
    _getScopes: function(editor, range) {
      return editor.scopeDescriptorForBufferPosition(range).scopes;
    },
    getSuggestionForWord: function(editor, text, range) {
      var bufferPosition, callback, disableForSelector, scopeChain, scopeDescriptor;
      if (text === '.' || text === ':') {
        return;
      }
      if (editor.getGrammar().scopeName.indexOf('source.python') > -1) {
        bufferPosition = range.start;
        scopeDescriptor = editor.scopeDescriptorForBufferPosition(bufferPosition);
        scopeChain = scopeDescriptor.getScopeChain();
        disableForSelector = Selector.create(this.disableForSelector);
        if (selectorsMatchScopeChain(disableForSelector, scopeChain)) {
          return;
        }
        if (atom.config.get('autocomplete-python.outputDebug')) {
          log.debug(range.start, this._getScopes(editor, range.start));
          log.debug(range.end, this._getScopes(editor, range.end));
        }
        callback = function() {
          return provider.goToDefinition(editor, bufferPosition);
        };
        return {
          range: range,
          callback: callback
        };
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9oeXBlcmNsaWNrLXByb3ZpZGVyLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxZQUFSOztFQUNYLEdBQUEsR0FBTSxPQUFBLENBQVEsT0FBUjs7RUFDTCwyQkFBNEIsT0FBQSxDQUFRLGlCQUFSOztFQUM1QixXQUFZLE9BQUEsQ0FBUSxjQUFSOztFQUViLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7SUFBQSxRQUFBLEVBQVUsQ0FBVjtJQUVBLFlBQUEsRUFBYyxxQkFGZDtJQUlBLGtCQUFBLEVBQXVCLFFBQVEsQ0FBQyxrQkFBVixHQUE2Qiw2TkFKbkQ7SUFNQSxVQUFBLEVBQVksU0FBQyxNQUFELEVBQVMsS0FBVDtBQUNWLGFBQU8sTUFBTSxDQUFDLGdDQUFQLENBQXdDLEtBQXhDLENBQThDLENBQUM7SUFENUMsQ0FOWjtJQVNBLG9CQUFBLEVBQXNCLFNBQUMsTUFBRCxFQUFTLElBQVQsRUFBZSxLQUFmO0FBQ3BCLFVBQUE7TUFBQSxJQUFHLElBQUEsS0FBUyxHQUFULElBQUEsSUFBQSxLQUFjLEdBQWpCO0FBQ0UsZUFERjs7TUFFQSxJQUFHLE1BQU0sQ0FBQyxVQUFQLENBQUEsQ0FBbUIsQ0FBQyxTQUFTLENBQUMsT0FBOUIsQ0FBc0MsZUFBdEMsQ0FBQSxHQUF5RCxDQUFDLENBQTdEO1FBQ0UsY0FBQSxHQUFpQixLQUFLLENBQUM7UUFDdkIsZUFBQSxHQUFrQixNQUFNLENBQUMsZ0NBQVAsQ0FDaEIsY0FEZ0I7UUFFbEIsVUFBQSxHQUFhLGVBQWUsQ0FBQyxhQUFoQixDQUFBO1FBQ2Isa0JBQUEsR0FBcUIsUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsSUFBQyxDQUFBLGtCQUFqQjtRQUNyQixJQUFHLHdCQUFBLENBQXlCLGtCQUF6QixFQUE2QyxVQUE3QyxDQUFIO0FBQ0UsaUJBREY7O1FBR0EsSUFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLENBQUg7VUFDRSxHQUFHLENBQUMsS0FBSixDQUFVLEtBQUssQ0FBQyxLQUFoQixFQUF1QixJQUFDLENBQUEsVUFBRCxDQUFZLE1BQVosRUFBb0IsS0FBSyxDQUFDLEtBQTFCLENBQXZCO1VBQ0EsR0FBRyxDQUFDLEtBQUosQ0FBVSxLQUFLLENBQUMsR0FBaEIsRUFBcUIsSUFBQyxDQUFBLFVBQUQsQ0FBWSxNQUFaLEVBQW9CLEtBQUssQ0FBQyxHQUExQixDQUFyQixFQUZGOztRQUdBLFFBQUEsR0FBVyxTQUFBO2lCQUNULFFBQVEsQ0FBQyxjQUFULENBQXdCLE1BQXhCLEVBQWdDLGNBQWhDO1FBRFM7QUFFWCxlQUFPO1VBQUMsT0FBQSxLQUFEO1VBQVEsVUFBQSxRQUFSO1VBZFQ7O0lBSG9CLENBVHRCOztBQU5GIiwic291cmNlc0NvbnRlbnQiOlsicHJvdmlkZXIgPSByZXF1aXJlICcuL3Byb3ZpZGVyJ1xubG9nID0gcmVxdWlyZSAnLi9sb2cnXG57c2VsZWN0b3JzTWF0Y2hTY29wZUNoYWlufSA9IHJlcXVpcmUgJy4vc2NvcGUtaGVscGVycydcbntTZWxlY3Rvcn0gPSByZXF1aXJlICdzZWxlY3Rvci1raXQnXG5cbm1vZHVsZS5leHBvcnRzID1cbiAgcHJpb3JpdHk6IDFcblxuICBwcm92aWRlck5hbWU6ICdhdXRvY29tcGxldGUtcHl0aG9uJ1xuXG4gIGRpc2FibGVGb3JTZWxlY3RvcjogXCIje3Byb3ZpZGVyLmRpc2FibGVGb3JTZWxlY3Rvcn0sIC5zb3VyY2UucHl0aG9uIC5udW1lcmljLCAuc291cmNlLnB5dGhvbiAuaW50ZWdlciwgLnNvdXJjZS5weXRob24gLmRlY2ltYWwsIC5zb3VyY2UucHl0aG9uIC5wdW5jdHVhdGlvbiwgLnNvdXJjZS5weXRob24gLmtleXdvcmQsIC5zb3VyY2UucHl0aG9uIC5zdG9yYWdlLCAuc291cmNlLnB5dGhvbiAudmFyaWFibGUucGFyYW1ldGVyLCAuc291cmNlLnB5dGhvbiAuZW50aXR5Lm5hbWVcIlxuXG4gIF9nZXRTY29wZXM6IChlZGl0b3IsIHJhbmdlKSAtPlxuICAgIHJldHVybiBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24ocmFuZ2UpLnNjb3Blc1xuXG4gIGdldFN1Z2dlc3Rpb25Gb3JXb3JkOiAoZWRpdG9yLCB0ZXh0LCByYW5nZSkgLT5cbiAgICBpZiB0ZXh0IGluIFsnLicsICc6J11cbiAgICAgIHJldHVyblxuICAgIGlmIGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lLmluZGV4T2YoJ3NvdXJjZS5weXRob24nKSA+IC0xXG4gICAgICBidWZmZXJQb3NpdGlvbiA9IHJhbmdlLnN0YXJ0XG4gICAgICBzY29wZURlc2NyaXB0b3IgPSBlZGl0b3Iuc2NvcGVEZXNjcmlwdG9yRm9yQnVmZmVyUG9zaXRpb24oXG4gICAgICAgIGJ1ZmZlclBvc2l0aW9uKVxuICAgICAgc2NvcGVDaGFpbiA9IHNjb3BlRGVzY3JpcHRvci5nZXRTY29wZUNoYWluKClcbiAgICAgIGRpc2FibGVGb3JTZWxlY3RvciA9IFNlbGVjdG9yLmNyZWF0ZShAZGlzYWJsZUZvclNlbGVjdG9yKVxuICAgICAgaWYgc2VsZWN0b3JzTWF0Y2hTY29wZUNoYWluKGRpc2FibGVGb3JTZWxlY3Rvciwgc2NvcGVDaGFpbilcbiAgICAgICAgcmV0dXJuXG5cbiAgICAgIGlmIGF0b20uY29uZmlnLmdldCgnYXV0b2NvbXBsZXRlLXB5dGhvbi5vdXRwdXREZWJ1ZycpXG4gICAgICAgIGxvZy5kZWJ1ZyByYW5nZS5zdGFydCwgQF9nZXRTY29wZXMoZWRpdG9yLCByYW5nZS5zdGFydClcbiAgICAgICAgbG9nLmRlYnVnIHJhbmdlLmVuZCwgQF9nZXRTY29wZXMoZWRpdG9yLCByYW5nZS5lbmQpXG4gICAgICBjYWxsYmFjayA9IC0+XG4gICAgICAgIHByb3ZpZGVyLmdvVG9EZWZpbml0aW9uKGVkaXRvciwgYnVmZmVyUG9zaXRpb24pXG4gICAgICByZXR1cm4ge3JhbmdlLCBjYWxsYmFja31cbiJdfQ==
