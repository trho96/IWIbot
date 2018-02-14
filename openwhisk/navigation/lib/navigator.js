
var fs = require('fs');
var graphImport = require('./graph');
var GraphConstr = graphImport.graphConstr;
var map = {};
var coordinateMap = {}
var iwiNavigator = {};

iwiNavigator.readCoordinateFile = function()	{
    var allText = fs.readFileSync(__dirname + "/coordinates.txt").toString();
    allText = allText.replace(/\s/g,'');
    	var wayPoints = allText.split(';');
        if(wayPoints.length > 0 && wayPoints[wayPoints.length-1] === '')	{
		wayPoints.splice(wayPoints.length - 1, 1);
	}
	for(var i=0; i<wayPoints.length; i++)	{
		var point = wayPoints[i].split(':');
		map[point[1]] = {};
		var coordinates = point[0].split(',');
		coordinateMap[point[1]] = {
			latitude: coordinates[0], 
			longitude: coordinates[1]
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
	graph = new GraphConstr(map);
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
	iwiNavigator.readCoordinateFile();
	cords = {
		latitude: 49.014976, 
		longitude: 8.389863
	};
	var path = graph.findShortestPath(iwiNavigator.getNearestWaypoint(coords), target);
	var returner = [];
	for(var i=0; i<path.length; i++)	{
		returner.push({
			latitude: iwiNavigator.getDistance(getNearestWaypoint(coordinateMap['crossroad_e']), ')//coordinateMap[path[i]].latitude,
			longitude: iwiNavigator.getDistance(getNearestWaypoint(coordinateMap['crossroad_cafe_north']),//coordinateMap[path[i]].longitude,
			name: path[i]
		});
	}
	return returner;
}

exports.iwiNavigator = iwiNavigator;
