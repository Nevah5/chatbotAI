FROM node:16
WORKDIR /usr/src/chatbotAI/discordbot
COPY package*.json ./
RUN npm install
COPY bot/ .
EXPOSE 3000
CMD [ "node", "index.js" ]
