# About

This project was originally made for PepperLand, a discord server from a YouTuber. Engjell asked me one day in school, if I could realize the idea and so I did.

# Discord BOT

### **_Default Settings_**

Training Channel: _none_<br>
Chat Channel: _none_

## **_Commands_**

- /config set training<br>
  Sets the channel, where the bot gets it's training data from.
- /config set chat<br>
  Sets the channel where the bot writes with the user.
- /status api<br>
  Show the current API status.
- /stats user user:<br>
  Show the stats of a user.
- /help<br>
  Show a menu with all commands.

# API

## What is an API?

An API (Application Programming Interface) is an interface for programmers, often to gather data and information. An example is the YouTube API. You can request certain data with it, such like the amount of likes of a video or the number of views. While browsing YouTube the API makes such request to a so called "backend" without you noticing.

I have also made one, so that the code is more clean and the chatbot could also be used with a nice interface on a website.

## Request Data from the API

The API is hosted on chatbotapi.nevah5.com (**currently offline**).

There are multiple endpoints from where you can gather data. Those are listed below:

- /ping
- /train

An example would be: https://chatbotapi.nevah5.com/ping.
