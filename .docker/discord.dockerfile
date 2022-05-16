FROM node:16
WORKDIR /opt/chatbotAI/discordbot
COPY ./bot/package*.json .
RUN npm install
COPY ./bot/ .
CMD [ "node", "." ]
