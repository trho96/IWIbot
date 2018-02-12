var request = require('request');
var navi = require('../navi/navigator');

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
		
	result = navi.iwiNavigator.getNavigationPath(params.position, entity);
		
	var navigationResponse = {};

	    
	navigationResponse.payload = result.join(',');
        navigationResponse.voice = voice;
	resolve(navigationResponse);
	});
}

exports.main = main;
