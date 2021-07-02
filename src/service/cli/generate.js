'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {ExitCode, MAX_ID_LENGTH} = require(`../../constants`);
const {getRandomInt, getRandomDate, shuffleAndSlice} = require(`../../utils.js`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_SENTENCES_PATH = `./data/sentences.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;

const CommentsRestrict = {
  MIN: 0,
  MAX: 4
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const generateComments = (count, comments) => (
  Array.from({length: count}, () => ({
    id: nanoid(MAX_ID_LENGTH),
    text: shuffleAndSlice(comments).join(` `)
  }))
);

const generateMockData = (count, titles, sentences, categories, comments) => (
  Array.from({length: count}, () => ({
    id: nanoid(MAX_ID_LENGTH),
    title: titles[getRandomInt(0, titles.length - 1)],
    createdDate: getRandomDate(),
    announce: shuffleAndSlice(sentences, 5).join(` `),
    fullText: shuffleAndSlice(sentences).join(` `),
    category: shuffleAndSlice(categories),
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), comments)
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const count = Number.parseInt(args[0], 10) || DEFAULT_COUNT;
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const comments = await readContent(FILE_COMMENTS_PATH);

    if (count > 1000) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generateMockData(count, titles, sentences, categories, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
      process.exit(ExitCode.SUCCESS);
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
