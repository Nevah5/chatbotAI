DROP DATABASE IF EXISTS chatbotAPI;
CREATE DATABASE chatbotAPI;
USE chatbotAPI;

CREATE TABLE apiTokens(
  ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  token VARCHAR(255) NOT NULL,
  created TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1)
);

CREATE TABLE requests(
  ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  tokenFK INT UNSIGNED NOT NULL,
  msg TEXT NOT NULL,
  received TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1),
  response TEXT,
  FOREIGN KEY (tokenFK) REFERENCES apiTokens(ID)
);

CREATE TABLE trainingdata(
  ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  ip VARCHAR(255) NOT NULL,
  created TIMESTAMP(1) NOT NULL DEFAULT CURRENT_TIMESTAMP(1)
);

INSERT INTO apiTokens (token) VALUES ('oz1DRx0rDFlNHKsg3u'); -- BOT TOKEN
INSERT INTO apiTokens (token) VALUES ('mix0~5o+iJYJqI-cc'); -- FRONTEND TOKEN