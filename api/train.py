import spacy
spacy.load('en_core_web_sm')

from chatterbot import ChatBot
# from chatterbot.trainers import ListTrainer
from chatterbot.trainers import ChatterBotCorpusTrainer

bot = ChatBot(
    'Bot',
    storage_adapter={
        'import_path': 'chatterbot.storage.SQLStorageAdapter',
        'database_uri': 'sqlite:///ai.db'
    },
    logic_adapters=[
        # 'chatterbot.logic.MathematicalEvaluation',
        #'chatterbot.logic.TimeLogicAdapter',
        'chatterbot.logic.BestMatch'
    ]
)

# trainer = ListTrainer(bot)
trainer = ChatterBotCorpusTrainer(bot)
trainer.train('chatterbot.corpus.english')
# trainer.train("./data/conversations.yml")

#trainer.export_for_training('./exported_conversation.json')

while True:
    inp = input("User: ")
    if inp == "quit": quit(1)
    response = bot.get_response(inp)
    print(f"Bot: {response}")