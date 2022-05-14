FROM node:16
WORKDIR /usr/src/chatbotAI/nodejsAPI
COPY ./bot/package*.json .
RUN npm install
COPY ./bot/ .
CMD [ "node", "." ]
