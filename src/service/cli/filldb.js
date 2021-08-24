'use strict';

const {FILE_TITLES_PATH, FILE_SENTENCES_PATH, FILE_CATEGORIES_PATH, FILE_COMMENTS_PATH, ExitCode} = require(`../../constants`);
const {getRandomInt, getRandomDate, getPictureFileName, shuffleAndSlice, readContent} = require(`../../utils.js`);
const {getLogger} = require(`../lib/logger`);
const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models/defineModels`);
const Alias = require(`../models/alias`);

const DEFAULT_COUNT = 1;

const CommentsRestrict = {
  MIN: 0,
  MAX: 4
};

const logger = getLogger({});

const generateComments = (count, comments) => (
  Array.from({length: count}, () => ({
    text: shuffleAndSlice(comments).join(` `)
  }))
);

const generateMockData = (count, titles, sentences, categories, comments) => (
  Array.from({length: count}, (_, index) => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    picture: Math.random() > 0.1 ? getPictureFileName(index) : null,
    createdDate: getRandomDate(),
    announcement: shuffleAndSlice(sentences, 4).join(` `),
    fullText: Math.random() > 0.1 ? shuffleAndSlice(sentences).join(` `) : null,
    categories: shuffleAndSlice(categories),
    comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), comments)
  }))
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    const sequelize = getSequelize();

    try {
      logger.info(`Trying to connect to database...`);
      await sequelize.authenticate();
    } catch (err) {
      logger.error(`An error occurred: ${err.message}`);
      process.exit(ExitCode.ERROR);
    }

    logger.info(`Connection to database established`);

    const {Category, Post} = defineModels(sequelize);

    await sequelize.sync({force: true});

    const titles = await readContent(FILE_TITLES_PATH, logger);
    const sentences = await readContent(FILE_SENTENCES_PATH, logger);
    const categories = await readContent(FILE_CATEGORIES_PATH, logger);
    const comments = await readContent(FILE_COMMENTS_PATH, logger);

    const categoryModels = await Category.bulkCreate(
        categories.map((item) => ({name: item}))
    );

    const count = Number.parseInt(args[0], 10) || DEFAULT_COUNT;
    const posts = generateMockData(count, titles, sentences, categoryModels, comments);
    const postPromises = posts.map(async (post) => {
      const postModel = await Post.create(post, {include: [Alias.COMMENTS]});
      await postModel.addCategories(post.categories);
    });
    await Promise.all(postPromises);
  }
};
