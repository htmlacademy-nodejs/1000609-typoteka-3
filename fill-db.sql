-- adds users
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
('thotiana@example.com', 'c759a574f632587383762498c0c51c64', 'Анастасия', 'Самбука', 'avatar1.jpg'),
('blueface@example.com', '94cf220f9e866283105f85be6acbc3b4', 'Глеб', 'Безухов', 'avatar2.jpg');

-- adds categories
INSERT INTO categories(name) VALUES
('Деревья'),
('За жизнь'),
('Без рамки'),
('Разное'),
('IT'),
('Музыка'),
('Кино'),
('Программирование'),
('Железо');

-- adds posts
INSERT INTO posts(title, announcement, full_text, picture, user_id) VALUES
('Самый лучший музыкальный альбом этого года', 'Мощные гитарные рифы и скоростные соло-партии не дадут заскучать.', 'Альбом стал настоящим открытием года. Это один из лучших рок-музыкантов. Он написал больше 30 хитов.', 'image1.jpg', 1),
('Ёлки. История деревьев', 'Ёлки — это не просто красивое дерево. Так ли это на самом деле?', 'Первая большая ёлка была установлена только в 1938 году.', null, 1),
('Обзор новейшего смартфона', 'Он обязательно понравится геймерам со стажем.', null, 'image2.jpg', 2);

-- adds categories and posts references
INSERT INTO posts_categories(post_id, category_id) VALUES
(1, 2),
(1, 4),
(1, 6),
(2, 1),
(2, 2),
(2, 4),
(3, 9);

-- adds comments
INSERT INTO comments(text, post_id, user_id) VALUES
('Согласен с автором! Планируете записать видосик на эту тему?', 1, 1),
('Хочу такую же футболку :-)', 1, 2),
('Плюсую, но слишком много буквы!', 1, 1),
('Мне кажется или я уже читал это где-то?', 2, 2),
('Это где ж такие красоты? Планируете записать видосик на эту тему?', 2, 1),
('Совсем немного... Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.', 3, 1),
('Согласен с автором! Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.', 3, 2);