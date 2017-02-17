
var pmx = require('pmx');
var Probe = pmx.probe();

exports.serverProbes = function() {
  var probes = {};

  probes.clients_connected = Probe.counter({
    name    : 'Clients Conn.'
  });

  probes.messages_per_min = Probe.meter({
    name : 'msg/min',
    timeframe : 60,
    samples : 60
  });

  return probes;
}
