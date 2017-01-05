(function() {
  module.exports = {
    name: "GLSL",
    namespace: "glsl",

    /*
    Supported Grammars
     */
    grammars: ["C", "opencl", "GLSL"],

    /*
    Supported extensions
     */
    extensions: ["vert", "frag"],
    options: {
      configPath: {
        type: 'string',
        "default": "",
        description: "Path to clang-format config file. i.e. clang-format.cfg"
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvZ2xzbC5jb2ZmZWUiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUFpQjtJQUVmLElBQUEsRUFBTSxNQUZTO0lBR2YsU0FBQSxFQUFXLE1BSEk7O0FBS2Y7OztJQUdBLFFBQUEsRUFBVSxDQUNSLEdBRFEsRUFFUixRQUZRLEVBR1IsTUFIUSxDQVJLOztBQWNmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixNQURVLEVBRVYsTUFGVSxDQWpCRztJQXNCZixPQUFBLEVBQ0U7TUFBQSxVQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sUUFBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsRUFEVDtRQUVBLFdBQUEsRUFBYSx5REFGYjtPQURGO0tBdkJhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuXG4gIG5hbWU6IFwiR0xTTFwiXG4gIG5hbWVzcGFjZTogXCJnbHNsXCJcblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiQ1wiXG4gICAgXCJvcGVuY2xcIlxuICAgIFwiR0xTTFwiXG4gIF1cblxuICAjIyNcbiAgU3VwcG9ydGVkIGV4dGVuc2lvbnNcbiAgIyMjXG4gIGV4dGVuc2lvbnM6IFtcbiAgICBcInZlcnRcIlxuICAgIFwiZnJhZ1wiXG4gIF1cblxuICBvcHRpb25zOlxuICAgIGNvbmZpZ1BhdGg6XG4gICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgZGVmYXVsdDogXCJcIlxuICAgICAgZGVzY3JpcHRpb246IFwiUGF0aCB0byBjbGFuZy1mb3JtYXQgY29uZmlnIGZpbGUuIGkuZS4gY2xhbmctZm9ybWF0LmNmZ1wiXG5cbn1cbiJdfQ==
