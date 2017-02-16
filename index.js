var Client = require('./lib/client')
var Server = require('./lib/server')

module.exports = {
  createClient: function(url, protocols, options) { return new Client(url, protocols, options); },
  createServer: function(options) { return new Server(options) }
}
