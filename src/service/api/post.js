'use strict';

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const postValidator = require(`../middlewares/post-validator`);
const postExist = require(`../middlewares/post-exists`);
const commentValidator = require(`../middlewares/comment-validator`);
const routeParamsValidator = require(`../middlewares/route-params-validator`);

const LAST_COMMENTS_TEXT_LENGTH = 100;

module.exports = (app, postService, commentService, userService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, async (req, res) => {
    const {categoryId, categories, comments, limit, offset, needPopular} = req.query;
    let result;

    if (needPopular) {
      result = await postService.findPopular();
    } else if (limit || offset) {
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

    const io = req.app.locals.socketio;
    const lastComments = await commentService.findLast();
    const popularPosts = await postService.findPopular();

    io.emit(`comment:delete`, lastComments.map((comment) => ({
      id: comment.id,
      text: comment.text.length > LAST_COMMENTS_TEXT_LENGTH ? `${comment.text.slice(0, LAST_COMMENTS_TEXT_LENGTH).trim()}…` : comment.text,
      postId: comment.postId,
      user: {
        name: `${comment.users.name} ${comment.users.surname}`.trim(),
        avatar: comment.users.avatar
      }
    })), popularPosts);

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

    const io = req.app.locals.socketio;
    const lastComments = await commentService.findLast();
    const popularPosts = await postService.findPopular();

    io.emit(`comment:delete`, lastComments.map((comment) => ({
      id: comment.id,
      text: comment.text.length > LAST_COMMENTS_TEXT_LENGTH ? `${comment.text.slice(0, LAST_COMMENTS_TEXT_LENGTH).trim()}…` : comment.text,
      postId: comment.postId,
      user: {
        name: `${comment.users.name} ${comment.users.surname}`.trim(),
        avatar: comment.users.avatar
      }
    })), popularPosts);

    return res.status(HttpCode.OK)
      .send(`Deleted`);
  });

  route.post(`/:articleId/comments`, postExist(postService), commentValidator, routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    const comment = await commentService.create(postId, req.body);
    const user = await userService.findById(comment.userId);

    const io = req.app.locals.socketio;
    const popularPosts = await postService.findPopular();

    io.emit(`comment:create`, {
      ...comment,
      text: comment.text.length > LAST_COMMENTS_TEXT_LENGTH ? `${comment.text.slice(0, LAST_COMMENTS_TEXT_LENGTH).trim()}…` : comment.text,
      user: {
        name: `${user.name} ${user.surname}`.trim(),
        avatar: user.avatar
      },
    }, popularPosts);

    return res.status(HttpCode.CREATED)
      .json(comment);
  });
};
