/**
 * Kids Node.js client.
 */
'use strict';

const debug = require('debug')('kids');
const redis = require('redis');

class Kids {
  /**
   * Create a kids instance.
   * @param  {number} port  Kids server port
   * @param  {number} host  Kids server host
   * @param  {string} topic Publish topic
   */
  constructor(port, host, topic) {
    this.port = port || 3388;
    this.host = host || "localhost";

    if (process.env.ZHIHU_DOCKER_HOST) {
      this.host = process.env.ZHIHU_DOCKER_HOST;
    }

    this.client = null;
    this.connected = false;
    this.topic = topic || "kids";
  }

  /**
   * Connect to kids server.
   * @private
   */
  connect() {
    var that = this;
    if (!this.connected) {
      this.client = redis.createClient({
        port: this.port,
        host: this.host,
        no_ready_check: true
      });
      this.connected = true;

      let old_on_info_cmd = this.client.on_info_cmd;
      this.client.on_info_cmd = (req, res) => {
        old_on_info_cmd.call(this.client, req, res + 'redis_version:2.6\r\n');
      };

      this.client.once('error', (err) => {
        debug(err);
        this.client.end();
        this.connected = false;
      });
    }
  }

  /**
   * Publish message to kids server.
   * @public
   * @param  {any} message any type
   */
  publish(message) {
    this.connect();
    this.client.publish(this.topic, message);
  }
}

module.exports = Kids;
