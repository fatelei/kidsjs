// kids demo


var logging = require("../lib/log").Logging;

if (require.main === module) {
  logging.add_logging_handler();
  logging.info("info");
  logging.debug("debug");
  logging.warn("warn");
  logging.error("error")  
}
