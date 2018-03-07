var chat = require("./chat.js");
var map = require("./map.js");

var exports = module.exports = {};
var locationWatcher = false;
var locationEvents = [];
var currentNavigationWaypoints = [];
var currentNavigationDestination = "None";
var destinationMarker;
var navigationPolyline;
var currentPositionPolyline;

//latitude = X; longitude = Y
/**
 * Methode zur Bestimmung des Abbiegewinkels aus drei Punkten c0,c1 und c2. Der berechnete Winkel gibt an um wie viel Grad der
 * neue Weg c1->c2 vom bisherigen Weg c0->c1 abweicht. Beispiel: Der Algorithmus berechnet 10Grad. Das bedeutet dann das der Navigierte,
  der aus Richtung c0 kommt, am Punkt c1 um 10 Grad nach rechts/lnks laufen muss um in Richtung von c2 zu laufen.
  Aus dem Winkel wird zudem berechnet, ob derjenige nun geradeaus, nach links oder nach rechts laufen muss.
 */
var getDirectionOrder = function(c0, c1, c2)	{
	//Koeffizienten fuer die Geraden c0_c1 und c1_c2
    var a1 = ((c1.longitude-c0.longitude)/(c1.latitude-c0.latitude)),
        b1 = (c0.longitude-(a1*c0.latitude)),
        a2 = ((c2.longitude-c1.longitude)/(c2.latitude-c1.latitude)),
        b2 = (c1.longitude-(a2*c1.latitude));
    
	// Hilfsfunktion um das x des Schnittpunktes zweier Funktionen mit den Koeffizienten a&b und b&c zu berechnen. 
	var crossing = function(a,b,c,d)	{
		return (d-b)/(a-c);
	}
	
	// Hilfsfunktion zur Abstandsberechnung zwischen zwei Punkten.
	var distance = function(p1,p2)	{
		return Math.sqrt((p2.latitude-p1.latitude)*(p2.latitude-p1.latitude)+(p2.longitude-p1.longitude)*(p2.longitude-p1.longitude));
	}
	
	var graphC0_C1 = function(x)	{
		return a1*x+b1;
	}
	var graphC1_C2 = function(x)	{
		return a2*x+b2
	}
	
	// Koefizienten der Normalen-Geraden von c0_c1. Schneidet c0_c1 garantiert an einem hoeheren x-Wert als es c1_c2 tut. 
	var	aN = -(1/a1),
		bN = c1.longitude - (c1.latitude*aN)+((Math.sign(a1)));
	
	var graphNormal = function(x)	{
		return aN*x+bN;
	}
	
	
	// Berechnet den Schnittpunkt der Normalen-Geraden mit c0_c1.
	var result1 = crossing(a1,b1,aN,bN);
	var cN1 = {
		latitude: result1,
		longitude: graphC0_C1(result1)
	};
	
	// Berechnet den Schnittpunkt der Normalen-Geraden mit c1_c2.
	var result2 = crossing(a2,b2,aN,bN);
	var cN2	= {
		latitude: result2,
		longitude: graphC1_C2(result2)
	};
	
	/*Berechnet ein gleichschenkliges Dreieck aus c0_c1, c1_c2 und Normalen mit den Ecken c1, cN1 und cN2. 
	  Berechnet den Winkel an c1 (= der Endergebniswinkel).*/
	var hypothenuse = distance(c1,cN2),
		nebenKatete = distance(c1,cN1),
		gegenKatete = distance(cN1,cN2);
		degree = Math.asin(gegenKatete/hypothenuse) * 180/Math.PI;

	var c0_c1_y = graphC0_C1(cN1.latitude),
	    c1_c2_y = graphC1_C2(cN1.latitude);
	
	/* Fallunterscheidung ob der Weg nach links, rechts oder geradeaus geht. Momentan wird wird links/rechts ausgegeben
	wenn der Winkel mehr als 10 Grad ist.*/
	if(degree > 10 && c0_c1_y > c1_c2_y)	{
		return 'rechts '; 
	}
	else if(degree > 10 && c0_c1_y < c1_c2_y)	{
		return 'links ';
	}
	else{
		return 'geradeaus ';
	}
};

//Set a new navigationPath
exports.setNewNavigation = function setNewNavigation(navigation) {
    //Remove old markers from map if navigation was already active before
    if (destinationMarker) {
        map.removeMarker(destinationMarker);
        map.removeMarker(navigationPolyline);
        map.removeMarker(currentPositionPolyline);
    }
    console.log("Setting new navigationWaypoints to " + JSON.parse(navigation).navigationDestination + "!")
    chat.appendReceivedMessage("Gehe " + JSON.parse(navigation).waypoints[0].name.replace(/_/g,' ') + ".");
    currentNavigationWaypoints = JSON.parse(navigation).waypoints;
    currentNavigationDestination = JSON.parse(navigation).navigationDestination;
    console.log(currentNavigationWaypoints);
    if (!locationWatcher) {
        toggleLocationEvents();
        map.showMap();     
        destinationMarker = map.addMarker(currentNavigationWaypoints[currentNavigationWaypoints.length - 1].latitude,
            currentNavigationWaypoints[currentNavigationWaypoints.length - 1].longitude);

        var polylineLatLngs = [];
        for (var i = 1; i < currentNavigationWaypoints.length; i++) {
            polylineLatLngs.push([currentNavigationWaypoints[i].latitude, currentNavigationWaypoints[i].longitude]);
        }
        navigationPolyline = map.addPolyline(polylineLatLngs);
        map.fitBounds(navigationPolyline.getBounds());
    }
}; 

//Add LocationEvents to the LocationEvents-List
exports.addLocationEvents = function addLocationEvents(events) {
    console.log("Setting new locationEvents!")
    locationEvents = locationEvents.push().apply(locationEvents, events)
    if (!locationWatcher) {
        toggleLocationEvents();
    }
}; 

//Toggle the use of location for navigation and events
function toggleLocationEvents() {
    if (!locationWatcher) {
        //Since watchPosition does not work properly, getCurrentPosition and setInterval will be used until fixed
        /*
        locationWatcher = navigator.geolocation.watchPosition(function(position) {
            onNewPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
        */
        locationWatcher = setInterval(function () {navigator.geolocation.getCurrentPosition(function(position) {
            onNewPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        })}, 1000);
    } else {
        clearInterval(locationWatcher);
        locationWatcher = false;
    }
};

//Is called when the client reaches a new position
function onNewPosition(position) {
    //Check Navigation
    for (var i = 0; i < currentNavigationWaypoints.length; i++) {
        //About 7m in each direction
        if (checkIfInRange(position.latitude, parseFloat(currentNavigationWaypoints[i].latitude) - 0.0001, parseFloat(currentNavigationWaypoints[i].latitude) + 0.0001) &&
         (checkIfInRange(position.longitude, parseFloat(currentNavigationWaypoints[i].longitude) - 0.0001, parseFloat(currentNavigationWaypoints[i].longitude) + 0.0001))) {
          if (i == currentNavigationWaypoints.length - 1) {
              //Wenn letzter Wegpunkt: Navigation beenden
              chat.appendReceivedMessage("Du bist an deinem Ziel " + currentNavigationDestination + " angekommen!")
              currentNavigationWaypoints = [];
              currentNavigationDestination = "None";
              map.removeMarker(destinationMarker);
              map.removeMarker(navigationPolyline);
              map.removeMarker(currentPositionPolyline);
              toggleLocationEvents();
              map.hideMap();
          } else {
              //Sonst: Gebe Richtung zum nächsten Wegpunkt an, aktualisiere Polylines
              chat.appendReceivedMessage("Gehe " + getDirectionOrder(position, currentNavigationWaypoints[i], currentNavigationWaypoints[i+1]) + currentNavigationWaypoints[i+1].name.replace(/_/g,' ') + ".");
              var polylineLatLngs = [];
              polylineLatLngs.push([currentNavigationWaypoints[i].latitude, currentNavigationWaypoints[i].longitude]);
              currentNavigationWaypoints = currentNavigationWaypoints.slice(i + 1);
              map.removeMarker(navigationPolyline);
              map.removeMarker(currentPositionPolyline);
              for (var j = 1; j < currentNavigationWaypoints.length; j++) {
                polylineLatLngs.push([currentNavigationWaypoints[j].latitude, currentNavigationWaypoints[j].longitude]);
              }
              navigationPolyline = map.addPolyline(polylineLatLngs);      
              currentPositionPolyline = map.addPolyline([[position.latitude, position.longitude], [currentNavigationWaypoints[0].latitude, currentNavigationWaypoints[0].longitude]]);       
            }
         
        }
    }
    //Check other Events
    //TODO
  };

  //Helper function to calculate if a number is between two other numbers
function checkIfInRange(number, range1, range2) {
    var min = Math.min.apply(Math, [range1, range2]);
    var max = Math.max.apply(Math, [range1, range2]);
  return (number > min) && (number < max);
  };
