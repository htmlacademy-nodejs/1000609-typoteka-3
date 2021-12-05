'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorCategoryMessage = {
  MIN: `Название категории содержит меньше 5 символов.`,
  MAX: `Название категории содержит больше 30 символов.`,
  REQUIRED: `Название категории - обязательное поле.`,
};

const schema = Joi.object({
  name: Joi.string().min(5).max(30).required().messages({
    ...([`any.required`, `string.empty`].reduce((result, rule) => ({...result, [rule]: ErrorCategoryMessage.REQUIRED}), {})),
    'string.min': ErrorCategoryMessage.MIN,
    'string.max': ErrorCategoryMessage.MAX
  }),
});

module.exports = (req, res, next) => {
  const category = req.body;

  const {error} = schema.validate(category, {abortEarly: false});
  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => ({
        field: err.context.key,
        message: err.message
      })));
  }

  return next();
};
