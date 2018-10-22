# hypixeljs
A simple, lightweight library for easily accessing the Hypixel API in NodeJS that can loadbalance requests on the fly ensuring you will always have enough.

## Installing
`npm install hypixeljs`

## Usage
To get started with this package, you'll need to set your API key(s). You can do so with the following:
```javascript
const hypixel = require('hypixeljs');

hypixel.login('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
```
This method can also take an array of API keys which requests are evenly divided over.
```javascript
hypixel.login(['xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', 'abcdefgh-ijkl-mnop-qrst-uvwxyz123456']);
```

## Methods


#### `playersOnline(callback)` - Gets the total number of players on the network currently
```javascript
hypixel.playersOnline((err, players) => {
  if (err) return console.log(err);
  console.log(players);
  //16171
});
```

#### `watchdog(callback)` - Gets the current watchdog statistics
```javascript
hypixel.watchdog((err, watchdog) => {
  if (err) return console.log(err);
  console.log(watchdog);
  /*{
    success: true,
    watchdog_lastMinute: 0,
    staff_rollingDaily: 1025,
    watchdog_total: 2556395,
    watchdog_rollingDaily: 4313,
    staff_total: 955316
  }*/
});
```

#### `findGuild.byName(name, callback)` - Fetches a guild's id by guild name
```javascript
hypixel.findGuild.byName('The Flashback', (err, id) => {
  if (err) return console.log(err);
  console.log(id);
  //56bccb6d0cf229d452823596
});
```

#### `findGuild.byPlayerUuid(uuid, callback)` - Fetches a guild's id by a player's uuid
```javascript
hypixel.findGuild.byPlayerUuid('1f403c4916694b7fbb5dac500a490f12', (err, id) => {
  if (err) return console.log(err);
  console.log(id);
  //56bccb6d0cf229d452823596
});
```

#### `getGuild.byName(uuid, callback)` - Gets a guild by its name
```javascript
hypixel.getGuild.byName('The Flashback', (err, guild) => {
  if (err) return console.log(err);
  console.log(guild);
  /*{
    _id: '56bccb6d0cf229d452823596',
    name: 'The Flashback',
    coins: 5458795,
    coinsEver: 7918795,
    created: 1455213421874,
    members: [
      ...
    ]
    ...
  }*/
});
```

#### `getGuild.byId(uuid, callback)` - Gets a guild by its id (returned by findGuild)
```javascript
hypixel.getGuild.byId('56bccb6d0cf229d452823596', (err, guild) => {
  if (err) return console.log(err);
  console.log(guild);
  /*{
    _id: '56bccb6d0cf229d452823596',
    name: 'The Flashback',
    coins: 5458795,
    coinsEver: 7918795,
    created: 1455213421874,
    members: [
      ...
    ]
    ...
  }*/
});
```

#### `getPlayer.byName(name, callback)` - Gets a player by their last known ign
```javascript
hypixel.getPlayer.byName('Dance_Dog', (err, player) => {
  if (err) return console.log(err);
  console.log(player);
  /*{
    "success": true,
    "player": {
      "_id": "58efb42f5d870ddd8a8a0513",
      "uuid": "1f403c4916694b7fbb5dac500a490f12",
      "firstLogin": 1492104239401,
      "playername": "dance_dog",
      "lastLogin": 1537026408019,
      "displayname": "Dance_Dog",
      ...
    }
  }*/
});
```

#### `getPlayer.byUuid(uuid, callback)` - Gets a player by their uuid
```javascript
hypixel.getPlayer.byUuid('1f403c4916694b7fbb5dac500a490f12', (err, player) => {
  if (err) return console.log(err);
  console.log(player);
  /*{
    "success": true,
    "player": {
      "_id": "58efb42f5d870ddd8a8a0513",
      "uuid": "1f403c4916694b7fbb5dac500a490f12",
      "firstLogin": 1492104239401,
      "playername": "dance_dog",
      "lastLogin": 1537026408019,
      "displayname": "Dance_Dog",
      ...
    }
  }*/
});
```

#### `getFriends(uuid, callback)` - Gets a player's friends list
```javascript
hypixel.getFriends('1f403c4916694b7fbb5dac500a490f12', (err, friends) => {
  if (err) return console.log(err);
  console.log(friends);
  /*[
    {
      _id: '599086190cf283d72d95d99b',
      uuidSender: '1f403c4916694b7fbb5dac500a490f12',
      uuidReceiver: '24cfeb4fa35a45bfa15bbcf9de7f1566',
      started: 1502643737775
    },
    {
      _id: '59c95cfe0cf263459753730c',
      uuidSender: '1f403c4916694b7fbb5dac500a490f12',
      uuidReceiver: '04d62da71f594c22807018f6f2407372',
      started: 1506368766705
    },
    ...
  ]*/
});
```

#### `getSession(uuid, callback)` - Gets a player's session (not accurate for determining online status)
```javascript
hypixel.getSession('1f403c4916694b7fbb5dac500a490f12', (err, session) => {
  if (err) return console.log(err);
  console.log(session);
  /*{
    _id: '5b9e819cc8f2f61d6208b074',
    gameType: 'ARCADE',
    server: 'mini54F',
    players: [
      '1f403c4916694b7fbb5dac500a490f12',
      '3c388255e23d4c1eb9ebe391386cc425',
      'd8d179a983d14ff9924ba859e0887172'
    ]
  }*/
});
```

#### `getLeaderboards(callback)` - Fetches the current leaderboards
```javascript
hypixel.getLeaderboards((err, leaderboards) => {
  if (err) return console.log(err);
  console.log(leaderboards);
  /*{
    TNTGAMES: [
      {
        path: 'wins_tntrun',
        prefix: 'Overall',
        count: 10,
        location: '-2554,57,715',
        leaders: [Array],
        title: 'TNT Run Wins'
      },
      {
        path: 'wins_pvprun',
        prefix: 'Overall',
        count: 10,
        location: '-2554,56,715',
        leaders: [Array],
        title: 'PVP Run Wins'
      },
    ]
  }*/
});
```

#### `getBoosters(callback)` - Fetches active boosters
```javascript
hypixel.getBoosters((err, boosters) => {
  if (err) return console.log(err);
  console.log(boosters);
  /*[
    {
      _id: '5b9e25b9c8f2161158294189',
      purchaserUuid: 'f54c52dad35e4af99da666568936f72f',
      amount: 2,
      originalLength: 3600,
      length: 3363,
      gameType: 20,
      dateActivated: 1537108535739
    },
    {
      _id: '5b98014dc8f216115829373e',
      purchaserUuid: '77c6936d0b88455db337381548b1bd7c',
      amount: 2,
      originalLength: 3600,
      length: 989,
      gameType: 56,
      dateActivated: 1537113530168
    },
    ...
  ]*/
});
```

#### `recentRequests` - Gets the amount of requests used in the last minute.
```js
hypixel.recentRequests;
```

## Authors
Created by **Thorin / Chris** with the help of [DanceDog](https://github.com/Dance-Dog/)
