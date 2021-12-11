'use strict';

const defineModels = require(`../models/define-models`);
const Alias = require(`../models/alias`);
const {ExitCode} = require(`../../constants`);

module.exports = async (sequelize, {categories, posts, users}, logger) => {
  try {
    const {Category, Post, User} = defineModels(sequelize);
    await sequelize.sync({force: true});

    const categoryModels = await Category.bulkCreate(
        categories.map((item) => ({name: item}))
    );

    const categoryIdByName = categoryModels.reduce((acc, cur) => ({
      [cur.name]: cur.id,
      ...acc
    }), {});

    const userModels = await User.bulkCreate(users, {include: [Alias.POSTS, Alias.COMMENTS]});

    const userIdByEmail = userModels.reduce((acc, next) => ({
      [next.email]: next.id,
      ...acc
    }), {});

    posts.forEach((post) => {
      post.userId = userIdByEmail[post.user];
      post.comments.forEach((comment) => {
        comment.userId = userIdByEmail[comment.user];
      });
    });

    const postPromises = posts.map(async (post) => {
      const postModel = await Post.create(post, {include: [Alias.COMMENTS]});
      await postModel.addCategories(
          post.categories.map((name) => categoryIdByName[name])
      );
    });

    await Promise.all(postPromises);
  } catch (err) {
    if (logger) {
      logger.error(`An error occurred, try later`);
    } else {
      console.error(`An error occurred, try later`);
    }
    process.exit(ExitCode.ERROR);
  }
};
