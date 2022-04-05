DROP DATABASE IF EXISTS chatbotBot;
CREATE DATABASE chatbotBot;
USE chatbotBot;

CREATE TABLE config(
  ID VARCHAR(255) PRIMARY KEY,
  value TEXT NOT NULL
);

INSERT INTO config VALUES
('api-noresponse', 'The API is currently not online.\nPlease have patience while the\nissue is getting resolved.'),
('bot-training_channel', '960281525130235996'),
('api-lastversion', '0.0.1');


CREATE TABLE chats(
  ID INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  channelId VARCHAR(18) NOT NULL
);