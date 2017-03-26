var Client = require('./lib/client');
var Server = require('./lib/server');

var Bus = {
  clients : [],
  createClient: function(options) {
    if (typeof(options) === 'string') {
      var ns = options;
      options = {};
      options.namespace = ns;
    }
    else if (!options) {
      options = {
        namespace : 'global:'
      };
    }

    if (!options.namespace)
      options.namespace = 'global:';

    if (!this.clients[options.namespace] || options.forceNew === true) {
      var client = new Client(options);
      this.clients[options.namespace] = client;
      return client;
    }

    return this.clients[options.namespace];
  },
  createServer: function(options) {
    return new Server(options)
  }
}

module.exports = Bus;
