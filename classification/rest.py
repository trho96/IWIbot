# -*- coding: utf-8 -*-
import atexit
import json
import os
import requests

import cf_deployment_tracker
import metrics_tracker_client
# use natural language toolkit
import nltk
from classifier.classifier import Classifier
from classifier.startup import populate
from classifier.trainer import Trainer
from cloudant import Cloudant, CouchDB
from flask import Flask, render_template, request, jsonify, make_response
# from flask_triangle import Triangle
from flask_cors import CORS

###
# Text Classification using Artificial Neural Networks (ANN)
# Based on https://machinelearnings.co/text-classification-using-neural-networks-f5cd7b8765c6
###


nltk.download('punkt')

# Emit Bluemix deployment event
cf_deployment_tracker.track()
metrics_tracker_client.DSX('org/repo')

app = Flask(__name__)

# Enable CORS support for this API
CORS(app)

# Use Triangle to be able to use angular expressions like {{ }}
# This is needed because jinja - Flask's template engine - also uses {{ }}
# A filter is added so you can use eg. {{ entity | angular}} in the template
# --> see https://stackoverflow.com/questions/32147748/flask-and-angularjs
# You can also achieve this by using {{ '{{value}}' }}
# Triangle(app)

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
        #client = Cloudant(user, password, url=url, connect=True, auto_renew=True)
        client = CouchDB('iwibot', 'HSKA-IWIBOT-VSyS', url='https://kunkel24.de:6001', connect=True, auto_renew=True)
        client.create_database('trainer', throw_on_exists=False)
        client.create_database('synapse', throw_on_exists=False)
elif os.path.isfile('vcap-local.json'):
    with open('vcap-local.json') as f:
        vcap = json.load(f)
        print('Found local VCAP_SERVICES')
        creds = vcap['services']['cloudantNoSQLDB'][0]['credentials']
        user = creds['username']
        password = creds['password']
        url = 'https://' + creds['host']
        #client = Cloudant(user, password, url=url, connect=True, auto_renew=True)
        client = CouchDB(user, password, url=url, connect=True, auto_renew=True)
        client.create_database('trainer', throw_on_exists=False)
        client.create_database('synapse', throw_on_exists=False)

cache = dict()
if client is not None:
    # create Classifier cache on startup
    cache["intents"] = Classifier("intents", client)
    cache["entities@timetables"] = Classifier("entities@timetables", client)
    cache["entities@meal"] = Classifier("entities@meal", client)
    cache["entities@navigation"] = Classifier("entities@navigation", client)
    cache["entities@greeting"] = Classifier("entities@greeting", client)
    cache["entities@joke"] = Classifier("entities@joke", client)
    cache["entities@notAtAll"] = Classifier("entities@notAtAll", client)
    cache["entities@weather"] = Classifier("entities@weather", client)
    cache["entities@who"] = Classifier("entities@who", client)
    cache["entities@learn"] = Classifier("entities@learn", client)
    cache["entities@test"] = Classifier("entities@test", client)

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

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)


# /**
#  * Endpoint to train a neural network for classifying an intent.
#  *
#  * @return No response
#  */
@app.route('/api/v1/intents', methods=['POST'])
def trainIntents():
    if client is not None:
        intents = Trainer("intents", client)
        intents.start_training()
        cache['intents'].load()

        return jsonify([])
    else:
        print("NO DATABASE")
        return "NO DATABASE"
# /**
#  * Endpoint for receiving all intents
#  *
#  * @return intents JSON
#  */
@app.route('/api/v1/intents', methods=['GET'])
def getIntents():
    intents = client['trainer']['intents']['training_data']
    entities = dict()
    sentences = dict()
    new_intents = list()
    names = set()

    # menge der namen bilden, sowie entities und sentences ihrem intent zuordnen
    for intent in intents:
        names.add(intent['name'])
        entities[intent['name']] = intent['entities']
        sentences[intent['name']] = intent['sentences']

    # füge die einzelnen intents zusammen
    for name in names:
        new_intents.append({'name': name, 'sentences': sentences[name], 'entities': entities[name]})
    return jsonify(new_intents)

# /**
#  * Endpoint to add a classification to a training set for classifying
#  * the intent.
#  *
#  * @return No response
#  */
@app.route('/api/v1/intent', methods=['PUT'])
def addIntent():
    name = request.json['name']
    sentences = request.json['sentences']
    entities = request.json['entities']

    if client is not None:
        # Create empty synapses
        cache['entities@' + name] = Classifier('entities@' + name, client)
        # Create empty training_data
        entities_trainer = Trainer('entities@' + name, client)

        if len(entities) > 0:
            entries = client['trainer']['entities']['training_data']
            count = 0

            # Add the existing entities to the training_data
            for entry in entries:
                if count >= len(entities):
                    break

                for entity in entities:
                    if entry['name'] == entity:
                        entities_trainer.add_entity_to_trainingset(entry['words'], entry['name'])
                        count += 1

        intents = Trainer("intents", client)
        intents.add_intent_to_trainingset(sentences, name, entities, True)

        return jsonify([])
    else:
        print("NO DATABASE")
        return "NO DATABASE"

@app.route('/api/v1/intent', methods=['PATCH'])
def updateIntent():
    name = request.json['name']
    sentences_to_add = request.json['sentencesToAdd']
    entities_to_add = request.json['entitiesToAdd']
    sentences_to_remove = request.json['sentencesToRemove']
    entities_to_remove = request.json['entitiesToRemove']

    if client is not None:
        entries = client['trainer']['entities']['training_data']
        entities_trainer = Trainer('entities@' + name, client)

        for entry in entries:
            for entity in entities_to_add:
                if entry['name'] == entity:
                    entities_trainer.add_entity_to_trainingset(entry['words'], entry['name'])
            for entity in entities_to_remove:
                if entry['name'] == entity:
                    entities_trainer.remove_entity_from_trainingset(entry['words'], entry['name'])

        intents = Trainer("intents", client)
        intents.update_intent_in_trainingset(sentences_to_add, sentences_to_remove, entities_to_add, entities_to_remove, name)

        return jsonify([])
    else:
        print("NO DATABASE")
        return "NO DATABASE"

@app.route('/api/v1/intent', methods=['DELETE'])
def deleteIntent():
    name = request.data.decode('UTF-8')

    if client is not None:
        intents = Trainer("intents", client).remove_intent_from_trainingset_by_name(name)
        client['synapse']['entities@' + name].delete()
        client['trainer']['entities@' + name].delete()

        return jsonify([])
    else:
        print("NO DATABASE")
        return "NO DATABASE"

# /**
#  * Endpoint to classify a conversation service request JSON for the intent.
#  *
#  * @return A JSON response with the classification
#  */
@app.route('/api/v1/intent', methods=['POST'])
def classifySentence():
    request_object = request.json
    sentence = request.json['sentence']
    if client is not None:
        classification = dict()

        if sentence == 'populate':
            # populate database with base data and train all neuronal netwroks
            populate(client, cache)

            classification['intent'] = 'Populated'
        else:
            # get the intent
            if 'intents' not in cache.keys():
                cache['intents'] = Classifier('intents', client)

            classifier = cache['intents']

            results = classifier.classify(sentence)

            if len(results) > 0:
                i = 0
                for result in results:
                    results[i] = {'name': result[0], 'probability': result[1]}
                    i += 1
                classification['intents'] = results
                classification['intent'] = results[0]['name']
            else:
                classification['intents'] = []
                classification['intent'] = ''

            del results
            results = []

            # get the entity if possible
            name = 'entities@' + classification['intent']

            if name in cache.keys():
                results = cache[name].classify(sentence, show_details=True)

            if len(results) > 0:
                i = 0
                for result in results:
                    results[i] = {'name': result[0], 'probability': result[1]}
                    i += 1
                classification['entities'] = results
                classification['entity'] = results[0]['name']
            else:
                classification['entities'] = []
                classification['entity'] = ''

    else:
        print('NO DATABASE')

        classification = dict()
        classification['intent'] = 'NO DATABASE'
        classification['intents'] = []

    response_object = removekey(request_object, 'sentence')
    response_object['context']['priorIntent'] = dict()
    response_object['context']['priorIntent']['name'] = classification['intent']
    response_object['context']['priorIntent']['sentence'] = sentence
    response_object['classifications'] = classification

    return jsonify(response_object)

# /**
#  * Endpoint to train a neural network for classifying the entities of an intent.
#  *
#  * @return No response
#  */
@app.route('/api/v1/entities', methods=['POST'])
def trainEntities():
    if client is not None:
        for name in cache.keys():
            if 'entities@' in name:
                trainer = Trainer(name, client)
                trainer.start_training(entities=True)
                cache[name].load()

        return jsonify([])
    else:
        print('NO DATABASE')
        return 'NO DATABASE'

@app.route('/api/v1/entities', methods=['GET'])
def getEntities():
    entities = client['trainer']['entities']['training_data']
    words = dict()
    names = set()
    newEntities = list()

    # menge der namen bilden, sowie entities und sentences ihrem intent zuordnen
    for entity in entities:
        names.add(entity['name'])
        words[entity['name']] = entity['words']

    for name in names:
        newEntities.append({'name': name, 'words': words[name]})

    return jsonify(newEntities)

# /**
#  * Endpoint to add a classification to a training set for classifying
#  * the entities of an intent.
#  *
#  * @return No response
#  */
@app.route('/api/v1/entity', methods=['PUT'])
def addEntity():
    name = request.json['name']
    words = request.json['words']

    if client is not None:
        Trainer('entities', client).add_entity_to_trainingset(words, name)

        return jsonify([])
    else:
        print('NO DATABASE')
        return 'NO DATABASE'

@app.route('/api/v1/entity', methods=['PATCH'])
def updateEntity():
    words_to_add = request.json['wordsToAdd']
    words_to_remove = request.json['wordsToRemove']
    name = request.json['name']

    if client is not None:
        for n in cache.keys():
            if 'entities@' in n:
                Trainer(n, client).update_entity_in_trainingset(words_to_add, words_to_remove, name)

        Trainer('entities', client).update_entity_in_trainingset(words_to_add, words_to_remove, name)

        return jsonify([])
    else:
        print('NO DATABASE')
        return 'NO DATABASE'

@app.route('/api/v1/entity', methods=['DELETE'])
def deleteEntity():
    name = request.data.decode('UTF-8')

    if client is not None:
        for n in cache.keys():
            if 'entities@' in n:
                Trainer(n, client).remove_entity_from_trainingset_by_name(name)

        Trainer('entities', client).remove_entity_from_trainingset_by_name(name)

        return jsonify([])
    else:
        print('NO DATABASE')
        return 'NO DATABASE'


@app.route('/api/v1/train', methods=['POST'])
def train():
    if client is not None:
        # train all Networks
        for name in cache.keys():
            trainer = Trainer(name, client)
            # train and reload the cache
            if 'entities@' in name:
                trainer.start_training(entities=True)
            else:
                trainer.start_training()
            cache[name].load()

        return jsonify(['SUCCESS'])
    else:
        print('NO DATABASE')
        return 'NO DATABASE'

@atexit.register
def shutdown():
    if client is not None:
        client.disconnect()


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=port, debug=True)
