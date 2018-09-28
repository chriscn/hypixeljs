const https = require('https');

var api_keys = [],
requestsLastMinute = 0;

const API_URL = 'https://api.hypixel.net/',
keyRegex = /[a-z0-9]{8}-([a-z0-9]{4}-){3}[a-z0-9]{12}/;

function err(message, callback) {
  if (callback) callback(message, null);
  console.log(`HypixelJS Error: ${message}`);
}

var currentKey = 0;
function key() {
  currentKey++;
  if (currentKey == api_keys.length) currentKey = 0;
  return api_keys[currentKey];
}

function addRequest() {
  requestsLastMinute++;
  setTimeout(() => requestsLastMinute--, 60000);
}

function fetchAPI(endpoint, params, focus, callback) {
  var url = `${API_URL}${endpoint}?key=${key()}`;
  if (params) Object.entries(params).forEach(value => url += `&${value[0]}=${value[1]}`);

  var body = '';
  https.get(url, res => {
    res.on('data', data => {
      body += data;
    });

    res.on('end', () => {
      try {
        var json = JSON.parse(body);

        if (json.success == false) return callback(`Hypixel API Error: ${json.cause}`);
        if (focus) {
          if (json[focus] == null) return callback('Hypixel API Error: Query not found');
          json = json[focus];
        }
        addRequest();
        return callback(null, json);
      } catch (err) {
        return callback(`HypixelJS Error: ${err}`, null);
      }
    });
  });
}

module.exports = {
  login: (keys, callback) => {
    if (typeof keys == 'object') api_keys = keys;
    else if (typeof keys == 'string') api_keys = [keys];
    else return err('Field \'keys\' must be a string or array of strings', callback);
    var allValid = true;
    api_keys.forEach(key => {if (!keyRegex.test(key)) {
      allValid = false;
      return err(`Invalid API key: \'${key}\'`, callback);
    }});
    if (allValid) callback ? callback(null, api_keys) : console.log(`Using API keys: \'${api_keys.join('\', \'')}\'`);
  },

  recentRequests: () => {
    return requestsLastMinute;
  },

  playersOnline: callback => fetchAPI('playerCount', null, 'playerCount', callback),

  watchdog: callback => fetchAPI('watchdogstats', null, null, callback),

  findGuild: {
    byName: (name, callback) => fetchAPI('findGuild', {byName: name}, 'guild', callback),
    byPlayerUuid: (uuid, callback) => fetchAPI('findGuild', {byUuid: uuid}, 'guild', callback),
  },

  getGuild: {
    byName: (name, callback) => fetchAPI('guild', {name: name}, 'guild', callback),
    byId: (id, callback) => fetchAPI('guild', {id: id}, 'guild', callback)
  },

  getPlayer: {
    byName: (name, callback) => fetchAPI('player', {name: name}, 'player', callback),
    byUuid: (uuid, callback) => fetchAPI('player', {uuid: uuid}, 'player', callback)
  },

  getSession: (uuid, callback) => fetchAPI('session', {uuid: uuid}, 'session', callback),

  getLeaderboards: callback => fetchAPI('leaderboards', null, 'leaderboards', callback),

  getFriends: (uuid, callback) => fetchAPI('friends', {uuid: uuid}, 'records', callback),

  getBoosters: callback => fetchAPI('boosters', null, 'boosters', callback)
}
