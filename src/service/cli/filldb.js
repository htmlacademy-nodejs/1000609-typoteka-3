'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {ExitCode} = require(`../../constants`);
const {getRandomInt, shuffleAndSlice} = require(`../../utils.js`);

const DEFAULT_COUNT = 1;
const FILE_NAME = `fill-db.sql`;

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

const generateComments = (count, postId, userCount, comments) => (
  Array.from({length: count}, () => ({
    text: shuffleAndSlice(comments).join(` `),
    postId,
    userId: getRandomInt(1, userCount)
  }))
);

const getPictureFileName = (number) => `item${number.toString().padStart(2, `0`)}.jpg`;

const generateMockData = (count, userCount, titles, sentences, categories, comments) => (
  Array.from({length: count}, (_, index) => {
    const postId = index + 1;

    return {
      title: titles[getRandomInt(0, titles.length - 1)],
      announce: shuffleAndSlice(sentences, 5).join(` `),
      fullText: Math.random() > 0.1 ? shuffleAndSlice(sentences).join(` `) : null,
      category: shuffleAndSlice(categories).map((category) => ({postId, categoryId: categories.indexOf(category) + 1})),
      comments: generateComments(getRandomInt(CommentsRestrict.MIN, CommentsRestrict.MAX), postId, userCount, comments),
      picture: Math.random() > 0.1 ? getPictureFileName(index) : null,
      userId: getRandomInt(1, userCount)
    };
  })
);

module.exports = {
  name: `--filldb`,
  async run(args) {
    const count = Number.parseInt(args[0], 10) || DEFAULT_COUNT;
    const titles = await readContent(FILE_TITLES_PATH);
    const sentences = await readContent(FILE_SENTENCES_PATH);
    const categories = await readContent(FILE_CATEGORIES_PATH);
    const commentSentences = await readContent(FILE_COMMENTS_PATH);

    if (count > 1000) {
      console.error(chalk.red(`Не больше 1000 публикаций`));
      process.exit(ExitCode.ERROR);
    }

    const users = [
      {
        email: `thotiana@example.com`,
        passwordHash: `c759a574f632587383762498c0c51c64`,
        firstName: `Анастасия`,
        lastName: `Самбука`,
        avatar: `avatar1.jpg`
      },
      {
        email: `blueface@example.com`,
        passwordHash: `94cf220f9e866283105f85be6acbc3b4`,
        firstName: `Глеб`,
        lastName: `Безухов`,
        avatar: `avatar2.jpg`
      }
    ];

    const posts = generateMockData(count, users.length, titles, sentences, categories, commentSentences);
    const comments = posts.flatMap((post) => post.comments);
    const postCategories = posts.flatMap((post) => post.category);

    const usersValues = users.map(({email, passwordHash, firstName, lastName, avatar}) => {
      return `('${email}', '${passwordHash}', '${firstName}', '${lastName}', '${avatar}')`;
    }).join(`,\n`);

    const categoriesValues = categories.map((category) => `('${category}')`).join(`,\n`);

    const postsValues = posts.map(({title, announce, fullText, picture, userId}) => {
      return `('${title}', '${announce}', ${fullText ? `'${fullText}'` : fullText}, ${picture ? `'${picture}'` : picture}, ${userId})`;
    }).join(`,\n`);

    const postsCategoriesValues = postCategories.map(({postId, categoryId}) => `(${postId}, ${categoryId})`).join(`,\n`);

    const commentsValues = comments.map(({text, postId, userId}) => `('${text}', ${postId}, ${userId})`).join(`,\n`);

    const content = `INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
${usersValues};

INSERT INTO categories(name) VALUES
${categoriesValues};

INSERT INTO posts(title, announcement, full_text, picture, user_id) VALUES
${postsValues};

INSERT INTO posts_categories(post_id, category_id) VALUES
${postsCategoriesValues};

INSERT INTO comments(text, post_id, user_id) VALUES
${commentsValues};`;

    try {
      await fs.writeFile(FILE_NAME, content);
      console.info(chalk.green(`Operation success. File created.`));
    } catch (err) {
      console.error(chalk.red(`Can't write data to file...`));
      process.exit(ExitCode.ERROR);
    }
  }
};
