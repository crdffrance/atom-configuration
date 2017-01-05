(function() {
  var OutputView, create, getView, view;

  OutputView = require('./views/output-view');

  view = null;

  getView = function() {
    if (view === null) {
      view = new OutputView;
      atom.workspace.addBottomPanel({
        item: view
      });
      view.hide();
    }
    return view;
  };

  create = function() {
    if (view != null) {
      view.reset();
    }
    return getView();
  };

  module.exports = {
    create: create,
    getView: getView
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvb3V0cHV0LXZpZXctbWFuYWdlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLFVBQUEsR0FBYSxPQUFBLENBQVEscUJBQVI7O0VBRWIsSUFBQSxHQUFPOztFQUVQLE9BQUEsR0FBVSxTQUFBO0lBQ1IsSUFBRyxJQUFBLEtBQVEsSUFBWDtNQUNFLElBQUEsR0FBTyxJQUFJO01BQ1gsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFmLENBQThCO1FBQUEsSUFBQSxFQUFNLElBQU47T0FBOUI7TUFDQSxJQUFJLENBQUMsSUFBTCxDQUFBLEVBSEY7O1dBSUE7RUFMUTs7RUFPVixNQUFBLEdBQVMsU0FBQTs7TUFDUCxJQUFJLENBQUUsS0FBTixDQUFBOztXQUNBLE9BQUEsQ0FBQTtFQUZPOztFQUlULE1BQU0sQ0FBQyxPQUFQLEdBQWlCO0lBQUMsUUFBQSxNQUFEO0lBQVMsU0FBQSxPQUFUOztBQWZqQiIsInNvdXJjZXNDb250ZW50IjpbIk91dHB1dFZpZXcgPSByZXF1aXJlICcuL3ZpZXdzL291dHB1dC12aWV3J1xuXG52aWV3ID0gbnVsbFxuXG5nZXRWaWV3ID0gLT5cbiAgaWYgdmlldyBpcyBudWxsXG4gICAgdmlldyA9IG5ldyBPdXRwdXRWaWV3XG4gICAgYXRvbS53b3Jrc3BhY2UuYWRkQm90dG9tUGFuZWwoaXRlbTogdmlldylcbiAgICB2aWV3LmhpZGUoKVxuICB2aWV3XG5cbmNyZWF0ZSA9IC0+XG4gIHZpZXc/LnJlc2V0KClcbiAgZ2V0VmlldygpXG5cbm1vZHVsZS5leHBvcnRzID0ge2NyZWF0ZSwgZ2V0Vmlld31cbiJdfQ==
