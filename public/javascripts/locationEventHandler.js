var chat = require("./chat.js");

var exports = module.exports = {};
var locationWatcher = false;
var locationEvents = [];
var currentNavigationWaypoints = [];
var currentNavigationDestination = "None";

//Set a new navigationPath
exports.setNewNavigation = function setNewNavigation(navigation) {
    console.log("Setting new navigationWaypoints to " + JSON.parse(navigation).navigationDestination + "!")
    chat.appendReceivedMessage("Laufe nach " + JSON.parse(navigation).waypoints[0].name + "!");
    currentNavigationWaypoints = JSON.parse(navigation).waypoints;
    currentNavigationDestination = JSON.parse(navigation).navigationDestination;
    console.log(currentNavigationWaypoints);
    if (!locationWatcher) {
        toggleLocationEvents();
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
              toggleLocationEvents();
          } else {
              //Sonst: Gebe Richtung zum nächsten Wegpunkt an
              chat.appendReceivedMessage("Laufe nach " + currentNavigationWaypoints[i+1].name + "!");
              currentNavigationWaypoints = currentNavigationWaypoints.slice(i + 1);              
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
    console.log((number > min) && (number < max));
  return (number > min) && (number < max);
  };