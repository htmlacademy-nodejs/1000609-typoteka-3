'use strict';

const express = require(`express`);
const request = require(`supertest`);

const {HttpCode} = require(`../../constants`);
const post = require(`./post`);
const DataService = require(`../data-service/post`);
const CommentService = require(`../data-service/comment`);

const mockData = [
  {
    id: `7CcE77`,
    title: `Как перестать беспокоиться и начать жить`,
    createdDate: `2021-04-28 01:21:31`,
    announce: `Маленькими шагами. Стоит только немного постараться и запастись книгами. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Не стоит идти в программисты, если вам нравятся только игры.`,
    fullText: `Для начала просто соберитесь. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Он обязательно понравится геймерам со стажем. Альбом стал настоящим открытием года. Помните, небольшое количество ежедневных упражнений лучше, чем один раз, но много. Ёлки — это не просто красивое дерево. Возьмите книгу новую книгу и закрепите все упражнения на практике. Он написал больше 30 хитов. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Игры и программирование разные вещи. Достичь успеха помогут ежедневные повторения. Процессор заслуживает особого внимания. Маленькими шагами.`,
    category: [`Железо`, `IT`, `Программирование`],
    comments: [
      {
        id: `QeF8QN`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Хочу такую же футболку :-) Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
      }, {
        id: `dVKa-0`,
        text: `Хочу такую же футболку :-) Мне кажется или я уже читал это где-то? Планируете записать видосик на эту тему?`,
      }, {
        id: `w_2OYi`,
        text: `Согласен с автором!`
      }
    ]
  }, {
    id: `EP8PdB`,
    title: `Учим HTML и CSS`,
    createdDate: `2021-04-11 17:21:13`,
    announce: `Как начать действовать? Достичь успеха помогут ежедневные повторения. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Маленькими шагами.`,
    fullText: `Он написал больше 30 хитов. Большой и яркий экран, мощнейший процессор — всё это в небольшом гаджете. Вы можете достичь всего. Освоить вёрстку несложно. Просто действуйте.`,
    category: [`Деревья`, `Кино`, `За жизнь`, `Программирование`],
    comments: []
  }, {
    id: `NYC34a`,
    title: `Рок — это протест`,
    createdDate: `2021-06-20 17:41:29`,
    announce: `Возьмите книгу новую книгу и закрепите все упражнения на практике.`,
    fullText: `Простые ежедневные упражнения помогут достичь успеха. Программировать не настолько сложно, как об этом говорят. Это один из лучших рок-музыкантов. Освоить вёрстку несложно. Рок-музыка всегда ассоциировалась с протестами. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Возьмите книгу новую книгу и закрепите все упражнения на практике. Для начала просто соберитесь. Так ли это на самом деле? Бороться с прокрастинацией несложно.`,
    category: [`Разное`, `Без рамки`],
    comments: [
      {
        id: `GTRSGu`,
        text: `Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Это где ж такие красоты? Совсем немного... Хочу такую же футболку :-)`,
      }
    ]
  }, {
    id: `x1P-iD`,
    title: `Как перестать беспокоиться и начать жить`,
    createdDate: `2021-04-04 02:48:49`,
    announce: `Собрать камни бесконечности легко, если вы прирожденный герой. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Золотое сечение — соотношение двух величин, гармоническая пропорция. Просто действуйте.`,
    fullText: `Рок-музыка всегда ассоциировалась с протестами. Собрать камни бесконечности легко, если вы прирожденный герой. Вы можете достичь всего. Просто действуйте. Для начала просто соберитесь. Так ли это на самом деле? Бороться с прокрастинацией несложно. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Ёлки — это не просто красивое дерево. Этот смартфон — настоящая находка. Он написал больше 30 хитов.`,
    category: [`Музыка`, `Кино`, `Разное`],
    comments: [
      {
        id: `iQfmHD`,
        text: `Это где ж такие красоты? Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили. Мне кажется или я уже читал это где-то? Мне не нравится ваш стиль. Ощущение, что вы меня поучаете. Планируете записать видосик на эту тему? Хочу такую же футболку :-)`,
      }
    ]
  }, {
    id: `I0Bi8t`,
    title: `Самый лучший музыкальный альбом этого года`,
    createdDate: `2021-05-27 15:45:12`,
    announce: `Это прочная древесина. Не стоит идти в программисты, если вам нравятся только игры. Ёлки — это не просто красивое дерево. Собрать камни бесконечности легко, если вы прирожденный герой.`,
    fullText: `Вы можете достичь всего. Просто действуйте. Альбом стал настоящим открытием года. Он написал больше 30 хитов. Достичь успеха помогут ежедневные повторения. Как начать действовать? Так ли это на самом деле? Освоить вёрстку несложно.`,
    category: [`Программирование`, `Без рамки`, `За жизнь`, `IT`, `Разное`, `Железо`, `Деревья`],
    comments: []
  }
];

const createAPI = (data = mockData) => {
  const app = express();
  const clonedData = JSON.parse(JSON.stringify(data));
  app.use(express.json());
  post(app, new DataService(clonedData), new CommentService());
  return app;
};

describe(`Post`, () => {
  describe(`API returns a list of all posts`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/articles`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Content-Type application/json`, () => expect(response.type).toBe(`application/json`));
    test(`Returns a list of 5 posts`, () => expect(response.body.length).toBe(5));
    test(`First post's id equals "7CcE77"`, () => expect(response.body[0].id).toBe(`7CcE77`));
  });

  describe(`API handles the situation when the are no posts`, () => {
    const mockEmptyData = [];
    const app = createAPI(mockEmptyData);
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/articles`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Returns an empty list`, () => expect(response.body).toEqual([]));
  });

  describe(`API returns a post with given id`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/articles/EP8PdB`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Content-Type application/json`, () => expect(response.type).toBe(`application/json`));
    test(`Returns an object with correct structure`, () => expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          title: expect.any(String),
          createdDate: expect.any(String),
          announce: expect.any(String),
          fullText: expect.any(String),
          category: expect.any(Array),
          comments: expect.any(Array)
        })
    ));
    test(`Post's title is "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));
  });

  describe(`API handles getting a post with a non-existent id`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .get(`/articles/NOEXST`);
    });

    test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  });

  describe(`API creates a post if data is valid`, () => {
    const newPost = {
      title: `Заголовок публикации`,
      createdDate: `2021-01-12 00:00:00`,
      announce: `Анонс публикации`,
      fullText: `Полный текст публикации`,
      category: [`Категория публикации`]
    };

    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .post(`/articles`)
        .send(newPost);
    });

    test(`Status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
    test(`Content-Type application.json`, () => expect(response.type).toBe(`application/json`));
    test(`Returns post created`, () => expect(response.body).toEqual(
        expect.objectContaining(newPost)
    ));
    test(`Posts count is changed`, async () => {
      await request(app)
        .get(`/articles`)
        .expect((res) => expect(res.body.length).toBe(6));
    });
  });

  describe(`API refuses to create a post if data is invalid`, () => {
    const newPost = {
      title: `Заголовок публикации`,
      createdDate: `2021-01-12 00:00:00`,
      announce: `Анонс публикации`,
      fullText: `Полный текст публикации`,
      category: [`Категория публикации`]
    };

    test(`Without any required property response code is 400`, async () => {
      const app = createAPI();

      for (const key of Object.keys(newPost)) {
        const badPost = {...newPost};
        delete badPost[key];
        await request(app)
          .post(`/articles`)
          .send(badPost)
          .expect(HttpCode.BAD_REQUEST);
      }
    });

    test(`Posts count isn't changed`, async () => {
      const app = createAPI();
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
      title: `Заголовок публикации`,
      createdDate: `2021-01-12 00:00:00`,
      announce: `Анонс публикации`,
      fullText: `Полный текст публикации`,
      category: [`Категория публикации`]
    };

    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .put(`/articles/NYC34a`)
        .send(newPost);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Content-Type application/json`, () => expect(response.type).toBe(`application/json`));
    test(`Returns changed post`, () => expect(response.body).toEqual(
        expect.objectContaining(newPost)
    ));
    test(`Post is really changed`, async () => {
      await request(app)
        .get(`/articles/NYC34a`)
        .expect((res) => expect(res.body.title).toBe(`Заголовок публикации`));
    });
  });

  describe(`API refuses to change a non-existent post`, () => {
    const newPost = {
      title: `Заголовок публикации`,
      createdDate: `2021-01-12 00:00:00`,
      announce: `Анонс публикации`,
      fullText: `Полный текст публикации`,
      category: [`Категория публикации`]
    };

    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .put(`/articles/NOEXST`)
        .send(newPost);
    });

    test(`Status code 404`, () => expect(response.statusCode).toBe(HttpCode.NOT_FOUND));
  });

  describe(`API refuses to change an existent post if data is invalid`, () => {
    const invalidPost = {
      title: `Заголовок публикации`,
      createdDate: `2021-04-07 00:00:00`,
      announce: `В которой есть ошибка`,
      fullText: `Отсутствует поле category`
    };

    const app = createAPI();

    test(`Status code 400`, async () => {
      await request(app)
        .put(`/articles/NYC34a`)
        .send(invalidPost)
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API correctly deletes a post`, () => {
    const app = createAPI();
    let response;

    beforeAll(async () => {
      response = await request(app)
        .delete(`/articles/x1P-iD`);
    });

    test(`Status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
    test(`Content-Type application/json`, () => expect(response.type).toBe(`application/json`));
    test(`Returns deleted post`, () => expect(response.body.id).toBe(`x1P-iD`));
    test(`Posts count is 4 now`, async () => {
      await request(app)
        .get(`/articles`)
        .expect((res) => expect(res.body.length).toBe(4));
    });
  });

  describe(`API refuses to delete a non-existent post`, () => {
    const app = createAPI();

    test(`Status code 404`, async () => {
      await request(app)
        .delete(`/articles/NOEXST`)
        .expect(HttpCode.NOT_FOUND);
    });
  });
});
