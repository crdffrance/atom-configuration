(function() {
  module.exports = {
    general: {
      title: 'General',
      type: 'object',
      collapsed: true,
      order: -1,
      description: 'General options for Atom Beautify',
      properties: {
        analytics: {
          title: 'Anonymous Analytics',
          type: 'boolean',
          "default": true,
          description: "[Google Analytics](http://www.google.com/analytics/) is used to track what languages are being used the most and causing the most errors, as well as other stats such as performance. Everything is anonymized and no personal information, such as source code, is sent. See https://github.com/Glavin001/atom-beautify/issues/47 for more details."
        },
        _analyticsUserId: {
          title: 'Analytics User Id',
          type: 'string',
          "default": "",
          description: "Unique identifier for this user for tracking usage analytics"
        },
        loggerLevel: {
          title: "Logger Level",
          type: 'string',
          "default": 'warn',
          description: 'Set the level for the logger',
          "enum": ['verbose', 'debug', 'info', 'warn', 'error']
        },
        beautifyEntireFileOnSave: {
          title: "Beautify Entire File On Save",
          type: 'boolean',
          "default": true,
          description: "When beautifying on save, use the entire file, even if there is selected text in the editor. Important: The `beautify on save` option for the specific language must be enabled for this to be applicable. This option is not `beautify on save`."
        },
        muteUnsupportedLanguageErrors: {
          title: "Mute Unsupported Language Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show \"Unsupported Language\" errors when they occur"
        },
        muteAllErrors: {
          title: "Mute All Errors",
          type: 'boolean',
          "default": false,
          description: "Do not show any/all errors when they occur"
        }
      }
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiL2hvbWUvam9jZWx5bi8uYXRvbS9wYWNrYWdlcy9hdG9tLWJlYXV0aWZ5L3NyYy9jb25maWcuY29mZmVlIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQUEsTUFBTSxDQUFDLE9BQVAsR0FBaUI7SUFDZixPQUFBLEVBQ0U7TUFBQSxLQUFBLEVBQU8sU0FBUDtNQUNBLElBQUEsRUFBTSxRQUROO01BRUEsU0FBQSxFQUFXLElBRlg7TUFHQSxLQUFBLEVBQU8sQ0FBQyxDQUhSO01BSUEsV0FBQSxFQUFhLG1DQUpiO01BS0EsVUFBQSxFQUNFO1FBQUEsU0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLHFCQUFQO1VBQ0EsSUFBQSxFQUFPLFNBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLElBRlY7VUFHQSxXQUFBLEVBQWMsc1ZBSGQ7U0FERjtRQVVBLGdCQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sbUJBQVA7VUFDQSxJQUFBLEVBQU8sUUFEUDtVQUVBLENBQUEsT0FBQSxDQUFBLEVBQVUsRUFGVjtVQUdBLFdBQUEsRUFBYyw4REFIZDtTQVhGO1FBZUEsV0FBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLGNBQVA7VUFDQSxJQUFBLEVBQU8sUUFEUDtVQUVBLENBQUEsT0FBQSxDQUFBLEVBQVUsTUFGVjtVQUdBLFdBQUEsRUFBYyw4QkFIZDtVQUlBLENBQUEsSUFBQSxDQUFBLEVBQU8sQ0FBQyxTQUFELEVBQVksT0FBWixFQUFxQixNQUFyQixFQUE2QixNQUE3QixFQUFxQyxPQUFyQyxDQUpQO1NBaEJGO1FBcUJBLHdCQUFBLEVBQ0U7VUFBQSxLQUFBLEVBQU8sOEJBQVA7VUFDQSxJQUFBLEVBQU8sU0FEUDtVQUVBLENBQUEsT0FBQSxDQUFBLEVBQVUsSUFGVjtVQUdBLFdBQUEsRUFBYyxtUEFIZDtTQXRCRjtRQTBCQSw2QkFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLGtDQUFQO1VBQ0EsSUFBQSxFQUFPLFNBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLEtBRlY7VUFHQSxXQUFBLEVBQWMsNkRBSGQ7U0EzQkY7UUErQkEsYUFBQSxFQUNFO1VBQUEsS0FBQSxFQUFPLGlCQUFQO1VBQ0EsSUFBQSxFQUFPLFNBRFA7VUFFQSxDQUFBLE9BQUEsQ0FBQSxFQUFVLEtBRlY7VUFHQSxXQUFBLEVBQWMsNENBSGQ7U0FoQ0Y7T0FORjtLQUZhOztBQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0ge1xuICBnZW5lcmFsOlxuICAgIHRpdGxlOiAnR2VuZXJhbCdcbiAgICB0eXBlOiAnb2JqZWN0J1xuICAgIGNvbGxhcHNlZDogdHJ1ZVxuICAgIG9yZGVyOiAtMVxuICAgIGRlc2NyaXB0aW9uOiAnR2VuZXJhbCBvcHRpb25zIGZvciBBdG9tIEJlYXV0aWZ5J1xuICAgIHByb3BlcnRpZXM6XG4gICAgICBhbmFseXRpY3MgOlxuICAgICAgICB0aXRsZTogJ0Fub255bW91cyBBbmFseXRpY3MnXG4gICAgICAgIHR5cGUgOiAnYm9vbGVhbidcbiAgICAgICAgZGVmYXVsdCA6IHRydWVcbiAgICAgICAgZGVzY3JpcHRpb24gOiBcIltHb29nbGVcbiAgICAgICAgICAgICAgICBBbmFseXRpY3NdKGh0dHA6Ly93d3cuZ29vZ2xlLmNvbS9hbmFseXRpY3MvKSBpcyB1c2VkIHRvIHRyYWNrIHdoYXQgbGFuZ3VhZ2VzIGFyZSBiZWluZ1xuICAgICAgICAgICAgICAgIHVzZWQgdGhlIG1vc3QgYW5kIGNhdXNpbmcgdGhlIG1vc3QgZXJyb3JzLCBhcyB3ZWxsIGFzIG90aGVyIHN0YXRzIHN1Y2ggYXMgcGVyZm9ybWFuY2UuXG4gICAgICAgICAgICAgICAgRXZlcnl0aGluZyBpcyBhbm9ueW1pemVkIGFuZCBubyBwZXJzb25hbFxuICAgICAgICAgICAgICAgIGluZm9ybWF0aW9uLCBzdWNoIGFzIHNvdXJjZSBjb2RlLCBpcyBzZW50LlxuICAgICAgICAgICAgICAgIFNlZSBodHRwczovL2dpdGh1Yi5jb20vR2xhdmluMDAxL2F0b20tYmVhdXRpZnkvaXNzdWVzLzQ3IGZvciBtb3JlIGRldGFpbHMuXCJcbiAgICAgIF9hbmFseXRpY3NVc2VySWQgOlxuICAgICAgICB0aXRsZTogJ0FuYWx5dGljcyBVc2VyIElkJ1xuICAgICAgICB0eXBlIDogJ3N0cmluZydcbiAgICAgICAgZGVmYXVsdCA6IFwiXCJcbiAgICAgICAgZGVzY3JpcHRpb24gOiBcIlVuaXF1ZSBpZGVudGlmaWVyIGZvciB0aGlzIHVzZXIgZm9yIHRyYWNraW5nIHVzYWdlIGFuYWx5dGljc1wiXG4gICAgICBsb2dnZXJMZXZlbCA6XG4gICAgICAgIHRpdGxlOiBcIkxvZ2dlciBMZXZlbFwiXG4gICAgICAgIHR5cGUgOiAnc3RyaW5nJ1xuICAgICAgICBkZWZhdWx0IDogJ3dhcm4nXG4gICAgICAgIGRlc2NyaXB0aW9uIDogJ1NldCB0aGUgbGV2ZWwgZm9yIHRoZSBsb2dnZXInXG4gICAgICAgIGVudW0gOiBbJ3ZlcmJvc2UnLCAnZGVidWcnLCAnaW5mbycsICd3YXJuJywgJ2Vycm9yJ11cbiAgICAgIGJlYXV0aWZ5RW50aXJlRmlsZU9uU2F2ZSA6XG4gICAgICAgIHRpdGxlOiBcIkJlYXV0aWZ5IEVudGlyZSBGaWxlIE9uIFNhdmVcIlxuICAgICAgICB0eXBlIDogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQgOiB0cnVlXG4gICAgICAgIGRlc2NyaXB0aW9uIDogXCJXaGVuIGJlYXV0aWZ5aW5nIG9uIHNhdmUsIHVzZSB0aGUgZW50aXJlIGZpbGUsIGV2ZW4gaWYgdGhlcmUgaXMgc2VsZWN0ZWQgdGV4dCBpbiB0aGUgZWRpdG9yLiBJbXBvcnRhbnQ6IFRoZSBgYmVhdXRpZnkgb24gc2F2ZWAgb3B0aW9uIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgbXVzdCBiZSBlbmFibGVkIGZvciB0aGlzIHRvIGJlIGFwcGxpY2FibGUuIFRoaXMgb3B0aW9uIGlzIG5vdCBgYmVhdXRpZnkgb24gc2F2ZWAuXCJcbiAgICAgIG11dGVVbnN1cHBvcnRlZExhbmd1YWdlRXJyb3JzIDpcbiAgICAgICAgdGl0bGU6IFwiTXV0ZSBVbnN1cHBvcnRlZCBMYW5ndWFnZSBFcnJvcnNcIlxuICAgICAgICB0eXBlIDogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQgOiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiRG8gbm90IHNob3cgXFxcIlVuc3VwcG9ydGVkIExhbmd1YWdlXFxcIiBlcnJvcnMgd2hlbiB0aGV5IG9jY3VyXCJcbiAgICAgIG11dGVBbGxFcnJvcnMgOlxuICAgICAgICB0aXRsZTogXCJNdXRlIEFsbCBFcnJvcnNcIlxuICAgICAgICB0eXBlIDogJ2Jvb2xlYW4nXG4gICAgICAgIGRlZmF1bHQgOiBmYWxzZVxuICAgICAgICBkZXNjcmlwdGlvbiA6IFwiRG8gbm90IHNob3cgYW55L2FsbCBlcnJvcnMgd2hlbiB0aGV5IG9jY3VyXCJcbiAgICB9XG4iXX0=
