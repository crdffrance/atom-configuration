'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  ecmaVersion: {
    doc: 'The ECMAScript version to parse. Should be either 5, 6 or 7. Default is 6.'
  },
  libs: {
    browser: {
      doc: 'JavaScript'
    },
    jquery: {
      doc: 'JQuery'
    },
    underscore: {
      doc: 'underscore'
    },
    chai: {
      doc: 'chai'
    }
  },
  loadEagerly: {
    doc: 'loadEagerly allows you to force some files to always be loaded, it may be an array of filenames or glob patterns (i.e. foo/bar/*.js).'
  },
  dontLoad: {
    doc: 'The dontLoad option can be used to prevent Tern from loading certain files. It also takes an array of file names or glob patterns.'
  },
  plugins: {
    doc: 'Plugins used by this project. Currenty you can only activate the plugin from this view without setting up the options for it. After saving the config, plugins with default options are added to the .tern-project file. Unchecking the plugin will result in removing the plugin property entirely from the .tern-project file. Please refer to <a href=\"http://ternjs.net/doc/manual.html#plugins\">this page</a> for detailed information for the build in server plugins.'
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvY29uZmlnL3Rlcm4tY29uZmlnLWRvY3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsV0FBVyxDQUFDOzs7OztxQkFFRztBQUNiLGFBQVcsRUFBRTtBQUNYLE9BQUcsRUFBRSw0RUFBNEU7R0FDbEY7QUFDRCxNQUFJLEVBQUU7QUFDSixXQUFPLEVBQUU7QUFDUCxTQUFHLEVBQUUsWUFBWTtLQUNsQjtBQUNELFVBQU0sRUFBRTtBQUNOLFNBQUcsRUFBRSxRQUFRO0tBQ2Q7QUFDRCxjQUFVLEVBQUU7QUFDVixTQUFHLEVBQUUsWUFBWTtLQUNsQjtBQUNELFFBQUksRUFBRTtBQUNKLFNBQUcsRUFBRSxNQUFNO0tBQ1o7R0FDRjtBQUNELGFBQVcsRUFBRTtBQUNYLE9BQUcsRUFBRSx1SUFBdUk7R0FDN0k7QUFDRCxVQUFRLEVBQUU7QUFDUixPQUFHLEVBQUUsb0lBQW9JO0dBQzFJO0FBQ0QsU0FBTyxFQUFFO0FBQ1AsT0FBRyxFQUFFLGdkQUFnZDtHQUN0ZDtDQUNGIiwiZmlsZSI6Ii9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvY29uZmlnL3Rlcm4tY29uZmlnLWRvY3MuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcblxuZXhwb3J0IGRlZmF1bHQge1xuICBlY21hVmVyc2lvbjoge1xuICAgIGRvYzogJ1RoZSBFQ01BU2NyaXB0IHZlcnNpb24gdG8gcGFyc2UuIFNob3VsZCBiZSBlaXRoZXIgNSwgNiBvciA3LiBEZWZhdWx0IGlzIDYuJ1xuICB9LFxuICBsaWJzOiB7XG4gICAgYnJvd3Nlcjoge1xuICAgICAgZG9jOiAnSmF2YVNjcmlwdCdcbiAgICB9LFxuICAgIGpxdWVyeToge1xuICAgICAgZG9jOiAnSlF1ZXJ5J1xuICAgIH0sXG4gICAgdW5kZXJzY29yZToge1xuICAgICAgZG9jOiAndW5kZXJzY29yZSdcbiAgICB9LFxuICAgIGNoYWk6IHtcbiAgICAgIGRvYzogJ2NoYWknXG4gICAgfVxuICB9LFxuICBsb2FkRWFnZXJseToge1xuICAgIGRvYzogJ2xvYWRFYWdlcmx5IGFsbG93cyB5b3UgdG8gZm9yY2Ugc29tZSBmaWxlcyB0byBhbHdheXMgYmUgbG9hZGVkLCBpdCBtYXkgYmUgYW4gYXJyYXkgb2YgZmlsZW5hbWVzIG9yIGdsb2IgcGF0dGVybnMgKGkuZS4gZm9vL2Jhci8qLmpzKS4nXG4gIH0sXG4gIGRvbnRMb2FkOiB7XG4gICAgZG9jOiAnVGhlIGRvbnRMb2FkIG9wdGlvbiBjYW4gYmUgdXNlZCB0byBwcmV2ZW50IFRlcm4gZnJvbSBsb2FkaW5nIGNlcnRhaW4gZmlsZXMuIEl0IGFsc28gdGFrZXMgYW4gYXJyYXkgb2YgZmlsZSBuYW1lcyBvciBnbG9iIHBhdHRlcm5zLidcbiAgfSxcbiAgcGx1Z2luczoge1xuICAgIGRvYzogJ1BsdWdpbnMgdXNlZCBieSB0aGlzIHByb2plY3QuIEN1cnJlbnR5IHlvdSBjYW4gb25seSBhY3RpdmF0ZSB0aGUgcGx1Z2luIGZyb20gdGhpcyB2aWV3IHdpdGhvdXQgc2V0dGluZyB1cCB0aGUgb3B0aW9ucyBmb3IgaXQuIEFmdGVyIHNhdmluZyB0aGUgY29uZmlnLCBwbHVnaW5zIHdpdGggZGVmYXVsdCBvcHRpb25zIGFyZSBhZGRlZCB0byB0aGUgLnRlcm4tcHJvamVjdCBmaWxlLiBVbmNoZWNraW5nIHRoZSBwbHVnaW4gd2lsbCByZXN1bHQgaW4gcmVtb3ZpbmcgdGhlIHBsdWdpbiBwcm9wZXJ0eSBlbnRpcmVseSBmcm9tIHRoZSAudGVybi1wcm9qZWN0IGZpbGUuIFBsZWFzZSByZWZlciB0byA8YSBocmVmPVxcXCJodHRwOi8vdGVybmpzLm5ldC9kb2MvbWFudWFsLmh0bWwjcGx1Z2luc1xcXCI+dGhpcyBwYWdlPC9hPiBmb3IgZGV0YWlsZWQgaW5mb3JtYXRpb24gZm9yIHRoZSBidWlsZCBpbiBzZXJ2ZXIgcGx1Z2lucy4nXG4gIH1cbn07XG4iXX0=