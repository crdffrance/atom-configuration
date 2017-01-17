Object.defineProperty(exports, '__esModule', {
  value: true
});
/** @babel */

var Config = atom.config;
var ua = require('universal-analytics');
var trackingId = 'UA-47544457-3';

var user = null;

function getUser() {
  var userId = atom.config.get("git-plus.general._analyticsUserId");
  if (!atom.config.get("git-plus.general._analyticsUserId")) {
    userId = require("uuid").v4();
    atom.config.set("git-plus.general._analyticsUserId", userId);
  }
  if (user === null) {
    user = ua(trackingId, userId, {
      headers: {
        "User-Agent": navigator.userAgent
      }
    });
  }
  return user;
}

function trackBooleanConfigIsOn(name) {
  getUser().event('Config', 'ON', name, { anonymizeIp: true }).send();
}

function trackBooleanConfigIsOff(name) {
  getUser().event('Config', 'OFF', name, { anonymizeIp: true }).send();
}

function trackIntConfigIsOn(name, value) {
  getUser().event('Config', 'ON', name, value, { anonymizeIp: true }).send();
}

function trackStringConfig(name, value) {
  getUser().event('Config', 'ON', name + ':' + value, { anonymizeIp: true }).send();
}

function trackConfig(name, value) {
  if (parseInt(value) >= 0) {
    trackIntConfigIsOn(name, value);
  } else if (value === true) {
    trackBooleanConfigIsOn(name);
  } else if (value === false) {
    trackBooleanConfigIsOff(name);
  } else if (value.charAt) {
    trackStringConfig(name, value);
  }
}

function track(name) {
  var configKey = 'git-plus.' + name;
  var config = Config.get(configKey);
  var schema = Config.getSchema(configKey);
  if (configKey === 'git-plus.general._analyticsUserId') return;
  if (schema.type === 'object') {
    Object.keys(schema.properties).forEach(function (property) {
      return track(name + '.' + property);
    });
  } else {
    trackConfig(configKey, config);
  }
}

// function trackConfigChanged(name, {oldValue, newValue}) {
//   getUser().event('Config', 'CHANGED', name, {anonymizeIp: true}).send()
// }

exports['default'] = function () {
  var userConfigs = Config.getAll('git-plus')[0];
  userConfigs = userConfigs.value;
  Object.keys(userConfigs).forEach(track);
  // Object.keys(userConfigs).forEach(config => {
  //   atom.config.onDidChange(`git-plus.${config}`, event => trackConfigChanged(name, event))
  // })
};

module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2FuYWx5dGljcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUVBLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUE7QUFDMUIsSUFBTSxFQUFFLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUE7QUFDekMsSUFBTSxVQUFVLEdBQUcsZUFBZSxDQUFBOztBQUVsQyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUE7O0FBRWYsU0FBUyxPQUFPLEdBQUc7QUFDakIsTUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtBQUNqRSxNQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsbUNBQW1DLENBQUMsRUFBRTtBQUN6RCxVQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzdCLFFBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLE1BQU0sQ0FBQyxDQUFBO0dBQzdEO0FBQ0QsTUFBSSxJQUFJLEtBQUssSUFBSSxFQUFFO0FBQ2pCLFFBQUksR0FBRyxFQUFFLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRTtBQUM1QixhQUFPLEVBQUU7QUFDUCxvQkFBWSxFQUFFLFNBQVMsQ0FBQyxTQUFTO09BQ2xDO0tBQ0YsQ0FBQyxDQUFBO0dBQ0g7QUFDRCxTQUFPLElBQUksQ0FBQTtDQUNaOztBQUVELFNBQVMsc0JBQXNCLENBQUMsSUFBSSxFQUFFO0FBQ3BDLFNBQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0NBQ2xFOztBQUVELFNBQVMsdUJBQXVCLENBQUMsSUFBSSxFQUFFO0FBQ3JDLFNBQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxFQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFBO0NBQ25FOztBQUVELFNBQVMsa0JBQWtCLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRTtBQUN2QyxTQUFPLEVBQUUsQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLEVBQUMsV0FBVyxFQUFFLElBQUksRUFBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUE7Q0FDekU7O0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ3RDLFNBQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFLLElBQUksU0FBSSxLQUFLLEVBQUksRUFBQyxXQUFXLEVBQUUsSUFBSSxFQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQTtDQUNoRjs7QUFFRCxTQUFTLFdBQVcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFO0FBQ2hDLE1BQUksUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN4QixzQkFBa0IsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUE7R0FDaEMsTUFDSSxJQUFJLEtBQUssS0FBSyxJQUFJLEVBQUU7QUFDdkIsMEJBQXNCLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDN0IsTUFDSSxJQUFJLEtBQUssS0FBSyxLQUFLLEVBQUU7QUFDeEIsMkJBQXVCLENBQUMsSUFBSSxDQUFDLENBQUE7R0FDOUIsTUFDSSxJQUFJLEtBQUssQ0FBQyxNQUFNLEVBQUU7QUFDckIscUJBQWlCLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFBO0dBQy9CO0NBQ0Y7O0FBRUQsU0FBUyxLQUFLLENBQUMsSUFBSSxFQUFFO0FBQ25CLE1BQU0sU0FBUyxpQkFBZSxJQUFJLEFBQUUsQ0FBQTtBQUNwQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO0FBQ3BDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUE7QUFDMUMsTUFBSSxTQUFTLEtBQUssbUNBQW1DLEVBQUUsT0FBTTtBQUM3RCxNQUFJLE1BQU0sQ0FBQyxJQUFJLEtBQUssUUFBUSxFQUFFO0FBQzVCLFVBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFBLFFBQVE7YUFBSSxLQUFLLENBQUksSUFBSSxTQUFJLFFBQVEsQ0FBRztLQUFBLENBQUMsQ0FBQTtHQUNqRixNQUNJO0FBQ0gsZUFBVyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQTtHQUMvQjtDQUNGOzs7Ozs7cUJBTWMsWUFBVztBQUN4QixNQUFJLFdBQVcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzlDLGFBQVcsR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFBO0FBQy9CLFFBQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFBOzs7O0NBSXhDIiwiZmlsZSI6Ii9ob21lL2pvY2VseW4vLmF0b20vcGFja2FnZXMvZ2l0LXBsdXMvbGliL2FuYWx5dGljcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKiBAYmFiZWwgKi9cblxuY29uc3QgQ29uZmlnID0gYXRvbS5jb25maWdcbmNvbnN0IHVhID0gcmVxdWlyZSgndW5pdmVyc2FsLWFuYWx5dGljcycpXG5jb25zdCB0cmFja2luZ0lkID0gJ1VBLTQ3NTQ0NDU3LTMnXG5cbmxldCB1c2VyID0gbnVsbFxuXG5mdW5jdGlvbiBnZXRVc2VyKCkge1xuICBsZXQgdXNlcklkID0gYXRvbS5jb25maWcuZ2V0KFwiZ2l0LXBsdXMuZ2VuZXJhbC5fYW5hbHl0aWNzVXNlcklkXCIpXG4gIGlmICghYXRvbS5jb25maWcuZ2V0KFwiZ2l0LXBsdXMuZ2VuZXJhbC5fYW5hbHl0aWNzVXNlcklkXCIpKSB7XG4gICAgdXNlcklkID0gcmVxdWlyZShcInV1aWRcIikudjQoKVxuICAgIGF0b20uY29uZmlnLnNldChcImdpdC1wbHVzLmdlbmVyYWwuX2FuYWx5dGljc1VzZXJJZFwiLCB1c2VySWQpXG4gIH1cbiAgaWYgKHVzZXIgPT09IG51bGwpIHtcbiAgICB1c2VyID0gdWEodHJhY2tpbmdJZCwgdXNlcklkLCB7XG4gICAgICBoZWFkZXJzOiB7XG4gICAgICAgIFwiVXNlci1BZ2VudFwiOiBuYXZpZ2F0b3IudXNlckFnZW50XG4gICAgICB9XG4gICAgfSlcbiAgfVxuICByZXR1cm4gdXNlclxufVxuXG5mdW5jdGlvbiB0cmFja0Jvb2xlYW5Db25maWdJc09uKG5hbWUpIHtcbiAgZ2V0VXNlcigpLmV2ZW50KCdDb25maWcnLCAnT04nLCBuYW1lLCB7YW5vbnltaXplSXA6IHRydWV9KS5zZW5kKClcbn1cblxuZnVuY3Rpb24gdHJhY2tCb29sZWFuQ29uZmlnSXNPZmYobmFtZSkge1xuICBnZXRVc2VyKCkuZXZlbnQoJ0NvbmZpZycsICdPRkYnLCBuYW1lLCB7YW5vbnltaXplSXA6IHRydWV9KS5zZW5kKClcbn1cblxuZnVuY3Rpb24gdHJhY2tJbnRDb25maWdJc09uKG5hbWUsIHZhbHVlKSB7XG4gIGdldFVzZXIoKS5ldmVudCgnQ29uZmlnJywgJ09OJywgbmFtZSwgdmFsdWUsIHthbm9ueW1pemVJcDogdHJ1ZX0pLnNlbmQoKVxufVxuXG5mdW5jdGlvbiB0cmFja1N0cmluZ0NvbmZpZyhuYW1lLCB2YWx1ZSkge1xuICBnZXRVc2VyKCkuZXZlbnQoJ0NvbmZpZycsICdPTicsIGAke25hbWV9OiR7dmFsdWV9YCwge2Fub255bWl6ZUlwOiB0cnVlfSkuc2VuZCgpXG59XG5cbmZ1bmN0aW9uIHRyYWNrQ29uZmlnKG5hbWUsIHZhbHVlKSB7XG4gIGlmIChwYXJzZUludCh2YWx1ZSkgPj0gMCkge1xuICAgIHRyYWNrSW50Q29uZmlnSXNPbihuYW1lLCB2YWx1ZSlcbiAgfVxuICBlbHNlIGlmICh2YWx1ZSA9PT0gdHJ1ZSkge1xuICAgIHRyYWNrQm9vbGVhbkNvbmZpZ0lzT24obmFtZSlcbiAgfVxuICBlbHNlIGlmICh2YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICB0cmFja0Jvb2xlYW5Db25maWdJc09mZihuYW1lKVxuICB9XG4gIGVsc2UgaWYgKHZhbHVlLmNoYXJBdCkge1xuICAgIHRyYWNrU3RyaW5nQ29uZmlnKG5hbWUsIHZhbHVlKVxuICB9XG59XG5cbmZ1bmN0aW9uIHRyYWNrKG5hbWUpIHtcbiAgY29uc3QgY29uZmlnS2V5ID0gYGdpdC1wbHVzLiR7bmFtZX1gXG4gIGNvbnN0IGNvbmZpZyA9IENvbmZpZy5nZXQoY29uZmlnS2V5KVxuICBjb25zdCBzY2hlbWEgPSBDb25maWcuZ2V0U2NoZW1hKGNvbmZpZ0tleSlcbiAgaWYgKGNvbmZpZ0tleSA9PT0gJ2dpdC1wbHVzLmdlbmVyYWwuX2FuYWx5dGljc1VzZXJJZCcpIHJldHVyblxuICBpZiAoc2NoZW1hLnR5cGUgPT09ICdvYmplY3QnKSB7XG4gICAgT2JqZWN0LmtleXMoc2NoZW1hLnByb3BlcnRpZXMpLmZvckVhY2gocHJvcGVydHkgPT4gdHJhY2soYCR7bmFtZX0uJHtwcm9wZXJ0eX1gKSlcbiAgfVxuICBlbHNlIHtcbiAgICB0cmFja0NvbmZpZyhjb25maWdLZXksIGNvbmZpZylcbiAgfVxufVxuXG4vLyBmdW5jdGlvbiB0cmFja0NvbmZpZ0NoYW5nZWQobmFtZSwge29sZFZhbHVlLCBuZXdWYWx1ZX0pIHtcbi8vICAgZ2V0VXNlcigpLmV2ZW50KCdDb25maWcnLCAnQ0hBTkdFRCcsIG5hbWUsIHthbm9ueW1pemVJcDogdHJ1ZX0pLnNlbmQoKVxuLy8gfVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgbGV0IHVzZXJDb25maWdzID0gQ29uZmlnLmdldEFsbCgnZ2l0LXBsdXMnKVswXVxuICB1c2VyQ29uZmlncyA9IHVzZXJDb25maWdzLnZhbHVlXG4gIE9iamVjdC5rZXlzKHVzZXJDb25maWdzKS5mb3JFYWNoKHRyYWNrKVxuICAvLyBPYmplY3Qua2V5cyh1c2VyQ29uZmlncykuZm9yRWFjaChjb25maWcgPT4ge1xuICAvLyAgIGF0b20uY29uZmlnLm9uRGlkQ2hhbmdlKGBnaXQtcGx1cy4ke2NvbmZpZ31gLCBldmVudCA9PiB0cmFja0NvbmZpZ0NoYW5nZWQobmFtZSwgZXZlbnQpKVxuICAvLyB9KVxufVxuIl19