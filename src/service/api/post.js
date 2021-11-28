'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const postValidator = require(`../middlewares/post-validator`);
const postExist = require(`../middlewares/post-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

module.exports = (app, postService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {categoryId, categories, comments, limit, offset} = req.query;
    let result;

    if (limit || offset) {
      result = await postService.findPage({limit, offset, categoryId});
    } else {
      result = await postService.findAll(categories, comments);
    }

    res.status(HttpCode.OK)
      .json(result);
  });

  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    const post = await postService.findOne(postId);

    if (!post) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${postId}`);
    }

    return res.status(HttpCode.OK)
      .json(post);
  });

  route.post(`/`, postValidator, async (req, res) => {
    const post = await postService.create(req.body);

    return res.status(HttpCode.CREATED)
      .json(post);
  });

  route.put(`/:articleId`, postValidator, routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    const updated = await postService.update(postId, req.body);

    if (!updated) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found with ${postId}`);
    }

    return res.status(HttpCode.OK)
      .send(`Updated`);
  });

  route.delete(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    const deleted = await postService.drop(postId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });

  route.get(`/:articleId/comments`, postExist(postService), routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    const comments = await commentService.findAll(postId);

    res.status(HttpCode.OK)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, postExist(postService), routeParamsValidator, async (req, res) => {
    const {commentId} = req.params;
    const deleted = await commentService.drop(commentId);

    if (!deleted) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });

  route.post(`/:articleId/comments`, postExist(postService), commentValidator, routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    const comment = await commentService.create(postId, req.body);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
