import sys
import spacy
nlp = spacy.load("en_core_web_sm")
from xmlrpc.server import SimpleXMLRPCServer
from chatterbot import ChatBot

argumentList = sys.argv
hostAddress = '0.0.0.0'
port = '12345'
server = SimpleXMLRPCServer((hostAddress, int(port)))

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

def run():
    return bot.get_response(argumentList[1])

server.register_function(run)
server.serve_forever()