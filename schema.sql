DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS posts_categories;

CREATE TABLE users(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email varchar(255) UNIQUE NOT NULL,
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    password_hash varchar(255) NOT NULL,
    avatar varchar(50)
);

CREATE TABLE categories(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name varchar(30) NOT NULL
);

CREATE TABLE posts(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title varchar(250) NOT NULL,
    picture varchar(50),
    published_at timestamp default current_timestamp,
    announcement varchar(250) NOT NULL,
    full_text text,
    user_id integer NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE comments(
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    published_at timestamp default current_timestamp,
    text text NOT NULL,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    FOREIGN KEY (post_id) REFERENCES posts(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE posts_categories(
    post_id integer NOT NULL,
    category_id integer NOT NULL,
    PRIMARY KEY (post_id, category_id),
    FOREIGN KEY (post_id) REFERENCES posts,
    FOREIGN KEY (category_id) REFERENCES categories
);

CREATE INDEX ON posts (title);
