var debug = require('debug')('ws-bus')
var Socket = require('./socket')
var EventEmitter = require('events').EventEmitter
var util = require('./util')

/**
 * Message bus client
 * @param {Object} opts
 * @param {string} opts.url BUS url to connect to, default to localhost
 * @param {string} opts.namespace namespace for messaging
 */
var Client = function(options) {
  if (typeof(options) === 'string') {
    var ns = options;
    options = {};
    options.namespace = ns;
  }
  else if (!options) {
    options = {};
  }

  this.namespace = options.namespace || 'global:';
  this.url = options.url || 'ws://localhost:12046';

  this.socket = new Socket(this.url, null, options)
  this.subscriptions = {}

  this.emitter = new EventEmitter()

  this.socket.onmessage = this._onMessage.bind(this)
  this.socket.onreconnect = this._onReconnect.bind(this)

  this.methods = {};
  this.rpc_id = 0;
}

Client.prototype.publish = function(channel, message) {
  var data = {
    type: 'message',
    channel: channel,
    data: message
  }

  this._send(data)
}

Client.prototype.subscribe = function(channel, cb) {
  var data = {
    type: 'subscribe',
    subscriptions: [channel]
  }
  this._send(data)
  this._subscribe(channel, cb)
}

Client.prototype.unsubscribe = function(channel, cb) {
  var data = {
    type: 'subscribe',
    subscriptions: [channel]
  }
  this._send(data)
  this._unsubscribe(channel)

  cb && cb()
}

Client.prototype.unsubscribeAll = function() {
  for (var channel in this.subscriptions) {
    var counter = this.subscriptions[channel]

    for (var i = 0; i < counter; i++) this.unsubscribe(channel)
  }
}

Client.prototype.expose = function(function_name, fn) {
  var self = this;

  this.subscribe(this.namespace + function_name, function(packet) {
    var data = packet.data;
    var rpc_id = packet.rpc_id;

    return fn(data, function(_data) {
      self.publish(self.namespace + function_name + ':' + rpc_id, _data);
    });
  });
};

Client.prototype.call = function(function_name, data, cb) {
  var self = this;
  if (typeof(data) == 'function') cb = data;

  this.rpc_id++;
  this.publish(this.namespace + function_name, {
    data : data,
    rpc_id : this.rpc_id
  });
  var ns = self.namespace + function_name + ':' + this.rpc_id;
  this.subscribe(ns, function(_data) {
    self.unsubscribe(ns);
    return cb(_data);
  });
};

Client.prototype.close = function(code, reason) {
  this.socket.close(code, reason)
}

Client.prototype._send = function(message) {
  var data = JSON.stringify(message)
  this.socket.send(data)
}

Client.prototype._subscribe = function(channel, cb) {
  this.subscriptions[channel] = this.subscriptions[channel] || 0
  this.subscriptions[channel] += 1
  this.emitter.on(channel, cb)
}

Client.prototype._unsubscribe = function(channel) {
  this.subscriptions[channel] = this.subscriptions[channel] || 0
  this.subscriptions[channel] -= 1

  if (this.subscriptions[channel] > 0) return
  this.emitter.removeAllListeners(channel)
}

Client.prototype._onMessage = function(data) {
  var message = util.parseMessage(data.data)
  debug('message %O', message)
  this.emitter.emit(message.channel, message.data)
}

Client.prototype._onReconnect = function() {
  debug('reconnect')
  var subs = []

  for (var channel in this.subscriptions) {
    if (this.subscriptions[channel] <= 0) continue
    subs.push(channel)
  }

  var data = {
    type: 'subscribe',
    subscriptions: subs
  }

  this._send(data)
  this.emitter.emit('reconnect')
}

module.exports = Client
