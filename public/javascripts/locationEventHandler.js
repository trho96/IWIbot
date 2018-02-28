var chat = require("./chat.js");

var exports = module.exports = {};
var locationWatcher = null;
var locationEvents = [];
var currentNavigationWaypoints = [];
var currentNavigationDestination = "None";


exports.setNewNavigation = function setNewNavigation(navigation) {
    console.log("Setting new locationEvents!")
    console.log(JSON.stringify(navigation));
    currentNavigationWaypoints = navigation.waypoints;
    currentNavigationDestination = navigation.navigationDestination;
    console.log(currentNavigationWaypoints);
    if (!locationWatcher) {
        exports.toggleLocationEvents();
    }
}; 

exports.addLocationEvents = function addLocationEvents(events) {
    console.log("Setting new locationEvents!")
    locationEvents = locationEvents.push().apply(locationEvents, events)
    if (!locationWatcher) {
        exports.toggleLocationEvents();
    }
}; 

exports.toggleLocationEvents = function toggleLocationEvents() {
    if (locationWatcher) {
        locationWatcher = navigator.geolocation.watchPosition(function(position) {
            onNewPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    } else {
        navigator.geolocation.clearWatch(locationWatcher);
        locationWatcher = null;
    }
};

function onNewPosition(position) {
    console.log(position);
    //Check Navigation
    for (var i = 0; i < events.currentNavigationWaypoints.length; i++) {
        //About 7m in each direction
        if (checkIfInRange(position.latitude, events[i].latitude - 0.0001, events[i].latitude + 0.0001) &&
         checkIfInRange(position.longitude, events[i].longitude - 0.0001, events[i].longitude + 0.0001)) {
          console.log("Detected Geofence Trigger");
          if (i = currentNavigationWaypoints.length - 1) {
              //Navigation beenden
              chat.appendReceivedMessage("Du bist an deinem Ziel " + currentNavigationDestination + " angekommen!")
              currentNavigationWaypoints = [];
              currentNavigationDestination = "None";
          } else {
              //Gebe nächsten Wegpunkt an
              chat.appendReceivedMessage("Laufe nach " + currentNavigationWaypoints[i+1].name + "!")
          }
         
        }
    }
    //Check other Events
    //TODO
  };

function checkIfInRange(number, range1, range2) {
    var min = Math.min.apply(Math, [range1, range2]);
    var max = Math.max.apply(Math, [range1, range2]);
  return (number > min) && (number < max);
  };