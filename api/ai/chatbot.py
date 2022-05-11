import sys
import spacy
nlp = spacy.load("en_core_web_sm")

from chatterbot import ChatBot

bot = ChatBot(
    'Bot',
    storage_adapter={
        'import_path': 'chatterbot.storage.SQLStorageAdapter',
        'database_uri': 'sqlite:///ai.db'
    },
    logic_adapters=[
        'chatterbot.logic.BestMatch'
    ],
    read_only=True
)

print(bot.get_response(sys.argv[1]))