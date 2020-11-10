'use strict';

const {Router} = require(`express`);

const mainRouter = new Router();

mainRouter.get(`/`, (req, res) => res.send(req.originalUrl));
mainRouter.get(`/register`, (req, res) => res.send(req.originalUrl));
mainRouter.get(`/login`, (req, res) => res.send(req.originalUrl));
mainRouter.get(`/search`, (req, res) => res.send(req.originalUrl));
mainRouter.get(`/categories`, (req, res) => res.send(req.originalUrl));

module.exports = mainRouter;
