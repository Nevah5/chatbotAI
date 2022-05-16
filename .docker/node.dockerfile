FROM node:16
WORKDIR /usr/src/chatbotAI/nodejsAPI
COPY ./api/package*.json .
RUN npm install
COPY ./api/ .
EXPOSE 3000
CMD [ "node", "." ]
