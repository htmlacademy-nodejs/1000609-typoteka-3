'use strict';

const pino = require(`pino`);

const logger = pino({
  name: `base-logger`,
  level: `info`,
  prettyPrint: {
    ignore: `pid,hostname`,
    translateTime: `SYS:dd.mm.yyyy HH:MM:ss`
  }
});

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
