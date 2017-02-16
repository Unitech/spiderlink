var debug = require('debug')('ws-bus')
var extend = require('util')._extend;

exports.parseMessage = function(data) {
  var message = {}

  try {
    message = JSON.parse(data)
  } catch (e) {
    debug('error parsing message:', data)
  }
  return message;
}

exports.merge = function(def, options) {
  return extend(def, options);
}
