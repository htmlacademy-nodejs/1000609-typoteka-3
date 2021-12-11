'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const userValidator = require(`../middlewares/user-validator`);
const authValidator = require(`../middlewares/auth-validator`);
const passwordUtils = require(`../lib/password`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/user`, route);

  route.post(`/`, userValidator(service), async (req, res) => {
    const data = req.body;
    let result = null;
    let status;

    try {
      data.passwordHash = await passwordUtils.hash(data.password);

      result = await service.create(data);
      delete result.passwordHash;
      status = HttpCode.CREATED;
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    res.status(status)
      .json(result);
  });

  route.post(`/auth`, authValidator(service));
};
