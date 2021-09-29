'use strict';

const {Router} = require(`express`);
const getSequelize = require(`../lib/sequelize`);
const defineModels = require(`../models/define-models`);
const category = require(`../api/category`);
const post = require(`../api/post`);
const search = require(`../api/search`);
const user = require(`../api/user`);
const {
  CategoryService,
  SearchService,
  PostService,
  CommentService,
  UserService
} = require(`../data-service`);

const getRoutes = async () => {
  const app = new Router();
  const sequelize = getSequelize();

  defineModels(sequelize);
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  post(app, new PostService(sequelize), new CommentService(sequelize));
  user(app, new UserService(sequelize));

  return app;
};

module.exports = getRoutes;
