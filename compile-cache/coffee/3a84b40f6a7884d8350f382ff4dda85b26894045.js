(function() {
  var MergeListView, git;

  git = require('../git');

  MergeListView = require('../views/merge-list-view');

  module.exports = function(repo, arg) {
    var args, extraArgs, noFastForward, ref, remote;
    ref = arg != null ? arg : {}, remote = ref.remote, noFastForward = ref.noFastForward;
    extraArgs = noFastForward ? ['--no-ff'] : [];
    args = ['branch'];
    if (remote) {
      args.push('-r');
    }
    return git.cmd(args, {
      cwd: repo.getWorkingDirectory()
    }).then(function(data) {
      return new MergeListView(repo, data, extraArgs);
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvbW9kZWxzL2dpdC1tZXJnZS5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFBQSxNQUFBOztFQUFBLEdBQUEsR0FBTSxPQUFBLENBQVEsUUFBUjs7RUFDTixhQUFBLEdBQWdCLE9BQUEsQ0FBUSwwQkFBUjs7RUFFaEIsTUFBTSxDQUFDLE9BQVAsR0FBaUIsU0FBQyxJQUFELEVBQU8sR0FBUDtBQUNmLFFBQUE7d0JBRHNCLE1BQXdCLElBQXZCLHFCQUFRO0lBQy9CLFNBQUEsR0FBZSxhQUFILEdBQXNCLENBQUMsU0FBRCxDQUF0QixHQUF1QztJQUNuRCxJQUFBLEdBQU8sQ0FBQyxRQUFEO0lBQ1AsSUFBa0IsTUFBbEI7TUFBQSxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsRUFBQTs7V0FDQSxHQUFHLENBQUMsR0FBSixDQUFRLElBQVIsRUFBYztNQUFBLEdBQUEsRUFBSyxJQUFJLENBQUMsbUJBQUwsQ0FBQSxDQUFMO0tBQWQsQ0FDQSxDQUFDLElBREQsQ0FDTSxTQUFDLElBQUQ7YUFBYyxJQUFBLGFBQUEsQ0FBYyxJQUFkLEVBQW9CLElBQXBCLEVBQTBCLFNBQTFCO0lBQWQsQ0FETjtFQUplO0FBSGpCIiwic291cmNlc0NvbnRlbnQiOlsiZ2l0ID0gcmVxdWlyZSAnLi4vZ2l0J1xuTWVyZ2VMaXN0VmlldyA9IHJlcXVpcmUgJy4uL3ZpZXdzL21lcmdlLWxpc3QtdmlldydcblxubW9kdWxlLmV4cG9ydHMgPSAocmVwbywge3JlbW90ZSwgbm9GYXN0Rm9yd2FyZH09e30pIC0+XG4gIGV4dHJhQXJncyA9IGlmIG5vRmFzdEZvcndhcmQgdGhlbiBbJy0tbm8tZmYnXSBlbHNlIFtdXG4gIGFyZ3MgPSBbJ2JyYW5jaCddXG4gIGFyZ3MucHVzaCAnLXInIGlmIHJlbW90ZVxuICBnaXQuY21kKGFyZ3MsIGN3ZDogcmVwby5nZXRXb3JraW5nRGlyZWN0b3J5KCkpXG4gIC50aGVuIChkYXRhKSAtPiBuZXcgTWVyZ2VMaXN0VmlldyhyZXBvLCBkYXRhLCBleHRyYUFyZ3MpXG4iXX0=
