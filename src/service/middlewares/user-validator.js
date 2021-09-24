'use strict';

const Joi = require(`joi`);
const {HttpCode} = require(`../../constants`);

const ErrorRegisterMessage = {
  EMAIL_REQUIRED: `Электронная почта - обязательное поле.`,
  EMAIL_INVALID: `Некорректный электронный адрес.`,
  EMAIL_EXIST: `Электронный адрес уже используется.`,
  NAME: `Имя - обязательное поле. Не должно содержать цифр и специальных символов.`,
  SURNAME: `Фамилия - обязательное поле. Не должно содержать цифр и специальных символов.`,
  PASSWORD: `Пароль - обязательное поле. Минимум 6 символов.`,
  PASSWORD_REPEATED: `Пароли не совпадают.`,
  AVATAR: `Фото профиля - доступны форматы jpg, jpeg и png.`,
};

const schema = Joi.object({
  email: Joi.string().email().required().messages({
    'any.required': ErrorRegisterMessage.EMAIL_REQUIRED,
    'string.email': ErrorRegisterMessage.EMAIL_INVALID
  }),
  name: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    ...([`any.required`, `string.pattern.base`].reduce((result, rule) => ({...result, [rule]: ErrorRegisterMessage.NAME}), {})),
  }),
  surname: Joi.string().pattern(/[^0-9$&+,:;=?@#|'<>.^*()%!]+$/).required().messages({
    ...([`any.required`, `string.pattern.base`].reduce((result, rule) => ({...result, [rule]: ErrorRegisterMessage.SURNAME}), {})),
  }),
  password: Joi.string().min(6).required().messages({
    ...([`any.required`, `string.min`].reduce((result, rule) => ({...result, [rule]: ErrorRegisterMessage.PASSWORD}), {})),
  }),
  passwordRepeated: Joi.string().required().valid(Joi.ref(`password`)).required().messages({
    ...([`any.required`, `any.only`].reduce((result, rule) => ({...result, [rule]: ErrorRegisterMessage.PASSWORD_REPEATED}), {})),
  }),
  avatar: Joi.string().pattern(/\.(?:jpg|png|jpeg)$/i).allow(null).required().messages({
    'string.pattern.base': ErrorRegisterMessage.AVATAR,
  }),
});

module.exports = (service) => async (req, res, next) => {
  const newUser = req.body;
  const {error} = schema.validate(newUser, {abortEarly: false});

  if (error) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(error.details.map((err) => ({
        field: err.context.key,
        message: err.message
      })));
  }

  const userByEmail = await service.findByEmail(req.body.email);

  if (userByEmail) {
    return res.status(HttpCode.BAD_REQUEST)
      .send(ErrorRegisterMessage.EMAIL_EXIST);
  }

  return next();
};
