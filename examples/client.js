var spiderlink = require('..')();

spiderlink.subscribe('event:toto', (message) => {
  console.log('message:', message)
})

setInterval(() => {
  spiderlink.publish('channel1', {name: 'hello'})
}, 1000)
