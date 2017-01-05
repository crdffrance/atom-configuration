(function() {
  var EscapeCharacterRegex, cachedMatchesBySelector, getCachedMatch, parseScopeChain, selectorForScopeChain, selectorsMatchScopeChain, setCachedMatch, slick;

  slick = require('atom-slick');

  EscapeCharacterRegex = /[-!"#$%&'*+,\/:;=?@|^~()<>{}[\]]/g;

  cachedMatchesBySelector = new WeakMap;

  getCachedMatch = function(selector, scopeChain) {
    var cachedMatchesByScopeChain;
    if (cachedMatchesByScopeChain = cachedMatchesBySelector.get(selector)) {
      return cachedMatchesByScopeChain[scopeChain];
    }
  };

  setCachedMatch = function(selector, scopeChain, match) {
    var cachedMatchesByScopeChain;
    if (!(cachedMatchesByScopeChain = cachedMatchesBySelector.get(selector))) {
      cachedMatchesByScopeChain = {};
      cachedMatchesBySelector.set(selector, cachedMatchesByScopeChain);
    }
    return cachedMatchesByScopeChain[scopeChain] = match;
  };

  parseScopeChain = function(scopeChain) {
    var i, len, ref, ref1, results, scope;
    scopeChain = scopeChain.replace(EscapeCharacterRegex, function(match) {
      return "\\" + match[0];
    });
    ref1 = (ref = slick.parse(scopeChain)[0]) != null ? ref : [];
    results = [];
    for (i = 0, len = ref1.length; i < len; i++) {
      scope = ref1[i];
      results.push(scope);
    }
    return results;
  };

  selectorForScopeChain = function(selectors, scopeChain) {
    var cachedMatch, i, len, scopes, selector;
    for (i = 0, len = selectors.length; i < len; i++) {
      selector = selectors[i];
      cachedMatch = getCachedMatch(selector, scopeChain);
      if (cachedMatch != null) {
        if (cachedMatch) {
          return selector;
        } else {
          continue;
        }
      } else {
        scopes = parseScopeChain(scopeChain);
        while (scopes.length > 0) {
          if (selector.matches(scopes)) {
            setCachedMatch(selector, scopeChain, true);
            return selector;
          }
          scopes.pop();
        }
        setCachedMatch(selector, scopeChain, false);
      }
    }
    return null;
  };

  selectorsMatchScopeChain = function(selectors, scopeChain) {
    return selectorForScopeChain(selectors, scopeChain) != null;
  };

  module.exports = {
    parseScopeChain: parseScopeChain,
    selectorsMatchScopeChain: selectorsMatchScopeChain,
    selectorForScopeChain: selectorForScopeChain
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9zY29wZS1oZWxwZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsS0FBQSxHQUFRLE9BQUEsQ0FBUSxZQUFSOztFQUVSLG9CQUFBLEdBQXVCOztFQUV2Qix1QkFBQSxHQUEwQixJQUFJOztFQUU5QixjQUFBLEdBQWlCLFNBQUMsUUFBRCxFQUFXLFVBQVg7QUFDZixRQUFBO0lBQUEsSUFBRyx5QkFBQSxHQUE0Qix1QkFBdUIsQ0FBQyxHQUF4QixDQUE0QixRQUE1QixDQUEvQjtBQUNFLGFBQU8seUJBQTBCLENBQUEsVUFBQSxFQURuQzs7RUFEZTs7RUFJakIsY0FBQSxHQUFpQixTQUFDLFFBQUQsRUFBVyxVQUFYLEVBQXVCLEtBQXZCO0FBQ2YsUUFBQTtJQUFBLElBQUEsQ0FBTyxDQUFBLHlCQUFBLEdBQTRCLHVCQUF1QixDQUFDLEdBQXhCLENBQTRCLFFBQTVCLENBQTVCLENBQVA7TUFDRSx5QkFBQSxHQUE0QjtNQUM1Qix1QkFBdUIsQ0FBQyxHQUF4QixDQUE0QixRQUE1QixFQUFzQyx5QkFBdEMsRUFGRjs7V0FHQSx5QkFBMEIsQ0FBQSxVQUFBLENBQTFCLEdBQXdDO0VBSnpCOztFQU1qQixlQUFBLEdBQWtCLFNBQUMsVUFBRDtBQUNoQixRQUFBO0lBQUEsVUFBQSxHQUFhLFVBQVUsQ0FBQyxPQUFYLENBQW1CLG9CQUFuQixFQUF5QyxTQUFDLEtBQUQ7YUFBVyxJQUFBLEdBQUssS0FBTSxDQUFBLENBQUE7SUFBdEIsQ0FBekM7QUFDYjtBQUFBO1NBQUEsc0NBQUE7O21CQUFBO0FBQUE7O0VBRmdCOztFQUlsQixxQkFBQSxHQUF3QixTQUFDLFNBQUQsRUFBWSxVQUFaO0FBQ3RCLFFBQUE7QUFBQSxTQUFBLDJDQUFBOztNQUNFLFdBQUEsR0FBYyxjQUFBLENBQWUsUUFBZixFQUF5QixVQUF6QjtNQUNkLElBQUcsbUJBQUg7UUFDRSxJQUFHLFdBQUg7QUFDRSxpQkFBTyxTQURUO1NBQUEsTUFBQTtBQUdFLG1CQUhGO1NBREY7T0FBQSxNQUFBO1FBTUUsTUFBQSxHQUFTLGVBQUEsQ0FBZ0IsVUFBaEI7QUFDVCxlQUFNLE1BQU0sQ0FBQyxNQUFQLEdBQWdCLENBQXRCO1VBQ0UsSUFBRyxRQUFRLENBQUMsT0FBVCxDQUFpQixNQUFqQixDQUFIO1lBQ0UsY0FBQSxDQUFlLFFBQWYsRUFBeUIsVUFBekIsRUFBcUMsSUFBckM7QUFDQSxtQkFBTyxTQUZUOztVQUdBLE1BQU0sQ0FBQyxHQUFQLENBQUE7UUFKRjtRQUtBLGNBQUEsQ0FBZSxRQUFmLEVBQXlCLFVBQXpCLEVBQXFDLEtBQXJDLEVBWkY7O0FBRkY7V0FnQkE7RUFqQnNCOztFQW1CeEIsd0JBQUEsR0FBMkIsU0FBQyxTQUFELEVBQVksVUFBWjtXQUN6QjtFQUR5Qjs7RUFHM0IsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFBQyxpQkFBQSxlQUFEO0lBQWtCLDBCQUFBLHdCQUFsQjtJQUE0Qyx1QkFBQSxxQkFBNUM7O0FBMUNqQiIsInNvdXJjZXNDb250ZW50IjpbInNsaWNrID0gcmVxdWlyZSAnYXRvbS1zbGljaydcblxuRXNjYXBlQ2hhcmFjdGVyUmVnZXggPSAvWy0hXCIjJCUmJyorLC86Oz0/QHxefigpPD57fVtcXF1dL2dcblxuY2FjaGVkTWF0Y2hlc0J5U2VsZWN0b3IgPSBuZXcgV2Vha01hcFxuXG5nZXRDYWNoZWRNYXRjaCA9IChzZWxlY3Rvciwgc2NvcGVDaGFpbikgLT5cbiAgaWYgY2FjaGVkTWF0Y2hlc0J5U2NvcGVDaGFpbiA9IGNhY2hlZE1hdGNoZXNCeVNlbGVjdG9yLmdldChzZWxlY3RvcilcbiAgICByZXR1cm4gY2FjaGVkTWF0Y2hlc0J5U2NvcGVDaGFpbltzY29wZUNoYWluXVxuXG5zZXRDYWNoZWRNYXRjaCA9IChzZWxlY3Rvciwgc2NvcGVDaGFpbiwgbWF0Y2gpIC0+XG4gIHVubGVzcyBjYWNoZWRNYXRjaGVzQnlTY29wZUNoYWluID0gY2FjaGVkTWF0Y2hlc0J5U2VsZWN0b3IuZ2V0KHNlbGVjdG9yKVxuICAgIGNhY2hlZE1hdGNoZXNCeVNjb3BlQ2hhaW4gPSB7fVxuICAgIGNhY2hlZE1hdGNoZXNCeVNlbGVjdG9yLnNldChzZWxlY3RvciwgY2FjaGVkTWF0Y2hlc0J5U2NvcGVDaGFpbilcbiAgY2FjaGVkTWF0Y2hlc0J5U2NvcGVDaGFpbltzY29wZUNoYWluXSA9IG1hdGNoXG5cbnBhcnNlU2NvcGVDaGFpbiA9IChzY29wZUNoYWluKSAtPlxuICBzY29wZUNoYWluID0gc2NvcGVDaGFpbi5yZXBsYWNlIEVzY2FwZUNoYXJhY3RlclJlZ2V4LCAobWF0Y2gpIC0+IFwiXFxcXCN7bWF0Y2hbMF19XCJcbiAgc2NvcGUgZm9yIHNjb3BlIGluIHNsaWNrLnBhcnNlKHNjb3BlQ2hhaW4pWzBdID8gW11cblxuc2VsZWN0b3JGb3JTY29wZUNoYWluID0gKHNlbGVjdG9ycywgc2NvcGVDaGFpbikgLT5cbiAgZm9yIHNlbGVjdG9yIGluIHNlbGVjdG9yc1xuICAgIGNhY2hlZE1hdGNoID0gZ2V0Q2FjaGVkTWF0Y2goc2VsZWN0b3IsIHNjb3BlQ2hhaW4pXG4gICAgaWYgY2FjaGVkTWF0Y2g/XG4gICAgICBpZiBjYWNoZWRNYXRjaFxuICAgICAgICByZXR1cm4gc2VsZWN0b3JcbiAgICAgIGVsc2VcbiAgICAgICAgY29udGludWVcbiAgICBlbHNlXG4gICAgICBzY29wZXMgPSBwYXJzZVNjb3BlQ2hhaW4oc2NvcGVDaGFpbilcbiAgICAgIHdoaWxlIHNjb3Blcy5sZW5ndGggPiAwXG4gICAgICAgIGlmIHNlbGVjdG9yLm1hdGNoZXMoc2NvcGVzKVxuICAgICAgICAgIHNldENhY2hlZE1hdGNoKHNlbGVjdG9yLCBzY29wZUNoYWluLCB0cnVlKVxuICAgICAgICAgIHJldHVybiBzZWxlY3RvclxuICAgICAgICBzY29wZXMucG9wKClcbiAgICAgIHNldENhY2hlZE1hdGNoKHNlbGVjdG9yLCBzY29wZUNoYWluLCBmYWxzZSlcblxuICBudWxsXG5cbnNlbGVjdG9yc01hdGNoU2NvcGVDaGFpbiA9IChzZWxlY3RvcnMsIHNjb3BlQ2hhaW4pIC0+XG4gIHNlbGVjdG9yRm9yU2NvcGVDaGFpbihzZWxlY3RvcnMsIHNjb3BlQ2hhaW4pP1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtwYXJzZVNjb3BlQ2hhaW4sIHNlbGVjdG9yc01hdGNoU2NvcGVDaGFpbiwgc2VsZWN0b3JGb3JTY29wZUNoYWlufVxuIl19
