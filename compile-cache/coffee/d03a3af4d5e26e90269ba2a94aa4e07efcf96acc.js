(function() {
  "use strict";
  var Beautifier, JSBeautify,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  Beautifier = require('./beautifier');

  module.exports = JSBeautify = (function(superClass) {
    extend(JSBeautify, superClass);

    function JSBeautify() {
      return JSBeautify.__super__.constructor.apply(this, arguments);
    }

    JSBeautify.prototype.name = "CSScomb";

    JSBeautify.prototype.link = "https://github.com/csscomb/csscomb.js";

    JSBeautify.prototype.options = {
      _: {
        configPath: true,
        predefinedConfig: true
      },
      CSS: true,
      LESS: true,
      SCSS: true
    };

    JSBeautify.prototype.beautify = function(text, language, options) {
      return new this.Promise(function(resolve, reject) {
        var CSON, Comb, comb, config, expandHomeDir, processedCSS, project, ref, syntax;
        Comb = require('csscomb');
        expandHomeDir = require('expand-home-dir');
        CSON = require('season');
        config = null;
        try {
          project = (ref = atom.project.getDirectories()) != null ? ref[0] : void 0;
          try {
            config = CSON.readFileSync(project != null ? project.resolve('.csscomb.cson') : void 0);
          } catch (error) {
            config = require(project != null ? project.resolve('.csscomb.json') : void 0);
          }
        } catch (error) {
          try {
            config = CSON.readFileSync(expandHomeDir(options.configPath));
          } catch (error) {
            config = Comb.getConfig(options.predefinedConfig);
          }
        }
        comb = new Comb(config);
        syntax = "css";
        switch (language) {
          case "LESS":
            syntax = "less";
            break;
          case "SCSS":
            syntax = "scss";
            break;
          case "Sass":
            syntax = "sass";
        }
        processedCSS = comb.processString(text, {
          syntax: syntax
        });
        return resolve(processedCSS);
      });
    };

    return JSBeautify;

  })(Beautifier);

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9iZWF1dGlmaWVycy9jc3Njb21iLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFBO0FBQUEsTUFBQSxzQkFBQTtJQUFBOzs7RUFDQSxVQUFBLEdBQWEsT0FBQSxDQUFRLGNBQVI7O0VBRWIsTUFBTSxDQUFDLE9BQVAsR0FBdUI7Ozs7Ozs7eUJBQ3JCLElBQUEsR0FBTTs7eUJBQ04sSUFBQSxHQUFNOzt5QkFFTixPQUFBLEdBQVM7TUFFUCxDQUFBLEVBQ0U7UUFBQSxVQUFBLEVBQVksSUFBWjtRQUNBLGdCQUFBLEVBQWtCLElBRGxCO09BSEs7TUFLUCxHQUFBLEVBQUssSUFMRTtNQU1QLElBQUEsRUFBTSxJQU5DO01BT1AsSUFBQSxFQUFNLElBUEM7Ozt5QkFVVCxRQUFBLEdBQVUsU0FBQyxJQUFELEVBQU8sUUFBUCxFQUFpQixPQUFqQjtBQUNSLGFBQVcsSUFBQSxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsT0FBRCxFQUFVLE1BQVY7QUFJbEIsWUFBQTtRQUFBLElBQUEsR0FBTyxPQUFBLENBQVEsU0FBUjtRQUNQLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGlCQUFSO1FBQ2hCLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUjtRQUVQLE1BQUEsR0FBUztBQUNUO1VBQ0UsT0FBQSxzREFBeUMsQ0FBQSxDQUFBO0FBQ3pDO1lBQ0UsTUFBQSxHQUFTLElBQUksQ0FBQyxZQUFMLG1CQUFrQixPQUFPLENBQUUsT0FBVCxDQUFpQixlQUFqQixVQUFsQixFQURYO1dBQUEsYUFBQTtZQUdFLE1BQUEsR0FBUyxPQUFBLG1CQUFRLE9BQU8sQ0FBRSxPQUFULENBQWlCLGVBQWpCLFVBQVIsRUFIWDtXQUZGO1NBQUEsYUFBQTtBQU9FO1lBQ0UsTUFBQSxHQUFTLElBQUksQ0FBQyxZQUFMLENBQWtCLGFBQUEsQ0FBYyxPQUFPLENBQUMsVUFBdEIsQ0FBbEIsRUFEWDtXQUFBLGFBQUE7WUFJRSxNQUFBLEdBQVMsSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFPLENBQUMsZ0JBQXZCLEVBSlg7V0FQRjs7UUFjQSxJQUFBLEdBQVcsSUFBQSxJQUFBLENBQUssTUFBTDtRQUdYLE1BQUEsR0FBUztBQUNULGdCQUFPLFFBQVA7QUFBQSxlQUNPLE1BRFA7WUFFSSxNQUFBLEdBQVM7QUFETjtBQURQLGVBR08sTUFIUDtZQUlJLE1BQUEsR0FBUztBQUROO0FBSFAsZUFLTyxNQUxQO1lBTUksTUFBQSxHQUFTO0FBTmI7UUFRQSxZQUFBLEdBQWUsSUFBSSxDQUFDLGFBQUwsQ0FBbUIsSUFBbkIsRUFBeUI7VUFDdEMsTUFBQSxFQUFRLE1BRDhCO1NBQXpCO2VBS2YsT0FBQSxDQUFRLFlBQVI7TUF4Q2tCLENBQVQ7SUFESDs7OztLQWQ4QjtBQUgxQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5CZWF1dGlmaWVyID0gcmVxdWlyZSgnLi9iZWF1dGlmaWVyJylcblxubW9kdWxlLmV4cG9ydHMgPSBjbGFzcyBKU0JlYXV0aWZ5IGV4dGVuZHMgQmVhdXRpZmllclxuICBuYW1lOiBcIkNTU2NvbWJcIlxuICBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9jc3Njb21iL2Nzc2NvbWIuanNcIlxuXG4gIG9wdGlvbnM6IHtcbiAgICAjIFRPRE86IEFkZCBzdXBwb3J0IGZvciBvcHRpb25zXG4gICAgXzpcbiAgICAgIGNvbmZpZ1BhdGg6IHRydWVcbiAgICAgIHByZWRlZmluZWRDb25maWc6IHRydWVcbiAgICBDU1M6IHRydWVcbiAgICBMRVNTOiB0cnVlXG4gICAgU0NTUzogdHJ1ZVxuICB9XG5cbiAgYmVhdXRpZnk6ICh0ZXh0LCBsYW5ndWFnZSwgb3B0aW9ucykgLT5cbiAgICByZXR1cm4gbmV3IEBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpIC0+XG4gICAgICAjIGNvbnNvbGUubG9nKCdDU1NDb21iJywgdGV4dCwgbGFuZ3VhZ2UsIG9wdGlvbnMpXG5cbiAgICAgICMgUmVxdWlyZVxuICAgICAgQ29tYiA9IHJlcXVpcmUoJ2Nzc2NvbWInKVxuICAgICAgZXhwYW5kSG9tZURpciA9IHJlcXVpcmUoJ2V4cGFuZC1ob21lLWRpcicpXG4gICAgICBDU09OID0gcmVxdWlyZSgnc2Vhc29uJylcblxuICAgICAgY29uZmlnID0gbnVsbFxuICAgICAgdHJ5ICMgTG9hZCBmcm9tIHByb2plY3QgY29uZmlnIGZpbGUsIHRocm93aW5nIGVycm9yIGlmIG5laXRoZXIgZXhpc3RcbiAgICAgICAgcHJvamVjdCA9IGF0b20ucHJvamVjdC5nZXREaXJlY3RvcmllcygpP1swXVxuICAgICAgICB0cnlcbiAgICAgICAgICBjb25maWcgPSBDU09OLnJlYWRGaWxlU3luYyhwcm9qZWN0Py5yZXNvbHZlICcuY3NzY29tYi5jc29uJylcbiAgICAgICAgY2F0Y2hcbiAgICAgICAgICBjb25maWcgPSByZXF1aXJlKHByb2plY3Q/LnJlc29sdmUgJy5jc3Njb21iLmpzb24nKVxuICAgICAgY2F0Y2hcbiAgICAgICAgdHJ5ICMgTG9hZCBmcm9tIGN1c3RvbSBjb25maWdcbiAgICAgICAgICBjb25maWcgPSBDU09OLnJlYWRGaWxlU3luYyhleHBhbmRIb21lRGlyIG9wdGlvbnMuY29uZmlnUGF0aClcbiAgICAgICAgY2F0Y2hcbiAgICAgICAgICAjIEZhbGxiYWNrIHRvIFtzZWxlY3RlZF0gQ1NTY29tYiBwcmVkaWZpbmVkIGNvbmZpZ1xuICAgICAgICAgIGNvbmZpZyA9IENvbWIuZ2V0Q29uZmlnKG9wdGlvbnMucHJlZGVmaW5lZENvbmZpZylcbiAgICAgICMgY29uc29sZS5sb2coJ2NvbmZpZycsIGNvbmZpZywgb3B0aW9ucylcbiAgICAgICMgQ29uZmlndXJlXG4gICAgICBjb21iID0gbmV3IENvbWIoY29uZmlnKVxuXG4gICAgICAjIERldGVybWluZSBzeW50YXggZnJvbSBMYW5ndWFnZVxuICAgICAgc3ludGF4ID0gXCJjc3NcIiAjIERlZmF1bHRcbiAgICAgIHN3aXRjaCBsYW5ndWFnZVxuICAgICAgICB3aGVuIFwiTEVTU1wiXG4gICAgICAgICAgc3ludGF4ID0gXCJsZXNzXCJcbiAgICAgICAgd2hlbiBcIlNDU1NcIlxuICAgICAgICAgIHN5bnRheCA9IFwic2Nzc1wiXG4gICAgICAgIHdoZW4gXCJTYXNzXCJcbiAgICAgICAgICBzeW50YXggPSBcInNhc3NcIlxuICAgICAgIyBVc2VcbiAgICAgIHByb2Nlc3NlZENTUyA9IGNvbWIucHJvY2Vzc1N0cmluZyh0ZXh0LCB7XG4gICAgICAgIHN5bnRheDogc3ludGF4XG4gICAgICB9KVxuICAgICAgIyBjb25zb2xlLmxvZygncHJvY2Vzc2VkQ1NTJywgcHJvY2Vzc2VkQ1NTLCBzeW50YXgpXG5cbiAgICAgIHJlc29sdmUocHJvY2Vzc2VkQ1NTKVxuICAgIClcbiJdfQ==
