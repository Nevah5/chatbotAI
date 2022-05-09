import spacy
spacy.load('en_core_web_sm')

from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer

bot = ChatBot(
    'Bot',
    storage_adapter={
        'import_path': 'chatterbot.storage.SQLStorageAdapter',
        'database_uri': 'sqlite:///ai.db'
    },
    logic_adapters=[
        'chatterbot.logic.MathematicalEvaluation',
        'chatterbot.logic.TimeLogicAdapter',
        'chatterbot.logic.BestMatch'
    ],
    read_only=True
)

print(bot.get_response('What time is it?'))

print(bot.get_response('What is 7 plus 7?'))