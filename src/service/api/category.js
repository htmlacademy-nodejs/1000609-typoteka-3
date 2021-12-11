'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryValidator = require(`../middlewares/category-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count, withPosts} = req.query;
    let categories = [];
    let status;

    try {
      categories = await service.findAll(count, withPosts);
      status = categories ? HttpCode.OK : HttpCode.BAD_REQUEST;
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    res.status(status)
      .json(categories);
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    let category = null;
    let status;

    try {
      category = await service.create(req.body);
      status = category ? HttpCode.CREATED : HttpCode.BAD_REQUEST;
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    res.status(status)
      .json(category);
  });

  route.put(`/:categoryId`, categoryValidator, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;

    let body = null;
    let status;

    try {
      const category = await service.update(categoryId, req.body);
      if (category) {
        body = `Updated`;
        status = HttpCode.OK;
      } else {
        body = `Not found with ${categoryId}`;
        status = HttpCode.NOT_FOUND;
      }
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    res.status(status)
      .json(body);
  });

  route.delete(`/:categoryId`, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;

    let body = null;
    let status;

    try {
      const category = await service.drop(categoryId);

      if (category) {
        body = `Deleted`;
        status = HttpCode.OK;
      } else {
        body = `Not found`;
        status = HttpCode.NOT_FOUND;
      }
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    res.status(status)
      .json(body);
  });
};
