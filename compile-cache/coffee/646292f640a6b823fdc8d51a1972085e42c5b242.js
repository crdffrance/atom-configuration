(function() {
  var SelectStageHunkFile, git, gitStageHunk;

  git = require('../git');

  SelectStageHunkFile = require('../views/select-stage-hunk-file-view');

  gitStageHunk = function(repo) {
    return git.unstagedFiles(repo).then(function(data) {
      return new SelectStageHunkFile(repo, data);
    });
  };

  module.exports = gitStageHunk;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1zdGFnZS1odW5rLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUFBLE1BQUE7O0VBQUEsR0FBQSxHQUFNLE9BQUEsQ0FBUSxRQUFSOztFQUNOLG1CQUFBLEdBQXNCLE9BQUEsQ0FBUSxzQ0FBUjs7RUFFdEIsWUFBQSxHQUFlLFNBQUMsSUFBRDtXQUNiLEdBQUcsQ0FBQyxhQUFKLENBQWtCLElBQWxCLENBQ0EsQ0FBQyxJQURELENBQ00sU0FBQyxJQUFEO2FBQWMsSUFBQSxtQkFBQSxDQUFvQixJQUFwQixFQUEwQixJQUExQjtJQUFkLENBRE47RUFEYTs7RUFJZixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQVBqQiIsInNvdXJjZXNDb250ZW50IjpbImdpdCA9IHJlcXVpcmUgJy4uL2dpdCdcblNlbGVjdFN0YWdlSHVua0ZpbGUgPSByZXF1aXJlICcuLi92aWV3cy9zZWxlY3Qtc3RhZ2UtaHVuay1maWxlLXZpZXcnXG5cbmdpdFN0YWdlSHVuayA9IChyZXBvKSAtPlxuICBnaXQudW5zdGFnZWRGaWxlcyhyZXBvKVxuICAudGhlbiAoZGF0YSkgLT4gbmV3IFNlbGVjdFN0YWdlSHVua0ZpbGUocmVwbywgZGF0YSlcblxubW9kdWxlLmV4cG9ydHMgPSBnaXRTdGFnZUh1bmtcbiJdfQ==
