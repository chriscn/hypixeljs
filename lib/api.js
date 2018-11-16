const https = require('https');
const util = require('util');

const API_URL = 'https://api.hypixel.net/';
const keyRegex = /[a-z0-9]{8}-(?:[a-z0-9]{4}-){3}[a-z0-9]{12}/;

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
function login(keys) {
	return new Promise((resolve, reject) => {
		let formatedKeys;
		switch(typeof keys) {
		case 'object':
			formatedKeys = keys;
			break;
		case 'string':
			formatedKeys = [keys];
			break;
		default:
			reject('Argument 0 (\'keys\') must be a string or an array of strings');
		}

		const validKeys = formatedKeys.filter(key=>keyRegex.test(key));

		if(validKeys.length === 0) {
			reject('No valid keys');
		}

		api_keys = validKeys;
		console.log(`Using API keys: ${util.inspect(api_keys).slice(2, -2)}`);
		resolve(api_keys);
	});
}

function APICall(endpoint, focus, params) {
	return new Promise((resolve, reject) => {
		const query = (params == null) ? '' : Object.entries(params).map(param => `&${param[0]}=${encodeURIComponent(param[1])}`).join('');
		const key = getKey();
		if(!key) {
			reject('No API Key Specified');
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
						reject(`Hypixel API Error: ${response.cause}`);
					}

					if (focus) {
						if(!response.hasOwnProperty(focus)) {
							reject('Hypixel API Error: Query not found');
						}
						response = response[focus];
					}

					increaseRequestCounter();

					resolve(response);
				} catch (err) {
					reject(err);
				}
			});
		});
	});
}

module.exports = {
	login: (keys) => login(keys),

	get recentRequests() {
		return requestsLastMinute;
	},

	playersOnline: () => APICall('playerCount', 'playerCount', null),
	watchdog: () => APICall('watchdogstats', null, null),

	findGuild: {
		byName: (name) => APICall('findGuild', 'guild', { byName: name }),
		byPlayerUuid: (uuid) => APICall('findGuild', 'guild', { byUuid: uuid }),
	},

	getGuild: {
		byName: (name) => APICall('guild', 'guild', { name: name }),
		byId: (id) => APICall('guild', 'guild', { id: id }),
	},

	getPlayer: {
		byName: (name) => APICall('player', 'player', { name: name }),
		byUuid: (uuid) => APICall('player', 'player', { uuid: uuid }),
	},

	getSession: (uuid) => APICall('session', 'session', { uuid: uuid }),
	getFriends: (uuid) => APICall('friends', 'records', { uuid: uuid }),

	getBoosters: () => APICall('boosters', 'boosters', null),
	getLeaderboards: () => APICall('leaderboards', 'leaderboards', null),
};
