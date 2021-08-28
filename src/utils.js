'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

/**
 * Возвращает случайное число в диапазоне
 * `min` и `max`.
 *
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 */
const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Возвращает случайную дату в пределах
 * трёх месяцев.
 *
 * @return {String}
 */
const getRandomDate = () => {
  const now = Date.now();
  const limit = new Date().setMonth(new Date().getMonth() - 3);
  const date = new Date(getRandomInt(limit, now)).toISOString();

  return date.replace(`T`, ` `).slice(0, -5);
};

/**
 * Возвращает отформатированное название фотографии публикации
 *
 * @param {Number} number
 * @return {String}
 */
const getPictureFileName = (number) => `item${number.toString().padStart(2, `0`)}.jpg`;

/**
 * Возвращает случайно обрезанный перетасованный
 * по алгоритму Фишера—Йетса массив
 *
 * @param {Array} someArray
 * @param {Number} sliceEnd
 * @return {Array}
 */
const shuffleAndSlice = (someArray, sliceEnd = someArray.length) => {
  const result = [...someArray];

  for (let i = result.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [result[i], result[randomPosition]] = [result[randomPosition], result[i]];
  }

  return result.slice(0, getRandomInt(1, sliceEnd));
};

/**
 * Возвращает массив считанных строк
 * из файла по переданному пути
 *
 * @param {String} filePath
 * @param {pino.Logger} [logger]
 * @return {Array}
 */
const readContent = async (filePath, logger) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.trim().split(`\n`);
  } catch (err) {
    if (logger) {
      logger.error(`Error when reading file: ${err.message}`);
    } else {
      console.error(chalk.red(err));
    }
    return [];
  }
};

/**
 * Форматирует строковое представление даты
 * из вида yyyy-mm-ddTHH:MM:ss.sssZ в dd.mm.yyyy HH:MM
 *
 * @param {String} fullDate
 * @return {String}
 */
const formatDate = (fullDate) => {
  const [date, time] = fullDate.split(`T`);
  const [year, month, day] = date.split(`-`);
  return `${day}.${month}.${year}, ${time.slice(0, -8)}`;
};

/**
 * Форматирует строковое представление даты
 * из вида yyyy-mm-ddTHH:MM:ss.sssZ в yyyy-mm-ddTHH:MM
 *
 * @param {String} fullDate
 * @return {String}
 */
const formatDatetime = (fullDate) => {
  return fullDate.slice(0, -8);
};

module.exports = {
  getRandomInt,
  getRandomDate,
  getPictureFileName,
  shuffleAndSlice,
  readContent,
  formatDate,
  formatDatetime
};
