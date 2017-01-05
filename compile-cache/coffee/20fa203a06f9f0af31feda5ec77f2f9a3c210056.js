(function() {
  var $, AnsiToHtml, OutputView, ScrollView, ansiToHtml, defaultMessage, ref,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  AnsiToHtml = require('ansi-to-html');

  ansiToHtml = new AnsiToHtml();

  ref = require('atom-space-pen-views'), $ = ref.$, ScrollView = ref.ScrollView;

  defaultMessage = 'Nothing new to show';

  OutputView = (function(superClass) {
    extend(OutputView, superClass);

    function OutputView() {
      return OutputView.__super__.constructor.apply(this, arguments);
    }

    OutputView.content = function() {
      return this.div({
        "class": 'git-plus info-view'
      }, (function(_this) {
        return function() {
          return _this.pre({
            "class": 'output'
          }, defaultMessage);
        };
      })(this));
    };

    OutputView.prototype.html = defaultMessage;

    OutputView.prototype.initialize = function() {
      return OutputView.__super__.initialize.apply(this, arguments);
    };

    OutputView.prototype.reset = function() {
      return this.html = defaultMessage;
    };

    OutputView.prototype.setContent = function(content) {
      this.html = ansiToHtml.toHtml(content);
      return this;
    };

    OutputView.prototype.finish = function() {
      this.find(".output").html(this.html);
      this.show();
      return this.timeout = setTimeout((function(_this) {
        return function() {
          return _this.hide();
        };
      })(this), atom.config.get('git-plus.general.messageTimeout') * 1000);
    };

    OutputView.prototype.toggle = function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      return $.fn.toggle.call(this);
    };

    return OutputView;

  })(ScrollView);

  module.exports = OutputView;

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9naXQtcGx1cy9saWIvdmlld3Mvb3V0cHV0LXZpZXcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQUEsTUFBQSxzRUFBQTtJQUFBOzs7RUFBQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBQ2IsVUFBQSxHQUFpQixJQUFBLFVBQUEsQ0FBQTs7RUFDakIsTUFBa0IsT0FBQSxDQUFRLHNCQUFSLENBQWxCLEVBQUMsU0FBRCxFQUFJOztFQUVKLGNBQUEsR0FBaUI7O0VBRVg7Ozs7Ozs7SUFDSixVQUFDLENBQUEsT0FBRCxHQUFVLFNBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO1FBQUEsQ0FBQSxLQUFBLENBQUEsRUFBTyxvQkFBUDtPQUFMLEVBQWtDLENBQUEsU0FBQSxLQUFBO2VBQUEsU0FBQTtpQkFDaEMsS0FBQyxDQUFBLEdBQUQsQ0FBSztZQUFBLENBQUEsS0FBQSxDQUFBLEVBQU8sUUFBUDtXQUFMLEVBQXNCLGNBQXRCO1FBRGdDO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQztJQURROzt5QkFJVixJQUFBLEdBQU07O3lCQUVOLFVBQUEsR0FBWSxTQUFBO2FBQUcsNENBQUEsU0FBQTtJQUFIOzt5QkFFWixLQUFBLEdBQU8sU0FBQTthQUFHLElBQUMsQ0FBQSxJQUFELEdBQVE7SUFBWDs7eUJBRVAsVUFBQSxHQUFZLFNBQUMsT0FBRDtNQUNWLElBQUMsQ0FBQSxJQUFELEdBQVEsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsT0FBbEI7YUFDUjtJQUZVOzt5QkFJWixNQUFBLEdBQVEsU0FBQTtNQUNOLElBQUMsQ0FBQSxJQUFELENBQU0sU0FBTixDQUFnQixDQUFDLElBQWpCLENBQXNCLElBQUMsQ0FBQSxJQUF2QjtNQUNBLElBQUMsQ0FBQSxJQUFELENBQUE7YUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLFVBQUEsQ0FBVyxDQUFBLFNBQUEsS0FBQTtlQUFBLFNBQUE7aUJBQ3BCLEtBQUMsQ0FBQSxJQUFELENBQUE7UUFEb0I7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFFVCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUNBQWhCLENBQUEsR0FBcUQsSUFGNUM7SUFITDs7eUJBT1IsTUFBQSxHQUFRLFNBQUE7TUFDTixJQUF5QixJQUFDLENBQUEsT0FBMUI7UUFBQSxZQUFBLENBQWEsSUFBQyxDQUFBLE9BQWQsRUFBQTs7YUFDQSxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFaLENBQWlCLElBQWpCO0lBRk07Ozs7S0F0QmU7O0VBMEJ6QixNQUFNLENBQUMsT0FBUCxHQUFpQjtBQWhDakIiLCJzb3VyY2VzQ29udGVudCI6WyJBbnNpVG9IdG1sID0gcmVxdWlyZSAnYW5zaS10by1odG1sJ1xuYW5zaVRvSHRtbCA9IG5ldyBBbnNpVG9IdG1sKClcbnskLCBTY3JvbGxWaWV3fSA9IHJlcXVpcmUgJ2F0b20tc3BhY2UtcGVuLXZpZXdzJ1xuXG5kZWZhdWx0TWVzc2FnZSA9ICdOb3RoaW5nIG5ldyB0byBzaG93J1xuXG5jbGFzcyBPdXRwdXRWaWV3IGV4dGVuZHMgU2Nyb2xsVmlld1xuICBAY29udGVudDogLT5cbiAgICBAZGl2IGNsYXNzOiAnZ2l0LXBsdXMgaW5mby12aWV3JywgPT5cbiAgICAgIEBwcmUgY2xhc3M6ICdvdXRwdXQnLCBkZWZhdWx0TWVzc2FnZVxuXG4gIGh0bWw6IGRlZmF1bHRNZXNzYWdlXG5cbiAgaW5pdGlhbGl6ZTogLT4gc3VwZXJcblxuICByZXNldDogLT4gQGh0bWwgPSBkZWZhdWx0TWVzc2FnZVxuXG4gIHNldENvbnRlbnQ6IChjb250ZW50KSAtPlxuICAgIEBodG1sID0gYW5zaVRvSHRtbC50b0h0bWwgY29udGVudFxuICAgIHRoaXNcblxuICBmaW5pc2g6IC0+XG4gICAgQGZpbmQoXCIub3V0cHV0XCIpLmh0bWwoQGh0bWwpXG4gICAgQHNob3coKVxuICAgIEB0aW1lb3V0ID0gc2V0VGltZW91dCA9PlxuICAgICAgQGhpZGUoKVxuICAgICwgYXRvbS5jb25maWcuZ2V0KCdnaXQtcGx1cy5nZW5lcmFsLm1lc3NhZ2VUaW1lb3V0JykgKiAxMDAwXG5cbiAgdG9nZ2xlOiAtPlxuICAgIGNsZWFyVGltZW91dCBAdGltZW91dCBpZiBAdGltZW91dFxuICAgICQuZm4udG9nZ2xlLmNhbGwodGhpcylcblxubW9kdWxlLmV4cG9ydHMgPSBPdXRwdXRWaWV3XG4iXX0=
