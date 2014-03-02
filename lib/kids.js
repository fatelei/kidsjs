// connect to kids server

var redis = require("redis");

function Kids (port, host, topic) {
	this.port = port || 3388;
	this.host = host || "localhost";
	this.client = null;
	this.topic = topic || "kids";
}

exports.Kids = Kids;

Kids.prototype.connect = function () {
	var that = this;
	if (!that.client) {
		that.client = redis.createClient(this.port, this.host);
		var old_on_info_cmd = that.client.on_info_cmd;
  	that.client.on_info_cmd = function (req, res) {
    	old_on_info_cmd.call(that.client, req, res + 'redis_version:2.6\r\n');
  	};
		that.client.on("error", function (err) {
			console.log(err);
			that.client.end();
			that.client = null;
		});
	}
};

Kids.prototype.publish = function (message) {
	var that = this;
	that.connect();
	if (that.client) {
		that.client.publish(that.topic, message);
	}
};
