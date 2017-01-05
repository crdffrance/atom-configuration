(function() {
  atom.packages.activatePackage('tree-view').then(function(tree) {
    var IS_ANCHORED_CLASSNAME, projectRoots, treeView, updateTreeViewHeaderPosition;
    IS_ANCHORED_CLASSNAME = 'is--anchored';
    treeView = tree.mainModule.treeView;
    projectRoots = treeView.roots;
    updateTreeViewHeaderPosition = function() {
      var i, len, project, projectClassList, projectHeaderHeight, projectHeight, projectOffsetY, results, yScrollPosition;
      yScrollPosition = treeView.scroller[0].scrollTop;
      results = [];
      for (i = 0, len = projectRoots.length; i < len; i++) {
        project = projectRoots[i];
        projectHeaderHeight = project.header.offsetHeight;
        projectClassList = project.classList;
        projectOffsetY = project.offsetTop;
        projectHeight = project.offsetHeight;
        if (yScrollPosition > projectOffsetY) {
          if (yScrollPosition > projectOffsetY + projectHeight - projectHeaderHeight) {
            project.header.style.top = 'auto';
            results.push(projectClassList.add(IS_ANCHORED_CLASSNAME));
          } else {
            project.header.style.top = (yScrollPosition - projectOffsetY) + 'px';
            results.push(projectClassList.remove(IS_ANCHORED_CLASSNAME));
          }
        } else {
          project.header.style.top = '0';
          results.push(projectClassList.remove(IS_ANCHORED_CLASSNAME));
        }
      }
      return results;
    };
    atom.project.onDidChangePaths(function() {
      projectRoots = treeView.roots;
      return updateTreeViewHeaderPosition();
    });
    atom.config.onDidChange('seti-ui', function() {
      return setTimeout(function() {
        return updateTreeViewHeaderPosition();
      });
    });
    treeView.scroller.on('scroll', updateTreeViewHeaderPosition);
    return setTimeout(function() {
      return updateTreeViewHeaderPosition();
    });
  });

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9zZXRpLXVpL2xpYi9oZWFkZXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZCxDQUE4QixXQUE5QixDQUEwQyxDQUFDLElBQTNDLENBQWdELFNBQUMsSUFBRDtBQUM5QyxRQUFBO0lBQUEscUJBQUEsR0FBd0I7SUFFeEIsUUFBQSxHQUFXLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDM0IsWUFBQSxHQUFlLFFBQVEsQ0FBQztJQUV4Qiw0QkFBQSxHQUErQixTQUFBO0FBQzdCLFVBQUE7TUFBQSxlQUFBLEdBQWtCLFFBQVEsQ0FBQyxRQUFTLENBQUEsQ0FBQSxDQUFFLENBQUM7QUFFdkM7V0FBQSw4Q0FBQTs7UUFDRSxtQkFBQSxHQUFzQixPQUFPLENBQUMsTUFBTSxDQUFDO1FBQ3JDLGdCQUFBLEdBQW1CLE9BQU8sQ0FBQztRQUMzQixjQUFBLEdBQWlCLE9BQU8sQ0FBQztRQUN6QixhQUFBLEdBQWdCLE9BQU8sQ0FBQztRQUV4QixJQUFHLGVBQUEsR0FBa0IsY0FBckI7VUFDRSxJQUFHLGVBQUEsR0FBa0IsY0FBQSxHQUFpQixhQUFqQixHQUFpQyxtQkFBdEQ7WUFDRSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFyQixHQUEyQjt5QkFDM0IsZ0JBQWdCLENBQUMsR0FBakIsQ0FBcUIscUJBQXJCLEdBRkY7V0FBQSxNQUFBO1lBSUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBckIsR0FBMkIsQ0FBQyxlQUFBLEdBQWtCLGNBQW5CLENBQUEsR0FBcUM7eUJBQ2hFLGdCQUFnQixDQUFDLE1BQWpCLENBQXdCLHFCQUF4QixHQUxGO1dBREY7U0FBQSxNQUFBO1VBUUUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBckIsR0FBMkI7dUJBQzNCLGdCQUFnQixDQUFDLE1BQWpCLENBQXdCLHFCQUF4QixHQVRGOztBQU5GOztJQUg2QjtJQW9CL0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxnQkFBYixDQUE4QixTQUFBO01BQzVCLFlBQUEsR0FBZSxRQUFRLENBQUM7YUFDeEIsNEJBQUEsQ0FBQTtJQUY0QixDQUE5QjtJQUlBLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBWixDQUF3QixTQUF4QixFQUFtQyxTQUFBO2FBR2pDLFVBQUEsQ0FBVyxTQUFBO2VBQUcsNEJBQUEsQ0FBQTtNQUFILENBQVg7SUFIaUMsQ0FBbkM7SUFJQSxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQWxCLENBQXFCLFFBQXJCLEVBQStCLDRCQUEvQjtXQUVBLFVBQUEsQ0FBVyxTQUFBO2FBQ1QsNEJBQUEsQ0FBQTtJQURTLENBQVg7RUFwQzhDLENBQWhEO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJhdG9tLnBhY2thZ2VzLmFjdGl2YXRlUGFja2FnZSgndHJlZS12aWV3JykudGhlbiAodHJlZSkgLT5cbiAgSVNfQU5DSE9SRURfQ0xBU1NOQU1FID0gJ2lzLS1hbmNob3JlZCdcblxuICB0cmVlVmlldyA9IHRyZWUubWFpbk1vZHVsZS50cmVlVmlld1xuICBwcm9qZWN0Um9vdHMgPSB0cmVlVmlldy5yb290c1xuXG4gIHVwZGF0ZVRyZWVWaWV3SGVhZGVyUG9zaXRpb24gPSAtPlxuICAgIHlTY3JvbGxQb3NpdGlvbiA9IHRyZWVWaWV3LnNjcm9sbGVyWzBdLnNjcm9sbFRvcFxuXG4gICAgZm9yIHByb2plY3QgaW4gcHJvamVjdFJvb3RzXG4gICAgICBwcm9qZWN0SGVhZGVySGVpZ2h0ID0gcHJvamVjdC5oZWFkZXIub2Zmc2V0SGVpZ2h0XG4gICAgICBwcm9qZWN0Q2xhc3NMaXN0ID0gcHJvamVjdC5jbGFzc0xpc3RcbiAgICAgIHByb2plY3RPZmZzZXRZID0gcHJvamVjdC5vZmZzZXRUb3BcbiAgICAgIHByb2plY3RIZWlnaHQgPSBwcm9qZWN0Lm9mZnNldEhlaWdodFxuXG4gICAgICBpZiB5U2Nyb2xsUG9zaXRpb24gPiBwcm9qZWN0T2Zmc2V0WVxuICAgICAgICBpZiB5U2Nyb2xsUG9zaXRpb24gPiBwcm9qZWN0T2Zmc2V0WSArIHByb2plY3RIZWlnaHQgLSBwcm9qZWN0SGVhZGVySGVpZ2h0XG4gICAgICAgICAgcHJvamVjdC5oZWFkZXIuc3R5bGUudG9wID0gJ2F1dG8nXG4gICAgICAgICAgcHJvamVjdENsYXNzTGlzdC5hZGQgSVNfQU5DSE9SRURfQ0xBU1NOQU1FXG4gICAgICAgIGVsc2VcbiAgICAgICAgICBwcm9qZWN0LmhlYWRlci5zdHlsZS50b3AgPSAoeVNjcm9sbFBvc2l0aW9uIC0gcHJvamVjdE9mZnNldFkpICsgJ3B4J1xuICAgICAgICAgIHByb2plY3RDbGFzc0xpc3QucmVtb3ZlIElTX0FOQ0hPUkVEX0NMQVNTTkFNRVxuICAgICAgZWxzZVxuICAgICAgICBwcm9qZWN0LmhlYWRlci5zdHlsZS50b3AgPSAnMCdcbiAgICAgICAgcHJvamVjdENsYXNzTGlzdC5yZW1vdmUgSVNfQU5DSE9SRURfQ0xBU1NOQU1FXG5cbiAgYXRvbS5wcm9qZWN0Lm9uRGlkQ2hhbmdlUGF0aHMgLT5cbiAgICBwcm9qZWN0Um9vdHMgPSB0cmVlVmlldy5yb290c1xuICAgIHVwZGF0ZVRyZWVWaWV3SGVhZGVyUG9zaXRpb24oKVxuXG4gIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlICdzZXRpLXVpJywgLT5cbiAgICAjIFRPRE8gc29tZXRoaW5nIG90aGVyIHRoYW4gc2V0VGltZW91dD8gaXQncyBhIGhhY2sgdG8gdHJpZ2dlciB0aGUgdXBkYXRlXG4gICAgIyBhZnRlciB0aGUgQ1NTIGNoYW5nZXMgaGF2ZSBvY2N1cnJlZC4gYSBnYW1ibGUsIHByb2JhYmx5IGluYWNjdXJhdGVcbiAgICBzZXRUaW1lb3V0IC0+IHVwZGF0ZVRyZWVWaWV3SGVhZGVyUG9zaXRpb24oKVxuICB0cmVlVmlldy5zY3JvbGxlci5vbiAnc2Nyb2xsJywgdXBkYXRlVHJlZVZpZXdIZWFkZXJQb3NpdGlvblxuXG4gIHNldFRpbWVvdXQgLT4gIyBUT0RPIHNvbWV0aGluZyBvdGhlciB0aGFuIHNldFRpbWVvdXQ/XG4gICAgdXBkYXRlVHJlZVZpZXdIZWFkZXJQb3NpdGlvbigpXG4iXX0=
