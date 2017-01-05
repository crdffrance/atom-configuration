(function() {
  var slice = [].slice;

  module.exports = {
    prefix: 'autocomplete-python:',
    debug: function() {
      var msg;
      msg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (atom.config.get('autocomplete-python.outputDebug')) {
        return console.debug.apply(console, [this.prefix].concat(slice.call(msg)));
      }
    },
    warning: function() {
      var msg;
      msg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return console.warn.apply(console, [this.prefix].concat(slice.call(msg)));
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdXRvY29tcGxldGUtcHl0aG9uL2xpYi9sb2cuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQTs7RUFBQSxNQUFNLENBQUMsT0FBUCxHQUNFO0lBQUEsTUFBQSxFQUFRLHNCQUFSO0lBQ0EsS0FBQSxFQUFPLFNBQUE7QUFDTCxVQUFBO01BRE07TUFDTixJQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQ0FBaEIsQ0FBSDtBQUNFLGVBQU8sT0FBTyxDQUFDLEtBQVIsZ0JBQWMsQ0FBQSxJQUFDLENBQUEsTUFBUSxTQUFBLFdBQUEsR0FBQSxDQUFBLENBQXZCLEVBRFQ7O0lBREssQ0FEUDtJQUtBLE9BQUEsRUFBUyxTQUFBO0FBQ1AsVUFBQTtNQURRO0FBQ1IsYUFBTyxPQUFPLENBQUMsSUFBUixnQkFBYSxDQUFBLElBQUMsQ0FBQSxNQUFRLFNBQUEsV0FBQSxHQUFBLENBQUEsQ0FBdEI7SUFEQSxDQUxUOztBQURGIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlLmV4cG9ydHMgPVxuICBwcmVmaXg6ICdhdXRvY29tcGxldGUtcHl0aG9uOidcbiAgZGVidWc6IChtc2cuLi4pIC0+XG4gICAgaWYgYXRvbS5jb25maWcuZ2V0KCdhdXRvY29tcGxldGUtcHl0aG9uLm91dHB1dERlYnVnJylcbiAgICAgIHJldHVybiBjb25zb2xlLmRlYnVnIEBwcmVmaXgsIG1zZy4uLlxuXG4gIHdhcm5pbmc6IChtc2cuLi4pIC0+XG4gICAgcmV0dXJuIGNvbnNvbGUud2FybiBAcHJlZml4LCBtc2cuLi5cbiJdfQ==
