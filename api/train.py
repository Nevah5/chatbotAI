import spacy
spacy.load('en_core_web_sm')

from chatterbot import ChatBot
from chatterbot.conversation import Statement

bot = ChatBot(
    'Bot',
    storage_adapter={
        'import_path': 'chatterbot.storage.SQLStorageAdapter',
        'database_uri': 'sqlite:///ai.db'
    },
    logic_adapters=[
        'chatterbot.logic.BestMatch'
    ]
)

def get_feedback():

    text = input()

    if 'yes' in text.lower():
        return True
    elif 'no' in text.lower():
        return False
    else:
        print('Please type either "Yes" or "No"')
        return get_feedback()


print('Type something to begin...')

# The following loop will execute each time the user enters input
while True:
    try:
        input_statement = Statement(text=input())
        response = bot.generate_response(
            input_statement
        )

        print('\n Is "{}" a coherent response to "{}"? \n'.format(
            response.text,
            input_statement.text
        ))
        if get_feedback() is False:
            print('please input the correct one')
            correct_response = Statement(text=input())
            bot.learn_response(correct_response, input_statement)
            print('Responses added to bot!')

    # Press ctrl-c or ctrl-d on the keyboard to exit
    except (KeyboardInterrupt, EOFError, SystemExit):
        break