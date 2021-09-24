'use strict';

const express = require(`express`);
const request = require(`supertest`);
const Sequelize = require(`sequelize`);

const {HttpCode} = require(`../../constants`);
const initDB = require(`../lib/init-db`);
const passwordUtils = require(`../lib/password`);
const post = require(`./post`);
const DataService = require(`../data-service/post`);
const CommentService = require(`../data-service/comment`);

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
    title: `Учим HTML и CSS`,
    createdAt: `2021-04-11 17:21:13`,
    picture: `item01.jpg`,
    announcement: `Как начать действовать? Достичь успеха помогут ежедневные повторения. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Маленькими шагами.`,
    fullText: `Он написал больше 30 хитов. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Освоить вёрстку несложно. Просто действуйте.`,
    categories: [`Деревья`, `Кино`, `За жизнь`, `Программирование`],
    comments: []
  }, {
    user: `yasenevskiy@ya.ru`,
    title: `Рок — это протест`,
    createdAt: `2021-06-20 17:41:29`,
    picture: `item01.jpg`,
    announcement: `Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Рок-музыка всегда ассоциировалась с протестами. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Возьмите книгу новую книгу и закрепите все упражнения на практике. Для начала просто соберитесь. Так ли это на самом деле? Бороться с прокрастинацией несложно.`,
    categories: [`Разное`, `Без рамки`],
    comments: [
      {
        user: `admin@typoteka.ru`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Совсем немного... Хочу такую же футболку :-)`
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
    user: `admin@typoteka.ru`,
    title: `Самый лучший музыкальный альбом этого года`,
    createdAt: `2021-05-27 15:45:12`,
    picture: null,
    announcement: `Это прочная древесина. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    fullText: null,
    categories: [`Программирование`, `Без рамки`, `За жизнь`, `IT`, `Разное`, `Железо`, `Деревья`],
    comments: []
  }
];

const createAPI = async (posts = mockPosts) => {
  const mockDB = new Sequelize(`sqlite::memory:`, {logging: false});
  await initDB(mockDB, {categories: mockCategories, posts, users: mockUsers});
  const app = express();
  app.use(express.json());
  post(app, new DataService(mockDB), new CommentService(mockDB));
  return app;
};

describe(`Post`, () => {
  describe(`API returns a list of all posts`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();

      response = await request(app)
        .get(`/articles`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Content-Type application/json`, () => expect(response.type).toBe(`application/json`));
    test(`Returns a list of 5 posts`, () => expect(response.body.length).toBe(5));
  });

  describe(`API handles the situation when the are no posts`, () => {
    let response;

    beforeAll(async () => {
      const mockEmptyPosts = [];
      const app = await createAPI(mockEmptyPosts);

      response = await request(app)
        .get(`/articles`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Returns an empty list`, () => expect(response.body).toEqual([]));
  });

  describe(`API returns a post with given id`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();

      response = await request(app)
        .get(`/articles/2`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Content-Type application/json`, () => expect(response.type).toBe(`application/json`));
    test(`Returns an object with correct structure`, () => expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          title: expect.any(String),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          picture: expect.any(String),
          announcement: expect.any(String),
          fullText: expect.any(String),
          categories: expect.any(Array),
          comments: expect.any(Array)
        })
    ));
    test(`Post's title is "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));
  });

  describe(`API handles getting a post with a non-existent id`, () => {
    let response;

    beforeAll(async () => {
      const app = await createAPI();

      response = await request(app)
        .get(`/articles/20`);
    });

    test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  });

  describe(`API creates a post if data is valid`, () => {
    const newPost = {
      title: `Заголовок публикации, состоящий из 46 символов`,
      createdAt: `2021-01-12 00:00:00`,
      picture: `picture.jpg`,
      announcement: `Анонс публикации, состоящий из 42 символов`,
      fullText: `Полный текст публикации`,
      categories: [1],
      userId: 1
    };

    let response;
    let app;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .post(`/articles`)
        .send(newPost);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Content-Type application.json`, () => expect(response.type).toBe(`application/json`));
    test(`Posts count is changed`, async () => {
      await request(app)
        .get(`/articles`)
        .expect((res) => expect(res.body.length).toBe(6));
    });
  });

  describe(`API refuses to create a post if data is invalid`, () => {
    const newPost = {
      title: `Заголовок публикации, состоящий из 46 символов`,
      createdAt: `2021-01-12 00:00:00`,
      picture: `picture.jpg`,
      announcement: `Анонс публикации, состоящий из 42 символов`,
      fullText: `Полный текст публикации`,
      categories: [1, 2],
      userId: 1
    };

    let app;

    beforeAll(async () => {
      app = await createAPI();
    });

    test(`Without any required property response code is 400`, async () => {
      for (const key of Object.keys(newPost)) {
        const badPost = {...newPost};
        delete badPost[key];
        await request(app)
          .post(`/articles`)
          .send(badPost)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`When field type is wrong response code is 400`, async () => {
      const badPosts = [
        {...newPost, createdAt: true},
        {...newPost, picture: 12345},
        {...newPost, categories: `Деревья`}
      ];

      for (const badPost of badPosts) {
        await request(app)
          .post(`/articles`)
          .send(badPost)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`When field value is wrong response code is 400`, async () => {
      const badPosts = [
        {...newPost, createdAt: `unvalid date`},
        {...newPost, title: `too short`},
        {...newPost, categories: []}
      ];

      for (const badPost of badPosts) {
        await request(app)
          .post(`/articles`)
          .send(badPost)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`Posts count isn't changed`, async () => {
      const badPost = {};

      await request(app)
        .post(`/articles`)
        .send(badPost);

      await request(app)
        .get(`/articles`)
        .expect((res) => expect(res.body.length).toBe(5));
    });
  });

  describe(`API changes an existent post`, () => {
    const newPost = {
      title: `Заголовок публикации, состоящий из 46 символов`,
      createdAt: `2021-01-12 00:00:00`,
      picture: `picture.jpg`,
      announcement: `Анонс публикации, состоящий из 42 символов`,
      fullText: null,
      categories: [2],
      userId: 1
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .put(`/articles/2`)
        .send(newPost);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Post is really changed`, async () => {
      await request(app)
        .get(`/articles/2`)
        .expect((res) => expect(res.body.title).toBe(`Заголовок публикации, состоящий из 46 символов`));
    });
  });

  describe(`API refuses to change a non-existent post`, () => {
    const newPost = {
      title: `Заголовок публикации, состоящий из 46 символов`,
      createdAt: `2021-01-12 00:00:00`,
      picture: `picture.jpg`,
      announcement: `Анонс публикации, состоящий из 42 символов`,
      fullText: `Полный текст публикации`,
      categories: [3],
      userId: 1
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .put(`/articles/20`)
        .send(newPost);
    });

    test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  });

  describe(`API refuses to change an existent post if data is invalid`, () => {
    const invalidPost = {
      title: `Заголовок публикации, состоящий из 46 символов`,
      createdAt: `2021-04-07 00:00:00`,
      picture: null,
      announcement: `В которой есть ошибка - отсутствует поле categories`,
      fullText: null,
      userId: 1
    };

    test(`Status code 400`, async () => {
      const app = await createAPI();

      await request(app)
        .put(`/articles/3`)
        .send(invalidPost)
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API correctly deletes a post`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .delete(`/articles/1`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Posts count is 4 now`, async () => {
      await request(app)
        .get(`/articles`)
        .expect((res) => expect(res.body.length).toBe(4));
    });
  });

  describe(`API refuses to delete a non-existent post`, () => {
    test(`Status code 404`, async () => {
      const app = await createAPI();

      await request(app)
        .delete(`/articles/20`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API returns a list of comments to given post`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .get(`/articles/4/comments`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Content-Type application/json`, () => expect(response.type).toBe(`application/json`));
    test(`Returns a list of 1 comments`, () => expect(response.body.length).toBe(1));
    test(`First comment's text is "Это где ж такие красоты? Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Хочу такую же футболку :-)"`, () => {
      expect(response.body[0].text).toBe(`Это где ж такие красоты? Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Хочу такую же футболку :-)`);
    });
    test(`Comments have correct structure`, () => {
      expect(response.body[0]).toHaveProperty(`id`);
      expect(response.body[0]).toHaveProperty(`text`);
    });
  });

  describe(`API correctly deletes a comment`, () => {
    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .delete(`/articles/1/comments/2`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Comments count is 2 now`, async () => {
      await request(app)
        .get(`/articles/1/comments`)
        .expect((res) => expect(res.body.length).toBe(2));
    });
  });

  describe(`API refuses to delete a non-existent comment`, () => {
    test(`Status code 404`, async () => {
      const app = await createAPI();

      await request(app)
        .delete(`/articles/1/comments/100`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API refuses to delete a comment to a non-existent post`, () => {
    test(`Status code 404`, async () => {
      const app = await createAPI();

      await request(app)
        .delete(`/articles/20/comments/1`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API creates a comment if data is valid`, () => {
    const newComment = {
      text: `Валидному комментарию достаточно этого поля`,
      userId: 1
    };

    let app;
    let response;

    beforeAll(async () => {
      app = await createAPI();

      response = await request(app)
        .post(`/articles/5/comments`)
        .send(newComment);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Content-Type application/json`, () => expect(response.type).toBe(`application/json`));
    test(`Comments count is changed`, async () => {
      await request(app)
        .get(`/articles/5/comments`)
        .expect((res) => expect(res.body.length).toBe(1));
    });
  });

  describe(`API refuses to create a comment to a non-existent post`, () => {
    test(`Status code 404`, async () => {
      const app = await createAPI();

      await request(app)
        .post(`/articles/20/comments`)
        .send({
          test: `Неважно`
        })
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API refuses to create a comment if data is invalid`, () => {
    const invalidComments = [{}, {text: `too short`, userId: 1}, {text: `Не указан userId`}];
    let app;
    let response;

    for (const comment of invalidComments) {
      beforeAll(async () => {
        app = await createAPI();

        response = await request(app)
          .post(`/articles/5/comments`)
          .send(comment);
      });

      test(`Status code 400`, () => expect(response.statusCode).toBe(HttpCode.BAD_REQUEST));
      test(`Comments count isn't changed`, async () => {
        await request(app)
          .get(`/articles/5/comments`)
          .expect((res) => expect(res.body.length).toBe(0));
      });
    }
  });
});
