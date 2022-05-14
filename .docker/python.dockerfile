FROM python:3.7
WORKDIR /usr/src/chatbotAI/pythonAI
COPY api/ai/ ./
RUN pip install chatterbot
RUN pip install spacy
CMD [ "python", "./api/ai/chatbot.py" ]
