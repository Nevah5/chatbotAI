FROM node:16
WORKDIR /usr/src/chatbotAI/discordbot
COPY ./bot/package*.json .
RUN npm install
COPY ./bot/ .
CMD [ "node", "." ]
