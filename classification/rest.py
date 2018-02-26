import atexit
import json
import os

import metrics_tracker_client
# use natural language toolkit
import nltk
from cloudant import Cloudant
from flask import Flask, render_template, request

from classifier.classifier import Classifier
from classifier.startup import populate
from classifier.trainer import Trainer
###
# Text Classification using Artificial Neural Networks (ANN)
# Based on https://machinelearnings.co/text-classification-using-neural-networks-f5cd7b8765c6
###


nltk.download('punkt')

# Emit Bluemix deployment event
metrics_tracker_client.DSX('org/repo')

app = Flask(__name__)

client = None
db = None

if 'VCAP_SERVICES' in os.environ:
    vcap = json.loads(os.getenv('VCAP_SERVICES'))
    print('Found VCAP_SERVICES')
    if 'cloudantNoSQLDB' in vcap:
        creds = vcap['cloudantNoSQLDB'][0]['credentials']
        user = creds['username']
        password = creds['password']
        url = 'https://' + creds['host']
        client = Cloudant(user, password, url=url, connect=True)
elif os.path.isfile('vcap-local.json'):
    with open('vcap-local.json') as f:
        vcap = json.load(f)
        print('Found local VCAP_SERVICES')
        creds = vcap['services']['cloudantNoSQLDB'][0]['credentials']
        user = creds['username']
        password = creds['password']
        url = 'https://' + creds['host']
        client = Cloudant(user, password, url=url, connect=True)

cache = dict()
if client:
    # populate database with base data and train all neuronal netwroks
    populate(client)

    # create Classifier cache on startup
    cache["intents"] = Classifier("intents", client)
    cache["intents"].load()
    cache["entities@weekdays"] = Classifier("entities@weekdays", client)
    cache["entities@weekdays"].load()
    cache["entities@meal"] = Classifier("entities@meal", client)
    cache["entities@meal"].load()

# On Bluemix, get the port number from the environment variable PORT
# When running this app on the local machine, default the port to 8000
port = int(os.getenv('PORT', 8000))


def removekey(d, key):
    r = dict(d)
    del r[key]
    return r


@app.route('/')
def home():
    return render_template('index.html')


# /**
#  * Endpoint to classify a conversation service request JSON for the intent.
#  *
#  * @return A JSON response with the classification
#  */
@app.route('/api/getIntent', methods=['POST'])
def getIntent():
    request_object = request.json
    sentence = request.json['sentence']
    if client:
        if 'intents' not in cache.keys():
            cache["intents"] = Classifier("intents", client)

        classifier = cache["intents"]

        results = classifier.classify(sentence)

        classification = dict()
        if len(results) > 0:
            classification['intent'] = results[0][0]
        else:
            classification['intent'] = ""

        request_object = removekey(request_object, "sentence")
        request_object["classifications"] = classification

        return request_object
#       For testing via Index.html
#        return 'Results: %s' % request_object


# /**
#  * Endpoint to classify a conversation service request JSON for its entity
#  * based on the priorIntent given.
#  *
#  * @return A JSON response with the classification
#  */
@app.route('/api/getEntity', methods=['POST'])
def getEntity():
    request_object = request.json
    sentence = request.json['sentence']
    prior_intents = request.json['context']["priorIntents"]["intent"]
    if client:
        classifier_name = "entities@" + prior_intents

        if classifier_name not in cache.keys():
            cache[classifier_name] = Classifier(classifier_name, client)

        classifier = cache[classifier_name]

        results = classifier.classify(sentence)

        classification = dict()
        if len(results) > 0:
            classification['entity'] = results[0][0]
        else:
            classification['entity'] = ""

        request_object = removekey(request_object, "sentence")
        request_object["classifications"] = classification

        return request_object
#       For testing via Index.html
#        return 'Results: %s' % request_object

# /**
#  * Endpoint to add a classification to a training set for classifying
#  * the intent.
#  *
#  * @return No response
#  */
@app.route('/api/addIntent/<sentence>/<intent>', methods=['POST'])
def addIntent(sentence, intent):
    if client:
        intents = Trainer("intents", client)
        intents.add_to_traingset(sentence, intent, True)


# /**
#  * Endpoint to train a neural network for classifying an intent.
#  *
#  * @return No response
#  */
@app.route('/api/trainIntents', methods=['POST'])
def trainIntents():
    if client:
        intents = Trainer("intents", client)
        intents.start_training()
        if 'intents' not in cache.keys():
            cache['intents'] = Classifier('intents', client)
        else:
            cache['intents'].load()


# /**
#  * Endpoint to add a classification to a training set for classifying
#  * the entities of an intent.
#  *
#  * @return No response
#  */
@app.route('/api/addEntity/<intent>/<sentence>/<entity>', methods=['POST'])
def addEntity(intent, sentence, entity):
    if client:
        classifier_name = "entities@" + intent
        entities = Trainer(classifier_name, client)
        entities.add_to_traingset(sentence, entity, True)


# /**
#  * Endpoint to train a neural network for classifying the entities of an intent.
#  *
#  * @return No response
#  */
@app.route('/api/trainEntity/<intent>', methods=['POST'])
def trainEntity(intent):
    if client:
        classifier_name = "entities@" + intent
        entities = Trainer(classifier_name, client)
        entities.start_training()
        if classifier_name not in cache.keys():
            cache[classifier_name] = Classifier(classifier_name, client)
        else:
            cache[classifier_name].load()


@atexit.register
def shutdown():
    if client:
        client.disconnect()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)