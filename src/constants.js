'use strict';

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404
};

module.exports = {
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
  ExitCode,
  HttpCode
};
