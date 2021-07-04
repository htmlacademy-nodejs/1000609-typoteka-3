'use strict';

const pino = require(`pino`);
const {Env} = require(`../../constants`);

const LOG_FILE = `./src/service/logs/api.log`;

const isDevMode = process.env.NODE_ENV === Env.DEVELOPMENT;
const defaultLogLevel = isDevMode ? `debug` : `error`;

const logger = pino({
  name: `base-logger`,
  level: process.env.LOG_LEVEL || defaultLogLevel,
  ...(isDevMode && {
    prettyPrint: {
      ignore: `pid,hostname`,
      translateTime: `SYS:dd.mm.yyyy HH:MM:ss`
    }
  })
}, isDevMode ? process.stdout : pino.destination(LOG_FILE));

module.exports = {
  logger,
  getLogger(options = {}) {
    return logger.child(options);
  }
};
