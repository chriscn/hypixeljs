const https = require('https');
const util = require('util');

const API_URL = 'https://api.hypixel.net/';
const keyRegex = /[a-z0-9]{8}-(?:[a-z0-9]{4}-){3}[a-z0-9]{12}/;


function handleError(message, callback) {
	if (typeof callback === 'function') callback(message, null);
	console.error(`HypixelJS Error: ${message}`);
}

let currentKey = 0;
function getKey() {
	if(api_keys.length === 0) return null;

	currentKey = currentKey + 1 < api_keys.length ? currentKey + 1 : 0;

	return api_keys[currentKey];
}

let requestsLastMinute = 0;
function increaseRequestCounter() {
	requestsLastMinute++;
	setTimeout(() => requestsLastMinute--, 60 * 1000);
}


let api_keys = [];
function login(keys, callback) {
	let formatedKeys;
	switch(typeof keys) {
	case 'object':
		formatedKeys = keys;
		break;
	case 'string':
		formatedKeys = [keys];
		break;
	default:
		handleError('Argument 0 (\'keys\') must be a string or an array of strings', callback);
		return;
	}


	const validKeys = formatedKeys.filter(key=>keyRegex.test(key));

	if(validKeys.length === 0) {
		handleError('No valid keys', callback);
		return;
	}

	api_keys = validKeys;

	if(typeof callback === 'function') {
		callback(null, api_keys);
	}else{
		console.log(`Using API keys: ${util.inspect(api_keys).slice(2, -2)}`);
	}
}

function APICall(endpoint, focus, params, callback) {
	const query = (params == null) ? '' : Object.entries(params).map(param => `&${param[0]}=${encodeURIComponent(param[1])}`).join('');
	const key = getKey();
	if(!key) {
		handleError('No api keys specified', callback);
		return;
	}
	const url = `${API_URL}${endpoint}?key=${key}${query}`;

	https.get(url, res => {

		let body = '';
		res.on('data', data => {
			body += data;
		});

		res.once('end', () => {
			try {
				let response = JSON.parse(body);

				if (!response.success) {
					handleError(`Hypixel API Error: ${response.cause}`, callback);
					return;
				}

				if (focus) {
					if(!response.hasOwnProperty(focus)) {
						handleError('Hypixel API Error: Query not found', callback);
						return;
					}
					response = response[focus];
				}

				increaseRequestCounter();

				callback(null, response);
			} catch (err) {
				handleError(err, callback);
			}
		});
	});
}

module.exports = {
	login,

	get recentRequests() {
		return requestsLastMinute;
	},

	playersOnline:          (callback) => APICall('playerCount', 'playerCount', null, callback),
	watchdog:               (callback) => APICall('watchdogstats', null, null, callback),

	findGuild: {
		byName:       (name, callback) => APICall('findGuild', 'guild', { byName: name }, callback),
		byPlayerUuid: (uuid, callback) => APICall('findGuild', 'guild', { byUuid: uuid }, callback),
	},

	getGuild: {
		byName: 	  (name, callback) => APICall('guild', 'guild', { name: name }, callback),
		byId:           (id, callback) => APICall('guild', 'guild', { id: id }, callback),
	},

	getPlayer: {
		byName:       (name, callback) => APICall('player', 'player', { name: name }, callback),
		byUuid:       (uuid, callback) => APICall('player', 'player', { uuid: uuid }, callback),
	},

	getSession:       (uuid, callback) => APICall('session', 'session', { uuid: uuid }, callback),
	getFriends:       (uuid, callback) => APICall('friends', 'records', { uuid: uuid }, callback),

	getBoosters:            (callback) => APICall('boosters', 'boosters', null, callback),
	getLeaderboards:        (callback) => APICall('leaderboards', 'leaderboards', null, callback),
};
