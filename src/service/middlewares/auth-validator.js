'use strict';

const {HttpCode} = require(`../../constants`);
const passwordUtils = require(`../lib/password`);

const ErrorAuthMessage = {
  EMAIL: `Пользователя с таким электронным адресом не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports = (service) => async (req, res) => {
  const {email, password} = req.body;
  let status = HttpCode.UNAUTHORIZED;
  let result = null;

  try {
    const user = await service.findByEmail(email);

    if (!user) {
      result = [{field: `email`, message: ErrorAuthMessage.EMAIL}];
    } else {
      const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);

      if (passwordIsCorrect) {
        delete user.passwordHash;
        status = HttpCode.OK;
        result = user;
      } else {
        result = [{field: `password`, message: ErrorAuthMessage.PASSWORD}];
      }
    }
  } catch (err) {
    status = HttpCode.BAD_REQUEST;
  }

  return res.status(status)
    .send(result);
};
