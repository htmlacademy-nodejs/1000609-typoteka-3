'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    const comments = await service.findAll();
    res.status(HttpCode.OK)
      .json(comments);
  });

  route.get(`/last`, async (req, res) => {
    const comments = await service.findLast();
    res.status(HttpCode.OK)
      .json(comments);
  });
};
