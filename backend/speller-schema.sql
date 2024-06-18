CREATE TABLE chords (
    name VARCHAR(10) PRIMARY KEY,
    spelling VARCHAR NOT NULL,
    chord_chart TEXT
);

CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE songs (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    username VARCHAR(25)
        REFERENCES users ON DELETE CASCADE
);

CREATE TABLE song_chords (
    song_id INTEGER
        REFERENCES songs ON DELETE CASCADE,
    chord_name VARCHAR(10)
        REFERENCES chords ON DELETE CASCADE
);

