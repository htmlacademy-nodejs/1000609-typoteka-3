'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

module.exports = (app, service) => {
  const route = new Router();

  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const {query = ``} = req.query;

    if (!query) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    let searchResults = [];
    let searchStatus;

    try {
      searchResults = await service.findAll(query);

      if (!searchResults) {
        searchStatus = HttpCode.BAD_REQUEST;
      } else if (searchResults.length > 0) {
        searchStatus = HttpCode.OK;
      } else {
        searchStatus = HttpCode.NOT_FOUND;
      }
    } catch (err) {
      searchStatus = HttpCode.BAD_REQUEST;
    }

    res.status(searchStatus)
      .json(searchResults);
  });
};
