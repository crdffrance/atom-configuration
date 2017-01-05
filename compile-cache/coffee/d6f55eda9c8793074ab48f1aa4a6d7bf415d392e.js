(function() {
  module.exports = {
    name: "Markdown",
    namespace: "markdown",

    /*
    Supported Grammars
     */
    grammars: ["GitHub Markdown"],

    /*
    Supported extensions
     */
    extensions: ["markdown", "md"],
    defaultBeautifier: "Tidy Markdown",
    options: {
      gfm: {
        type: 'boolean',
        "default": true,
        description: 'GitHub Flavoured Markdown'
      },
      yaml: {
        type: 'boolean',
        "default": true,
        description: 'Enables raw YAML front matter to be detected (thus ignoring markdown-like syntax).'
      },
      commonmark: {
        type: 'boolean',
        "default": false,
        description: 'Allows and disallows several constructs.'
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9sYW5ndWFnZXMvbWFya2Rvd24uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFFZixJQUFBLEVBQU0sVUFGUztJQUdmLFNBQUEsRUFBVyxVQUhJOztBQUtmOzs7SUFHQSxRQUFBLEVBQVUsQ0FDUixpQkFEUSxDQVJLOztBQVlmOzs7SUFHQSxVQUFBLEVBQVksQ0FDVixVQURVLEVBRVYsSUFGVSxDQWZHO0lBb0JmLGlCQUFBLEVBQW1CLGVBcEJKO0lBc0JmLE9BQUEsRUFDRTtNQUFBLEdBQUEsRUFDRTtRQUFBLElBQUEsRUFBTSxTQUFOO1FBQ0EsQ0FBQSxPQUFBLENBQUEsRUFBUyxJQURUO1FBRUEsV0FBQSxFQUFhLDJCQUZiO09BREY7TUFJQSxJQUFBLEVBQ0U7UUFBQSxJQUFBLEVBQU0sU0FBTjtRQUNBLENBQUEsT0FBQSxDQUFBLEVBQVMsSUFEVDtRQUVBLFdBQUEsRUFBYSxvRkFGYjtPQUxGO01BUUEsVUFBQSxFQUNFO1FBQUEsSUFBQSxFQUFNLFNBQU47UUFDQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLEtBRFQ7UUFFQSxXQUFBLEVBQWEsMENBRmI7T0FURjtLQXZCYTs7QUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IHtcblxuICBuYW1lOiBcIk1hcmtkb3duXCJcbiAgbmFtZXNwYWNlOiBcIm1hcmtkb3duXCJcblxuICAjIyNcbiAgU3VwcG9ydGVkIEdyYW1tYXJzXG4gICMjI1xuICBncmFtbWFyczogW1xuICAgIFwiR2l0SHViIE1hcmtkb3duXCJcbiAgXVxuXG4gICMjI1xuICBTdXBwb3J0ZWQgZXh0ZW5zaW9uc1xuICAjIyNcbiAgZXh0ZW5zaW9uczogW1xuICAgIFwibWFya2Rvd25cIlxuICAgIFwibWRcIlxuICBdXG5cbiAgZGVmYXVsdEJlYXV0aWZpZXI6IFwiVGlkeSBNYXJrZG93blwiXG5cbiAgb3B0aW9uczpcbiAgICBnZm06XG4gICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIGRlZmF1bHQ6IHRydWVcbiAgICAgIGRlc2NyaXB0aW9uOiAnR2l0SHViIEZsYXZvdXJlZCBNYXJrZG93bidcbiAgICB5YW1sOlxuICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICBkZWZhdWx0OiB0cnVlXG4gICAgICBkZXNjcmlwdGlvbjogJ0VuYWJsZXMgcmF3IFlBTUwgZnJvbnQgbWF0dGVyIHRvIGJlIGRldGVjdGVkICh0aHVzIGlnbm9yaW5nIG1hcmtkb3duLWxpa2Ugc3ludGF4KS4nXG4gICAgY29tbW9ubWFyazpcbiAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgZGVmYXVsdDogZmFsc2VcbiAgICAgIGRlc2NyaXB0aW9uOiAnQWxsb3dzIGFuZCBkaXNhbGxvd3Mgc2V2ZXJhbCBjb25zdHJ1Y3RzLidcbn1cbiJdfQ==
