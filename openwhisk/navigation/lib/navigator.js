
var fs = require('fs');
var map = {};
var coordinateMap = {}
var iwiNavigator = {};

iwiNavigator.readCoordinateFile = function()	{
    var file = "./coordinates.txt";
    var rawFile = new XMLHttpRequest();
    return fs.readFileSync('file.txt').toString();
	/*return new Promise(function(resolve, reject)	{
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
								var distance = iwiNavigator.getDistance(coordinateMap[point], coordinateMap[neighbours[i]]);
								map[point][neighbours[i]] = distance;
								map[neighbours[i]][point] = distance;
							}
						}
					}
					graph = new Graph(map);
			    		resolve(graph);
				}
		}
		resolve(true);
	    }
	    rawFile.send(null);
		resolve(true);
	});*/
}

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
	
iwiNavigator.getNavigationPath = function(coords, target)	{
	iwiNavigator.readCoordinateFile()
	.then(function()	{
		//return graph.findShortestPath(iwiNavigator.getNearestWaypoint(coords), target);
	});
	var t = ['a','b','c'];
	return t;
	
}

exports.iwiNavigator = iwiNavigator;
