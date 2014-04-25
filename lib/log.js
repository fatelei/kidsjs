// logging

var Kids = require("./kids").Kids;
var os = require("os");
var util = require("util");
var dateFormat = require("dateformat");

levels = {
  warn: "W",
  info: "I",
  error: "E",
  debug: "D"
};

function Logging () {}

exports.Logging = Logging;

Logging.add_logging_handler = function (config, topic) {
  var that = this;
  
  if (that.handler === undefined) {
    var config = config || {};
    var kids = new Kids(config.port, config.host, topic);
    var that = this;
    that.handler = kids;
  }
};

Logging.find_module_lineno = function () {
  var error = new Error();
  var stack = error.stack.split("\n");
  var r = /.*\/(.*?)\.\w+:(\d+):/;
  var package_name = "unknown";
  var lineno = 0;
  var isLogging = false;

  for (var i = 0; i < stack.length; i++) {
    var tmp = r.exec(stack[i]);
    if (tmp) {
      package_name = tmp[1];
      lineno = tmp[2];

      if (isLogging) {
        if (package_name !== "log") {
          break;
        }
      }

      if (package_name === "log") {
        isLogging = true;
      }
    }
  }

  return package_name + ":" + lineno;
}

Logging.format_message = function (level, message) {
  var msg;
  var hostname = os.hostname();
  var that = this;
  if (message instanceof Error) {
    msg = message.stack;
  } else {
    msg = JSON.stringify(message);
  }
  var date = new Date();
  var date_str = dateFormat(date, "yymmdd HH:MM:ss");
  var module = that.find_module_lineno();
  var pid = process.pid;
  var str = util.format("[%s %s %s %s:%d] %s", levels[level], date_str, module, hostname, pid, msg);
  return str;
};


Logging.info = function (message) {
  var that = this;
  var str = that.format_message("info", message);
  if (that.handler !== undefined) {
    that.handler.publish(str);
  }
  console.info(str);
};

Logging.warn = function (message) {
  var that = this;
  var str = that.format_message("warn", message);
  if (that.handler !== undefined) {
    that.handler.publish(str);
  }
  console.info(str);
};

Logging.error = function (message) {
  var that = this;
  var str = that.format_message("error", message);
  if (that.handler !== undefined) {
    that.handler.publish(str);
  }
  console.info(str);
};

Logging.debug = function (message) {
  var that = this;
  var str = that.format_message("debug", message);
  if (that.handler !== undefined) {
    that.handler.publish(str);
  }
  console.info(str);
};
