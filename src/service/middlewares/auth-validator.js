'use strict';

const {HttpCode} = require(`../../constants`);
const passwordUtils = require(`../lib/password`);

const ErrorAuthMessage = {
  EMAIL: `Пользователя с таким электронным адресом не существует`,
  PASSWORD: `Неверный пароль`
};

module.exports = (service) => async (req, res) => {
  const {email, password} = req.body;
  const user = await service.findByEmail(email);

  if (!user) {
    return res.status(HttpCode.UNAUTHORIZED)
      .send([{field: `email`, message: ErrorAuthMessage.EMAIL}]);
  }

  const passwordIsCorrect = await passwordUtils.compare(password, user.passwordHash);

  if (passwordIsCorrect) {
    delete user.passwordHash;
    return res.status(HttpCode.OK).json(user);
  }

  return res.status(HttpCode.UNAUTHORIZED)
    .send([{field: `password`, message: ErrorAuthMessage.PASSWORD}]);

};
