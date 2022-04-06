# About

This project was originally made for PepperLand, a discord server from a YouTuber. Engjell asked me one day in school, if I could realize the idea and so I did.

# Discord BOT

### **_Default Settings_**

Training Channel: _none_<br>
Chat Channels: _none_

## **_Commands_**

### /config

- toggle chat<br>
  Toggle a channel for the bot to listen to all messages. I would recommend doing that in a seperate channel.
- set training<br>
  A channel that should be the most active with meaningful message contents for the AI to learn from.
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

# API

## What is an API?

An API (Application Programming Interface) is an interface for programmers, often to gather data and information. An example is the YouTube API. You can request certain data with it, such like the amount of likes of a video or the number of views. While browsing YouTube the API makes such request to a so called "backend" without you noticing.

I have also made one, so that the code is more clean and the chatbot could also be used with a nice interface on a website.

## Request Data from the API

The API is hosted on chatbotapi.nevah5.com (**currently offline**).

There are multiple endpoints from where you can gather data. Those are listed below:

- GET /ping<be>
  An endpoint to verify the version and that the API is online.
- GET /verify<br>
  To verify the API token. Should send 200 Ok!
- GET /signup<br>
  Request to get a new API token.

An example would be: https://chatbotapi.nevah5.com/ping.
