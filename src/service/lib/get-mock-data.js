'use strict';

const fs = require(`fs`).promises;
const {getLogger} = require(`../lib/logger`);
const FILE_NAME = `mocks.json`;
const NO_SUCH_FILE_OR_DIRECTORY_ERROR_CODE = `ENOENT`;

let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  const logger = getLogger({name: `get-mock-data`});

  try {
    const fileContent = await fs.readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    if (err.code === NO_SUCH_FILE_OR_DIRECTORY_ERROR_CODE) {
      logger.error(`Generate mocks.json file using npm run start -- --generate!`);
    } else {
      logger.error(`An error occurred: ${err.message}`);
    }
  }

  return data;
};

module.exports = getMockData;
