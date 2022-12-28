-- SQLite
select * FROM sessions;

DELETE FROM sessions;
DELETE FROM sid_uid;

CREATE TABLE IF NOT EXISTS post (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    text_content TEXT,
    creation_date DATETIME NOT NULL,
    amend_date DATETIME,
    author_id INTEGER NOT NULL,
    FOREIGN KEY (id) REFERENCES user (id)
);

DROP TABLE IF EXISTS post;