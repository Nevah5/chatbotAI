FROM python:3.7
WORKDIR /usr/src/chatbotAI/pythonAI
COPY ./api/ai/ .
RUN pip install chatterbot
RUN pip install spacy
RUN python -m spacy download en_core_web_sm
CMD [ "python", "chatbot.py" ]
