const bus = require('..')

const client = bus.createClient()

client.subscribe('channel2', (message) => {
  console.log('message:', message)
})

setInterval(() => {
  client.publish('channel2', {name: 'hello'})
}, 1000)
