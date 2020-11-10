'use strict';

const {Router} = require(`express`);

const articlesRouter = new Router();

articlesRouter.get(`/add`, (req, res) => res.send(req.originalUrl));
articlesRouter.get(`/category/:id`, (req, res) => res.send(req.originalUrl));
articlesRouter.get(`/:id`, (req, res) => res.send(req.originalUrl));
articlesRouter.get(`/edit/:id`, (req, res) => res.send(req.originalUrl));

module.exports = articlesRouter;
