/**
 * Testfile for Testing the classifier-based conversation-logic and the classifier REST-Service
 * These tests are mainly here to make sure that the conversation-procedure is executed correctly.
 */

// =================================== Variables ===================================

var conversation = require('../lib/classifier-based-conversation/conversation');
var request = require('request');
var actionUrl = 'https://service.us.apiconnect.ibmcloud.com/gws/apigateway/api/' + process.env.WSK_API_CODE + '/iwibotTest/router';
var initParams = {
    use_unauthenticated: true,
    semester: 5,
    courseOfStudies: 'INFB',
    context: {
        conversation_id: process.env.CONVERSATION_ID,
        priorIntent:{
            intent : ''
        },
        system: {
            dialog_stack:[{dialog_node: 'root'}],
            dialog_turn_counter: 1,
            dialog_request_counter: 1,
            _node_output_map:{
                "Willkommen":[0]
            }
        }
    }
};
var responseBodyParsingError = "'responseBody' could not be parsed. Maybe it already has been parsed. Please check in tests for conversation-service";
var genericError = conversation.genericErrorMessage;

// =================================== Router sentences ===================================

const jokeSentence =                    'Erzähle mir einen Witz !';
const weatherSentence =                 'Wie wird das Wetter ?';
const timetablesSentenceAll =           'Was steht am Donnerstag auf dem Stundenplan?';
const timetablesSentenceOnlyIntent =    'Was steht auf dem Stundenplan?';
const timetablesSentenceEntity =        'Mittwoch';
const mealSentenceAll =                 'Was gibt es als Wahlessen 1?';
const mealSentenceOnlyIntent =          'Was gibt es heute zu Essen?';
const mealSentenceEntity =              'Aktionstheke';
const garbageSentence =                 'Skidoodle';

console.log("=========================================================================================================");
console.log("                                         Start Conversation-Tests                                        ");
console.log("=========================================================================================================");
console.log("generic error message:         ", genericError);
console.log("action url:                    ", actionUrl);
console.log("=========================================================================================================");
console.log("jokeSentence:                  ", jokeSentence);
console.log("weatherSentence:               ", weatherSentence);
console.log("timetablesSentenceAll:         ", timetablesSentenceAll);
console.log("timetablesSentenceOnlyIntent:  ", timetablesSentenceOnlyIntent);
console.log("timetablesSentenceEntity:      ", timetablesSentenceEntity);
console.log("mealSentenceAll:               ", mealSentenceAll);
console.log("mealSentenceOnlyIntent:        ", mealSentenceOnlyIntent);
console.log("mealSentenceEntity:            ", mealSentenceEntity);
console.log("garbageSentence:               ", garbageSentence);
console.log("=========================================================================================================");


// =================================== Tests ===================================

module.exports = {

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // :::::::::::::::::::::::::::::::::::::::::: Joke ::::::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    'Conversation Action Test (joke)' : function (test) {
        test.expect(2);
        console.log("\n ~~~~~ Run Conversation Action Test (joke) ~~~~~ \n")
        var options = buildRequestOptions(null, jokeSentence);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                test.done();
        });
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ::::::::::::::::::::::::::::::::::::::::: Weather ::::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    'Conversation Action Test (weather)' : function (test) {
        test.expect(2);
        console.log("\n ~~~~~ Run Conversation Action Test (weather) ~~~~~ \n")
        var options = buildRequestOptions(null, weatherSentence);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                test.done();
        });
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ::::::::::::::::::::::::::::::::::::::: Timetables :::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    'Conversation Action Test (timetables, one sentence)' : function (test) {
        test.expect(2);
        console.log("\n ~~~~~ Run Conversation Action Test (timetables, one sentence) ~~~~~ \n")
        var options = buildRequestOptions(null, timetablesSentenceAll);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                test.done();
        });
    },

    'Conversation Action Test (timetables, two sentences)' : function (test) {
        test.expect(4);
        console.log("\n ~~~~~ Run Conversation Action Test (timetables, two sentences) ~~~~~ \n");

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, timetablesSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, timetablesSentenceEntity);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        test.done();
                });
        });
    },

    'Conversation Action Test (timetables, abort timetables)' : function (test) {
        test.expect(4);
        console.log("\n ~~~~~ Run Conversation Action Test (timetables, abort timetables) ~~~~~ \n");

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, timetablesSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, jokeSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        test.done();
                });
        });
    },

    'Conversation Action Test (timetables, abort timetables, check if priorIntent is deleted)' : function (test) {
        test.expect(7);
        console.log("\n ~~~~~ Run Conversation Action Test (timetables, abort timetables, check if priorIntent is deleted) ~~~~~ \n")

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, timetablesSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, jokeSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        // ~~~~~~ Third Request ~~~~~~
                        var optionsStageTwo = buildRequestOptions(body, timetablesSentenceEntity);
                        request.post( optionsStageTwo,
                            function (err, response, body) {
                                consoleLog(body, err, response);
                                body = JSON.parse(body);
                                test.ok(typeof body.payload === 'string');
                                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                                test.ok(body.payload.indexOf(genericError) !== -1 );
                                test.done();
                        });
                });
        });
    },

    'Conversation Action Test (timetables, three sentences)' : function (test) {
        test.expect(6);
        console.log("\n ~~~~~ Run Conversation Action Test (timetables, three sentences) ~~~~~ \n")

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, timetablesSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, garbageSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        // ~~~~~~ Third Request ~~~~~~
                        var optionsStageTwo = buildRequestOptions(body, timetablesSentenceEntity);
                        request.post( optionsStageTwo,
                            function (err, response, body) {
                                consoleLog(body, err, response);
                                body = JSON.parse(body);
                                test.ok(typeof body.payload === 'string');
                                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                                test.done();
                        });
                });
        });
    },

    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // :::::::::::::::::::::::::::::::::::::::::: Meal ::::::::::::::::::::::::::::::::::::::::::
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    'Conversation Action Test (meal, one sentence)' : function (test) {
        test.expect(2);
        console.log("\n ~~~~~ Run Conversation Action Test (meal, one sentence) ~~~~~ \n")
        var options = buildRequestOptions(null, mealSentenceAll);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                test.done();
        });
    },

    'Conversation Action Test (meal, two sentences)' : function (test) {
        test.expect(4);
        console.log("\n ~~~~~ Run Conversation Action Test (meal, two sentences) ~~~~~ \n")

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, mealSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, mealSentenceEntity);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        test.done();
                });
        });
    },
    
    'Conversation Action Test (timetables, three sentences)' : function (test) {
        test.expect(6);
        console.log("\n ~~~~~ Run Conversation Action Test (timetables, three sentences) ~~~~~ \n")

        // ~~~~~~ First Request ~~~~~~
        var options = buildRequestOptions(null, mealSentenceOnlyIntent);
        request.post( options,
            function (err, response, body) {
                body = JSON.parse(body);
                consoleLog(body, err, response);
                test.ok(typeof body.payload === 'string');
                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);

                // ~~~~~~ Second Request ~~~~~~
                var optionsStageTwo = buildRequestOptions(body, garbageSentence);
                request.post( optionsStageTwo,
                    function (err, response, body) {
                        consoleLog(body, err, response);
                        body = JSON.parse(body);
                        test.ok(typeof body.payload === 'string');
                        test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                        
                        // ~~~~~~ Third Request ~~~~~~
                        var optionsStageTwo = buildRequestOptions(body, mealSentenceEntity);
                        request.post( optionsStageTwo,
                            function (err, response, body) {
                                consoleLog(body, err, response);
                                body = JSON.parse(body);
                                test.ok(typeof body.payload === 'string');
                                test.ok(body.payload.indexOf('Error') === -1 && body.payload.indexOf('error') === -1);
                                test.done();
                        });
                });
        });
    },

};


// =================================== Utilities for build test-options ===================================

function buildRequestOptions(responseBody, sentence) {
    var body = newRequestBody(responseBody, sentence);
    var options = {
        headers: {'content-type': 'text/plain'},
        url: actionUrl,
        body: JSON.stringify(body)
    };
    return options
}

/**
 * Build a new param-object with the old Response-Body's context and the requested sentence
 * @param {any} responseBody
 * @param {string} sentence
 */
function newRequestBody(responseBody, sentence) {
    try {
        responseBody = JSON.parse(responseBody);
    } catch (exception) {
        console.error(responseBodyParsingError);
    }
    var requestBody = initParams;
    if(responseBody && responseBody !== null && responseBody.context) {
        requestBody.context = responseBody.context;
    }
    if(sentence && sentence !== null) {
        requestBody.payload = sentence;
    }
    console.log('\n Request-Body \n' + JSON.stringify(requestBody, null, 4));
    return requestBody;
}

function consoleLog(body, err, response) {
    console.log('\n Body:       \n' + JSON.stringify(body, null, 4));
    console.log('\n Error:      \n' + err);
    console.log('\n Response:   \n' + JSON.stringify(response, null, 4));
}