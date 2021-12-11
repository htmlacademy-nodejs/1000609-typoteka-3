'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {nanoid} = require(`nanoid`);
const {FILE_TITLES_PATH, FILE_SENTENCES_PATH, FILE_CATEGORIES_PATH, FILE_COMMENTS_PATH, ExitCode, MAX_ID_LENGTH} = require(`../../constants`);
const {getRandomInt, getRandomDate, getPictureFileName, shuffleAndSlice, readContent} = require(`../../utils`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `mocks.json`;

const CommentsRestrict = {
  MIN: 0,
  MAX: 4
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
    createdAt: getRandomDate(),
    picture: getPictureFileName(),
    announcement: shuffleAndSlice(sentences, 4).join(` `),
    fullText: shuffleAndSlice(sentences).join(` `),
    categories: shuffleAndSlice(categories),
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), comments)
  }))
);

module.exports = {
  name: `--generate`,
  async run(args) {
    const count = Number.parseInt(args[0], 10) || DEFAULT_COUNT;

    if (count > 1000) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.ERROR);
    }

    let titles;
    let sentences;
    let categories;
    let comments;

    try {
      titles = await readContent(FILE_TITLES_PATH);
      sentences = await readContent(FILE_SENTENCES_PATH);
      categories = await readContent(FILE_CATEGORIES_PATH);
      comments = await readContent(FILE_COMMENTS_PATH);
    } catch (err) {
      console.error(chalk.red(`Произошла ошибка, повторите попытку позже`));
      process.exit(ExitCode.ERROR);
    }

    const content = JSON.stringify(generateMockData(count, titles, sentences, categories, comments));

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
