# pm2-bus

Based on WS (UWS compatible)

## Usage

Server:

```js
var bus = require('pm2-bus')

bus.createServer()
```

Client:

### PUB/SUB

```js
var bus = require('pm2-bus')
var client = bus.createClient()

client.subscribe('channel1', (message) => {
  console.log('message:', message)
})

client.publish('channel1', { some : 'data' });
```

### RPC

Service #1:

```js
var bus = require('pm2-bus')
var client = bus.createClient()

client.expose('myfunction', function(data, done) {
  // some processing
  return done({ success : true, my : 'data' });
});
```

Consumer #1:

```js
var bus = require('pm2-bus')
var client = bus.createClient()


client2.call('testfunction', { some : 'data'}, function(data) {
   // data = result
});
```

## License

MIT
