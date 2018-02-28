var exports = module.exports = {};
var locationWatcher = null;
var locationEvents = [];

exports.setEvents = function setEvents(events) {
    console.log("Setting new locationEvents!")
    locationEvents = locationEvents.concat(events);
    console.log(locationEvents);
    if (!locationWatcher) {
        exports.toggleLocationEvents();
    }
}; 

exports.toggleLocationEvents = function toggleLocationEvents() {
    locationEventsActive = !locationEventsActive;
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
    for (var i=0; i<events.length; i++) {
        //About 7m in each direction
        if (this.checkIfInRange(position.latitude, events[i].latitude - 0.0001, events[i].latitude + 0.0001) &&
         this.checkIfInRange(position.longitude, events[i].longitude - 0.0001, events[i].longitude + 0.0001)) {
          console.log("Detected Geofence Trigger");
        }
    }
  };

function checkIfInRange(number, range1, range2) {
    var min = Math.min.apply(Math, [range1, range2]);
    var max = Math.max.apply(Math, [range1, range2]);
  return (number > min) && (number < max);
  };