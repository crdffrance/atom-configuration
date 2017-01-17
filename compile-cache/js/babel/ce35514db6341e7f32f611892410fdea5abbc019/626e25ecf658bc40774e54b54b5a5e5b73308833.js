'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {
  complete_strings: {
    doc: 'When enabled, this plugin will gather (short) strings in your code, and completing when inside a string will try to complete to previously seen strings. Takes a single option, maxLength, which controls the maximum length of string values to gather, and defaults to 15.',
    definition: {
      maxLength: {
        doc: '',
        type: 'number'
      }
    }
  },
  doc_comment: {
    doc: 'This plugin, which is enabled by default in the bin/tern server, parses comments before function declarations, variable declarations, and object properties. It will look for JSDoc-style type declarations, and try to parse them and add them to the inferred types, and it will treat the first sentence of comment text as the docstring for the defined variable or property.',
    definition: {
      fullDocs: {
        doc: 'Can be set to true to return the full comment text instead of the first sentence.',
        type: 'boolean'
      },
      strong: {
        doc: 'When enabled, types specified in comments take precedence over inferred types.',
        type: 'boolean'
      }
    }
  },
  node: {
    doc: 'The node.js plugin, called \"node\", provides variables that are part of the node environment, such as process and __dirname, and loads the commonjs and node_resolve plugins to allow node-style module loading. It defines types for the built-in modules that node.js provides (\"fs\", \"http\", etc).',
    definition: {
      dontLoad: {
        doc: 'Can be set to true to disable dynamic loading of required modules entirely, or to a regular expression to disable loading of files that match the expression.',
        type: 'string'
      },
      load: {
        doc: 'If dontLoad isn’t given, this setting is checked. If it is a regular expression, the plugin will only load files that match the expression.',
        type: 'string'
      },
      modules: {
        doc: 'Can be used to assign JSON type definitions to certain modules, so that those are loaded instead of the source code itself. If given, should be an object mapping module names to either JSON objects defining the types in the module, or a string referring to a file name (relative to the project directory) that contains the JSON data.',
        type: 'string'
      }
    }
  },
  node_resolve: {
    doc: 'This plugin defines the node.js module resolution strategy—things like defaulting to index.js when requiring a directory and searching node_modules directories. It depends on the modules plugin. Note that this plugin only does something meaningful when the Tern server is running on node.js itself.',
    definition: {}
  },
  modules: {
    doc: 'This is a supporting plugin to act as a dependency for other module-loading and module-resolving plugins.',
    definition: {
      dontLoad: {
        doc: 'Can be set to true to disable dynamic loading of required modules entirely, or to a regular expression to disable loading of files that match the expression.',
        type: 'string'
      },
      load: {
        doc: 'If dontLoad isn’t given, this setting is checked. If it is a regular expression, the plugin will only load files that match the expression.',
        type: 'string'
      },
      modules: {
        doc: 'Can be used to assign JSON type definitions to certain modules, so that those are loaded instead of the source code itself. If given, should be an object mapping module names to either JSON objects defining the types in the module, or a string referring to a file name (relative to the project directory) that contains the JSON data.',
        type: 'string'
      }
    }
  },
  es_modules: {
    doc: 'This plugin (es_modules) builds on top of the modules plugin to support ECMAScript 6’s import and export based module inclusion.',
    definition: {}
  },
  angular: {
    doc: 'Adds the angular object to the top-level environment, and tries to wire up some of the bizarre dependency management scheme from this library, so that dependency injections get the right types. Enabled with the name \"angular\".',
    definition: {}
  },
  requirejs: {
    doc: 'This plugin (\"requirejs\") teaches the server to understand RequireJS-style dependency management. It defines the global functions define and requirejs, and will do its best to resolve dependencies and give them their proper types.',
    defintions: {
      baseURL: {
        doc: 'The base path to prefix to dependency filenames.',
        type: 'string'
      },
      paths: {
        doc: 'An object mapping filename prefixes to specific paths. For example {\"acorn\": \"lib/acorn/\"}.',
        type: 'string'
      },
      override: {
        doc: 'An object that can be used to override some dependency names to refer to predetermined types. The value associated with a name can be a string starting with the character =, in which case the part after the = will be interpreted as a global variable (or dot-separated path) that contains the proper type. If it is a string not starting with =, it is interpreted as the path to the file that contains the code for the module. If it is an object, it is interpreted as JSON type definition.',
        type: 'string'
      }
    }
  },
  commonjs: {
    doc: 'This plugin implements CommonJS-style (require(\"foo\")) modules. It will wrap files in a file-local scope, and bind require, module, and exports in this scope. Does not implement a module resolution strategy (see for example the node_resolve plugin). Depends on the modules plugin.',
    definition: {}
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvY29uZmlnL3Rlcm4tcGx1Z2lucy1kZWZpbnRpb25zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFdBQVcsQ0FBQzs7Ozs7cUJBRUc7QUFDYixrQkFBZ0IsRUFBRTtBQUNoQixPQUFHLEVBQUUsOFFBQThRO0FBQ25SLGNBQVUsRUFBRTtBQUNWLGVBQVMsRUFBRTtBQUNULFdBQUcsRUFBRSxFQUFFO0FBQ1AsWUFBSSxFQUFFLFFBQVE7T0FDZjtLQUNGO0dBQ0Y7QUFDRCxhQUFXLEVBQUU7QUFDWCxPQUFHLEVBQUUsb1hBQW9YO0FBQ3pYLGNBQVUsRUFBRTtBQUNWLGNBQVEsRUFBRTtBQUNSLFdBQUcsRUFBRSxtRkFBbUY7QUFDeEYsWUFBSSxFQUFFLFNBQVM7T0FDaEI7QUFDRCxZQUFNLEVBQUU7QUFDTixXQUFHLEVBQUUsZ0ZBQWdGO0FBQ3JGLFlBQUksRUFBRSxTQUFTO09BQ2hCO0tBQ0Y7R0FDRjtBQUNELE1BQUksRUFBRTtBQUNKLE9BQUcsRUFBRSw0U0FBNFM7QUFDalQsY0FBVSxFQUFFO0FBQ1YsY0FBUSxFQUFFO0FBQ1IsV0FBRyxFQUFFLCtKQUErSjtBQUNwSyxZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsVUFBSSxFQUFFO0FBQ0osV0FBRyxFQUFFLDZJQUE2STtBQUNsSixZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsYUFBTyxFQUFFO0FBQ1AsV0FBRyxFQUFFLCtVQUErVTtBQUNwVixZQUFJLEVBQUUsUUFBUTtPQUNmO0tBQ0Y7R0FDRjtBQUNELGNBQVksRUFBRTtBQUNaLE9BQUcsRUFBRSw0U0FBNFM7QUFDalQsY0FBVSxFQUFFLEVBQUU7R0FDZjtBQUNELFNBQU8sRUFBRTtBQUNQLE9BQUcsRUFBRSwyR0FBMkc7QUFDaEgsY0FBVSxFQUFFO0FBQ1YsY0FBUSxFQUFFO0FBQ1IsV0FBRyxFQUFFLCtKQUErSjtBQUNwSyxZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsVUFBSSxFQUFFO0FBQ0osV0FBRyxFQUFFLDZJQUE2STtBQUNsSixZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsYUFBTyxFQUFFO0FBQ1AsV0FBRyxFQUFFLCtVQUErVTtBQUNwVixZQUFJLEVBQUUsUUFBUTtPQUNmO0tBQ0Y7R0FDRjtBQUNELFlBQVUsRUFBRTtBQUNWLE9BQUcsRUFBRSxrSUFBa0k7QUFDdkksY0FBVSxFQUFFLEVBQUU7R0FDZjtBQUNELFNBQU8sRUFBRTtBQUNQLE9BQUcsRUFBRSxzT0FBc087QUFDM08sY0FBVSxFQUFFLEVBQUU7R0FDZjtBQUNELFdBQVMsRUFBRTtBQUNULE9BQUcsRUFBRSwwT0FBME87QUFDL08sY0FBVSxFQUFFO0FBQ1YsYUFBTyxFQUFFO0FBQ1AsV0FBRyxFQUFFLGtEQUFrRDtBQUN2RCxZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsV0FBSyxFQUFFO0FBQ0wsV0FBRyxFQUFFLGlHQUFpRztBQUN0RyxZQUFJLEVBQUUsUUFBUTtPQUNmO0FBQ0QsY0FBUSxFQUFFO0FBQ1IsV0FBRyxFQUFFLHllQUF5ZTtBQUM5ZSxZQUFJLEVBQUUsUUFBUTtPQUNmO0tBQ0Y7R0FDRjtBQUNELFVBQVEsRUFBRTtBQUNSLE9BQUcsRUFBRSw0UkFBNFI7QUFDalMsY0FBVSxFQUFFLEVBQUU7R0FDZjtDQUNGIiwiZmlsZSI6Ii9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvY29uZmlnL3Rlcm4tcGx1Z2lucy1kZWZpbnRpb25zLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgY29tcGxldGVfc3RyaW5nczoge1xuICAgIGRvYzogJ1doZW4gZW5hYmxlZCwgdGhpcyBwbHVnaW4gd2lsbCBnYXRoZXIgKHNob3J0KSBzdHJpbmdzIGluIHlvdXIgY29kZSwgYW5kIGNvbXBsZXRpbmcgd2hlbiBpbnNpZGUgYSBzdHJpbmcgd2lsbCB0cnkgdG8gY29tcGxldGUgdG8gcHJldmlvdXNseSBzZWVuIHN0cmluZ3MuIFRha2VzIGEgc2luZ2xlIG9wdGlvbiwgbWF4TGVuZ3RoLCB3aGljaCBjb250cm9scyB0aGUgbWF4aW11bSBsZW5ndGggb2Ygc3RyaW5nIHZhbHVlcyB0byBnYXRoZXIsIGFuZCBkZWZhdWx0cyB0byAxNS4nLFxuICAgIGRlZmluaXRpb246IHtcbiAgICAgIG1heExlbmd0aDoge1xuICAgICAgICBkb2M6ICcnLFxuICAgICAgICB0eXBlOiAnbnVtYmVyJ1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZG9jX2NvbW1lbnQ6IHtcbiAgICBkb2M6ICdUaGlzIHBsdWdpbiwgd2hpY2ggaXMgZW5hYmxlZCBieSBkZWZhdWx0IGluIHRoZSBiaW4vdGVybiBzZXJ2ZXIsIHBhcnNlcyBjb21tZW50cyBiZWZvcmUgZnVuY3Rpb24gZGVjbGFyYXRpb25zLCB2YXJpYWJsZSBkZWNsYXJhdGlvbnMsIGFuZCBvYmplY3QgcHJvcGVydGllcy4gSXQgd2lsbCBsb29rIGZvciBKU0RvYy1zdHlsZSB0eXBlIGRlY2xhcmF0aW9ucywgYW5kIHRyeSB0byBwYXJzZSB0aGVtIGFuZCBhZGQgdGhlbSB0byB0aGUgaW5mZXJyZWQgdHlwZXMsIGFuZCBpdCB3aWxsIHRyZWF0IHRoZSBmaXJzdCBzZW50ZW5jZSBvZiBjb21tZW50IHRleHQgYXMgdGhlIGRvY3N0cmluZyBmb3IgdGhlIGRlZmluZWQgdmFyaWFibGUgb3IgcHJvcGVydHkuJyxcbiAgICBkZWZpbml0aW9uOiB7XG4gICAgICBmdWxsRG9jczoge1xuICAgICAgICBkb2M6ICdDYW4gYmUgc2V0IHRvIHRydWUgdG8gcmV0dXJuIHRoZSBmdWxsIGNvbW1lbnQgdGV4dCBpbnN0ZWFkIG9mIHRoZSBmaXJzdCBzZW50ZW5jZS4nLFxuICAgICAgICB0eXBlOiAnYm9vbGVhbidcbiAgICAgIH0sXG4gICAgICBzdHJvbmc6IHtcbiAgICAgICAgZG9jOiAnV2hlbiBlbmFibGVkLCB0eXBlcyBzcGVjaWZpZWQgaW4gY29tbWVudHMgdGFrZSBwcmVjZWRlbmNlIG92ZXIgaW5mZXJyZWQgdHlwZXMuJyxcbiAgICAgICAgdHlwZTogJ2Jvb2xlYW4nXG4gICAgICB9XG4gICAgfVxuICB9LFxuICBub2RlOiB7XG4gICAgZG9jOiAnVGhlIG5vZGUuanMgcGx1Z2luLCBjYWxsZWQgXFxcIm5vZGVcXFwiLCBwcm92aWRlcyB2YXJpYWJsZXMgdGhhdCBhcmUgcGFydCBvZiB0aGUgbm9kZSBlbnZpcm9ubWVudCwgc3VjaCBhcyBwcm9jZXNzIGFuZCBfX2Rpcm5hbWUsIGFuZCBsb2FkcyB0aGUgY29tbW9uanMgYW5kIG5vZGVfcmVzb2x2ZSBwbHVnaW5zIHRvIGFsbG93IG5vZGUtc3R5bGUgbW9kdWxlIGxvYWRpbmcuIEl0IGRlZmluZXMgdHlwZXMgZm9yIHRoZSBidWlsdC1pbiBtb2R1bGVzIHRoYXQgbm9kZS5qcyBwcm92aWRlcyAoXFxcImZzXFxcIiwgXFxcImh0dHBcXFwiLCBldGMpLicsXG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgZG9udExvYWQ6IHtcbiAgICAgICAgZG9jOiAnQ2FuIGJlIHNldCB0byB0cnVlIHRvIGRpc2FibGUgZHluYW1pYyBsb2FkaW5nIG9mIHJlcXVpcmVkIG1vZHVsZXMgZW50aXJlbHksIG9yIHRvIGEgcmVndWxhciBleHByZXNzaW9uIHRvIGRpc2FibGUgbG9hZGluZyBvZiBmaWxlcyB0aGF0IG1hdGNoIHRoZSBleHByZXNzaW9uLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgbG9hZDoge1xuICAgICAgICBkb2M6ICdJZiBkb250TG9hZCBpc27igJl0IGdpdmVuLCB0aGlzIHNldHRpbmcgaXMgY2hlY2tlZC4gSWYgaXQgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24sIHRoZSBwbHVnaW4gd2lsbCBvbmx5IGxvYWQgZmlsZXMgdGhhdCBtYXRjaCB0aGUgZXhwcmVzc2lvbi4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgZG9jOiAnQ2FuIGJlIHVzZWQgdG8gYXNzaWduIEpTT04gdHlwZSBkZWZpbml0aW9ucyB0byBjZXJ0YWluIG1vZHVsZXMsIHNvIHRoYXQgdGhvc2UgYXJlIGxvYWRlZCBpbnN0ZWFkIG9mIHRoZSBzb3VyY2UgY29kZSBpdHNlbGYuIElmIGdpdmVuLCBzaG91bGQgYmUgYW4gb2JqZWN0IG1hcHBpbmcgbW9kdWxlIG5hbWVzIHRvIGVpdGhlciBKU09OIG9iamVjdHMgZGVmaW5pbmcgdGhlIHR5cGVzIGluIHRoZSBtb2R1bGUsIG9yIGEgc3RyaW5nIHJlZmVycmluZyB0byBhIGZpbGUgbmFtZSAocmVsYXRpdmUgdG8gdGhlIHByb2plY3QgZGlyZWN0b3J5KSB0aGF0IGNvbnRhaW5zIHRoZSBKU09OIGRhdGEuJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIG5vZGVfcmVzb2x2ZToge1xuICAgIGRvYzogJ1RoaXMgcGx1Z2luIGRlZmluZXMgdGhlIG5vZGUuanMgbW9kdWxlIHJlc29sdXRpb24gc3RyYXRlZ3nigJR0aGluZ3MgbGlrZSBkZWZhdWx0aW5nIHRvIGluZGV4LmpzIHdoZW4gcmVxdWlyaW5nIGEgZGlyZWN0b3J5IGFuZCBzZWFyY2hpbmcgbm9kZV9tb2R1bGVzIGRpcmVjdG9yaWVzLiBJdCBkZXBlbmRzIG9uIHRoZSBtb2R1bGVzIHBsdWdpbi4gTm90ZSB0aGF0IHRoaXMgcGx1Z2luIG9ubHkgZG9lcyBzb21ldGhpbmcgbWVhbmluZ2Z1bCB3aGVuIHRoZSBUZXJuIHNlcnZlciBpcyBydW5uaW5nIG9uIG5vZGUuanMgaXRzZWxmLicsXG4gICAgZGVmaW5pdGlvbjoge31cbiAgfSxcbiAgbW9kdWxlczoge1xuICAgIGRvYzogJ1RoaXMgaXMgYSBzdXBwb3J0aW5nIHBsdWdpbiB0byBhY3QgYXMgYSBkZXBlbmRlbmN5IGZvciBvdGhlciBtb2R1bGUtbG9hZGluZyBhbmQgbW9kdWxlLXJlc29sdmluZyBwbHVnaW5zLicsXG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgZG9udExvYWQ6IHtcbiAgICAgICAgZG9jOiAnQ2FuIGJlIHNldCB0byB0cnVlIHRvIGRpc2FibGUgZHluYW1pYyBsb2FkaW5nIG9mIHJlcXVpcmVkIG1vZHVsZXMgZW50aXJlbHksIG9yIHRvIGEgcmVndWxhciBleHByZXNzaW9uIHRvIGRpc2FibGUgbG9hZGluZyBvZiBmaWxlcyB0aGF0IG1hdGNoIHRoZSBleHByZXNzaW9uLicsXG4gICAgICAgIHR5cGU6ICdzdHJpbmcnXG4gICAgICB9LFxuICAgICAgbG9hZDoge1xuICAgICAgICBkb2M6ICdJZiBkb250TG9hZCBpc27igJl0IGdpdmVuLCB0aGlzIHNldHRpbmcgaXMgY2hlY2tlZC4gSWYgaXQgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24sIHRoZSBwbHVnaW4gd2lsbCBvbmx5IGxvYWQgZmlsZXMgdGhhdCBtYXRjaCB0aGUgZXhwcmVzc2lvbi4nLFxuICAgICAgICB0eXBlOiAnc3RyaW5nJ1xuICAgICAgfSxcbiAgICAgIG1vZHVsZXM6IHtcbiAgICAgICAgZG9jOiAnQ2FuIGJlIHVzZWQgdG8gYXNzaWduIEpTT04gdHlwZSBkZWZpbml0aW9ucyB0byBjZXJ0YWluIG1vZHVsZXMsIHNvIHRoYXQgdGhvc2UgYXJlIGxvYWRlZCBpbnN0ZWFkIG9mIHRoZSBzb3VyY2UgY29kZSBpdHNlbGYuIElmIGdpdmVuLCBzaG91bGQgYmUgYW4gb2JqZWN0IG1hcHBpbmcgbW9kdWxlIG5hbWVzIHRvIGVpdGhlciBKU09OIG9iamVjdHMgZGVmaW5pbmcgdGhlIHR5cGVzIGluIHRoZSBtb2R1bGUsIG9yIGEgc3RyaW5nIHJlZmVycmluZyB0byBhIGZpbGUgbmFtZSAocmVsYXRpdmUgdG8gdGhlIHByb2plY3QgZGlyZWN0b3J5KSB0aGF0IGNvbnRhaW5zIHRoZSBKU09OIGRhdGEuJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGVzX21vZHVsZXM6IHtcbiAgICBkb2M6ICdUaGlzIHBsdWdpbiAoZXNfbW9kdWxlcykgYnVpbGRzIG9uIHRvcCBvZiB0aGUgbW9kdWxlcyBwbHVnaW4gdG8gc3VwcG9ydCBFQ01BU2NyaXB0IDbigJlzIGltcG9ydCBhbmQgZXhwb3J0IGJhc2VkIG1vZHVsZSBpbmNsdXNpb24uJyxcbiAgICBkZWZpbml0aW9uOiB7fVxuICB9LFxuICBhbmd1bGFyOiB7XG4gICAgZG9jOiAnQWRkcyB0aGUgYW5ndWxhciBvYmplY3QgdG8gdGhlIHRvcC1sZXZlbCBlbnZpcm9ubWVudCwgYW5kIHRyaWVzIHRvIHdpcmUgdXAgc29tZSBvZiB0aGUgYml6YXJyZSBkZXBlbmRlbmN5IG1hbmFnZW1lbnQgc2NoZW1lIGZyb20gdGhpcyBsaWJyYXJ5LCBzbyB0aGF0IGRlcGVuZGVuY3kgaW5qZWN0aW9ucyBnZXQgdGhlIHJpZ2h0IHR5cGVzLiBFbmFibGVkIHdpdGggdGhlIG5hbWUgXFxcImFuZ3VsYXJcXFwiLicsXG4gICAgZGVmaW5pdGlvbjoge31cbiAgfSxcbiAgcmVxdWlyZWpzOiB7XG4gICAgZG9jOiAnVGhpcyBwbHVnaW4gKFxcXCJyZXF1aXJlanNcXFwiKSB0ZWFjaGVzIHRoZSBzZXJ2ZXIgdG8gdW5kZXJzdGFuZCBSZXF1aXJlSlMtc3R5bGUgZGVwZW5kZW5jeSBtYW5hZ2VtZW50LiBJdCBkZWZpbmVzIHRoZSBnbG9iYWwgZnVuY3Rpb25zIGRlZmluZSBhbmQgcmVxdWlyZWpzLCBhbmQgd2lsbCBkbyBpdHMgYmVzdCB0byByZXNvbHZlIGRlcGVuZGVuY2llcyBhbmQgZ2l2ZSB0aGVtIHRoZWlyIHByb3BlciB0eXBlcy4nLFxuICAgIGRlZmludGlvbnM6IHtcbiAgICAgIGJhc2VVUkw6IHtcbiAgICAgICAgZG9jOiAnVGhlIGJhc2UgcGF0aCB0byBwcmVmaXggdG8gZGVwZW5kZW5jeSBmaWxlbmFtZXMuJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBwYXRoczoge1xuICAgICAgICBkb2M6ICdBbiBvYmplY3QgbWFwcGluZyBmaWxlbmFtZSBwcmVmaXhlcyB0byBzcGVjaWZpYyBwYXRocy4gRm9yIGV4YW1wbGUge1xcXCJhY29yblxcXCI6IFxcXCJsaWIvYWNvcm4vXFxcIn0uJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH0sXG4gICAgICBvdmVycmlkZToge1xuICAgICAgICBkb2M6ICdBbiBvYmplY3QgdGhhdCBjYW4gYmUgdXNlZCB0byBvdmVycmlkZSBzb21lIGRlcGVuZGVuY3kgbmFtZXMgdG8gcmVmZXIgdG8gcHJlZGV0ZXJtaW5lZCB0eXBlcy4gVGhlIHZhbHVlIGFzc29jaWF0ZWQgd2l0aCBhIG5hbWUgY2FuIGJlIGEgc3RyaW5nIHN0YXJ0aW5nIHdpdGggdGhlIGNoYXJhY3RlciA9LCBpbiB3aGljaCBjYXNlIHRoZSBwYXJ0IGFmdGVyIHRoZSA9IHdpbGwgYmUgaW50ZXJwcmV0ZWQgYXMgYSBnbG9iYWwgdmFyaWFibGUgKG9yIGRvdC1zZXBhcmF0ZWQgcGF0aCkgdGhhdCBjb250YWlucyB0aGUgcHJvcGVyIHR5cGUuIElmIGl0IGlzIGEgc3RyaW5nIG5vdCBzdGFydGluZyB3aXRoID0sIGl0IGlzIGludGVycHJldGVkIGFzIHRoZSBwYXRoIHRvIHRoZSBmaWxlIHRoYXQgY29udGFpbnMgdGhlIGNvZGUgZm9yIHRoZSBtb2R1bGUuIElmIGl0IGlzIGFuIG9iamVjdCwgaXQgaXMgaW50ZXJwcmV0ZWQgYXMgSlNPTiB0eXBlIGRlZmluaXRpb24uJyxcbiAgICAgICAgdHlwZTogJ3N0cmluZydcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGNvbW1vbmpzOiB7XG4gICAgZG9jOiAnVGhpcyBwbHVnaW4gaW1wbGVtZW50cyBDb21tb25KUy1zdHlsZSAocmVxdWlyZShcXFwiZm9vXFxcIikpIG1vZHVsZXMuIEl0IHdpbGwgd3JhcCBmaWxlcyBpbiBhIGZpbGUtbG9jYWwgc2NvcGUsIGFuZCBiaW5kIHJlcXVpcmUsIG1vZHVsZSwgYW5kIGV4cG9ydHMgaW4gdGhpcyBzY29wZS4gRG9lcyBub3QgaW1wbGVtZW50IGEgbW9kdWxlIHJlc29sdXRpb24gc3RyYXRlZ3kgKHNlZSBmb3IgZXhhbXBsZSB0aGUgbm9kZV9yZXNvbHZlIHBsdWdpbikuIERlcGVuZHMgb24gdGhlIG1vZHVsZXMgcGx1Z2luLicsXG4gICAgZGVmaW5pdGlvbjoge31cbiAgfVxufTtcbiJdfQ==