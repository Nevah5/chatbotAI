DROP DATABASE IF EXISTS chatbotAI;
CREATE DATABASE chatbotAI;
USE chatbotAI;

CREATE TABLE apiTokens(
  ID INT UNSIGNED PRIMARY KEY,
  token VARCHAR(255) NOT NULL UNIQUE
);
