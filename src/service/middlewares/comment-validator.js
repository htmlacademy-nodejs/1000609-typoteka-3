'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCommentMessage = {
  MIN: `Комментарий содержит меньше 20 символов.`,
  REQUIRED: `Текст комментария - обязательное поле.`,
  USER_ID: `Некорректный идентификатор пользователя.`
};

const schema = Joi.object({
  text: Joi.string().min(20).required().messages({
    ...([`any.required`, `string.empty`].reduce((result, rule) => ({...result, [rule]: ErrorCommentMessage.REQUIRED}), {})),
    'string.min': ErrorCommentMessage.MIN
  }),
  userId: Joi.number().integer().positive().required().messages(
      [`any.required`, `number.base`, `number.positive`].reduce((result, rule) => ({...result, [rule]: ErrorCommentMessage.USER_ID}), {})
  )
});

module.exports = (req, res, next) => {
  const comment = req.body;

  const {error} = schema.validate(comment, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => ({
        field: err.context.key,
        message: err.message
      })));
  }

  return next();
};
