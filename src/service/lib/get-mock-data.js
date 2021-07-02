'use strict';

const fs = require(`fs`).promises;
const FILE_NAME = `mocks.json`;
const NO_SUCH_FILE_OR_DIRECTORY_ERROR_CODE = `ENOENT`;
let data = [];

const getMockData = async () => {
  if (data.length > 0) {
    return data;
  }

  try {
    const fileContent = await fs.readFile(FILE_NAME);
    data = JSON.parse(fileContent);
  } catch (err) {
    if (err.code === NO_SUCH_FILE_OR_DIRECTORY_ERROR_CODE) {
      console.error(`Сгенерируйте файл mocks.json с помощью npm run start -- --generate!`);
    } else {
      console.error(err);
    }
  }

  return data;
};

module.exports = getMockData;
