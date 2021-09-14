'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorPostMessage = {
  TITLE: `Заголовок - обязательное поле. Минимум 30 символов. Максимум 250.`,
  CREATED_AT: `Дата публикации - обязательное поле.`,
  PICTURE: `Фотография - доступны форматы jpg и png.`,
  ANNOUNCEMENT: `Анонс публикации - обязательное поле. Минимум 30 символов. Максимум 250.`,
  FULL_TEXT: `Полный текст публикации - максимум 1000 символов.`,
  CATEGORIES: `Категория - для выбора обязательна хотя бы одна категория.`,
};

const schema = Joi.object({
  title: Joi.string().min(30).max(250).required().messages({
    'any.invalid': ErrorPostMessage.TITLE
  }),
  createdAt: Joi.string().isoDate().required().messages({
    'any.invalid': ErrorPostMessage.CREATED_AT
  }),
  picture: Joi.string().pattern(/\.(?:jpg|png)$/i).messages({
    'any.invalid': ErrorPostMessage.PICTURE
  }),
  announcement: Joi.string().min(30).max(250).required().messages({
    'any.invalid': ErrorPostMessage.ANNOUNCEMENT
  }),
  fullText: Joi.string().max(1000).messages({
    'any.invalid': ErrorPostMessage.FULL_TEXT
  }),
  categories: Joi.array().min(1).items(
      Joi.number().integer().positive()
  ).required().messages({
    'any.invalid': ErrorPostMessage.CATEGORIES
  })
});

module.exports = (req, res, next) => {
  const newPost = req.body;
  const {error} = schema.validate(newPost, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => err.message));
  }

  return next();
};
