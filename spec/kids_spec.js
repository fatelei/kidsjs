/**
 * Kids tests.
 */
'use strict';

const redis = require('redis');
const logging = require('../index');

describe('Kids tests', () => {
  describe('Test without kids server', () => {
    it('log info level message', () => {
      logging.info('test');
    });
    it('log warn level message', () => {
      logging.warn('test');
    });
    it('log debug level message', () => {
      logging.debug('test');
    });
    it('log error level message', () => {
      logging.error('test');
    });
  });

  describe('Test with kids server', () => {
    describe('start tests', () => {
      it('should publish message ok', (done) => {
        let testClient = redis.createClient({
          no_ready_check: true
        });
        testClient.on('message', (channel, message) => {
          console.log('sdsd');
          expect(channel).toBe('test');
          testClient.end();
          done();
        });
        testClient.subscribe('test');
        logging.enableKids({
          port: 6379,
          host: 'localhost',
          topic: 'test'
        });
        logging.info('hehe');
      });
    });
  });
});