'use strict';

const chalk = require(`chalk`);

const text = `${chalk.cyan(`Программа запускает http-сервер и формирует файл с данными для API.`)}

    ${chalk.bold(`Гайд`)}:
    ${chalk.cyanBright(`service.js <command>`)}
    ${chalk.bold(`Команды`)}:
    ${chalk.cyanBright.bold(`--version`)}:            ${chalk.green(`выводит номер версии`)}
    ${chalk.cyanBright.bold(`--help`)}:               ${chalk.green(`печатает этот текст`)}
    ${chalk.cyanBright.bold(`--generate <count>`)}:   ${chalk.green(`формирует файл mocks.json`)}`;

module.exports = {
  name: `--help`,
  run() {
    console.info(text);
  }
};
