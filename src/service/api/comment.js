'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/comments`, route);

  route.get(`/`, async (req, res) => {
    let comments = [];
    let status;

    try {
      comments = await service.findAll();
      status = HttpCode.OK;
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    res.status(status)
      .json(comments);
  });

  route.get(`/last`, async (req, res) => {
    let comments = [];
    let status;

    try {
      comments = await service.findLast();
      status = HttpCode.OK;
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    res.status(status)
      .json(comments);
  });
};
