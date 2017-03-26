
var should = require('should');

describe('Client testing', function() {
  var server;
  var client1;
  var client2;

  it('should initialize server', function() {
    server = require('..')({ server: true });
  });

  it('should create client', function() {
    client1 = require('..')('global');
  });

  it('should create second client', function() {
    client2 = require('..')({ namespace : 'global', forceNew : true });
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
