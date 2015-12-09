/**
 * logging
 */
'use strict';

const os = require('os');
const util = require('util');
const dateformat = require('dateformat');

const Kids = require("./kids");

// Log levels.
const levels = {
  warn: "W",
  info: "I",
  error: "E",
  debug: "D"
};

// Hostname.
const hostname = os.hostname();

// Process id.
const pid = process.pid;

/**
 * Get module name and file number.
 * @private
 * @return {string} Module name and file number.
 */
const findModuleLineno = () => {
  let error = new Error();
  let stack = error.stack.split("\n");
  let lineno = 0;
  let isLogging = false;
  let packageName = "unknown";
  const r = /.*\/(.*?)\.\w+:(\d+):/;

  for (let i = 0; i < stack.length; i++) {
    let tmp = r.exec(stack[i]);
    if (tmp) {
      packageName = tmp[1];
      lineno = tmp[2];

      if (isLogging) {
        if (packageName !== "log") {
          break;
        }
      }

      if (packageName === "log") {
        isLogging = true;
      }
    }
  }
  return packageName + ":" + lineno;
}

/**
 * Format message.
 * @param  {string} level   Log level
 * @param  {string} message Log message
 * @return {string}         Log
 */
const formatMessage = (level, message) => {
  let msg;
  if (message instanceof Error) {
    msg = message.stack;
  } else if (typeof message === 'object') {
    msg = JSON.stringify(message);
  } else {
    msg = message;
  }

  let date = new Date();
  let dateStr = dateformat(date, "yymmdd HH:MM:ss");
  let module = findModuleLineno();
  return util.format("[%s %s %s %s:%d] %s", levels[level], dateStr, module, hostname, pid, msg);
};


/**
 * Logging class.
 */
class Logging {
  constructor() {}

  /**
   * Setup logging handler.
   * @static
   * @param {object} config Config
   */
  enableKids(config) {
    if (!this.handler) {
      config = config || {};
      this.handler = new Kids(config.port, config.host, config.topic);
    }
  }

  /**
   * Log info level message.
   * @static
   * @param {string} message Log content
   */
  info(message) {
    let str = formatMessage('info', message);
    if (this.handler) {
      this.handler.publish(str);
    }
    console.info(str);
  }

  /**
   * Log warn level message.
   * @static
   * @param {string} message Log content
   */
  warn(message) {
    let str = formatMessage('warn', message);
    if (this.handler) {
      this.handler.publish(str);
    }
    console.warn(str);
  }

  /**
   * Log error level message.
   * @static
   * @param {string} message Log content
   */
  error(message) {
    let str = formatMessage('error', message);
    if (this.handler) {
      this.handler.publish(str);
    }
    console.error(str);
  }

  /**
   * Log debug level message.
   * @static
   * @param {string} message Log content
   */
  debug(message) {
    let str = formatMessage('debug', message);
    if (this.handler) {
      this.handler.publish(str);
    }
    console.info(str);
  }
}

const logging = new Logging();
module.exports = logging;
