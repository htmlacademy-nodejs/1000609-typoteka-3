-- Список всех категорий
SELECT * from categories;

-- Список категорий, для которых создана минимум одна публикация
SELECT id, name FROM categories
    JOIN posts_categories
    ON id = category_id
    GROUP BY id
    ORDER BY id;

-- Список категорий с количеством публикаций
SELECT id, name, COUNT(post_id) FROM categories
    LEFT JOIN posts_categories
    ON id = posts_categories.category_id
    GROUP BY id
    ORDER BY id;

-- Список публикаций
SELECT posts.id, posts.title, posts.announcement, posts.published_at,
    users.first_name,
    users.last_name,
    users.email,
    COUNT(DISTINCT comments.id) AS comments_counts,
    STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM posts
    JOIN posts_categories ON posts.id = posts_categories.post_id
    JOIN categories ON posts_categories.category_id = categories.id
    LEFT JOIN comments ON comments.post_id = posts.id
    JOIN users ON users.id = posts.user_id
    GROUP BY posts.id, posts.published_at, users.id
    ORDER BY posts.published_at DESC;

-- Полная информация определённой публикации
SELECT posts.id, posts.title, posts.announcement, posts.full_text, posts.published_at, posts.picture,
    users.first_name,
    users.last_name,
    users.email,
    COUNT(DISTINCT comments.id) AS comments_counts,
    STRING_AGG(DISTINCT categories.name, ', ') AS category_list
FROM posts
    JOIN posts_categories ON posts.id = posts_categories.post_id
    JOIN categories ON posts_categories.category_id = categories.id
    LEFT JOIN comments ON comments.post_id = posts.id
    JOIN users ON users.id = posts.user_id
WHERE posts.id = 1
    GROUP BY posts.id, users.id;

-- Список из 5 свежих комментариев
SELECT
    comments.id,
    comments.post_id,
    users.first_name,
    users.last_name,
    comments.text
FROM comments
    JOIN users ON comments.user_id = users.id
    ORDER BY comments.published_at DESC
    LIMIT 5;

-- Список комментариев для определённой публикации
SELECT
    comments.id,
    comments.post_id,
    users.first_name,
    users.last_name,
    comments.text
FROM comments
    JOIN users ON comments.user_id = users.id
WHERE comments.post_id = 1
    ORDER BY comments.published_at DESC;

-- Обновить заголовок определённой публикации на «Уникальное предложение!»
UPDATE posts
SET title = 'Как я встретил Новый год'
WHERE id = 1;
