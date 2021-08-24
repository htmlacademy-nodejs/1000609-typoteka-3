'use strict';

const chalk = require(`chalk`);

const text = `${chalk.cyan(`Программа запускает http-сервер и формирует моковые данные для API.`)}

    ${chalk.bold(`Гайд`)}:
    ${chalk.cyanBright(`service.js <command>`)}
    ${chalk.bold(`Команды`)}:
    ${chalk.cyanBright.bold(`--version`)}:            ${chalk.green(`выводит номер версии`)}
    ${chalk.cyanBright.bold(`--help`)}:               ${chalk.green(`печатает этот текст`)}
    ${chalk.cyanBright.bold(`--generate <count>`)}:   ${chalk.green(`формирует файл mocks.json`)}
    ${chalk.cyanBright.bold(`--fill <count>`)}:       ${chalk.green(`формирует файл fill-db.sql`)}
    ${chalk.cyanBright.bold(`--filldb <count>`)}:     ${chalk.green(`заполняет таблицы в БД начальными данными`)}
    ${chalk.cyanBright.bold(`--server <port>`)}:      ${chalk.green(`запускает http-сервер`)}`;

module.exports = {
  name: `--help`,
  run() {
    console.info(text);
  }
};
