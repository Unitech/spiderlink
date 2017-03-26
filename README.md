# pm2-pubsub

Based on WS (UWS compatible)

## Usage

Server:

```js
require('pm2-pubsub')({ server : true })
```

Client:

### PUB/SUB

```js
var bus = require('pm2-pubsub')('namespace');

bus.subscribe('channel1', (message) => {
  console.log('message:', message)
})

bus.publish('channel1', { some : 'data' });
```

### RPC

Service #1:

```js
var bus = require('pm2-pubsub')('namespace');

bus.expose('myfunction', function(data, done) {
  // some processing
  return done({ success : true, my : 'data' });
});
```

Consumer #1:

```js
var bus = require('pm2-pubsub')('namespace');

bus.call('testfunction', { some : 'data'}, function(data) {
   // data = result
});
```

## License

MIT
