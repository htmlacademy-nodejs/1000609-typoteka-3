'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const user = require(`./user`);
const DataService = require(`../data-service/user`);

const mockCategories = [
  `Деревья`,
  `За жизнь`,
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
    title: `Как перестать беспокоиться и начать жить`,
    createdAt: `2021-04-28 01:21:31`,
    picture: `item01.jpg`,
    announcement: `Маленькими шагами. Стоит только немного постараться и запастись книгами. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Для начала просто соберитесь. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Игры и программирование разные вещи. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Маленькими шагами.`,
    categories: [`Железо`, `IT`, `Программирование`],
    comments: [
      {
        user: `yasenevskiy@ya.ru`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }, {
        user: `yasenevskiy@ya.ru`,
        text: `Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?`
      }, {
        user: `admin@typoteka.ru`,
        text: `Согласен с автором!`
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
    title: `Самый лучший музыкальный альбом этого года`,
    createdAt: `2021-05-02 09:18:55`,
    picture: `item03.jpg`,
    announcement: `Золотое сечение — соотношение двух величин, гармоническая пропорция.`,
    fullText: `Этот смартфон — настоящая находка. Маленькими шагами. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево.`,
    categories: [`Железо`, `IT`],
    comments: [
      {
        user: `admin@typoteka.ru`,
        text: `Планируете записать видосик на эту тему? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Это где ж такие красоты? Совсем немного... Плюсую, но слишком много буквы! Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`
      }, {
        user: `admin@typoteka.ru`,
        text: `Согласен с автором! Это где ж такие красоты?`
      }, {
        user: `admin@typoteka.ru`,
        text: `Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему? Хочу такую же футболку :-) Согласен с автором! Это где ж такие красоты?`
      }, {
        user: `admin@typoteka.ru`,
        text: `Плюсую, но слишком много буквы! Это где ж такие красоты? Планируете записать видосик на эту тему?`
      }
    ]
  }, {
    user: `yasenevskiy@ya.ru`,
    title: `Как перестать беспокоиться и начать жить`,
    createdAt: `2021-04-04 02:48:49`,
    picture: null,
    announcement: `Собрать камни бесконечности легко, если вы прирожденный герой. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Золотое сечение — соотношение двух величин, гармоническая пропорция. Просто действуйте.`,
    fullText: `Рок-музыка всегда ассоциировалась с протестами. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Просто действуйте. Для начала просто соберитесь. Так ли это на самом деле? Бороться с прокрастинацией несложно. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Ёлки — это не просто красивое дерево. Этот смартфон — настоящая находка. Он написал больше 30 хитов.`,
    categories: [`Музыка`, `Кино`, `Разное`],
    comments: [
      {
        user: `admin@typoteka.ru`,
        text: `Это где ж такие красоты? Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Хочу такую же футболку :-)`
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

const createAPI = async () => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, posts: mockPosts, users: mockUsers});
  const app = express();
  app.use(express.json());
  user(app, new DataService(mockDB));
  return app;
};

describe(`User`, () => {
  describe(`API creates user if data is valid`, () => {
    const validUserData = {
      email: `vasya@mail.ru`,
      name: `Василий`,
      surname: `Кошечкин`,
      password: `123456`,
      passwordRepeated: `123456`,
      avatar: null
    };

    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .post(`/user`)
        .send(validUserData);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Content-Type application.json`, () => expect(response.type).toBe(`application/json`));
  });

  describe(`API refuses to create user if data is invalid`, () => {
    const validUserData = {
      email: `vasya@mail.ru`,
      name: `Василий`,
      surname: `Кошечкин`,
      password: `123456`,
      passwordRepeated: `123456`,
      avatar: null
    };

    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Without any required property response code is 400`, async () => {
      for (const key of Object.keys(validUserData)) {
        const badUserData = {...validUserData};
        delete badUserData[key];
        await request(app)
          .post(`/user`)
          .send(badUserData)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`When field type is wrong response code is 400`, async () => {
      const badUsers = [
        {...validUserData, name: true},
        {...validUserData, email: 1}
      ];

      for (const badUserData of badUsers) {
        await request(app)
          .post(`/user`)
          .send(badUserData)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`When field value is wrong response code is 400`, async () => {
      const badUsers = [
        {...validUserData, password: `short`, passwordRepeated: `short`},
        {...validUserData, email: `invalid`}
      ];

      for (const badUserData of badUsers) {
        await request(app)
          .post(`/user`)
          .send(badUserData)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`When password and passwordRepeated are not equal, code is 400`, async () => {
      const badUserData = {...validUserData, passwordRepeated: `not 123456`};

      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    });

    test(`When email is already in use status code is 400`, async () => {
      const badUserData = {...validUserData, email: `admin@typoteka.ru`};

      await request(app)
        .post(`/user`)
        .send(badUserData)
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API authenticate user if data is valid`, () => {
    const validAuthData = {
      email: `admin@typoteka.ru`,
      password: `admin`
    };

    let response;

    beforeAll(async () => {
      const app = await createAPI();
      response = await request(app)
        .post(`/user/auth`)
        .send(validAuthData);
    });

    test(`Status code is 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`User name is admin`, () => expect(response.body.name).toBe(`admin`));
  });

  describe(`API refuses to authenticate user if data is invalid`, () => {
    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`If email is incorrect status is 401`, async () => {
      const badAuthData = {
        email: `not-exist@example.com`,
        password: `admin`
      };

      await request(app)
        .post(`/user/auth`)
        .send(badAuthData)
        .expect(HttpCode.UNAUTHORIZED);
    });

    test(`If password doesn't match status is 401`, async () => {
      const badAuthData = {
        email: `admin@typoteka.ru`,
        password: `password`
      };

      await request(app)
        .post(`/user/auth`)
        .send(badAuthData)
        .expect(HttpCode.UNAUTHORIZED);
    });
  });
});
