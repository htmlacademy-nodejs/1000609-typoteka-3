'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const categoryValidator = require(`../middlewares/category-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/categories`, route);

  route.get(`/`, async (req, res) => {
    const {count} = req.query;
    const categories = await service.findAll(count);
    res.status(HttpCode.OK)
      .json(categories);
  });

  route.post(`/`, categoryValidator, async (req, res) => {
    const category = await service.create(req.body);

    res.status(HttpCode.CREATED)
      .json(category);
  });

  route.put(`/:categoryId`, categoryValidator, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;
    const updated = await service.update(categoryId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${categoryId}`);
    }

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:categoryId`, routeParamsValidator, async (req, res) => {
    const {categoryId} = req.params;
    const deleted = await service.drop(categoryId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });
};
