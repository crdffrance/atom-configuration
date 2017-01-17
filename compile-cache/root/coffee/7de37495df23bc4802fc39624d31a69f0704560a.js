(function() {
  module.exports = {
    get: function() {
      var sublimeTabs, treeView;
      if (atom.packages.isPackageLoaded('tree-view')) {
        treeView = atom.packages.getLoadedPackage('tree-view');
        treeView = require(treeView.mainModulePath);
        return treeView.serialize();
      } else if (atom.packages.isPackageLoaded('sublime-tabs')) {
        sublimeTabs = atom.packages.getLoadedPackage('sublime-tabs');
        sublimeTabs = require(sublimeTabs.mainModulePath);
        return sublimeTabs.serialize();
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvY29udGV4dC1wYWNrYWdlLWZpbmRlci5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsR0FBQSxFQUFLLFNBQUE7QUFDSCxVQUFBO01BQUEsSUFBRyxJQUFJLENBQUMsUUFBUSxDQUFDLGVBQWQsQ0FBOEIsV0FBOUIsQ0FBSDtRQUNFLFFBQUEsR0FBVyxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFdBQS9CO1FBQ1gsUUFBQSxHQUFXLE9BQUEsQ0FBUSxRQUFRLENBQUMsY0FBakI7ZUFDWCxRQUFRLENBQUMsU0FBVCxDQUFBLEVBSEY7T0FBQSxNQUlLLElBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFkLENBQThCLGNBQTlCLENBQUg7UUFDSCxXQUFBLEdBQWMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixjQUEvQjtRQUNkLFdBQUEsR0FBYyxPQUFBLENBQVEsV0FBVyxDQUFDLGNBQXBCO2VBQ2QsV0FBVyxDQUFDLFNBQVosQ0FBQSxFQUhHOztJQUxGLENBQUw7O0FBREYiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9XG4gIGdldDogLT5cbiAgICBpZiBhdG9tLnBhY2thZ2VzLmlzUGFja2FnZUxvYWRlZCgndHJlZS12aWV3JylcbiAgICAgIHRyZWVWaWV3ID0gYXRvbS5wYWNrYWdlcy5nZXRMb2FkZWRQYWNrYWdlKCd0cmVlLXZpZXcnKVxuICAgICAgdHJlZVZpZXcgPSByZXF1aXJlKHRyZWVWaWV3Lm1haW5Nb2R1bGVQYXRoKVxuICAgICAgdHJlZVZpZXcuc2VyaWFsaXplKClcbiAgICBlbHNlIGlmIGF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKCdzdWJsaW1lLXRhYnMnKVxuICAgICAgc3VibGltZVRhYnMgPSBhdG9tLnBhY2thZ2VzLmdldExvYWRlZFBhY2thZ2UoJ3N1YmxpbWUtdGFicycpXG4gICAgICBzdWJsaW1lVGFicyA9IHJlcXVpcmUoc3VibGltZVRhYnMubWFpbk1vZHVsZVBhdGgpXG4gICAgICBzdWJsaW1lVGFicy5zZXJpYWxpemUoKVxuIl19
