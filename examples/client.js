var bus = require('..')

var client = bus.createClient()

client.subscribe('channel1', (message) => {
  console.log('message:', message)
})

setInterval(() => {
  client.publish('channel1', {name: 'hello'})
}, 1000)
