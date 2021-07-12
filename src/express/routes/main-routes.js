'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {formatDate, formatDatetime} = require(`../../utils`);

const mainRouter = new Router();

mainRouter.get(`/`, async (req, res) => {
  const posts = await api.getPosts();
  res.render(`main`, {posts, formatDate, formatDatetime});
});
mainRouter.get(`/register`, (req, res) => res.render(`sign-up`));
mainRouter.get(`/login`, (req, res) => res.render(`login`));
mainRouter.get(`/search`, async (req, res) => {
  const {search} = req.query;

  if (search) {
    try {
      const results = await api.search(search);

      res.render(`search`, {results, search, formatDate, formatDatetime});
    } catch (error) {
      res.render(`search`, {results: [], search});
    }
  } else {
    res.render(`search`);
  }
});
mainRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = mainRouter;
