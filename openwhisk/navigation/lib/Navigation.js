var request = require('request');
var navi = require('./navigator');

var navigationResponse = {};
var voice = "en-US_MichaelVoice";
var entity;

function main(params) {
    console.log("------Navigation Action started!------");
    console.log("Navigation Params:" + JSON.stringify(params));

    return new Promise(function (resolve, reject) {

	   // Ueberprueft auf notwendige Parameter
        if ('entities' in params && params.entities.length !== 0) {
            console.log("Entity found in Params");
            entity = params.entities[0].value;
        } else {
            console.log("No Entity in Params!");
            entity = "-1";
        }

	// Sucht fuer die Rueckgabe des Communications-Service den passenden Namen im Dijkstra    
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
	
	// Berechne Navigation
	var result = navi.iwiNavigator.getNavigationPath(params.position, entity);
		
	// Ergebis-Array zu String umwandeln
	var parsedResult = JSON.stringify({"waypoints": result, "navigationDestination": entity});
    /*
    for(var i=0; i<result.length; i++)	{
		parsedResult = parsedResult + 'step:' + (i+1) + ',name:' + result[i].name + ',longitude:' + result[i].longitude  + ',latitude:' + result[i].latitude + ';';
	}
	*/
	var navigationResponse = {};    
    //Schreiben des Ergebnisses in den navigationData Parameter. Der Client kann diesen auslesen und weiterverwerten.
    navigationResponse.payload = "Navigation nach " + entity + " gestartet!";
    navigationResponse.navigationData = parsedResult;
	navigationResponse.voice = voice;
	resolve(navigationResponse);
	});
} 

exports.main = main;
