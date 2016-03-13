-- Table definitions for the tournament project.
--
-- Put your SQL 'create table' statements in this file; also 'create view'
-- statements if you choose to use it.
--
-- You can write comments in this file by starting them with two dashes, like
-- these lines here.

DROP DATABASE IF EXISTS tournament;
CREATE DATABASE tournament;
\c tournament

DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;

CREATE TABLE players (
    name TEXT NOT NULL,
    id SERIAL PRIMARY KEY
);

CREATE TABLE matches (
    winner INTEGER,
    loser INTEGER,
    id SERIAL PRIMARY KEY,
    FOREIGN KEY (winner) REFERENCES players (id) ON DELETE CASCADE,
    FOREIGN KEY (loser) REFERENCES players (id) ON DELETE CASCADE,
    CHECK (winner <> loser)
);

CREATE VIEW winner_count AS (
    SELECT
        players.id,
        players.name,
        COUNT(matches.winner) AS total_wins
    FROM players LEFT JOIN matches
    ON players.id = matches.winner
    GROUP BY players.id
);

CREATE VIEW matches_count AS (
    SELECT
        players.id,
        players.name,
        COUNT(matches) AS total_matches
    FROM players LEFT JOIN matches
    ON players.id = matches.winner OR players.id = matches.loser
    GROUP BY players.id
);

CREATE OR REPLACE VIEW standings AS (
    SELECT
        winner_count.id,
        winner_count.name,
        winner_count.total_wins,
        matches_count.total_matches
    FROM winner_count JOIN matches_count
    ON winner_count.id = matches_count.id
    ORDER BY winner_count.total_wins DESC
);
