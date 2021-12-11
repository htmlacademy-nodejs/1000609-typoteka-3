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
    const {categoryId, limit, offset, needPopular} = req.query;
    let result;
    let status;

    try {
      if (needPopular) {
        result = await postService.findPopular();
      } else if (limit || offset) {
        result = await postService.findPage({limit, offset, categoryId});
      } else {
        result = await postService.findAll();
      }

      status = HttpCode.OK;
    } catch (err) {
      result = [];
      status = HttpCode.BAD_REQUEST;
    }

    res.status(status)
      .json(result);
  });

  route.get(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    let status;
    let body = null;

    try {
      const post = await postService.findOne(postId);

      if (!post) {
        status = HttpCode.NOT_FOUND;
        body = `Not found with ${postId}`;
      } else {
        status = HttpCode.OK;
        body = post;
      }
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    return res.status(status)
      .json(body);
  });

  route.post(`/`, postValidator, async (req, res) => {
    let status;
    let post = null;

    try {
      post = await postService.create(req.body);
      status = HttpCode.CREATED;
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    return res.status(status)
      .json(post);
  });

  route.put(`/:articleId`, postValidator, routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    let body = null;
    let status;

    try {
      const updated = await postService.update(postId, req.body);

      if (!updated) {
        body = `Not found with ${postId}`;
        status = HttpCode.NOT_FOUND;
      } else {
        body = `Updated`;
        status = HttpCode.OK;
      }
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    return res.status(status)
      .send(body);
  });

  route.delete(`/:articleId`, routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    let body;
    let status;

    try {
      const deleted = await postService.drop(postId);

      if (!deleted) {
        status = HttpCode.NOT_FOUND;
        body = `Not found`;
      } else {
        status = HttpCode.OK;
        body = `Deleted`;

        const io = req.app.locals.socketio;

        if (io) {
          const [lastComments, popularPosts] = await Promise.all([
            commentService.findLast(),
            postService.findPopular()
          ]);

          io.emit(`comment:delete`, lastComments.map((comment) => ({
            id: comment.id,
            text: comment.text.length > LAST_COMMENTS_TEXT_LENGTH ? `${comment.text.slice(0, LAST_COMMENTS_TEXT_LENGTH).trim()}…` : comment.text,
            postId: comment.postId,
            user: {
              name: `${comment.users.name} ${comment.users.surname}`.trim(),
              avatar: comment.users.avatar
            }
          })), popularPosts);
        }
      }
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    return res.status(status)
      .send(body);
  });

  route.get(`/:articleId/comments`, postExist(postService), routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    let comments = [];
    let status;

    try {
      comments = await commentService.findAllByPost(postId);
      status = HttpCode.OK;
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    res.status(status)
      .json(comments);
  });

  route.delete(`/:articleId/comments/:commentId`, postExist(postService), routeParamsValidator, async (req, res) => {
    const {commentId} = req.params;
    let body;
    let status;

    try {
      const deleted = await commentService.drop(commentId);

      if (!deleted) {
        status = HttpCode.NOT_FOUND;
        body = `Not found`;
      } else {
        status = HttpCode.OK;
        body = `Deleted`;

        const io = req.app.locals.socketio;

        if (io) {
          const [lastComments, popularPosts] = await Promise.all([
            commentService.findLast(),
            postService.findPopular()
          ]);

          io.emit(`comment:delete`, lastComments.map((comment) => ({
            id: comment.id,
            text: comment.text.length > LAST_COMMENTS_TEXT_LENGTH ? `${comment.text.slice(0, LAST_COMMENTS_TEXT_LENGTH).trim()}…` : comment.text,
            postId: comment.postId,
            user: {
              name: `${comment.users.name} ${comment.users.surname}`.trim(),
              avatar: comment.users.avatar
            }
          })), popularPosts);
        }
      }
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    return res.status(status)
      .send(body);
  });

  route.post(`/:articleId/comments`, postExist(postService), commentValidator, routeParamsValidator, async (req, res) => {
    const {articleId: postId} = req.params;
    let comment = null;
    let status;

    try {
      comment = await commentService.create(postId, req.body);
      status = HttpCode.CREATED;

      const user = await userService.findById(comment.userId);

      const io = req.app.locals.socketio;

      if (io) {
        const popularPosts = await postService.findPopular();

        io.emit(`comment:create`, {
          ...comment,
          text: comment.text.length > LAST_COMMENTS_TEXT_LENGTH ? `${comment.text.slice(0, LAST_COMMENTS_TEXT_LENGTH).trim()}…` : comment.text,
          user: {
            name: `${user.name} ${user.surname}`.trim(),
            avatar: user.avatar
          },
        }, popularPosts);
      }
    } catch (err) {
      status = HttpCode.BAD_REQUEST;
    }

    return res.status(status)
      .json(comment);
  });
};
