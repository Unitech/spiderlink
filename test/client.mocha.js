
var should = require('should');

var bus = require('..');

describe('Client testing', function() {
  var server;
  var client1;
  var client2;

  it('should initialize server', function() {
    bus.createServer();
  });

  it('should create client', function() {
    client1 = bus.createClient({ forceNew : true });
  });

  it('should create second client', function() {
    client2 = bus.createClient({ forceNew : true });
  });

  describe('Basic messaging', function() {
    afterEach(function() {
      client1.unsubscribeAll();
      client2.unsubscribeAll();
    });

    it('should client1 send message to client2', function(done) {
      client1.subscribe('test1', function(data) {
        should(data.that).eql('data');
        done();
      });

      client2.publish('test1', { that : 'data' });
    });

    it('should client2 send message without response', function() {
      client2.publish('test1', { that : 'data' });
    });
  });

  describe('Basic RPC', function() {
    it('should expose function and call via RPC', function(done) {
      client1.expose('testfunction', function(data, reply) {
        return reply({done : true, raw : data});
      });

      client2.call('testfunction', { some : 'data'}, function(data) {
        should(data.raw.some).eql('data');
        done();
      });
    });
  });

});
