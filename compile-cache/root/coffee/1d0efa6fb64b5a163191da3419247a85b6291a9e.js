(function() {
  var BranchListView, RemoteBranchListView, git,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  git = require('../git');

  BranchListView = require('../views/branch-list-view');

  module.exports = RemoteBranchListView = (function(superClass) {
    extend(RemoteBranchListView, superClass);

    function RemoteBranchListView() {
      return RemoteBranchListView.__super__.constructor.apply(this, arguments);
    }

    RemoteBranchListView.prototype.args = ['checkout', '-t'];

    return RemoteBranchListView;

  })(BranchListView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3MvcmVtb3RlLWJyYW5jaC1saXN0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSx5Q0FBQTtJQUFBOzs7RUFBQSxHQUFBLEdBQU0sT0FBQSxDQUFRLFFBQVI7O0VBQ04sY0FBQSxHQUFpQixPQUFBLENBQVEsMkJBQVI7O0VBRWpCLE1BQU0sQ0FBQyxPQUFQLEdBQ007Ozs7Ozs7bUNBQ0osSUFBQSxHQUFNLENBQUMsVUFBRCxFQUFhLElBQWI7Ozs7S0FEMkI7QUFKbkMiLCJzb3VyY2VzQ29udGVudCI6WyJnaXQgPSByZXF1aXJlICcuLi9naXQnXG5CcmFuY2hMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL2JyYW5jaC1saXN0LXZpZXcnXG5cbm1vZHVsZS5leHBvcnRzID1cbmNsYXNzIFJlbW90ZUJyYW5jaExpc3RWaWV3IGV4dGVuZHMgQnJhbmNoTGlzdFZpZXdcbiAgYXJnczogWydjaGVja291dCcsICctdCddXG4iXX0=
