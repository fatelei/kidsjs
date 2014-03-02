// kids unit test

var logging = require("../lib/log").Logging;
var redis = require("redis");
var assert = require("assert");

describe("kids", function () {
	var client;
	before(function () {
		logging.add_logging_handler();
		client = redis.createClient(3388, "localhost");
		client.subscribe("kids");
	});
	it("test kids pub/sub", function(done) {
		logging.info("info");
		client.on("message", function (channel, message) {
			assert.deepEqual(message, "info");
			done();
		});
	});
});