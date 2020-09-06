'use strict';

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
 * Возвращает случайно обрезанный перетасованный
 * по алгоритму Фишера—Йетса массив
 *
 * @param {Array} someArray
 * @param {Number} sliceEnd
 * @return {Array}
 */
const shuffleAndSlice = (someArray, sliceEnd = someArray.length) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray.slice(0, getRandomInt(1, sliceEnd));
};

module.exports = {
  getRandomInt,
  getRandomDate,
  shuffleAndSlice
};
