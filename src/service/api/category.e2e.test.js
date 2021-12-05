'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const category = require(`./category`);
const DataService = require(`../data-service/category`);

const mockCategories = [
  `Деревья`,
  `За жизнь`,
  `Без рамки`,
  `Разное`,
  `IT`,
  `Музыка`,
  `Кино`,
  `Программирование`,
  `Железо`
];

const mockUsers = [
  {
    email: `admin@typoteka.ru`,
    name: `admin`,
    surname: `admin`,
    passwordHash: passwordUtils.hashSync(`admin`),
    isAdmin: true
  },
  {
    email: `yasenevskiy@ya.ru`,
    name: `Александр`,
    surname: `Ясеневский`,
    passwordHash: passwordUtils.hashSync(`17111996`)
  }
];

const mockPosts = [
  {
    user: `admin@typoteka.ru`,
    title: `Борьба с прокрастинацией`,
    createdAt: `2021-04-17 06:12:08`,
    picture: `item01.jpg`,
    announcement: `Для начала просто соберитесь. Он написал больше 30 хитов. Освоить вёрстку несложно.`,
    fullText: `Маленькими шагами. Игры и программирование разные вещи. Он написал больше 30 хитов. Не стоит идти в программисты, если вам нравятся только игры. Так ли это на самом деле? Процессор заслуживает особого внимания. Ёлки — это не просто красивое дерево. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Он обязательно понравится геймерам со стажем. Бороться с прокрастинацией несложно. Золотое сечение — соотношение двух величин, гармоническая пропорция. Собрать камни бесконечности легко, если вы прирожденный герой. Первая большая ёлка была установлена только в 1938 году. Альбом стал настоящим открытием года. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Этот смартфон — настоящая находка. Рок-музыка всегда ассоциировалась с протестами. Просто действуйте. Это прочная древесина. Программировать не настолько сложно, как об этом говорят. Возьмите книгу новую книгу и закрепите все упражнения на практике. Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов.`,
    categories: [`Музыка`, `Деревья`, `Кино`, `Железо`, `Разное`, `IT`, `За жизнь`, `Без рамки`, `Программирование`],
    comments: [
      {
        user: `admin@typoteka.ru`,
        text: `Плюсую, но слишком много буквы! Согласен с автором!`
      }, {
        user: `yasenevskiy@ya.ru`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Согласен с автором!`
      }, {
        user: `admin@typoteka.ru`,
        text: `Планируете записать видосик на эту тему? Плюсую, но слишком много буквы! Совсем немного... Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Хочу такую же футболку :-) Согласен с автором! Это где ж такие красоты? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Мне кажется или я уже читал это где-то?`
      }
    ]
  }, {
    user: `admin@typoteka.ru`,
    title: `Как перестать беспокоиться и начать жить`,
    createdAt: `2021-04-18 22:02:25`,
    picture: null,
    announcement: `Альбом стал настоящим открытием года. Это один из лучших рок-музыкантов. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много.`,
    fullText: `Из под его пера вышло 8 платиновых альбомов.`,
    categories: [`IT`, `За жизнь`, `Железо`, `Деревья`, `Кино`],
    comments: []
  }, {
    user: `yasenevskiy@ya.ru`,
    title: `Борьба с прокрастинацией`,
    createdAt: `2021-06-22 14:23:46`,
    picture: `item02.jpg`,
    announcement: `Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов. Для начала просто соберитесь. Как начать действовать? Игры и программирование разные вещи.`,
    fullText: null,
    categories: [`За жизнь`],
    comments: [
      {
        user: `admin@typoteka.ru`,
        text: `Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?`
      }, {
        user: `yasenevskiy@ya.ru`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то?`
      }
    ]
  }, {
    user: `admin@typoteka.ru`,
    title: `Как собрать камни бесконечности`,
    createdAt: `2021-06-17 19:30:19`,
    picture: `item03.jpg`,
    announcement: `Он обязательно понравится геймерам со стажем. Он написал больше 30 хитов. Просто действуйте. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Достичь успеха помогут ежедневные повторения. Альбом стал настоящим открытием года. Первая большая ёлка была установлена только в 1938 году. Рок-музыка всегда ассоциировалась с протестами. Игры и программирование разные вещи. Стоит только немного постараться и запастись книгами. Ёлки — это не просто красивое дерево. Этот смартфон — настоящая находка. Вы можете достичь всего. Как начать действовать? Маленькими шагами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Просто действуйте. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Процессор заслуживает особого внимания. Собрать камни бесконечности легко, если вы прирожденный герой. Не стоит идти в программисты, если вам нравятся только игры. Он написал больше 30 хитов. Освоить вёрстку несложно. Так ли это на самом деле? Бороться с прокрастинацией несложно. Для начала просто соберитесь. Из под его пера вышло 8 платиновых альбомов. Это прочная древесина. Простые ежедневные упражнения помогут достичь успеха. Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    categories: [`Программирование`, `Без рамки`, `За жизнь`, `Железо`],
    comments: [
      {
        user: `admin@typoteka.ru`,
        text: `Согласен с автором! Планируете записать видосик на эту тему?`
      }, {
        user: `yasenevskiy@ya.ru`,
        text: `Плюсую, но слишком много буквы! Согласен с автором!`
      }
    ]
  }, {
    user: `yasenevskiy@ya.ru`,
    title: `Обзор новейшего смартфона`,
    createdAt: `2021-06-26 00:48:11`,
    picture: `item04.jpg`,
    announcement: `Это один из лучших рок-музыкантов. Так ли это на самом деле? Он обязательно понравится геймерам со стажем. Программировать не настолько сложно, как об этом говорят. Вы можете достичь всего.`,
    fullText: `Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Освоить вёрстку несложно. Ёлки — это не просто красивое дерево. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Не стоит идти в программисты, если вам нравятся только игры. Альбом стал настоящим открытием года. Достичь успеха помогут ежедневные повторения. Из под его пера вышло 8 платиновых альбомов.`,
    categories: [`Кино`, `Музыка`],
    comments: [
      {
        user: `yasenevskiy@ya.ru`,
        text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Хочу такую же футболку :-) Согласен с автором! Плюсую, но слишком много буквы! Планируете записать видосик на эту тему?`
      }, {
        user: `admin@typoteka.ru`,
        text: `Планируете записать видосик на эту тему? Плюсую, но слишком много буквы!`
      }
    ]
  }
];

const createAPI = async (posts = mockPosts) => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: posts.length ? mockCategories : [], posts, users: mockUsers});
  const app = express();
  app.use(express.json());
  category(app, new DataService(mockDB));
  return app;
};

describe(`Category`, () => {
  describe(`API returns category list`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();

      response = await request(app)
        .get(`/categories`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Content-Type application/json`, () => expect(response.type).toBe(`application/json`));
    test(`Returns a list of 9 categories`, () => expect(response.body.length).toBe(9));
    test(`Category names are Деревья, За жизнь, Без рамки, Разное, IT, Музыка, Кино, Программирование, Железо`, () => {
      expect(response.body.map((it) => it.name)).toEqual(
          expect.arrayContaining([`Деревья`, `За жизнь`, `Без рамки`, `Разное`, `IT`, `Музыка`, `Кино`, `Программирование`, `Железо`])
      );
    });
  });

  describe(`API handles the situation when the are no categories`, () => {
    let response;

    beforeAll(async () => {
      const mockEmptyData = [];
      const api = await createAPI(mockEmptyData);

      response = await request(api)
        .get(`/categories`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Returns an empty list`, () => expect(response.body).toEqual([]));
  });

  describe(`API creates a category if data is valid`, () => {
    const newCategory = {
      name: `Новая категория`,
    };

    let response;
    let app;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .post(`/categories`)
        .send(newCategory);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Content-Type application.json`, () => expect(response.type).toBe(`application/json`));
    test(`Categories count is changed`, async () => {
      await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.length).toBe(10));
    });
  });

  describe(`API refuses to create a category if data is invalid`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`When field type is wrong response code is 400`, async () => {
      const badCategory = {
        name: 2021
      };

      await request(app)
        .post(`/categories`)
        .send(badCategory)
        .expect(HttpCode.BAD_REQUEST);
    });

    test(`When field value is wrong response code is 400`, async () => {
      const badCategory = {
        name: `Слишком длинное название категории, состоящее из 53 символов`
      };

      await request(app)
        .post(`/categories`)
        .send(badCategory)
        .expect(HttpCode.BAD_REQUEST);
    });

    test(`Categories count isn't changed`, async () => {
      const badCategory = {};

      await request(app)
        .post(`/categories`)
        .send(badCategory);

      await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.length).toBe(9));
    });
  });

  describe(`API changes an existent category`, () => {
    const newCategory = {
      name: `Новая категория`
    };

    test(`Status code 200`, async () => {
      const app = await createAPI();

      await request(app)
        .put(`/categories/2`)
        .send(newCategory)
        .expect(HttpCode.OK);
    });
  });

  describe(`API refuses to change a non-existent category`, () => {
    const newCategory = {
      name: `Новая категория`
    };

    test(`Status code 404`, async () => {
      const app = await createAPI();

      await request(app)
        .put(`/categories/20`)
        .send(newCategory)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API refuses to change an existent category if data is invalid`, () => {
    const invalidCategory = {
      name: `Новая категория, название которой состоит из 49 символов`
    };

    test(`Status code 400`, async () => {
      const app = await createAPI();

      await request(app)
        .put(`/categories/3`)
        .send(invalidCategory)
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API correctly deletes a category`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .delete(`/categories/1`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Posts count is 8 now`, async () => {
      await request(app)
        .get(`/categories`)
        .expect((res) => expect(res.body.length).toBe(8));
    });
  });

  describe(`API refuses to delete a non-existent category`, () => {
    test(`Status code 404`, async () => {
      const app = await createAPI();

      await request(app)
        .delete(`/categories/20`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});
