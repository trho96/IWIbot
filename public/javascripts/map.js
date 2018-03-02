
var map;

var exports = module.exports = {};

exports.initMap = function initMap() {
    map = L.map('map').setView([51.505, -0.09], 13);
        var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var osmAttrib='Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
        var osm = new L.TileLayer(osmUrl, {minZoom: 8, maxZoom: 12, attribution: osmAttrib});		
        map.addLayer(osm);   
}

exports.showMap = function showMap() {
    $('.mapcontainer').css('display', 'block');
    $('.chatcontainer').css('max-height', 'calc(70vw - 250px');

    map.invalidateSize();
}

exports.hideMap = function hideMap() {
    $('.mapcontainer').css('display', 'none');
    $('.chatcontainer').css('max-height', 'calc(100vw - 250px');
}

exports.addMarker = function addMarker(lat, lng) {
    var marker = L.marker([lat, lng]).addTo(map);
    return marker;
}

exports.removeMarker = function removeMarker(marker) {
    map.removeLayer(marker);
}

exports.addPolyline = function addPolyline(waypoints) {
    var polyline = L.polyline(waypoints, {color: 'blue'}).addTo(map);
    return polyline;
}

exports.setFocus = function setFocus(latlng) {
    map.panTo(latlng)
}

exports.fitBounds = function fitBounds(bounds) {
    map.fitBounds(bounds);
}
