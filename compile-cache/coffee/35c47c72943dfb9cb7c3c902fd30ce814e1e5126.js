(function() {
  "use strict";
  var Beautifier, Remark,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = Remark = (function(superClass) {
    extend(Remark, superClass);

    function Remark() {
      return Remark.__super__.constructor.apply(this, arguments);
    }

    Remark.prototype.name = "Remark";

    Remark.prototype.link = "https://github.com/wooorm/remark";

    Remark.prototype.options = {
      _: {
        gfm: true,
        yaml: true,
        commonmark: true,
        footnotes: true,
        pedantic: true,
        breaks: true,
        entities: true,
        setext: true,
        closeAtx: true,
        looseTable: true,
        spacedTable: true,
        fence: true,
        fences: true,
        bullet: true,
        listItemIndent: true,
        incrementListMarker: true,
        rule: true,
        ruleRepetition: true,
        ruleSpaces: true,
        strong: true,
        emphasis: true,
        position: true
      },
      Markdown: true
    };

    Remark.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var cleanMarkdown, err, remark;
        try {
          remark = require('remark');
          cleanMarkdown = remark().process(text, options).toString();
          return resolve(cleanMarkdown);
        } catch (error) {
          err = error;
          this.error("Remark error: " + err);
          return reject(err);
        }
      });
    };

    return Remark;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9yZW1hcmsuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUE7QUFBQSxNQUFBLGtCQUFBO0lBQUE7OztFQUNBLFVBQUEsR0FBYSxPQUFBLENBQVEsY0FBUjs7RUFFYixNQUFNLENBQUMsT0FBUCxHQUF1Qjs7Ozs7OztxQkFDckIsSUFBQSxHQUFNOztxQkFDTixJQUFBLEdBQU07O3FCQUNOLE9BQUEsR0FBUztNQUNQLENBQUEsRUFBRztRQUNELEdBQUEsRUFBSyxJQURKO1FBRUQsSUFBQSxFQUFNLElBRkw7UUFHRCxVQUFBLEVBQVksSUFIWDtRQUlELFNBQUEsRUFBVyxJQUpWO1FBS0QsUUFBQSxFQUFVLElBTFQ7UUFNRCxNQUFBLEVBQVEsSUFOUDtRQU9ELFFBQUEsRUFBVSxJQVBUO1FBUUQsTUFBQSxFQUFRLElBUlA7UUFTRCxRQUFBLEVBQVUsSUFUVDtRQVVELFVBQUEsRUFBWSxJQVZYO1FBV0QsV0FBQSxFQUFhLElBWFo7UUFZRCxLQUFBLEVBQU8sSUFaTjtRQWFELE1BQUEsRUFBUSxJQWJQO1FBY0QsTUFBQSxFQUFRLElBZFA7UUFlRCxjQUFBLEVBQWdCLElBZmY7UUFnQkQsbUJBQUEsRUFBcUIsSUFoQnBCO1FBaUJELElBQUEsRUFBTSxJQWpCTDtRQWtCRCxjQUFBLEVBQWdCLElBbEJmO1FBbUJELFVBQUEsRUFBWSxJQW5CWDtRQW9CRCxNQUFBLEVBQVEsSUFwQlA7UUFxQkQsUUFBQSxFQUFVLElBckJUO1FBc0JELFFBQUEsRUFBVSxJQXRCVDtPQURJO01BeUJQLFFBQUEsRUFBVSxJQXpCSDs7O3FCQTRCVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFDbEIsWUFBQTtBQUFBO1VBQ0UsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSO1VBQ1QsYUFBQSxHQUFnQixNQUFBLENBQUEsQ0FBUSxDQUFDLE9BQVQsQ0FBaUIsSUFBakIsRUFBdUIsT0FBdkIsQ0FBK0IsQ0FBQyxRQUFoQyxDQUFBO2lCQUNoQixPQUFBLENBQVEsYUFBUixFQUhGO1NBQUEsYUFBQTtVQUlNO1VBQ0osSUFBQyxDQUFBLEtBQUQsQ0FBTyxnQkFBQSxHQUFpQixHQUF4QjtpQkFDQSxNQUFBLENBQU8sR0FBUCxFQU5GOztNQURrQixDQUFUO0lBREg7Ozs7S0EvQjBCO0FBSHRDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCJcbkJlYXV0aWZpZXIgPSByZXF1aXJlKCcuL2JlYXV0aWZpZXInKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNsYXNzIFJlbWFyayBleHRlbmRzIEJlYXV0aWZpZXJcbiAgbmFtZTogXCJSZW1hcmtcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS93b29vcm0vcmVtYXJrXCJcbiAgb3B0aW9uczoge1xuICAgIF86IHtcbiAgICAgIGdmbTogdHJ1ZVxuICAgICAgeWFtbDogdHJ1ZVxuICAgICAgY29tbW9ubWFyazogdHJ1ZVxuICAgICAgZm9vdG5vdGVzOiB0cnVlXG4gICAgICBwZWRhbnRpYzogdHJ1ZVxuICAgICAgYnJlYWtzOiB0cnVlXG4gICAgICBlbnRpdGllczogdHJ1ZVxuICAgICAgc2V0ZXh0OiB0cnVlXG4gICAgICBjbG9zZUF0eDogdHJ1ZVxuICAgICAgbG9vc2VUYWJsZTogdHJ1ZVxuICAgICAgc3BhY2VkVGFibGU6IHRydWVcbiAgICAgIGZlbmNlOiB0cnVlXG4gICAgICBmZW5jZXM6IHRydWVcbiAgICAgIGJ1bGxldDogdHJ1ZVxuICAgICAgbGlzdEl0ZW1JbmRlbnQ6IHRydWVcbiAgICAgIGluY3JlbWVudExpc3RNYXJrZXI6IHRydWVcbiAgICAgIHJ1bGU6IHRydWVcbiAgICAgIHJ1bGVSZXBldGl0aW9uOiB0cnVlXG4gICAgICBydWxlU3BhY2VzOiB0cnVlXG4gICAgICBzdHJvbmc6IHRydWVcbiAgICAgIGVtcGhhc2lzOiB0cnVlXG4gICAgICBwb3NpdGlvbjogdHJ1ZVxuICAgIH1cbiAgICBNYXJrZG93bjogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICB0cnlcbiAgICAgICAgcmVtYXJrID0gcmVxdWlyZSAncmVtYXJrJ1xuICAgICAgICBjbGVhbk1hcmtkb3duID0gcmVtYXJrKCkucHJvY2Vzcyh0ZXh0LCBvcHRpb25zKS50b1N0cmluZygpXG4gICAgICAgIHJlc29sdmUgY2xlYW5NYXJrZG93blxuICAgICAgY2F0Y2ggZXJyXG4gICAgICAgIEBlcnJvcihcIlJlbWFyayBlcnJvcjogI3tlcnJ9XCIpXG4gICAgICAgIHJlamVjdChlcnIpXG4gICAgKVxuIl19
