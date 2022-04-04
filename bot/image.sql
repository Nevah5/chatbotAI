DROP DATABASE IF EXISTS chatbotBot;
CREATE DATABASE chatbotBot;
USE chatbotBot;

CREATE TABLE config(
  ID VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO config VALUES
('api_noresponse', 'The API is currently not online.\nPlease have patience while the\nissue is getting resolved.'),
('bot-training_channel', '960281525130235996');