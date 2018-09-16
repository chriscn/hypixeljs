const p = require('phin');

var api_keys = [];

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

function fetchAPI(endpoint, params, focus, callback) {
  var url = `${API_URL}${endpoint}?key=${key()}`;
  if (params) Object.entries(params).forEach(value => url += `&${value[0]}=${value[1]}`);

  p(url, (err, res) => {
    if (err) return callback(`HypixelJS Error: ${err}`, null);
    try {
      var buffer = JSON.parse(JSON.stringify(res.body)),
      json = '';

      buffer.data.forEach(dec => json += String.fromCharCode(dec));
      json = JSON.parse(json);

      if (json.success == false) return callback(`Hypixel API Error: ${json.cause}`);
      if (focus) {
        if (json[focus] == null) return callback('Hypixel API Error: Query not found');
        json = json[focus];
      }
      return callback(null, json);
    } catch (err) {
      return callback('HypixelJS Error: Invalid JSON', null);
    }
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

  getSession: (uuid, callback) => fetchAPI('session', {uuid: uuid}, null, callback),

  getLeaderboards: callback => fetchAPI('leaderboards', null, null, callback),

  getFriends: (uuid, callback) => fetchAPI('friends', {uuid: uuid}, 'records', callback),

  getBoosters: callback => fetchAPI('boosters', null, 'boosters', callback)
}
