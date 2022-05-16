FROM python:3.7
WORKDIR /usr/src/chatbotAI/pythonAI
COPY ./api/ai/ .
RUN pip install chatterbot==1.0.8
RUN pip install spacy==2.3.5
RUN python -m spacy download en
RUN python -m spacy download en_core_web_sm
CMD [ "python", "chatbot.py" ]
