'use strict';

const {Router} = require(`express`);
const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models/defineModels`);
const category = require(`../api/category`);
const post = require(`../api/post`);
const search = require(`../api/search`);
const {
  CategoryService,
  SearchService,
  PostService,
  CommentService,
} = require(`../data-service`);

const getRoutes = async () => {
  const app = new Router();
  const sequelize = getSequelize();

  defineModels(sequelize);
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  post(app, new PostService(sequelize), new CommentService(sequelize));

  return app;
};

module.exports = getRoutes;
