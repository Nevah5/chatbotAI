import sys
import spacy
nlp = spacy.load("en_core_web_sm")
from xmlrpc.server import SimpleXMLRPCServer
from chatterbot import ChatBot

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

def run(input):
    output = bot.get_response(input)
    return str(output)

server.register_function(run)
server.serve_forever()
print(f'Listening on port {port}')