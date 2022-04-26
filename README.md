# About

This project is a chatbotAI with an API and a dedicated discord bot that talks with it. The bot sends the message from the user to the API where the AI generates a response.

# Discord BOT

## **_Commands_**

### /config

- toggle chat<br>
  Toggle a channel for the bot to listen to all messages. I would recommend doing that in a seperate channel.
- set api-noresponse_message<br>
  The message that the bots sends in a toggled chat channel when the API is not responding.
- set api-noresponse_status<br>
  The activity status of the bot when the API is not responding.
- reset api-noresponse_message<br>
  Resets the configuration to default.
- reset api-noresponse_status<br>
  Resets the configuration to default.
- show<br>
  Show all configured configurations.

### /broadcast

Broadcast a message to all chat channels.

# API

## What is an API?

An API (Application Programming Interface) is an interface for programmers, often to gather data and information. An example is the YouTube API. You can request certain data with it, such like the amount of likes of a video or the number of views. While browsing YouTube the API makes such request to a so called "backend" without you noticing.

I have also made one, so that the code is more clean and the chatbot could also be used with a nice interface on a website.

## Request Data from the API

The API is hosted on https://chatbotapi.nevah5.com.

There are multiple endpoints from where you can gather data. Those are listed below:

### GET /ping

This is an endpoint to verify the version and that the API is working.

### POST /verify

This endpoint can verify your API token.

Should return "200 - Ok!", on invalid token "401 - Invalid Token!"

Required headers:

- token - YOUR_API_TOKEN

### POST /signup

This endpoint is for creating a new token to access the api.

Should return "201 - Created!" with the new token in the "token" field. On invalid token "401 - Invalid Token!".

Required headers:

- token - YOUR_API_TOKEN

### POST /response

With this endpoint you can get a response from the AI.

Should return "200 - Ok!" with a "response" field.

Required headers:

- token - YOUR_API_TOKEN
- message - YOUR_MESSAGE

### GET /changelog/:id

This endpoint returns you the changelog from a specific API version.

Example: /changelog/0.0.6

Should return "200 - Ok!" with the changelog field. If the changelog does not exist "400 - Version Not Found!".

### POST /train/question

This endpoint is specifically for training. It gives you a possible user question to the AI that you can answer with /train.

Should return "200 - Ok!" with the "question" field.

### POST /train

This endpoint is for training the API with a question from the /train/question endpoint. You give this question to into the "question" header and an answer how the AI should react to it in "answer".

Should return "200 - Ok!", if invalid token "401 - Invalid Token!".

Required headers:

- token - YOUR_API_TOKEN
- question - QUESTION_HERE
- answer - YOUR_ANSWER

### GET /train/save

This is to save all the training data into a json for training the AI.

Should return "201 - Created!".
