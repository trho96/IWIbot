var request = require('request');
var navi = require('./navigator');

var navigationResponse = {};
var voice = "en-US_MichaelVoice";
var entity;

function main(params) {
    console.log("------Navigation Action started!------");
    console.log("Navigation Params:" + JSON.stringify(params));

    return new Promise(function (resolve, reject) {

        if ('entities' in params && params.entities.length !== 0) {
            console.log("Entity found in Params");
            entity = params.entities[0].value;
        } else {
            console.log("No Entity in Params!");
            entity = "-1";
        }

        switch (entity) {
            case 'building E':
                entity = 'entrance_e';
                break;
	case 'building F':
                entity = 'entrance_f';
                break;
            case 'building G':
                entity = 'entrance_g';
                break;
        }
		
	var result = navi.iwiNavigator.getNavigationPath(params.position, entity);
		
	var parsedResult = '';
	for(var i=0; i<result.length; i++)	{
		parsedResult = parsedResult + 'step:' + (i+1) + ',name:' + result[i].name + ',longitude:' + result[i].longitude'  + ',latitude:' + result[i].latitude + ';';
	}

	var navigationResponse = {};    
        navigationResponse.payload = parsedResult;
	navigationResponse.voice = voice;
	resolve(navigationResponse);
	});
} 

exports.main = main;
