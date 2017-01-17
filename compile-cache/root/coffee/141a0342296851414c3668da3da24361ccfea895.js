(function() {
  var CherryPickSelectBranch, git, gitCherryPick;

  git = require('../git');

  CherryPickSelectBranch = require('../views/cherry-pick-select-branch-view');

  gitCherryPick = function(repo) {
    var currentHead, head, heads, i, j, len;
    heads = repo.getReferences().heads;
    currentHead = repo.getShortHead();
    for (i = j = 0, len = heads.length; j < len; i = ++j) {
      head = heads[i];
      heads[i] = head.replace('refs/heads/', '');
    }
    heads = heads.filter(function(head) {
      return head !== currentHead;
    });
    return new CherryPickSelectBranch(repo, heads, currentHead);
  };

  module.exports = gitCherryPick;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1jaGVycnktcGljay5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixzQkFBQSxHQUF5QixPQUFBLENBQVEseUNBQVI7O0VBRXpCLGFBQUEsR0FBZ0IsU0FBQyxJQUFEO0FBQ2QsUUFBQTtJQUFBLEtBQUEsR0FBUSxJQUFJLENBQUMsYUFBTCxDQUFBLENBQW9CLENBQUM7SUFDN0IsV0FBQSxHQUFjLElBQUksQ0FBQyxZQUFMLENBQUE7QUFFZCxTQUFBLCtDQUFBOztNQUNFLEtBQU0sQ0FBQSxDQUFBLENBQU4sR0FBVyxJQUFJLENBQUMsT0FBTCxDQUFhLGFBQWIsRUFBNEIsRUFBNUI7QUFEYjtJQUdBLEtBQUEsR0FBUSxLQUFLLENBQUMsTUFBTixDQUFhLFNBQUMsSUFBRDthQUFVLElBQUEsS0FBVTtJQUFwQixDQUFiO1dBQ0osSUFBQSxzQkFBQSxDQUF1QixJQUF2QixFQUE2QixLQUE3QixFQUFvQyxXQUFwQztFQVJVOztFQVVoQixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQWJqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcbkNoZXJyeVBpY2tTZWxlY3RCcmFuY2ggPSByZXF1aXJlICcuLi92aWV3cy9jaGVycnktcGljay1zZWxlY3QtYnJhbmNoLXZpZXcnXG5cbmdpdENoZXJyeVBpY2sgPSAocmVwbykgLT5cbiAgaGVhZHMgPSByZXBvLmdldFJlZmVyZW5jZXMoKS5oZWFkc1xuICBjdXJyZW50SGVhZCA9IHJlcG8uZ2V0U2hvcnRIZWFkKClcblxuICBmb3IgaGVhZCwgaSBpbiBoZWFkc1xuICAgIGhlYWRzW2ldID0gaGVhZC5yZXBsYWNlKCdyZWZzL2hlYWRzLycsICcnKVxuXG4gIGhlYWRzID0gaGVhZHMuZmlsdGVyIChoZWFkKSAtPiBoZWFkIGlzbnQgY3VycmVudEhlYWRcbiAgbmV3IENoZXJyeVBpY2tTZWxlY3RCcmFuY2gocmVwbywgaGVhZHMsIGN1cnJlbnRIZWFkKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdpdENoZXJyeVBpY2tcbiJdfQ==
