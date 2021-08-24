'use strict';

const help = require(`./help`);
const generate = require(`./generate`);
const version = require(`./version`);
const server = require(`./server`);
const fill = require(`./fill`);
const filldb = require(`./filldb`);

const Cli = {
  [generate.name]: generate,
  [help.name]: help,
  [version.name]: version,
  [server.name]: server,
  [fill.name]: fill,
  [filldb.name]: filldb
};

module.exports = {
  Cli
};
