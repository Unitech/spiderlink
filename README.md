# pm2-pubsub

Based on WS (UWS compatible)

Install module:

```bash
$ pm2 install pm2-pubsub
```

Then expose some function in app1:

```js
var app = require('pm2-pubsub')('namespace');

app.expose('myfunction', function(data, done) {
  // some processing
  return done({ success : true, my : data });
});
```

On app2 call remote function:

```js
var app = require('pm2-pubsub')('namespace');

app.call('myfunction', { some : 'data'}, function(data) {
   // data = result
});
```

### PUB/SUB

```bash
$ npm install pm2-pubsub
```

```js
var app = require('pm2-pubsub')('namespace');

app.subscribe('channel1', (message) => {
  console.log('message:', message)
})

app.publish('channel1', { some : 'data' });
```

## License

MIT
