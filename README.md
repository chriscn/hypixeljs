# hypixeljs
A simple library for easily accessing the Hypixel API in NodeJS. 
**NOTE: Forgive me for the poor markdown, I'm still learning).**

## Installing
`npm i hypixeljs`

## Usage
To get started with this package, you'll need to set your API key(s). You can do so with the following:
```javascript
const hypixel = require('hypixeljs');

hypixel.login('xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
//Can also take an array of keys which get cycled through per request
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
