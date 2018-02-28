var chat = require("./chat.js");

var exports = module.exports = {};
var locationWatcher = null;
var locationEvents;

exports.setEvents = function (events) {
    locationEvents = events;
    console.log(locationEvents);
    if (!locationWatcher) {
        exports.toggleLocationEvents();
    }
} 

exports.toggleLocationEvents = function() {
    locationEventsActive = !locationEventsActive;
    if (locationWatcher) {
        locationWatcher = navigator.geolocation.watchPosition((position) => {
            this.onNewPosition({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        });
    } else {
        navigator.geolocation.clearWatch(locationWatcher);
        locationWatcher = null;
    }
}


onNewPosition = function(position) {
    console.log(position);
    for (var event of locationEvents) {
        if (this.checkIfInRange(position.latitude, event.coordinates.lat1, event.coordinates.lat2) &&
         this.checkIfInRange(position.longitude, event.coordinates.lng1, event.coordinates.lng2)) {
          console.log('Detected Geofence Trigger');
        }
    }
  }

  checkIfInRange = function(number, range1, range2) {
    const min = Math.min.apply(Math, [range1, range2]);
    const max = Math.max.apply(Math, [range1, range2]);
  return number > min && number < max;
  }