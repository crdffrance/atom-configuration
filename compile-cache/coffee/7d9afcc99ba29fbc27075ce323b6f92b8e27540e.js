(function() {
  module.exports = {
    config: {
      accentColor: {
        description: 'Set a color that will influence accents in the theme',
        type: 'color',
        "default": '#d2372b'
      },
      hexColor: {
        description: 'Set an accent color by hex value (cannot be shorthand, use #rrggbb)',
        type: 'string',
        "default": '#d2372b'
      },
      fontSize: {
        description: 'Set the global font size for this theme. A bit finicky at the moment, can sometimes take a few reloads to see changes.',
        type: 'integer',
        "default": 12,
        minimum: 8,
        maximum: 24
      },
      useSyntax: {
        description: 'Override the gutter, background, and selection colours',
        type: 'boolean',
        "default": 'true'
      },
      debugMode: {
        description: 'Log certain details to the console',
        type: 'boolean',
        "default": 'false'
      }
    },
    activate: function(state) {
      return atom.themes.onDidChangeActiveThemes(function() {
        var Config;
        Config = require('./config');
        return Config.apply();
      });
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hY2NlbnRzLXVpL2xpYi9hY2NlbnRzLXVpLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBLE1BQU0sQ0FBQyxPQUFQLEdBRUU7SUFBQSxNQUFBLEVBQ0U7TUFBQSxXQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWEsc0RBQWI7UUFDQSxJQUFBLEVBQU0sT0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsU0FGVDtPQURKO01BSUEsUUFBQSxFQUNJO1FBQUEsV0FBQSxFQUFhLHFFQUFiO1FBQ0EsSUFBQSxFQUFNLFFBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLFNBRlQ7T0FMSjtNQVFBLFFBQUEsRUFDSTtRQUFBLFdBQUEsRUFBYSx3SEFBYjtRQUNBLElBQUEsRUFBTSxTQUROO1FBRUEsQ0FBQSxPQUFBLENBQUEsRUFBUyxFQUZUO1FBR0EsT0FBQSxFQUFTLENBSFQ7UUFJQSxPQUFBLEVBQVMsRUFKVDtPQVRKO01BY0EsU0FBQSxFQUNJO1FBQUEsV0FBQSxFQUFhLHdEQUFiO1FBQ0EsSUFBQSxFQUFNLFNBRE47UUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFTLE1BRlQ7T0FmSjtNQWtCQSxTQUFBLEVBQ0k7UUFBQSxXQUFBLEVBQWEsb0NBQWI7UUFDQSxJQUFBLEVBQU0sU0FETjtRQUVBLENBQUEsT0FBQSxDQUFBLEVBQVMsT0FGVDtPQW5CSjtLQURGO0lBd0JBLFFBQUEsRUFBVSxTQUFDLEtBQUQ7YUFDUixJQUFJLENBQUMsTUFBTSxDQUFDLHVCQUFaLENBQW9DLFNBQUE7QUFDbEMsWUFBQTtRQUFBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUjtlQUNULE1BQU0sQ0FBQyxLQUFQLENBQUE7TUFGa0MsQ0FBcEM7SUFEUSxDQXhCVjs7QUFGRiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cblxuICBjb25maWc6XG4gICAgYWNjZW50Q29sb3I6XG4gICAgICAgIGRlc2NyaXB0aW9uOiAnU2V0IGEgY29sb3IgdGhhdCB3aWxsIGluZmx1ZW5jZSBhY2NlbnRzIGluIHRoZSB0aGVtZSdcbiAgICAgICAgdHlwZTogJ2NvbG9yJ1xuICAgICAgICBkZWZhdWx0OiAnI2QyMzcyYidcbiAgICBoZXhDb2xvcjpcbiAgICAgICAgZGVzY3JpcHRpb246ICdTZXQgYW4gYWNjZW50IGNvbG9yIGJ5IGhleCB2YWx1ZSAoY2Fubm90IGJlIHNob3J0aGFuZCwgdXNlICNycmdnYmIpJ1xuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0OiAnI2QyMzcyYidcbiAgICBmb250U2l6ZTpcbiAgICAgICAgZGVzY3JpcHRpb246ICdTZXQgdGhlIGdsb2JhbCBmb250IHNpemUgZm9yIHRoaXMgdGhlbWUuIEEgYml0IGZpbmlja3kgYXQgdGhlIG1vbWVudCwgY2FuIHNvbWV0aW1lcyB0YWtlIGEgZmV3IHJlbG9hZHMgdG8gc2VlIGNoYW5nZXMuJ1xuICAgICAgICB0eXBlOiAnaW50ZWdlcidcbiAgICAgICAgZGVmYXVsdDogMTJcbiAgICAgICAgbWluaW11bTogOFxuICAgICAgICBtYXhpbXVtOiAyNFxuICAgIHVzZVN5bnRheDpcbiAgICAgICAgZGVzY3JpcHRpb246ICdPdmVycmlkZSB0aGUgZ3V0dGVyLCBiYWNrZ3JvdW5kLCBhbmQgc2VsZWN0aW9uIGNvbG91cnMnXG4gICAgICAgIHR5cGU6ICdib29sZWFuJ1xuICAgICAgICBkZWZhdWx0OiAndHJ1ZSdcbiAgICBkZWJ1Z01vZGU6XG4gICAgICAgIGRlc2NyaXB0aW9uOiAnTG9nIGNlcnRhaW4gZGV0YWlscyB0byB0aGUgY29uc29sZSdcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQ6ICdmYWxzZSdcblxuICBhY3RpdmF0ZTogKHN0YXRlKSAtPlxuICAgIGF0b20udGhlbWVzLm9uRGlkQ2hhbmdlQWN0aXZlVGhlbWVzIC0+XG4gICAgICBDb25maWcgPSByZXF1aXJlICcuL2NvbmZpZydcbiAgICAgIENvbmZpZy5hcHBseSgpXG4iXX0=
