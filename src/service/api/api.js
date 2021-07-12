'use strict';

const {Router} = require(`express`);
const category = require(`../api/category`);
const post = require(`../api/post`);
const search = require(`../api/search`);

const getMockData = require(`../lib/get-mock-data`);

const {
  CategoryService,
  SearchService,
  PostService,
  CommentService,
} = require(`../data-service`);

const getRoutes = async () => {
  const app = new Router();

  const mockData = await getMockData();

  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  post(app, new PostService(mockData), new CommentService());

  return app;
};

module.exports = getRoutes;
