'use strict';

const DEFAULT_COMMAND = `--help`;
const API_PREFIX = `/api`;
const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const USER_ARGV_INDEX = 2;
const MAX_ID_LENGTH = 6;
const POSTS_PER_PAGE = 8;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`
};

const ExitCode = {
  ERROR: 1,
  SUCCESS: 0
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

module.exports = {
  DEFAULT_COMMAND,
  API_PREFIX,
  FILE_TITLES_PATH,
  FILE_SENTENCES_PATH,
  FILE_CATEGORIES_PATH,
  FILE_COMMENTS_PATH,
  USER_ARGV_INDEX,
  MAX_ID_LENGTH,
  POSTS_PER_PAGE,
  Env,
  ExitCode,
  HttpCode
};
