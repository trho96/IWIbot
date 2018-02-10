var request = require('request');
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1;
var yyyy = today.getFullYear();

var entity;

function main(params) {
    console.log("------Navigation Action started!------");
    console.log("Navigation Params:" + JSON.stringify(params));

    return new Promise(function (resolve, reject) {

        /*if ('entities' in params && params.entities.length !== 0) {
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
		
	var result;
	if ("geolocation" in navigator) {
		result = navigateToWaypoint('entrance_e');
	} else {
		result = ['Please allow access to your position data to use the navigation service.'];
	}
		
	var navigationResponse = {};

	navigationResponse.payload = result[0];
	navigationResponse.voice = voice;
	*/
	resolve('a');//navigationResponse);
	});
}

exports.main = main;
