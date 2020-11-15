'use strict';

const express = require(`express`);
const fs = require(`fs`).promises;
const chalk = require(`chalk`);
const {HttpCode} = require(`../../constants`);
const {Router} = express;

const DEFAULT_PORT = 3000;
const FILE_NAME = `mocks.json`;

const postsRouter = new Router();
postsRouter.get(`/`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(FILE_NAME);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.json([]);
  }
});

const app = express();
app.use(express.json());
app.use(`/posts`, postsRouter);
app.use((req, res) => res
  .status(HttpCode.NOT_FOUND)
  .send(`Not found`));


module.exports = {
  name: `--server`,
  run(args) {
    const [customPort] = args;
    const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

    app.listen(port, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера`, err));
      }

      return console.info(chalk.green(`Ожидаю соединений на ${port}`));
    });
  }
};
