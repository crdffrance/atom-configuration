'use babel';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = {

  excludeLowerPriorityProviders: {

    title: 'Exclude lower priority providers',
    description: 'Whether to exclude lower priority providers (e.g. autocomplete-paths)',
    type: 'boolean',
    'default': false,
    order: 0
  },
  guess: {

    title: 'Guess',
    description: 'When completing a property and no completions are found, Tern will use some heuristics to try and return some properties anyway. Set this to false to turn that off.',
    type: 'boolean',
    'default': true,
    order: 1
  },
  sort: {

    title: 'Sort',
    description: 'Determines whether the result set will be sorted.',
    type: 'boolean',
    'default': true,
    order: 2
  },
  caseInsensitive: {

    title: 'Case-insensitive',
    description: 'Whether to use a case-insensitive compare between the current word and potential completions.',
    type: 'boolean',
    'default': true,
    order: 3
  },
  useSnippets: {

    title: 'Use autocomplete-snippets',
    description: 'Adds snippets to autocomplete+ suggestions',
    type: 'boolean',
    'default': false,
    order: 4
  },
  snippetsFirst: {

    title: 'Display snippets above',
    description: 'Displays snippets above tern suggestions. Requires a restart.',
    type: 'boolean',
    'default': false,
    order: 5
  },
  useSnippetsAndFunction: {

    title: 'Display both, autocomplete-snippets and function name',
    description: 'Choose to just complete the function name or expand the snippet',
    type: 'boolean',
    'default': false,
    order: 6
  },
  inlineFnCompletion: {

    title: 'Display inline suggestions for function params',
    description: 'Displays a inline suggestion located right next to the current cursor',
    type: 'boolean',
    'default': true,
    order: 7
  },
  inlineFnCompletionDocumentation: {

    title: 'Display inline suggestions with additional documentation (if any)',
    description: 'Adds documentation to the inline function completion',
    type: 'boolean',
    'default': false,
    order: 8
  },
  documentation: {

    title: 'Documentation',
    description: 'Whether to include documentation string (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 9
  },
  urls: {

    title: 'Url',
    description: 'Whether to include documentation urls (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 10
  },
  origins: {

    title: 'Origin',
    description: 'Whether to include origins (if found) in the result data.',
    type: 'boolean',
    'default': true,
    order: 11
  },
  ternServerGetFileAsync: {

    title: 'Tern Server getFile async',
    description: 'Indicates whether getFile is asynchronous. Default is true. Requires a restart.',
    type: 'boolean',
    'default': true,
    order: 12
  },
  ternServerDependencyBudget: {

    title: 'Tern Server dependency-budget',
    description: 'http://ternjs.net/doc/manual.html#dependency_budget. Requires a restart.',
    type: 'number',
    'default': 20000,
    order: 13
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2NvbmZpZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUM7Ozs7O3FCQUVHOztBQUViLCtCQUE2QixFQUFFOztBQUU3QixTQUFLLEVBQUUsa0NBQWtDO0FBQ3pDLGVBQVcsRUFBRSx1RUFBdUU7QUFDcEYsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsT0FBSyxFQUFFOztBQUVMLFNBQUssRUFBRSxPQUFPO0FBQ2QsZUFBVyxFQUFFLHNLQUFzSztBQUNuTCxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxNQUFJLEVBQUU7O0FBRUosU0FBSyxFQUFFLE1BQU07QUFDYixlQUFXLEVBQUUsbURBQW1EO0FBQ2hFLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGlCQUFlLEVBQUU7O0FBRWYsU0FBSyxFQUFFLGtCQUFrQjtBQUN6QixlQUFXLEVBQUUsK0ZBQStGO0FBQzVHLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELGFBQVcsRUFBRTs7QUFFWCxTQUFLLEVBQUUsMkJBQTJCO0FBQ2xDLGVBQVcsRUFBRSw0Q0FBNEM7QUFDekQsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLEtBQUs7QUFDZCxTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsZUFBYSxFQUFFOztBQUViLFNBQUssRUFBRSx3QkFBd0I7QUFDL0IsZUFBVyxFQUFFLCtEQUErRDtBQUM1RSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCx3QkFBc0IsRUFBRTs7QUFFdEIsU0FBSyxFQUFFLHVEQUF1RDtBQUM5RCxlQUFXLEVBQUUsaUVBQWlFO0FBQzlFLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLENBQUM7R0FDVDtBQUNELG9CQUFrQixFQUFFOztBQUVsQixTQUFLLEVBQUUsZ0RBQWdEO0FBQ3ZELGVBQVcsRUFBRSx1RUFBdUU7QUFDcEYsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsQ0FBQztHQUNUO0FBQ0QsaUNBQStCLEVBQUU7O0FBRS9CLFNBQUssRUFBRSxtRUFBbUU7QUFDMUUsZUFBVyxFQUFFLHNEQUFzRDtBQUNuRSxRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsS0FBSztBQUNkLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxlQUFhLEVBQUU7O0FBRWIsU0FBSyxFQUFFLGVBQWU7QUFDdEIsZUFBVyxFQUFFLHdFQUF3RTtBQUNyRixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxDQUFDO0dBQ1Q7QUFDRCxNQUFJLEVBQUU7O0FBRUosU0FBSyxFQUFFLEtBQUs7QUFDWixlQUFXLEVBQUUsc0VBQXNFO0FBQ25GLFFBQUksRUFBRSxTQUFTO0FBQ2YsZUFBUyxJQUFJO0FBQ2IsU0FBSyxFQUFFLEVBQUU7R0FDVjtBQUNELFNBQU8sRUFBRTs7QUFFUCxTQUFLLEVBQUUsUUFBUTtBQUNmLGVBQVcsRUFBRSwyREFBMkQ7QUFDeEUsUUFBSSxFQUFFLFNBQVM7QUFDZixlQUFTLElBQUk7QUFDYixTQUFLLEVBQUUsRUFBRTtHQUNWO0FBQ0Qsd0JBQXNCLEVBQUU7O0FBRXRCLFNBQUssRUFBRSwyQkFBMkI7QUFDbEMsZUFBVyxFQUFFLGlGQUFpRjtBQUM5RixRQUFJLEVBQUUsU0FBUztBQUNmLGVBQVMsSUFBSTtBQUNiLFNBQUssRUFBRSxFQUFFO0dBQ1Y7QUFDRCw0QkFBMEIsRUFBRTs7QUFFMUIsU0FBSyxFQUFFLCtCQUErQjtBQUN0QyxlQUFXLEVBQUUsMEVBQTBFO0FBQ3ZGLFFBQUksRUFBRSxRQUFRO0FBQ2QsZUFBUyxLQUFLO0FBQ2QsU0FBSyxFQUFFLEVBQUU7R0FDVjtDQUNGIiwiZmlsZSI6Ii9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvYXRvbS10ZXJuanMvbGliL2NvbmZpZy5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG5cbiAgZXhjbHVkZUxvd2VyUHJpb3JpdHlQcm92aWRlcnM6IHtcblxuICAgIHRpdGxlOiAnRXhjbHVkZSBsb3dlciBwcmlvcml0eSBwcm92aWRlcnMnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byBleGNsdWRlIGxvd2VyIHByaW9yaXR5IHByb3ZpZGVycyAoZS5nLiBhdXRvY29tcGxldGUtcGF0aHMpJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDBcbiAgfSxcbiAgZ3Vlc3M6IHtcblxuICAgIHRpdGxlOiAnR3Vlc3MnLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hlbiBjb21wbGV0aW5nIGEgcHJvcGVydHkgYW5kIG5vIGNvbXBsZXRpb25zIGFyZSBmb3VuZCwgVGVybiB3aWxsIHVzZSBzb21lIGhldXJpc3RpY3MgdG8gdHJ5IGFuZCByZXR1cm4gc29tZSBwcm9wZXJ0aWVzIGFueXdheS4gU2V0IHRoaXMgdG8gZmFsc2UgdG8gdHVybiB0aGF0IG9mZi4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAxXG4gIH0sXG4gIHNvcnQ6IHtcblxuICAgIHRpdGxlOiAnU29ydCcsXG4gICAgZGVzY3JpcHRpb246ICdEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIHJlc3VsdCBzZXQgd2lsbCBiZSBzb3J0ZWQuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogMlxuICB9LFxuICBjYXNlSW5zZW5zaXRpdmU6IHtcblxuICAgIHRpdGxlOiAnQ2FzZS1pbnNlbnNpdGl2ZScsXG4gICAgZGVzY3JpcHRpb246ICdXaGV0aGVyIHRvIHVzZSBhIGNhc2UtaW5zZW5zaXRpdmUgY29tcGFyZSBiZXR3ZWVuIHRoZSBjdXJyZW50IHdvcmQgYW5kIHBvdGVudGlhbCBjb21wbGV0aW9ucy4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAzXG4gIH0sXG4gIHVzZVNuaXBwZXRzOiB7XG5cbiAgICB0aXRsZTogJ1VzZSBhdXRvY29tcGxldGUtc25pcHBldHMnLFxuICAgIGRlc2NyaXB0aW9uOiAnQWRkcyBzbmlwcGV0cyB0byBhdXRvY29tcGxldGUrIHN1Z2dlc3Rpb25zJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDRcbiAgfSxcbiAgc25pcHBldHNGaXJzdDoge1xuXG4gICAgdGl0bGU6ICdEaXNwbGF5IHNuaXBwZXRzIGFib3ZlJyxcbiAgICBkZXNjcmlwdGlvbjogJ0Rpc3BsYXlzIHNuaXBwZXRzIGFib3ZlIHRlcm4gc3VnZ2VzdGlvbnMuIFJlcXVpcmVzIGEgcmVzdGFydC4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBvcmRlcjogNVxuICB9LFxuICB1c2VTbmlwcGV0c0FuZEZ1bmN0aW9uOiB7XG5cbiAgICB0aXRsZTogJ0Rpc3BsYXkgYm90aCwgYXV0b2NvbXBsZXRlLXNuaXBwZXRzIGFuZCBmdW5jdGlvbiBuYW1lJyxcbiAgICBkZXNjcmlwdGlvbjogJ0Nob29zZSB0byBqdXN0IGNvbXBsZXRlIHRoZSBmdW5jdGlvbiBuYW1lIG9yIGV4cGFuZCB0aGUgc25pcHBldCcsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIG9yZGVyOiA2XG4gIH0sXG4gIGlubGluZUZuQ29tcGxldGlvbjoge1xuXG4gICAgdGl0bGU6ICdEaXNwbGF5IGlubGluZSBzdWdnZXN0aW9ucyBmb3IgZnVuY3Rpb24gcGFyYW1zJyxcbiAgICBkZXNjcmlwdGlvbjogJ0Rpc3BsYXlzIGEgaW5saW5lIHN1Z2dlc3Rpb24gbG9jYXRlZCByaWdodCBuZXh0IHRvIHRoZSBjdXJyZW50IGN1cnNvcicsXG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IHRydWUsXG4gICAgb3JkZXI6IDdcbiAgfSxcbiAgaW5saW5lRm5Db21wbGV0aW9uRG9jdW1lbnRhdGlvbjoge1xuXG4gICAgdGl0bGU6ICdEaXNwbGF5IGlubGluZSBzdWdnZXN0aW9ucyB3aXRoIGFkZGl0aW9uYWwgZG9jdW1lbnRhdGlvbiAoaWYgYW55KScsXG4gICAgZGVzY3JpcHRpb246ICdBZGRzIGRvY3VtZW50YXRpb24gdG8gdGhlIGlubGluZSBmdW5jdGlvbiBjb21wbGV0aW9uJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgb3JkZXI6IDhcbiAgfSxcbiAgZG9jdW1lbnRhdGlvbjoge1xuXG4gICAgdGl0bGU6ICdEb2N1bWVudGF0aW9uJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gaW5jbHVkZSBkb2N1bWVudGF0aW9uIHN0cmluZyAoaWYgZm91bmQpIGluIHRoZSByZXN1bHQgZGF0YS4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiA5XG4gIH0sXG4gIHVybHM6IHtcblxuICAgIHRpdGxlOiAnVXJsJyxcbiAgICBkZXNjcmlwdGlvbjogJ1doZXRoZXIgdG8gaW5jbHVkZSBkb2N1bWVudGF0aW9uIHVybHMgKGlmIGZvdW5kKSBpbiB0aGUgcmVzdWx0IGRhdGEuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogMTBcbiAgfSxcbiAgb3JpZ2luczoge1xuXG4gICAgdGl0bGU6ICdPcmlnaW4nLFxuICAgIGRlc2NyaXB0aW9uOiAnV2hldGhlciB0byBpbmNsdWRlIG9yaWdpbnMgKGlmIGZvdW5kKSBpbiB0aGUgcmVzdWx0IGRhdGEuJyxcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogdHJ1ZSxcbiAgICBvcmRlcjogMTFcbiAgfSxcbiAgdGVyblNlcnZlckdldEZpbGVBc3luYzoge1xuXG4gICAgdGl0bGU6ICdUZXJuIFNlcnZlciBnZXRGaWxlIGFzeW5jJyxcbiAgICBkZXNjcmlwdGlvbjogJ0luZGljYXRlcyB3aGV0aGVyIGdldEZpbGUgaXMgYXN5bmNocm9ub3VzLiBEZWZhdWx0IGlzIHRydWUuIFJlcXVpcmVzIGEgcmVzdGFydC4nLFxuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiB0cnVlLFxuICAgIG9yZGVyOiAxMlxuICB9LFxuICB0ZXJuU2VydmVyRGVwZW5kZW5jeUJ1ZGdldDoge1xuXG4gICAgdGl0bGU6ICdUZXJuIFNlcnZlciBkZXBlbmRlbmN5LWJ1ZGdldCcsXG4gICAgZGVzY3JpcHRpb246ICdodHRwOi8vdGVybmpzLm5ldC9kb2MvbWFudWFsLmh0bWwjZGVwZW5kZW5jeV9idWRnZXQuIFJlcXVpcmVzIGEgcmVzdGFydC4nLFxuICAgIHR5cGU6ICdudW1iZXInLFxuICAgIGRlZmF1bHQ6IDIwMDAwLFxuICAgIG9yZGVyOiAxM1xuICB9XG59O1xuIl19