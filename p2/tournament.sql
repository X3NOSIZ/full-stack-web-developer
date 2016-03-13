-- Table definitions for the tournament project.
--
-- Put your SQL 'create table' statements in this file; also 'create view'
-- statements if you choose to use it.
--
-- You can write comments in this file by starting them with two dashes, like
-- these lines here.

DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;

CREATE TABLE players (
    name TEXT NOT NULL,
    id SERIAL UNIQUE NOT NULL
);

CREATE TABLE matches (
    winner INTEGER,
    loser INTEGER,
    id SERIAL UNIQUE NOT NULL,
    FOREIGN KEY (winner) REFERENCES players (id),
    FOREIGN KEY (loser) REFERENCES players (id),
    CHECK (winner <> loser)
);
