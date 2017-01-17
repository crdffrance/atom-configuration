(function() {
  module.exports = {
    query: function(el) {
      return document.querySelector(el);
    },
    queryAll: function(el) {
      return document.querySelectorAll(el);
    },
    addClass: function(el, className) {
      return this.toggleClass('add', el, className);
    },
    removeClass: function(el, className) {
      return this.toggleClass('remove', el, className);
    },
    toggleClass: function(action, el, className) {
      var i, results;
      if (el !== null) {
        i = 0;
        results = [];
        while (i < el.length) {
          el[i].classList[action](className);
          results.push(i++);
        }
        return results;
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9zZXRpLXVpL2xpYi9kb20uY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtJQUFBLEtBQUEsRUFBTyxTQUFDLEVBQUQ7YUFDTCxRQUFRLENBQUMsYUFBVCxDQUF1QixFQUF2QjtJQURLLENBQVA7SUFHQSxRQUFBLEVBQVUsU0FBQyxFQUFEO2FBQ1IsUUFBUSxDQUFDLGdCQUFULENBQTBCLEVBQTFCO0lBRFEsQ0FIVjtJQU1BLFFBQUEsRUFBVSxTQUFDLEVBQUQsRUFBSyxTQUFMO2FBQ1IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxLQUFiLEVBQW9CLEVBQXBCLEVBQXdCLFNBQXhCO0lBRFEsQ0FOVjtJQVNBLFdBQUEsRUFBYSxTQUFDLEVBQUQsRUFBSyxTQUFMO2FBQ1gsSUFBQyxDQUFBLFdBQUQsQ0FBYSxRQUFiLEVBQXVCLEVBQXZCLEVBQTJCLFNBQTNCO0lBRFcsQ0FUYjtJQVlBLFdBQUEsRUFBYSxTQUFDLE1BQUQsRUFBUyxFQUFULEVBQWEsU0FBYjtBQUNYLFVBQUE7TUFBQSxJQUFHLEVBQUEsS0FBTSxJQUFUO1FBQ0UsQ0FBQSxHQUFJO0FBQ0o7ZUFBTSxDQUFBLEdBQUksRUFBRSxDQUFDLE1BQWI7VUFDRSxFQUFHLENBQUEsQ0FBQSxDQUFFLENBQUMsU0FBVSxDQUFBLE1BQUEsQ0FBaEIsQ0FBd0IsU0FBeEI7dUJBQ0EsQ0FBQTtRQUZGLENBQUE7dUJBRkY7O0lBRFcsQ0FaYjs7QUFERiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID1cbiAgcXVlcnk6IChlbCkgLT5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yIGVsXG5cbiAgcXVlcnlBbGw6IChlbCkgLT5cbiAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsIGVsXG5cbiAgYWRkQ2xhc3M6IChlbCwgY2xhc3NOYW1lKSAtPlxuICAgIEB0b2dnbGVDbGFzcyAnYWRkJywgZWwsIGNsYXNzTmFtZVxuXG4gIHJlbW92ZUNsYXNzOiAoZWwsIGNsYXNzTmFtZSkgLT5cbiAgICBAdG9nZ2xlQ2xhc3MgJ3JlbW92ZScsIGVsLCBjbGFzc05hbWVcblxuICB0b2dnbGVDbGFzczogKGFjdGlvbiwgZWwsIGNsYXNzTmFtZSkgLT5cbiAgICBpZiBlbCAhPSBudWxsXG4gICAgICBpID0gMFxuICAgICAgd2hpbGUgaSA8IGVsLmxlbmd0aFxuICAgICAgICBlbFtpXS5jbGFzc0xpc3RbYWN0aW9uXSBjbGFzc05hbWVcbiAgICAgICAgaSsrXG4iXX0=
