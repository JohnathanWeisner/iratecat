DROP DATABASE IF EXISTS gotdrawn;
CREATE DATABASE gotdrawn;

\c gotdrawn;

CREATE TABLE users (
    name varchar(20) PRIMARY KEY,
    is_submitter boolean,
    is_artist boolean,
    best_of_rgd_wins int,
    great_photos_wins int,
    is_annual_award_winner boolean
);

CREATE TABLE submissions (
    id varchar(12) PRIMARY KEY,
    author varchar(20) REFERENCES users (name),
    score int,
    over_18 boolean,
    domain varchar(40),
    preview text,
    gilded int,
    permalink varchar(150),
    created int,
    url varchar(220),
    title varchar(305),
    created_utc int,
    num_comments int,
    ups int,
    downs int,
    depth int
);

CREATE TABLE artwork (
    id varchar(12) PRIMARY KEY,
    submission_id varchar(12) REFERENCES submissions (id),
    likes int,
    score int,
    gilded int,
    author varchar(20) REFERENCES users (name),
    controversiality int,
    body text,
    downs int,
    created int,
    created_utc int,
    ups int,
    depth int,
    urls text[],
    replies text
);

CREATE INDEX best_of_rgd_idx ON users (best_of_rgd_wins);
CREATE INDEX score_idx ON artwork (score);
CREATE INDEX created_utc_idx ON artwork (created_utc);
CREATE INDEX author_idx ON artwork (author);
CREATE INDEX created_utc_sub_idx ON submissions (created_utc);
CREATE INDEX score_sub_idx ON submissions (score);
CREATE INDEX author_sub_idx ON submissions (author);
CREATE INDEX over_18_idx ON submissions (over_18);