/**
	Changes:
	ALLES
*/


/*
Ueberpruefung auf Kurvenart:

1.  nehmen.
2. Gerade durch erreichten und naechste Punkte definieren
3. Bei jeder Geraden Lage zur Grundgeraden ueberpruefen
4. Winkel < +-10°: Gerade Strecke
5. Winkel <10°: Linkekurve
6. Winlel >10°: Rechtskurve

Generelle Gedanken:
- Navigation ist rein Frontend
- Speicherung der Wegpunkte in IBM-Cloud, Frontend oder API
- Speicherung Events in IBM-Cloud oder API (Frontend möglich, aber sehr umstaendlich)
- Anfrage: "Navigiere mich" -> "Wohin willst du navigiert werden?" -> "Zum R-Gebaeude"

Graph (x1,y1).(x2,y2) = (y2-y1/x2-x1)x - (y1-((y2-y1/x2-x1)*x1))

*/


var map = {};
var coordinateMap = {}
var iwiNavigator = {};

iwiNavigator.readCoordinateFile = function()	{
    var file = "coordinates.txt";
	var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()	{
        if(rawFile.readyState === 4)	{
            if(rawFile.status === 200 || rawFile.status == 0)	{
                var allText = rawFile.responseText.replace(/\s/g,'');
				var wayPoints = allText.split(';');
				if(wayPoints[wayPoints.length-1] === '')	{
					wayPoints.splice(wayPoints.length - 1, 1);
				}
				for(var i=0; i<wayPoints.length; i++)	{
					var point = wayPoints[i].split(':');
					map[point[1]] = {};
					var coordinates = point[0].split(',');
					coordinateMap[point[1]] = {
						longitude: coordinates[0], 
						latitude: coordinates[1]
					};
					var neighbours = point[2].split(',');
					for(var j = 0; j < neighbours.length; j++)	{
						map[point[1]][neighbours[j]] = -1;
					}
				}
				for(point in map)	{
					var neighbours = Object.keys(map[point]);
					for(var i=0; i < neighbours.length; i++)	{
						if(map[point][neighbours[i]] === -1 || map[neighbours[i]][point] === -1)	{
							var distance = getDistance(coordinateMap[point], coordinateMap[neighbours[i]]);
							map[point][neighbours[i]] = distance;
							map[neighbours[i]][point] = distance;
						}
					}
				}
				
				graph = new Graph(map);
			}
        }
    }
    rawFile.send(null);
}

iwiNavigator.readCoordinateFile();

iwiNavigator.getDistance = function(p1,p2){
	return Math.sqrt(Math.abs(p1.longitude - p2.longitude) + Math.abs(p1.latitude - p2.latitude));
}

iwiNavigator.getNearestWaypoint = function(position)	{
	var smallestDistance = null;
	var nearestWaypoint = null;
	for(point in map)	{
		var distance = iwiNavigator.getDistance(coordinateMap[point], position);
		if(smallestDistance === null || distance < smallestDistance)	{
			smallestDistance = distance;
			nearestWaypoint = point;
		}			
	}
	return nearestWaypoint;
}

iwiNavigator.reachedWaypoint = function(position, wayPoint, threshold)	{
	return iwiNavigator.getDistance(wayPoint, position) < threshold;
}

/*iwiNavigator.navigateToWaypoint = function(target)	{
	var passedWaypoints = 0;
	var watchID = navigator.geolocation.watchPosition(function(position) {
		
		if(typeof start === 'undefined')	{
			var start = iwiNavigator.getNearestWaypoint(position.coords);
		}
		if(typeof path === 'undefined' && typeof start !== 'undefined'){
			var path = graph.findShortestPath(start, target);
			var currentTarget = path[0];
		}
		if(path === null)	{
			alert('ERROR: Destination is unreachable');
		}
		else{
			console.log(path);
			if(iwiNavigator.reachedWaypoint(position.coords, coordinateMap[path[passedWaypoints]], 0.2))	{
				passedWaypoints++;
				if(passedWaypoints >= path.length)	{
					alert('You have reached your destination');
					navigator.geolocation.clearWatch(watchID);
				}
				else	{
					//Pass navigation instructions
				}
			}
		}
	},function(){},
	{
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0,
		accuracy: 1,
		distanceFilter: 1
	});
}*/
	
iwiNavigator.getNavigationPath = function(coords, target)	{
	return graph.findShortestPath(iwiNavigator.getNearestWaypoint(coords), target);
}
