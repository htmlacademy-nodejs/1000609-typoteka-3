'use strict';

const express = require(`express`);
const chalk = require(`chalk`);
const {HttpCode, API_PREFIX} = require(`../../constants`);
const getRoutes = require(`../api`);

const DEFAULT_PORT = 3000;

module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    const app = express();
    app.use(express.json());

    app.use(API_PREFIX, getRoutes());
    app.use((req, res) => res
      .status(HttpCode.NOT_FOUND)
      .send(`Not found`));

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера`, err));
      }

      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  }
};
