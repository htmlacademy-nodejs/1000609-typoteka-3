'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorPostMessage = {
  TITLE: `Заголовок - обязательное поле.`,
  TITLE_MIN: `Заголовок - минимум 30 символов.`,
  TITLE_MAX: `Заголовок - максимум 250 символов.`,
  CREATED_AT: `Дата публикации - обязательное поле.`,
  PICTURE: `Фотография - доступны форматы jpg и png.`,
  ANNOUNCEMENT: `Анонс публикации - обязательное поле.`,
  ANNOUNCEMENT_MIN: `Анонс публикации - минимум 30 символов.`,
  ANNOUNCEMENT_MAX: `Анонс публикации - максимум 250 символов.`,
  FULL_TEXT: `Полный текст публикации - максимум 1000 символов.`,
  CATEGORIES: `Категория - для выбора обязательна хотя бы одна категория.`,
  USER_ID: `Некорректный идентификатор пользователя.`
};

const schema = Joi.object({
  title: Joi.string().min(30).max(250).required().messages({
    'any.required': ErrorPostMessage.TITLE,
    'string.min': ErrorPostMessage.TITLE_MIN,
    'string.max': ErrorPostMessage.TITLE_MAX,
  }),
  createdAt: Joi.string().isoDate().required().messages({
    'any.required': ErrorPostMessage.CREATED_AT
  }),
  picture: Joi.string().pattern(/\.(?:jpg|png)$/i).allow(null).required().messages({
    'string.pattern.base': ErrorPostMessage.PICTURE,
  }),
  announcement: Joi.string().min(30).max(250).required().messages({
    ...([`any.required`, `string.empty`].reduce((result, rule) => ({...result, [rule]: ErrorPostMessage.ANNOUNCEMENT}), {})),
    'string.min': ErrorPostMessage.ANNOUNCEMENT_MIN,
    'string.max': ErrorPostMessage.ANNOUNCEMENT_MAX,
  }),
  fullText: Joi.string().max(1000).allow(null).required().messages({
    'string.max': ErrorPostMessage.FULL_TEXT,
  }),
  categories: Joi.array().min(1).items(
      Joi.number().integer().positive()
  ).required().messages(
      [`any.required`, `array.min`].reduce((result, rule) => ({...result, [rule]: ErrorPostMessage.CATEGORIES}), {})
  ),
  userId: Joi.number().integer().positive().required().messages(
      [`any.required`, `number.base`, `number.positive`].reduce((result, rule) => ({...result, [rule]: ErrorPostMessage.USER_ID}), {})
  )
});

module.exports = (req, res, next) => {
  const newPost = req.body;
  const {error} = schema.validate(newPost, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => ({
        field: err.context.key,
        message: err.message
      })));
  }

  return next();
};
