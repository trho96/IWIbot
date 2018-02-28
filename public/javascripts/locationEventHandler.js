var chat = require("./chat.js");

var exports = module.exports = {};
var locationWatcher = null;
var locationEvents = [];

exports.setEvents = function (events) {
    console.log("Setting new locationEvents!")
    locationEvents.concat(events);
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
        //About 7m in each direction
        if (this.checkIfInRange(position.latitude, event.latitude - 0.0001, event.latitude + 0.0001) &&
         this.checkIfInRange(position.longitude, event.longitude - 0.0001, event.longitude + 0.0001)) {
          console.log('Detected Geofence Trigger');
        }
    }
  }

  checkIfInRange = function(number, range1, range2) {
    const min = Math.min.apply(Math, [range1, range2]);
    const max = Math.max.apply(Math, [range1, range2]);
  return number > min && number < max;
  }